/* =========================================================
   AI TRAP LAB
   RC2 MULTI USER SESSION
   Version 2.0.0

   Purpose:
   - Login memakai Nama Lengkap + Tingkat Kelas
   - Tingkat kelas VII–XII
   - Participant ID internal otomatis
   - Multi-user dalam satu perangkat
   - Logout tanpa menghapus progress
   - Menjaga kompatibilitas dengan app.js RC1
   ========================================================= */

(function () {
  "use strict";

  const VERSION = "2.0.0";

  const ACTIVE_ID_KEY =
    "aitrap_rc2_active_participant_id";

  const REGISTRY_KEY =
    "aitrap_rc2_participant_registry";

  const LEGACY_CODE_KEY =
    "aitrap_student_code";

  const LEGACY_CLASS_KEY =
    "aitrap_student_class";

  const ALLOWED_CLASSES = [
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII"
  ];


  /* =======================================================
     HELPERS
     ======================================================= */

  function safeJSONParse(
    value,
    fallback
  ) {

    try {

      const parsed =
        JSON.parse(value);

      return parsed ?? fallback;

    }

    catch {

      return fallback;

    }

  }


  function normalizeName(
    value
  ) {

    return String(
      value || ""
    )
      .trim()
      .replace(/\s+/g, " ")
      .toUpperCase();

  }


  function normalizeClass(
    value
  ) {

    return String(
      value || ""
    )
      .trim()
      .toUpperCase();

  }


  function createParticipantId() {

    const timestamp =
      Date.now()
        .toString(36)
        .toUpperCase();

    const random =
      Math.random()
        .toString(36)
        .slice(2, 7)
        .toUpperCase();

    return (
      "ATL-" +
      timestamp +
      "-" +
      random
    );

  }


  function getRegistry() {

    const raw =
      localStorage.getItem(
        REGISTRY_KEY
      );

    const registry =
      safeJSONParse(
        raw || "[]",
        []
      );

    return Array.isArray(registry)
      ? registry
      : [];

  }


  function saveRegistry(
    registry
  ) {

    localStorage.setItem(
      REGISTRY_KEY,
      JSON.stringify(
        registry
      )
    );

  }


  function findParticipantById(
    participantId
  ) {

    return (
      getRegistry().find(
        item =>
          item &&
          item.id ===
            participantId
      ) || null
    );

  }


  function findParticipantByIdentity(
    name,
    className
  ) {

    const normalizedName =
      normalizeName(name);

    const normalizedClass =
      normalizeClass(
        className
      );

    return (
      getRegistry().find(
        item =>
          item &&
          normalizeName(
            item.name
          ) === normalizedName &&
          normalizeClass(
            item.className
          ) === normalizedClass
      ) || null
    );

  }


  function registerParticipant(
    name,
    className
  ) {

    const normalizedName =
      normalizeName(name);

    const normalizedClass =
      normalizeClass(
        className
      );

    let participant =
      findParticipantByIdentity(
        normalizedName,
        normalizedClass
      );

    if (participant) {

      return participant;

    }


    participant = {

      id:
        createParticipantId(),

      name:
        normalizedName,

      className:
        normalizedClass,

      createdAt:
        new Date()
          .toISOString(),

      lastLoginAt:
        new Date()
          .toISOString()

    };


    const registry =
      getRegistry();

    registry.push(
      participant
    );

    saveRegistry(
      registry
    );


    return participant;

  }


  function updateLastLogin(
    participantId
  ) {

    const registry =
      getRegistry();

    const index =
      registry.findIndex(
        item =>
          item &&
          item.id ===
            participantId
      );

    if (index < 0) {

      return;

    }


    registry[index] = {

      ...registry[index],

      lastLoginAt:
        new Date()
          .toISOString()

    };


    saveRegistry(
      registry
    );

  }


  /* =======================================================
     ACTIVE SESSION
     ======================================================= */

  function getActiveParticipant() {

    const activeId =
      localStorage.getItem(
        ACTIVE_ID_KEY
      );

    if (!activeId) {

      return null;

    }


    return (
      findParticipantById(
        activeId
      ) || null
    );

  }


  function setActiveParticipant(
    participant
  ) {

    if (
      !participant ||
      !participant.id
    ) {

      return;

    }


    localStorage.setItem(
      ACTIVE_ID_KEY,
      participant.id
    );


    /*
      Compatibility layer.

      app.js RC1 masih membaca:
      aitrap_student_code
      aitrap_student_class

      participant.id disimpan sebagai code internal.
    */

    localStorage.setItem(
      LEGACY_CODE_KEY,
      participant.id
    );

    localStorage.setItem(
      LEGACY_CLASS_KEY,
      participant.className
    );


    updateLastLogin(
      participant.id
    );

  }


  function clearActiveSession() {

    localStorage.removeItem(
      ACTIVE_ID_KEY
    );

    /*
      Hanya identitas aktif yang dilepas.

      Progress seperti:
      aitrap_pretest_ID
      aitrap_completed_missions_ID
      aitrap_mission_attempts_ID
      dll TIDAK dihapus.
    */

    localStorage.removeItem(
      LEGACY_CODE_KEY
    );

    localStorage.removeItem(
      LEGACY_CLASS_KEY
    );

  }


  /* =======================================================
     GET PARTICIPANT OVERRIDE
     ======================================================= */

  function rc2GetParticipant() {

    const active =
      getActiveParticipant();

    if (!active) {

      return {

        code: "",

        id: "",

        name: "",

        className: ""

      };

    }


    return {

      /*
        code dipertahankan untuk kompatibilitas
        seluruh engine RC1.
      */

      code:
        active.id,

      id:
        active.id,

      name:
        active.name,

      className:
        active.className

    };

  }


  /* =======================================================
     STUDENT INFO HEADER
     ======================================================= */

  function rc2UpdateStudentInfo() {

    const participant =
      rc2GetParticipant();


    const nameElement =
      document.getElementById(
        "topStudentName"
      );

    const classElement =
      document.getElementById(
        "topStudentClass"
      );


    if (nameElement) {

      nameElement.textContent =
        participant.name ||
        "INVESTIGATOR";

    }


    if (classElement) {

      classElement.textContent =
        participant.className
          ? "KELAS " +
            participant.className
          : "";

    }


    updateLogoutButton();

  }


  /* =======================================================
     IDENTITY FORM
     ======================================================= */

  function rebuildIdentityForm() {

    const screen =
      document.getElementById(
        "screenIdentity"
      );

    if (!screen) {

      return;

    }


    const card =
      screen.querySelector(
        ".identity-card"
      );

    if (!card) {

      return;

    }


    card.innerHTML = `
      <div class="section-tag">
        INVESTIGATOR ACCESS
      </div>

      <h2>
        Masuk sebagai Investigator
      </h2>

      <p class="section-description">
        Masukkan nama lengkap dan pilih tingkat kelas.
        Progress setiap murid akan disimpan secara terpisah
        pada perangkat ini.
      </p>

      <div class="form-group">

        <label for="studentName">
          Nama Lengkap
        </label>

        <input
          id="studentName"
          type="text"
          placeholder="Contoh: MUHAMMAD ROBBY SIDIQ"
          autocomplete="name"
          maxlength="80"
        >

      </div>


      <div class="form-group">

        <label for="studentClass">
          Kelas
        </label>

        <select id="studentClass">

          <option value="">
            Pilih kelas
          </option>

          <option value="VII">
            VII
          </option>

          <option value="VIII">
            VIII
          </option>

          <option value="IX">
            IX
          </option>

          <option value="X">
            X
          </option>

          <option value="XI">
            XI
          </option>

          <option value="XII">
            XII
          </option>

        </select>

      </div>


      <div class="identity-note">

        <div class="note-icon">
          i
        </div>

        <p>
          Gunakan nama lengkap yang sama setiap kali masuk
          agar progress dapat dikenali pada perangkat ini.
        </p>

      </div>


      <div class="form-actions">

        <button
          class="btn btn-secondary"
          type="button"
          onclick="showScreen('screenLanding')"
        >
          ← Kembali
        </button>

        <button
          class="btn btn-primary"
          type="button"
          onclick="submitIdentity()"
        >
          Masuk
          <span>→</span>
        </button>

      </div>
    `;

  }


  /* =======================================================
     SUBMIT IDENTITY
     ======================================================= */

  function rc2SubmitIdentity() {

    const nameInput =
      document.getElementById(
        "studentName"
      );

    const classInput =
      document.getElementById(
        "studentClass"
      );


    if (
      !nameInput ||
      !classInput
    ) {

      console.error(
        "RC2 identity form tidak ditemukan."
      );

      return;

    }


    const name =
      normalizeName(
        nameInput.value
      );

    const className =
      normalizeClass(
        classInput.value
      );


    if (
      name.length < 3
    ) {

      alert(
        "Masukkan nama lengkap terlebih dahulu."
      );

      nameInput.focus();

      return;

    }


    if (
      !ALLOWED_CLASSES.includes(
        className
      )
    ) {

      alert(
        "Pilih kelas VII sampai XII."
      );

      classInput.focus();

      return;

    }


    const participant =
      registerParticipant(
        name,
        className
      );


    setActiveParticipant(
      participant
    );


    rc2UpdateStudentInfo();


    /*
      syncParticipant() dari api.js tetap dapat digunakan
      karena getParticipant().code sekarang = internal ID.
    */

    if (
      typeof syncParticipant ===
      "function"
    ) {

      try {

        syncParticipant();

      }

      catch (error) {

        console.warn(
          "RC2 participant sync warning:",
          error
        );

      }

    }


    if (
      typeof routeParticipant ===
      "function"
    ) {

      routeParticipant();

    }

  }


  /* =======================================================
     RESTORE FORM
     ======================================================= */

  function rc2RestoreParticipantForm() {

    const participant =
      rc2GetParticipant();


    const nameInput =
      document.getElementById(
        "studentName"
      );

    const classInput =
      document.getElementById(
        "studentClass"
      );


    if (
      nameInput &&
      participant.name
    ) {

      nameInput.value =
        participant.name;

    }


    if (
      classInput &&
      participant.className
    ) {

      classInput.value =
        participant.className;

    }


    rc2UpdateStudentInfo();

  }


  /* =======================================================
     LOGOUT
     ======================================================= */

  function rc2Logout() {

    const participant =
      rc2GetParticipant();


    if (!participant.id) {

      clearActiveSession();

      showLandingAfterLogout();

      return;

    }


    const confirmed =
      window.confirm(
        "Keluar dari akun " +
        participant.name +
        "? Progress tidak akan dihapus."
      );


    if (!confirmed) {

      return;

    }


    clearActiveSession();


    /*
      Reset state sementara di RAM.
      Tidak menghapus LocalStorage progress.
    */

    try {

      if (
        typeof currentMissionId !==
        "undefined"
      ) {

        currentMissionId =
          null;

      }

    }

    catch {}


    try {

      if (
        typeof currentStep !==
        "undefined"
      ) {

        currentStep =
          "claim";

      }

    }

    catch {}


    try {

      if (
        typeof answers !==
        "undefined"
      ) {

        answers = {};

      }

    }

    catch {}


    rc2UpdateStudentInfo();


    const nameInput =
      document.getElementById(
        "studentName"
      );

    const classInput =
      document.getElementById(
        "studentClass"
      );


    if (nameInput) {

      nameInput.value =
        "";

    }


    if (classInput) {

      classInput.value =
        "";

    }


    showLandingAfterLogout();

  }


  function showLandingAfterLogout() {

    if (
      typeof showScreen ===
      "function"
    ) {

      showScreen(
        "screenLanding"
      );

    }

    else {

      location.reload();

    }

  }


  /* =======================================================
     LOGOUT BUTTON
     ======================================================= */

  function ensureLogoutButton() {

    const header =
      document.querySelector(
        ".app-header"
      );

    if (!header) {

      return;

    }


    let button =
      document.getElementById(
        "rc2LogoutButton"
      );


    if (button) {

      return;

    }


    button =
      document.createElement(
        "button"
      );

    button.id =
      "rc2LogoutButton";

    button.type =
      "button";

    button.className =
      "rc2-logout-btn";

    button.textContent =
      "Keluar";

    button.addEventListener(
      "click",
      rc2Logout
    );


    const mini =
      header.querySelector(
        ".student-mini"
      );


    if (mini) {

      mini.insertAdjacentElement(
        "afterend",
        button
      );

    }

    else {

      header.appendChild(
        button
      );

    }

  }


  function updateLogoutButton() {

    ensureLogoutButton();


    const button =
      document.getElementById(
        "rc2LogoutButton"
      );

    if (!button) {

      return;

    }


    const participant =
      rc2GetParticipant();


    button.style.display =
      participant.id
        ? "inline-flex"
        : "none";

  }


  /* =======================================================
     REMOVE TEACHER ENTRY FROM STUDENT UI
     ======================================================= */

  function removeTeacherControls() {

    const selectors = [

      "[data-role='teacher']",

      ".teacher-button",

      ".teacher-btn",

      "#teacherButton",

      "#btnTeacher",

      ".btn-teacher"

    ];


    selectors.forEach(
      selector => {

        document
          .querySelectorAll(
            selector
          )
          .forEach(
            element =>
              element.remove()
          );

      }
    );


    /*
      Fallback:
      hapus button/link yang teksnya hanya "Guru".
    */

    document
      .querySelectorAll(
        "button, a"
      )
      .forEach(
        element => {

          const text =
            String(
              element.textContent ||
              ""
            )
              .trim()
              .toLowerCase();


          if (
            text === "guru"
          ) {

            element.remove();

          }

        }
      );

  }


  /* =======================================================
     LIGHT SESSION CSS
     ======================================================= */

  function injectSessionStyles() {

    if (
      document.getElementById(
        "rc2-session-style"
      )
    ) {

      return;

    }


    const style =
      document.createElement(
        "style"
      );

    style.id =
      "rc2-session-style";

    style.textContent = `
      .rc2-logout-btn {
        min-height: 44px;
        padding: 0 18px;
        border: 1px solid #cbd5e1;
        border-radius: 12px;
        background: #ffffff;
        color: #334155;
        font: inherit;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        align-items: center;
        justify-content: center;
        transition:
          background .2s ease,
          border-color .2s ease,
          transform .2s ease;
      }

      .rc2-logout-btn:hover {
        background: #f8fafc;
        border-color: #94a3b8;
      }

      .rc2-logout-btn:active {
        transform: translateY(1px);
      }

      @media (max-width: 720px) {

        .app-header {
          gap: 10px;
        }

        .rc2-logout-btn {
          min-height: 40px;
          padding: 0 12px;
          font-size: 15px;
        }

        .student-mini {
          margin-left: auto;
        }

      }
    `;


    document.head.appendChild(
      style
    );

  }


  /* =======================================================
     INITIALIZE
     ======================================================= */

  function initRC2Session() {

    rebuildIdentityForm();

    injectSessionStyles();

    removeTeacherControls();


    /*
      Override fungsi RC1.
    */

    window.getParticipant =
      rc2GetParticipant;

    window.submitIdentity =
      rc2SubmitIdentity;

    window.restoreParticipantForm =
      rc2RestoreParticipantForm;

    window.updateStudentInfo =
      rc2UpdateStudentInfo;

    window.logoutParticipant =
      rc2Logout;


    const active =
      getActiveParticipant();


    if (active) {

      /*
        Pulihkan compatibility keys jika browser
        dibuka kembali.
      */

      localStorage.setItem(
        LEGACY_CODE_KEY,
        active.id
      );

      localStorage.setItem(
        LEGACY_CLASS_KEY,
        active.className
      );

    }


    rc2RestoreParticipantForm();

    updateLogoutButton();


    console.log(
      "AI TRAP LAB RC2 Session loaded:",
      VERSION
    );

  }


  /* =======================================================
     PUBLIC API
     ======================================================= */

  window.AITRAP_RC2_SESSION = {

    version:
      VERSION,

    getRegistry,

    getActiveParticipant,

    logout:
      rc2Logout,

    login:
      rc2SubmitIdentity

  };


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initRC2Session
    );

  }

  else {

    initRC2Session();

  }

})();