// =========================================================
// AI TRAP LAB
// RESULT SCREEN + XP / RANK ENGINE
// Release Candidate
// =========================================================
//
// IMPORTANT:
// - Game Score / XP = gamification only.
// - Research scores remain Pretest/Posttest/CAL.
// - Raw JUSTIFY remains stored by app.js.
// - This file does NOT change mission scoring.
// - Load this file AFTER app.js and mission-gameplay.js.
//
// =========================================================

(function () {
  "use strict";

  // =======================================================
  // CONFIG
  // =======================================================

  const CONFIG = {
    version: "1.0.0",
    maxMissionScore: 100,
    missionCount: 15
  };

  const RANKS = [
    {
      minXP: 0,
      name: "Rookie Investigator",
      short: "ROOKIE",
      icon: "◇"
    },
    {
      minXP: 200,
      name: "Pattern Analyst",
      short: "ANALYST",
      icon: "◆"
    },
    {
      minXP: 500,
      name: "Evidence Hunter",
      short: "HUNTER",
      icon: "⬡"
    },
    {
      minXP: 800,
      name: "Logic Inspector",
      short: "INSPECTOR",
      icon: "⬢"
    },
    {
      minXP: 1100,
      name: "AI Verifier",
      short: "VERIFIER",
      icon: "✦"
    },
    {
      minXP: 1400,
      name: "Master Investigator",
      short: "MASTER",
      icon: "★"
    }
  ];

  // =======================================================
  // ORIGINAL FUNCTION
  // =======================================================

  const originalRenderMissionResult =
    typeof window.renderMissionResult === "function"
      ? window.renderMissionResult
      : null;

  // =======================================================
  // HELPERS
  // =======================================================

  function safeNumber(value) {
    const number = Number(value);

    return Number.isFinite(number)
      ? number
      : 0;
  }

  function clamp(value, min, max) {
    return Math.max(
      min,
      Math.min(max, value)
    );
  }

  function escapeResultHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getCurrentParticipantSafe() {
    try {
      if (typeof getParticipant === "function") {
        return getParticipant();
      }
    } catch (error) {
      console.warn(
        "[RESULT] Participant unavailable:",
        error
      );
    }

    return {
      code: "",
      className: ""
    };
  }

  function getCompletedMissionsSafe() {
    try {
      if (
        typeof getCompletedMissions ===
        "function"
      ) {
        const data =
          getCompletedMissions();

        return Array.isArray(data)
          ? data
          : [];
      }
    } catch (error) {
      console.warn(
        "[RESULT] Progress unavailable:",
        error
      );
    }

    return [];
  }

  function getMissionAttemptsSafe() {
    try {
      if (
        typeof getMissionAttemptKey !==
        "function"
      ) {
        return [];
      }

      const raw =
        localStorage.getItem(
          getMissionAttemptKey()
        );

      if (!raw) {
        return [];
      }

      const parsed =
        JSON.parse(raw);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch (error) {
      console.warn(
        "[RESULT] Attempts unavailable:",
        error
      );

      return [];
    }
  }

  // =======================================================
  // XP
  // =======================================================

  function getBestMissionScores() {
    const attempts =
      getMissionAttemptsSafe();

    const best = {};

    attempts.forEach(attempt => {
      const missionId =
        Number(attempt.missionId);

      const score =
        clamp(
          safeNumber(
            attempt.gamificationTotal
          ),
          0,
          100
        );

      if (!Number.isFinite(missionId)) {
        return;
      }

      if (
        best[missionId] === undefined ||
        score > best[missionId]
      ) {
        best[missionId] = score;
      }
    });

    return best;
  }

  function getTotalXP() {
    const best =
      getBestMissionScores();

    return Object.values(best)
      .reduce(
        (sum, score) =>
          sum + safeNumber(score),
        0
      );
  }

  function getMaximumXP() {
    return (
      CONFIG.missionCount *
      CONFIG.maxMissionScore
    );
  }

  // =======================================================
  // RANK
  // =======================================================

  function getRankByXP(xp) {
    let currentRank =
      RANKS[0];

    for (
      let i = 0;
      i < RANKS.length;
      i++
    ) {
      if (xp >= RANKS[i].minXP) {
        currentRank =
          RANKS[i];
      }
    }

    return currentRank;
  }

  function getNextRank(xp) {
    return (
      RANKS.find(
        rank =>
          rank.minXP > xp
      ) || null
    );
  }

  function getRankProgress(xp) {
    const current =
      getRankByXP(xp);

    const next =
      getNextRank(xp);

    if (!next) {
      return {
        percentage: 100,
        current,
        next: null,
        remaining: 0
      };
    }

    const range =
      next.minXP -
      current.minXP;

    const earned =
      xp -
      current.minXP;

    const percentage =
      range > 0
        ? clamp(
            Math.round(
              (earned / range) * 100
            ),
            0,
            100
          )
        : 100;

    return {
      percentage,
      current,
      next,
      remaining:
        Math.max(
          0,
          next.minXP - xp
        )
    };
  }

  // =======================================================
  // PERFORMANCE
  // =======================================================

  function getPerformanceData(score) {
    const value =
      safeNumber(score);

    if (value >= 90) {
      return {
        title:
          "VERIFICATION MASTERED",
        subtitle:
          "Investigasi sangat kuat.",
        badge:
          "EXCELLENT",
        stars: 3
      };
    }

    if (value >= 75) {
      return {
        title:
          "MISSION VERIFIED",
        subtitle:
          "Verifikasi berhasil dilakukan.",
        badge:
          "GREAT",
        stars: 3
      };
    }

    if (value >= 60) {
      return {
        title:
          "MISSION COMPLETE",
        subtitle:
          "Investigasi selesai, tetapi masih ada bukti yang dapat diperkuat.",
        badge:
          "GOOD",
        stars: 2
      };
    }

    return {
      title:
        "MISSION COMPLETE",
      subtitle:
        "Misi selesai. Periksa kembali proses verifikasimu.",
      badge:
        "REVIEW",
      stars: 1
    };
  }

  // =======================================================
  // SCORE ROW
  // =======================================================

  function createScoreRow(
    label,
    value,
    max,
    description
  ) {
    const score =
      safeNumber(value);

    const percentage =
      max > 0
        ? clamp(
            Math.round(
              (score / max) * 100
            ),
            0,
            100
          )
        : 0;

    return `
      <div class="rs-score-row">

        <div class="rs-score-head">

          <div>
            <span class="rs-score-label">
              ${escapeResultHTML(label)}
            </span>

            <span class="rs-score-description">
              ${escapeResultHTML(description)}
            </span>
          </div>

          <strong>
            ${score}
            <small>/ ${max}</small>
          </strong>

        </div>

        <div class="rs-mini-track">
          <span
            style="width:${percentage}%"
          ></span>
        </div>

      </div>
    `;
  }

  // =======================================================
  // FIND RESULT CONTAINER
  // =======================================================

  function getResultScreen() {
    return document.getElementById(
      "screenResult"
    );
  }

  function getOrCreateDashboard() {
    const screen =
      getResultScreen();

    if (!screen) {
      return null;
    }

    let dashboard =
      document.getElementById(
        "aitrapResultDashboard"
      );

    if (dashboard) {
      return dashboard;
    }

    dashboard =
      document.createElement("div");

    dashboard.id =
      "aitrapResultDashboard";

    dashboard.className =
      "aitrap-result-dashboard";

    /*
      We insert our dashboard at the
      beginning of screenResult.

      Existing HTML is NOT deleted.
      Existing buttons remain available.
    */

    screen.insertBefore(
      dashboard,
      screen.firstChild
    );

    return dashboard;
  }

  // =======================================================
  // RENDER
  // =======================================================

  function renderEnhancedResult(
    totalScore
  ) {
    const dashboard =
      getOrCreateDashboard();

    if (!dashboard) {
      console.warn(
        "[RESULT] #screenResult not found."
      );

      return;
    }

    const mission =
      typeof getMissionById === "function"
        ? getMissionById(
            currentMissionId
          )
        : null;

    if (!mission) {
      return;
    }

    const participant =
      getCurrentParticipantSafe();

    const completed =
      getCompletedMissionsSafe();

    const totalXP =
      getTotalXP();

    const maxXP =
      getMaximumXP();

    const rankData =
      getRankProgress(totalXP);

    const performance =
      getPerformanceData(
        totalScore
      );

    const missionNumber =
      String(mission.id)
        .padStart(2, "0");

    const completedCount =
      completed.length;

    const journeyPercent =
      clamp(
        Math.round(
          (
            completedCount /
            CONFIG.missionCount
          ) * 100
        ),
        0,
        100
      );

    const stars =
      "★".repeat(
        performance.stars
      ) +
      "☆".repeat(
        3 -
        performance.stars
      );

    const nextMissionId =
      Number(mission.id) + 1;

    const hasNextMission =
      nextMissionId <=
      CONFIG.missionCount;

    const nextText =
      hasNextMission
        ? `MISSION ${String(
            nextMissionId
          ).padStart(2, "0")} TELAH TERBUKA`
        : "SELURUH MISSION TELAH DISELESAIKAN";

    dashboard.innerHTML = `

      <section class="rs-shell">

        <!-- TOP STATUS -->

        <div class="rs-topline">

          <div class="rs-system-status">
            <span class="rs-status-dot"></span>
            INVESTIGATION COMPLETE
          </div>

          <div class="rs-participant">
            ${
              participant.code
                ? escapeResultHTML(
                    participant.code
                  )
                : "INVESTIGATOR"
            }

            ${
              participant.className
                ? `
                  <span>
                    ${escapeResultHTML(
                      participant.className
                    )}
                  </span>
                `
                : ""
            }
          </div>

        </div>


        <!-- HERO -->

        <div class="rs-hero">

          <div class="rs-complete-ring">

            <div class="rs-ring-inner">

              <span>
                MISSION
              </span>

              <strong>
                ${missionNumber}
              </strong>

              <small>
                VERIFIED
              </small>

            </div>

          </div>


          <div class="rs-hero-copy">

            <div class="rs-eyebrow">
              AI TRAP LAB
              ·
              INVESTIGATION REPORT
            </div>

            <h1>
              ${escapeResultHTML(
                performance.title
              )}
            </h1>

            <p>
              ${escapeResultHTML(
                performance.subtitle
              )}
            </p>

            <div class="rs-stars">
              ${stars}
            </div>

            <div class="rs-badges">

              <span>
                ${escapeResultHTML(
                  performance.badge
                )}
              </span>

              <span>
                ${escapeResultHTML(
                  mission.levelName ||
                  `LEVEL ${mission.level}`
                )}
              </span>

              <span>
                ${escapeResultHTML(
                  mission.trapType ||
                  "AI TRAP"
                )}
              </span>

            </div>

          </div>


          <div class="rs-total-score">

            <span>
              MISSION XP
            </span>

            <strong>
              ${safeNumber(
                totalScore
              )}
            </strong>

            <small>
              / 100 XP
            </small>

          </div>

        </div>


        <!-- NEXT UNLOCK -->

        <div class="rs-unlock">

          <div class="rs-unlock-icon">
            ✓
          </div>

          <div>
            <span>
              PROGRESS UPDATED
            </span>

            <strong>
              ${nextText}
            </strong>
          </div>

        </div>


        <!-- MAIN GRID -->

        <div class="rs-grid">

          <!-- SCORE ANALYSIS -->

          <article class="rs-panel">

            <div class="rs-panel-title">

              <div>
                <span>
                  PERFORMANCE
                </span>

                <h3>
                  Investigation Breakdown
                </h3>
              </div>

              <div class="rs-score-chip">
                ${safeNumber(
                  totalScore
                )} XP
              </div>

            </div>


            <div class="rs-score-list">

              ${createScoreRow(
                "CLAIM",
                scores.claim,
                10,
                "Menilai klaim awal AI"
              )}

              ${createScoreRow(
                "CHECK",
                scores.check,
                20,
                "Memilih bukti relevan"
              )}

              ${createScoreRow(
                "TEST",
                scores.test,
                25,
                "Menguji klaim"
              )}

              ${createScoreRow(
                "CORRECT",
                scores.correct,
                20,
                "Menyusun kesimpulan"
              )}

              ${createScoreRow(
                "JUSTIFY",
                scores.justify,
                25,
                "Menjelaskan alasan"
              )}

            </div>

          </article>


          <!-- INVESTIGATOR -->

          <article class="rs-panel rs-rank-panel">

            <div class="rs-panel-title">

              <div>
                <span>
                  INVESTIGATOR PROFILE
                </span>

                <h3>
                  Rank & XP
                </h3>
              </div>

              <div class="rs-rank-symbol">
                ${rankData.current.icon}
              </div>

            </div>


            <div class="rs-current-rank">

              <span>
                CURRENT RANK
              </span>

              <strong>
                ${escapeResultHTML(
                  rankData.current.name
                )}
              </strong>

            </div>


            <div class="rs-xp-number">

              <strong>
                ${totalXP}
              </strong>

              <span>
                / ${maxXP} TOTAL XP
              </span>

            </div>


            ${
              rankData.next
                ? `
                  <div class="rs-rank-progress">

                    <div class="rs-rank-progress-head">

                      <span>
                        NEXT:
                        ${escapeResultHTML(
                          rankData.next.name
                        )}
                      </span>

                      <strong>
                        ${rankData.remaining}
                        XP lagi
                      </strong>

                    </div>

                    <div class="rs-rank-track">
                      <span
                        style="
                          width:
                          ${rankData.percentage}%
                        "
                      ></span>
                    </div>

                  </div>
                `
                : `
                  <div class="
                    rs-rank-progress
                    rs-max-rank
                  ">
                    MAXIMUM INVESTIGATOR
                    RANK ACHIEVED
                  </div>
                `
            }


            <div class="rs-journey">

              <div class="rs-journey-head">

                <span>
                  MISSION JOURNEY
                </span>

                <strong>
                  ${completedCount}
                  /
                  ${CONFIG.missionCount}
                </strong>

              </div>

              <div class="rs-journey-track">
                <span
                  style="
                    width:
                    ${journeyPercent}%
                  "
                ></span>
              </div>

              <small>
                ${journeyPercent}%
                perjalanan investigasi selesai
              </small>

            </div>

          </article>

        </div>


        <!-- EVIDENCE REPORT -->

        <article class="
          rs-panel
          rs-report-panel
        ">

          <div class="rs-report-icon">
            ◈
          </div>

          <div>

            <span class="rs-report-label">
              INVESTIGATION CONCLUSION
            </span>

            <h3>
              ${
                escapeResultHTML(
                  mission.result.status ||
                  "Mission Complete"
                )
              }
            </h3>

            <p>
              ${
                escapeResultHTML(
                  mission.result.explanation ||
                  ""
                )
              }
            </p>

          </div>

        </article>


        <!-- METHODOLOGY NOTE -->

        <div class="rs-method-note">

          <span>
            GAME PROGRESS
          </span>

          <p>
            XP menunjukkan progres dan
            performa dalam aktivitas
            mission. Jawaban penalaran
            tetap tersimpan sebagai
            bukti proses investigasi.
          </p>

        </div>

      </section>
    `;

    hideLegacyResultSummary();

    installActionArea();
  }

  // =======================================================
  // HIDE DUPLICATE LEGACY DISPLAY
  // =======================================================

  function hideLegacyResultSummary() {
    const dashboard =
      document.getElementById(
        "aitrapResultDashboard"
      );

    const screen =
      getResultScreen();

    if (!dashboard || !screen) {
      return;
    }

    /*
      We do NOT delete old elements because
      app.js still uses their IDs.

      Only visual duplicates are hidden.
    */

    const legacyIds = [
      "resultMission",
      "resultStatus",
      "resultScore",
      "scoreClaim",
      "scoreCheck",
      "scoreTest",
      "scoreCorrect",
      "scoreJustify",
      "resultExplanation"
    ];

    legacyIds.forEach(id => {
      const element =
        document.getElementById(id);

      if (!element) {
        return;
      }

      /*
        Hide nearest old result component,
        but never hide screenResult itself.
      */

      let target =
        element;

      if (
        element.parentElement &&
        element.parentElement !== screen
      ) {
        target =
          element.parentElement;
      }

      if (
        target !== screen &&
        !dashboard.contains(target)
      ) {
        target.classList.add(
          "rs-legacy-hidden"
        );
      }
    });
  }

  // =======================================================
  // ACTION AREA
  // =======================================================

  function installActionArea() {
    const screen =
      getResultScreen();

    if (!screen) {
      return;
    }

    let actions =
      document.getElementById(
        "rsActionArea"
      );

    if (!actions) {
      actions =
        document.createElement("div");

      actions.id =
        "rsActionArea";

      actions.className =
        "rs-actions";

      screen.appendChild(actions);
    }

    const missionId =
      Number(currentMissionId);

    const completed =
      getCompletedMissionsSafe();

    const nextId =
      missionId + 1;

    const nextUnlocked =
      nextId <= CONFIG.missionCount &&
      completed.includes(missionId);

    actions.innerHTML = `

      <button
        type="button"
        class="
          rs-btn
          rs-btn-secondary
        "
        onclick="
          window.AITRAP_RESULT.restart()
        "
      >
        ↻ ULANGI MISSION
      </button>


      <button
        type="button"
        class="
          rs-btn
          rs-btn-primary
        "
        onclick="
          window.AITRAP_RESULT.map()
        "
      >
        KEMBALI KE MISSION MAP
        <span>→</span>
      </button>


      ${
        nextUnlocked
          ? `
            <button
              type="button"
              class="
                rs-btn
                rs-btn-next
              "
              onclick="
                window.AITRAP_RESULT.next()
              "
            >
              MISSION ${String(
                nextId
              ).padStart(2, "0")}
              <span>→</span>
            </button>
          `
          : ""
      }
    `;
  }

  // =======================================================
  // NAVIGATION
  // =======================================================

  function goMap() {
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

  function restartCurrentMission() {
    if (
      typeof startMission ===
      "function" &&
      currentMissionId
    ) {
      startMission(
        currentMissionId
      );
    }
  }

  function startNextMission() {
    const nextId =
      Number(currentMissionId) + 1;

    if (
      nextId >
      CONFIG.missionCount
    ) {
      goMap();
      return;
    }

    if (
      typeof isMissionUnlocked ===
      "function" &&
      !isMissionUnlocked(nextId)
    ) {
      goMap();
      return;
    }

    if (
      typeof startMission ===
      "function"
    ) {
      startMission(nextId);
    }
  }

  // =======================================================
  // CSS
  // =======================================================

  function installStyles() {
    if (
      document.getElementById(
        "aitrap-result-style"
      )
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "aitrap-result-style";

    style.textContent = `

      /* ===============================================
         AI TRAP LAB RESULT SCREEN
         =============================================== */

      #screenResult {
        position: relative;
      }

      .aitrap-result-dashboard {
        width: min(1180px, calc(100% - 32px));
        margin: 28px auto 20px;
        position: relative;
        z-index: 2;
      }

      .rs-shell {
        display: flex;
        flex-direction: column;
        gap: 18px;
      }

      .rs-topline {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        padding: 0 4px;
        font-size: 12px;
        letter-spacing: 1.5px;
        font-weight: 800;
      }

      .rs-system-status {
        display: flex;
        align-items: center;
        gap: 9px;
        color: #8fa7bd;
      }

      .rs-status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #54f6bd;
        box-shadow:
          0 0 12px rgba(84,246,189,.9);
      }

      .rs-participant {
        color: #e8f2ff;
      }

      .rs-participant span {
        color: #6f8ca6;
        margin-left: 8px;
      }

      .rs-hero {
        position: relative;
        overflow: hidden;
        display: grid;
        grid-template-columns:
          auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 28px;
        padding: 30px;
        border: 1px solid
          rgba(81, 203, 255, .25);
        border-radius: 24px;
        background:
          radial-gradient(
            circle at 10% 20%,
            rgba(33, 194, 255, .12),
            transparent 32%
          ),
          radial-gradient(
            circle at 90% 50%,
            rgba(116, 89, 255, .12),
            transparent 35%
          ),
          linear-gradient(
            145deg,
            rgba(8, 21, 39, .98),
            rgba(5, 13, 27, .98)
          );
        box-shadow:
          0 22px 60px
          rgba(0, 0, 0, .25);
      }

      .rs-hero::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: .18;
        background-image:
          linear-gradient(
            rgba(87, 208, 255, .12) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(87, 208, 255, .12) 1px,
            transparent 1px
          );
        background-size:
          34px 34px;
        mask-image:
          linear-gradient(
            to right,
            black,
            transparent 72%
          );
      }

      .rs-complete-ring {
        width: 142px;
        height: 142px;
        border-radius: 50%;
        padding: 8px;
        position: relative;
        background:
          conic-gradient(
            #5df3c1,
            #4cc9ff,
            #7b78ff,
            #5df3c1
          );
        box-shadow:
          0 0 35px
          rgba(76, 201, 255, .18);
      }

      .rs-complete-ring::after {
        content: "";
        position: absolute;
        inset: -8px;
        border: 1px solid
          rgba(87, 213, 255, .2);
        border-radius: inherit;
      }

      .rs-ring-inner {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #071426;
        text-align: center;
      }

      .rs-ring-inner span,
      .rs-ring-inner small {
        color: #7793aa;
        font-size: 10px;
        letter-spacing: 1.5px;
        font-weight: 900;
      }

      .rs-ring-inner strong {
        margin: 2px 0;
        font-size: 38px;
        line-height: 1;
        color: #f3fbff;
      }

      .rs-hero-copy {
        min-width: 0;
        position: relative;
        z-index: 1;
      }

      .rs-eyebrow {
        margin-bottom: 8px;
        color: #4ed7ff;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 2px;
      }

      .rs-hero-copy h1 {
        margin: 0;
        color: #f5fbff;
        font-size:
          clamp(27px, 4vw, 46px);
        line-height: 1.05;
        letter-spacing: -.8px;
      }

      .rs-hero-copy p {
        margin: 10px 0 0;
        color: #9ab0c4;
        font-size: 15px;
        line-height: 1.6;
      }

      .rs-stars {
        margin-top: 12px;
        color: #ffd86a;
        letter-spacing: 6px;
        font-size: 20px;
      }

      .rs-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 15px;
      }

      .rs-badges span {
        padding: 7px 10px;
        border: 1px solid
          rgba(84, 210, 255, .18);
        border-radius: 8px;
        background:
          rgba(20, 52, 78, .45);
        color: #a9c8dc;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1px;
      }

      .rs-total-score {
        min-width: 145px;
        position: relative;
        z-index: 1;
        padding: 20px;
        border-left: 1px solid
          rgba(116, 187, 225, .16);
        text-align: center;
      }

      .rs-total-score span {
        display: block;
        color: #7894ab;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .rs-total-score strong {
        display: block;
        margin: 4px 0 0;
        color: #5cf1c2;
        font-size: 54px;
        line-height: 1;
      }

      .rs-total-score small {
        color: #7894ab;
        font-size: 11px;
      }

      .rs-unlock {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px 18px;
        border: 1px solid
          rgba(87, 235, 185, .2);
        border-radius: 14px;
        background:
          rgba(22, 105, 81, .12);
      }

      .rs-unlock-icon {
        width: 36px;
        height: 36px;
        flex: 0 0 36px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background:
          rgba(86, 239, 189, .13);
        color: #5df0c0;
        font-weight: 900;
      }

      .rs-unlock span {
        display: block;
        margin-bottom: 2px;
        color: #6e9a8c;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.5px;
      }

      .rs-unlock strong {
        color: #a9f3da;
        font-size: 12px;
        letter-spacing: .5px;
      }

      .rs-grid {
        display: grid;
        grid-template-columns:
          minmax(0, 1.35fr)
          minmax(300px, .65fr);
        gap: 18px;
      }

      .rs-panel {
        padding: 22px;
        border: 1px solid
          rgba(101, 167, 211, .15);
        border-radius: 20px;
        background:
          linear-gradient(
            145deg,
            rgba(9, 24, 42, .94),
            rgba(6, 16, 30, .94)
          );
        box-shadow:
          0 14px 40px
          rgba(0, 0, 0, .16);
      }

      .rs-panel-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 14px;
        margin-bottom: 20px;
      }

      .rs-panel-title span {
        display: block;
        margin-bottom: 4px;
        color: #4fcfff;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.6px;
      }

      .rs-panel-title h3 {
        margin: 0;
        color: #edf7ff;
        font-size: 18px;
      }

      .rs-score-chip {
        padding: 8px 11px;
        border: 1px solid
          rgba(87, 235, 185, .2);
        border-radius: 10px;
        background:
          rgba(87, 235, 185, .08);
        color: #5ef0c1;
        font-size: 12px;
        font-weight: 900;
      }

      .rs-score-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .rs-score-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 15px;
        margin-bottom: 7px;
      }

      .rs-score-label {
        display: block;
        color: #dcefff;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 1px;
      }

      .rs-score-description {
        display: block;
        margin-top: 2px;
        color: #6f899f;
        font-size: 10px;
      }

      .rs-score-head strong {
        color: #e9f8ff;
        font-size: 14px;
      }

      .rs-score-head small {
        color: #647d92;
        font-weight: 700;
      }

      .rs-mini-track,
      .rs-rank-track,
      .rs-journey-track {
        height: 6px;
        overflow: hidden;
        border-radius: 999px;
        background:
          rgba(123, 160, 187, .12);
      }

      .rs-mini-track span,
      .rs-rank-track span,
      .rs-journey-track span {
        display: block;
        height: 100%;
        border-radius: inherit;
        background:
          linear-gradient(
            90deg,
            #4bd0ff,
            #59efbd
          );
        box-shadow:
          0 0 14px
          rgba(75, 208, 255, .25);
      }

      .rs-rank-symbol {
        width: 45px;
        height: 45px;
        display: grid;
        place-items: center;
        border: 1px solid
          rgba(80, 213, 255, .22);
        border-radius: 14px;
        background:
          rgba(61, 182, 255, .08);
        color: #63ddff;
        font-size: 22px;
      }

      .rs-current-rank span {
        color: #68849b;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.4px;
      }

      .rs-current-rank strong {
        display: block;
        margin-top: 5px;
        color: #edf8ff;
        font-size: 21px;
      }

      .rs-xp-number {
        display: flex;
        align-items: baseline;
        gap: 7px;
        margin: 22px 0;
      }

      .rs-xp-number strong {
        color: #5bf0c0;
        font-size: 38px;
        line-height: 1;
      }

      .rs-xp-number span {
        color: #68849a;
        font-size: 10px;
        font-weight: 900;
      }

      .rs-rank-progress-head,
      .rs-journey-head {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 8px;
        color: #7891a5;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: .6px;
      }

      .rs-rank-progress-head strong,
      .rs-journey-head strong {
        color: #b5cad9;
      }

      .rs-journey {
        margin-top: 24px;
        padding-top: 20px;
        border-top: 1px solid
          rgba(110, 161, 197, .12);
      }

      .rs-journey small {
        display: block;
        margin-top: 8px;
        color: #627c91;
        font-size: 10px;
      }

      .rs-max-rank {
        padding: 11px;
        border: 1px solid
          rgba(255, 215, 102, .2);
        border-radius: 10px;
        color: #ffd96b;
        font-size: 10px;
        font-weight: 900;
        text-align: center;
        letter-spacing: 1px;
      }

      .rs-report-panel {
        display: flex;
        align-items: flex-start;
        gap: 16px;
      }

      .rs-report-icon {
        width: 44px;
        height: 44px;
        flex: 0 0 44px;
        display: grid;
        place-items: center;
        border-radius: 13px;
        background:
          rgba(92, 212, 255, .09);
        color: #5bdcff;
        font-size: 20px;
      }

      .rs-report-label {
        color: #4dcfff;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.4px;
      }

      .rs-report-panel h3 {
        margin: 4px 0 7px;
        color: #edf8ff;
        font-size: 17px;
      }

      .rs-report-panel p {
        margin: 0;
        color: #91a8bb;
        font-size: 13px;
        line-height: 1.65;
      }

      .rs-method-note {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 12px 15px;
        border: 1px dashed
          rgba(105, 156, 190, .18);
        border-radius: 12px;
        background:
          rgba(6, 17, 29, .5);
      }

      .rs-method-note span {
        flex: 0 0 auto;
        color: #66859c;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: 1.3px;
      }

      .rs-method-note p {
        margin: 0;
        color: #627b8e;
        font-size: 10px;
        line-height: 1.5;
      }

      .rs-actions {
        width: min(1180px, calc(100% - 32px));
        margin: 0 auto 40px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
        position: relative;
        z-index: 5;
      }

      .rs-btn {
        min-height: 46px;
        padding: 0 18px;
        border-radius: 12px;
        cursor: pointer;
        font-family: inherit;
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .7px;
        transition:
          transform .15s ease,
          border-color .15s ease,
          background .15s ease;
      }

      .rs-btn:hover {
        transform:
          translateY(-2px);
      }

      .rs-btn-secondary {
        border: 1px solid
          rgba(120, 166, 198, .24);
        background:
          rgba(16, 37, 57, .7);
        color: #9db5c8;
      }

      .rs-btn-primary {
        border: 1px solid
          rgba(83, 219, 255, .35);
        background:
          linear-gradient(
            135deg,
            #0f7197,
            #105b86
          );
        color: white;
      }

      .rs-btn-next {
        border: 1px solid
          rgba(85, 239, 190, .32);
        background:
          linear-gradient(
            135deg,
            #137f66,
            #126a62
          );
        color: white;
      }

      .rs-btn span {
        margin-left: 8px;
      }

      .rs-legacy-hidden {
        display: none !important;
      }


      /* ===============================================
         TABLET
         =============================================== */

      @media (
        max-width: 900px
      ) {

        .rs-hero {
          grid-template-columns:
            auto 1fr;
        }

        .rs-total-score {
          grid-column:
            1 / -1;
          display: flex;
          justify-content: center;
          align-items: baseline;
          gap: 8px;
          padding: 16px;
          border-left: 0;
          border-top: 1px solid
            rgba(116,187,225,.14);
        }

        .rs-total-score span,
        .rs-total-score strong,
        .rs-total-score small {
          display: inline;
        }

        .rs-total-score strong {
          font-size: 38px;
        }

        .rs-grid {
          grid-template-columns: 1fr;
        }

      }


      /* ===============================================
         MOBILE
         =============================================== */

      @media (
        max-width: 640px
      ) {

        .aitrap-result-dashboard {
          width:
            min(
              100% - 20px,
              1180px
            );
          margin-top: 16px;
        }

        .rs-topline {
          align-items: flex-start;
          font-size: 9px;
        }

        .rs-participant {
          text-align: right;
        }

        .rs-hero {
          grid-template-columns: 1fr;
          justify-items: center;
          gap: 18px;
          padding: 22px 17px;
          text-align: center;
          border-radius: 18px;
        }

        .rs-complete-ring {
          width: 118px;
          height: 118px;
        }

        .rs-ring-inner strong {
          font-size: 32px;
        }

        .rs-hero-copy h1 {
          font-size: 28px;
        }

        .rs-badges {
          justify-content: center;
        }

        .rs-total-score {
          width: 100%;
          grid-column: auto;
        }

        .rs-unlock {
          align-items: flex-start;
        }

        .rs-panel {
          padding: 17px;
          border-radius: 16px;
        }

        .rs-score-head {
          align-items: center;
        }

        .rs-score-description {
          max-width: 190px;
        }

        .rs-report-panel {
          flex-direction: column;
        }

        .rs-method-note {
          align-items: flex-start;
          flex-direction: column;
          gap: 5px;
        }

        .rs-actions {
          width: calc(100% - 20px);
          flex-direction: column;
        }

        .rs-btn {
          width: 100%;
        }

      }

    `;

    document.head.appendChild(
      style
    );
  }

  // =======================================================
  // OVERRIDE RESULT RENDERER
  // =======================================================

  function enhancedRenderMissionResult(
    totalScore
  ) {
    /*
      Run original renderer first.

      This preserves every existing ID,
      mission result text and legacy
      behavior from app.js.
    */

    if (
      originalRenderMissionResult
    ) {
      originalRenderMissionResult(
        totalScore
      );
    }

    renderEnhancedResult(
      totalScore
    );
  }

  // =======================================================
  // INITIALIZATION
  // =======================================================

  installStyles();

  window.renderMissionResult =
    enhancedRenderMissionResult;

  window.AITRAP_RESULT = {

    version:
      CONFIG.version,

    getXP:
      getTotalXP,

    getRank() {
      return getRankByXP(
        getTotalXP()
      );
    },

    render:
      renderEnhancedResult,

    map:
      goMap,

    restart:
      restartCurrentMission,

    next:
      startNextMission

  };

  console.log(
    "[AI TRAP LAB] Result Screen Engine",
    CONFIG.version,
    "READY"
  );

})();