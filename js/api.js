// =========================================================
// AI TRAP LAB
// GOOGLE APPS SCRIPT API CONNECTOR
//
// File ini TIDAK mengganti app.js.
// File ini hanya menghubungkan frontend dengan database.
//
// LOAD ORDER:
// missions.js
// app.js
// api.js
// =========================================================


// =========================================================
// 1. API CONFIGURATION
// =========================================================

// GANTI dengan URL Web App Apps Script milikmu.
// WAJIB URL yang berakhiran /exec.
//
// CONTOH:
// https://script.google.com/macros/s/AKfycbxxxxxxxx/exec

const AITRAP_API_URL =
  "https://script.google.com/macros/s/AKfycbzJBA1wgvKLPnyZo9fXD1GyapEoefgrdZcfuOMlF9D_SCy8hq_0mAVHAuEHhS9yaepJ/exec";


const AITRAP_API_ENABLED =
  AITRAP_API_URL.startsWith(
    "https://script.google.com/macros/s/"
  ) &&
  AITRAP_API_URL.endsWith(
    "/exec"
  );


// =========================================================
// 2. API STATUS
// =========================================================

function aitrapAPIConfigured() {

  if (!AITRAP_API_ENABLED) {

    console.warn(
      "AI TRAP LAB API belum dikonfigurasi. Paste URL /exec pada api.js."
    );

    return false;
  }

  return true;
}


// =========================================================
// 3. SEND DATA
// =========================================================
//
// mode:no-cors digunakan agar request dari website
// statis / hosting berbeda domain tetap bisa dikirim
// ke Google Apps Script tanpa preflight CORS.
//
// Respons server tidak dapat dibaca di mode ini,
// sehingga Google Sheets menjadi sumber verifikasi utama.
// =========================================================

async function aitrapSend(
  action,
  data = {}
) {

  if (!aitrapAPIConfigured()) {

    return false;
  }


  let participant = {
    code: "",
    className: ""
  };


  try {

    if (
      typeof getParticipant ===
      "function"
    ) {

      participant =
        getParticipant();
    }

  }

  catch (error) {

    console.warn(
      "Participant helper unavailable:",
      error
    );
  }


  const payload = {

    action:
      action,

    participantCode:
      data.participantCode ||
      participant.code ||
      "",

    className:
      data.className ||
      participant.className ||
      "",

    ...data,

    clientTimestamp:
      new Date().toISOString(),

    clientVersion:
      "AI-TRAP-LAB-2026"

  };


  if (
    !payload.participantCode ||
    !payload.className
  ) {

    console.warn(
      "API request dibatalkan karena ParticipantCode/Class belum tersedia.",
      action
    );

    return false;
  }


  try {

    await fetch(
      AITRAP_API_URL,
      {

        method:
          "POST",

        mode:
          "no-cors",

        cache:
          "no-store",

        redirect:
          "follow",

        keepalive:
          true,

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },

        body:
          JSON.stringify(
            payload
          )

      }
    );


    console.log(
      `AI TRAP LAB API → ${action} dikirim.`,
      payload
    );


    return true;

  }

  catch (error) {

    console.error(
      `AI TRAP LAB API ERROR → ${action}`,
      error
    );


    saveFailedAPIRequest(
      payload
    );


    return false;
  }
}


// =========================================================
// 4. FAILED REQUEST BACKUP
// =========================================================

function saveFailedAPIRequest(
  payload
) {

  try {

    const key =
      "aitrap_api_failed_queue";


    const current =
      JSON.parse(
        localStorage.getItem(
          key
        ) || "[]"
      );


    current.push({
      payload:
        payload,

      failedAt:
        new Date().toISOString()
    });


    localStorage.setItem(
      key,
      JSON.stringify(
        current
      )
    );

  }

  catch (error) {

    console.error(
      "Tidak dapat menyimpan failed queue.",
      error
    );
  }
}


// =========================================================
// 5. SYNC FLAG
// =========================================================

function getSyncFlagKey(
  type,
  code
) {

  return (
    "aitrap_api_synced_" +
    type +
    "_" +
    code
  );
}


function isAlreadySynced(
  type,
  code
) {

  return (
    localStorage.getItem(
      getSyncFlagKey(
        type,
        code
      )
    ) ===
    "1"
  );
}


