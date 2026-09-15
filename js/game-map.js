/* ============================================================
   AI TRAP LAB
   GAME MAP V6.3 — STABLE INPUT
   ============================================================ */

(function () {
  "use strict";

  const VERSION = "6.3.0";

  let rendering = false;
  let lastSignature = "";
  let mapObserver = null;
  let screenObserver = null;
  let refreshTimer = null;

  const ZONES = {
    1: {
      code: "ZONE 01",
      name: "PATTERN LAB",
      title: "Pattern Trap",
      icon: "◇",
      color: "#39bfff",
      color2: "#725cff",
      badge: "PATTERN BREAKER",
      description:
        "Temukan pola, uji konsistensi, dan jangan terkecoh oleh jawaban AI yang terlihat meyakinkan."
    },

    2: {
      code: "ZONE 02",
      name: "SEQUENCE ZONE",
      title: "Sequence Trap",
      icon: "⇢",
      color: "#24e3d4",
      color2: "#298dff",
      badge: "SEQUENCE TRACKER",
      description:
        "Periksa urutan langkah, prosedur yang hilang, dan kemungkinan lebih dari satu solusi."
    },

    3: {
      code: "ZONE 03",
      name: "LOGIC CHAMBER",
      title: "Logic Trap",
      icon: "⬡",
      color: "#b16cff",
      color2: "#ec60c9",
      badge: "LOGIC DETECTIVE",
      description:
        "Cari kelemahan logika, kondisi yang terlewat, asumsi tersembunyi, dan counterexample."
    },

    4: {
      code: "ZONE 04",
      name: "EFFICIENCY REACTOR",
      title: "Efficiency Trap",
      icon: "⚡",
      color: "#ffbd3e",
      color2: "#ff6b6b",
      badge: "EFFICIENCY HUNTER",
      description:
        "Bandingkan strategi dan nilai solusi berdasarkan tujuan, batasan, serta efisiensi."
    },

    5: {
      code: "FINAL ZONE",
      name: "VERIFICATION CORE",
      title: "Verification Trap",
      icon: "◎",
      color: "#2de4a4",
      color2: "#25c4e4",
      badge: "AI VERIFIER",
      description:
        "Masuki inti verifikasi dan putuskan apakah bukti AI benar-benar mendukung klaimnya."
    }
  };

  /* ============================================================
     HELPERS
     ============================================================ */

  function esc(value) {
    const div = document.createElement("div");
    div.textContent = String(value ?? "");
    return div.innerHTML;
  }

  function getMissionsSafe() {
    try {
      if (
        typeof missions !== "undefined" &&
        Array.isArray(missions)
      ) {
        return missions;
      }
    } catch (_) {}

    return [];
  }

  function getParticipantSafe() {
    try {
      if (typeof getParticipant === "function") {
        return getParticipant() || {};
      }
    } catch (_) {}

    return {};
  }

  function getCompletedSafe() {
    try {
      if (typeof getCompletedMissions === "function") {
        const result = getCompletedMissions();

        if (Array.isArray(result)) {
          return result
            .map(Number)
            .filter(Number.isFinite)
            .sort((a, b) => a - b);
        }
      }
    } catch (_) {}

    return [];
  }

  function isUnlockedSafe(id) {
    try {
      if (typeof isMissionUnlocked === "function") {
        return Boolean(
          isMissionUnlocked(Number(id))
        );
      }
    } catch (_) {}

    const missionId = Number(id);

    if (missionId === 1) {
      return true;
    }

    return getCompletedSafe().includes(
      missionId - 1
    );
  }

  function levelOf(mission) {
    const level = Number(mission?.level);

    if (
      level >= 1 &&
      level <= 5
    ) {
      return level;
    }

    const id = Number(mission?.id);

    if (id <= 3) return 1;
    if (id <= 6) return 2;
    if (id <= 9) return 3;
    if (id <= 12) return 4;

    return 5;
  }

  function currentMission() {
    const completed =
      getCompletedSafe();

    return (
      getMissionsSafe().find(mission => {
        const id = Number(mission.id);

        return (
          !completed.includes(id) &&
          isUnlockedSafe(id)
        );
      }) || null
    );
  }

  function missionState(mission) {
    const id = Number(mission.id);

    const completed =
      getCompletedSafe();

    const current =
      currentMission();

    if (completed.includes(id)) {
      return "verified";
    }

    if (
      current &&
      Number(current.id) === id
    ) {
      return "current";
    }

    if (isUnlockedSafe(id)) {
      return "available";
    }

    return "locked";
  }

  function mapScreen() {
    return document.getElementById(
      "screenMap"
    );
  }

  function mapContainer() {
    return document.getElementById(
      "missionMap"
    );
  }

  function isMapActive() {
    const screen = mapScreen();

    if (!screen) {
      return false;
    }

    return screen.classList.contains(
      "active"
    );
  }

  function makeSignature() {
    const participant =
      getParticipantSafe();

    return [
      participant.code || "",
      participant.className || "",
      getCompletedSafe().join(","),
      getMissionsSafe().length
    ].join("|");
  }

  /* ============================================================
     RANK
     ============================================================ */

  function rankData(count) {
    if (count >= 15) {
      return {
        name: "MASTER INVESTIGATOR",
        icon: "★",
        target: 1500
      };
    }

    if (count >= 12) {
      return {
        name: "VERIFIER",
        icon: "◉",
        target: 1500
      };
    }

    if (count >= 9) {
      return {
        name: "DETECTIVE",
        icon: "◆",
        target: 1200
      };
    }

    if (count >= 6) {
      return {
        name: "ANALYST",
        icon: "◇",
        target: 900
      };
    }

    return {
      name: "ROOKIE",
      icon: "○",
      target: 600
    };
  }

  /* ============================================================
     AI GUIDE
     ============================================================ */

  function aiMessage(count) {
    if (count === 0) {
      return "Investigator terdeteksi. Jawaban AI adalah klaim yang harus kamu buktikan.";
    }

    if (count === 1) {
      return "Mission pertama berhasil diverifikasi. Jalur investigasi berikutnya sudah terbuka.";
    }

    if (count <= 3) {
      return "Pattern Lab sedang dipetakan. Cari pola yang benar, bukan yang hanya terlihat meyakinkan.";
    }

    if (count <= 6) {
      return "Sequence Zone aktif. Periksa setiap langkah sebelum menerima kesimpulan.";
    }

    if (count <= 9) {
      return "Logic Chamber aktif. Cari kondisi yang dapat membuat klaim AI gagal.";
    }

    if (count <= 12) {
      return "Efficiency Reactor aktif. Solusi benar belum tentu solusi terbaik.";
    }

    if (count < 15) {
      return "Verification Core terbuka. Nilai bukti, alasan, dan kesimpulan secara kritis.";
    }

    return "Seluruh mission telah diverifikasi. Investigation Journey selesai.";
  }

  /* ============================================================
     HUD
     ============================================================ */

  function buildHUD() {
    const participant =
      getParticipantSafe();

    const count =
      getCompletedSafe().length;

    const rank =
      rankData(count);

    const xp =
      count * 100;

    const progress =
      Math.round(
        (count / 15) * 100
      );

    const xpProgress =
      Math.min(
        100,
        Math.round(
          (xp / rank.target) * 100
        )
      );

    return `
      <div class="g6-hud">

        <div class="g6-brand">

          <div class="g6-logo">
            AI
          </div>

          <div>
            <span>
              AI TRAP LAB
            </span>

            <strong>
              INVESTIGATION WORLD
            </strong>
          </div>

        </div>

        <div class="g6-progress-area">

          <div class="g6-progress-row">

            <span>
              MISSION PROGRESS
            </span>

            <strong>
              ${count} / 15
            </strong>

          </div>

          <div class="g6-progress-track">
            <i
              style="
                width:${progress}%;
              "
            ></i>
          </div>

          <div class="g6-xp-row">

            <span>
              XP ${xp}
            </span>

            <div class="g6-xp-track">
              <i
                style="
                  width:${xpProgress}%;
                "
              ></i>
            </div>

            <strong>
              ${rank.target}
            </strong>

          </div>

        </div>

        <div class="g6-profile">

          <div class="g6-rank">

            <span>
              ${rank.icon}
            </span>

            <div>
              <small>
                CURRENT RANK
              </small>

              <strong>
                ${rank.name}
              </strong>
            </div>

          </div>

          <div class="g6-profile-data">

            <strong>
              ${esc(
                participant.code ||
                "INVESTIGATOR"
              )}
            </strong>

            <span>
              ${esc(
                participant.className ||
                "-"
              )}
            </span>

          </div>

        </div>

      </div>
    `;
  }

  /* ============================================================
     LAB-AI
     ============================================================ */

  function buildGuide() {
    const count =
      getCompletedSafe().length;

    const current =
      currentMission();

    return `
      <div class="g6-guide">

        <div class="g6-bot">

          <div class="g6-bot-antenna"></div>

          <div class="g6-bot-head">
            <i></i>
            <i></i>
          </div>

          <div class="g6-bot-body">
            LAB-AI
          </div>

        </div>

        <div class="g6-speech">

          <div class="g6-speech-head">

            <strong>
              LAB-AI
            </strong>

            <span>
              ● ONLINE
            </span>

          </div>

          <p>
            ${esc(
              aiMessage(count)
            )}
          </p>

          ${
            current
              ? `
                <div class="g6-target">
                  NEXT TARGET
                  <strong>
                    MISSION ${String(
                      current.id
                    ).padStart(2, "0")}
                  </strong>
                </div>
              `
              : `
                <div class="g6-target success">
                  ALL MISSIONS VERIFIED
                </div>
              `
          }

        </div>

      </div>
    `;
  }

  /* ============================================================
     CURRENT PANEL
     ============================================================ */

  function buildCurrentPanel(
    mission,
    zone
  ) {
    return `
      <div
        class="g6-current-panel"
        data-mission-id="${Number(
          mission.id
        )}"
        style="
          --zone:${zone.color};
          --zone2:${zone.color2};
        "
      >

        <div class="g6-current-top">

          <span>
            CURRENT INVESTIGATION
          </span>

          <b>
            ${zone.icon}
          </b>

        </div>

        <small>
          MISSION ${String(
            mission.id
          ).padStart(2, "0")}
        </small>

        <h3>
          ${esc(
            mission.title || ""
          )}
        </h3>

        <p>
          ${esc(
            mission.trapType ||
            zone.title
          )}
        </p>

        <div class="g6-tags">

          <span>
            ${esc(zone.name)}
          </span>

          <span>
            CCTCJ
          </span>

          <span>
            AI VERIFICATION
          </span>

        </div>

        <button
          type="button"
          class="g6-start-mission"
          data-mission-id="${Number(
            mission.id
          )}"
        >
          <span>
            MULAI INVESTIGASI
          </span>

          <strong>
            ▶
          </strong>
        </button>

      </div>
    `;
  }

  /* ============================================================
     NODE
     ============================================================ */

  function buildNode(
    mission,
    zone,
    index
  ) {
    const id =
      Number(mission.id);

    const state =
      missionState(mission);

    let symbol =
      String(id).padStart(2, "0");

    if (state === "verified") {
      symbol = "✓";
    }

    if (state === "locked") {
      symbol = "⌾";
    }

    const clickable =
      state !== "locked";

    return `
      <div
        class="
          g6-node
          g6-${state}
          g6-node-${index + 1}
          ${
            clickable
              ? "g6-clickable"
              : ""
          }
        "
        ${
          clickable
            ? `data-mission-id="${id}"`
            : ""
        }
        style="
          --zone:${zone.color};
          --zone2:${zone.color2};
        "
      >

        <button
          type="button"
          class="g6-node-button"
          ${
            clickable
              ? `data-mission-id="${id}"`
              : "disabled"
          }
          aria-label="Buka Mission ${id}"
        >

          <span class="g6-node-ring ring-1"></span>
          <span class="g6-node-ring ring-2"></span>

          <span class="g6-node-core">
            ${symbol}
          </span>

        </button>

        <div class="g6-node-text">

          <span>
            ${
              state === "verified"
                ? "VERIFIED"
                : state === "current"
                ? "CURRENT MISSION"
                : state === "available"
                ? "AVAILABLE"
                : "LOCKED"
            }
          </span>

          <strong>
            MISSION ${String(id).padStart(2, "0")}
          </strong>

          <small>
            ${esc(
              mission.title || ""
            )}
          </small>

        </div>

      </div>
    `;
  }

  /* ============================================================
     PORTAL
     ============================================================ */

  function buildPortal(
    level,
    complete
  ) {
    if (level >= 5) {
      return "";
    }

    const next =
      ZONES[level + 1];

    return `
      <div
        class="
          g6-portal
          ${
            complete
              ? "open"
              : "locked"
          }
        "
      >

        <div class="g6-portal-ring">

          <span>
            ${
              complete
                ? next.icon
                : "⌾"
            }
          </span>

        </div>

        <div>

          <small>
            ${
              complete
                ? "PORTAL OPEN"
                : "PORTAL LOCKED"
            }
          </small>

          <strong>
            ${esc(next.name)}
          </strong>

          <p>
            ${
              complete
                ? "Zone berikutnya telah terbuka."
                : "Selesaikan semua mission di zone ini."
            }
          </p>

        </div>

      </div>
    `;
  }

  /* ============================================================
     ZONE
     ============================================================ */

  function buildZone(level) {
    const zone =
      ZONES[level];

    const list =
      getMissionsSafe().filter(
        mission =>
          levelOf(mission) === level
      );

    if (!list.length) {
      return "";
    }

    const completed =
      getCompletedSafe();

    const done =
      list.filter(mission =>
        completed.includes(
          Number(mission.id)
        )
      ).length;

    const complete =
      done === list.length;

    const first =
      list[0];

    const unlocked =
      level === 1 ||
      isUnlockedSafe(first.id) ||
      done > 0;

    const current =
      list.find(
        mission =>
          missionState(mission) ===
          "current"
      ) || null;

    const nodes =
      list.map(
        (mission, index) =>
          buildNode(
            mission,
            zone,
            index
          )
      ).join("");

    return `
      <section
        class="
          g6-zone
          g6-zone-${level}
          ${
            complete
              ? "complete"
              : ""
          }
          ${
            unlocked
              ? ""
              : "locked"
          }
        "
        style="
          --zone:${zone.color};
          --zone2:${zone.color2};
        "
      >

        <div class="g6-zone-bg">

          <span class="g6-grid"></span>
          <span class="g6-glow glow-1"></span>
          <span class="g6-glow glow-2"></span>

          <span class="g6-deco deco-1"></span>
          <span class="g6-deco deco-2"></span>
          <span class="g6-deco deco-3"></span>
          <span class="g6-deco deco-4"></span>

        </div>

        <div class="g6-zone-header">

          <div>

            <span class="g6-zone-code">
              ${zone.code}
            </span>

            <h2>
              ${zone.name}
            </h2>

            <strong>
              ${zone.title}
            </strong>

            <p>
              ${zone.description}
            </p>

          </div>

          <div class="g6-zone-progress">

            <strong>
              ${done}/${list.length}
            </strong>

            <span>
              VERIFIED
            </span>

          </div>

        </div>

        ${
          current
            ? buildCurrentPanel(
                current,
                zone
              )
            : ""
        }

        <div class="g6-stage">

          <svg
            class="g6-route-svg"
            viewBox="0 0 1000 560"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="
                M 120 420
                C 240 420,
                  300 135,
                  505 150
                S 720 410,
                  870 365
              "
            />
          </svg>

          ${nodes}

          <div class="g6-stage-platform p1"></div>
          <div class="g6-stage-platform p2"></div>
          <div class="g6-stage-platform p3"></div>

        </div>

        ${
          complete
            ? `
              <div class="g6-level-clear">

                <span>
                  ✓ LEVEL CLEARED
                </span>

                <strong>
                  ${zone.badge}
                </strong>

              </div>
            `
            : ""
        }

        ${buildPortal(
          level,
          complete
        )}

        ${
          unlocked
            ? ""
            : `
              <div class="g6-lock-layer">

                <div class="g6-big-lock">
                  ⌾
                </div>

                <strong>
                  ZONE LOCKED
                </strong>

                <span>
                  Complete previous zone
                </span>

              </div>
            `
        }

      </section>
    `;
  }

  /* ============================================================
     FINAL CORE
     ============================================================ */

  function buildFinalCore() {
    const complete =
      getCompletedSafe().length === 15;

    return `
      <section
        class="
          g6-final
          ${
            complete
              ? "complete"
              : ""
          }
        "
      >

        <div class="g6-core">

          <span class="core-ring ring-a"></span>
          <span class="core-ring ring-b"></span>
          <span class="core-ring ring-c"></span>

          <strong>
            ${
              complete
                ? "✓"
                : "AI"
            }
          </strong>

        </div>

        <span>
          VERIFICATION CORE
        </span>

        <h2>
          ${
            complete
              ? "Investigation Complete"
              : "Final Verification Awaits"
          }
        </h2>

        <p>
          ${
            complete
              ? "Semua mission berhasil diverifikasi."
              : "Selesaikan seluruh mission untuk membuka final verification."
          }
        </p>

      </section>
    `;
  }

  /* ============================================================
     WORLD
     ============================================================ */

  function buildWorld() {
    let zones = "";

    for (
      let level = 1;
      level <= 5;
      level++
    ) {
      zones +=
        buildZone(level);
    }

    return `
      <div
        class="g6-world"
        data-game-version="${VERSION}"
      >

        <div class="g6-space"></div>

        <div class="g6-star s1"></div>
        <div class="g6-star s2"></div>
        <div class="g6-star s3"></div>
        <div class="g6-star s4"></div>
        <div class="g6-star s5"></div>
        <div class="g6-star s6"></div>
        <div class="g6-star s7"></div>
        <div class="g6-star s8"></div>

        ${buildHUD()}

        <main class="g6-main">

          <section class="g6-intro">

            <div class="g6-intro-copy">

              <span>
                AI INVESTIGATION WORLD
              </span>

              <h1>
                Mission Journey
              </h1>

              <p>
                Masuki lima zona investigasi,
                verifikasi klaim AI, dan buka
                jalur menuju Verification Core.
              </p>

            </div>

            ${buildGuide()}

            <div class="g6-legend">

              <span>
                <i class="done"></i>
                Verified
              </span>

              <span>
                <i class="now"></i>
                Current
              </span>

              <span>
                <i class="lock"></i>
                Locked
              </span>

            </div>

          </section>

          ${zones}

          ${buildFinalCore()}

        </main>

      </div>
    `;
  }

  /* ============================================================
     GAME MODE
     ============================================================ */

  function activateGameMode() {
    const screen =
      mapScreen();

    if (!screen) {
      return;
    }

    screen.classList.add(
      "g6-screen"
    );

    const oldHeader =
      screen.querySelector(
        ".map-header"
      );

    if (oldHeader) {
      oldHeader.style.display =
        "none";
    }

    document.body.classList.add(
      "g6-map-open"
    );
  }

  function deactivateGameMode() {
    if (isMapActive()) {
      return;
    }

    document.body.classList.remove(
      "g6-map-open"
    );
  }

  /* ============================================================
     RENDER
     ============================================================ */

  function render(force = false) {
    if (rendering) {
      return;
    }

    if (!isMapActive()) {
      return;
    }

    const container =
      mapContainer();

    if (!container) {
      return;
    }

    if (!getMissionsSafe().length) {
      return;
    }

    const sig =
      makeSignature();

    if (
      !force &&
      container.querySelector(
        ".g6-world"
      ) &&
      sig === lastSignature
    ) {
      activateGameMode();
      return;
    }

    rendering = true;

    try {
      container.innerHTML =
        buildWorld();

      lastSignature =
        sig;

      activateGameMode();
    } finally {
      rendering = false;
    }
  }

  function scheduleRender(
    force = false
  ) {
    window.clearTimeout(
      refreshTimer
    );

    refreshTimer =
      window.setTimeout(() => {
        render(force);
      }, 30);
  }

  /* ============================================================
     CLICK HANDLER
     ============================================================ */

  function openMission(id) {
    const missionId =
      Number(id);

    if (
      !Number.isInteger(missionId) ||
      missionId < 1
    ) {
      return;
    }

    if (!isUnlockedSafe(missionId)) {
      return;
    }

    if (
      typeof window.startMission !==
      "function"
    ) {
      console.error(
        "startMission() tidak tersedia."
      );

      return;
    }

    /*
      Penting:
      tidak memakai delay,
      tidak memakai setTimeout,
      tidak rerender map terlebih dahulu.
    */

    window.startMission(
      missionId
    );
  }

  function installClickHandler() {
    const container =
      mapContainer();

    if (!container) {
      return;
    }

    if (
      container
        .dataset
        .g6ClickHandler === "1"
    ) {
      return;
    }

    container.dataset.g6ClickHandler =
      "1";

    container.addEventListener(
      "click",
      event => {
        const target =
          event.target.closest(
            "[data-mission-id]"
          );

        if (
          !target ||
          !container.contains(target)
        ) {
          return;
        }

        const node =
          target.closest(
            ".g6-node"
          );

        if (
          node &&
          node.classList.contains(
            "g6-locked"
          )
        ) {
          return;
        }

        const id =
          Number(
            target.dataset.missionId ||
            node?.dataset.missionId
          );

        if (!id) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        openMission(id);
      }
    );
  }

  /* ============================================================
     OBSERVE ORIGINAL APP
     ============================================================ */

  function installMapObserver() {
    const container =
      mapContainer();

    if (!container) {
      return;
    }

    if (mapObserver) {
      mapObserver.disconnect();
    }

    mapObserver =
      new MutationObserver(() => {
        if (rendering) {
          return;
        }

        if (!isMapActive()) {
          return;
        }

        /*
          Jika app.js merender Mission Map lama,
          g6-world akan hilang.
          Saat itulah kita render kembali sekali.
        */

        if (
          !container.querySelector(
            ".g6-world"
          )
        ) {
          scheduleRender(true);
        }
      });

    mapObserver.observe(
      container,
      {
        childList: true
      }
    );
  }

  function installScreenObserver() {
    const screen =
      mapScreen();

    if (!screen) {
      return;
    }

    if (screenObserver) {
      screenObserver.disconnect();
    }

    screenObserver =
      new MutationObserver(() => {
        if (isMapActive()) {
          scheduleRender(false);
        } else {
          deactivateGameMode();
        }
      });

    screenObserver.observe(
      screen,
      {
        attributes: true,
        attributeFilter: [
          "class"
        ]
      }
    );
  }

  /* ============================================================
     STABLE INPUT STYLE OVERRIDE
     ============================================================ */

  function installStableInputCSS() {
    if (
      document.getElementById(
        "g6StableInputCSS"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "g6StableInputCSS";

    style.textContent = `

      /*
        V6.3 INPUT FIX
        Tidak ada getaran/zoom pada node.
      */

      .g6-node-button,
      .g6-node-core,
      .g6-node-ring {
        transition: none !important;
      }

      .g6-node-button:hover:not(:disabled)
      .g6-node-core {
        transform: none !important;
      }

      .g6-current
      .g6-node-ring.ring-1,
      .g6-current
      .g6-node-ring.ring-2 {
        animation: none !important;
      }

      .g6-current
      .g6-node-ring.ring-1 {
        box-shadow:
          0 0 28px
          color-mix(
            in srgb,
            var(--zone) 35%,
            transparent
          ) !important;
      }

      .g6-clickable {
        cursor: pointer !important;
      }

      .g6-clickable
      .g6-node-button {
        cursor: pointer !important;
      }

      .g6-node {
        pointer-events: auto !important;
      }

      .g6-node-button {
        pointer-events: auto !important;

        /*
          Hit area diperbesar tanpa
          mengubah ukuran visual node.
        */
      }

      .g6-node-button::after {
        content: "";

        position: absolute;

        inset: -20px;

        z-index: 50;

        border-radius: 50%;
      }

      .g6-node-text {
        pointer-events: none !important;
      }

      .g6-current-panel {
        pointer-events: auto !important;
      }

      .g6-current-panel button {
        pointer-events: auto !important;
        cursor: pointer !important;

        transition:
          box-shadow .12s ease !important;
      }

      .g6-current-panel button:hover {
        transform: none !important;
      }

      .g6-portal,
      .g6-zone-bg,
      .g6-grid,
      .g6-glow,
      .g6-deco,
      .g6-stage-platform,
      .g6-route-svg,
      .g6-node-ring,
      .g6-node-core,
      .g6-space,
      .g6-star {
        pointer-events: none !important;
      }

    `;

    document.head.appendChild(
      style
    );
  }

  /* ============================================================
     INSTALL
     ============================================================ */

  function install() {
    installStableInputCSS();

    installClickHandler();

    installMapObserver();

    installScreenObserver();

    if (isMapActive()) {
      render(true);
    }

    window.AITRAP_GAME_MAP = {
      version: VERSION,

      refresh() {
        render(true);
      }
    };

    console.log(
      "AI TRAP LAB Game Map v6.3 Stable Input loaded."
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        window.setTimeout(
          install,
          120
        );
      }
    );
  } else {
    window.setTimeout(
      install,
      120
    );
  }

})();