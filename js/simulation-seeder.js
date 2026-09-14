(function () {

  "use strict";

  const params =
    new URLSearchParams(
      window.location.search
    );

  if (
    params.get("simtest") !== "1"
  ) {
    return;
  }


  let running = false;


  function createPanel() {

    const oldPanel =
      document.getElementById(
        "bulkSimulationSeeder"
      );

    if (oldPanel) {
      oldPanel.remove();
    }


    const panel =
      document.createElement(
        "div"
      );


    panel.id =
      "bulkSimulationSeeder";


    panel.style.cssText = `
      position:fixed;
      right:20px;
      bottom:20px;
      width:340px;
      max-width:calc(100vw - 40px);
      padding:18px;
      background:#ffffff;
      color:#172033;
      border-radius:14px;
      box-shadow:0 14px 45px rgba(0,0,0,.28);
      z-index:999999;
      font-family:Arial,sans-serif;
      border:1px solid #dbe3ec;
    `;


    panel.innerHTML = `

      <div
        style="
          font-weight:800;
          font-size:16px;
          margin-bottom:5px;
        "
      >
        AI TRAP LAB
      </div>

      <div
        style="
          font-size:12px;
          color:#64748b;
          margin-bottom:14px;
          line-height:1.5;
        "
      >
        Bulk Simulation Seeder
      </div>

      <div
        id="bulkSeederStatus"
        style="
          font-size:12px;
          font-weight:700;
          margin-bottom:12px;
        "
      >
        READY
      </div>

      <button
        id="bulkSeederButton"
        type="button"
        style="
          width:100%;
          padding:12px;
          border:0;
          border-radius:9px;
          background:#111827;
          color:white;
          font-weight:800;
          cursor:pointer;
        "
      >
        GENERATE 30 DATA TEST
      </button>

      <div
        style="
          margin-top:10px;
          font-size:10px;
          line-height:1.5;
          color:#64748b;
        "
      >
        Sistem akan menghapus data SIM lama lalu membuat TEST-SIM-001 sampai TEST-SIM-030.
      </div>
    `;


    document.body.appendChild(
      panel
    );


    document
      .getElementById(
        "bulkSeederButton"
      )
      .addEventListener(
        "click",
        runSeeder
      );
  }


  async function runSeeder() {

    if (running) {
      return;
    }


    const confirmed =
      confirm(
        "Hapus data simulasi lama dan generate 30 data TEST-SIM baru?"
      );


    if (!confirmed) {
      return;
    }


    running = true;


    const button =
      document.getElementById(
        "bulkSeederButton"
      );


    const status =
      document.getElementById(
        "bulkSeederStatus"
      );


    button.disabled = true;

    button.textContent =
      "PROCESSING...";

    status.textContent =
      "Mengirim 1 bulk request...";


    try {

      const payload = {

        action:
          "SEED_SIMULATION_BATCH",

        participantCode:
          "TEST-SEEDER",

        className:
          "VII-SIM",

        count:
          30,

        clearExisting:
          true,

        seed:
          20260914

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
              payload
            )

        }

      );


      status.textContent =
        "REQUEST TERKIRIM";

      button.textContent =
        "SELESAI";


      alert(
        "Bulk request sudah dikirim. Tunggu sekitar 10–20 detik lalu Refresh Data di Teacher Dashboard."
      );

    }

    catch (error) {

      console.error(
        error
      );


      status.textContent =
        "ERROR";


      button.disabled =
        false;


      button.textContent =
        "COBA LAGI";


      alert(
        "Terjadi error. Periksa Console browser."
      );

    }

    finally {

      running = false;
    }
  }


  window.addEventListener(

    "DOMContentLoaded",

    function () {

      setTimeout(

        createPanel,

        500

      );

    }

  );

})();
