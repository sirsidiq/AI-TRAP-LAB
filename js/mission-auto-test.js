/* =========================================================
   AI TRAP LAB
   MISSION AUTO TEST
   Production QA Version 1.1.0

   CHECKS:
   - 15 Mission Schema
   - 75 Render Scenarios
     15 missions × 5 stages
   - 19 Gameplay Handlers

   TOTAL:
   109 CHECKS

   IMPORTANT:
   Auto Test hanya berjalan jika URL:
   ?autotest=1

   index.html
   -> NO POPUP

   index.html?autotest=1
   -> AUTO TEST
   ========================================================= */

(function () {
  "use strict";

  const VERSION = "1.1.0";

  /* =======================================================
     REQUIRED HANDLERS
     ======================================================= */

  const REQUIRED_HANDLERS = [
    "mgClaim",
    "mgClaimNext",

    "mgToggleEvidence",
    "mgCheckNext",

    "mgTestInput",
    "mgTestInput2",
    "mgRunNumberTest",
    "mgRunDualTest",

    "mgAddSequence",
    "mgRemoveSequence",
    "mgVerifySequence",

    "mgScenario",
    "mgResetTest",
    "mgTestNext",

    "mgVerdict",
    "mgCorrectNext",

    "mgPrevious",

    "mgReportInput",
    "mgSubmitReport"
  ];

  /* =======================================================
     REQUIRED MISSION FIELDS
     ======================================================= */

  const REQUIRED_FIELDS = [
    "id",
    "level",
    "levelName",
    "title",
    "trapType",
    "stimulus",
    "aiClaim",
    "confidence",
    "claim",
    "check",
    "test",
    "correct",
    "justify",
    "result"
  ];

  /* =======================================================
     HELPERS
     ======================================================= */

  function safeClone(value) {
    try {
      return JSON.parse(
        JSON.stringify(value)
      );
    } catch {
      return value;
    }
  }

  function getMissions() {
    try {
      if (
        typeof missions !== "undefined" &&
        Array.isArray(missions)
      ) {
        return missions;
      }
    } catch {}

    return [];
  }

  function getMissionByIdSafe(id) {
    try {
      if (
        typeof getMissionById === "function"
      ) {
        return getMissionById(id);
      }
    } catch {}

    return getMissions().find(
      mission =>
        Number(mission.id) ===
        Number(id)
    ) || null;
  }

  function createEmptyAnswersSafe() {
    try {
      if (
        typeof createEmptyMissionAnswers ===
        "function"
      ) {
        return createEmptyMissionAnswers();
      }
    } catch {}

    return {
      claim: null,
      check: [],
      test: null,
      correct: null,
      justify: ""
    };
  }

  function pass(
    category,
    name,
    detail = ""
  ) {
    return {
      category,
      name,
      passed: true,
      detail
    };
  }

  function fail(
    category,
    name,
    detail = ""
  ) {
    return {
      category,
      name,
      passed: false,
      detail
    };
  }

  /* =======================================================
     SCHEMA CHECK
     15 checks total
     ======================================================= */

  function validateMissionSchema(
    mission
  ) {
    if (!mission) {
      return false;
    }

    const fieldsOK =
      REQUIRED_FIELDS.every(
        field =>
          mission[field] !==
          undefined &&
          mission[field] !==
          null
      );

    if (!fieldsOK) {
      return false;
    }

    if (
      !mission.claim ||
      !Array.isArray(
        mission.claim.options
      )
    ) {
      return false;
    }

    const claimValues =
      mission.claim.options.map(
        option => option.value
      );

    if (
      !claimValues.includes(
        mission.claim.bestAnswer
      )
    ) {
      return false;
    }

    if (
      !mission.check ||
      !Array.isArray(
        mission.check.options
      ) ||
      !Array.isArray(
        mission.check.correctAnswers
      )
    ) {
      return false;
    }

    const checkValues =
      mission.check.options.map(
        option => option.value
      );

    const checkAnswersOK =
      mission.check.correctAnswers.every(
        answer =>
          checkValues.includes(answer)
      );

    if (!checkAnswersOK) {
      return false;
    }

    if (
      !mission.test ||
      mission.test.correctAnswer ===
      undefined
    ) {
      return false;
    }

    if (
      !mission.correct ||
      !Array.isArray(
        mission.correct.options
      )
    ) {
      return false;
    }

    const correctValues =
      mission.correct.options.map(
        option => option.value
      );

    if (
      !correctValues.includes(
        mission.correct.correctAnswer
      )
    ) {
      return false;
    }

    if (
      !mission.justify ||
      typeof mission.justify.prompt !==
      "string"
    ) {
      return false;
    }

    return true;
  }

  function runSchemaChecks() {
    const results = [];

    const missionList =
      getMissions();

    for (
      let id = 1;
      id <= 15;
      id++
    ) {
      const mission =
        missionList.find(
          item =>
            Number(item.id) === id
        );

      const ok =
        validateMissionSchema(
          mission
        );

      results.push(
        ok
          ? pass(
              "SCHEMA",
              `Mission ${String(id).padStart(
                2,
                "0"
              )}`,
              "Schema valid"
            )
          : fail(
              "SCHEMA",
              `Mission ${String(id).padStart(
                2,
                "0"
              )}`,
              "Schema tidak valid"
            )
      );
    }

    return results;
  }

  /* =======================================================
     HANDLER CHECK
     19 checks total
     ======================================================= */

  function runHandlerChecks() {
    return REQUIRED_HANDLERS.map(
      handler => {
        const ok =
          typeof window[handler] ===
          "function";

        return ok
          ? pass(
              "HANDLER",
              handler,
              "Function tersedia"
            )
          : fail(
              "HANDLER",
              handler,
              "Function tidak ditemukan"
            );
      }
    );
  }

  /* =======================================================
     RENDER CHECK
     75 checks total
     ======================================================= */

  function ensureTestContainer() {
    let wrapper =
      document.getElementById(
        "aitrapAutoTestSandbox"
      );

    if (!wrapper) {
      wrapper =
        document.createElement(
          "div"
        );

      wrapper.id =
        "aitrapAutoTestSandbox";

      wrapper.style.cssText = `
        position:fixed;
        left:-99999px;
        top:-99999px;
        width:1200px;
        height:auto;
        opacity:0;
        pointer-events:none;
        z-index:-999999;
      `;

      wrapper.innerHTML = `
        <div id="stepContent"></div>
      `;

      document.body.appendChild(
        wrapper
      );
    }

    let content =
      wrapper.querySelector(
        "#stepContent"
      );

    if (!content) {
      content =
        document.createElement(
          "div"
        );

      content.id =
        "stepContent";

      wrapper.appendChild(
        content
      );
    }

    return {
      wrapper,
      content
    };
  }

  function runRenderChecks() {
    const results = [];

    if (
      typeof window.renderMissionStep !==
      "function"
    ) {
      for (
        let missionId = 1;
        missionId <= 15;
        missionId++
      ) {
        for (
          let step = 0;
          step < 5;
          step++
        ) {
          results.push(
            fail(
              "RENDER",
              `M${String(
                missionId
              ).padStart(
                2,
                "0"
              )} Step ${step + 1}`,
              "renderMissionStep tidak tersedia"
            )
          );
        }
      }

      return results;
    }

    const original = {
      missionId:
        typeof currentMissionId !==
        "undefined"
          ? currentMissionId
          : null,

      step:
        typeof currentStep !==
        "undefined"
          ? currentStep
          : 0,

      answers:
        typeof answers !==
        "undefined"
          ? safeClone(answers)
          : null
    };

    const existingStepContent =
      document.getElementById(
        "stepContent"
      );

    const existingParent =
      existingStepContent
        ? existingStepContent.parentNode
        : null;

    const existingNextSibling =
      existingStepContent
        ? existingStepContent.nextSibling
        : null;

    const existingDisplay =
      existingStepContent
        ? existingStepContent.style.display
        : null;

    const sandbox =
      ensureTestContainer();

    /*
      Jika #stepContent asli ada,
      kita tidak boleh memiliki dua ID
      yang sama.

      Jadi sementara ID elemen asli
      dinonaktifkan.
    */

    if (existingStepContent) {
      existingStepContent.id =
        "stepContent_original_autotest";

      existingStepContent.style.display =
        "none";
    }

    sandbox.content.id =
      "stepContent";

    try {
      for (
        let missionId = 1;
        missionId <= 15;
        missionId++
      ) {
        const mission =
          getMissionByIdSafe(
            missionId
          );

        for (
          let step = 0;
          step < 5;
          step++
        ) {
          let ok = false;
          let detail = "";

          try {
            currentMissionId =
              missionId;

            currentStep =
              step;

            answers =
              createEmptyAnswersSafe();

            /*
              Beri sample JUSTIFY supaya
              renderer tahap 5 tetap bisa
              dianalisis tanpa submission.
            */

            if (step === 4) {
              answers.justify =
                "Saya memeriksa bukti dan hasil pengujian karena keputusan harus diverifikasi berdasarkan aturan dan data.";
            }

            sandbox.content.innerHTML =
              "";

            window.renderMissionStep();

            const html =
              sandbox.content.innerHTML
                .trim();

            const screen =
              sandbox.content.querySelector(
                ".mg-screen"
              );

            ok =
              Boolean(
                mission &&
                html.length > 0 &&
                screen
              );

            detail = ok
              ? "Render valid"
              : "HTML kosong atau .mg-screen tidak ditemukan";

          } catch (error) {
            ok = false;

            detail =
              error?.message ||
              String(error);
          }

          results.push(
            ok
              ? pass(
                  "RENDER",
                  `M${String(
                    missionId
                  ).padStart(
                    2,
                    "0"
                  )} Step ${step + 1}`,
                  detail
                )
              : fail(
                  "RENDER",
                  `M${String(
                    missionId
                  ).padStart(
                    2,
                    "0"
                  )} Step ${step + 1}`,
                  detail
                )
          );
        }
      }

    } finally {
      try {
        currentMissionId =
          original.missionId;

        currentStep =
          original.step;

        if (
          original.answers !== null
        ) {
          answers =
            original.answers;
        }
      } catch {}

      sandbox.wrapper.remove();

      if (existingStepContent) {
        existingStepContent.id =
          "stepContent";

        existingStepContent.style.display =
          existingDisplay || "";

        /*
          Pastikan posisi DOM tidak berubah.
        */

        if (
          existingParent &&
          existingStepContent.parentNode !==
          existingParent
        ) {
          if (existingNextSibling) {
            existingParent.insertBefore(
              existingStepContent,
              existingNextSibling
            );
          } else {
            existingParent.appendChild(
              existingStepContent
            );
          }
        }
      }
    }

    return results;
  }

  /* =======================================================
     MAIN TEST
     ======================================================= */

  function runAITRAPAutoTest(
    showVisual = true
  ) {
    const started =
      performance.now();

    const schemaResults =
      runSchemaChecks();

    const renderResults =
      runRenderChecks();

    const handlerResults =
      runHandlerChecks();

    const results = [
      ...schemaResults,
      ...renderResults,
      ...handlerResults
    ];

    const total =
      results.length;

    const passed =
      results.filter(
        item =>
          item.passed
      ).length;

    const failed =
      total - passed;

    const report = {
      version: VERSION,

      checkedAt:
        new Date()
          .toISOString(),

      total,
      passed,
      failed,

      ready:
        failed === 0,

      schema: {
        total:
          schemaResults.length,

        passed:
          schemaResults.filter(
            item => item.passed
          ).length
      },

      render: {
        total:
          renderResults.length,

        passed:
          renderResults.filter(
            item => item.passed
          ).length
      },

      handlers: {
        total:
          handlerResults.length,

        passed:
          handlerResults.filter(
            item => item.passed
          ).length
      },

      durationMs:
        Math.round(
          performance.now() -
          started
        ),

      results
    };

    window.AITRAP_AUTO_TEST_RESULT =
      report;

    console.group(
      "%cAI TRAP LAB AUTO TEST",
      "color:#2c9be8;font-weight:bold;font-size:14px"
    );

    console.log(
      `Version: ${VERSION}`
    );

    console.log(
      `Result: ${passed}/${total}`
    );

    console.log(
      `Schema: ${report.schema.passed}/${report.schema.total}`
    );

    console.log(
      `Render: ${report.render.passed}/${report.render.total}`
    );

    console.log(
      `Handlers: ${report.handlers.passed}/${report.handlers.total}`
    );

    if (failed) {
      console.table(
        results
          .filter(
            item =>
              !item.passed
          )
          .map(
            item => ({
              Category:
                item.category,

              Check:
                item.name,

              Detail:
                item.detail
            })
          )
      );
    }

    console.groupEnd();

    if (showVisual) {
      renderVisualReport(
        report
      );
    }

    return report;
  }

  /* =======================================================
     VISUAL REPORT
     ======================================================= */

  function removeVisualReport() {
    document
      .getElementById(
        "aitrapAutoTestPanel"
      )
      ?.remove();
  }

  function renderVisualReport(
    report
  ) {
    removeVisualReport();

    const panel =
      document.createElement(
        "div"
      );

    panel.id =
      "aitrapAutoTestPanel";

    panel.innerHTML = `

      <div class="aat-head">

        <div>

          <span>
            QA SYSTEM
          </span>

          <strong>
            AI TRAP LAB AUTO TEST
          </strong>

        </div>

        <button
          type="button"
          onclick="
            document
              .getElementById(
                'aitrapAutoTestPanel'
              )
              ?.remove()
          "
        >
          ×
        </button>

      </div>


      <div
        class="
          aat-status
          ${
            report.ready
              ? "pass"
              : "fail"
          }
        "
      >

        <b>
          ${
            report.ready
              ? "✓"
              : "!"
          }
        </b>

        <div>

          <strong>
            ${
              report.ready
                ? "ALL TESTS PASSED"
                : "TEST FAILED"
            }
          </strong>

          <span>
            ${report.passed}/${report.total}
            checks passed
          </span>

        </div>

      </div>


      <div class="aat-grid">

        <div>

          <span>
            MISSIONS
          </span>

          <strong>
            ${report.schema.passed}/15
          </strong>

        </div>


        <div>

          <span>
            RENDER
          </span>

          <strong>
            ${report.render.passed}/75
          </strong>

        </div>


        <div>

          <span>
            SCHEMA
          </span>

          <strong>
            ${report.schema.passed}/15
          </strong>

        </div>


        <div>

          <span>
            HANDLERS
          </span>

          <strong>
            ${report.handlers.passed}/19
          </strong>

        </div>

      </div>


      <div class="aat-message">

        ${
          report.ready
            ? `
              15 mission × 5 tahap
              berhasil dirender tanpa error.
              Gameplay Engine siap untuk
              production.
            `
            : `
              Terdapat ${report.failed}
              pemeriksaan yang gagal.
              Lihat Console untuk detail.
            `
        }

      </div>


      <div class="aat-footer">

        <span>
          v${VERSION}
          · ${report.durationMs} ms
        </span>

        <button
          type="button"
          onclick="
            window
              .runAITRAPAutoTest(
                true
              )
          "
        >
          ↻ RUN AGAIN
        </button>

      </div>
    `;

    document.body.appendChild(
      panel
    );
  }

  /* =======================================================
     STYLE
     ======================================================= */

  function installStyle() {
    const existing =
      document.getElementById(
        "aitrapAutoTestCSS"
      );

    if (existing) {
      existing.remove();
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "aitrapAutoTestCSS";

    style.textContent = `

#aitrapAutoTestPanel{
  position:fixed;

  right:18px;
  bottom:18px;

  z-index:9999998;

  width:
    min(
      340px,
      calc(100vw - 36px)
    );

  overflow:hidden;

  border:
    1px solid
    rgba(
      90,
      185,
      230,
      .25
    );

  border-radius:18px;

  background:
    linear-gradient(
      145deg,
      #081c30,
      #071425
    );

  color:#eef8ff;

  box-shadow:
    0 22px 60px
    rgba(
      0,
      0,
      0,
      .30
    );

  font-family:
    inherit;
}

.aat-head{
  display:flex;

  justify-content:
    space-between;

  align-items:center;

  gap:15px;

  padding:
    14px 15px;

  border-bottom:
    1px solid
    rgba(
      255,
      255,
      255,
      .06
    );
}

.aat-head span{
  display:block;

  margin-bottom:2px;

  color:#4ecfff;

  font-size:7px;

  font-weight:900;

  letter-spacing:1.5px;
}

.aat-head strong{
  display:block;

  color:#f1f9ff;

  font-size:11px;
}

.aat-head button{
  width:29px;
  height:29px;

  display:grid;
  place-items:center;

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      .08
    );

  border-radius:8px;

  background:
    rgba(
      255,
      255,
      255,
      .04
    );

  color:#7891a6;

  cursor:pointer;

  font-size:17px;
}

.aat-status{
  display:flex;

  gap:10px;

  align-items:center;

  margin:
    12px 13px;

  padding:
    11px;

  border-radius:11px;
}

.aat-status>b{
  width:32px;
  height:32px;

  flex:0 0 32px;

  display:grid;
  place-items:center;

  border-radius:50%;
}

.aat-status strong,
.aat-status span{
  display:block;
}

.aat-status strong{
  font-size:10px;
}

.aat-status span{
  margin-top:2px;

  font-size:8px;
}

.aat-status.pass{
  border:
    1px solid
    rgba(
      74,
      231,
      180,
      .18
    );

  background:
    rgba(
      54,
      197,
      153,
      .08
    );

  color:#60eabb;
}

.aat-status.pass>b{
  background:
    rgba(
      79,
      226,
      181,
      .12
    );
}

.aat-status.fail{
  border:
    1px solid
    rgba(
      255,
      106,
      122,
      .18
    );

  background:
    rgba(
      221,
      72,
      88,
      .08
    );

  color:#ff909b;
}

.aat-status.fail>b{
  background:
    rgba(
      255,
      100,
      116,
      .12
    );
}

.aat-grid{
  display:grid;

  grid-template-columns:
    repeat(
      2,
      1fr
    );

  gap:7px;

  padding:
    0 13px;
}

.aat-grid>div{
  padding:
    10px;

  border:
    1px solid
    rgba(
      100,
      162,
      200,
      .12
    );

  border-radius:10px;

  background:
    rgba(
      255,
      255,
      255,
      .025
    );
}

.aat-grid span{
  display:block;

  color:#67879f;

  font-size:7px;

  font-weight:900;

  letter-spacing:1px;
}

.aat-grid strong{
  display:block;

  margin-top:3px;

  color:#e8f7ff;

  font-size:16px;
}

.aat-message{
  margin:
    11px 13px 0;

  padding:
    10px;

  border-radius:9px;

  background:
    rgba(
      63,
      123,
      160,
      .08
    );

  color:#7893a8;

  font-size:8px;

  line-height:1.55;
}

.aat-footer{
  display:flex;

  justify-content:
    space-between;

  align-items:center;

  gap:10px;

  padding:
    12px 13px;

  color:#57748a;

  font-size:7px;
}

.aat-footer button{
  min-height:30px;

  padding:
    0 9px;

  border:
    1px solid
    rgba(
      61,
      194,
      236,
      .18
    );

  border-radius:7px;

  background:
    rgba(
      48,
      163,
      207,
      .08
    );

  color:#69d8ff;

  cursor:pointer;

  font-size:7px;

  font-weight:900;
}

@media(max-width:600px){

  #aitrapAutoTestPanel{
    right:10px;
    bottom:10px;

    width:
      calc(
        100vw - 20px
      );
  }

}

    `;

    document.head.appendChild(
      style
    );
  }

  /* =======================================================
     PRODUCTION AUTO-RUN RULE

     PENTING:
     Tidak lagi memeriksa TEST- participant.

     HANYA:
     ?autotest=1
     ======================================================= */

  function shouldAutoRun() {
    const params =
      new URLSearchParams(
        window.location.search
      );

    return (
      params.get(
        "autotest"
      ) ===
      "1"
    );
  }

  /* =======================================================
     PUBLIC API
     ======================================================= */

  window.runAITRAPAutoTest =
    runAITRAPAutoTest;

  window.AITRAP_AUTO_TEST = {
    version: VERSION,

    run:
      runAITRAPAutoTest
  };

  installStyle();

  /* =======================================================
     AUTO RUN
     ======================================================= */

  if (shouldAutoRun()) {
    window.addEventListener(
      "load",
      () => {
        setTimeout(
          () => {
            runAITRAPAutoTest(
              true
            );
          },
          350
        );
      }
    );
  }

  console.log(
    "[AI TRAP LAB] Mission Auto Test",
    VERSION,
    shouldAutoRun()
      ? "QA MODE"
      : "STANDBY"
  );

})();