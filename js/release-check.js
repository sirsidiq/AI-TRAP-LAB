/* =========================================================
   AI TRAP LAB
   FINAL RELEASE CHECK
   Version 1.0.0

   READ-ONLY CHECK
   - Tidak menghapus localStorage
   - Tidak submit data
   - Tidak membuka mission
   - Tidak mengubah progress
   ========================================================= */

(function () {
  "use strict";

  const VERSION = "1.0.0";

  /* =======================================================
     CHECK DEFINITIONS
     ======================================================= */

  const functionChecks = [
    "getParticipant",
    "showScreen",

    "startPretest",
    "submitPretest",

    "renderMissionMap",
    "startMission",
    "submitMission",

    "calculateMissionScores",
    "saveMissionAttempt",
    "saveCompletedMission",

    "renderMissionResult",

    "startPosttest",
    "submitPosttest",

    "startCAL",
    "submitCAL",

    "startStudentResponse",

    "showFinalComplete",

    "hasCompletedPretest",
    "hasCompletedPosttest",
    "hasCompletedCAL",
    "hasCompletedStudentResponse",

    "getCompletedMissions",
    "allMissionsCompleted"
  ];

  const engineChecks = [
    {
      name:
        "Mission Gameplay Engine",
      test: () =>
        Boolean(
          window
            .AITRAP_MISSION_GAMEPLAY
        )
    },

    {
      name:
        "Result Screen Engine",
      test: () =>
        Boolean(
          window
            .AITRAP_RESULT
        )
    },

    {
      name:
        "Mission Auto Test",
      test: () =>
        Boolean(
          window
            .AITRAP_AUTO_TEST
        )
    }
  ];

  /* =======================================================
     HELPERS
     ======================================================= */

  function safeCheck(
    name,
    fn,
    category
  ) {
    try {
      const result =
        Boolean(fn());

      return {
        name,
        category,
        passed: result,
        error: null
      };
    }

    catch (error) {
      return {
        name,
        category,
        passed: false,
        error:
          error?.message ||
          String(error)
      };
    }
  }

  function existsFunction(
    name
  ) {
    return (
      typeof window[name] ===
      "function"
    );
  }

  function existsArray(
    name,
    minimum
  ) {
    try {
      const value =
        window.eval(name);

      return (
        Array.isArray(value) &&
        value.length === minimum
      );
    }

    catch {
      return false;
    }
  }

  /* =======================================================
     DATA CHECK
     ======================================================= */

  function checkMissions() {
    return (
      typeof missions !==
        "undefined" &&
      Array.isArray(missions) &&
      missions.length === 15
    );
  }

  function checkMissionIds() {
    if (!checkMissions()) {
      return false;
    }

    const ids =
      missions
        .map(
          mission =>
            Number(
              mission.id
            )
        )
        .sort(
          (a, b) =>
            a - b
        );

    return Array.from(
      { length: 15 },
      (_, index) =>
        index + 1
    ).every(
      (
        id,
        index
      ) =>
        ids[index] === id
    );
  }

  function checkMissionLevels() {
    if (!checkMissions()) {
      return false;
    }

    return missions.every(
      mission => {
        const level =
          Number(
            mission.level
          );

        return (
          level >= 1 &&
          level <= 5
        );
      }
    );
  }

  function checkMissionSchema() {
    if (!checkMissions()) {
      return false;
    }

    const fields = [
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

    return missions.every(
      mission =>
        fields.every(
          field =>
            mission[field] !==
            undefined
        )
    );
  }

  function checkPretest() {
    try {
      return (
        Array.isArray(
          pretestQuestions
        ) &&
        pretestQuestions.length ===
          10
      );
    }

    catch {
      return false;
    }
  }

  function checkPosttest() {
    try {
      return (
        Array.isArray(
          posttestQuestions
        ) &&
        posttestQuestions.length ===
          10
      );
    }

    catch {
      return false;
    }
  }

  function checkCAL() {
    try {
      return (
        Array.isArray(
          calQuestions
        ) &&
        calQuestions.length ===
          8
      );
    }

    catch {
      return false;
    }
  }

  function checkResponses() {
    try {
      return (
        Array.isArray(
          responseStatements
        ) &&
        responseStatements.length ===
          10
      );
    }

    catch {
      return false;
    }
  }

  /* =======================================================
     RESEARCH STRUCTURE
     ======================================================= */

  function checkCTIndicators() {
    try {
      const required = [
        "Decomposition",
        "Pattern Recognition",
        "Abstraction",
        "Algorithmic Thinking",
        "Evaluation"
      ];

      const pre =
        new Set(
          pretestQuestions.map(
            q =>
              q.indicator
          )
        );

      const post =
        new Set(
          posttestQuestions.map(
            q =>
              q.indicator
          )
        );

      return required.every(
        indicator =>
          pre.has(indicator) &&
          post.has(indicator)
      );
    }

    catch {
      return false;
    }
  }

  function checkCALDimensions() {
    try {
      const required = [
        "Questioning",
        "Verification",
        "Evidence Evaluation",
        "Bias Awareness",
        "Responsible Judgment"
      ];

      const found =
        new Set(
          calQuestions.map(
            q =>
              q.indicator
          )
        );

      return required.every(
        indicator =>
          found.has(indicator)
      );
    }

    catch {
      return false;
    }
  }

  /* =======================================================
     RESULT ENGINE
     ======================================================= */

  function checkResultXP() {
    return (
      window.AITRAP_RESULT &&
      typeof window
        .AITRAP_RESULT
        .getXP ===
        "function"
    );
  }

  function checkResultRank() {
    return (
      window.AITRAP_RESULT &&
      typeof window
        .AITRAP_RESULT
        .getRank ===
        "function"
    );
  }

  /* =======================================================
     GAMEPLAY ENGINE
     ======================================================= */

  function checkGameplayVersion() {
    return Boolean(
      window
        .AITRAP_MISSION_GAMEPLAY &&
      window
        .AITRAP_MISSION_GAMEPLAY
        .missions === 15
    );
  }

  function checkGameplayZones() {
    return Boolean(
      window
        .AITRAP_MISSION_GAMEPLAY &&
      window
        .AITRAP_MISSION_GAMEPLAY
        .zones === 5
    );
  }

  /* =======================================================
     RUN RELEASE CHECK
     ======================================================= */

  function runReleaseCheck(
    showVisual = true
  ) {
    const results = [];

    /* FUNCTIONS */

    functionChecks.forEach(
      name => {
        results.push(
          safeCheck(
            name,
            () =>
              existsFunction(
                name
              ),
            "CORE FUNCTIONS"
          )
        );
      }
    );

    /* ENGINES */

    engineChecks.forEach(
      item => {
        results.push(
          safeCheck(
            item.name,
            item.test,
            "ENGINES"
          )
        );
      }
    );

    /* CONTENT */

    results.push(
      safeCheck(
        "15 Missions Loaded",
        checkMissions,
        "MISSION DATA"
      )
    );

    results.push(
      safeCheck(
        "Mission IDs 1–15",
        checkMissionIds,
        "MISSION DATA"
      )
    );

    results.push(
      safeCheck(
        "Mission Levels 1–5",
        checkMissionLevels,
        "MISSION DATA"
      )
    );

    results.push(
      safeCheck(
        "Mission Schema",
        checkMissionSchema,
        "MISSION DATA"
      )
    );

    /* ASSESSMENTS */

    results.push(
      safeCheck(
        "Pretest CT = 10 items",
        checkPretest,
        "ASSESSMENTS"
      )
    );

    results.push(
      safeCheck(
        "Posttest CT = 10 items",
        checkPosttest,
        "ASSESSMENTS"
      )
    );

    results.push(
      safeCheck(
        "CAL = 8 cases",
        checkCAL,
        "ASSESSMENTS"
      )
    );

    results.push(
      safeCheck(
        "Student Response = 10 items",
        checkResponses,
        "ASSESSMENTS"
      )
    );

    results.push(
      safeCheck(
        "5 CT Indicators",
        checkCTIndicators,
        "RESEARCH"
      )
    );

    results.push(
      safeCheck(
        "5 CAL Dimensions",
        checkCALDimensions,
        "RESEARCH"
      )
    );

    /* GAMEPLAY */

    results.push(
      safeCheck(
        "Gameplay 15 Missions",
        checkGameplayVersion,
        "GAMEPLAY"
      )
    );

    results.push(
      safeCheck(
        "Gameplay 5 Zones",
        checkGameplayZones,
        "GAMEPLAY"
      )
    );

    /* RESULT */

    results.push(
      safeCheck(
        "XP Engine",
        checkResultXP,
        "RESULT"
      )
    );

    results.push(
      safeCheck(
        "Rank Engine",
        checkResultRank,
        "RESULT"
      )
    );

    /* SUMMARY */

    const passed =
      results.filter(
        item =>
          item.passed
      ).length;

    const failed =
      results.length -
      passed;

    const report = {
      version:
        VERSION,

      checkedAt:
        new Date()
          .toISOString(),

      total:
        results.length,

      passed,
      failed,

      ready:
        failed === 0,

      results
    };

    window
      .AITRAP_RELEASE_CHECK_RESULT =
      report;

    console.group(
      "%cAI TRAP LAB — RELEASE CHECK",
      "color:#00c896;font-weight:bold;font-size:14px"
    );

    console.table(
      results.map(
        item => ({
          Category:
            item.category,

          Check:
            item.name,

          Status:
            item.passed
              ? "PASS"
              : "FAIL",

          Error:
            item.error ||
            ""
        })
      )
    );

    console.log(
      failed === 0
        ? `RELEASE READY — ${passed}/${results.length} PASS`
        : `NOT READY — ${failed} check(s) failed`
    );

    console.groupEnd();

    if (showVisual) {
      showReleasePanel(
        report
      );
    }

    return report;
  }

  /* =======================================================
     VISUAL REPORT
     ======================================================= */

  function showReleasePanel(
    report
  ) {
    document
      .getElementById(
        "aitrapReleaseCheckPanel"
      )
      ?.remove();

    const panel =
      document
        .createElement(
          "div"
        );

    panel.id =
      "aitrapReleaseCheckPanel";

    const grouped = {};

    report.results
      .forEach(
        item => {
          if (
            !grouped[
              item.category
            ]
          ) {
            grouped[
              item.category
            ] = [];
          }

          grouped[
            item.category
          ].push(item);
        }
      );

    const categories =
      Object.entries(
        grouped
      )
        .map(
          (
            [
              category,
              items
            ]
          ) => {
            const success =
              items.filter(
                item =>
                  item.passed
              ).length;

            return `
              <div class="rc-category">

                <div class="rc-category-head">

                  <span>
                    ${category}
                  </span>

                  <strong>
                    ${success}/${items.length}
                  </strong>

                </div>

                ${items
                  .map(
                    item => `
                      <div
                        class="
                          rc-item
                          ${
                            item.passed
                              ? "pass"
                              : "fail"
                          }
                        "
                      >

                        <b>
                          ${
                            item.passed
                              ? "✓"
                              : "×"
                          }
                        </b>

                        <span>
                          ${item.name}
                        </span>

                      </div>
                    `
                  )
                  .join("")}

              </div>
            `;
          }
        )
        .join("");

    panel.innerHTML = `

      <div class="rc-card">

        <div class="rc-top">

          <div>

            <small>
              AI TRAP LAB
            </small>

            <h2>
              FINAL RELEASE CHECK
            </h2>

          </div>

          <button
            onclick="
              document
                .getElementById(
                  'aitrapReleaseCheckPanel'
                )
                .remove()
            "
          >
            ×
          </button>

        </div>

        <div
          class="
            rc-status
            ${
              report.ready
                ? "ready"
                : "failed"
            }
          "
        >

          <span>
            ${
              report.ready
                ? "✓"
                : "!"
            }
          </span>

          <div>

            <strong>
              ${
                report.ready
                  ? "RELEASE READY"
                  : "CHECK FAILED"
              }
            </strong>

            <small>
              ${report.passed}/${report.total}
              checks passed
            </small>

          </div>

        </div>

        <div class="rc-list">

          ${categories}

        </div>

        <div class="rc-footer">

          <span>
            Release Check
            v${VERSION}
          </span>

          <button
            onclick="
              window
                .runAITRAPReleaseCheck(
                  true
                )
            "
          >
            ↻ RUN AGAIN
          </button>

        </div>

      </div>
    `;

    document.body
      .appendChild(
        panel
      );
  }

  /* =======================================================
     CSS
     ======================================================= */

  function installStyle() {
    if (
      document
        .getElementById(
          "aitrapReleaseCheckCSS"
        )
    ) {
      return;
    }

    const style =
      document
        .createElement(
          "style"
        );

    style.id =
      "aitrapReleaseCheckCSS";

    style.textContent = `

#aitrapReleaseCheckPanel{
  position:fixed;
  inset:0;
  z-index:9999999;
  display:grid;
  place-items:center;
  padding:20px;
  background:
    rgba(2,10,20,.72);
  backdrop-filter:
    blur(8px);
}

.rc-card{
  width:min(
    620px,
    100%
  );
  max-height:
    calc(
      100vh - 40px
    );
  overflow:auto;
  border:
    1px solid
    rgba(
      91,
      213,
      255,
      .25
    );
  border-radius:22px;
  background:
    linear-gradient(
      145deg,
      #091a2d,
      #06111f
    );
  color:#eef8ff;
  box-shadow:
    0 30px 80px
    rgba(
      0,
      0,
      0,
      .42
    );
}

.rc-top{
  display:flex;
  justify-content:
    space-between;
  align-items:center;
  gap:20px;
  padding:20px 22px;
  border-bottom:
    1px solid
    rgba(
      255,
      255,
      255,
      .07
    );
}

.rc-top small{
  display:block;
  color:#43d1ff;
  font-size:9px;
  font-weight:900;
  letter-spacing:2px;
}

.rc-top h2{
  margin:4px 0 0;
  color:#f3fbff;
  font-size:20px;
}

.rc-top button{
  width:36px;
  height:36px;
  border:
    1px solid
    rgba(
      255,
      255,
      255,
      .1
    );
  border-radius:10px;
  background:
    rgba(
      255,
      255,
      255,
      .05
    );
  color:#91a9bd;
  cursor:pointer;
  font-size:22px;
}

.rc-status{
  display:flex;
  gap:13px;
  align-items:center;
  margin:16px 20px;
  padding:15px;
  border-radius:14px;
}

.rc-status>span{
  width:38px;
  height:38px;
  display:grid;
  place-items:center;
  flex:0 0 38px;
  border-radius:50%;
  font-weight:900;
}

.rc-status strong,
.rc-status small{
  display:block;
}

.rc-status small{
  margin-top:3px;
  font-size:10px;
}

.rc-status.ready{
  border:
    1px solid
    rgba(
      64,
      231,
      176,
      .22
    );
  background:
    rgba(
      32,
      174,
      130,
      .1
    );
  color:#63ebbe;
}

.rc-status.ready>span{
  background:
    rgba(
      70,
      232,
      180,
      .12
    );
}

.rc-status.failed{
  border:
    1px solid
    rgba(
      255,
      100,
      116,
      .22
    );
  background:
    rgba(
      222,
      70,
      87,
      .1
    );
  color:#ff8c98;
}

.rc-status.failed>span{
  background:
    rgba(
      255,
      100,
      116,
      .12
    );
}

.rc-list{
  padding:
    0 20px 20px;
}

.rc-category{
  margin-top:14px;
  padding:14px;
  border:
    1px solid
    rgba(
      123,
      177,
      212,
      .12
    );
  border-radius:13px;
  background:
    rgba(
      255,
      255,
      255,
      .025
    );
}

.rc-category-head{
  display:flex;
  justify-content:
    space-between;
  gap:10px;
  margin-bottom:9px;
  color:#81a1ba;
  font-size:9px;
  font-weight:900;
  letter-spacing:1.2px;
}

.rc-category-head strong{
  color:#58d5ff;
}

.rc-item{
  display:flex;
  align-items:center;
  gap:9px;
  padding:7px 0;
  border-bottom:
    1px solid
    rgba(
      255,
      255,
      255,
      .04
    );
  color:#a7bac9;
  font-size:10px;
}

.rc-item:last-child{
  border-bottom:none;
}

.rc-item b{
  width:21px;
  height:21px;
  display:grid;
  place-items:center;
  border-radius:6px;
}

.rc-item.pass b{
  background:
    rgba(
      58,
      221,
      169,
      .11
    );
  color:#5ce8ba;
}

.rc-item.fail{
  color:#ff9ba5;
}

.rc-item.fail b{
  background:
    rgba(
      255,
      91,
      107,
      .12
    );
  color:#ff7b88;
}

.rc-footer{
  display:flex;
  justify-content:
    space-between;
  align-items:center;
  gap:15px;
  padding:16px 20px;
  border-top:
    1px solid
    rgba(
      255,
      255,
      255,
      .06
    );
  color:#617e96;
  font-size:9px;
}

.rc-footer button{
  min-height:34px;
  padding:0 11px;
  border:
    1px solid
    rgba(
      71,
      202,
      244,
      .2
    );
  border-radius:8px;
  background:
    rgba(
      42,
      167,
      211,
      .08
    );
  color:#70dcff;
  cursor:pointer;
  font-size:9px;
  font-weight:900;
}

@media(max-width:600px){

  #aitrapReleaseCheckPanel{
    padding:10px;
  }

  .rc-card{
    max-height:
      calc(
        100vh - 20px
      );
    border-radius:16px;
  }

}

    `;

    document.head
      .appendChild(
        style
      );
  }

  /* =======================================================
     PUBLIC API
     ======================================================= */

  window
    .runAITRAPReleaseCheck =
    runReleaseCheck;

  window.AITRAP_RELEASE_CHECK = {
    version: VERSION,
    run:
      runReleaseCheck
  };

  installStyle();

  /* =======================================================
     AUTO RUN

     Hanya berjalan kalau URL:
     ?releasecheck=1
     ======================================================= */

  const params =
    new URLSearchParams(
      window.location.search
    );

  if (
    params.get(
      "releasecheck"
    ) ===
    "1"
  ) {
    window.addEventListener(
      "load",
      () => {
        setTimeout(
          () =>
            runReleaseCheck(
              true
            ),
          350
        );
      }
    );
  }

})();