function markAsSynced(
  type,
  code
) {

  localStorage.setItem(
    getSyncFlagKey(
      type,
      code
    ),
    "1"
  );
}


// =========================================================
// 6. SAFE JSON READ
// =========================================================

function readLocalJSON(
  key
) {

  try {

    const raw =
      localStorage.getItem(
        key
      );


    if (!raw) {

      return null;
    }


    return JSON.parse(
      raw
    );

  }

  catch (error) {

    console.error(
      "Gagal membaca LocalStorage:",
      key,
      error
    );


    return null;
  }
}


// =========================================================
// 7. REGISTER PARTICIPANT
// =========================================================

async function syncParticipant() {

  const participant =
    getParticipant();


  if (
    !participant.code ||
    !participant.className
  ) {

    return;
  }


  await aitrapSend(
    "REGISTER_PARTICIPANT",
    {

      participantCode:
        participant.code,

      className:
        participant.className

    }
  );
}


// =========================================================
// 8. PRETEST SYNC
// =========================================================

async function syncPretest() {

  const participant =
    getParticipant();


  if (!participant.code) {

    return;
  }


  if (
    isAlreadySynced(
      "pretest",
      participant.code
    )
  ) {

    return;
  }


  const key =
    "aitrap_pretest_" +
    participant.code;


  const record =
    readLocalJSON(
      key
    );


  if (
    !record ||
    record.completed !== true
  ) {

    return;
  }


  const sent =
    await aitrapSend(
      "PRETEST_CT",
      {

        participantCode:
          participant.code,

        className:
          participant.className,

        rawScore:
          record.rawScore,

        maxScore:
          record.maxScore,

        score100:
          record.score100,

        indicators:
          record.indicators ||
          {},

        responses:
          record.responses ||
          [],

        itemResults:
          record.itemResults ||
          [],

        startedAt:
          record.startedAt ||
          "",

        submittedAt:
          record.submittedAt ||
          ""

      }
    );


  if (sent) {

    markAsSynced(
      "pretest",
      participant.code
    );
  }
}


// =========================================================
// 9. MISSION ATTEMPT SYNC
// =========================================================

async function syncMissionAttempt(
  totalScore
) {

  if (
    typeof currentMissionId ===
    "undefined" ||
    !currentMissionId
  ) {

    return;
  }


  const participant =
    getParticipant();


  const mission =
    getMissionById(
      currentMissionId
    );


  if (!mission) {

    console.warn(
      "Mission tidak ditemukan saat sync."
    );

    return;
  }


  await aitrapSend(
    "MISSION_ATTEMPT",
    {

      participantCode:
        participant.code,

      className:
        participant.className,

      missionId:
        Number(
          currentMissionId
        ),

      level:
        Number(
          mission.level
        ),

      trapType:
        mission.trapType ||
        "",

      answers:
        JSON.parse(
          JSON.stringify(
            answers
          )
        ),

      gamificationScores:
        JSON.parse(
          JSON.stringify(
            scores
          )
        ),

      gamificationTotal:
        Number(
          totalScore
        )

    }
  );
}


// =========================================================
// 10. POSTTEST SYNC
// =========================================================

async function syncPosttest() {

  const participant =
    getParticipant();


  if (!participant.code) {

    return;
  }


  if (
    isAlreadySynced(
      "posttest",
      participant.code
    )
  ) {

    return;
  }


  const key =
    "aitrap_posttest_" +
    participant.code;


  const record =
    readLocalJSON(
      key
    );


  if (
    !record ||
    record.completed !== true
  ) {

    return;
  }


  const sent =
    await aitrapSend(
      "POSTTEST_CT",
      {

        participantCode:
          participant.code,

        className:
          participant.className,

        rawScore:
          record.rawScore,

        maxScore:
          record.maxScore,

        score100:
          record.score100,

        indicators:
          record.indicators ||
          {},

        responses:
          record.responses ||
          [],

        itemResults:
          record.itemResults ||
          [],

        comparison:
          record.comparison ||
          {},

        startedAt:
          record.startedAt ||
          "",

        submittedAt:
          record.submittedAt ||
          ""

      }
    );


  if (sent) {

    markAsSynced(
      "posttest",
      participant.code
    );
  }
}


// =========================================================
// 11. CAL SYNC
// =========================================================

