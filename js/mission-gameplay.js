/* ============================================================
   AI TRAP LAB — GAMEPLAY ENGINE
   FINAL RC1 — VERSION 3.1.0

   15 MISSIONS
   5 ZONES
   CLAIM → CHECK → TEST → CORRECT → JUSTIFY

   ZONES:
   1. PATTERN REACTOR
   2. SEQUENCE WORKSHOP
   3. LOGIC CHAMBER
   4. OPTIMIZATION ARENA
   5. EVIDENCE VAULT
   ============================================================ */

(function () {
  "use strict";

  const VERSION = "3.1.0";

  const originalRenderMissionStep =
    window.renderMissionStep;

  const states = {};

  /* ============================================================
     ZONE THEME
     ============================================================ */

  function getZoneTheme(missionData) {
    const level =
      Number(
        missionData?.level || 1
      );

    const themes = {
      1: {
        className: "mg-zone-pattern",
        label: "PATTERN REACTOR",
        icon: "⌁",
        description:
          "Deteksi aturan, bandingkan pola, dan uji konsistensinya."
      },

      2: {
        className: "mg-zone-sequence",
        label: "SEQUENCE WORKSHOP",
        icon: "⇢",
        description:
          "Periksa urutan, langkah yang hilang, dan alternatif prosedur."
      },

      3: {
        className: "mg-zone-logic",
        label: "LOGIC CHAMBER",
        icon: "◇",
        description:
          "Uji kondisi, batas, aturan logika, dan konsekuensi keputusan."
      },

      4: {
        className: "mg-zone-efficiency",
        label: "OPTIMIZATION ARENA",
        icon: "⚙",
        description:
          "Bandingkan solusi berdasarkan waktu, langkah, sumber daya, dan batas."
      },

      5: {
        className: "mg-zone-verification",
        label: "EVIDENCE VAULT",
        icon: "◈",
        description:
          "Pisahkan confidence dari evidence dan nilai kekuatan bukti."
      }
    };

    return (
      themes[level] ||
      themes[1]
    );
  }

  /* ============================================================
     DISPLAY OVERRIDE UNTUK DISTRACTOR
     Value asli tetap dipertahankan agar scoring lama aman.
     ============================================================ */

  const shallowDistractors = {
    1: {
      warna:
        "Jumlah seluruh bilangan pada pola"
    },

    2: {
      judul:
        "Jumlah suku yang terlihat pada pola"
    },

    3: {
      warna:
        "Besarnya angka terakhir sebelum tanda tanya"
    },

    4: {
      warna:
        "Panjang teks pesan yang akan dikirim"
    },

    5: {
      warna:
        "Jumlah halaman buku yang dipinjam"
    },

    6: {
      font:
        "Nama file yang akan disimpan"
    },

    7: {
      nama:
        "Nilai rata-rata kelas Budi"
    },

    8: {
      warna:
        "Jumlah buku lain yang tersedia di rak"
    },

    9: {
      nama:
        "Jumlah total langkah A dan B"
    },

    10: {
      warna:
        "Jumlah klik untuk membuka aplikasi"
    },

    11: {
      nama:
        "Jumlah total data kedua metode"
    },

    12: {
      huruf:
        "Urutan nama pilihan A, B, dan C"
    },

    13: {
      confidence:
        "Confidence AI 99%"
    },

    14: {
      warna:
        "Urutan huruf G dan M dalam alfabet"
    },

    15: {
      warna:
        "Apakah video memiliki gambar dan suara"
    }
  };

  /* ============================================================
     TEST CONFIGURATION
     ============================================================ */

  const testConfigs = {
    1: {
      kind: "number",
      title: "MULTIPLIER TEST",
      prompt:
        "Jika aturan ×2 benar, berapa suku setelah 32?",
      expected: "64",
      hint:
        "Uji 2 → 4 → 8 → 16 → 32 dengan aturan yang sama."
    },

    2: {
      kind: "number",
      title: "VERIFICATION TEST",
      prompt:
        "Jika semua pasangan benar-benar ×2, berapa hasil 24 × 2?",
      expected: "48",
      hint:
        "Jangan menerima klaim hanya karena terlihat masuk akal."
    },

    3: {
      kind: "dual",
      title: "DUAL PATTERN TEST",
      prompt:
        "Uji pola selisih ganjil dan pola kuadrat.",
      expected: "36",
      hint:
        "Kedua jalur harus menghasilkan nilai yang sama."
    },

    4: {
      kind: "sequence",
      title: "SEQUENCE REPAIR",
      prompt:
        "Susun urutan yang dapat benar-benar dilakukan di WhatsApp.",

      tokens: [
        "Buka WhatsApp",
        "Pilih kontak",
        "Ketik pesan",
        "Tekan kirim"
      ],

      target: [
        "Buka WhatsApp",
        "Pilih kontak",
        "Ketik pesan",
        "Tekan kirim"
      ]
    },

    5: {
      kind: "sequence",
      title: "MISSING STEP LAB",
      prompt:
        "Susun prosedur peminjaman yang lengkap.",

      tokens: [
        "Cari buku",
        "Ambil buku",
        "Catat peminjaman",
        "Bawa buku"
      ],

      target: [
        "Cari buku",
        "Ambil buku",
        "Catat peminjaman",
        "Bawa buku"
      ]
    },

    6: {
      kind: "scenario",
      title: "ALTERNATIVE PATH TEST",
      prompt:
        "Uji apakah folder memang harus dibuat setelah dokumen dibuka.",

      choices: [
        {
          id: "valid",
          text:
            "Buat folder → buka aplikasi → buat dokumen → simpan ke folder",
          detail:
            "Urutan ini dapat dilakukan dan mencapai tujuan.",
          ok: true
        },

        {
          id: "invalid",
          text:
            "Dokumen tidak dapat disimpan jika folder dibuat lebih dahulu",
          detail:
            "Pernyataan ini terlalu membatasi proses.",
          ok: false
        }
      ]
    },

    7: {
      kind: "scenario",
      title: "LOGIC GATE TEST",
      prompt:
        "Aturan memakai DAN. Evaluasi kedua syarat Budi.",

      choices: [
        {
          id: "fail",
          text:
            "85 ≥ 75 = benar; 70 ≥ 80 = salah → BELUM TUNTAS",
          detail:
            "Pada logika DAN, semua kondisi wajib benar.",
          ok: true
        },

        {
          id: "pass",
          text:
            "Nilai 85 sudah cukup → TUNTAS",
          detail:
            "Pilihan ini mengabaikan syarat kehadiran.",
          ok: false
        }
      ]
    },

    8: {
      kind: "scenario",
      title: "BOUNDARY TEST",
      prompt:
        "Uji tepat pada nilai batas maksimum.",

      choices: [
        {
          id: "allow",
          text:
            "2 + 1 = 3 dan 3 masih memenuhi maksimal 3",
          detail:
            "Nilai yang sama dengan batas masih diperbolehkan.",
          ok: true
        },

        {
          id: "deny",
          text:
            "Karena harus kurang dari 3, total 3 ditolak",
          detail:
            "Ini mengubah makna 'maksimal 3'.",
          ok: false
        }
      ]
    },

    9: {
      kind: "scenario",
      title: "ROUTE RACE",
      prompt:
        "Bandingkan jumlah langkah dengan waktu aktual.",

      choices: [
        {
          id: "b",
          text:
            "Rute B: 5 langkah, 2 menit",
          detail:
            "Lebih banyak langkah tetapi lebih cepat.",
          ok: true
        },

        {
          id: "a",
          text:
            "Rute A: 3 langkah, 4 menit",
          detail:
            "Lebih sedikit langkah tetapi lebih lambat.",
          ok: false
        }
      ]
    },

    10: {
      kind: "scenario",
      title: "CONSTRAINT CHECKER",
      prompt:
        "Tentukan solusi yang memenuhi tujuan dan aturan pengumpulan.",

      choices: [
        {
          id: "lms",
          text:
            "Gunakan LMS meskipun 5 langkah",
          detail:
            "Memenuhi aturan wajib dan tujuan pengumpulan.",
          ok: true
        },

        {
          id: "email",
          text:
            "Gunakan email karena hanya 4 langkah",
          detail:
            "Lebih sedikit langkah tetapi melanggar aturan.",
          ok: false
        }
      ]
    },

    11: {
      kind: "scenario",
      title: "EFFICIENCY METER",
      prompt:
        "Ubah kriterianya dan lihat metode mana yang unggul.",

      choices: [
        {
          id: "metric",
          text:
            "A unggul untuk waktu; B unggul untuk penggunaan data",
          detail:
            "Efisiensi bergantung pada kriteria yang diprioritaskan.",
          ok: true
        },

        {
          id: "a",
          text:
            "A selalu paling efisien",
          detail:
            "Hanya memakai satu metrik: waktu.",
          ok: false
        },

        {
          id: "b",
          text:
            "B selalu paling efisien",
          detail:
            "Hanya memakai satu metrik: data.",
          ok: false
        }
      ]
    },

    12: {
      kind: "scenario",
      title: "COMBINATION OPTIMIZER",
      prompt:
        "Gunakan batas 30 menit dan cari total poin terbesar.",

      choices: [
        {
          id: "bc",
          text:
            "B + C = 30 menit → 100 poin",
          detail:
            "Kombinasi ini memenuhi batas dan memberi poin terbesar.",
          ok: true
        },

        {
          id: "a",
          text:
            "A = 20 menit → 60 poin",
          detail:
            "Pilihan lokal terbesar tidak optimal secara keseluruhan.",
          ok: false
        },

        {
          id: "ab",
          text:
            "A + B = 35 menit → 110 poin",
          detail:
            "Poin besar tetapi melampaui batas waktu.",
          ok: false
        }
      ]
    },

    13: {
      kind: "scenario",
      title: "POWER-OFF SIMULATION",
      prompt:
        "Gunakan sifat RAM untuk menguji klaim penyimpanan permanen.",

      choices: [
        {
          id: "volatile",
          text:
            "Daya diputus → data RAM hilang",
          detail:
            "RAM pada umumnya bersifat volatil.",
          ok: true
        },

        {
          id: "permanent",
          text:
            "Daya diputus → data RAM tetap permanen",
          detail:
            "Ini sesuai klaim AI, tetapi tidak sesuai konsep RAM volatil.",
          ok: false
        }
      ]
    },

    14: {
      kind: "scenario",
      title: "REASONING MATCHER",
      prompt:
        "Pisahkan kesimpulan dari alasan yang digunakan AI.",

      choices: [
        {
          id: "units",
          text:
            "1 GB > 1 MB berdasarkan hubungan satuan kapasitas",
          detail:
            "Kesimpulannya benar dengan alasan yang relevan.",
          ok: true
        },

        {
          id: "alphabet",
          text:
            "1 GB > 1 MB karena G dan M memiliki posisi alfabet tertentu",
          detail:
            "Kesimpulan benar, tetapi alasan alfabet tidak valid.",
          ok: false
        }
      ]
    },

    15: {
      kind: "scenario",
      title: "EVIDENCE SUFFICIENCY BOARD",
      prompt:
        "Uji apakah klaim 'selalu' dan 'semua murid' sudah didukung bukti cukup.",

      choices: [
        {
          id: "insufficient",
          text:
            "Butuh bukti lintas murid, materi, tujuan, dan kondisi",
          detail:
            "Klaim universal membutuhkan bukti yang luas dan relevan.",
          ok: true
        },

        {
          id: "one",
          text:
            "Satu video yang berhasil sudah cukup untuk semua murid",
          detail:
            "Satu contoh tidak cukup untuk klaim universal.",
          ok: false
        }
      ]
    }
  };

  /* ============================================================
     HELPERS
     ============================================================ */

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function mission() {
    return typeof getMissionById ===
      "function"
      ? getMissionById(
          currentMissionId
        )
      : null;
  }

  function state() {
    const id =
      Number(
        currentMissionId
      );

    if (!states[id]) {
      states[id] = {
        check: [],

        test: {
          input: "",
          input2: "",

          runs: 0,
          runs2: 0,

          passed: false,
          passed2: false,

          history: [],
          history2: [],

          sequence: [],
          scenario: null
        },

        correct: null
      };
    }

    return states[id];
  }

  function toast(
    text,
    type = "info"
  ) {
    document
      .querySelectorAll(
        ".mg-toast"
      )
      .forEach(
        element =>
          element.remove()
      );

    const element =
      document.createElement(
        "div"
      );

    element.className =
      `mg-toast ${type}`;

    element.textContent =
      text;

    document.body.appendChild(
      element
    );

    requestAnimationFrame(
      () => {
        element.classList.add(
          "show"
        );
      }
    );

    setTimeout(
      () => {
        element
          .classList
          .remove(
            "show"
          );

        setTimeout(
          () =>
            element.remove(),
          180
        );
      },
      1700
    );
  }

  function header(
    step,
    label,
    title,
    description
  ) {
    const missionData =
      mission();

    const zone =
      getZoneTheme(
        missionData
      );

    return `
      <div
        class="
          mg-zone-banner
          ${zone.className}
        "
      >

        <div class="mg-zone-symbol">
          ${zone.icon}
        </div>

        <div>

          <span>
            ${zone.label}
          </span>

          <small>
            ${zone.description}
          </small>

        </div>

      </div>

      <div class="mg-header">

        <div class="mg-step-code">
          0${step}
        </div>

        <div class="mg-header-copy">

          <span>
            ${label}
          </span>

          <h3>
            ${esc(title)}
          </h3>

          <p>
            ${esc(description)}
          </p>

        </div>

        <div class="mg-case-id">
          CASE #${String(
            currentMissionId
          ).padStart(2, "0")}
        </div>

      </div>
    `;
  }

  function shuffled(
    list,
    id
  ) {
    const source =
      [...list];

    const length =
      source.length;

    if (!length) {
      return source;
    }

    const offset =
      Number(id) %
      length;

    const output =
      source
        .slice(offset)
        .concat(
          source.slice(
            0,
            offset
          )
        );

    return Number(id) % 2
      ? output.reverse()
      : output;
  }

  function next() {
    currentStep++;
    window.renderMissionStep();
  }

  function previous() {
    if (currentStep === 4) {
      const textarea =
        document
          .getElementById(
            "justifyAnswer"
          );

      if (textarea) {
        answers.justify =
          textarea.value;
      }
    }

    if (currentStep > 0) {
      currentStep--;

      window
        .renderMissionStep();
    }
  }

  /* ============================================================
     CLAIM
     ============================================================ */

  function renderClaim(
    missionData
  ) {
    const options =
      shuffled(
        missionData
          .claim
          .options,
        missionData.id
      );

    const selected =
      answers.claim;

    document
      .getElementById(
        "stepContent"
      )
      .innerHTML = `
        <div class="mg-screen">

          ${header(
            1,
            "CLAIM SCANNER",
            "Tentukan sikap awal investigator",
            "Jangan percaya atau menolak hanya dari tampilan jawaban. Tentukan sikap awal sebelum memeriksa bukti."
          )}

          <div class="mg-scanner">

            <div class="mg-ai-orb">
              AI
            </div>

            <div class="mg-confidence">

              <span>
                AI CONFIDENCE • SIMULASI
              </span>

              <strong>
                ${esc(
                  missionData.confidence
                )}
              </strong>

              <i></i>

            </div>

            <div class="mg-claim-message">

              <small>
                CLAIM UNDER REVIEW
              </small>

              <strong>
                “${esc(
                  missionData.aiClaim
                )}”
              </strong>

            </div>

            <div class="mg-decision-grid">

              ${options
                .map(option => `
                  <button
                    type="button"
                    class="
                      mg-decision
                      ${
                        selected ===
                        option.value
                          ? "selected"
                          : ""
                      }
                    "
                    onclick="
                      mgClaim(
                        '${esc(
                          option.value
                        )}'
                      )
                    "
                  >

                    <b>
                      ${
                        option.value ===
                        "belum"
                          ? "◎"
                          : option.value ===
                            "benar"
                          ? "✓"
                          : "×"
                      }
                    </b>

                    <span>
                      ${esc(
                        option.text
                      )}
                    </span>

                    <small>
                      ${
                        option.value ===
                        "belum"
                          ? "Tahan keputusan sampai bukti diperiksa."
                          : "Keputusan awal akan diuji pada tahap berikutnya."
                      }
                    </small>

                  </button>
                `)
                .join("")}

            </div>

            ${
              selected
                ? `
                  <div
                    class="
                      mg-feedback
                      ${
                        selected ===
                        missionData
                          .claim
                          .bestAnswer
                          ? "success"
                          : "warning"
                      }
                    "
                  >

                    <strong>
                      ${
                        selected ===
                        missionData
                          .claim
                          .bestAnswer
                          ? "INVESTIGATOR MODE ACTIVE"
                          : "DECISION RECORDED"
                      }
                    </strong>

                    <p>
                      ${
                        selected ===
                        missionData
                          .claim
                          .bestAnswer
                          ? "Sikap awal yang baik: verifikasi dulu dengan evidence."
                          : "Pilihanmu dicatat. Evidence berikutnya dapat menguatkan atau mengoreksinya."
                      }
                    </p>

                  </div>
                `
                : ""
            }

          </div>

          <div class="mg-actions">

            <span></span>

            <button
              class="
                mg-primary
                ${
                  selected
                    ? ""
                    : "disabled"
                }
              "
              onclick="
                mgClaimNext()
              "
            >
              MASUK EVIDENCE LAB →
            </button>

          </div>

        </div>
      `;
  }

  /* ============================================================
     CHECK
     ============================================================ */

  function checkText(
    missionData,
    option
  ) {
    return (
      shallowDistractors[
        missionData.id
      ]?.[
        option.value
      ] ||
      option.text
    );
  }

  function renderCheck(
    missionData
  ) {
    const currentState =
      state();

    if (
      !currentState.check.length &&
      Array.isArray(
        answers.check
      ) &&
      answers.check.length
    ) {
      currentState.check =
        [...answers.check];
    }

    const expected =
      missionData
        .check
        .correctAnswers;

    const correct =
      currentState.check
        .filter(
          value =>
            expected.includes(
              value
            )
        )
        .length;

    const wrong =
      currentState.check
        .filter(
          value =>
            !expected.includes(
              value
            )
        )
        .length;

    document
      .getElementById(
        "stepContent"
      )
      .innerHTML = `
        <div class="mg-screen">

          ${header(
            2,
            "EVIDENCE LAB",
            "Pilih bukti yang benar-benar relevan",
            "Informasi yang benar belum tentu merupakan bukti yang berguna. Pilih hanya yang membantu menguji klaim AI."
          )}

          <div class="mg-case-banner">

            <small>
              INVESTIGATION TARGET
            </small>

            <strong>
              ${esc(
                missionData.stimulus
              )}
            </strong>

            <p>
              ${esc(
                missionData.aiClaim
              )}
            </p>

          </div>

          <div class="mg-evidence-summary">

            <span>
              TERPILIH
              <b>
                ${
                  currentState
                    .check
                    .length
                }
              </b>
            </span>

            <span>
              RELEVAN DITEMUKAN
              <b>
                ${correct}/${
                  expected.length
                }
              </b>
            </span>

          </div>

          <div class="mg-evidence-grid">

            ${missionData
              .check
              .options
              .map(option => `
                <button
                  type="button"
                  class="
                    mg-evidence
                    ${
                      currentState
                        .check
                        .includes(
                          option.value
                        )
                        ? "selected"
                        : ""
                    }
                  "
                  onclick="
                    mgToggleEvidence(
                      '${esc(
                        option.value
                      )}'
                    )
                  "
                >

                  <div class="mg-evidence-icon">
                    ${
                      currentState
                        .check
                        .includes(
                          option.value
                        )
                        ? "✓"
                        : "+"
                    }
                  </div>

                  <div>

                    <small>
                      EVIDENCE CARD
                    </small>

                    <strong>
                      ${esc(
                        checkText(
                          missionData,
                          option
                        )
                      )}
                    </strong>

                    <p>
                      ${
                        expected
                          .includes(
                            option.value
                          )
                          ? "Dapat berkaitan langsung dengan pengujian klaim."
                          : "Masih berkaitan dengan konteks, tetapi apakah benar membantu membuktikan klaim?"
                      }
                    </p>

                  </div>

                </button>
              `)
              .join("")}

          </div>

          <div
            class="
              mg-feedback
              ${
                wrong
                  ? "warning"
                  : (
                      correct ===
                        expected.length &&
                      currentState
                        .check
                        .length ===
                        expected.length
                    )
                  ? "success"
                  : ""
              }
            "
          >

            <strong>
              EVIDENCE ANALYZER
            </strong>

            <p>
              ${
                wrong
                  ? "Ada kartu yang tidak membantu menguji klaim. Kurangi evidence yang tidak relevan."
                  : (
                      correct ===
                        expected.length &&
                      currentState
                        .check
                        .length ===
                        expected.length
                    )
                  ? "Evidence set lengkap dan relevan."
                  : `Temukan ${expected.length} evidence utama yang diperlukan.`
              }
            </p>

          </div>

          <div class="mg-actions">

            <button
              class="mg-secondary"
              onclick="
                mgPrevious()
              "
            >
              ← KEMBALI
            </button>

            <button
              class="
                mg-primary
                ${
                  currentState
                    .check
                    .length
                    ? ""
                    : "disabled"
                }
              "
              onclick="
                mgCheckNext()
              "
            >
              VALIDASI EVIDENCE →
            </button>

          </div>

        </div>
      `;
  }

  /* ============================================================
     TEST HISTORY
     ============================================================ */

  function history(
    items
  ) {
    if (!items.length) {
      return `
        <div class="mg-history-empty">
          Belum ada percobaan.
        </div>
      `;
    }

    return items
      .slice()
      .reverse()
      .slice(0, 4)
      .map(item => `
        <div
          class="
            mg-history
            ${
              item.ok
                ? "ok"
                : "bad"
            }
          "
        >

          <span>
            TRY #${item.run}
          </span>

          <strong>
            ${esc(
              item.value
            )}
          </strong>

          <b>
            ${
              item.ok
                ? "VALID"
                : "REJECTED"
            }
          </b>

        </div>
      `)
      .join("");
  }

  /* ============================================================
     NUMBER TEST
     ============================================================ */

  function renderNumberTest(
    missionData,
    config,
    currentState
  ) {
    return `
      <div
        class="
          mg-test-console
          ${
            currentState
              .test
              .passed
              ? "complete"
              : ""
          }
        "
      >

        <small>
          ${esc(
            config.title
          )}
        </small>

        <h4>
          ${esc(
            config.prompt
          )}
        </h4>

        <p>
          ${esc(
            config.hint || ""
          )}
        </p>

        <div class="mg-input-row">

          <input
            id="mgTestInput"
            type="number"
            inputmode="numeric"
            value="${esc(
              currentState
                .test
                .input
            )}"
            placeholder="?"
            oninput="
              mgTestInput(
                this.value
              )
            "
            onkeydown="
              if(
                event.key ===
                'Enter'
              ){
                mgRunNumberTest();
              }
            "
          >

          <button
            onclick="
              mgRunNumberTest()
            "
          >
            ▶ RUN TEST
          </button>

        </div>

        <div class="mg-test-history">

          ${history(
            currentState
              .test
              .history
          )}

        </div>

        ${
          currentState
            .test
            .passed
            ? `
              <div class="mg-test-success">
                ✓ TEST VERIFIED •
                hasil ${esc(
                  config.expected
                )}
              </div>
            `
            : ""
        }

        <button
          class="mg-reset"
          onclick="
            mgResetTest()
          "
        >
          ↺ RESET TEST
        </button>

      </div>
    `;
  }

  /* ============================================================
     DUAL TEST
     ============================================================ */

  function renderDualTest(
    missionData,
    config,
    currentState
  ) {
    return `
      <div class="mg-test-grid">

        <div
          class="
            mg-test-console
            ${
              currentState
                .test
                .passed
                ? "complete"
                : ""
            }
          "
        >

          <small>
            TEST A • ODD DIFFERENCE
          </small>

          <h4>
            25 + selisih ganjil
            berikutnya = ?
          </h4>

          <div class="mg-input-row">

            <input
              type="number"
              value="${esc(
                currentState
                  .test
                  .input
              )}"
              placeholder="?"
              oninput="
                mgTestInput(
                  this.value
                )
              "
            >

            <button
              onclick="
                mgRunDualTest(1)
              "
            >
              ▶ RUN A
            </button>

          </div>

          ${
            currentState
              .test
              .passed
              ? `
                <div class="mg-test-success">
                  ✓ +3,+5,+7,+9,+11
                  → 36
                </div>
              `
              : ""
          }

        </div>

        <div
          class="
            mg-test-console
            ${
              currentState
                .test
                .passed2
                ? "complete"
                : ""
            }
          "
        >

          <small>
            TEST B • SQUARE PATTERN
          </small>

          <h4>
            6² = ?
          </h4>

          <div class="mg-input-row">

            <input
              type="number"
              value="${esc(
                currentState
                  .test
                  .input2
              )}"
              placeholder="?"
              oninput="
                mgTestInput2(
                  this.value
                )
              "
            >

            <button
              onclick="
                mgRunDualTest(2)
              "
            >
              ▶ RUN B
            </button>

          </div>

          ${
            currentState
              .test
              .passed2
              ? `
                <div class="mg-test-success">
                  ✓ 1²,2²,3²,4²,5²,6²
                  → 36
                </div>
              `
              : ""
          }

        </div>

      </div>

      <div class="mg-lab-status">

        <strong>
          ${
            Number(
              currentState
                .test
                .passed
            ) +
            Number(
              currentState
                .test
                .passed2
            )
          }
          / 2 TEST VERIFIED
        </strong>

        <button
          onclick="
            mgResetTest()
          "
        >
          ↺ RESET ALL
        </button>

      </div>
    `;
  }

  /* ============================================================
     SEQUENCE TEST
     ============================================================ */

  function renderSequenceTest(
    missionData,
    config,
    currentState
  ) {
    const selectedIndexes =
      currentState
        .test
        .sequence
        .map(
          item =>
            item.idx
        );

    return `
      <div class="mg-sequence-lab">

        <div class="mg-sequence-target">

          ${
            currentState
              .test
              .sequence
              .length
              ? currentState
                  .test
                  .sequence
                  .map(
                    (
                      item,
                      index
                    ) => `
                      <button
                        onclick="
                          mgRemoveSequence(
                            ${index}
                          )
                        "
                      >

                        <small>
                          ${index + 1}
                        </small>

                        ${esc(
                          item.text
                        )}

                      </button>
                    `
                  )
                  .join(
                    `<i>→</i>`
                  )
              : `
                  <span>
                    Klik langkah di bawah
                    untuk menyusun urutan...
                  </span>
                `
          }

        </div>

        <div class="mg-token-bank">

          ${config.tokens
            .map(
              (
                text,
                index
              ) => {
                if (
                  selectedIndexes
                    .includes(
                      index
                    )
                ) {
                  return "";
                }

                return `
                  <button
                    onclick="
                      mgAddSequence(
                        ${index}
                      )
                    "
                  >
                    ${esc(text)}
                  </button>
                `;
              }
            )
            .join("")}

        </div>

        <div class="mg-builder-tools">

          <button
            onclick="
              mgResetTest()
            "
          >
            ↺ RESET
          </button>

          <button
            class="verify"
            onclick="
              mgVerifySequence()
            "
          >
            ▶ RUN SEQUENCE
          </button>

        </div>

        ${
          currentState
            .test
            .passed
            ? `
              <div class="mg-test-success">
                ✓ Urutan dapat dijalankan
                secara logis.
              </div>
            `
            : ""
        }

      </div>
    `;
  }

  /* ============================================================
     SCENARIO TEST
     ============================================================ */

  function renderScenarioTest(
    missionData,
    config,
    currentState
  ) {
    return `
      <div class="mg-scenario-grid">

        ${config.choices
          .map(choice => `
            <button
              class="
                mg-scenario
                ${
                  currentState
                    .test
                    .scenario ===
                    choice.id
                    ? (
                        choice.ok
                          ? "selected good"
                          : "selected bad"
                      )
                    : ""
                }
              "
              onclick="
                mgScenario(
                  '${esc(
                    choice.id
                  )}'
                )
              "
            >

              <small>
                SIMULATION OPTION
              </small>

              <strong>
                ${esc(
                  choice.text
                )}
              </strong>

              <p>
                ${esc(
                  choice.detail
                )}
              </p>

            </button>
          `)
          .join("")}

      </div>

      ${
        currentState
          .test
          .scenario
          ? `
            <div
              class="
                mg-feedback
                ${
                  currentState
                    .test
                    .passed
                    ? "success"
                    : "warning"
                }
              "
            >

              <strong>
                ${
                  currentState
                    .test
                    .passed
                    ? "TEST PASSED"
                    : "TEST FAILED"
                }
              </strong>

              <p>
                ${
                  currentState
                    .test
                    .passed
                    ? "Hipotesis ini sesuai bukti dan aturan pada kasus."
                    : "Hipotesis belum memenuhi bukti atau aturan. Coba alternatif lain."
                }
              </p>

            </div>
          `
          : ""
      }

      <button
        class="mg-reset"
        onclick="
          mgResetTest()
        "
      >
        ↺ RESET SIMULATION
      </button>
    `;
  }

  /* ============================================================
     TEST
     ============================================================ */

  function renderTest(
    missionData
  ) {
    const currentState =
      state();

    const config =
      testConfigs[
        missionData.id
      ];

    let body = "";

    if (
      config.kind ===
      "number"
    ) {
      body =
        renderNumberTest(
          missionData,
          config,
          currentState
        );
    } else if (
      config.kind ===
      "dual"
    ) {
      body =
        renderDualTest(
          missionData,
          config,
          currentState
        );
    } else if (
      config.kind ===
      "sequence"
    ) {
      body =
        renderSequenceTest(
          missionData,
          config,
          currentState
        );
    } else {
      body =
        renderScenarioTest(
          missionData,
          config,
          currentState
        );
    }

    const passed =
      config.kind ===
      "dual"
        ? (
            currentState
              .test
              .passed &&
            currentState
              .test
              .passed2
          )
        : currentState
            .test
            .passed;

    document
      .getElementById(
        "stepContent"
      )
      .innerHTML = `
        <div class="mg-screen">

          ${header(
            3,
            config.title,
            "Jalankan pengujian, bukan menebak jawaban",
            config.prompt
          )}

          <div class="mg-lab-objective">

            <b>
              ◈
            </b>

            <div>

              <small>
                TEST PRINCIPLE
              </small>

              <strong>
                Eksperimen boleh diulang
                sampai pola atau aturan
                benar-benar terbukti.
              </strong>

              <p>
                Kesalahan percobaan adalah
                bagian dari proses
                investigasi.
              </p>

            </div>

          </div>

          ${body}

          <div class="mg-actions">

            <button
              class="mg-secondary"
              onclick="
                mgPrevious()
              "
            >
              ← KEMBALI
            </button>

            <button
              class="
                mg-primary
                ${
                  passed
                    ? ""
                    : "disabled"
                }
              "
              onclick="
                mgTestNext()
              "
            >
              BUKA FINAL VERDICT →
            </button>

          </div>

        </div>
      `;
  }

  /* ============================================================
     CORRECT
     ============================================================ */

  function renderCorrect(
    missionData
  ) {
    const currentState =
      state();

    const options =
      shuffled(
        missionData
          .correct
          .options,
        missionData.id + 7
      );

    document
      .getElementById(
        "stepContent"
      )
      .innerHTML = `
        <div class="mg-screen">

          ${header(
            4,
            "FINAL VERDICT",
            "Tetapkan keputusan berdasarkan hasil test",
            "Pilih kesimpulan yang paling sesuai dengan evidence dan hasil pengujian, bukan berdasarkan posisi kartu."
          )}

          <div class="mg-verdict-grid">

            ${options
              .map(
                (
                  option,
                  index
                ) => `
                  <button
                    class="
                      mg-verdict
                      ${
                        currentState
                          .correct ===
                          option.value
                          ? (
                              option.value ===
                              missionData
                                .correct
                                .correctAnswer
                                ? "good"
                                : "bad"
                            )
                          : ""
                      }
                    "
                    onclick="
                      mgVerdict(
                        '${esc(
                          option.value
                        )}'
                      )
                    "
                  >

                    <small>
                      VERDICT
                      ${String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </small>

                    <strong>
                      ${esc(
                        option.text
                      )}
                    </strong>

                  </button>
                `
              )
              .join("")}

          </div>

          ${
            currentState.correct
              ? `
                <div
                  class="
                    mg-feedback
                    ${
                      currentState
                        .correct ===
                        missionData
                          .correct
                          .correctAnswer
                        ? "success"
                        : "warning"
                    }
                  "
                >

                  <strong>
                    ${
                      currentState
                        .correct ===
                        missionData
                          .correct
                          .correctAnswer
                        ? "VERDICT VERIFIED"
                        : "VERDICT REJECTED"
                    }
                  </strong>

                  <p>
                    ${
                      currentState
                        .correct ===
                        missionData
                          .correct
                          .correctAnswer
                        ? "Kesimpulan sesuai dengan hasil investigasi."
                        : "Kesimpulan belum sesuai evidence. Periksa kembali hasil TEST."
                    }
                  </p>

                </div>
              `
              : ""
          }

          <div class="mg-actions">

            <button
              class="mg-secondary"
              onclick="
                mgPrevious()
              "
            >
              ← KEMBALI
            </button>

            <button
              class="
                mg-primary
                ${
                  currentState
                    .correct ===
                    missionData
                      .correct
                      .correctAnswer
                    ? ""
                    : "disabled"
                }
              "
              onclick="
                mgCorrectNext()
              "
            >
              BUAT CASE REPORT →
            </button>

          </div>

        </div>
      `;
  }

  /* ============================================================
     JUSTIFY ANALYSIS
     ============================================================ */

  function reportAnalysis(
    missionData,
    text
  ) {
    const normalized =
      String(
        text || ""
      )
        .toLowerCase()
        .trim();

    const keywords =
      (
        missionData
          .justify
          .keywords ||
        []
      )
        .map(
          item =>
            String(item)
              .toLowerCase()
        );

    return {
      length:
        normalized.length >=
        60,

      topic:
        keywords.some(
          keyword =>
            normalized.includes(
              keyword
            )
        ),

      reason:
        /karena|sehingga|maka|tetapi|namun|walaupun|meskipun/
          .test(
            normalized
          ),

      evidence:
        /bukti|uji|periksa|verifikasi|pola|syarat|aturan|data|hasil/
          .test(
            normalized
          )
    };
  }

  function reportPanel(
    analysis,
    count
  ) {
    const item =
      (
        ok,
        title,
        description
      ) => `
        <div
          class="
            mg-rubric
            ${
              ok
                ? "done"
                : ""
            }
          "
        >

          <b>
            ${
              ok
                ? "✓"
                : "○"
            }
          </b>

          <span>

            <strong>
              ${title}
            </strong>

            <small>
              ${description}
            </small>

          </span>

        </div>
      `;

    return `
      <div class="mg-readiness">

        <span>
          REPORT READINESS
        </span>

        <strong>
          ${count}/4
        </strong>

      </div>

      ${item(
        analysis.length,
        "Kelengkapan",
        "Penjelasan cukup untuk menunjukkan reasoning."
      )}

      ${item(
        analysis.topic,
        "Konteks",
        "Menyebut konsep atau bukti yang relevan."
      )}

      ${item(
        analysis.reason,
        "Hubungan alasan",
        "Menghubungkan bukti dan kesimpulan."
      )}

      ${item(
        analysis.evidence,
        "Verifikasi",
        "Menunjukkan proses uji, aturan, bukti, atau pemeriksaan."
      )}

      <p class="mg-readiness-note">
        Indikator ini bukan skor penelitian final.
      </p>
    `;
  }

  /* ============================================================
     JUSTIFY
     ============================================================ */

  function renderJustify(
    missionData
  ) {
    const text =
      answers.justify ||
      "";

    const analysis =
      reportAnalysis(
        missionData,
        text
      );

    const count =
      [
        analysis.length,
        analysis.topic,
        analysis.reason,
        analysis.evidence
      ]
        .filter(Boolean)
        .length;

    document
      .getElementById(
        "stepContent"
      )
      .innerHTML = `
        <div class="mg-screen">

          ${header(
            5,
            "INVESTIGATOR REPORT",
            "Jelaskan alasan dengan bahasamu sendiri",
            "Ini bukan soal pilihan ganda. Gunakan evidence dan hasil test untuk mempertanggungjawabkan keputusanmu."
          )}

          <div class="mg-report-question">

            <small>
              MISSION QUESTION
            </small>

            <strong>
              ${esc(
                missionData
                  .justify
                  .prompt
              )}
            </strong>

            <p>
              Jelaskan apa yang kamu
              temukan, bukti apa yang
              mendukungnya, dan mengapa
              klaim AI layak diterima,
              diperbaiki, atau ditunda.
            </p>

          </div>

          <div class="mg-report-layout">

            <div class="mg-report-writing">

              <label>
                INVESTIGATOR ANALYSIS
              </label>

              <textarea
                id="justifyAnswer"
                rows="9"
                placeholder="Tuliskan penjelasanmu berdasarkan evidence dan hasil pengujian..."
                oninput="
                  mgReportInput()
                "
              >${esc(text)}</textarea>

              <small>
                Tulis dengan bahasamu
                sendiri. Tidak ada satu
                kalimat baku yang harus
                sama persis.
              </small>

            </div>

            <div
              id="mgReportAnalyzer"
              class="mg-report-analyzer"
            >
              ${reportPanel(
                analysis,
                count
              )}
            </div>

          </div>

          <div class="mg-research-note">

            <strong>
              PENILAIAN
            </strong>

            <p>
              Report Readiness hanya
              membantu mengecek
              kelengkapan argumentasi.
              Jawaban asli tetap
              disimpan untuk penilaian
              menggunakan rubrik.
            </p>

          </div>

          <div class="mg-actions">

            <button
              class="mg-secondary"
              onclick="
                mgPrevious()
              "
            >
              ← KEMBALI
            </button>

            <button
              id="mgSubmit"
              class="
                mg-submit
                ${
                  count >= 3 &&
                  text
                    .trim()
                    .length >=
                    40
                    ? ""
                    : "disabled"
                }
              "
              onclick="
                mgSubmitReport()
              "
            >
              SUBMIT CASE REPORT ✓
            </button>

          </div>

        </div>
      `;
  }

  /* ============================================================
     RENDER OVERRIDE
     ============================================================ */

  window.renderMissionStep =
    function () {
      const missionData =
        mission();

      const container =
        document
          .getElementById(
            "stepContent"
          );

      if (
        !missionData ||
        !container
      ) {
        if (
          typeof
            originalRenderMissionStep ===
          "function"
        ) {
          return originalRenderMissionStep();
        }

        return;
      }

      if (
        typeof
          updateStepIndicators ===
        "function"
      ) {
        updateStepIndicators();
      }

      if (currentStep === 0) {
        return renderClaim(
          missionData
        );
      }

      if (currentStep === 1) {
        return renderCheck(
          missionData
        );
      }

      if (currentStep === 2) {
        return renderTest(
          missionData
        );
      }

      if (currentStep === 3) {
        return renderCorrect(
          missionData
        );
      }

      if (currentStep === 4) {
        return renderJustify(
          missionData
        );
      }
    };

  /* ============================================================
     CLAIM EVENTS
     ============================================================ */

  window.mgClaim =
    function (value) {
      answers.claim =
        value;

      window
        .renderMissionStep();
    };

  window.mgClaimNext =
    function () {
      if (!answers.claim) {
        return toast(
          "Pilih sikap awal terlebih dahulu.",
          "warning"
        );
      }

      next();
    };

  /* ============================================================
     CHECK EVENTS
     ============================================================ */

  window.mgToggleEvidence =
    function (value) {
      const currentState =
        state();

      const index =
        currentState
          .check
          .indexOf(
            value
          );

      if (index >= 0) {
        currentState
          .check
          .splice(
            index,
            1
          );
      } else {
        currentState
          .check
          .push(
            value
          );
      }

      answers.check =
        [
          ...currentState
            .check
        ];

      window
        .renderMissionStep();
    };

  window.mgCheckNext =
    function () {
      const missionData =
        mission();

      const currentState =
        state();

      const expected =
        [
          ...missionData
            .check
            .correctAnswers
        ]
          .sort();

      const selected =
        [
          ...currentState
            .check
        ]
          .sort();

      const exact =
        expected.length ===
          selected.length &&
        expected.every(
          (
            value,
            index
          ) =>
            value ===
            selected[index]
        );

      if (!exact) {
        return toast(
          "Evidence belum tepat. Pilih hanya bukti yang benar-benar relevan.",
          "warning"
        );
      }

      answers.check =
        [
          ...currentState
            .check
        ];

      toast(
        "Evidence tervalidasi.",
        "success"
      );

      next();
    };

  /* ============================================================
     TEST EVENTS
     ============================================================ */

  window.mgTestInput =
    function (value) {
      state()
        .test
        .input =
        value;
    };

  window.mgTestInput2 =
    function (value) {
      state()
        .test
        .input2 =
        value;
    };

  window.mgRunNumberTest =
    function () {
      const currentState =
        state();

      const config =
        testConfigs[
          currentMissionId
        ];

      const value =
        String(
          currentState
            .test
            .input
        )
          .trim();

      if (!value) {
        return toast(
          "Masukkan prediksi terlebih dahulu.",
          "warning"
        );
      }

      currentState
        .test
        .runs++;

      const valid =
        Number(value) ===
        Number(
          config.expected
        );

      currentState
        .test
        .history
        .push({
          run:
            currentState
              .test
              .runs,

          value,

          ok: valid
        });

      currentState
        .test
        .passed =
        valid;

      toast(
        valid
          ? "Test valid!"
          : "Belum cocok. Ulangi pengujian.",
        valid
          ? "success"
          : "warning"
      );

      window
        .renderMissionStep();
    };

  window.mgRunDualTest =
    function (which) {
      const currentState =
        state();

      const config =
        testConfigs[
          currentMissionId
        ];

      if (which === 1) {
        const value =
          String(
            currentState
              .test
              .input
          )
            .trim();

        if (!value) {
          return toast(
            "Masukkan hasil Test A.",
            "warning"
          );
        }

        currentState
          .test
          .runs++;

        currentState
          .test
          .passed =
          Number(value) ===
          Number(
            config.expected
          );

        currentState
          .test
          .history
          .push({
            run:
              currentState
                .test
                .runs,

            value,

            ok:
              currentState
                .test
                .passed
          });

      } else {
        const value =
          String(
            currentState
              .test
              .input2
          )
            .trim();

        if (!value) {
          return toast(
            "Masukkan hasil Test B.",
            "warning"
          );
        }

        currentState
          .test
          .runs2++;

        currentState
          .test
          .passed2 =
          Number(value) ===
          Number(
            config.expected
          );

        currentState
          .test
          .history2
          .push({
            run:
              currentState
                .test
                .runs2,

            value,

            ok:
              currentState
                .test
                .passed2
          });
      }

      const valid =
        which === 1
          ? currentState
              .test
              .passed
          : currentState
              .test
              .passed2;

      toast(
        valid
          ? "Pengujian valid."
          : "Hasil belum cocok. Coba lagi.",
        valid
          ? "success"
          : "warning"
      );

      window
        .renderMissionStep();
    };

  window.mgAddSequence =
    function (index) {
      const currentState =
        state();

      const config =
        testConfigs[
          currentMissionId
        ];

      if (
        currentState
          .test
          .sequence
          .some(
            item =>
              item.idx ===
              index
          )
      ) {
        return;
      }

      currentState
        .test
        .sequence
        .push({
          idx: index,

          text:
            config
              .tokens[
                index
              ]
        });

      currentState
        .test
        .passed =
        false;

      window
        .renderMissionStep();
    };

  window.mgRemoveSequence =
    function (index) {
      const currentState =
        state();

      currentState
        .test
        .sequence
        .splice(
          index,
          1
        );

      currentState
        .test
        .passed =
        false;

      window
        .renderMissionStep();
    };

  window.mgVerifySequence =
    function () {
      const currentState =
        state();

      const config =
        testConfigs[
          currentMissionId
        ];

      const sequence =
        currentState
          .test
          .sequence
          .map(
            item =>
              item.text
          );

      const valid =
        sequence.length ===
          config
            .target
            .length &&
        sequence.every(
          (
            value,
            index
          ) =>
            value ===
            config
              .target[
                index
              ]
        );

      currentState
        .test
        .passed =
        valid;

      toast(
        valid
          ? "Urutan valid!"
          : "Urutan belum dapat dijalankan. Susun kembali.",
        valid
          ? "success"
          : "warning"
      );

      window
        .renderMissionStep();
    };

  window.mgScenario =
    function (id) {
      const currentState =
        state();

      const config =
        testConfigs[
          currentMissionId
        ];

      const choice =
        config
          .choices
          .find(
            item =>
              item.id ===
              id
          );

      currentState
        .test
        .scenario =
        id;

      currentState
        .test
        .passed =
        Boolean(
          choice?.ok
        );

      toast(
        currentState
          .test
          .passed
          ? "Simulasi berhasil."
          : "Simulasi belum mendukung klaim. Coba alternatif.",
        currentState
          .test
          .passed
          ? "success"
          : "warning"
      );

      window
        .renderMissionStep();
    };

  window.mgResetTest =
    function () {
      state().test = {
        input: "",
        input2: "",

        runs: 0,
        runs2: 0,

        passed: false,
        passed2: false,

        history: [],
        history2: [],

        sequence: [],
        scenario: null
      };

      answers.test =
        null;

      toast(
        "Test direset. Silakan coba lagi."
      );

      window
        .renderMissionStep();
    };

  window.mgTestNext =
    function () {
      const missionData =
        mission();

      const currentState =
        state();

      const config =
        testConfigs[
          missionData.id
        ];

      const valid =
        config.kind ===
        "dual"
          ? (
              currentState
                .test
                .passed &&
              currentState
                .test
                .passed2
            )
          : currentState
              .test
              .passed;

      if (!valid) {
        return toast(
          "Selesaikan pengujian terlebih dahulu.",
          "warning"
        );
      }

      answers.test =
        missionData
          .test
          .correctAnswer;

      next();
    };

  /* ============================================================
     CORRECT EVENTS
     ============================================================ */

  window.mgVerdict =
    function (value) {
      const missionData =
        mission();

      const currentState =
        state();

      currentState.correct =
        value;

      answers.correct =
        value;

      const valid =
        value ===
        missionData
          .correct
          .correctAnswer;

      toast(
        valid
          ? "Verdict sesuai evidence."
          : "Verdict belum sesuai hasil test.",
        valid
          ? "success"
          : "warning"
      );

      window
        .renderMissionStep();
    };

  window.mgCorrectNext =
    function () {
      const missionData =
        mission();

      if (
        answers.correct !==
        missionData
          .correct
          .correctAnswer
      ) {
        return toast(
          "Tetapkan verdict yang benar terlebih dahulu.",
          "warning"
        );
      }

      next();
    };

  /* ============================================================
     PREVIOUS
     ============================================================ */

  window.mgPrevious =
    function () {
      previous();
    };

  /* ============================================================
     REPORT EVENTS
     ============================================================ */

  window.mgReportInput =
    function () {
      const missionData =
        mission();

      const textarea =
        document
          .getElementById(
            "justifyAnswer"
          );

      if (!textarea) {
        return;
      }

      answers.justify =
        textarea.value;

      const analysis =
        reportAnalysis(
          missionData,
          textarea.value
        );

      const count =
        [
          analysis.length,
          analysis.topic,
          analysis.reason,
          analysis.evidence
        ]
          .filter(Boolean)
          .length;

      const panel =
        document
          .getElementById(
            "mgReportAnalyzer"
          );

      const button =
        document
          .getElementById(
            "mgSubmit"
          );

      if (panel) {
        panel.innerHTML =
          reportPanel(
            analysis,
            count
          );
      }

      if (button) {
        button
          .classList
          .toggle(
            "disabled",
            !(
              count >= 3 &&
              textarea
                .value
                .trim()
                .length >=
                40
            )
          );
      }
    };

  window.mgSubmitReport =
    function () {
      const missionData =
        mission();

      const textarea =
        document
          .getElementById(
            "justifyAnswer"
          );

      if (!textarea) {
        return;
      }

      answers.justify =
        textarea
          .value
          .trim();

      const analysis =
        reportAnalysis(
          missionData,
          answers.justify
        );

      const count =
        [
          analysis.length,
          analysis.topic,
          analysis.reason,
          analysis.evidence
        ]
          .filter(Boolean)
          .length;

      if (
        answers
          .justify
          .length < 40 ||
        count < 3
      ) {
        return toast(
          "Laporan masih terlalu singkat atau belum menunjukkan alasan dan bukti yang cukup.",
          "warning"
        );
      }

      if (
        typeof
          submitMission ===
        "function"
      ) {
        submitMission();
      }
    };

  /* ============================================================
     STYLE
     ============================================================ */

  function installStyle() {
    const old =
      document
        .getElementById(
          "missionGameplayV3CSS"
        );

    if (old) {
      old.remove();
    }

    const style =
      document
        .createElement(
          "style"
        );

    style.id =
      "missionGameplayV3CSS";

    style.textContent = `

.mg-screen{
  width:100%;
  min-height:520px;
  animation:mgIn .18s ease;
}

@keyframes mgIn{
  from{
    opacity:0;
    transform:translateY(5px);
  }

  to{
    opacity:1;
    transform:none;
  }
}

/* =========================================================
   ZONE IDENTITY
   ========================================================= */

.mg-zone-banner{
  display:flex;
  gap:12px;
  align-items:center;
  margin-bottom:14px;
  padding:11px 14px;
  border:1px solid #d7e4f1;
  border-radius:14px;
  background:#f7faff;
}

.mg-zone-symbol{
  width:40px;
  height:40px;
  display:grid;
  place-items:center;
  flex:0 0 40px;
  border-radius:12px;
  font-size:19px;
  font-weight:900;
}

.mg-zone-banner span{
  display:block;
  font-size:9px;
  font-weight:900;
  letter-spacing:.12em;
}

.mg-zone-banner small{
  display:block;
  margin-top:3px;
  color:#8090a5;
  font-size:9px;
  line-height:1.4;
}

/* PATTERN */

.mg-zone-pattern{
  border-color:#b9dcf3;
  background:
    linear-gradient(
      100deg,
      #eef8ff,
      #f7fbff
    );
}

.mg-zone-pattern .mg-zone-symbol{
  background:#dff2ff;
  color:#208bcf;
}

.mg-zone-pattern span{
  color:#167fbe;
}

/* SEQUENCE */

.mg-zone-sequence{
  border-color:#b8e3dd;
  background:
    linear-gradient(
      100deg,
      #edfaf7,
      #f7fcfb
    );
}

.mg-zone-sequence .mg-zone-symbol{
  background:#dcf6ef;
  color:#15977a;
}

.mg-zone-sequence span{
  color:#15846c;
}

/* LOGIC */

.mg-zone-logic{
  border-color:#d8cef2;
  background:
    linear-gradient(
      100deg,
      #f4f1ff,
      #faf9ff
    );
}

.mg-zone-logic .mg-zone-symbol{
  background:#e9e3ff;
  color:#6b52d6;
}

.mg-zone-logic span{
  color:#6651c5;
}

/* EFFICIENCY */

.mg-zone-efficiency{
  border-color:#f0d6ad;
  background:
    linear-gradient(
      100deg,
      #fff8eb,
      #fffcf6
    );
}

.mg-zone-efficiency .mg-zone-symbol{
  background:#fff0ce;
  color:#c58218;
}

.mg-zone-efficiency span{
  color:#ad7318;
}

/* VERIFICATION */

.mg-zone-verification{
  border-color:#ecc5cf;
  background:
    linear-gradient(
      100deg,
      #fff1f5,
      #fff9fb
    );
}

.mg-zone-verification .mg-zone-symbol{
  background:#ffe2ea;
  color:#ca4d70;
}

.mg-zone-verification span{
  color:#b74363;
}

/* =========================================================
   HEADER
   ========================================================= */

.mg-header{
  display:grid;
  grid-template-columns:auto 1fr auto;
  gap:16px;
  align-items:start;
  margin-bottom:24px;
}

.mg-step-code{
  width:56px;
  height:56px;
  display:grid;
  place-items:center;
  border-radius:17px;
  background:
    linear-gradient(
      135deg,
      #168de9,
      #7057ed
    );
  color:#fff;
  font-size:18px;
  font-weight:900;
  box-shadow:
    0 12px 28px
    rgba(57,105,222,.2);
}

.mg-header-copy>span,
.mg-case-id{
  font-size:9px;
  font-weight:900;
  letter-spacing:.13em;
  color:#1688ca;
}

.mg-header-copy h3{
  margin:4px 0 5px;
  color:#152d4f;
  font-size:27px;
  line-height:1.12;
}

.mg-header-copy p{
  margin:0;
  color:#7185a2;
  font-size:13px;
  line-height:1.55;
}

.mg-case-id{
  padding:8px 10px;
  border:1px solid #d6e3f1;
  border-radius:9px;
  background:#f7faff;
  color:#7587a2;
}

/* =========================================================
   CLAIM
   ========================================================= */

.mg-scanner,
.mg-test-console,
.mg-sequence-lab,
.mg-report-writing,
.mg-report-analyzer{
  border:1px solid #d7e4f1;
  border-radius:20px;
  background:#f9fcff;
}

.mg-scanner{
  padding:26px;
}

.mg-ai-orb{
  width:68px;
  height:68px;
  display:grid;
  place-items:center;
  margin:0 auto 13px;
  border-radius:22px;
  background:
    linear-gradient(
      135deg,
      #258df3,
      #7259ed
    );
  color:#fff;
  font-size:20px;
  font-weight:900;
  box-shadow:
    0 12px 30px
    rgba(65,91,220,.2);
}

.mg-confidence{
  max-width:440px;
  margin:0 auto 18px;
  display:grid;
  grid-template-columns:1fr auto;
  gap:8px;
  align-items:center;
  color:#778ca8;
  font-size:9px;
  font-weight:900;
  letter-spacing:.1em;
}

.mg-confidence i{
  grid-column:1/-1;
  height:7px;
  border-radius:99px;
  background:
    linear-gradient(
      90deg,
      #25a8f2 0 93%,
      #e2e9f4 93%
    );
}

.mg-claim-message{
  max-width:720px;
  margin:0 auto 18px;
  padding:18px;
  border:1px solid #ccdef1;
  border-radius:15px;
  background:#fff;
  text-align:center;
}

.mg-claim-message small{
  display:block;
  margin-bottom:5px;
  color:#4c8bc7;
  font-size:8px;
  font-weight:900;
  letter-spacing:.12em;
}

.mg-claim-message strong{
  color:#253d5a;
  font-size:14px;
  line-height:1.5;
}

.mg-decision-grid,
.mg-verdict-grid,
.mg-scenario-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:11px;
}

.mg-decision,
.mg-verdict,
.mg-scenario,
.mg-evidence{
  border:1px solid #d8e4f0;
  border-radius:15px;
  background:#fff;
  cursor:pointer;
  font:inherit;
  text-align:left;
  transition:
    .15s ease;
}

.mg-decision{
  min-height:120px;
  padding:16px;
}

.mg-decision:hover,
.mg-verdict:hover,
.mg-scenario:hover,
.mg-evidence:hover{
  border-color:#8fc2ea;
  transform:translateY(-1px);
  box-shadow:
    0 8px 20px
    rgba(46,88,128,.06);
}

.mg-decision.selected,
.mg-evidence.selected{
  border-color:#3e98e2;
  background:#edf7ff;
  box-shadow:
    0 0 0 3px
    rgba(50,147,225,.08);
}

.mg-decision b{
  width:34px;
  height:34px;
  display:grid;
  place-items:center;
  margin-bottom:10px;
  border-radius:10px;
  background:#eef4fa;
  color:#347fbd;
}

.mg-decision span{
  display:block;
  color:#29435f;
  font-size:11px;
  font-weight:900;
}

.mg-decision small{
  display:block;
  margin-top:4px;
  color:#8495aa;
  font-size:9px;
  line-height:1.4;
}

/* =========================================================
   EVIDENCE
   ========================================================= */

.mg-case-banner{
  padding:15px 17px;
  border-left:4px solid #438eea;
  border-radius:12px;
  background:#f2f7fe;
}

.mg-case-banner small{
  display:block;
  color:#568aca;
  font-size:8px;
  font-weight:900;
  letter-spacing:.1em;
}

.mg-case-banner strong{
  display:block;
  margin-top:4px;
  color:#29445f;
  font-size:12px;
}

.mg-case-banner p{
  margin:5px 0 0;
  color:#70839b;
  font-size:10px;
}

.mg-evidence-summary{
  display:flex;
  gap:18px;
  margin:18px 0 10px;
  color:#778aa4;
  font-size:9px;
  font-weight:900;
  letter-spacing:.07em;
}

.mg-evidence-summary b{
  color:#168dcf;
  font-size:16px;
}

.mg-evidence-grid{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:11px;
}

.mg-evidence{
  display:grid;
  grid-template-columns:auto 1fr;
  gap:11px;
  align-items:center;
  min-height:105px;
  padding:14px;
}

.mg-evidence-icon{
  width:38px;
  height:38px;
  display:grid;
  place-items:center;
  border-radius:11px;
  background:#eaf3fb;
  color:#2d85c7;
  font-weight:900;
}

.mg-evidence small,
.mg-scenario small,
.mg-verdict small{
  display:block;
  color:#6e93b7;
  font-size:7px;
  font-weight:900;
  letter-spacing:.1em;
}

.mg-evidence strong,
.mg-scenario strong,
.mg-verdict strong{
  display:block;
  margin-top:3px;
  color:#29435f;
  font-size:11px;
}

.mg-evidence p,
.mg-scenario p{
  margin:4px 0 0;
  color:#8494a8;
  font-size:9px;
  line-height:1.4;
}

/* =========================================================
   FEEDBACK
   ========================================================= */

.mg-feedback{
  margin-top:13px;
  padding:11px 13px;
  border-radius:11px;
  background:#f3f6fa;
  color:#667d98;
}

.mg-feedback.success{
  background:#eaf9f2;
  color:#267c62;
}

.mg-feedback.warning{
  background:#fff6e5;
  color:#8a6727;
}

.mg-feedback strong{
  font-size:8px;
  letter-spacing:.1em;
}

.mg-feedback p{
  margin:3px 0 0;
  font-size:9px;
}

/* =========================================================
   TEST
   ========================================================= */

.mg-lab-objective{
  display:flex;
  gap:12px;
  align-items:center;
  margin-bottom:14px;
  padding:13px;
  border:1px solid #d8e5f2;
  border-radius:14px;
  background:#f5faff;
}

.mg-lab-objective>b{
  width:40px;
  height:40px;
  display:grid;
  place-items:center;
  flex:0 0 40px;
  border-radius:12px;
  background:#e3f1ff;
  color:#2886d2;
}

.mg-lab-objective small{
  display:block;
  color:#6f91b3;
  font-size:7px;
  font-weight:900;
  letter-spacing:.1em;
}

.mg-lab-objective strong{
  display:block;
  margin-top:2px;
  color:#29425d;
  font-size:11px;
}

.mg-lab-objective p{
  margin:2px 0 0;
  color:#8191a5;
  font-size:9px;
}

.mg-test-console,
.mg-sequence-lab{
  padding:18px;
}

.mg-test-console.complete{
  border-color:#66cdaa;
  background:#f3fbf8;
}

.mg-test-console>small{
  color:#3e91ca;
  font-size:8px;
  font-weight:900;
  letter-spacing:.1em;
}

.mg-test-console h4{
  margin:5px 0;
  color:#29435f;
  font-size:15px;
}

.mg-test-console>p{
  margin:0 0 13px;
  color:#8293a8;
  font-size:10px;
}

.mg-input-row{
  display:grid;
  grid-template-columns:100px 1fr;
  gap:8px;
}

.mg-input-row input{
  min-height:44px;
  border:1px solid #c8daeb;
  border-radius:10px;
  background:#fff;
  color:#24445f;
  font:inherit;
  font-size:16px;
  font-weight:900;
  text-align:center;
  outline:none;
}

.mg-input-row input:focus{
  border-color:#4899de;
  box-shadow:
    0 0 0 3px
    rgba(67,149,219,.09);
}

.mg-input-row button{
  border:0;
  border-radius:10px;
  background:
    linear-gradient(
      100deg,
      #248ce3,
      #6763ed
    );
  color:#fff;
  cursor:pointer;
  font:inherit;
  font-size:9px;
  font-weight:900;
}

.mg-test-history{
  margin-top:12px;
}

.mg-history,
.mg-history-empty{
  margin-top:5px;
  padding:7px 9px;
  border-radius:8px;
  background:#f0f4f8;
  font-size:8px;
}

.mg-history{
  display:grid;
  grid-template-columns:
    1fr auto auto;
  gap:8px;
}

.mg-history.ok{
  background:#e9f9f2;
  color:#267d62;
}

.mg-history.bad{
  background:#fff1f1;
  color:#a8575d;
}

.mg-test-success{
  margin-top:10px;
  padding:9px;
  border-radius:9px;
  background:#e8f8f1;
  color:#218264;
  font-size:9px;
  font-weight:900;
}

.mg-reset{
  margin-top:10px;
  padding:8px 10px;
  border:1px solid #d6e2ee;
  border-radius:8px;
  background:#fff;
  color:#71839b;
  cursor:pointer;
  font:inherit;
  font-size:8px;
  font-weight:900;
}

.mg-test-grid{
  display:grid;
  grid-template-columns:
    repeat(2,1fr);
  gap:12px;
}

.mg-lab-status{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-top:11px;
  padding:10px 12px;
  border-radius:10px;
  background:#f1f6fb;
  color:#52708e;
  font-size:9px;
}

.mg-lab-status button{
  border:1px solid #d6e2ee;
  border-radius:8px;
  background:#fff;
  color:#73849a;
  cursor:pointer;
  font-size:8px;
}

/* =========================================================
   SEQUENCE
   ========================================================= */

.mg-sequence-target{
  min-height:92px;
  display:flex;
  align-items:center;
  gap:7px;
  flex-wrap:wrap;
  padding:13px;
  border:2px dashed #cbdbea;
  border-radius:13px;
  background:#fff;
}

.mg-sequence-target>span{
  margin:auto;
  color:#9aa9b9;
  font-size:10px;
}

.mg-sequence-target button,
.mg-token-bank button{
  padding:9px 10px;
  border:1px solid #bad5ed;
  border-radius:9px;
  background:#edf7ff;
  color:#316c9e;
  cursor:pointer;
  font:inherit;
  font-size:9px;
  font-weight:800;
}

.mg-sequence-target button small{
  display:block;
  color:#77a1c5;
  font-size:7px;
}

.mg-sequence-target i{
  color:#77a3c8;
}

.mg-token-bank{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  margin-top:12px;
  padding:12px;
  border-radius:12px;
  background:#eef3f8;
}

.mg-builder-tools{
  display:flex;
  justify-content:space-between;
  margin-top:12px;
}

.mg-builder-tools button{
  min-height:36px;
  padding:0 12px;
  border:1px solid #d3dfeb;
  border-radius:9px;
  background:#fff;
  color:#667b95;
  cursor:pointer;
  font:inherit;
  font-size:8px;
  font-weight:900;
}

.mg-builder-tools .verify{
  border:0;
  background:#268dde;
  color:#fff;
}

/* =========================================================
   SCENARIO / VERDICT
   ========================================================= */

.mg-scenario-grid{
  grid-template-columns:
    repeat(2,1fr);
}

.mg-scenario{
  min-height:130px;
  padding:16px;
}

.mg-scenario.selected.good{
  border-color:#55be98;
  background:#effaf6;
}

.mg-scenario.selected.bad{
  border-color:#e4a5a5;
  background:#fff3f3;
}

.mg-verdict-grid{
  grid-template-columns:
    repeat(2,1fr);
}

.mg-verdict{
  min-height:95px;
  padding:16px;
}

.mg-verdict.good{
  border-color:#50bd96;
  background:#effaf6;
}

.mg-verdict.bad{
  border-color:#e0a2a6;
  background:#fff3f3;
}

/* =========================================================
   REPORT
   ========================================================= */

.mg-report-question{
  padding:15px;
  border-left:4px solid #6d63ed;
  border-radius:12px;
  background:#f4f2ff;
}

.mg-report-question small{
  display:block;
  color:#7569d5;
  font-size:8px;
  font-weight:900;
  letter-spacing:.1em;
}

.mg-report-question strong{
  display:block;
  margin-top:3px;
  color:#313b68;
  font-size:13px;
}

.mg-report-question p{
  margin:4px 0 0;
  color:#747d9c;
  font-size:10px;
}

.mg-report-layout{
  display:grid;
  grid-template-columns:
    minmax(0,1.5fr)
    minmax(250px,.8fr);
  gap:12px;
  margin-top:13px;
}

.mg-report-writing,
.mg-report-analyzer{
  padding:15px;
}

.mg-report-writing label{
  display:block;
  margin-bottom:7px;
  color:#6e84a0;
  font-size:8px;
  font-weight:900;
  letter-spacing:.1em;
}

.mg-report-writing textarea{
  width:100%;
  min-height:190px;
  padding:13px;
  border:1px solid #cadbec;
  border-radius:11px;
  outline:none;
  resize:vertical;
  background:#fff;
  color:#29435f;
  font:inherit;
  font-size:11px;
  line-height:1.6;
}

.mg-report-writing textarea:focus{
  border-color:#4d9ce0;
  box-shadow:
    0 0 0 3px
    rgba(62,150,221,.09);
}

.mg-report-writing>small{
  display:block;
  margin-top:6px;
  color:#8b9aab;
  font-size:8px;
}

.mg-readiness{
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:9px;
}

.mg-readiness span{
  color:#7388a2;
  font-size:8px;
  font-weight:900;
  letter-spacing:.1em;
}

.mg-readiness strong{
  color:#238dcd;
  font-size:18px;
}

.mg-rubric{
  display:flex;
  gap:8px;
  align-items:center;
  margin-top:6px;
  padding:8px;
  border-radius:9px;
  background:#eef3f8;
}

.mg-rubric.done{
  background:#e9f9f2;
}

.mg-rubric>b{
  width:23px;
  height:23px;
  display:grid;
  place-items:center;
  border-radius:50%;
  background:#dfe7ef;
  color:#8998aa;
  font-size:9px;
}

.mg-rubric.done>b{
  background:#2bad85;
  color:#fff;
}

.mg-rubric span strong,
.mg-rubric span small{
  display:block;
}

.mg-rubric span strong{
  color:#425c76;
  font-size:8px;
}

.mg-rubric span small{
  margin-top:1px;
  color:#8a99aa;
  font-size:7px;
}

.mg-readiness-note{
  margin:9px 0 0;
  color:#8b7a57;
  font-size:8px;
}

.mg-research-note{
  margin-top:12px;
  padding:10px 12px;
  border:1px dashed #cbd8e6;
  border-radius:10px;
  background:#f8fafc;
}

.mg-research-note strong{
  color:#6b8199;
  font-size:8px;
  letter-spacing:.1em;
}

.mg-research-note p{
  margin:3px 0 0;
  color:#8795a7;
  font-size:8px;
  line-height:1.45;
}

/* =========================================================
   ACTION
   ========================================================= */

.mg-actions{
  display:flex;
  justify-content:space-between;
  gap:10px;
  margin-top:20px;
}

.mg-primary,
.mg-secondary,
.mg-submit{
  min-height:43px;
  padding:0 15px;
  border-radius:10px;
  cursor:pointer;
  font:inherit;
  font-size:9px;
  font-weight:900;
}

.mg-primary,
.mg-submit{
  border:0;
  background:
    linear-gradient(
      100deg,
      #238ae4,
      #5f69ed
    );
  color:#fff;
}

.mg-submit{
  background:
    linear-gradient(
      100deg,
      #1baa82,
      #268ddd
    );
}

.mg-secondary{
  border:1px solid #d5e1ed;
  background:#fff;
  color:#637994;
}

.disabled{
  opacity:.4!important;
  pointer-events:none!important;
}

/* =========================================================
   TOAST
   ========================================================= */

.mg-toast{
  position:fixed;
  left:50%;
  bottom:28px;
  z-index:999999;
  max-width:440px;
  padding:11px 15px;
  border-radius:10px;
  background:#17314d;
  color:#fff;
  box-shadow:
    0 16px 40px
    rgba(0,0,0,.22);
  font-size:10px;
  font-weight:800;
  opacity:0;
  transform:
    translate(-50%,10px);
  transition:.18s;
}

.mg-toast.show{
  opacity:1;
  transform:
    translate(-50%,0);
}

.mg-toast.success{
  background:#197a5f;
}

.mg-toast.warning{
  background:#95691f;
}

/* =========================================================
   TABLET
   ========================================================= */

@media(max-width:850px){

  .mg-decision-grid,
  .mg-evidence-grid,
  .mg-test-grid,
  .mg-scenario-grid,
  .mg-verdict-grid,
  .mg-report-layout{
    grid-template-columns:1fr;
  }

  .mg-header{
    grid-template-columns:auto 1fr;
  }

  .mg-case-id{
    display:none;
  }

}

/* =========================================================
   MOBILE
   ========================================================= */

@media(max-width:520px){

  .mg-zone-banner{
    padding:10px;
  }

  .mg-zone-symbol{
    width:36px;
    height:36px;
    flex-basis:36px;
    font-size:16px;
  }

  .mg-zone-banner small{
    font-size:8px;
  }

  .mg-header{
    gap:11px;
  }

  .mg-header-copy h3{
    font-size:21px;
  }

  .mg-step-code{
    width:47px;
    height:47px;
  }

  .mg-scanner{
    padding:17px;
  }

  .mg-actions{
    flex-direction:column-reverse;
  }

  .mg-primary,
  .mg-secondary,
  .mg-submit{
    width:100%;
  }

  .mg-input-row{
    grid-template-columns:
      80px 1fr;
  }

  .mg-evidence-summary{
    flex-direction:column;
    gap:5px;
  }

  .mg-lab-status{
    align-items:flex-start;
    flex-direction:column;
  }

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
    installStyle();

    window.AITRAP_MISSION_GAMEPLAY = {
      version: VERSION,
      missions: 15,
      zones: 5,
      mode:
        "FINAL_GAMEPLAY_ENGINE_RC1"
    };

    console.log(
      `AI TRAP LAB Gameplay Engine v${VERSION} loaded — 15 missions / 5 zones.`
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      install
    );
  } else {
    install();
  }

})();