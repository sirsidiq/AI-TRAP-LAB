/* =========================================================
   AI TRAP LAB
   RESEARCH RELEASE GUARD
   Version 5.0.0

   IMPORTANT:
   - TIDAK merender Mission Map.
   - Mission Map sepenuhnya ditangani game-map.js.
   - Menjaga alur penelitian, identity lock, dan Teacher Access.
   ========================================================= */

(function () {
  "use strict";

  const RELEASE_VERSION = "5.0.0";
  const IDENTITY_LOCK_KEY = "aitrap_identity_locked";

  const TEACHER_DASHBOARD_URL =
    "https://script.google.com/macros/s/AKfycbzJBA1wgvKLPnyZo9fXD1GyapEoefgrdZcfuOMlF9D_SCy8hq_0mAVHAuEHhS9yaepJ/exec?page=dashboard";

  const TEACHER_ACCESS_PIN = "2609";

  /* =========================================================
     PARTICIPANT
     ========================================================= */

  function safeParticipant() {
    try {
      if (typeof getParticipant === "function") {
        return getParticipant() || {};
      }
    } catch (error) {
      console.warn(
        "Release Guard: gagal membaca participant.",
        error
      );
    }

    return {};
  }

  function hasParticipantIdentity() {
    const participant = safeParticipant();

    return Boolean(
      participant &&
      participant.code &&
      participant.className
    );
  }

  /* =========================================================
     REMOVE TEST / DEVELOPMENT UI
     ========================================================= */

  function removeDevelopmentUI() {
    const selectors = [
      "#testModePanel",
      ".test-mode-panel",
      "#devPanel",
      ".dev-panel",
      "#developerPanel",
      ".developer-panel",
      "[data-test-control]",
      "[data-dev-control]"
    ];

    selectors.forEach(selector => {
      document
        .querySelectorAll(selector)
        .forEach(element => {
          element.remove();
        });
    });
  }

  /* =========================================================
     IDENTITY LOCK
     ========================================================= */

  function setIdentityLock() {
    if (!hasParticipantIdentity()) {
      return;
    }

    try {
      localStorage.setItem(
        IDENTITY_LOCK_KEY,
        "1"
      );
    } catch (_) {}
  }

  function isIdentityLocked() {
    try {
      return (
        localStorage.getItem(
          IDENTITY_LOCK_KEY
        ) === "1"
      );
    } catch (_) {
      return hasParticipantIdentity();
    }
  }

  /* =========================================================
     GENERIC WRAPPER
     ========================================================= */

  function wrapFunction(
    name,
    guard
  ) {
    const original =
      window[name];

    if (
      typeof original !== "function" ||
      original.__releaseGuardWrapped
    ) {
      return;
    }

    function wrapped(...args) {
      if (
        typeof guard === "function" &&
        guard(...args) === false
      ) {
        return;
      }

      return original.apply(
        this,
        args
      );
    }

    wrapped.__releaseGuardWrapped =
      true;

    wrapped.__releaseOriginal =
      original;

    window[name] = wrapped;
  }

  /* =========================================================
     IDENTITY FUNCTION GUARD
     ========================================================= */

  function installIdentityGuard() {
    if (
      typeof window.submitIdentity !==
      "function"
    ) {
      return;
    }

    if (
      window.submitIdentity
        .__releaseGuardWrapped
    ) {
      return;
    }

    const original =
      window.submitIdentity;

    function guardedSubmitIdentity(
      ...args
    ) {
      if (
        isIdentityLocked() &&
        hasParticipantIdentity()
      ) {
        if (
          typeof routeParticipant ===
          "function"
        ) {
          routeParticipant();
        }

        return;
      }

      const result =
        original.apply(
          this,
          args
        );

      window.setTimeout(
        setIdentityLock,
        120
      );

      return result;
    }

    guardedSubmitIdentity
      .__releaseGuardWrapped = true;

    guardedSubmitIdentity
      .__releaseOriginal =
      original;

    window.submitIdentity =
      guardedSubmitIdentity;
  }

  /* =========================================================
     RESEARCH FLOW GUARDS
     ========================================================= */

  function installResearchGuards() {
    installIdentityGuard();

    wrapFunction(
      "startPretest",
      function () {
        if (
          !hasParticipantIdentity()
        ) {
          alert(
            "Lengkapi identitas terlebih dahulu."
          );

          return false;
        }

        return true;
      }
    );

    /*
       startMission sengaja TIDAK mengubah
       tampilan map.

       game-map.js hanya memanggil fungsi
       startMission asli dari app.js.
    */

    wrapFunction(
      "startMission",
      function () {
        if (
          typeof hasCompletedPretest ===
            "function" &&
          !hasCompletedPretest()
        ) {
          alert(
            "Selesaikan Pretest terlebih dahulu."
          );

          return false;
        }

        return true;
      }
    );

    wrapFunction(
      "openPosttestIntro",
      function () {
        if (
          typeof allMissionsCompleted ===
            "function" &&
          !allMissionsCompleted()
        ) {
          alert(
            "Selesaikan seluruh 15 mission terlebih dahulu."
          );

          return false;
        }

        return true;
      }
    );

    wrapFunction(
      "startPosttest",
      function () {
        if (
          typeof allMissionsCompleted ===
            "function" &&
          !allMissionsCompleted()
        ) {
          alert(
            "Posttest belum terbuka."
          );

          return false;
        }

        return true;
      }
    );

    wrapFunction(
      "startCAL",
      function () {
        if (
          typeof hasCompletedPosttest ===
            "function" &&
          !hasCompletedPosttest()
        ) {
          alert(
            "Selesaikan Posttest terlebih dahulu."
          );

          return false;
        }

        return true;
      }
    );

    wrapFunction(
      "startStudentResponse",
      function () {
        if (
          typeof hasCompletedCAL ===
            "function" &&
          !hasCompletedCAL()
        ) {
          alert(
            "Selesaikan Critical AI Literacy terlebih dahulu."
          );

          return false;
        }

        return true;
      }
    );
  }

  /* =========================================================
     FRONTEND STATE
     ========================================================= */

  function ensureFrontendState() {
    try {
      if (
        typeof restoreParticipantForm ===
        "function"
      ) {
        restoreParticipantForm();
      }
    } catch (error) {
      /*
        app.js lama pernah memiliki typo pada
        proses restore. Release Guard tidak
        membiarkan error tersebut menghentikan
        aplikasi.
      */

      console.warn(
        "Release Guard: restoreParticipantForm gagal.",
        error
      );
    }

    try {
      if (
        typeof updateStudentInfo ===
        "function"
      ) {
        updateStudentInfo();
      }
    } catch (_) {}

    if (hasParticipantIdentity()) {
      setIdentityLock();
    }
  }

  /* =========================================================
     RESUME PARTICIPANT
     ========================================================= */

  function resumeResearchFlow() {
    if (!hasParticipantIdentity()) {
      return;
    }

    try {
      if (
        typeof routeParticipant ===
        "function"
      ) {
        routeParticipant();
      }
    } catch (error) {
      console.warn(
        "Release Guard: routeParticipant gagal.",
        error
      );
    }
  }

  /* =========================================================
     TEACHER ACCESS UI
     ========================================================= */

  function installTeacherAccess() {
    if (
      document.getElementById(
        "teacherAccessButton"
      )
    ) {
      return;
    }

    const studentMini =
      document.querySelector(
        ".student-mini"
      );

    if (!studentMini) {
      return;
    }

    let wrapper =
      studentMini.parentElement;

    if (
      !wrapper ||
      !wrapper.classList.contains(
        "release-header-actions"
      )
    ) {
      wrapper =
        document.createElement(
          "div"
        );

      wrapper.className =
        "release-header-actions";

      studentMini.parentNode
        .insertBefore(
          wrapper,
          studentMini
        );

      wrapper.appendChild(
        studentMini
      );
    }

    const button =
      document.createElement(
        "button"
      );

    button.type = "button";
    button.id =
      "teacherAccessButton";

    button.className =
      "teacher-access-button";

    button.innerHTML = `
      <span>⚙</span>
      <span>Guru</span>
    `;

    wrapper.insertBefore(
      button,
      studentMini
    );

    const overlay =
      document.createElement(
        "div"
      );

    overlay.id =
      "teacherAccessOverlay";

    overlay.className =
      "teacher-access-overlay";

    overlay.setAttribute(
      "aria-hidden",
      "true"
    );

    overlay.innerHTML = `
      <div
        class="teacher-access-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="teacherAccessTitle"
      >

        <button
          type="button"
          class="teacher-access-close"
          aria-label="Tutup"
        >
          ×
        </button>

        <div class="teacher-access-symbol">
          ⚙
        </div>

        <span class="teacher-access-eyebrow">
          TEACHER ACCESS
        </span>

        <h2 id="teacherAccessTitle">
          Research Dashboard
        </h2>

        <p>
          Masukkan PIN guru untuk membuka
          Research Analysis Center.
        </p>

        <label
          for="teacherAccessPin"
          class="teacher-access-label"
        >
          PIN Guru
        </label>

        <input
          id="teacherAccessPin"
          class="teacher-access-input"
          type="password"
          inputmode="numeric"
          autocomplete="off"
          maxlength="12"
          placeholder="Masukkan PIN"
        >

        <div
          id="teacherAccessError"
          class="teacher-access-error"
          aria-live="polite"
        ></div>

        <button
          type="button"
          id="teacherAccessSubmit"
          class="teacher-access-submit"
        >
          Buka Dashboard Guru →
        </button>

        <small class="teacher-access-note">
          Membuka dashboard tidak mengubah
          progress murid.
        </small>

      </div>
    `;

    document.body.appendChild(
      overlay
    );

    const closeButton =
      overlay.querySelector(
        ".teacher-access-close"
      );

    const input =
      overlay.querySelector(
        "#teacherAccessPin"
      );

    const submit =
      overlay.querySelector(
        "#teacherAccessSubmit"
      );

    const error =
      overlay.querySelector(
        "#teacherAccessError"
      );

    function openModal() {
      overlay.classList.add(
        "active"
      );

      overlay.setAttribute(
        "aria-hidden",
        "false"
      );

      document.body.classList.add(
        "teacher-modal-open"
      );

      input.value = "";
      error.textContent = "";

      window.setTimeout(
        () => input.focus(),
        50
      );
    }

    function closeModal() {
      overlay.classList.remove(
        "active"
      );

      overlay.setAttribute(
        "aria-hidden",
        "true"
      );

      document.body.classList.remove(
        "teacher-modal-open"
      );

      input.value = "";
      error.textContent = "";
    }

    function submitAccess() {
      const value =
        input.value.trim();

      if (!value) {
        error.textContent =
          "Masukkan PIN guru.";

        input.focus();

        return;
      }

      if (
        value !==
        TEACHER_ACCESS_PIN
      ) {
        error.textContent =
          "PIN tidak sesuai.";

        input.select();

        return;
      }

      error.textContent = "";

      window.open(
        TEACHER_DASHBOARD_URL,
        "_blank",
        "noopener,noreferrer"
      );

      closeModal();
    }

    button.addEventListener(
      "click",
      openModal
    );

    closeButton.addEventListener(
      "click",
      closeModal
    );

    submit.addEventListener(
      "click",
      submitAccess
    );

    input.addEventListener(
      "keydown",
      event => {
        if (event.key === "Enter") {
          submitAccess();
        }
      }
    );

    overlay.addEventListener(
      "click",
      event => {
        if (
          event.target === overlay
        ) {
          closeModal();
        }
      }
    );

    document.addEventListener(
      "keydown",
      event => {
        if (
          event.key === "Escape" &&
          overlay.classList.contains(
            "active"
          )
        ) {
          closeModal();
        }
      }
    );
  }

  /* =========================================================
     TEACHER ACCESS STYLE ONLY
     ========================================================= */

  function installTeacherStyles() {
    if (
      document.getElementById(
        "researchReleaseStyles"
      )
    ) {
      return;
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "researchReleaseStyles";

    style.textContent = `

      .release-header-actions {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .teacher-access-button {
        min-height: 36px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 7px 11px;
        border: 1px solid #d8e3f3;
        border-radius: 11px;
        background: #ffffff;
        color: #42577a;
        cursor: pointer;
        font: inherit;
        font-size: 11px;
        font-weight: 800;
      }

      .teacher-access-button:hover {
        border-color: #abc3e9;
        box-shadow:
          0 5px 15px
          rgba(39, 70, 116, .10);
      }

      .teacher-access-overlay {
        position: fixed;
        inset: 0;
        z-index: 999999;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background:
          rgba(4, 12, 28, .60);
        backdrop-filter: blur(10px);
      }

      .teacher-access-overlay.active {
        display: flex;
      }

      .teacher-access-modal {
        position: relative;
        width: min(100%, 410px);
        padding: 30px;
        border: 1px solid #dce6f4;
        border-radius: 24px;
        background: #fff;
        box-shadow:
          0 30px 90px
          rgba(0,0,0,.28);
      }

      .teacher-access-close {
        position: absolute;
        top: 13px;
        right: 13px;
        width: 35px;
        height: 35px;
        border: 0;
        border-radius: 10px;
        background: #eef3f9;
        color: #63738d;
        cursor: pointer;
        font-size: 21px;
      }

      .teacher-access-symbol {
        width: 52px;
        height: 52px;
        display: grid;
        place-items: center;
        margin-bottom: 17px;
        border-radius: 16px;
        background:
          linear-gradient(
            135deg,
            #3e8cff,
            #7657f4
          );
        color: #fff;
        font-size: 20px;
      }

      .teacher-access-eyebrow {
        color: #5072da;
        font-size: 9px;
        font-weight: 900;
        letter-spacing: .15em;
      }

      .teacher-access-modal h2 {
        margin: 6px 0 8px;
        color: #162850;
        font-size: 27px;
      }

      .teacher-access-modal p {
        margin: 0 0 20px;
        color: #71809a;
        font-size: 13px;
        line-height: 1.6;
      }

      .teacher-access-label {
        display: block;
        margin-bottom: 7px;
        color: #40516e;
        font-size: 11px;
        font-weight: 800;
      }

      .teacher-access-input {
        width: 100%;
        height: 48px;
        padding: 0 14px;
        border: 1px solid #d5dfed;
        border-radius: 12px;
        outline: none;
        background: #f8fafd;
        color: #223557;
        font: inherit;
        font-size: 15px;
      }

      .teacher-access-input:focus {
        border-color: #6085ea;
        box-shadow:
          0 0 0 4px
          rgba(79, 109, 222, .10);
      }

      .teacher-access-error {
        min-height: 18px;
        margin-top: 7px;
        color: #d44f55;
        font-size: 11px;
        font-weight: 700;
      }

      .teacher-access-submit {
        width: 100%;
        min-height: 45px;
        margin-top: 5px;
        border: 0;
        border-radius: 12px;
        background:
          linear-gradient(
            135deg,
            #4387f7,
            #7156ed
          );
        color: #fff;
        cursor: pointer;
        font: inherit;
        font-size: 11px;
        font-weight: 900;
      }

      .teacher-access-note {
        display: block;
        margin-top: 12px;
        color: #98a3b6;
        font-size: 9px;
        text-align: center;
      }

      body.teacher-modal-open {
        overflow: hidden;
      }

    `;

    document.head.appendChild(
      style
    );
  }

  /* =========================================================
     INSTALL
     ========================================================= */

  function installResearchRelease() {
    removeDevelopmentUI();

    installTeacherStyles();

    installTeacherAccess();

    installResearchGuards();

    ensureFrontendState();
  }

  /* =========================================================
     FIRST LOAD
     ========================================================= */

  document.addEventListener(
    "DOMContentLoaded",
    function () {
      window.setTimeout(
        function () {
          installResearchRelease();

          resumeResearchFlow();
        },
        180
      );
    }
  );

  /* =========================================================
     PAGE RESTORE
     ========================================================= */

  window.addEventListener(
    "pageshow",
    function () {
      window.setTimeout(
        function () {
          installResearchRelease();

          if (
            hasParticipantIdentity()
          ) {
            resumeResearchFlow();
          }
        },
        80
      );
    }
  );

  /* =========================================================
     RELEASE INFORMATION
     ========================================================= */

  window.AITRAP_RELEASE = {
    name:
      "AI TRAP LAB Research Release",

    version:
      RELEASE_VERSION,

    mode:
      "RESEARCH",

    testControls:
      false,

    teacherAccess:
      true,

    missionMapRenderer:
      "game-map.js"
  };

})();