async function syncCAL() {

  const participant =
    getParticipant();


  if (!participant.code) {

    return;
  }


  if (
    isAlreadySynced(
      "cal",
      participant.code
    )
  ) {

    return;
  }


  const key =
    "aitrap_cal_" +
    participant.code;


  const record =
    readLocalJSON(
      key
    );


  if (
    !record ||
    record.completed !== true
  ) {

    return;
  }


  const sent =
    await aitrapSend(
      "CAL_ASSESSMENT",
      {

        participantCode:
          participant.code,

        className:
          participant.className,

        rawScore:
          record.rawScore,

        maxScore:
          record.maxScore,

        score100:
          record.score100,

        indicators:
          record.indicators ||
          {},

        responses:
          record.responses ||
          [],

        itemResults:
          record.itemResults ||
          [],

        startedAt:
          record.startedAt ||
          "",

        submittedAt:
          record.submittedAt ||
          ""

      }
    );


  if (sent) {

    markAsSynced(
      "cal",
      participant.code
    );
  }
}


// =========================================================
// 12. STUDENT RESPONSE SYNC
// =========================================================

async function syncStudentResponse() {

  const participant =
    getParticipant();


  if (!participant.code) {

    return;
  }


  if (
    isAlreadySynced(
      "response",
      participant.code
    )
  ) {

    return;
  }


  const key =
    "aitrap_student_response_" +
    participant.code;


  const record =
    readLocalJSON(
      key
    );


  if (
    !record ||
    record.completed !== true
  ) {

    return;
  }


  const sent =
    await aitrapSend(
      "STUDENT_RESPONSE",
      {

        participantCode:
          participant.code,

        className:
          participant.className,

        responses:
          record.responses ||
          [],

        reflection:
          record.reflection ||
          {},

        summary:
          record.summary ||
          {},

        startedAt:
          record.startedAt ||
          "",

        submittedAt:
          record.submittedAt ||
          ""

      }
    );


  if (sent) {

    markAsSynced(
      "response",
      participant.code
    );
  }
}


// =========================================================
// 13. PROGRAM COMPLETE
// =========================================================

async function syncProgramComplete() {

  const participant =
    getParticipant();


  if (!participant.code) {

    return;
  }


  if (
    isAlreadySynced(
      "complete",
      participant.code
    )
  ) {

    return;
  }


  if (
    typeof hasCompletedPretest ===
      "function" &&
    !hasCompletedPretest()
  ) {

    return;
  }


  if (
    typeof allMissionsCompleted ===
      "function" &&
    !allMissionsCompleted()
  ) {

    return;
  }


  if (
    typeof hasCompletedPosttest ===
      "function" &&
    !hasCompletedPosttest()
  ) {

    return;
  }


  if (
    typeof hasCompletedCAL ===
      "function" &&
    !hasCompletedCAL()
  ) {

    return;
  }


  if (
    typeof hasCompletedStudentResponse ===
      "function" &&
    !hasCompletedStudentResponse()
  ) {

    return;
  }


  const sent =
    await aitrapSend(
      "PROGRAM_COMPLETE",
      {

        participantCode:
          participant.code,

        className:
          participant.className

      }
    );


  if (sent) {

    markAsSynced(
      "complete",
      participant.code
    );
  }
}


// =========================================================
// 14. WRAP EXISTING APP FUNCTIONS
// =========================================================
//
// Teknik ini mempertahankan app.js lama.
// Fungsi asli dijalankan dahulu,
// kemudian data dikirim ke API.
// =========================================================


// ---------------------------------------------------------
// SUBMIT IDENTITY
// ---------------------------------------------------------

if (
  typeof window.submitIdentity ===
  "function"
) {

  const originalSubmitIdentity =
    window.submitIdentity;


  window.submitIdentity =
    function(...args) {

      const codeInput =
        document.getElementById(
          "studentCode"
        );


      const classInput =
        document.getElementById(
          "studentClass"
        );


      const enteredCode =
        codeInput
          ? codeInput.value
              .trim()
              .toUpperCase()
          : "";


      const enteredClass =
        classInput
          ? classInput.value.trim()
          : "";


      const result =
        originalSubmitIdentity.apply(
          this,
          args
        );


      setTimeout(
        () => {

          const participant =
            getParticipant();


          if (
            enteredCode &&
            enteredClass &&
            participant.code ===
              enteredCode &&
            participant.className ===
              enteredClass
          ) {

            syncParticipant();

          }

        },
        50
      );


      return result;
    };
}


