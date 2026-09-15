/* =========================================================
   AI TRAP LAB
   FINAL COMPLETE EXPERIENCE
   Version 1.0.1

   Purpose:
   - Upgrade final completion screen
   - Preserve original app.js logic
   - Show mission completion
   - Show XP + Rank
   - Reinforce verification learning cycle
   ========================================================= */

(function () {
  "use strict";

  const VERSION = "1.0.1";

  const originalShowFinalComplete =
    typeof window.showFinalComplete === "function"
      ? window.showFinalComplete
      : null;

  /* =======================================================
     HELPERS
     ======================================================= */

  function safeText(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getParticipantSafe() {
    try {
      return typeof getParticipant === "function"
        ? getParticipant()
        : {
            code: "",
            className: ""
          };
    } catch {
      return {
        code: "",
        className: ""
      };
    }
  }

  function getCompletedSafe() {
    try {
      return typeof getCompletedMissions === "function"
        ? getCompletedMissions()
        : [];
    } catch {
      return [];
    }
  }

  function getXP() {
    try {
      if (
        window.AITRAP_RESULT &&
        typeof window.AITRAP_RESULT.getXP === "function"
      ) {
        return (
          Number(
            window.AITRAP_RESULT.getXP()
          ) || 0
        );
      }
    } catch {}

    return 0;
  }

  function getRank() {
    try {
      if (
        window.AITRAP_RESULT &&
        typeof window.AITRAP_RESULT.getRank === "function"
      ) {
        return window.AITRAP_RESULT.getRank();
      }
    } catch {}

    return {
      name: "Investigator",
      short: "INVESTIGATOR",
      icon: "◇"
    };
  }

  /* =======================================================
     FINAL DATA
     ======================================================= */

  function getFinalData() {
    const participant =
      getParticipantSafe();

    const completed =
      getCompletedSafe();

    const xp =
      getXP();

    const rank =
      getRank();

    return {
      participant,

      completedCount:
        completed.length,

      xp,
      rank
    };
  }

  /* =======================================================
     FINAL DASHBOARD
     ======================================================= */

  function createDashboard() {
    const screen =
      document.getElementById(
        "screenFinalComplete"
      );

    if (!screen) {
      console.warn(
        "[FINAL] screenFinalComplete not found."
      );

      return null;
    }

    let dashboard =
      document.getElementById(
        "aitrapFinalDashboard"
      );

    if (!dashboard) {
      dashboard =
        document.createElement(
          "div"
        );

      dashboard.id =
        "aitrapFinalDashboard";

      dashboard.className =
        "afc-dashboard";

      screen.insertBefore(
        dashboard,
        screen.firstChild
      );
    }

    return dashboard;
  }

  /* =======================================================
     RENDER FINAL
     ======================================================= */

  function renderFinalComplete() {
    const dashboard =
      createDashboard();

    if (!dashboard) {
      return;
    }

    const data =
      getFinalData();

    const participant =
      data.participant;

    const missionComplete =
      data.completedCount >= 15;

    dashboard.innerHTML = `

      <section class="afc-shell">

        <!-- SUCCESS HEADER -->

        <div class="afc-hero">

          <div class="afc-orbit">

            <div class="afc-orbit-ring ring-one"></div>

            <div class="afc-orbit-ring ring-two"></div>

            <div class="afc-core">
              ✓
            </div>

          </div>


          <div class="afc-hero-copy">

            <span class="afc-eyebrow">
              AI TRAP LAB
              · FINAL INVESTIGATION
            </span>

            <h1>
              Investigation

              <span>
                Completed
              </span>
            </h1>

            <p>
              Seluruh rangkaian investigasi telah diselesaikan.
              Kamu telah melalui proses memeriksa klaim AI,
              mencari bukti, melakukan pengujian, memperbaiki
              kesimpulan, dan memberikan alasan.
            </p>

          </div>

        </div>


        <!-- PARTICIPANT -->

        <div class="afc-participant">

          <div>

            <span>
              INVESTIGATOR
            </span>

            <strong>
              ${
                safeText(
                  participant.code ||
                  "INVESTIGATOR"
                )
              }
            </strong>

            <small>
              ${
                safeText(
                  participant.className ||
                  "-"
                )
              }
            </small>

          </div>


          <div class="afc-status-badge">

            <b>
              ✓
            </b>

            COMPLETE

          </div>

        </div>


        <!-- MAIN STATS -->

        <div class="afc-stats">

          <article>

            <span>
              MISSIONS
            </span>

            <strong>
              ${data.completedCount}

              <small>
                /15
              </small>
            </strong>

            <p>
              ${
                missionComplete
                  ? "Seluruh mission selesai"
                  : "Progress mission"
              }
            </p>

          </article>


          <article>

            <span>
              TOTAL XP
            </span>

            <strong>
              ${data.xp}

              <small>
                /1500
              </small>
            </strong>

            <p>
              Best score setiap mission
            </p>

          </article>


          <article>

            <span>
              FINAL RANK
            </span>

            <strong class="afc-rank">
              ${
                safeText(
                  data.rank.icon ||
                  "◇"
                )
              }
            </strong>

            <p>
              ${
                safeText(
                  data.rank.name ||
                  "Investigator"
                )
              }
            </p>

          </article>

        </div>


        <!-- JOURNEY -->

        <section class="afc-panel">

          <div class="afc-panel-head">

            <div>

              <span>
                VERIFICATION JOURNEY
              </span>

              <h2>
                Lima Zona Investigasi
              </h2>

            </div>

            <strong>
              5 / 5
            </strong>

          </div>


          <div class="afc-zones">

            <div class="afc-zone done">

              <b>
                01
              </b>

              <div>

                <strong>
                  Pattern Reactor
                </strong>

                <span>
                  Pattern Trap
                </span>

              </div>

              <i>
                ✓
              </i>

            </div>


            <div class="afc-zone done">

              <b>
                02
              </b>

              <div>

                <strong>
                  Sequence Workshop
                </strong>

                <span>
                  Sequence Trap
                </span>

              </div>

              <i>
                ✓
              </i>

            </div>


            <div class="afc-zone done">

              <b>
                03
              </b>

              <div>

                <strong>
                  Logic Chamber
                </strong>

                <span>
                  Logic Trap
                </span>

              </div>

              <i>
                ✓
              </i>

            </div>


            <div class="afc-zone done">

              <b>
                04
              </b>

              <div>

                <strong>
                  Optimization Arena
                </strong>

                <span>
                  Efficiency Trap
                </span>

              </div>

              <i>
                ✓
              </i>

            </div>


            <div class="afc-zone done">

              <b>
                05
              </b>

              <div>

                <strong>
                  Evidence Vault
                </strong>

                <span>
                  Verification Trap
                </span>

              </div>

              <i>
                ✓
              </i>

            </div>

          </div>

        </section>


        <!-- CCTCJ -->

        <section class="afc-panel afc-cycle-panel">

          <div class="afc-panel-head">

            <div>

              <span>
                CRITICAL VERIFICATION CYCLE
              </span>

              <h2>
                CLAIM → CHECK → TEST → CORRECT → JUSTIFY
              </h2>

            </div>

          </div>


          <div class="afc-cycle">

            <div>

              <b>
                C
              </b>

              <strong>
                CLAIM
              </strong>

              <span>
                Kenali klaim AI
              </span>

            </div>

            <i>
              →
            </i>


            <div>

              <b>
                C
              </b>

              <strong>
                CHECK
              </strong>

              <span>
                Cari evidence relevan
              </span>

            </div>

            <i>
              →
            </i>


            <div>

              <b>
                T
              </b>

              <strong>
                TEST
              </strong>

              <span>
                Lakukan pengujian
              </span>

            </div>

            <i>
              →
            </i>


            <div>

              <b>
                C
              </b>

              <strong>
                CORRECT
              </strong>

              <span>
                Perbaiki keputusan
              </span>

            </div>

            <i>
              →
            </i>


            <div>

              <b>
                J
              </b>

              <strong>
                JUSTIFY
              </strong>

              <span>
                Berikan alasan
              </span>

            </div>

          </div>

        </section>


        <!-- FINAL MESSAGE -->

        <section class="afc-final-message">

          <div class="afc-message-icon">
            ◈
          </div>


          <div>

            <span>
              FINAL MESSAGE
            </span>

            <h2>
              Jangan hanya bertanya:
              “Apakah AI benar?”
            </h2>

            <p>
              Biasakan juga bertanya:

              <strong>
                “Apa buktinya, bagaimana cara mengujinya,
                dan apakah alasannya dapat dipertanggungjawabkan?”
              </strong>
            </p>

          </div>

        </section>


        <!-- RESEARCH NOTE -->

        <div class="afc-note">

          <div class="afc-note-icon">
            ◉
          </div>

          <b>
            DATA COMPLETE
          </b>

          <p>
            Pretest, mission, posttest, Critical AI Literacy,
            dan respons pembelajaran telah diselesaikan.
            XP dan rank digunakan sebagai elemen gamifikasi,
            bukan sebagai skor penelitian utama.
          </p>

        </div>


        <!-- FOOTER -->

        <div class="afc-footer">

          <div>

            <span>
              AI TRAP LAB
            </span>

            <small>
              Think Critically.
              Verify Systematically.
            </small>

          </div>


          <button
            type="button"
            onclick="
              window.AITRAP_FINAL.backToMap()
            "
          >
            LIHAT MISSION JOURNEY
            <b>→</b>
          </button>

        </div>

      </section>
    `;

    hideOldFinal();
  }

  /* =======================================================
     HIDE OLD FINAL
     ======================================================= */

  function hideOldFinal() {
    const screen =
      document.getElementById(
        "screenFinalComplete"
      );

    const dashboard =
      document.getElementById(
        "aitrapFinalDashboard"
      );

    if (
      !screen ||
      !dashboard
    ) {
      return;
    }

    Array.from(
      screen.children
    ).forEach(
      child => {
        if (
          child !== dashboard
        ) {
          child.classList.add(
            "afc-old-hidden"
          );
        }
      }
    );
  }

  /* =======================================================
     NAVIGATION
     ======================================================= */

  function backToMap() {
    if (
      typeof renderMissionMap ===
      "function"
    ) {
      renderMissionMap();
    }

    if (
      typeof showScreen ===
      "function"
    ) {
      showScreen(
        "screenMap"
      );
    }
  }

  /* =======================================================
     SHOW OVERRIDE
     ======================================================= */

  function enhancedShowFinalComplete() {
    if (
      originalShowFinalComplete
    ) {
      originalShowFinalComplete();
    }

    renderFinalComplete();
  }

  /* =======================================================
     STYLE
     ======================================================= */

  function installStyle() {
    const old =
      document.getElementById(
        "aitrapFinalCompleteCSS"
      );

    if (old) {
      old.remove();
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "aitrapFinalCompleteCSS";

    style.textContent = `

/* =========================================================
   FINAL COMPLETE
   ========================================================= */

#screenFinalComplete{
  position:relative;
}

.afc-old-hidden{
  display:none!important;
}

.afc-dashboard{
  width:min(
    1180px,
    calc(100% - 32px)
  );

  margin:
    30px auto 60px;
}

.afc-shell{
  display:flex;
  flex-direction:column;
  gap:18px;
}


/* =========================================================
   HERO
   ========================================================= */

.afc-hero{
  position:relative;
  overflow:hidden;

  display:grid;

  grid-template-columns:
    auto 1fr;

  gap:34px;

  align-items:center;

  min-height:300px;

  padding:38px;

  border:
    1px solid
    rgba(
      60,
      215,
      255,
      .22
    );

  border-radius:28px;

  background:

    radial-gradient(
      circle at 16% 45%,
      rgba(
        41,
        211,
        255,
        .16
      ),
      transparent 30%
    ),

    radial-gradient(
      circle at 90% 15%,
      rgba(
        130,
        93,
        255,
        .16
      ),
      transparent 35%
    ),

    linear-gradient(
      135deg,
      #07192d,
      #08142a
    );

  box-shadow:
    0 25px 70px
    rgba(
      0,
      0,
      0,
      .26
    );
}

.afc-hero::before{
  content:"";

  position:absolute;
  inset:0;

  pointer-events:none;

  opacity:.15;

  background-image:

    linear-gradient(
      rgba(
        75,
        211,
        255,
        .15
      )
      1px,
      transparent 1px
    ),

    linear-gradient(
      90deg,
      rgba(
        75,
        211,
        255,
        .15
      )
      1px,
      transparent 1px
    );

  background-size:
    35px 35px;
}


/* =========================================================
   ORBIT
   ========================================================= */

.afc-orbit{
  width:190px;
  height:190px;

  position:relative;

  display:grid;
  place-items:center;
}

.afc-orbit-ring{
  position:absolute;

  border-radius:50%;
}

.afc-orbit-ring.ring-one{
  inset:0;

  border:
    1px solid
    rgba(
      75,
      219,
      255,
      .35
    );
}

.afc-orbit-ring.ring-two{
  inset:22px;

  border:
    1px dashed
    rgba(
      123,
      103,
      255,
      .38
    );
}

.afc-core{
  width:105px;
  height:105px;

  display:grid;
  place-items:center;

  position:relative;
  z-index:1;

  border-radius:32px;

  background:
    linear-gradient(
      135deg,
      #22d3a6,
      #2f99ef
    );

  color:white;

  font-size:46px;
  font-weight:900;

  box-shadow:
    0 0 45px
    rgba(
      58,
      216,
      255,
      .28
    );
}


/* =========================================================
   HERO TEXT
   ========================================================= */

.afc-hero-copy{
  position:relative;
  z-index:1;
}

.afc-eyebrow{
  display:block;

  margin-bottom:12px;

  color:#55d6ff;

  font-size:11px;
  font-weight:900;
  letter-spacing:2px;
}

.afc-hero h1{
  margin:0;

  color:#f4f9ff;

  font-size:
    clamp(
      48px,
      6vw,
      82px
    );

  line-height:.96;

  letter-spacing:-3px;
}

.afc-hero h1 span{
  display:block;

  margin-top:8px;

  background:
    linear-gradient(
      90deg,
      #56e9bd,
      #4bcfff,
      #9681ff
    );

  -webkit-background-clip:text;

  background-clip:text;

  color:transparent;
}

.afc-hero p{
  max-width:720px;

  margin:
    22px 0 0;

  color:#9fb4c9;

  font-size:15px;

  line-height:1.75;
}


/* =========================================================
   PARTICIPANT
   ========================================================= */

.afc-participant{
  display:flex;

  justify-content:
    space-between;

  align-items:center;

  gap:20px;

  padding:
    20px 24px;

  border:
    1px solid
    rgba(
      79,
      171,
      217,
      .16
    );

  border-radius:17px;

  background:
    rgba(
      8,
      24,
      41,
      .85
    );
}

.afc-participant span,
.afc-participant strong,
.afc-participant small{
  display:block;
}

.afc-participant span{
  color:#6689a4;

  font-size:9px;
  font-weight:900;

  letter-spacing:1.6px;
}

.afc-participant strong{
  margin-top:3px;

  color:#ecf8ff;

  font-size:19px;
}

.afc-participant small{
  margin-top:2px;

  color:#6e92ad;
}

.afc-status-badge{
  display:flex;

  align-items:center;

  gap:8px;

  color:#61eab9;

  font-size:10px;
  font-weight:900;

  letter-spacing:1px;
}

.afc-status-badge b{
  width:31px;
  height:31px;

  display:grid;
  place-items:center;

  border-radius:50%;

  background:
    rgba(
      75,
      229,
      178,
      .12
    );
}


/* =========================================================
   STATS
   ========================================================= */

.afc-stats{
  display:grid;

  grid-template-columns:
    repeat(
      3,
      1fr
    );

  gap:14px;
}

.afc-stats article{
  padding:24px;

  border:
    1px solid
    rgba(
      88,
      165,
      211,
      .14
    );

  border-radius:18px;

  background:
    linear-gradient(
      145deg,

      rgba(
        9,
        27,
        46,
        .96
      ),

      rgba(
        6,
        18,
        33,
        .96
      )
    );
}

.afc-stats span{
  display:block;

  color:#5e88a7;

  font-size:9px;
  font-weight:900;

  letter-spacing:1.5px;
}

.afc-stats strong{
  display:block;

  margin-top:10px;

  color:#f1f8ff;

  font-size:42px;

  line-height:1;
}

.afc-stats strong small{
  color:#66839a;

  font-size:14px;
}

.afc-stats p{
  margin:
    10px 0 0;

  color:#778da0;

  font-size:10px;
}

.afc-rank{
  color:#5ee5bd!important;
}


/* =========================================================
   PANEL
   ========================================================= */

.afc-panel{
  padding:26px;

  border:
    1px solid
    rgba(
      88,
      165,
      211,
      .14
    );

  border-radius:21px;

  background:
    rgba(
      7,
      23,
      40,
      .92
    );
}

.afc-panel-head{
  display:flex;

  justify-content:
    space-between;

  align-items:center;

  gap:20px;

  margin-bottom:20px;
}

.afc-panel-head span{
  display:block;

  color:#4dcfff;

  font-size:9px;
  font-weight:900;

  letter-spacing:1.6px;
}

.afc-panel-head h2{
  margin:
    5px 0 0;

  color:#edf8ff;

  font-size:22px;
}

.afc-panel-head>strong{
  color:#60e6ba;

  font-size:22px;
}


/* =========================================================
   ZONES
   ========================================================= */

.afc-zones{
  display:grid;

  grid-template-columns:
    repeat(
      5,
      1fr
    );

  gap:10px;
}

.afc-zone{
  min-height:120px;

  display:flex;

  flex-direction:column;

  justify-content:
    space-between;

  padding:15px;

  border:
    1px solid
    rgba(
      100,
      158,
      196,
      .14
    );

  border-radius:14px;

  background:
    rgba(
      11,
      34,
      54,
      .58
    );
}

.afc-zone>b{
  color:#4fcfff;

  font-size:9px;

  letter-spacing:1.5px;
}

.afc-zone div strong,
.afc-zone div span{
  display:block;
}

.afc-zone div strong{
  color:#e1f0fa;

  font-size:12px;
}

.afc-zone div span{
  margin-top:3px;

  color:#6b879c;

  font-size:9px;
}

.afc-zone i{
  width:25px;
  height:25px;

  display:grid;
  place-items:center;

  align-self:flex-end;

  border-radius:50%;

  background:
    rgba(
      79,
      231,
      183,
      .1
    );

  color:#5ce7b7;

  font-style:normal;

  font-size:10px;
}


/* =========================================================
   CYCLE
   ========================================================= */

.afc-cycle{
  display:grid;

  grid-template-columns:
    repeat(
      9,
      auto
    );

  align-items:center;

  justify-content:center;

  gap:11px;
}

.afc-cycle>div{
  min-width:125px;

  min-height:120px;

  display:flex;

  flex-direction:column;

  align-items:center;

  justify-content:center;

  padding:15px;

  border:
    1px solid
    rgba(
      68,
      198,
      239,
      .16
    );

  border-radius:15px;

  background:
    rgba(
      16,
      47,
      70,
      .4
    );

  text-align:center;
}

.afc-cycle>div b{
  width:34px;
  height:34px;

  display:grid;
  place-items:center;

  margin-bottom:9px;

  border-radius:10px;

  background:
    linear-gradient(
      135deg,
      #238ed6,
      #6b63ea
    );

  color:white;
}

.afc-cycle>div strong{
  color:#eaf7ff;

  font-size:10px;
}

.afc-cycle>div span{
  margin-top:4px;

  color:#6f8a9e;

  font-size:8px;
}

.afc-cycle>i{
  color:#3d91bf;

  font-style:normal;
}


/* =========================================================
   FINAL MESSAGE — HIGH CONTRAST LIGHT PANEL
   ========================================================= */

.afc-final-message{
  display:flex;

  align-items:flex-start;

  gap:20px;

  padding:
    30px 32px;

  border:
    1px solid
    #82baff;

  border-radius:22px;

  background:
    linear-gradient(
      120deg,
      #edf8ff 0%,
      #f3f8ff 45%,
      #f1edff 100%
    );

  box-shadow:
    0 16px 38px
    rgba(
      52,
      104,
      166,
      .12
    );
}

.afc-message-icon{
  width:60px;
  height:60px;

  flex:
    0 0 60px;

  display:grid;
  place-items:center;

  border-radius:17px;

  background:
    linear-gradient(
      135deg,
      #1479ed,
      #5f4df0
    );

  color:#ffffff;

  font-size:26px;

  box-shadow:
    0 12px 28px
    rgba(
      69,
      89,
      225,
      .22
    );
}

.afc-final-message span{
  display:block;

  color:#146bd6;

  font-size:10px;

  font-weight:900;

  letter-spacing:1.8px;
}

.afc-final-message h2{
  margin:
    7px 0 11px;

  color:#142f56;

  font-size:24px;

  font-weight:900;

  line-height:1.35;
}

.afc-final-message p{
  margin:0;

  color:#405b78;

  font-size:14px;

  line-height:1.75;
}

.afc-final-message p strong{
  color:#0967d9;

  font-weight:900;
}


/* =========================================================
   DATA COMPLETE — DARK CONTRAST BAR
   ========================================================= */

.afc-note{
  display:flex;

  align-items:center;

  gap:18px;

  padding:
    17px 20px;

  border:none;

  border-radius:15px;

  background:
    linear-gradient(
      100deg,
      #084e6c,
      #123e67
    );

  box-shadow:
    0 12px 28px
    rgba(
      12,
      54,
      89,
      .16
    );
}

.afc-note-icon{
  width:35px;
  height:35px;

  flex:
    0 0 35px;

  display:grid;
  place-items:center;

  border-radius:10px;

  background:
    rgba(
      76,
      239,
      206,
      .10
    );

  color:#55efce;

  font-size:16px;
}

.afc-note b{
  flex:0 0 auto;

  padding-right:18px;

  border-right:
    1px solid
    rgba(
      255,
      255,
      255,
      .18
    );

  color:#55efce;

  font-size:10px;

  font-weight:900;

  letter-spacing:1.6px;
}

.afc-note p{
  margin:0;

  color:#f1f9ff;

  font-size:11px;

  line-height:1.65;
}


/* =========================================================
   FOOTER
   ========================================================= */

.afc-footer{
  display:flex;

  justify-content:
    space-between;

  align-items:center;

  gap:20px;

  margin-top:7px;

  padding:
    4px 0;
}

.afc-footer span,
.afc-footer small{
  display:block;
}

.afc-footer span{
  color:#208ad0;

  font-size:10px;

  font-weight:900;

  letter-spacing:1.5px;
}

.afc-footer small{
  margin-top:4px;

  color:#526d86;

  font-size:9px;
}

.afc-footer button{
  min-height:46px;

  padding:
    0 19px;

  border:none;

  border-radius:12px;

  background:
    linear-gradient(
      135deg,
      #167ba9,
      #2467d2
    );

  color:white;

  cursor:pointer;

  font:inherit;

  font-size:9px;

  font-weight:900;

  letter-spacing:.7px;

  box-shadow:
    0 10px 25px
    rgba(
      29,
      102,
      177,
      .18
    );

  transition:
    transform .15s ease,
    box-shadow .15s ease;
}

.afc-footer button:hover{
  transform:
    translateY(-2px);

  box-shadow:
    0 14px 30px
    rgba(
      29,
      102,
      177,
      .24
    );
}

.afc-footer button b{
  margin-left:8px;

  font-size:15px;
}


/* =========================================================
   TABLET
   ========================================================= */

@media(max-width:950px){

  .afc-zones{
    grid-template-columns:
      repeat(
        2,
        1fr
      );
  }

  .afc-cycle{
    grid-template-columns:
      1fr;
  }

  .afc-cycle>i{
    transform:
      rotate(
        90deg
      );

    text-align:center;
  }

}


/* =========================================================
   MOBILE
   ========================================================= */

@media(max-width:700px){

  .afc-dashboard{
    width:
      calc(
        100% - 20px
      );

    margin-top:16px;
  }

  .afc-hero{
    grid-template-columns:
      1fr;

    padding:
      24px 18px;

    text-align:center;
  }

  .afc-orbit{
    width:150px;
    height:150px;

    margin:auto;
  }

  .afc-core{
    width:86px;
    height:86px;

    font-size:36px;
  }

  .afc-hero h1{
    font-size:47px;

    letter-spacing:-2px;
  }

  .afc-stats{
    grid-template-columns:
      1fr;
  }

  .afc-zones{
    grid-template-columns:
      1fr;
  }

  .afc-zone{
    min-height:100px;
  }

  .afc-participant{
    align-items:flex-start;

    flex-direction:column;
  }

  .afc-final-message{
    flex-direction:column;

    padding:
      22px 20px;
  }

  .afc-message-icon{
    width:52px;
    height:52px;

    flex-basis:52px;

    font-size:22px;
  }

  .afc-final-message h2{
    font-size:20px;
  }

  .afc-final-message p{
    font-size:12px;
  }

  .afc-note{
    align-items:flex-start;

    flex-direction:column;

    gap:10px;
  }

  .afc-note b{
    width:100%;

    padding-right:0;
    padding-bottom:8px;

    border-right:none;

    border-bottom:
      1px solid
      rgba(
        255,
        255,
        255,
        .15
      );
  }

  .afc-footer{
    align-items:flex-start;

    flex-direction:column;
  }

  .afc-footer button{
    width:100%;
  }

}

    `;

    document.head.appendChild(
      style
    );
  }

  /* =======================================================
     INSTALL
     ======================================================= */

  installStyle();

  window.showFinalComplete =
    enhancedShowFinalComplete;

  window.AITRAP_FINAL = {
    version: VERSION,

    render:
      renderFinalComplete,

    backToMap
  };

  console.log(
    "[AI TRAP LAB] Final Complete",
    VERSION,
    "READY"
  );

})();