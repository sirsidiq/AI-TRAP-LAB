/* =========================================================
   AI TRAP LAB
   FAST SIMULATION SEEDER V2
   ---------------------------------------------------------
   - 30 PESERTA SIMULASI
   - DATA LEBIH VARIATIF
   - DISTRIBUSI ITEM ACAK TERKONTROL
   - SEMUA INDIKATOR CT TERISI
   - SEMUA DIMENSI CAL TERISI
   - N-GAIN DIKIRIM
   - REQUEST DIJALANKAN SECARA BATCH
   ---------------------------------------------------------
   Aktif hanya dengan:
   ?simtest=1
   ========================================================= */

(function () {
  "use strict";

  const PARAM_NAME = "simtest";
  const PARAM_VALUE = "1";

  const params =
    new URLSearchParams(
      window.location.search
    );

  if (
    params.get(PARAM_NAME) !==
    PARAM_VALUE
  ) {
    return;
  }

  const CLASS_NAME =
    "VII-SIM";

  const TOTAL_PARTICIPANTS =
    30;

  const PREFIX =
    "SIM-";

  const CONCURRENT_REQUESTS =
    6;

  let running =
    false;

  let statusBox =
    null;

  let progressText =
    null;


  /* =======================================================
     DETERMINISTIC RANDOM
     ======================================================= */

  function seededRandom(seed) {

    let value =
      seed % 2147483647;

    if (value <= 0) {
      value += 2147483646;
    }

    return function () {

      value =
        value * 16807 %
        2147483647;

      return (
        value - 1
      ) / 2147483646;
    };
  }


  function randomInt(
    random,
    min,
    max
  ) {

    return Math.floor(
      random() *
      (
        max - min + 1
      )
    ) + min;
  }


  function shuffle(
    array,
    random
  ) {

    const result =
      [...array];

    for (
      let i =
        result.length - 1;
      i > 0;
      i--
    ) {

      const j =
        Math.floor(
          random() *
          (i + 1)
        );

      [
        result[i],
        result[j]
      ] =
      [
        result[j],
        result[i]
      ];
    }

    return result;
  }


  /* =======================================================
     SCORE PROFILE
     ======================================================= */

  function buildParticipantProfile(
    index
  ) {

    const random =
      seededRandom(
        20260914 +
        index * 917
      );


    /*
      Pretest sengaja dibuat bervariasi
      kira-kira 40–67.
    */

    const preTarget =
      randomInt(
        random,
        41,
        65
      );


    /*
      Gain 14–31 poin.
      Posttest dibatasi maksimal 90.
    */

    const gain =
      randomInt(
        random,
        15,
        29
      );


    const postTarget =
      Math.min(
        90,
        preTarget + gain
      );


    /*
      CAL 68–92.
    */

    const calTarget =
      randomInt(
        random,
        72,
        91
      );


    /*
      Respons skala 1–4.
      Target 3.20–3.90.
    */

    const responseAverage =
      Number(
        (
          3.20 +
          random() * 0.65
        ).toFixed(2)
      );


    /*
      Mission process 65–91.
    */

    const missionTarget =
      randomInt(
        random,
        67,
        89
      );


    return {
      code:
        PREFIX +
        String(index)
          .padStart(3, "0"),

      preTarget,

      postTarget,

      calTarget,

      missionTarget,

      responseAverage
    };
  }


  function buildProfiles() {

    const profiles = [];

    for (
      let i = 1;
      i <= TOTAL_PARTICIPANTS;
      i++
    ) {

      profiles.push(
        buildParticipantProfile(i)
      );
    }

    return profiles;
  }


  const PROFILES =
    buildProfiles();


  /* =======================================================
     OPTION HELPER
     ======================================================= */

  function getWrongOption(
    options,
    correctValue
  ) {

    if (
      !Array.isArray(options)
    ) {
      return correctValue;
    }

    const wrong =
      options.find(
        option =>
          option.value !==
          correctValue
      );

    return wrong
      ? wrong.value
      : correctValue;
  }


  /* =======================================================
     ITEM SCORE → RESPONSE
     ======================================================= */

  function responseForItemScore(
    question,
    score
  ) {

    const wrongAnswer =
      getWrongOption(
        question.answers,
        question.correctAnswer
      );

    const wrongReason =
      getWrongOption(
        question.reasons,
        question.correctReason
      );


    if (score === 3) {

      return {
        id:
          question.id,

        answer:
          question.correctAnswer,

        reason:
          question.correctReason
      };
    }


    if (score === 2) {

      return {
        id:
          question.id,

        answer:
          question.correctAnswer,

        reason:
          wrongReason
      };
    }


    if (score === 1) {

      return {
        id:
          question.id,

        answer:
          wrongAnswer,

        reason:
          question.correctReason
      };
    }


    return {
      id:
        question.id,

      answer:
        wrongAnswer,

      reason:
        wrongReason
    };
  }


  /* =======================================================
     RANDOM SCORE DISTRIBUTION
     ======================================================= */

  function createBalancedItemScores(
    questions,
    targetScore100,
    seed
  ) {

    const random =
      seededRandom(seed);

    const count =
      questions.length;

    const maxRaw =
      count * 3;

    let targetRaw =
      Math.round(
        (
          Number(
            targetScore100
          ) /
          100
        ) *
        maxRaw
      );


    targetRaw =
      Math.max(
        0,
        Math.min(
          maxRaw,
          targetRaw
        )
      );


    /*
      Semua item mulai dari skor 1.
      Tujuannya agar tidak ada indikator
      yang langsung menjadi 0 hanya karena
      berada di bagian akhir.
    */

    const scores =
      new Array(
        count
      ).fill(1);


    let currentRaw =
      count;


    /*
      Jika target lebih rendah dari baseline.
    */

    if (
      targetRaw <
      currentRaw
    ) {

      const order =
        shuffle(
          [
            ...Array(count).keys()
          ],
          random
        );


      for (
        const index of order
      ) {

        if (
          currentRaw <=
          targetRaw
        ) {
          break;
        }

        scores[index] =
          0;

        currentRaw--;
      }

    } else {

      /*
        Naikkan item satu demi satu
        dalam urutan acak.

        Ini membuat skor tersebar
        ke seluruh indikator,
        tidak menumpuk pada soal awal.
      */

      let candidates =
        shuffle(
          [
            ...Array(count).keys()
          ],
          random
        );


      while (
        currentRaw <
        targetRaw
      ) {

        let changed =
          false;


        for (
          const index of candidates
        ) {

          if (
            currentRaw >=
            targetRaw
          ) {
            break;
          }


          if (
            scores[index] <
            3
          ) {

            scores[index]++;

            currentRaw++;

            changed =
              true;
          }
        }


        if (!changed) {
          break;
        }


        candidates =
          shuffle(
            candidates,
            random
          );
      }
    }


    /*
      Shuffle ulang skor antar item.
    */

    return shuffle(
      scores,
      random
    );
  }


  function createAssessmentResponses(
    questions,
    targetScore100,
    seed
  ) {

    const itemScores =
      createBalancedItemScores(
        questions,
        targetScore100,
        seed
      );


    return questions.map(
      (
        question,
        index
      ) =>
        responseForItemScore(
          question,
          itemScores[index]
        )
    );
  }


  /* =======================================================
     NORMALIZE INDICATOR KEY
     ======================================================= */

  function normalizeIndicatorKey(
    key
  ) {

    return String(
      key || ""
    )
      .replace(
        /\s+/g,
        ""
      )
      .replace(
        /[^A-Za-z]/g,
        ""
      );
  }


  function normalizeIndicators(
    indicators
  ) {

    const result = {};

    Object.keys(
      indicators || {}
    ).forEach(
      key => {

        result[
          normalizeIndicatorKey(
            key
          )
        ] =
          indicators[key];
      }
    );

    return result;
  }


  /* =======================================================
     ASSESSMENT RESULT
     ======================================================= */

  function makeAssessment(
    questions,
    target,
    seed
  ) {

    const responses =
      createAssessmentResponses(
        questions,
        target,
        seed
      );


    const result =
      calculateAssessmentResult(
        questions,
        responses
      );


    return {
      responses,

      rawScore:
        result.rawScore,

      maxScore:
        result.maxScore,

      score100:
        result.score100,

      indicators:
        normalizeIndicators(
          result.indicators
        ),

      itemResults:
        result.itemResults
    };
  }


  /* =======================================================
     N-GAIN
     ======================================================= */

  function calculateNGain(
    pretest,
    posttest
  ) {

    const pre =
      Number(pretest);

    const post =
      Number(posttest);


    if (
      !Number.isFinite(pre) ||
      !Number.isFinite(post)
    ) {
      return null;
    }


    if (
      pre >= 100
    ) {
      return 0;
    }


    return Number(
      (
        (
          post - pre
        ) /
        (
          100 - pre
        )
      ).toFixed(4)
    );
  }


  /* =======================================================
     STUDENT RESPONSE
     ======================================================= */

  function buildResponseData(
    targetAverage,
    seed
  ) {

    const random =
      seededRandom(seed);


    const values =
      responseStatements.map(
        () => {

          const probability =
            random();


          if (
            targetAverage >= 3.65
          ) {

            if (
              probability <
              0.72
            ) {
              return 4;
            }

            return 3;
          }


          if (
            targetAverage >= 3.40
          ) {

            if (
              probability <
              0.50
            ) {
              return 4;
            }

            if (
              probability <
              0.94
            ) {
              return 3;
            }

            return 2;
          }


          if (
            probability <
            0.25
          ) {
            return 4;
          }

          if (
            probability <
            0.83
          ) {
            return 3;
          }

          return 2;
        }
      );


    const total =
      values.reduce(
        (
          sum,
          value
        ) =>
          sum + value,
        0
      );


    const maxScore =
      values.length * 4;


    const average =
      Number(
        (
          total /
          values.length
        ).toFixed(2)
      );


    const percentage =
      Number(
        (
          (
            total /
            maxScore
          ) * 100
        ).toFixed(2)
      );


    return {
      responses:
        values.map(
          (
            value,
            index
          ) => ({
            id:
              responseStatements[
                index
              ].id,

            statement:
              responseStatements[
                index
              ].text,

            value
          })
        ),

      reflection: {
        mostHelpful:
          "Saya lebih memahami bahwa jawaban AI perlu diperiksa melalui bukti, pengujian, dan alasan sebelum dipercaya.",

        improvement:
          "Beberapa mission dapat dilengkapi petunjuk tambahan agar proses verifikasi lebih mudah dipahami."
      },

      summary: {
        total,
        maxScore,
        average,
        percentage
      }
    };
  }


  /* =======================================================
     MISSION
     ======================================================= */

  function buildMissionPayload(
    participantCode,
    mission,
    target,
    seed
  ) {

    const random =
      seededRandom(seed);


    let claimScore =
      10;

    let checkScore =
      20;

    let testScore =
      25;

    let correctScore =
      20;

    let justifyScore =
      25;


    /*
      Buat variasi skor mission.
    */

    const difficulty =
      random();


    if (
      target < 75 ||
      difficulty <
      0.18
    ) {

      checkScore =
        random() < 0.5
          ? 10
          : 15;
    }


    if (
      random() <
      0.16
    ) {

      justifyScore =
        random() < 0.5
          ? 10
          : 15;
    }


    if (
      random() <
      0.10
    ) {

      testScore =
        0;
    }


    if (
      random() <
      0.08
    ) {

      correctScore =
        0;
    }


    if (
      random() <
      0.06
    ) {

      claimScore =
        0;
    }


    const total =
      claimScore +
      checkScore +
      testScore +
      correctScore +
      justifyScore;


    const correctChecks =
      mission.check &&
      Array.isArray(
        mission.check.correctAnswers
      )
        ? mission.check.correctAnswers
        : [];


    return {
      action:
        "MISSION_ATTEMPT",

      participantCode,

      className:
        CLASS_NAME,

      missionId:
        Number(
          mission.id
        ),

      level:
        Number(
          mission.level
        ),

      trapType:
        mission.trapType ||
        "",

      answers: {
        claim:
          mission.claim?.bestAnswer ||
          "",

        check:
          correctChecks,

        test:
          mission.test?.correctAnswer ||
          "",

        correct:
          mission.correct?.correctAnswer ||
          "",

        justify:
          "Saya memeriksa klaim AI dengan membandingkan jawaban, melakukan pengujian, dan menggunakan bukti sebelum menentukan kesimpulan."
      },

      gamificationScores: {
        claim:
          claimScore,

        check:
          checkScore,

        test:
          testScore,

        correct:
          correctScore,

        justify:
          justifyScore
      },

      gamificationTotal:
        total
    };
  }


  /* =======================================================
     BUILD ALL REQUESTS FOR ONE PARTICIPANT
     ======================================================= */

  function buildParticipantRequests(
    profile,
    participantIndex
  ) {

    const code =
      profile.code;


    const now =
      new Date()
        .toISOString();


    const pre =
      makeAssessment(
        pretestQuestions,
        profile.preTarget,
        10000 +
        participantIndex * 31
      );


    const post =
      makeAssessment(
        posttestQuestions,
        profile.postTarget,
        20000 +
        participantIndex * 47
      );


    const cal =
      makeAssessment(
        calQuestions,
        profile.calTarget,
        30000 +
        participantIndex * 59
      );


    const nGain =
      calculateNGain(
        pre.score100,
        post.score100
      );


    const gain =
      Number(
        (
          post.score100 -
          pre.score100
        ).toFixed(2)
      );


    const response =
      buildResponseData(
        profile.responseAverage,
        40000 +
        participantIndex * 71
      );


    const requests = [];


    requests.push({
      action:
        "REGISTER_PARTICIPANT",

      participantCode:
        code,

      className:
        CLASS_NAME
    });


    requests.push({
      action:
        "PRETEST_CT",

      participantCode:
        code,

      className:
        CLASS_NAME,

      rawScore:
        pre.rawScore,

      maxScore:
        pre.maxScore,

      score100:
        pre.score100,

      indicators:
        pre.indicators,

      responses:
        pre.responses,

      itemResults:
        pre.itemResults,

      startedAt:
        now,

      submittedAt:
        now
    });


    missions.forEach(
      (
        mission,
        missionIndex
      ) => {

        requests.push(
          buildMissionPayload(
            code,
            mission,
            profile.missionTarget,
            50000 +
            participantIndex * 101 +
            missionIndex * 17
          )
        );
      }
    );


    requests.push({
      action:
        "POSTTEST_CT",

      participantCode:
        code,

      className:
        CLASS_NAME,

      rawScore:
        post.rawScore,

      maxScore:
        post.maxScore,

      score100:
        post.score100,

      indicators:
        post.indicators,

      responses:
        post.responses,

      itemResults:
        post.itemResults,

      comparison: {
        pretestScore100:
          pre.score100,

        posttestScore100:
          post.score100,

        gainScore:
          gain,

        normalizedGain:
          nGain,

        indicators:
          {}
      },

      startedAt:
        now,

      submittedAt:
        now
    });


    requests.push({
      action:
        "CAL_ASSESSMENT",

      participantCode:
        code,

      className:
        CLASS_NAME,

      rawScore:
        cal.rawScore,

      maxScore:
        cal.maxScore,

      score100:
        cal.score100,

      indicators:
        cal.indicators,

      responses:
        cal.responses,

      itemResults:
        cal.itemResults,

      startedAt:
        now,

      submittedAt:
        now
    });


    requests.push({
      action:
        "STUDENT_RESPONSE",

      participantCode:
        code,

      className:
        CLASS_NAME,

      responses:
        response.responses,

      reflection:
        response.reflection,

      summary:
        response.summary,

      startedAt:
        now,

      submittedAt:
        now
    });


    requests.push({
      action:
        "PROGRAM_COMPLETE",

      participantCode:
        code,

      className:
        CLASS_NAME
    });


    return {
      requests,

      preview: {
        code,

        pretest:
          pre.score100,

        posttest:
          post.score100,

        gain,

        nGain,

        cal:
          cal.score100,

        response:
          response.summary.average,

        preIndicators:
          pre.indicators,

        postIndicators:
          post.indicators,

        calIndicators:
          cal.indicators
      }
    };
  }


  /* =======================================================
     RAW SEND
     ======================================================= */

  async function rawSend(
    payload
  ) {

    const body = {
      ...payload,

      clientTimestamp:
        new Date()
          .toISOString(),

      clientVersion:
        "AI-TRAP-LAB-SIM-V2"
    };


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
            body
          )
      }
    );


    return true;
  }


  /* =======================================================
     CONCURRENT QUEUE
     ======================================================= */

  async function runQueue(
    tasks,
    concurrency
  ) {

    let cursor =
      0;

    let completed =
      0;


    async function worker() {

      while (true) {

        const index =
          cursor++;

        if (
          index >=
          tasks.length
        ) {
          return;
        }


        await rawSend(
          tasks[index]
        );


        completed++;


        if (
          progressText
        ) {

          progressText.textContent =
            `Request ${completed} / ${tasks.length}`;
        }


        /*
          Jeda sangat kecil agar Apps Script
          tidak dihantam terlalu keras.
        */

        await new Promise(
          resolve =>
            setTimeout(
              resolve,
              20
            )
        );
      }
    }


    const workers = [];

    for (
      let i = 0;
      i < concurrency;
      i++
    ) {

      workers.push(
        worker()
      );
    }


    await Promise.all(
      workers
    );
  }


  /* =======================================================
     PREVIEW
     ======================================================= */

  function preview() {

    const previewData =
      PROFILES.map(
        (
          profile,
          index
        ) => {

          const built =
            buildParticipantRequests(
              profile,
              index + 1
            );

          return (
            built.preview
          );
        }
      );


    console.table(
      previewData.map(
        item => ({
          Peserta:
            item.code,

          Pretest:
            item.pretest,

          Posttest:
            item.posttest,

          Gain:
            item.gain,

          NGain:
            item.nGain,

          CAL:
            item.cal,

          Respons:
            item.response
        })
      )
    );


    console.log(
      "DETAIL PREVIEW:",
      previewData
    );


    log(
      "Preview selesai. Cek Console browser."
    );
  }


  /* =======================================================
     GENERATE
     ======================================================= */

  async function generate() {

    if (running) {
      return;
    }


    const confirmed =
      confirm(
        "Generate ulang 30 data simulasi AI TRAP LAB V2?"
      );


    if (!confirmed) {
      return;
    }


    running =
      true;


    const button =
      document.getElementById(
        "simV2Generate"
      );


    if (button) {

      button.disabled =
        true;

      button.textContent =
        "PROCESSING...";
    }


    try {

      const allRequests =
        [];


      PROFILES.forEach(
        (
          profile,
          index
        ) => {

          const built =
            buildParticipantRequests(
              profile,
              index + 1
            );


          allRequests.push(
            ...built.requests
          );
        }
      );


      log(
        `Total request: ${allRequests.length}`
      );


      log(
        `Menjalankan ${CONCURRENT_REQUESTS} request paralel...`
      );


      await runQueue(
        allRequests,
        CONCURRENT_REQUESTS
      );


      log(
        "Semua request selesai dikirim."
      );


      if (
        progressText
      ) {

        progressText.textContent =
          "SELESAI";
      }


      alert(
        "Seeder V2 selesai mengirim 30 peserta. Tunggu sekitar 15–30 detik lalu Refresh Data di Teacher Dashboard."
      );

    }

    catch (
      error
    ) {

      console.error(
        error
      );


      log(
        "ERROR: " +
        (
          error.message ||
          error
        )
      );


      alert(
        "Terjadi error. Periksa Console."
      );

    }

    finally {

      running =
        false;


      if (button) {

        button.disabled =
          false;

        button.textContent =
          "GENERATE 30 DATA";
      }
    }
  }


  /* =======================================================
     LOG
     ======================================================= */

  function log(
    message
  ) {

    console.log(
      "[SIM V2]",
      message
    );


    if (!statusBox) {
      return;
    }


    const row =
      document.createElement(
        "div"
      );


    row.textContent =
      message;


    statusBox.appendChild(
      row
    );


    statusBox.scrollTop =
      statusBox.scrollHeight;
  }


  /* =======================================================
     UI
     ======================================================= */

  function buildPanel() {

    const old =
      document.getElementById(
        "aitrapSimulationSeeder"
      );

    if (old) {
      old.remove();
    }


    const panel =
      document.createElement(
        "div"
      );


    panel.id =
      "aitrapSimulationSeeder";


    panel.style.cssText = `
      position:fixed;
      right:18px;
      bottom:18px;
      z-index:999999;
      width:360px;
      max-width:calc(100vw - 36px);
      padding:16px;
      border-radius:14px;
      background:#ffffff;
      color:#172033;
      box-shadow:0 12px 38px rgba(0,0,0,.25);
      font-family:Arial,sans-serif;
      border:1px solid #d9e1ea;
    `;


    panel.innerHTML = `

      <div
        style="
          font-size:15px;
          font-weight:800;
          margin-bottom:4px;
        "
      >
        AI TRAP LAB — FAST SEEDER V2
      </div>

      <div
        style="
          font-size:11px;
          line-height:1.5;
          color:#64748b;
          margin-bottom:12px;
        "
      >
        30 peserta • indikator seimbang • N-Gain • parallel request
      </div>

      <div
        id="simV2Progress"
        style="
          font-size:12px;
          font-weight:700;
          margin-bottom:10px;
        "
      >
        READY
      </div>

      <div
        style="
          display:flex;
          gap:8px;
          margin-bottom:10px;
        "
      >

        <button
          id="simV2Preview"
          style="
            flex:1;
            padding:10px;
            border-radius:8px;
            border:1px solid #ccd5df;
            background:#f8fafc;
            font-weight:700;
            cursor:pointer;
          "
        >
          PREVIEW
        </button>

        <button
          id="simV2Generate"
          style="
            flex:1;
            padding:10px;
            border-radius:8px;
            border:0;
            background:#172033;
            color:#fff;
            font-weight:700;
            cursor:pointer;
          "
        >
          GENERATE 30 DATA
        </button>

      </div>

      <div
        id="simV2Status"
        style="
          height:110px;
          overflow:auto;
          border-radius:8px;
          background:#f1f5f9;
          padding:8px;
          font-size:11px;
          line-height:1.5;
        "
      ></div>
    `;


    document.body.appendChild(
      panel
    );


    statusBox =
      document.getElementById(
        "simV2Status"
      );


    progressText =
      document.getElementById(
        "simV2Progress"
      );


    document
      .getElementById(
        "simV2Preview"
      )
      .addEventListener(
        "click",
        preview
      );


    document
      .getElementById(
        "simV2Generate"
      )
      .addEventListener(
        "click",
        generate
      );


    log(
      "FAST SEEDER V2 siap."
    );
  }


  /* =======================================================
     START
     ======================================================= */

  window.addEventListener(
    "DOMContentLoaded",
    function () {

      setTimeout(
        function () {

          if (
            typeof AITRAP_API_URL ===
            "undefined"
          ) {

            console.error(
              "AITRAP_API_URL tidak ditemukan."
            );

            return;
          }


          if (
            typeof calculateAssessmentResult !==
            "function"
          ) {

            console.error(
              "calculateAssessmentResult() tidak ditemukan."
            );

            return;
          }


          if (
            !Array.isArray(
              missions
            ) ||
            !Array.isArray(
              pretestQuestions
            ) ||
            !Array.isArray(
              posttestQuestions
            ) ||
            !Array.isArray(
              calQuestions
            )
          ) {

            console.error(
              "Dataset aplikasi belum siap."
            );

            return;
          }


          buildPanel();

        },
        700
      );

    }
  );

})();