// ---------------------------------------------------------
// PRETEST
// ---------------------------------------------------------

if (
  typeof window.submitPretest ===
  "function"
) {

  const originalSubmitPretest =
    window.submitPretest;


  window.submitPretest =
    function(...args) {

      const result =
        originalSubmitPretest.apply(
          this,
          args
        );


      setTimeout(
        syncPretest,
        100
      );


      return result;
    };
}


// ---------------------------------------------------------
// MISSION ATTEMPT
// ---------------------------------------------------------

if (
  typeof window.saveMissionAttempt ===
  "function"
) {

  const originalSaveMissionAttempt =
    window.saveMissionAttempt;


  window.saveMissionAttempt =
    function(
      totalScore,
      ...args
    ) {

      const result =
        originalSaveMissionAttempt.call(
          this,
          totalScore,
          ...args
        );


      setTimeout(
        () => {
          syncMissionAttempt(
            totalScore
          );
        },
        100
      );


      return result;
    };
}


// ---------------------------------------------------------
// POSTTEST
// ---------------------------------------------------------

if (
  typeof window.submitPosttest ===
  "function"
) {

  const originalSubmitPosttest =
    window.submitPosttest;


  window.submitPosttest =
    function(...args) {

      const result =
        originalSubmitPosttest.apply(
          this,
          args
        );


      setTimeout(
        syncPosttest,
        100
      );


      return result;
    };
}


// ---------------------------------------------------------
// CAL
// ---------------------------------------------------------

if (
  typeof window.submitCAL ===
  "function"
) {

  const originalSubmitCAL =
    window.submitCAL;


  window.submitCAL =
    function(...args) {

      const result =
        originalSubmitCAL.apply(
          this,
          args
        );


      setTimeout(
        syncCAL,
        100
      );


      return result;
    };
}


// ---------------------------------------------------------
// STUDENT RESPONSE
// ---------------------------------------------------------

if (
  typeof window.submitStudentResponse ===
  "function"
) {

  const originalSubmitStudentResponse =
    window.submitStudentResponse;


  window.submitStudentResponse =
    function(...args) {

      const result =
        originalSubmitStudentResponse.apply(
          this,
          args
        );


      setTimeout(
        async () => {

          await syncStudentResponse();

          await syncProgramComplete();

        },
        150
      );


      return result;
    };
}


// ---------------------------------------------------------
// FINAL PAGE
// ---------------------------------------------------------

if (
  typeof window.showFinalComplete ===
  "function"
) {

  const originalShowFinalComplete =
    window.showFinalComplete;


  window.showFinalComplete =
    function(...args) {

      const result =
        originalShowFinalComplete.apply(
          this,
          args
        );


      setTimeout(
        syncProgramComplete,
        150
      );


      return result;
    };
}


// =========================================================
// 15. RETRY FAILED REQUESTS
// =========================================================

async function retryFailedAPIRequests() {

  if (!aitrapAPIConfigured()) {
    return;
  }


  const key =
    "aitrap_api_failed_queue";


  let queue = [];


  try {

    queue =
      JSON.parse(
        localStorage.getItem(
          key
        ) || "[]"
      );

  }

  catch {

    queue = [];
  }


  if (
    !Array.isArray(queue) ||
    queue.length === 0
  ) {

    return;
  }


  console.log(
    `Retry ${queue.length} API request...`
  );


  const failedAgain = [];


  for (
    const item of queue
  ) {

    try {

      await fetch(
        AITRAP_API_URL,
        {

          method:
            "POST",

          mode:
            "no-cors",

          cache:
            "no-store",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body:
            JSON.stringify(
              item.payload
            )

        }
      );

    }

    catch {

      failedAgain.push(
        item
      );
    }
  }


  localStorage.setItem(
    key,
    JSON.stringify(
      failedAgain
    )
  );
}


// =========================================================
// 16. INITIALIZATION
// =========================================================

window.addEventListener(
  "DOMContentLoaded",
  function() {

    if (
      aitrapAPIConfigured()
    ) {

      console.log(
        "AI TRAP LAB DATABASE CONNECTOR: READY"
      );


      retryFailedAPIRequests();

    }

    else {

      console.warn(
        "AI TRAP LAB berjalan dalam mode LOCAL karena API_URL belum diisi."
      );
    }

  }
);