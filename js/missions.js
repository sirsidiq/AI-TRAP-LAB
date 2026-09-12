const missions = [

  // =====================================================
  // LEVEL 1 — PATTERN TRAP
  // =====================================================

  {
    id: 1,
    level: 1,
    levelName: "Pattern Trap",
    title: "Pola yang Menjebak",
    trapType: "Pattern Error",

    stimulus:
      "Perhatikan pola bilangan berikut: 2 → 4 → 8 → 16 → 32 → ?",

    aiClaim:
      "Jawabannya adalah 48 karena setiap angka bertambah 16.",

    confidence: "96%",

    claim: {
      question:
        "Bagaimana penilaian awalmu terhadap klaim AI?",

      options: [
        { value: "benar", text: "AI benar" },
        { value: "salah", text: "AI salah" },
        {
          value: "belum",
          text: "Belum dapat ditentukan sebelum diperiksa"
        }
      ],

      bestAnswer: "belum"
    },

    check: {
      question:
        "Bagian mana yang perlu diperiksa untuk menemukan pola sebenarnya?",

      multiple: true,

      options: [
        {
          value: "24",
          text: "Hubungan 2 → 4"
        },
        {
          value: "48",
          text: "Hubungan 4 → 8"
        },
        {
          value: "816",
          text: "Hubungan 8 → 16"
        },
        {
          value: "1632",
          text: "Hubungan 16 → 32"
        },
        {
          value: "warna",
          text: "Warna angka"
        }
      ],

      correctAnswers: [
        "24",
        "48",
        "816",
        "1632"
      ]
    },

    test: {
      question:
        "Pengujian mana yang paling tepat?",

      options: [
        {
          value: "a",
          text: "Periksa apakah setiap bilangan diperoleh dengan mengalikan bilangan sebelumnya dengan 2"
        },
        {
          value: "b",
          text: "Tambahkan 16 ke semua bilangan"
        },
        {
          value: "c",
          text: "Pilih angka terbesar"
        },
        {
          value: "d",
          text: "Hitung jumlah semua angka"
        }
      ],

      correctAnswer: "a"
    },

    correct: {
      question:
        "Apa koreksi yang benar?",

      options: [
        {
          value: "a",
          text: "Pola ×2, sehingga jawabannya 64"
        },
        {
          value: "b",
          text: "Pola +16, sehingga jawabannya 48"
        },
        {
          value: "c",
          text: "Pola +10, sehingga jawabannya 42"
        },
        {
          value: "d",
          text: "Tidak ada pola"
        }
      ],

      correctAnswer: "a"
    },

    justify: {
      prompt:
        "Jelaskan bukti yang menunjukkan bahwa jawaban AI perlu diperbaiki.",

      keywords: [
        "2",
        "kali",
        "64",
        "pola"
      ]
    },

    result: {
      status: "CLAIM REFUTED",

      explanation:
        "Pola sebenarnya adalah setiap bilangan dikalikan 2. Karena 32 × 2 = 64, jawaban 48 tidak sesuai dengan pola."
    }
  },


  {
    id: 2,
    level: 1,
    levelName: "Pattern Trap",
    title: "AI Bisa Benar",
    trapType: "Correct Pattern",

    stimulus:
      "Perhatikan pola bilangan berikut: 3 → 6 → 12 → 24 → ?",

    aiClaim:
      "Jawabannya adalah 48 karena setiap bilangan dikalikan 2.",

    confidence: "91%",

    claim: {
      question:
        "Bagaimana sebaiknya klaim AI dinilai?",

      options: [
        { value: "benar", text: "AI benar" },
        { value: "salah", text: "AI salah" },
        {
          value: "belum",
          text: "Tetap harus diperiksa terlebih dahulu"
        }
      ],

      bestAnswer: "belum"
    },

    check: {
      question:
        "Hubungan mana yang perlu diperiksa?",

      multiple: true,

      options: [
        { value: "36", text: "3 → 6" },
        { value: "612", text: "6 → 12" },
        { value: "1224", text: "12 → 24" },
        {
          value: "judul",
          text: "Judul soal"
        }
      ],

      correctAnswers: [
        "36",
        "612",
        "1224"
      ]
    },

    test: {
      question:
        "Pengujian mana yang tepat?",

      options: [
        {
          value: "a",
          text: "Uji apakah semua pasangan mengikuti aturan ×2"
        },
        {
          value: "b",
          text: "Anggap AI salah karena AI bisa keliru"
        },
        {
          value: "c",
          text: "Pilih angka terbesar"
        },
        {
          value: "d",
          text: "Tambahkan seluruh angka"
        }
      ],

      correctAnswer: "a"
    },

    correct: {
      question:
        "Kesimpulan mana yang tepat?",

      options: [
        {
          value: "a",
          text: "AI benar, karena pola ×2 menghasilkan 48"
        },
        {
          value: "b",
          text: "AI salah hanya karena jawabannya berasal dari AI"
        },
        {
          value: "c",
          text: "Jawabannya 36"
        },
        {
          value: "d",
          text: "Tidak dapat diketahui"
        }
      ],

      correctAnswer: "a"
    },

    justify: {
      prompt:
        "Jelaskan mengapa klaim AI dapat diterima setelah diverifikasi.",

      keywords: [
        "2",
        "48",
        "pola",
        "bukti"
      ]
    },

    result: {
      status: "CLAIM VERIFIED",

      explanation:
        "Semua pasangan bilangan mengikuti aturan ×2. Jadi 24 × 2 = 48. AI dapat benar, tetapi jawabannya tetap harus diverifikasi."
    }
  },


  {
    id: 3,
    level: 1,
    levelName: "Pattern Trap",
    title: "Satu Jawaban, Dua Penalaran",
    trapType: "Multiple Reasoning",

    stimulus:
      "Perhatikan pola: 1 → 4 → 9 → 16 → 25 → ?",

    aiClaim:
      "Jawabannya 36 karena selisihnya adalah +3, +5, +7, +9, lalu +11.",

    confidence: "93%",

    claim: {
      question:
        "Apakah penalaran AI perlu diperiksa meskipun jawabannya tampak masuk akal?",

      options: [
        { value: "benar", text: "Tidak perlu diperiksa" },
        { value: "salah", text: "AI pasti salah" },
        {
          value: "belum",
          text: "Ya, alasan tetap perlu diverifikasi"
        }
      ],

      bestAnswer: "belum"
    },

    check: {
      question:
        "Pola apa yang relevan untuk diperiksa?",

      multiple: true,

      options: [
        {
          value: "selisih",
          text: "Selisih antarbilangan"
        },
        {
          value: "kuadrat",
          text: "Hubungan dengan bilangan kuadrat"
        },
        {
          value: "urutan",
          text: "Konsistensi urutan"
        },
        {
          value: "warna",
          text: "Warna angka"
        }
      ],

      correctAnswers: [
        "selisih",
        "kuadrat",
        "urutan"
      ]
    },

    test: {
      question:
        "Pengujian mana yang paling kuat?",

      options: [
        {
          value: "a",
          text: "Uji pola selisih ganjil dan pola 1², 2², 3², 4², 5²"
        },
        {
          value: "b",
          text: "Pilih jawaban yang paling besar"
        },
        {
          value: "c",
          text: "Tambahkan 10"
        },
        {
          value: "d",
          text: "Abaikan pola sebelumnya"
        }
      ],

      correctAnswer: "a"
    },

    correct: {
      question:
        "Apa kesimpulan yang tepat?",

      options: [
        {
          value: "a",
          text: "36 benar dan dapat dijelaskan melalui lebih dari satu pola yang konsisten"
        },
        {
          value: "b",
          text: "36 salah"
        },
        {
          value: "c",
          text: "Jawabannya 35"
        },
        {
          value: "d",
          text: "Tidak ada pola"
        }
      ],

      correctAnswer: "a"
    },

    justify: {
      prompt:
        "Jelaskan dua cara yang dapat digunakan untuk mendukung jawaban 36.",

      keywords: [
        "ganjil",
        "kuadrat",
        "36",
        "pola"
      ]
    },

    result: {
      status: "CLAIM VERIFIED",

      explanation:
        "Jawaban 36 benar. Pola dapat dilihat sebagai penambahan bilangan ganjil berturut-turut atau sebagai kuadrat 1², 2², 3², 4², 5², 6²."
    }
  },


  // =====================================================
  // LEVEL 2 — SEQUENCE TRAP
  // =====================================================

  {
    id: 4,
    level: 2,
    levelName: "Sequence Trap",
    title: "Urutan Mengirim Pesan",
    trapType: "Wrong Sequence",

    stimulus:
      "Tujuan: Mengirim pesan kepada teman melalui aplikasi WhatsApp.",

    aiClaim:
      "Urutannya: ketik pesan → buka WhatsApp → pilih kontak → tekan kirim.",

    confidence: "94%",

    claim: {
      question:
        "Bagaimana penilaian awalmu terhadap urutan AI?",

      options: [
        { value: "benar", text: "AI benar" },
        { value: "salah", text: "AI salah" },
        {
          value: "belum",
          text: "Belum dapat ditentukan sebelum diperiksa"
        }
      ],

      bestAnswer: "belum"
    },

    check: {
      question:
        "Bagian mana yang perlu diperiksa?",

      multiple: true,

      options: [
        {
          value: "buka",
          text: "Kapan WhatsApp dibuka"
        },
        {
          value: "kontak",
          text: "Kapan kontak dipilih"
        },
        {
          value: "ketik",
          text: "Kapan pesan diketik"
        },
        {
          value: "warna",
          text: "Warna ikon WhatsApp"
        }
      ],

      correctAnswers: [
        "buka",
        "kontak",
        "ketik"
      ]
    },

    test: {
      question:
        "Pengujian mana yang paling tepat?",

      options: [
        {
          value: "a",
          text: "Coba ikuti urutan AI dan lihat apakah pesan dapat diketik sebelum aplikasi dan percakapan dibuka"
        },
        {
          value: "b",
          text: "Hitung jumlah langkah"
        },
        {
          value: "c",
          text: "Lihat warna tombol"
        },
        {
          value: "d",
          text: "Pilih pesan terpendek"
        }
      ],

      correctAnswer: "a"
    },

    correct: {
      question:
        "Urutan mana yang paling logis?",

      options: [
        {
          value: "a",
          text: "Buka WhatsApp → pilih kontak → ketik pesan → kirim"
        },
        {
          value: "b",
          text: "Ketik pesan → kirim → buka WhatsApp"
        },
        {
          value: "c",
          text: "Pilih kontak → tutup WhatsApp → ketik"
        },
        {
          value: "d",
          text: "Urutan AI tidak perlu diperbaiki"
        }
      ],

      correctAnswer: "a"
    },

    justify: {
      prompt:
        "Jelaskan mengapa urutan AI perlu diperbaiki.",

      keywords: [
        "buka",
        "kontak",
        "ketik",
        "kirim"
      ]
    },

    result: {
      status: "SEQUENCE CORRECTED",

      explanation:
        "Pesan tidak dapat diketik dalam percakapan sebelum aplikasi dan kontak dibuka. Urutan yang logis adalah membuka WhatsApp, memilih kontak, mengetik pesan, lalu mengirim."
    }
  },


  {
    id: 5,
    level: 2,
    levelName: "Sequence Trap",
    title: "Langkah yang Hilang",
    trapType: "Missing Step",

    stimulus:
      "Tujuan: Meminjam buku dari perpustakaan sekolah.",

    aiClaim:
      "Urutannya: cari buku → ambil buku → bawa pulang.",

    confidence: "90%",

    claim: {
      question:
        "Apakah prosedur AI sudah lengkap?",

      options: [
        { value: "benar", text: "Sudah lengkap" },
        { value: "salah", text: "Belum lengkap" },
        {
          value: "belum",
          text: "Belum dapat ditentukan sebelum diperiksa"
        }
      ],

      bestAnswer: "belum"
    },

    check: {
      question:
        "Informasi mana yang harus diperiksa?",

      multiple: true,

      options: [
        {
          value: "cari",
          text: "Proses mencari buku"
        },
        {
          value: "catat",
          text: "Proses pencatatan peminjaman"
        },
        {
          value: "bawa",
          text: "Proses membawa buku"
        },
        {
          value: "warna",
          text: "Warna sampul buku"
        }
      ],

      correctAnswers: [
        "cari",
        "catat",
        "bawa"
      ]
    },

    test: {
      question:
        "Pengujian mana yang paling tepat?",

      options: [
        {
          value: "a",
          text: "Bandingkan langkah AI dengan aturan peminjaman perpustakaan"
        },
        {
          value: "b",
          text: "Hitung halaman buku"
        },
        {
          value: "c",
          text: "Pilih sampul terbaik"
        },
        {
          value: "d",
          text: "Ukur rak buku"
        }
      ],

      correctAnswer: "a"
    },

    correct: {
      question:
        "Perbaikan mana yang tepat?",

      options: [
        {
          value: "a",
          text: "Cari → ambil → catat proses peminjaman → bawa"
        },
        {
          value: "b",
          text: "Ambil → langsung bawa"
        },
        {
          value: "c",
          text: "Cari → foto → pulang"
        },
        {
          value: "d",
          text: "Tidak perlu perbaikan"
        }
      ],

      correctAnswer: "a"
    },

    justify: {
      prompt:
        "Jelaskan langkah yang hilang dan mengapa langkah itu penting.",

      keywords: [
        "catat",
        "peminjaman",
        "data",
        "izin"
      ]
    },

    result: {
      status: "MISSING STEP FOUND",

      explanation:
        "AI melewatkan proses pencatatan peminjaman. Buku perlu dicatat terlebih dahulu sebelum dibawa keluar dari perpustakaan."
    }
  },


  {
    id: 6,
    level: 2,
    levelName: "Sequence Trap",
    title: "Apakah Hanya Ada Satu Urutan?",
    trapType: "False Criticism",

    stimulus:
      "Tujuan: Membuat dokumen baru dan menyimpannya ke sebuah folder.",

    aiClaim:
      "Urutan 'buat folder → buka aplikasi → buat dokumen → simpan' salah karena folder harus dibuat setelah dokumen dibuka.",

    confidence: "93%",

    claim: {
      question:
        "Bagaimana kamu menilai kritik AI?",

      options: [
        { value: "benar", text: "AI benar" },
        { value: "salah", text: "AI salah" },
        {
          value: "belum",
          text: "Kritik perlu diuji terlebih dahulu"
        }
      ],

      bestAnswer: "belum"
    },

    check: {
      question:
        "Apa yang perlu diperiksa?",

      multiple: true,

      options: [
        {
          value: "folder",
          text: "Apakah folder boleh dibuat terlebih dahulu"
        },
        {
          value: "save",
          text: "Apakah dokumen dapat disimpan ke folder tersebut"
        },
        {
          value: "alternatif",
          text: "Apakah ada lebih dari satu urutan valid"
        },
        {
          value: "font",
          text: "Jenis font dokumen"
        }
      ],

      correctAnswers: [
        "folder",
        "save",
        "alternatif"
      ]
    },

    test: {
      question:
        "Pengujian mana yang paling kuat?",

      options: [
        {
          value: "a",
          text: "Coba buat folder terlebih dahulu, lalu buat dokumen dan simpan ke folder tersebut"
        },
        {
          value: "b",
          text: "Ganti nama folder"
        },
        {
          value: "c",
          text: "Ganti warna aplikasi"
        },
        {
          value: "d",
          text: "Hitung huruf nama file"
        }
      ],

      correctAnswer: "a"
    },

    correct: {
      question:
        "Kesimpulan mana yang tepat?",

      options: [
        {
          value: "a",
          text: "Kritik AI salah karena folder boleh dibuat terlebih dahulu"
        },
        {
          value: "b",
          text: "Folder selalu harus dibuat terakhir"
        },
        {
          value: "c",
          text: "Dokumen tidak bisa disimpan ke folder"
        },
        {
          value: "d",
          text: "Semua urutan selalu benar"
        }
      ],

      correctAnswer: "a"
    },

    justify: {
      prompt:
        "Jelaskan mengapa suatu tujuan dapat memiliki lebih dari satu urutan valid.",

      keywords: [
        "folder",
        "dokumen",
        "simpan",
        "urutan",
        "valid"
      ]
    },

    result: {
      status: "FALSE CRITICISM DETECTED",

      explanation:
        "Folder boleh dibuat sebelum dokumen dibuat. Selama langkah-langkah memenuhi prasyarat dan tujuan tercapai, lebih dari satu urutan dapat menjadi valid."
    }
  },


  // =====================================================
  // LEVEL 3 — LOGIC TRAP
  // =====================================================

  {
    id: 7,
    level: 3,
    levelName: "Logic Trap",
    title: "Kondisi yang Diabaikan",
    trapType: "Ignored Condition",

    stimulus:
      "Aturan: murid dinyatakan TUNTAS jika nilai ≥ 75 DAN kehadiran ≥ 80%. Budi mendapat nilai 85 dan kehadiran 70%.",

    aiClaim:
      "Budi TUNTAS karena nilainya 85.",

    confidence: "95%",

    claim: {
      question:
        "Bagaimana kesimpulan AI sebaiknya dinilai?",

      options: [
        { value: "benar", text: "AI benar" },
        { value: "salah", text: "AI salah" },
        {
          value: "belum",
          text: "Semua kondisi harus diperiksa"
        }
      ],

      bestAnswer: "belum"
    },

    check: {
      question:
        "Informasi apa yang relevan?",

      multiple: true,

      options: [
        { value: "nilai", text: "Nilai = 85" },
        {
          value: "hadir",
          text: "Kehadiran = 70%"
        },
        {
          value: "snilai",
          text: "Syarat nilai ≥ 75"
        },
        {
          value: "shadir",
          text: "Syarat kehadiran ≥ 80%"
        },
        {
          value: "nama",
          text: "Nama murid"
        }
      ],

      correctAnswers: [
        "nilai",
        "hadir",
        "snilai",
        "shadir"
      ]
    },

    test: {
      question:
        "Pengujian logika mana yang benar?",

      options: [
        {
          value: "a",
          text: "85 ≥ 75 benar, tetapi 70 ≥ 80 salah"
        },
        {
          value: "b",
          text: "Nilai memenuhi syarat, jadi kehadiran diabaikan"
        },
        {
          value: "c",
          text: "85 + 70 = 155"
        },
        {
          value: "d",
          text: "Nilai selalu lebih penting"
        }
      ],

      correctAnswer: "a"
    },

    correct: {
      question:
        "Apa keputusan yang benar?",

      options: [
        {
          value: "a",
          text: "TUNTAS"
        },
        {
          value: "b",
          text: "BELUM TUNTAS karena salah satu kondisi wajib tidak terpenuhi"
        },
        {
          value: "c",
          text: "TUNTAS karena total lebih dari 100"
        },
        {
          value: "d",
          text: "Tidak dapat diketahui"
        }
      ],

      correctAnswer: "b"
    },

    justify: {
      prompt:
        "Jelaskan kondisi apa yang diabaikan AI.",

      keywords: [
        "kehadiran",
        "70",
        "80",
        "dan",
        "syarat"
      ]
    },

    result: {
      status: "IGNORED CONDITION FOUND",

      explanation:
        "Aturan menggunakan logika DAN, sehingga nilai dan kehadiran harus sama-sama memenuhi syarat. Kehadiran Budi hanya 70%, jadi belum tuntas."
    }
  },


  {
    id: 8,
    level: 3,
    levelName: "Logic Trap",
    title: "Jebakan Batas Nilai",
    trapType: "Boundary Error",

    stimulus:
      "Perpustakaan memperbolehkan maksimal 3 buku. Dina memiliki 2 buku dan ingin meminjam 1 lagi.",

    aiClaim:
      "Dina tidak boleh meminjam karena jumlah buku harus kurang dari 3.",

    confidence: "92%",

    claim: {
      question:
        "Apakah klaim AI sesuai dengan arti 'maksimal 3'?",

      options: [
        { value: "benar", text: "AI benar" },
        { value: "salah", text: "AI salah" },
        {
          value: "belum",
          text: "Batas harus diperiksa"
        }
      ],

      bestAnswer: "belum"
    },

    check: {
      question:
        "Informasi apa yang perlu diperiksa?",

      multiple: true,

      options: [
        {
          value: "dua",
          text: "Saat ini 2 buku"
        },
        {
          value: "satu",
          text: "Ingin menambah 1 buku"
        },
        {
          value: "maks",
          text: "Maksimal 3 buku"
        },
        {
          value: "warna",
          text: "Warna buku"
        }
      ],

      correctAnswers: [
        "dua",
        "satu",
        "maks"
      ]
    },

    test: {
      question:
        "Pengujian yang tepat adalah...",

      options: [
        {
          value: "a",
          text: "2 + 1 = 3 dan 3 masih memenuhi batas maksimal 3"
        },
        {
          value: "b",
          text: "Nilai yang sama dengan batas harus ditolak"
        },
        {
          value: "c",
          text: "Dina boleh meminjam berapa pun"
        },
        {
          value: "d",
          text: "Jumlah buku tidak penting"
        }
      ],

      correctAnswer: "a"
    },

    correct: {
      question:
        "Kesimpulan yang benar adalah...",

      options: [
        {
          value: "a",
          text: "Dina tidak boleh meminjam"
        },
        {
          value: "b",
          text: "Dina boleh meminjam 1 buku lagi karena totalnya tepat 3"
        },
        {
          value: "c",
          text: "Dina boleh meminjam 2 lagi"
        },
        {
          value: "d",
          text: "Tidak ada batas"
        }
      ],

      correctAnswer: "b"
    },

    justify: {
      prompt:
        "Jelaskan perbedaan antara '< 3' dan 'maksimal 3'.",

      keywords: [
        "maksimal",
        "3",
        "sama",
        "boleh"
      ]
    },

    result: {
      status: "BOUNDARY ERROR DETECTED",

      explanation:
        "'Maksimal 3' berarti sampai dengan 3 atau ≤ 3. Jadi total 3 buku masih diperbolehkan."
    }
  },


  {
    id: 9,
    level: 3,
    levelName: "Logic Trap",
    title: "Sedikit Langkah Belum Tentu Cepat",
    trapType: "Overgeneralization",

    stimulus:
      "Rute A memiliki 3 langkah dan selesai dalam 4 menit. Rute B memiliki 5 langkah dan selesai dalam 2 menit.",

    aiClaim:
      "Algoritma dengan langkah lebih sedikit selalu lebih cepat. Jadi Rute A pasti lebih cepat.",

    confidence: "97%",

    claim: {
      question:
        "Bagaimana klaim 'selalu lebih cepat' sebaiknya dinilai?",

      options: [
        { value: "benar", text: "AI benar" },
        { value: "salah", text: "AI salah" },
        {
          value: "belum",
          text: "Klaim harus diuji menggunakan data"
        }
      ],

      bestAnswer: "belum"
    },

    check: {
      question:
        "Data mana yang relevan?",

      multiple: true,

      options: [
        {
          value: "la",
          text: "A = 3 langkah"
        },
        {
          value: "wa",
          text: "A = 4 menit"
        },
        {
          value: "lb",
          text: "B = 5 langkah"
        },
        {
          value: "wb",
          text: "B = 2 menit"
        },
        {
          value: "nama",
          text: "Nama rute"
        }
      ],

      correctAnswers: [
        "la",
        "wa",
        "lb",
        "wb"
      ]
    },

    test: {
      question:
        "Apa counterexample yang tersedia?",

      options: [
        {
          value: "a",
          text: "Rute A lebih sedikit langkah tetapi lebih lama daripada B"
        },
        {
          value: "b",
          text: "3 + 5 = 8"
        },
        {
          value: "c",
          text: "A memakai angka kecil"
        },
        {
          value: "d",
          text: "Waktu diabaikan"
        }
      ],

      correctAnswer: "a"
    },

    correct: {
      question:
        "Kesimpulan yang benar adalah...",

      options: [
        {
          value: "a",
          text: "Langkah lebih sedikit selalu lebih cepat"
        },
        {
          value: "b",
          text: "Jumlah langkah saja tidak selalu menentukan waktu"
        },
        {
          value: "c",
          text: "Langkah lebih banyak selalu lebih cepat"
        },
        {
          value: "d",
          text: "Langkah dan waktu selalu sama"
        }
      ],

      correctAnswer: "b"
    },

    justify: {
      prompt:
        "Gunakan data A dan B untuk menolak atau menerima generalisasi AI.",

      keywords: [
        "3",
        "4",
        "5",
        "2",
        "tidak selalu"
      ]
    },

    result: {
      status: "COUNTEREXAMPLE FOUND",

      explanation:
        "Rute A memiliki lebih sedikit langkah tetapi membutuhkan waktu lebih lama. Ini cukup untuk menunjukkan bahwa klaim 'selalu lebih cepat' tidak berlaku umum."
    }
  },


  // =====================================================
  // LEVEL 4 — EFFICIENCY TRAP
  // =====================================================

  {
    id: 10,
    level: 4,
    levelName: "Efficiency Trap",
    title: "Sedikit Langkah Belum Tentu Tepat",
    trapType: "Single-Metric Bias",

    stimulus:
      "Tugas wajib dikumpulkan melalui LMS. Email membutuhkan 4 langkah, LMS membutuhkan 5 langkah.",

    aiClaim:
      "Email lebih efisien karena langkahnya lebih sedikit.",

    confidence: "94%",

    claim: {
      question:
        "Apakah jumlah langkah cukup untuk menentukan pilihan terbaik?",

      options: [
        { value: "benar", text: "Ya" },
        { value: "salah", text: "Tidak" },
        {
          value: "belum",
          text: "Kriteria dan tujuan harus diperiksa"
        }
      ],

      bestAnswer: "belum"
    },

    check: {
      question:
        "Apa yang harus dipertimbangkan?",

      multiple: true,

      options: [
        {
          value: "email",
          text: "Email = 4 langkah"
        },
        {
          value: "lms",
          text: "LMS = 5 langkah"
        },
        {
          value: "aturan",
          text: "Pengumpulan diwajibkan melalui LMS"
        },
        {
          value: "tujuan",
          text: "Tujuan pengumpulan tugas"
        },
        {
          value: "warna",
          text: "Warna aplikasi"
        }
      ],

      correctAnswers: [
        "email",
        "lms",
        "aturan",
        "tujuan"
      ]
    },

    test: {
      question:
        "Pengujian mana yang tepat?",

      options: [
        {
          value: "a",
          text: "Periksa apakah pilihan memenuhi tujuan dan aturan"
        },
        {
          value: "b",
          text: "Pilih langkah paling sedikit"
        },
        {
          value: "c",
          text: "Pilih aplikasi paling menarik"
        },
        {
          value: "d",
          text: "Hitung huruf aplikasi"
        }
      ],

      correctAnswer: "a"
    },

    correct: {
      question:
        "Kesimpulan yang tepat adalah...",

      options: [
        {
          value: "a",
          text: "Email pasti lebih efisien"
        },
        {
          value: "b",
          text: "LMS lebih tepat karena memenuhi tujuan dan aturan"
        },
        {
          value: "c",
          text: "Semua metode sama"
        },
        {
          value: "d",
          text: "Tugas tidak perlu dikumpulkan"
        }
      ],

      correctAnswer: "b"
    },

    justify: {
      prompt:
        "Jelaskan mengapa jumlah langkah bukan satu-satunya ukuran efisiensi.",

      keywords: [
        "tujuan",
        "aturan",
        "lms",
        "efisien"
      ]
    },

    result: {
      status: "SINGLE-METRIC BIAS FOUND",

      explanation:
        "Efisiensi tidak cukup dinilai dari jumlah langkah. Solusi juga harus memenuhi tujuan. Karena tugas wajib dikumpulkan melalui LMS, LMS adalah pilihan yang tepat."
    }
  },


  {
    id: 11,
    level: 4,
    levelName: "Efficiency Trap",
    title: "Efisien Menurut Kriteria Apa?",
    trapType: "Undefined Optimization Metric",

    stimulus:
      "Metode A mengirim video dalam 2 menit dengan 150 MB data. Metode B membutuhkan 5 menit dengan 40 MB data.",

    aiClaim:
      "Metode A paling efisien karena paling cepat.",

    confidence: "93%",

    claim: {
      question:
        "Apakah A langsung dapat disebut paling efisien?",

      options: [
        {
          value: "benar",
          text: "Ya, karena paling cepat"
        },
        {
          value: "salah",
          text: "Tidak, B pasti terbaik"
        },
        {
          value: "belum",
          text: "Kriteria efisiensi harus ditentukan"
        }
      ],

      bestAnswer: "belum"
    },

    check: {
      question:
        "Data apa yang perlu dibandingkan?",

      multiple: true,

      options: [
        {
          value: "ta",
          text: "A = 2 menit"
        },
        {
          value: "da",
          text: "A = 150 MB"
        },
        {
          value: "tb",
          text: "B = 5 menit"
        },
        {
          value: "db",
          text: "B = 40 MB"
        },
        {
          value: "nama",
          text: "Nama metode"
        }
      ],

      correctAnswers: [
        "ta",
        "da",
        "tb",
        "db"
      ]
    },

    test: {
      question:
        "Pengujian terbaik adalah...",

      options: [
        {
          value: "a",
          text: "Tentukan apakah prioritasnya waktu, data, atau kombinasi keduanya"
        },
        {
          value: "b",
          text: "Pilih angka 2"
        },
        {
          value: "c",
          text: "Abaikan penggunaan data"
        },
        {
          value: "d",
          text: "Jumlahkan 150 + 40"
        }
      ],

      correctAnswer: "a"
    },

    correct: {
      question:
        "Kesimpulan yang tepat adalah...",

      options: [
        {
          value: "a",
          text: "A selalu terbaik"
        },
        {
          value: "b",
          text: "B selalu terbaik"
        },
        {
          value: "c",
          text: "A unggul pada waktu, B unggul pada penggunaan data"
        },
        {
          value: "d",
          text: "Tidak dapat dibandingkan sama sekali"
        }
      ],

      correctAnswer: "c"
    },

    justify: {
      prompt:
        "Jelaskan mengapa istilah 'paling efisien' membutuhkan kriteria.",

      keywords: [
        "waktu",
        "data",
        "kriteria",
        "tergantung"
      ]
    },

    result: {
      status: "OPTIMIZATION CRITERIA IDENTIFIED",

      explanation:
        "Pilihan terbaik bergantung pada tujuan. A lebih cepat, sedangkan B menggunakan data lebih sedikit. Efisiensi harus dikaitkan dengan kriteria yang jelas."
    }
  },


  {
    id: 12,
    level: 4,
    levelName: "Efficiency Trap",
    title: "Pilihan Terbesar Belum Tentu Optimal",
    trapType: "Greedy Assumption",

    stimulus:
      "Waktu tersedia 30 menit. A membutuhkan 20 menit dan memberi 60 poin. B membutuhkan 15 menit dan memberi 50 poin. C membutuhkan 15 menit dan memberi 50 poin.",

    aiClaim:
      "Pilih A karena poinnya paling besar. Itu pasti strategi optimal.",

    confidence: "96%",

    claim: {
      question:
        "Apakah memilih nilai terbesar terlebih dahulu pasti optimal?",

      options: [
        { value: "benar", text: "Ya" },
        { value: "salah", text: "Tidak" },
        {
          value: "belum",
          text: "Kombinasi perlu diuji"
        }
      ],

      bestAnswer: "belum"
    },

    check: {
      question:
        "Informasi apa yang penting?",

      multiple: true,

      options: [
        {
          value: "a",
          text: "A = 20 menit, 60 poin"
        },
        {
          value: "bc",
          text: "B dan C masing-masing 15 menit, 50 poin"
        },
        {
          value: "limit",
          text: "Batas 30 menit"
        },
        {
          value: "huruf",
          text: "Nama A, B, C"
        }
      ],

      correctAnswers: [
        "a",
        "bc",
        "limit"
      ]
    },

    test: {
      question:
        "Pengujian terkuat adalah...",

      options: [
        {
          value: "a",
          text: "Bandingkan A dengan kombinasi B + C"
        },
        {
          value: "b",
          text: "Pilih 60 karena terbesar"
        },
        {
          value: "c",
          text: "Jumlahkan semua tanpa melihat waktu"
        },
        {
          value: "d",
          text: "Pilih berdasarkan alfabet"
        }
      ],

      correctAnswer: "a"
    },

    correct: {
      question:
        "Strategi mana yang menghasilkan poin terbanyak?",

      options: [
        {
          value: "a",
          text: "A = 60 poin"
        },
        {
          value: "b",
          text: "B + C = 100 poin"
        },
        {
          value: "c",
          text: "A + B = 110 poin"
        },
        {
          value: "d",
          text: "A + B + C = 160 poin"
        }
      ],

      correctAnswer: "b"
    },

    justify: {
      prompt:
        "Jelaskan mengapa strategi AI gagal.",

      keywords: [
        "30",
        "60",
        "100",
        "b",
        "c",
        "kombinasi"
      ]
    },

    result: {
      status: "GREEDY TRAP DETECTED",

      explanation:
        "A memberi 60 poin. Namun B + C dapat diselesaikan tepat dalam 30 menit dan menghasilkan 100 poin. Pilihan terbaik secara lokal tidak selalu menjadi solusi terbaik secara keseluruhan."
    }
  },


  // =====================================================
  // LEVEL 5 — VERIFICATION TRAP
  // =====================================================

  {
    id: 13,
    level: 5,
    levelName: "Verification Trap",
    title: "Confidence Bukan Bukti",
    trapType: "Confidence Bias",

    stimulus:
      "AI memberikan penjelasan mengenai RAM.",

    aiClaim:
      "RAM adalah penyimpanan permanen dan datanya tetap ada setelah komputer dimatikan.",

    confidence: "99%",

    claim: {
      question:
        "Apakah confidence tinggi membuktikan klaim AI benar?",

      options: [
        {
          value: "benar",
          text: "Ya, 99% berarti pasti benar"
        },
        {
          value: "salah",
          text: "Tidak"
        },
        {
          value: "belum",
          text: "Klaim tetap harus diverifikasi"
        }
      ],

      bestAnswer: "belum"
    },

    check: {
      question:
        "Apa yang harus diperiksa?",

      multiple: true,

      options: [
        {
          value: "fungsi",
          text: "Fungsi RAM"
        },
        {
          value: "volatile",
          text: "Apakah RAM kehilangan data ketika daya terputus"
        },
        {
          value: "storage",
          text: "Perbedaan RAM dan penyimpanan permanen"
        },
        {
          value: "confidence",
          text: "Angka confidence"
        }
      ],

      correctAnswers: [
        "fungsi",
        "volatile",
        "storage"
      ]
    },

    test: {
      question:
        "Pengujian yang tepat adalah...",

      options: [
        {
          value: "a",
          text: "Bandingkan klaim dengan konsep RAM sebagai memori volatil"
        },
        {
          value: "b",
          text: "Terima karena confidence 99%"
        },
        {
          value: "c",
          text: "Anggap semua memori sama"
        },
        {
          value: "d",
          text: "Pilih istilah yang paling teknis"
        }
      ],

      correctAnswer: "a"
    },

    correct: {
      question:
        "Kesimpulan yang benar adalah...",

      options: [
        {
          value: "a",
          text: "AI benar"
        },
        {
          value: "b",
          text: "AI salah karena RAM pada umumnya bersifat volatil"
        },
        {
          value: "c",
          text: "RAM sama dengan SSD"
        },
        {
          value: "d",
          text: "Tidak dapat diketahui"
        }
      ],

      correctAnswer: "b"
    },

    justify: {
      prompt:
        "Jelaskan mengapa confidence tidak dapat menggantikan bukti.",

      keywords: [
        "confidence",
        "bukti",
        "verifikasi",
        "ram",
        "volatile"
      ]
    },

    result: {
      status: "CONFIDENCE BIAS DETECTED",

      explanation:
        "Angka confidence dalam mission ini hanyalah simulasi stimulus. Klaim tetap harus diverifikasi. RAM pada umumnya bersifat volatil dan kehilangan data ketika daya terputus."
    }
  },


  {
    id: 14,
    level: 5,
    levelName: "Verification Trap",
    title: "Jawaban Benar, Alasan Salah",
    trapType: "Invalid Reasoning",

    stimulus:
      "AI membandingkan 1 GB dan 1 MB.",

    aiClaim:
      "1 GB lebih besar daripada 1 MB karena huruf G berada setelah huruf M dalam alfabet.",

    confidence: "95%",

    claim: {
      question:
        "Bagaimana jawaban dan alasan AI harus dinilai?",

      options: [
        {
          value: "benar",
          text: "Jawaban dan alasan benar"
        },
        {
          value: "salah",
          text: "Jawaban salah"
        },
        {
          value: "belum",
          text: "Kesimpulan dan alasan harus diperiksa terpisah"
        }
      ],

      bestAnswer: "belum"
    },

    check: {
      question:
        "Apa yang harus diperiksa?",

      multiple: true,

      options: [
        {
          value: "kesimpulan",
          text: "Apakah 1 GB lebih besar daripada 1 MB"
        },
        {
          value: "alasan",
          text: "Apakah alfabet relevan untuk kapasitas data"
        },
        {
          value: "satuan",
          text: "Hubungan GB dan MB"
        },
        {
          value: "warna",
          text: "Warna huruf"
        }
      ],

      correctAnswers: [
        "kesimpulan",
        "alasan",
        "satuan"
      ]
    },

    test: {
      question:
        "Pengujian yang tepat adalah...",

      options: [
        {
          value: "a",
          text: "Bandingkan hubungan satuan GB dan MB"
        },
        {
          value: "b",
          text: "Periksa posisi alfabet"
        },
        {
          value: "c",
          text: "Pilih huruf yang lebih besar"
        },
        {
          value: "d",
          text: "Abaikan alasan"
        }
      ],

      correctAnswer: "a"
    },

    correct: {
      question:
        "Kesimpulan yang tepat adalah...",

      options: [
        {
          value: "a",
          text: "AI sepenuhnya benar"
        },
        {
          value: "b",
          text: "Kesimpulan benar, tetapi alasan tidak valid"
        },
        {
          value: "c",
          text: "1 MB lebih besar"
        },
        {
          value: "d",
          text: "Tidak dapat dibandingkan"
        }
      ],

      correctAnswer: "b"
    },

    justify: {
      prompt:
        "Jelaskan perbedaan antara kesimpulan benar dan alasan valid.",

      keywords: [
        "kesimpulan",
        "alasan",
        "valid",
        "gb",
        "mb"
      ]
    },

    result: {
      status: "INVALID REASONING FOUND",

      explanation:
        "1 GB memang lebih besar daripada 1 MB, tetapi bukan karena urutan alfabet. Kesimpulan dan proses penalarannya perlu dinilai secara terpisah."
    }
  },


  {
    id: 15,
    level: 5,
    levelName: "Verification Trap",
    title: "Belum Cukup Bukti",
    trapType: "Insufficient Evidence",

    stimulus:
      "AI memberikan rekomendasi mengenai media pembelajaran.",

    aiClaim:
      "Video selalu lebih efektif daripada teks untuk semua murid karena memiliki gambar dan suara.",

    confidence: "98%",

    claim: {
      question:
        "Apakah klaim ini dapat langsung diterima?",

      options: [
        {
          value: "benar",
          text: "Ya, video selalu terbaik"
        },
        {
          value: "salah",
          text: "Tidak, teks selalu terbaik"
        },
        {
          value: "belum",
          text: "Belum cukup bukti untuk membuat kesimpulan umum"
        }
      ],

      bestAnswer: "belum"
    },

    check: {
      question:
        "Apa yang harus dipertimbangkan?",

      multiple: true,

      options: [
        {
          value: "murid",
          text: "Karakteristik murid"
        },
        {
          value: "materi",
          text: "Jenis materi"
        },
        {
          value: "tujuan",
          text: "Tujuan pembelajaran"
        },
        {
          value: "bukti",
          text: "Data atau bukti efektivitas"
        },
        {
          value: "warna",
          text: "Warna video"
        }
      ],

      correctAnswers: [
        "murid",
        "materi",
        "tujuan",
        "bukti"
      ]
    },

    test: {
      question:
        "Bagaimana klaim 'selalu' dan 'semua murid' sebaiknya diuji?",

      options: [
        {
          value: "a",
          text: "Cari bukti pada berbagai murid, materi, dan kondisi"
        },
        {
          value: "b",
          text: "Tonton satu video lalu simpulkan"
        },
        {
          value: "c",
          text: "Terima karena video punya suara"
        },
        {
          value: "d",
          text: "Tolak semua video"
        }
      ],

      correctAnswer: "a"
    },

    correct: {
      question:
        "Keputusan yang paling bertanggung jawab adalah...",

      options: [
        {
          value: "a",
          text: "Video selalu terbaik"
        },
        {
          value: "b",
          text: "Teks selalu terbaik"
        },
        {
          value: "c",
          text: "Belum cukup bukti; efektivitas bergantung pada tujuan, materi, murid, dan kondisi"
        },
        {
          value: "d",
          text: "Semua media sama efektif"
        }
      ],

      correctAnswer: "c"
    },

    justify: {
      prompt:
        "Jelaskan mengapa kesimpulan umum membutuhkan bukti yang cukup.",

      keywords: [
        "bukti",
        "semua",
        "selalu",
        "murid",
        "materi",
        "tujuan",
        "tergantung"
      ]
    },

    result: {
      status: "INSUFFICIENT EVIDENCE DETECTED",

      explanation:
        "Klaim AI terlalu umum. Efektivitas media dipengaruhi tujuan, materi, karakteristik murid, kondisi penggunaan, dan bukti yang tersedia. Jika bukti belum cukup, kesimpulan sebaiknya ditunda."
    }
  }

];