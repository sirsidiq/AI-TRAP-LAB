/* =========================================================
   AI TRAP LAB
   SIMULATION SEEDER
   30 PESERTA SIMULASI
   ---------------------------------------------------------
   AKTIF HANYA JIKA URL MEMILIKI ?simtest=1
   Contoh:
   https://sirsidiq.github.io/AI-TRAP-LAB/?simtest=1
   ========================================================= */

(function () {
  "use strict";

  const ENABLE_PARAM = "simtest";
  const ENABLE_VALUE = "1";
  const SEED_FLAG = "aitrap_simulation_seeded_30";

  const params =
    new URLSearchParams(
      window.location.search
    );

  const enabled =
    params.get(ENABLE_PARAM) ===
    ENABLE_VALUE;

  if (!enabled) {
    return;
  }

  console.log(
    "[AI TRAP LAB] Simulation Seeder aktif."
  );


  /* =======================================================
     DATASET SIMULASI
     ======================================================= */

  const simulationData = [
    { code:"SIM-001", pre:43, post:67, cal:83, mission:72, response:90 },
    { code:"SIM-002", pre:47, post:70, cal:79, mission:70, response:90 },
    { code:"SIM-003", pre:50, post:77, cal:88, mission:78, response:92 },
    { code:"SIM-004", pre:53, post:73, cal:83, mission:73, response:90 },
    { code:"SIM-005", pre:57, post:77, cal:88, mission:78, response:92 },

    { code:"SIM-006", pre:40, post:67, cal:79, mission:70, response:90 },
    { code:"SIM-007", pre:60, post:77, cal:83, mission:73, response:92 },
    { code:"SIM-008", pre:50, post:73, cal:88, mission:78, response:92 },
    { code:"SIM-009", pre:47, post:73, cal:83, mission:73, response:90 },
    { code:"SIM-010", pre:63, post:80, cal:88, mission:78, response:95 },

    { code:"SIM-011", pre:53, post:73, cal:83, mission:73, response:90 },
    { code:"SIM-012", pre:57, post:77, cal:83, mission:73, response:92 },
    { code:"SIM-013", pre:43, post:73, cal:79, mission:70, response:87 },
    { code:"SIM-014", pre:67, post:80, cal:88, mission:78, response:95 },
    { code:"SIM-015", pre:50, post:77, cal:83, mission:73, response:90 },

    { code:"SIM-016", pre:60, post:77, cal:88, mission:78, response:95 },
    { code:"SIM-017", pre:47, post:73, cal:79, mission:70, response:87 },
    { code:"SIM-018", pre:53, post:73, cal:83, mission:73, response:90 },
    { code:"SIM-019", pre:57, post:73, cal:88, mission:78, response:92 },
    { code:"SIM-020", pre:63, post:80, cal:83, mission:73, response:92 },

    { code:"SIM-021", pre:40, post:67, cal:79, mission:70, response:87 },
    { code:"SIM-022", pre:50, post:73, cal:83, mission:73, response:90 },
    { code:"SIM-023", pre:53, post:73, cal:88, mission:78, response:92 },
    { code:"SIM-024", pre:60, post:77, cal:83, mission:73, response:92 },
    { code:"SIM-025", pre:47, post:73, cal:79, mission:70, response:87 },

    { code:"SIM-026", pre:57, post:73, cal:88, mission:78, response:95 },
    { code:"SIM-027", pre:63, post:80, cal:83, mission:73, response:92 },
    { code:"SIM-028", pre:50, post:73, cal:88, mission:78, response:92 },
    { code:"SIM-029", pre:43, post:70, cal:79, mission:70, response:87 },
    { code:"SIM-030", pre:67, post:80, cal:88, mission:78, response:95 }
  ];


  /* =======================================================
     HELPER
     ======================================================= */

  function wait(ms) {
    return new Promise(
      resolve => setTimeout(resolve, ms)
    );
  }


  function getWrongOption(
    options,
    correctValue
  ) {
    if (!Array.isArray(options)) {
      return null;
    }

    const wrong =
      options.find(
        item =>
          item.value !== correctValue
      );

    return wrong
      ? wrong.value
      : null;
  }


  function buildResponseForScore(
    question,
    wantedItemScore
  ) {

    const correctAnswer =
      question.correctAnswer;

    const correctReason =
      question.correctReason;

    const wrongAnswer =
      getWrongOption(
        question.answers,
        correctAnswer
      );

    const wrongReason =
      getWrongOption(
        question.reasons,
        correctReason
      );

    if (wantedItemScore === 3) {
      return {
        id: question.id,
        answer: correctAnswer,
        reason: correctReason
      };
    }

    if (wantedItemScore === 2) {
      return {
        id: question.id,
        answer: correctAnswer,
        reason:
          wrongReason ||
          correctReason
      };
    }

    if (wantedItemScore === 1) {
      return {
        id: question.id,
        answer:
          wrongAnswer ||
          correctAnswer,
        reason: correctReason
      };
    }

    return {
      id: question.id,
      answer:
        wrongAnswer ||
        correctAnswer,
      reason:
        wrongReason ||
        correctReason
    };
  }


  function createAssessmentResponses(
    questions,
    targetScore100
  ) {

    const maxRaw =
      questions.length * 3;

    let targetRaw =
      Math.round(
        (
          targetScore100 /
          100
        ) * maxRaw
      );

    targetRaw =
      Math.max(
        0,
        Math.min(
          maxRaw,
          targetRaw
        )
      );

    const scores =
      new Array(
        questions.length
      ).fill(0);

    let remaining =
      targetRaw;

    for (
      let i = 0;
      i < scores.length;
      i++
    ) {

      const give =
        Math.min(
          3,
          remaining
        );

      scores[i] =
        give;

      remaining -=
        give;

      if (remaining <= 0) {
        break;
      }
    }


    return questions.map(
      (question, index) =>
        buildResponseForScore(
          question,
          scores[index]
        )
    );
  }


  function buildAssessmentRecord(
    participantCode,
    className,
    assessmentName,
    questions,
    responses
  ) {

    const result =
      calculateAssessmentResult(
        questions,
        responses
      );

    const now =
      new Date()
        .toISOString();

    return {
      completed: true,
      participantCode,
      className,
      assessment:
        assessmentName,
      startedAt:
        now,
      submittedAt:
        now,
      responses,
      rawScore:
        result.rawScore,
      maxScore:
        result.maxScore,
      score100:
        result.score100,
      indicators:
        result.indicators,
      itemResults:
        result.itemResults
    };
  }


  function getMissionJustification(
    mission
  ) {

    const keywords =
      mission.justify &&
      Array.isArray(
        mission.justify.keywords
      )
        ? mission.justify.keywords
        : [];

    if (!keywords.length) {
      return (
        "Klaim perlu diperiksa dengan bukti sebelum dibuat kesimpulan."
      );
    }

    return (
      "Bukti menunjukkan " +
      keywords.join(" ") +
      " sehingga klaim harus diverifikasi sebelum diterima."
    );
  }


  function getMissionAnswers(
    mission,
    quality
  ) {

    const correctChecks =
      mission.check &&
      Array.isArray(
        mission.check.correctAnswers
      )
        ? [
            ...mission.check.correctAnswers
          ]
        : [];

    let selectedChecks =
      correctChecks;

    let testAnswer =
      mission.test.correctAnswer;

    let correctAnswer =
      mission.correct.correctAnswer;

    let claimAnswer =
      mission.claim.bestAnswer;

    if (quality === "medium") {

      selectedChecks =
        correctChecks.length > 1
          ? correctChecks.slice(
              0,
              correctChecks.length - 1
            )
          : correctChecks;

    }

    if (quality === "low") {

      selectedChecks =
        correctChecks.length
          ? [
              correctChecks[0]
            ]
          : [];

      const wrongTest =
        getWrongOption(
          mission.test.options,
          mission.test.correctAnswer
        );

      if (wrongTest) {
        testAnswer =
          wrongTest;
      }
    }

    return {
      claim:
        claimAnswer,
      check:
        selectedChecks,
      test:
        testAnswer,
      correct:
        correctAnswer,
      justify:
        getMissionJustification(
          mission
        )
    };
  }


  function calculateMissionObjectScores(
    mission,
    missionAnswers
  ) {

    const expected =
      [
        ...mission.check.correctAnswers
      ].sort();

    const selected =
      [
        ...missionAnswers.check
      ].sort();

    const exact =
      expected.length ===
        selected.length &&
      expected.every(
        (value, index) =>
          value ===
          selected[index]
      );

    const claimScore =
      missionAnswers.claim ===
      mission.claim.bestAnswer
        ? 10
        : 0;


    let checkScore = 0;

    if (exact) {

      checkScore = 20;

    } else if (
      expected.length &&
      selected.length
    ) {

      const correctSelected =
        selected.filter(
          value =>
            expected.includes(
              value
            )
        ).length;

      const incorrectSelected =
        selected.filter(
          value =>
            !expected.includes(
              value
            )
        ).length;

      let ratio =
        (
          correctSelected -
          incorrectSelected
        ) /
        expected.length;

      ratio =
        Math.max(
          0,
          Math.min(
            1,
            ratio
          )
        );

      checkScore =
        Math.round(
          ratio * 20
        );
    }


    const testScore =
      missionAnswers.test ===
      mission.test.correctAnswer
        ? 25
        : 0;


    const correctScore =
      missionAnswers.correct ===
      mission.correct.correctAnswer
        ? 20
        : 0;


    const justifyScore =
      calculateGamificationJustify(
        missionAnswers.justify,
        mission.justify.keywords || []
      );


    return {
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
    };
  }


  function getMissionQuality(
    targetMissionAverage,
    missionIndex
  ) {

    if (
      targetMissionAverage >= 77
    ) {
      return (
        missionIndex % 5 === 0
          ? "medium"
          : "high"
      );
    }

    if (
      targetMissionAverage >= 73
    ) {
      return (
        missionIndex % 4 === 0
          ? "medium"
          : "high"
      );
    }

    return (
      missionIndex % 3 === 0
        ? "low"
        : "medium"
    );
  }


  function buildStudentResponseValues(
    percentage
  ) {

    const max =
      responseStatements.length *
      4;

    let targetTotal =
      Math.round(
        (
          percentage /
          100
        ) * max
      );

    targetTotal =
      Math.max(
        responseStatements.length,
        Math.min(
          max,
          targetTotal
        )
      );

    const values =
      new Array(
        responseStatements.length
      ).fill(1);

    let remaining =
      targetTotal -
      responseStatements.length;


    for (
      let i = 0;
      i < values.length;
      i++
    ) {

      const add =
        Math.min(
          3,
          remaining
        );

      values[i] +=
        add;

      remaining -=
        add;

      if (remaining <= 0) {
        break;
      }
    }


    return values;
  }


  function buildStudentResponseRecord(
    participantCode,
    className,
    percentage
  ) {

    const values =
      buildStudentResponseValues(
        percentage
      );

    const responses =
      values.map(
        (value, index) => ({
          id:
            responseStatements[index].id,

          statement:
            responseStatements[index].text,

          value
        })
      );


    const total =
      values.reduce(
        (sum, value) =>
          sum + value,
        0
      );


    const maxScore =
      responseStatements.length *
      4;


    const average =
      Number(
        (
          total /
          values.length
        ).toFixed(2)
      );


    const resultPercentage =
      Number(
        (
          (
            total /
            maxScore
          ) * 100
        ).toFixed(2)
      );


    const now =
      new Date()
        .toISOString();


    return {
      completed: true,
      participantCode,
      className,
      assessment:
        "STUDENT_RESPONSE",
      startedAt:
        now,
      submittedAt:
        now,

      scale: {
        minimum: 1,
        maximum: 4,
        labels: {
          1:
            "Sangat Tidak Setuju",
          2:
            "Tidak Setuju",
          3:
            "Setuju",
          4:
            "Sangat Setuju"
        }
      },

      responses,

      reflection: {
        mostHelpful:
          "Saya belajar bahwa jawaban AI perlu diperiksa dengan bukti sebelum dipercaya.",

        improvement:
          "Beberapa mission dapat diberikan petunjuk tambahan agar lebih mudah dipahami."
      },

      summary: {
        total,
        maxScore,
        average,
        percentage:
          resultPercentage
      }
    };
  }


  /* =======================================================
     API SEND DIRECT
     ======================================================= */

  async function sendDirect(
    action,
    data
  ) {

    if (
      typeof aitrapSend !==
      "function"
    ) {
      throw new Error(
        "aitrapSend() tidak ditemukan. Pastikan api.js dimuat sebelum simulation-seeder.js."
      );
    }

    return await aitrapSend(
      action,
      data
    );
  }


  /* =======================================================
     SEED PARTICIPANT
     ======================================================= */

  async function seedParticipant(
    profile,
    index
  ) {

    const code =
      profile.code;

    const className =
      "VII-SIM";


    log(
      `Memproses ${code} (${index + 1}/30)...`
    );


    await sendDirect(
      "REGISTER_PARTICIPANT",
      {
        participantCode:
          code,
        className
      }
    );


    await wait(120);


    const preResponses =
      createAssessmentResponses(
        pretestQuestions,
        profile.pre
      );


    const preRecord =
      buildAssessmentRecord(
        code,
        className,
        "PRETEST_CT",
        pretestQuestions,
        preResponses
      );


    await sendDirect(
      "PRETEST_CT",
      {
        participantCode:
          code,
        className,

        rawScore:
          preRecord.rawScore,

        maxScore:
          preRecord.maxScore,

        score100:
          preRecord.score100,

        indicators:
          preRecord.indicators,

        responses:
          preRecord.responses,

        itemResults:
          preRecord.itemResults,

        startedAt:
          preRecord.startedAt,

        submittedAt:
          preRecord.submittedAt
      }
    );


    await wait(120);


    for (
      let m = 0;
      m < missions.length;
      m++
    ) {

      const mission =
        missions[m];

      const quality =
        getMissionQuality(
          profile.mission,
          m
        );


      const missionAnswers =
        getMissionAnswers(
          mission,
          quality
        );


      const missionScores =
        calculateMissionObjectScores(
          mission,
          missionAnswers
        );


      const total =
        missionScores.claim +
        missionScores.check +
        missionScores.test +
        missionScores.correct +
        missionScores.justify;


      await sendDirect(
        "MISSION_ATTEMPT",
        {
          participantCode:
            code,

          className,

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

          answers:
            missionAnswers,

          gamificationScores:
            missionScores,

          gamificationTotal:
            total
        }
      );


      await wait(70);
    }


    const postResponses =
      createAssessmentResponses(
        posttestQuestions,
        profile.post
      );


    const postRecord =
      buildAssessmentRecord(
        code,
        className,
        "POSTTEST_CT",
        posttestQuestions,
        postResponses
      );


    await sendDirect(
      "POSTTEST_CT",
      {
        participantCode:
          code,

        className,

        rawScore:
          postRecord.rawScore,

        maxScore:
          postRecord.maxScore,

        score100:
          postRecord.score100,

        indicators:
          postRecord.indicators,

        responses:
          postRecord.responses,

        itemResults:
          postRecord.itemResults,

        comparison: {
          pretestScore100:
            preRecord.score100,

          posttestScore100:
            postRecord.score100,

          gainScore:
            postRecord.score100 -
            preRecord.score100
        },

        startedAt:
          postRecord.startedAt,

        submittedAt:
          postRecord.submittedAt
      }
    );


    await wait(120);


    const calResponses =
      createAssessmentResponses(
        calQuestions,
        profile.cal
      );


    const calRecord =
      buildAssessmentRecord(
        code,
        className,
        "CAL_ASSESSMENT",
        calQuestions,
        calResponses
      );


    await sendDirect(
      "CAL_ASSESSMENT",
      {
        participantCode:
          code,

        className,

        rawScore:
          calRecord.rawScore,

        maxScore:
          calRecord.maxScore,

        score100:
          calRecord.score100,

        indicators:
          calRecord.indicators,

        responses:
          calRecord.responses,

        itemResults:
          calRecord.itemResults,

        startedAt:
          calRecord.startedAt,

        submittedAt:
          calRecord.submittedAt
      }
    );


    await wait(120);


    const responseRecord =
      buildStudentResponseRecord(
        code,
        className,
        profile.response
      );


    await sendDirect(
      "STUDENT_RESPONSE",
      {
        participantCode:
          code,

        className,

        responses:
          responseRecord.responses,

        reflection:
          responseRecord.reflection,

        summary:
          responseRecord.summary,

        startedAt:
          responseRecord.startedAt,

        submittedAt:
          responseRecord.submittedAt
      }
    );


    await wait(120);


    await sendDirect(
      "PROGRAM_COMPLETE",
      {
        participantCode:
          code,
        className
      }
    );


    await wait(150);


    log(
      `${code} selesai.`
    );
  }


  /* =======================================================
     PANEL UI
     ======================================================= */

  let statusBox = null;
  let progressText = null;


  function log(message) {

    console.log(
      "[Simulation Seeder]",
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


  function buildPanel() {

    const wrapper =
      document.createElement(
        "div"
      );

    wrapper.id =
      "aitrapSimulationSeeder";


    wrapper.style.cssText = `
      position:fixed;
      right:18px;
      bottom:18px;
      width:340px;
      max-width:calc(100vw - 36px);
      z-index:999999;
      background:#ffffff;
      color:#1f2937;
      border:1px solid #d1d5db;
      border-radius:14px;
      box-shadow:0 12px 40px rgba(0,0,0,.20);
      padding:16px;
      font-family:Arial,sans-serif;
    `;


    wrapper.innerHTML = `

      <div
        style="
          font-weight:800;
          font-size:15px;
          margin-bottom:4px;
        "
      >
        AI TRAP LAB — Simulation Seeder
      </div>

      <div
        style="
          font-size:12px;
          color:#6b7280;
          margin-bottom:12px;
          line-height:1.45;
        "
      >
        30 data simulasi untuk pengujian sistem.
      </div>

      <div
        id="simSeederProgress"
        style="
          font-size:12px;
          font-weight:700;
          margin-bottom:8px;
        "
      >
        Status: siap
      </div>

      <div
        style="
          display:flex;
          gap:8px;
          margin-bottom:10px;
        "
      >

        <button
          id="simPreviewBtn"
          style="
            flex:1;
            border:1px solid #d1d5db;
            background:#f9fafb;
            padding:9px 10px;
            border-radius:9px;
            cursor:pointer;
            font-weight:700;
          "
        >
          Preview
        </button>

        <button
          id="simSeedBtn"
          style="
            flex:1;
            border:none;
            background:#111827;
            color:#fff;
            padding:9px 10px;
            border-radius:9px;
            cursor:pointer;
            font-weight:700;
          "
        >
          Seed 30 Data
        </button>

      </div>

      <div
        id="simSeederStatus"
        style="
          height:120px;
          overflow:auto;
          background:#f3f4f6;
          border-radius:8px;
          padding:8px;
          font-size:11px;
          line-height:1.5;
        "
      ></div>
    `;


    document.body.appendChild(
      wrapper
    );


    statusBox =
      document.getElementById(
        "simSeederStatus"
      );


    progressText =
      document.getElementById(
        "simSeederProgress"
      );


    document
      .getElementById(
        "simPreviewBtn"
      )
      .addEventListener(
        "click",
        previewData
      );


    document
      .getElementById(
        "simSeedBtn"
      )
      .addEventListener(
        "click",
        startSeed
      );
  }


  function previewData() {

    console.table(
      simulationData
    );

    log(
      "Preview ditampilkan di Console browser."
    );

    alert(
      "Preview dataset sudah ditampilkan pada Console browser (F12 → Console)."
    );
  }


  async function startSeed() {

    const alreadySeeded =
      localStorage.getItem(
        SEED_FLAG
      ) === "1";


    if (alreadySeeded) {

      const proceed =
        confirm(
          "Seeder pernah dijalankan dari browser ini. Menjalankan kembali dapat membuat data duplikat. Tetap lanjut?"
        );

      if (!proceed) {
        return;
      }
    }


    const confirmSeed =
      confirm(
        "Masukkan 30 peserta simulasi beserta seluruh Pretest, 15 Mission, Posttest, CAL, Response, dan Program Complete ke database?"
      );


    if (!confirmSeed) {
      return;
    }


    const seedButton =
      document.getElementById(
        "simSeedBtn"
      );


    seedButton.disabled =
      true;


    seedButton.textContent =
      "Processing...";


    try {

      for (
        let i = 0;
        i < simulationData.length;
        i++
      ) {

        if (progressText) {

          progressText.textContent =
            `Status: ${i + 1} / ${simulationData.length}`;
        }


        await seedParticipant(
          simulationData[i],
          i
        );
      }


      localStorage.setItem(
        SEED_FLAG,
        "1"
      );


      if (progressText) {

        progressText.textContent =
          "Status: selesai 30 / 30";
      }


      log(
        "SEMUA DATA SIMULASI SELESAI DIKIRIM."
      );


      alert(
        "30 peserta simulasi selesai diproses. Silakan cek Google Sheets / Teacher Dashboard."
      );

    }

    catch (error) {

      console.error(
        error
      );


      log(
        "ERROR: " +
        error.message
      );


      alert(
        "Seeder berhenti karena error. Periksa Console browser."
      );
    }

    finally {

      seedButton.disabled =
        false;


      seedButton.textContent =
        "Seed 30 Data";
    }
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
            typeof aitrapSend !==
            "function"
          ) {

            console.error(
              "Simulation Seeder: api.js belum siap."
            );

            return;
          }


          if (
            typeof missions ===
              "undefined" ||
            typeof pretestQuestions ===
              "undefined" ||
            typeof posttestQuestions ===
              "undefined" ||
            typeof calQuestions ===
              "undefined"
          ) {

            console.error(
              "Simulation Seeder: data aplikasi belum tersedia."
            );

            return;
          }


          buildPanel();

        },
        500
      );

    }
  );

})();