// =========================================================
// AI TRAP LAB
// FINAL FRONTEND ENGINE
//
// FLOW:
// Identity
// → Pretest CT
// → 15 Missions
// → Posttest CT
// → Critical AI Literacy
// → Student Response
// → Complete
// =========================================================


// =========================================================
// GLOBAL STATE
// =========================================================

let currentMissionId = null;
let currentStep = 0;

let answers = createEmptyMissionAnswers();
let scores = createEmptyMissionScores();

let currentPretestIndex = 0;
let pretestStartedAt = null;
let pretestResponses = [];

let currentPosttestIndex = 0;
let posttestStartedAt = null;
let posttestResponses = [];

let currentCALIndex = 0;
let calStartedAt = null;
let calResponses = [];

let currentResponseIndex = 0;
let responseStartedAt = null;
let studentResponses = [];

let reflectionHelpful = "";
let reflectionImprovement = "";


// =========================================================
// PRETEST QUESTIONS
// =========================================================

const pretestQuestions = [

  {
    id: 1,
    indicator: "Decomposition",

    stimulus:
      "Raka mendapat tugas mengumpulkan laporan digital. Ia harus menyiapkan isi laporan, membuat file, memeriksa kembali, lalu mengunggahnya ke LMS.",

    question:
      "Cara paling tepat untuk menyelesaikan tugas tersebut adalah...",

    answers: [
      {
        value: "a",
        text: "Mengerjakan semua bagian sekaligus tanpa urutan."
      },
      {
        value: "b",
        text: "Membagi pekerjaan menjadi beberapa bagian kecil seperti menyiapkan isi, membuat file, memeriksa, dan mengunggah."
      },
      {
        value: "c",
        text: "Langsung mengunggah file sebelum membuat laporan."
      },
      {
        value: "d",
        text: "Hanya mengerjakan bagian yang paling mudah."
      }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Masalah yang besar lebih mudah dikelola jika dipecah menjadi bagian-bagian yang lebih kecil."
      },
      {
        value: "b",
        text: "Semakin banyak langkah, semakin buruk penyelesaiannya."
      },
      {
        value: "c",
        text: "Semua tugas sebaiknya diselesaikan secara acak."
      },
      {
        value: "d",
        text: "Bagian lain tidak perlu dikerjakan jika satu bagian sudah selesai."
      }
    ],

    correctReason: "a"
  },

  {
    id: 2,
    indicator: "Decomposition",

    stimulus:
      "Kelompokmu diminta membuat presentasi tentang keamanan internet. Tugasnya cukup besar dan harus selesai dalam satu pertemuan.",

    question:
      "Strategi kerja kelompok yang paling efektif adalah...",

    answers: [
      {
        value: "a",
        text: "Semua anggota mengerjakan hal yang sama."
      },
      {
        value: "b",
        text: "Satu orang mengerjakan semua tugas."
      },
      {
        value: "c",
        text: "Membagi tugas menjadi pencarian informasi, penulisan isi, pembuatan slide, dan pemeriksaan."
      },
      {
        value: "d",
        text: "Membuat slide terlebih dahulu tanpa menentukan isi."
      }
    ],

    correctAnswer: "c",

    reasons: [
      {
        value: "a",
        text: "Pembagian masalah menjadi sub-tugas membantu pekerjaan dilakukan secara lebih terstruktur."
      },
      {
        value: "b",
        text: "Tugas harus selalu dikerjakan oleh satu orang."
      },
      {
        value: "c",
        text: "Semua anggota harus membuat slide yang sama."
      },
      {
        value: "d",
        text: "Urutan dan pembagian tugas tidak berpengaruh."
      }
    ],

    correctReason: "a"
  },

  {
    id: 3,
    indicator: "Pattern Recognition",

    stimulus:
      "Perhatikan pola bilangan berikut: 2, 6, 12, 20, 30, ...",

    question:
      "Bilangan berikutnya adalah...",

    answers: [
      { value: "a", text: "36" },
      { value: "b", text: "40" },
      { value: "c", text: "42" },
      { value: "d", text: "44" }
    ],

    correctAnswer: "c",

    reasons: [
      {
        value: "a",
        text: "Selisihnya bertambah 2: +4, +6, +8, +10, sehingga berikutnya +12."
      },
      {
        value: "b",
        text: "Semua bilangan selalu ditambah 6."
      },
      {
        value: "c",
        text: "Bilangan berikutnya harus selalu genap tanpa memperhatikan pola."
      },
      {
        value: "d",
        text: "30 dikalikan 2 lalu dikurangi 18."
      }
    ],

    correctReason: "a"
  },

  {
    id: 4,
    indicator: "Pattern Recognition",

    stimulus:
      "Perhatikan urutan berikut: A1, C3, E5, G7, ...",

    question:
      "Pasangan berikutnya adalah...",

    answers: [
      { value: "a", text: "H8" },
      { value: "b", text: "I8" },
      { value: "c", text: "I9" },
      { value: "d", text: "J10" }
    ],

    correctAnswer: "c",

    reasons: [
      {
        value: "a",
        text: "Huruf maju dua posisi dan angka bertambah dua."
      },
      {
        value: "b",
        text: "Huruf maju satu posisi dan angka tetap."
      },
      {
        value: "c",
        text: "Angka saja yang berubah."
      },
      {
        value: "d",
        text: "Pasangan dipilih berdasarkan alfabet secara acak."
      }
    ],

    correctReason: "a"
  },

  {
    id: 5,
    indicator: "Abstraction",

    stimulus:
      "Siti ingin memilih rute tercepat ke sekolah. Ia memiliki informasi tentang jarak, waktu tempuh, kondisi lalu lintas, warna jalan pada peta, dan nama jalan.",

    question:
      "Informasi yang paling penting untuk menentukan rute tercepat adalah...",

    answers: [
      {
        value: "a",
        text: "Warna jalan pada peta."
      },
      {
        value: "b",
        text: "Jarak, waktu tempuh, dan kondisi lalu lintas."
      },
      {
        value: "c",
        text: "Nama jalan saja."
      },
      {
        value: "d",
        text: "Bentuk simbol pada peta."
      }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Abstraksi memilih informasi yang relevan terhadap tujuan dan mengabaikan detail yang tidak diperlukan."
      },
      {
        value: "b",
        text: "Semua informasi harus selalu digunakan."
      },
      {
        value: "c",
        text: "Warna lebih penting daripada waktu."
      },
      {
        value: "d",
        text: "Nama jalan otomatis menentukan kecepatan."
      }
    ],

    correctReason: "a"
  },

  {
    id: 6,
    indicator: "Abstraction",

    stimulus:
      "Perpustakaan memiliki aturan: murid boleh meminjam buku jika jumlah pinjaman belum mencapai batas dan tidak memiliki buku yang terlambat dikembalikan.",

    question:
      "Data yang paling relevan untuk menentukan apakah seorang murid boleh meminjam buku adalah...",

    answers: [
      {
        value: "a",
        text: "Nama lengkap dan warna tas."
      },
      {
        value: "b",
        text: "Jumlah buku yang sedang dipinjam dan status keterlambatan."
      },
      {
        value: "c",
        text: "Kelas dan tinggi badan."
      },
      {
        value: "d",
        text: "Jenis buku favorit."
      }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Keputusan harus menggunakan informasi yang berhubungan langsung dengan aturan peminjaman."
      },
      {
        value: "b",
        text: "Semua data pribadi harus digunakan."
      },
      {
        value: "c",
        text: "Jenis buku favorit menentukan izin meminjam."
      },
      {
        value: "d",
        text: "Kelas selalu menentukan jumlah buku."
      }
    ],

    correctReason: "a"
  },

  {
    id: 7,
    indicator: "Algorithmic Thinking",

    stimulus:
      "Perhatikan langkah berikut untuk menyimpan dokumen:\n1. Pilih folder tujuan\n2. Buka menu Save As\n3. Ketik nama file\n4. Klik Save",

    question:
      "Urutan yang paling logis adalah...",

    answers: [
      { value: "a", text: "1 → 2 → 3 → 4" },
      { value: "b", text: "2 → 1 → 3 → 4" },
      { value: "c", text: "3 → 4 → 2 → 1" },
      { value: "d", text: "4 → 3 → 2 → 1" }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Menu Save As perlu dibuka sebelum menentukan folder, nama file, lalu menyimpan."
      },
      {
        value: "b",
        text: "Folder harus selalu dipilih sebelum aplikasi dibuka."
      },
      {
        value: "c",
        text: "Klik Save seharusnya dilakukan terlebih dahulu."
      },
      {
        value: "d",
        text: "Urutan tidak memengaruhi hasil."
      }
    ],

    correctReason: "a"
  },

  {
    id: 8,
    indicator: "Algorithmic Thinking",

    stimulus:
      "Sebuah sistem login menerima username dan password. Jika password salah, sistem harus memberi pesan kesalahan dan meminta pengguna mencoba kembali.",

    question:
      "Langkah yang paling tepat setelah password dinyatakan salah adalah...",

    answers: [
      {
        value: "a",
        text: "Langsung masuk ke halaman utama."
      },
      {
        value: "b",
        text: "Menampilkan pesan kesalahan dan meminta password kembali."
      },
      {
        value: "c",
        text: "Menghapus seluruh akun pengguna."
      },
      {
        value: "d",
        text: "Mematikan komputer."
      }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Algoritma harus menangani kondisi salah dengan langkah yang sesuai sebelum proses dilanjutkan."
      },
      {
        value: "b",
        text: "Password salah berarti pengguna harus selalu dibuatkan akun baru."
      },
      {
        value: "c",
        text: "Semua kondisi harus menghasilkan keluaran yang sama."
      },
      {
        value: "d",
        text: "Kesalahan input berarti sistem harus berhenti permanen."
      }
    ],

    correctReason: "a"
  },

  {
    id: 9,
    indicator: "Evaluation",

    stimulus:
      "Metode A mengirim file dalam 2 menit tetapi menggunakan 200 MB data. Metode B membutuhkan 5 menit tetapi hanya menggunakan 50 MB data.",

    question:
      "Pernyataan yang paling tepat adalah...",

    answers: [
      {
        value: "a",
        text: "Metode A selalu lebih baik."
      },
      {
        value: "b",
        text: "Metode B selalu lebih baik."
      },
      {
        value: "c",
        text: "Pilihan terbaik bergantung pada kriteria yang digunakan."
      },
      {
        value: "d",
        text: "Keduanya tidak dapat dibandingkan."
      }
    ],

    correctAnswer: "c",

    reasons: [
      {
        value: "a",
        text: "A unggul dalam waktu, sedangkan B unggul dalam penggunaan data, sehingga perlu menentukan prioritas."
      },
      {
        value: "b",
        text: "Waktu selalu lebih penting daripada data."
      },
      {
        value: "c",
        text: "Data selalu lebih penting daripada waktu."
      },
      {
        value: "d",
        text: "Jika hasil berbeda, tidak perlu mengevaluasi."
      }
    ],

    correctReason: "a"
  },

  {
    id: 10,
    indicator: "Evaluation",

    stimulus:
      "Seseorang berkata: 'Algoritma yang memiliki langkah lebih sedikit selalu lebih cepat.' Namun Algoritma A memiliki 3 langkah dan membutuhkan 6 menit, sedangkan Algoritma B memiliki 5 langkah dan membutuhkan 3 menit.",

    question:
      "Bagaimana klaim tersebut sebaiknya dinilai?",

    answers: [
      {
        value: "a",
        text: "Benar karena A memiliki langkah lebih sedikit."
      },
      {
        value: "b",
        text: "Salah, karena terdapat contoh yang menunjukkan langkah lebih sedikit tidak selalu lebih cepat."
      },
      {
        value: "c",
        text: "Benar karena jumlah langkah selalu menentukan waktu."
      },
      {
        value: "d",
        text: "Tidak perlu diperiksa."
      }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Satu counterexample yang valid sudah cukup untuk menunjukkan bahwa klaim 'selalu' tidak berlaku."
      },
      {
        value: "b",
        text: "Semua klaim yang menggunakan kata 'selalu' pasti salah."
      },
      {
        value: "c",
        text: "Jumlah langkah tidak pernah berhubungan dengan waktu."
      },
      {
        value: "d",
        text: "Algoritma A memiliki angka yang lebih kecil."
      }
    ],

    correctReason: "a"
  }

];


// =========================================================
// POSTTEST QUESTIONS
// =========================================================

const posttestQuestions = [

  {
    id: 1,
    indicator: "Decomposition",

    stimulus:
      "Nadia diminta membuat video tugas Informatika. Ia harus menentukan isi, menyiapkan bahan, merekam, mengedit, lalu mengirimkan hasilnya.",

    question:
      "Strategi yang paling tepat untuk menyelesaikan tugas tersebut adalah...",

    answers: [
      {
        value: "a",
        text: "Melakukan seluruh kegiatan secara bersamaan."
      },
      {
        value: "b",
        text: "Memecah tugas menjadi beberapa bagian seperti perencanaan, persiapan, perekaman, pengeditan, dan pengiriman."
      },
      {
        value: "c",
        text: "Langsung mengirim video sebelum dibuat."
      },
      {
        value: "d",
        text: "Hanya melakukan bagian yang paling disukai."
      }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Masalah kompleks lebih mudah diselesaikan jika dibagi menjadi bagian yang lebih kecil dan terkelola."
      },
      {
        value: "b",
        text: "Semakin sedikit bagian yang dikerjakan, semakin baik hasilnya."
      },
      {
        value: "c",
        text: "Semua pekerjaan sebaiknya dilakukan tanpa perencanaan."
      },
      {
        value: "d",
        text: "Satu bagian saja cukup untuk menyelesaikan keseluruhan tugas."
      }
    ],

    correctReason: "a"
  },

  {
    id: 2,
    indicator: "Decomposition",

    stimulus:
      "Sebuah kelompok harus membuat poster digital tentang jejak digital dan mempresentasikannya di depan kelas.",

    question:
      "Pembagian pekerjaan yang paling terstruktur adalah...",

    answers: [
      {
        value: "a",
        text: "Semua anggota hanya mencari gambar."
      },
      {
        value: "b",
        text: "Satu anggota mengerjakan semuanya."
      },
      {
        value: "c",
        text: "Membagi pekerjaan menjadi riset informasi, penyusunan pesan, desain poster, dan persiapan presentasi."
      },
      {
        value: "d",
        text: "Langsung melakukan presentasi tanpa membuat poster."
      }
    ],

    correctAnswer: "c",

    reasons: [
      {
        value: "a",
        text: "Memecah pekerjaan besar menjadi sub-tugas membantu setiap bagian dikerjakan secara lebih sistematis."
      },
      {
        value: "b",
        text: "Semua pekerjaan harus dilakukan oleh orang yang sama."
      },
      {
        value: "c",
        text: "Pembagian tugas tidak diperlukan dalam penyelesaian masalah."
      },
      {
        value: "d",
        text: "Bagian yang sulit sebaiknya dihilangkan."
      }
    ],

    correctReason: "a"
  },

  {
    id: 3,
    indicator: "Pattern Recognition",

    stimulus:
      "Perhatikan pola bilangan berikut: 5, 10, 17, 26, 37, ...",

    question:
      "Bilangan berikutnya adalah...",

    answers: [
      { value: "a", text: "46" },
      { value: "b", text: "48" },
      { value: "c", text: "50" },
      { value: "d", text: "52" }
    ],

    correctAnswer: "c",

    reasons: [
      {
        value: "a",
        text: "Selisihnya +5, +7, +9, +11, sehingga berikutnya +13."
      },
      {
        value: "b",
        text: "Setiap bilangan selalu ditambah 10."
      },
      {
        value: "c",
        text: "Bilangan berikutnya dipilih karena harus genap."
      },
      {
        value: "d",
        text: "37 dikalikan dua lalu dikurangi 24."
      }
    ],

    correctReason: "a"
  },

  {
    id: 4,
    indicator: "Pattern Recognition",

    stimulus:
      "Perhatikan urutan berikut: B2, D4, F6, H8, ...",

    question:
      "Pasangan berikutnya adalah...",

    answers: [
      { value: "a", text: "I9" },
      { value: "b", text: "J9" },
      { value: "c", text: "J10" },
      { value: "d", text: "K10" }
    ],

    correctAnswer: "c",

    reasons: [
      {
        value: "a",
        text: "Huruf bergerak dua posisi dan angka bertambah dua."
      },
      {
        value: "b",
        text: "Huruf bergerak satu posisi dan angka bertambah satu."
      },
      {
        value: "c",
        text: "Hanya huruf yang berubah."
      },
      {
        value: "d",
        text: "Pasangan berikutnya ditentukan secara acak."
      }
    ],

    correctReason: "a"
  },

  {
    id: 5,
    indicator: "Abstraction",

    stimulus:
      "Dimas ingin memilih laptop untuk belajar di sekolah. Data yang tersedia adalah RAM, kapasitas penyimpanan, daya tahan baterai, harga, warna casing, dan gambar pada kemasan.",

    question:
      "Informasi yang paling relevan untuk membandingkan laptop adalah...",

    answers: [
      {
        value: "a",
        text: "Warna casing dan gambar kemasan."
      },
      {
        value: "b",
        text: "RAM, kapasitas penyimpanan, daya tahan baterai, dan harga."
      },
      {
        value: "c",
        text: "Gambar pada kardus saja."
      },
      {
        value: "d",
        text: "Nama warna laptop."
      }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Informasi dipilih berdasarkan relevansinya terhadap tujuan penggunaan laptop."
      },
      {
        value: "b",
        text: "Semua informasi memiliki tingkat kepentingan yang sama."
      },
      {
        value: "c",
        text: "Kemasan menentukan kemampuan komputer."
      },
      {
        value: "d",
        text: "Warna casing menentukan kapasitas perangkat."
      }
    ],

    correctReason: "a"
  },

  {
    id: 6,
    indicator: "Abstraction",

    stimulus:
      "Sekolah menetapkan bahwa murid boleh mengikuti ujian susulan jika belum mengikuti ujian utama dan memiliki izin resmi.",

    question:
      "Data yang paling relevan untuk menentukan kelayakan ujian susulan adalah...",

    answers: [
      {
        value: "a",
        text: "Warna seragam dan nomor sepatu."
      },
      {
        value: "b",
        text: "Status mengikuti ujian utama dan keberadaan izin resmi."
      },
      {
        value: "c",
        text: "Makanan favorit dan hobi."
      },
      {
        value: "d",
        text: "Jumlah teman sekelas."
      }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Informasi yang digunakan harus berkaitan langsung dengan syarat keputusan."
      },
      {
        value: "b",
        text: "Semua informasi tentang murid harus digunakan."
      },
      {
        value: "c",
        text: "Hobi menentukan hak mengikuti ujian."
      },
      {
        value: "d",
        text: "Jumlah teman menentukan status ujian."
      }
    ],

    correctReason: "a"
  },

  {
    id: 7,
    indicator: "Algorithmic Thinking",

    stimulus:
      "Perhatikan langkah membuat folder baru:\n1. Ketik nama folder\n2. Buka lokasi penyimpanan\n3. Pilih perintah New Folder\n4. Tekan Enter",

    question:
      "Urutan yang paling logis adalah...",

    answers: [
      { value: "a", text: "1 → 2 → 3 → 4" },
      { value: "b", text: "2 → 3 → 1 → 4" },
      { value: "c", text: "3 → 4 → 2 → 1" },
      { value: "d", text: "4 → 1 → 3 → 2" }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Lokasi dibuka lebih dahulu, kemudian perintah membuat folder dipilih, nama diketik, dan dikonfirmasi."
      },
      {
        value: "b",
        text: "Nama folder harus diketik sebelum lokasi penyimpanan dibuka."
      },
      {
        value: "c",
        text: "Konfirmasi harus dilakukan sebelum nama folder diberikan."
      },
      {
        value: "d",
        text: "Urutan langkah tidak berpengaruh terhadap proses."
      }
    ],

    correctReason: "a"
  },

  {
    id: 8,
    indicator: "Algorithmic Thinking",

    stimulus:
      "Sistem meminta PIN. Jika PIN benar, akses diberikan. Jika PIN salah, sistem menampilkan pesan kesalahan dan meminta pengguna mencoba lagi.",

    question:
      "Apa yang harus dilakukan sistem ketika PIN salah?",

    answers: [
      {
        value: "a",
        text: "Tetap memberikan akses."
      },
      {
        value: "b",
        text: "Menampilkan kesalahan dan meminta PIN kembali."
      },
      {
        value: "c",
        text: "Menghapus seluruh data pengguna."
      },
      {
        value: "d",
        text: "Menganggap PIN benar."
      }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Setiap kondisi dalam algoritma perlu ditangani dengan tindakan yang sesuai."
      },
      {
        value: "b",
        text: "Semua masukan harus menghasilkan keluaran yang sama."
      },
      {
        value: "c",
        text: "Kesalahan satu kali harus selalu menghapus data."
      },
      {
        value: "d",
        text: "Kondisi benar dan salah tidak perlu dibedakan."
      }
    ],

    correctReason: "a"
  },

  {
    id: 9,
    indicator: "Evaluation",

    stimulus:
      "Penyimpanan A dapat memindahkan file dalam 1 menit tetapi kapasitasnya hanya 8 GB. Penyimpanan B membutuhkan 3 menit tetapi kapasitasnya 64 GB.",

    question:
      "Pernyataan yang paling tepat adalah...",

    answers: [
      {
        value: "a",
        text: "A selalu lebih baik karena lebih cepat."
      },
      {
        value: "b",
        text: "B selalu lebih baik karena kapasitas lebih besar."
      },
      {
        value: "c",
        text: "Pilihan terbaik tergantung apakah prioritasnya kecepatan atau kapasitas."
      },
      {
        value: "d",
        text: "Kedua pilihan tidak bisa dibandingkan."
      }
    ],

    correctAnswer: "c",

    reasons: [
      {
        value: "a",
        text: "A unggul pada kecepatan, sedangkan B unggul pada kapasitas sehingga kriteria harus ditentukan."
      },
      {
        value: "b",
        text: "Kecepatan selalu menjadi satu-satunya kriteria."
      },
      {
        value: "c",
        text: "Kapasitas selalu menjadi satu-satunya kriteria."
      },
      {
        value: "d",
        text: "Solusi yang memiliki perbedaan tidak perlu dievaluasi."
      }
    ],

    correctReason: "a"
  },

  {
    id: 10,
    indicator: "Evaluation",

    stimulus:
      "Seseorang mengatakan: 'Solusi dengan langkah paling sedikit selalu paling efektif.' Solusi A memiliki 3 langkah tetapi gagal menyelesaikan tugas. Solusi B memiliki 5 langkah dan berhasil menyelesaikan tugas.",

    question:
      "Bagaimana pernyataan tersebut sebaiknya dinilai?",

    answers: [
      {
        value: "a",
        text: "Benar karena A memiliki langkah lebih sedikit."
      },
      {
        value: "b",
        text: "Salah karena efektivitas juga harus mempertimbangkan apakah tujuan berhasil dicapai."
      },
      {
        value: "c",
        text: "Benar karena jumlah langkah adalah satu-satunya ukuran."
      },
      {
        value: "d",
        text: "Tidak perlu dibandingkan."
      }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Solusi yang lebih singkat tidak dapat disebut efektif jika gagal mencapai tujuan."
      },
      {
        value: "b",
        text: "Semua solusi panjang selalu lebih baik."
      },
      {
        value: "c",
        text: "Keberhasilan menyelesaikan tugas tidak penting."
      },
      {
        value: "d",
        text: "Jumlah langkah selalu menentukan kualitas solusi."
      }
    ],

    correctReason: "a"
  }

];


// =========================================================
// CRITICAL AI LITERACY
// =========================================================

const calQuestions = [

  {
    id: 1,
    indicator: "Questioning",

    stimulus:
      'AI menjawab: "Password yang kuat cukup dibuat dari nama sendiri dan tahun lahir agar mudah diingat."',

    question:
      "Apa tindakan yang paling tepat terhadap jawaban AI tersebut?",

    answers: [
      {
        value: "a",
        text: "Langsung mengikuti saran AI karena terdengar praktis."
      },
      {
        value: "b",
        text: "Mempertanyakan saran tersebut dan memeriksa apakah sesuai dengan prinsip keamanan password."
      },
      {
        value: "c",
        text: "Menolak semua jawaban AI tanpa diperiksa."
      },
      {
        value: "d",
        text: "Menggunakan nama lengkap agar password lebih panjang."
      }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Keluaran AI sebaiknya diperlakukan sebagai klaim yang perlu diperiksa sebelum digunakan."
      },
      {
        value: "b",
        text: "Semua informasi dari AI selalu salah."
      },
      {
        value: "c",
        text: "Jawaban yang terdengar sederhana pasti benar."
      },
      {
        value: "d",
        text: "AI tidak pernah memberikan informasi yang berguna."
      }
    ],

    correctReason: "a"
  },

  {
    id: 2,
    indicator: "Verification",

    stimulus:
      'AI menyatakan: "RAM menyimpan data secara permanen meskipun komputer telah dimatikan."',

    question:
      "Apa langkah verifikasi yang paling tepat?",

    answers: [
      {
        value: "a",
        text: "Menerimanya karena menggunakan istilah teknis."
      },
      {
        value: "b",
        text: "Membandingkan klaim tersebut dengan buku Informatika atau sumber teknologi tepercaya."
      },
      {
        value: "c",
        text: "Menanyakan kembali kepada AI yang sama lalu langsung percaya."
      },
      {
        value: "d",
        text: "Mengabaikan klaim tanpa mencari bukti."
      }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Verifikasi membutuhkan pembandingan dengan sumber atau bukti lain yang dapat dipercaya."
      },
      {
        value: "b",
        text: "Istilah teknis merupakan bukti bahwa informasi benar."
      },
      {
        value: "c",
        text: "Mengulang pertanyaan kepada sistem yang sama selalu menghasilkan kepastian."
      },
      {
        value: "d",
        text: "Informasi dari AI tidak boleh digunakan dalam keadaan apa pun."
      }
    ],

    correctReason: "a"
  },

  {
    id: 3,
    indicator: "Evidence Evaluation",

    stimulus:
      'AI mengatakan: "1 GB lebih besar daripada 1 MB karena huruf G terletak setelah huruf M dalam alfabet."',

    question:
      "Bagaimana pernyataan tersebut sebaiknya dinilai?",

    answers: [
      {
        value: "a",
        text: "Kesimpulan dan alasannya sama-sama benar."
      },
      {
        value: "b",
        text: "Kesimpulannya benar, tetapi alasan yang diberikan tidak valid."
      },
      {
        value: "c",
        text: "Kesimpulannya salah karena alfabet tidak berhubungan dengan data."
      },
      {
        value: "d",
        text: "Tidak perlu menilai alasan jika jawabannya benar."
      }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Kebenaran kesimpulan dan kualitas alasan perlu diperiksa secara terpisah."
      },
      {
        value: "b",
        text: "Jika kesimpulannya benar, semua alasan otomatis benar."
      },
      {
        value: "c",
        text: "Jawaban AI selalu salah jika penjelasannya panjang."
      },
      {
        value: "d",
        text: "Alasan tidak penting dalam proses verifikasi."
      }
    ],

    correctReason: "a"
  },

  {
    id: 4,
    indicator: "Verification",

    stimulus:
      "AI memberikan informasi sejarah perkembangan komputer dan menyebut suatu tahun tertentu, tetapi tidak menyertakan sumber.",

    question:
      "Apa tindakan terbaik sebelum informasi tersebut digunakan dalam tugas?",

    answers: [
      {
        value: "a",
        text: "Menyalin informasi karena AI sudah memberikan jawaban lengkap."
      },
      {
        value: "b",
        text: "Memeriksa tahun dan fakta tersebut melalui sumber tepercaya yang dapat ditelusuri."
      },
      {
        value: "c",
        text: "Menghapus semua informasi dari AI."
      },
      {
        value: "d",
        text: "Menganggap benar jika jawabannya panjang."
      }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Informasi faktual yang tidak memiliki sumber perlu diverifikasi sebelum digunakan."
      },
      {
        value: "b",
        text: "Jawaban panjang biasanya tidak perlu diperiksa."
      },
      {
        value: "c",
        text: "AI tidak boleh digunakan untuk membantu belajar."
      },
      {
        value: "d",
        text: "Tidak adanya sumber membuktikan bahwa informasi pasti salah."
      }
    ],

    correctReason: "a"
  },

  {
    id: 5,
    indicator: "Bias Awareness",

    stimulus:
      'AI menyatakan: "Semua murid pasti belajar lebih baik dengan video daripada dengan teks."',

    question:
      "Bagaimana klaim tersebut sebaiknya dinilai?",

    answers: [
      {
        value: "a",
        text: "Benar karena video memiliki gambar dan suara."
      },
      {
        value: "b",
        text: "Belum dapat digeneralisasi karena efektivitas dapat berbeda menurut tujuan, materi, murid, dan kondisi."
      },
      {
        value: "c",
        text: "Salah karena teks selalu lebih baik."
      },
      {
        value: "d",
        text: "Benar selama dibuat oleh AI."
      }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Kata seperti 'semua' dan 'selalu' membutuhkan bukti yang cukup untuk mendukung generalisasi."
      },
      {
        value: "b",
        text: "Semua klaim umum pasti salah tanpa pengecualian."
      },
      {
        value: "c",
        text: "Video tidak pernah efektif untuk belajar."
      },
      {
        value: "d",
        text: "Pendapat mayoritas otomatis menjadi bukti ilmiah."
      }
    ],

    correctReason: "a"
  },

  {
    id: 6,
    indicator: "Evidence Evaluation",

    stimulus:
      "Dua AI memberikan jawaban berbeda untuk persoalan yang sama. AI pertama mengatakan pilihan A, sedangkan AI kedua mengatakan pilihan B.",

    question:
      "Apa tindakan yang paling tepat?",

    answers: [
      {
        value: "a",
        text: "Memilih AI pertama karena menjawab lebih cepat."
      },
      {
        value: "b",
        text: "Membandingkan alasan kedua jawaban dan memeriksanya dengan bukti atau sumber lain."
      },
      {
        value: "c",
        text: "Memilih jawaban yang paling panjang."
      },
      {
        value: "d",
        text: "Menganggap keduanya benar."
      }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Perbedaan jawaban harus diselesaikan melalui evaluasi alasan dan bukti, bukan berdasarkan penampilan jawaban."
      },
      {
        value: "b",
        text: "AI yang menjawab lebih cepat selalu lebih akurat."
      },
      {
        value: "c",
        text: "Jawaban panjang selalu memiliki bukti lebih baik."
      },
      {
        value: "d",
        text: "Dua jawaban yang bertentangan pasti sama-sama benar."
      }
    ],

    correctReason: "a"
  },

  {
    id: 7,
    indicator: "Questioning",

    stimulus:
      'AI berkata: "Algoritma ini selalu benar." Setelah diuji pada lima data, algoritma bekerja pada empat data tetapi gagal pada satu data.',

    question:
      "Kesimpulan yang paling tepat adalah...",

    answers: [
      {
        value: "a",
        text: "Algoritma tetap selalu benar karena berhasil empat kali."
      },
      {
        value: "b",
        text: "Klaim 'selalu benar' tidak dapat dipertahankan karena terdapat satu kasus gagal."
      },
      {
        value: "c",
        text: "Data kelima harus diabaikan."
      },
      {
        value: "d",
        text: "Algoritma pasti salah untuk semua data."
      }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "Satu counterexample yang valid dapat membantah klaim universal seperti 'selalu'."
      },
      {
        value: "b",
        text: "Mayoritas keberhasilan selalu membuktikan kebenaran mutlak."
      },
      {
        value: "c",
        text: "Data yang tidak sesuai boleh dihapus agar kesimpulan tetap benar."
      },
      {
        value: "d",
        text: "Satu kegagalan membuktikan algoritma tidak pernah bekerja."
      }
    ],

    correctReason: "a"
  },

  {
    id: 8,
    indicator: "Responsible Judgment",

    stimulus:
      "Seorang murid menggunakan AI untuk membantu memahami materi yang sulit sebelum mengerjakan tugas sekolah.",

    question:
      "Cara menggunakan AI yang paling bertanggung jawab adalah...",

    answers: [
      {
        value: "a",
        text: "Menyalin seluruh jawaban AI tanpa membaca kembali."
      },
      {
        value: "b",
        text: "Menggunakan AI sebagai bantuan, memeriksa informasi penting, lalu menyusun jawaban berdasarkan pemahaman sendiri."
      },
      {
        value: "c",
        text: "Meminta AI mengerjakan seluruh tugas dan langsung mengumpulkannya."
      },
      {
        value: "d",
        text: "Tidak pernah menggunakan AI untuk belajar."
      }
    ],

    correctAnswer: "b",

    reasons: [
      {
        value: "a",
        text: "AI dapat digunakan sebagai alat bantu, tetapi pengguna tetap bertanggung jawab untuk memverifikasi dan memahami hasilnya."
      },
      {
        value: "b",
        text: "Menggunakan AI berarti pengguna tidak perlu berpikir lagi."
      },
      {
        value: "c",
        text: "Semua hasil AI dapat digunakan tanpa pemeriksaan."
      },
      {
        value: "d",
        text: "Penggunaan AI selalu bertentangan dengan proses belajar."
      }
    ],

    correctReason: "a"
  }

];


// =========================================================
// STUDENT RESPONSE ITEMS
// 1 = STS
// 2 = TS
// 3 = S
// 4 = SS
// =========================================================

const responseStatements = [

  {
    id: 1,
    text:
      "AI TRAP LAB membuat saya lebih berhati-hati sebelum menerima jawaban dari AI."
  },

  {
    id: 2,
    text:
      "Kegiatan AI TRAP LAB mendorong saya memeriksa alasan di balik jawaban AI."
  },

  {
    id: 3,
    text:
      "Mission yang diberikan membuat saya berpikir lebih mendalam sebelum mengambil kesimpulan."
  },

  {
    id: 4,
    text:
      "Setelah mengikuti AI TRAP LAB, saya memahami bahwa AI dapat memberikan jawaban yang keliru."
  },

  {
    id: 5,
    text:
      "Saya memahami bahwa jawaban AI yang benar belum tentu memiliki alasan yang benar."
  },

  {
    id: 6,
    text:
      "AI TRAP LAB membantu saya menggunakan bukti sebelum menentukan apakah sebuah klaim dapat dipercaya."
  },

  {
    id: 7,
    text:
      "Petunjuk dan alur mission AI TRAP LAB mudah saya pahami."
  },

  {
    id: 8,
    text:
      "Tampilan dan aktivitas AI TRAP LAB membantu saya mengikuti proses pembelajaran."
  },

  {
    id: 9,
    text:
      "Saya tertarik menyelesaikan mission berikutnya setelah menyelesaikan sebuah mission."
  },

  {
    id: 10,
    text:
      "Saya ingin menggunakan cara memeriksa dan memverifikasi informasi seperti ini ketika menggunakan AI di luar kegiatan pembelajaran."
  }

];


// =========================================================
// EMPTY DATA
// =========================================================

function createEmptyMissionAnswers() {

  return {
    claim: null,
    check: [],
    test: null,
    correct: null,
    justify: ""
  };
}


function createEmptyMissionScores() {

  return {
    claim: 0,
    check: 0,
    test: 0,
    correct: 0,
    justify: 0
  };
}


function createEmptyAssessmentResponses(questions) {

  return questions.map(question => ({
    id: question.id,
    answer: null,
    reason: null
  }));
}


function createEmptyStudentResponses() {

  return responseStatements.map(item => ({
    id: item.id,
    value: null
  }));
}


// =========================================================
// GENERAL HELPERS
// =========================================================

function setText(id, value) {

  const element =
    document.getElementById(id);

  if (element) {
    element.textContent = value;
  }
}


function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function getMissionById(id) {

  if (
    typeof missions === "undefined" ||
    !Array.isArray(missions)
  ) {
    return null;
  }


  return missions.find(
    mission =>
      Number(mission.id) ===
      Number(id)
  ) || null;
}


// =========================================================
// SCREEN CONTROL
// =========================================================

function showScreen(screenId) {

  document
    .querySelectorAll(".screen")
    .forEach(screen => {
      screen.classList.remove("active");
    });


  const target =
    document.getElementById(screenId);


  if (!target) {

    console.error(
      `Screen "${screenId}" tidak ditemukan.`
    );

    return;
  }


  target.classList.add("active");


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// =========================================================
// LANDING
// =========================================================

function goToIdentity() {

  showScreen(
    "screenIdentity"
  );
}


function showAbout() {

  alert(
    "AI TRAP LAB menggunakan siklus CLAIM → CHECK → TEST → CORRECT → JUSTIFY untuk melatih verifikasi kritis terhadap keluaran AI."
  );
}


// =========================================================
// PARTICIPANT
// =========================================================

function getParticipant() {

  return {

    code:
      localStorage.getItem(
        "aitrap_student_code"
      ) || "",

    className:
      localStorage.getItem(
        "aitrap_student_class"
      ) || ""

  };
}


function updateStudentInfo() {

  const participant =
    getParticipant();


  setText(
    "topStudentName",
    participant.code ||
    "INVESTIGATOR"
  );


  setText(
    "topStudentClass",
    participant.className
  );
}


function submitIdentity() {

  const codeInput =
    document.getElementById(
      "studentCode"
    );


  const classInput =
    document.getElementById(
      "studentClass"
    );


  if (!codeInput || !classInput) {
    return;
  }


  const code =
    codeInput.value
      .trim()
      .toUpperCase();


  const className =
    classInput.value.trim();


  if (!code) {

    alert(
      "Masukkan kode peserta terlebih dahulu."
    );

    codeInput.focus();

    return;
  }


  if (!className) {

    alert(
      "Pilih kelas terlebih dahulu."
    );

    classInput.focus();

    return;
  }


  localStorage.setItem(
    "aitrap_student_code",
    code
  );


  localStorage.setItem(
    "aitrap_student_class",
    className
  );


  updateStudentInfo();


  routeParticipant();
}


// =========================================================
// PARTICIPANT ROUTING
// =========================================================

function routeParticipant() {

  if (!hasCompletedPretest()) {

    showScreen(
      "screenPretestIntro"
    );

    return;
  }


  if (!allMissionsCompleted()) {

    renderMissionMap();

    showScreen(
      "screenMap"
    );

    return;
  }


  if (!hasCompletedPosttest()) {

    renderMissionMap();

    showScreen(
      "screenMap"
    );

    return;
  }


  if (!hasCompletedCAL()) {

    showScreen(
      "screenCALIntro"
    );

    return;
  }


  if (!hasCompletedStudentResponse()) {

    showScreen(
      "screenResponseIntro"
    );

    return;
  }


  showFinalComplete();
}


// =========================================================
// STORAGE KEYS
// =========================================================

function getProgressKey() {

  const code =
    getParticipant().code;


  return code
    ? `aitrap_completed_missions_${code}`
    : "aitrap_completed_missions";
}


function getMissionAttemptKey() {

  const code =
    getParticipant().code;


  return code
    ? `aitrap_mission_attempts_${code}`
    : "aitrap_mission_attempts";
}


function getPretestKey() {

  return (
    "aitrap_pretest_" +
    getParticipant().code
  );
}


function getPosttestKey() {

  return (
    "aitrap_posttest_" +
    getParticipant().code
  );
}


function getCALKey() {

  return (
    "aitrap_cal_" +
    getParticipant().code
  );
}


function getResponseKey() {

  return (
    "aitrap_student_response_" +
    getParticipant().code
  );
}


// =========================================================
// COMPLETION STATUS
// =========================================================

function checkStoredCompletion(key) {

  try {

    const saved =
      localStorage.getItem(key);


    if (!saved) {
      return false;
    }


    const data =
      JSON.parse(saved);


    return Boolean(
      data &&
      data.completed === true
    );

  }

  catch {

    return false;
  }
}


function hasCompletedPretest() {

  return checkStoredCompletion(
    getPretestKey()
  );
}


function hasCompletedPosttest() {

  return checkStoredCompletion(
    getPosttestKey()
  );
}


function hasCompletedCAL() {

  return checkStoredCompletion(
    getCALKey()
  );
}


function hasCompletedStudentResponse() {

  return checkStoredCompletion(
    getResponseKey()
  );
}


// =========================================================
// GENERIC ASSESSMENT FUNCTIONS
// =========================================================

function renderAssessmentOptions(
  containerId,
  inputName,
  options,
  selectedValue
) {

  const container =
    document.getElementById(
      containerId
    );


  if (!container) {
    return;
  }


  container.innerHTML =
    options
      .map(option => {

        const checked =
          selectedValue === option.value
            ? "checked"
            : "";


        return `

          <label class="choice-card">

            <input
              type="radio"
              name="${inputName}"
              value="${escapeHTML(option.value)}"
              ${checked}
            >

            <span>
              ${escapeHTML(option.text)}
            </span>

          </label>
        `;

      })
      .join("");
}


function scoreAssessmentItem(
  question,
  response
) {

  const answerCorrect =
    response.answer ===
    question.correctAnswer;


  const reasonCorrect =
    response.reason ===
    question.correctReason;


  if (
    answerCorrect &&
    reasonCorrect
  ) {
    return 3;
  }


  if (
    answerCorrect &&
    !reasonCorrect
  ) {
    return 2;
  }


  if (
    !answerCorrect &&
    reasonCorrect
  ) {
    return 1;
  }


  return 0;
}


function calculateAssessmentResult(
  questions,
  responses
) {

  let rawScore = 0;

  const indicatorData = {};


  const itemResults =
    questions.map(
      (question, index) => {

        const response =
          responses[index];


        const itemScore =
          scoreAssessmentItem(
            question,
            response
          );


        rawScore +=
          itemScore;


        if (
          !indicatorData[
            question.indicator
          ]
        ) {

          indicatorData[
            question.indicator
          ] = {
            score: 0,
            max: 0
          };
        }


        indicatorData[
          question.indicator
        ].score +=
          itemScore;


        indicatorData[
          question.indicator
        ].max +=
          3;


        return {

          questionId:
            question.id,

          indicator:
            question.indicator,

          answer:
            response.answer,

          reason:
            response.reason,

          itemScore:
            itemScore

        };
      }
    );


  const maxScore =
    questions.length * 3;


  const score100 =
    Math.round(
      (
        rawScore /
        maxScore
      ) * 100
    );


  const indicators = {};


  Object.keys(
    indicatorData
  ).forEach(name => {

    const data =
      indicatorData[name];


    indicators[name] = {

      rawScore:
        data.score,

      maxScore:
        data.max,

      score100:
        data.max
          ? Math.round(
              (
                data.score /
                data.max
              ) * 100
            )
          : 0

    };
  });


  return {

    rawScore,
    maxScore,
    score100,
    indicators,
    itemResults

  };
}


// =========================================================
// PRETEST
// =========================================================

function startPretest() {

  if (hasCompletedPretest()) {

    renderMissionMap();

    showScreen(
      "screenMap"
    );

    return;
  }


  currentPretestIndex = 0;

  pretestStartedAt =
    new Date().toISOString();


  pretestResponses =
    createEmptyAssessmentResponses(
      pretestQuestions
    );


  renderPretestQuestion();

  showScreen(
    "screenPretest"
  );
}


function renderPretestQuestion() {

  const question =
    pretestQuestions[
      currentPretestIndex
    ];


  const response =
    pretestResponses[
      currentPretestIndex
    ];


  if (!question || !response) {
    return;
  }


  setText(
    "pretestCounter",
    `${currentPretestIndex + 1} / ${pretestQuestions.length}`
  );


  setText(
    "pretestQuestionNumber",
    `QUESTION ${String(question.id).padStart(2, "0")}`
  );


  setText(
    "pretestIndicator",
    question.indicator
  );


  setText(
    "pretestQuestion",
    question.question
  );


  const stimulus =
    document.getElementById(
      "pretestStimulus"
    );


  if (stimulus) {

    stimulus.innerHTML =
      escapeHTML(
        question.stimulus
      ).replaceAll(
        "\n",
        "<br>"
      );
  }


  renderAssessmentOptions(
    "pretestAnswerOptions",
    "pretestAnswer",
    question.answers,
    response.answer
  );


  renderAssessmentOptions(
    "pretestReasonOptions",
    "pretestReason",
    question.reasons,
    response.reason
  );


  updatePretestProgress();

  updatePretestNavigation();
}


function saveCurrentPretestAnswer() {

  const answer =
    document.querySelector(
      'input[name="pretestAnswer"]:checked'
    );


  const reason =
    document.querySelector(
      'input[name="pretestReason"]:checked'
    );


  if (!answer) {

    alert(
      "Pilih jawaban terlebih dahulu."
    );

    return false;
  }


  if (!reason) {

    alert(
      "Pilih alasan terlebih dahulu."
    );

    return false;
  }


  pretestResponses[
    currentPretestIndex
  ].answer =
    answer.value;


  pretestResponses[
    currentPretestIndex
  ].reason =
    reason.value;


  return true;
}


function savePretestSelectionWithoutValidation() {

  const answer =
    document.querySelector(
      'input[name="pretestAnswer"]:checked'
    );


  const reason =
    document.querySelector(
      'input[name="pretestReason"]:checked'
    );


  if (answer) {

    pretestResponses[
      currentPretestIndex
    ].answer =
      answer.value;
  }


  if (reason) {

    pretestResponses[
      currentPretestIndex
    ].reason =
      reason.value;
  }
}


function nextPretestQuestion() {

  if (!saveCurrentPretestAnswer()) {
    return;
  }


  if (
    currentPretestIndex <
    pretestQuestions.length - 1
  ) {

    currentPretestIndex++;

    renderPretestQuestion();

    return;
  }


  renderPretestConfirmation();

  showScreen(
    "screenPretestConfirm"
  );
}


function previousPretestQuestion() {

  savePretestSelectionWithoutValidation();


  if (currentPretestIndex > 0) {

    currentPretestIndex--;

    renderPretestQuestion();
  }
}


function updatePretestProgress() {

  const percentage =
    Math.round(
      (
        (
          currentPretestIndex + 1
        ) /
        pretestQuestions.length
      ) * 100
    );


  setText(
    "pretestProgressText",
    `${percentage}%`
  );


  const fill =
    document.getElementById(
      "pretestProgressFill"
    );


  if (fill) {

    fill.style.width =
      `${percentage}%`;
  }
}


function updatePretestNavigation() {

  const previous =
    document.getElementById(
      "pretestPreviousButton"
    );


  const next =
    document.getElementById(
      "pretestNextButton"
    );


  if (previous) {

    previous.style.visibility =
      currentPretestIndex === 0
        ? "hidden"
        : "visible";
  }


  if (next) {

    next.innerHTML =
      currentPretestIndex ===
      pretestQuestions.length - 1
        ? "Periksa Pretest →"
        : "Soal Berikutnya →";
  }
}


function renderPretestConfirmation() {

  const completed =
    pretestResponses.filter(
      item =>
        item.answer &&
        item.reason
    ).length;


  const missing =
    pretestResponses
      .filter(
        item =>
          !item.answer ||
          !item.reason
      )
      .map(
        item =>
          item.id
      );


  setText(
    "pretestAnsweredSummary",
    `${completed} / ${pretestQuestions.length}`
  );


  setText(
    "pretestCompletionStatus",
    missing.length
      ? "BELUM LENGKAP"
      : "LENGKAP"
  );


  const box =
    document.getElementById(
      "pretestMissingBox"
    );


  if (box) {

    box.textContent =
      missing.length
        ? `Belum lengkap pada soal: ${missing.join(", ")}.`
        : "";
  }


  const button =
    document.getElementById(
      "submitPretestButton"
    );


  if (button) {

    button.disabled =
      missing.length > 0;


    button.style.opacity =
      missing.length
        ? ".45"
        : "1";
  }
}


function returnToPretest() {

  const missingIndex =
    pretestResponses.findIndex(
      item =>
        !item.answer ||
        !item.reason
    );


  currentPretestIndex =
    missingIndex >= 0
      ? missingIndex
      : pretestQuestions.length - 1;


  renderPretestQuestion();

  showScreen(
    "screenPretest"
  );
}


function submitPretest() {

  const incomplete =
    pretestResponses.some(
      item =>
        !item.answer ||
        !item.reason
    );


  if (incomplete) {

    alert(
      "Masih ada soal yang belum lengkap."
    );

    return;
  }


  const participant =
    getParticipant();


  const result =
    calculateAssessmentResult(
      pretestQuestions,
      pretestResponses
    );


  const record = {

    completed: true,

    participantCode:
      participant.code,

    className:
      participant.className,

    assessment:
      "PRETEST_CT",

    startedAt:
      pretestStartedAt,

    submittedAt:
      new Date().toISOString(),

    responses:
      pretestResponses,

    rawScore:
      result.rawScore,

    maxScore:
      result.maxScore,

    score100:
      result.score100,

    indicators:
      result.indicators,

    itemResults:
      result.itemResults

  };


  localStorage.setItem(
    getPretestKey(),
    JSON.stringify(record)
  );


  showScreen(
    "screenPretestCompleted"
  );
}


function enterMissionMapAfterPretest() {

  renderMissionMap();

  showScreen(
    "screenMap"
  );
}


// =========================================================
// MISSION PROGRESS
// =========================================================

function getCompletedMissions() {

  try {

    const saved =
      localStorage.getItem(
        getProgressKey()
      );


    if (!saved) {
      return [];
    }


    const parsed =
      JSON.parse(saved);


    if (!Array.isArray(parsed)) {
      return [];
    }


    return [
      ...new Set(
        parsed
          .map(Number)
          .filter(Number.isFinite)
      )
    ].sort(
      (a, b) =>
        a - b
    );

  }

  catch {

    return [];
  }
}


function saveCompletedMission(id) {

  const completed =
    getCompletedMissions();


  const missionId =
    Number(id);


  if (
    !completed.includes(
      missionId
    )
  ) {

    completed.push(
      missionId
    );
  }


  completed.sort(
    (a, b) =>
      a - b
  );


  localStorage.setItem(
    getProgressKey(),
    JSON.stringify(completed)
  );
}


function isMissionCompleted(id) {

  return getCompletedMissions()
    .includes(
      Number(id)
    );
}


function isMissionUnlocked(id) {

  const missionId =
    Number(id);


  if (missionId === 1) {
    return true;
  }


  return isMissionCompleted(
    missionId - 1
  );
}


function allMissionsCompleted() {

  if (
    typeof missions === "undefined" ||
    !Array.isArray(missions)
  ) {
    return false;
  }


  const completed =
    getCompletedMissions();


  return missions.every(
    mission =>
      completed.includes(
        Number(mission.id)
      )
  );
}


// =========================================================
// LEVEL DEFINITIONS
// =========================================================

const levelDefinitions = [

  {
    level: 1,
    title: "Pattern Trap",
    description:
      "Temukan pola, uji konsistensi, dan jangan terkecoh oleh jawaban yang terlihat meyakinkan."
  },

  {
    level: 2,
    title: "Sequence Trap",
    description:
      "Periksa urutan, kelengkapan langkah, dan kemungkinan lebih dari satu prosedur yang valid."
  },

  {
    level: 3,
    title: "Logic Trap",
    description:
      "Uji kondisi, batas nilai, dan generalisasi menggunakan logika serta counterexample."
  },

  {
    level: 4,
    title: "Efficiency Trap",
    description:
      "Nilai solusi berdasarkan tujuan, batasan, dan kriteria efisiensi yang tepat."
  },

  {
    level: 5,
    title: "Verification Trap",
    description:
      "Bedakan keyakinan, bukti, kesimpulan, alasan, dan kecukupan informasi."
  }

];


// =========================================================
// MISSION MAP
// =========================================================

function renderMissionMap() {

  const container =
    document.getElementById(
      "missionMap"
    );


  if (!container) {
    return;
  }


  const completed =
    getCompletedMissions();


  let html = "";


  levelDefinitions.forEach(
    levelInfo => {

      const levelMissions =
        missions.filter(
          mission =>
            Number(mission.level) ===
            levelInfo.level
        );


      const levelCompleted =
        levelMissions.filter(
          mission =>
            completed.includes(
              Number(mission.id)
            )
        ).length;


      html += `

        <section class="level-section">

          <div class="level-header">

            <div>

              <span class="level-number">
                LEVEL ${String(levelInfo.level).padStart(2, "0")}
              </span>

              <h3 class="level-title">
                ${escapeHTML(levelInfo.title)}
              </h3>

              <p class="level-description">
                ${escapeHTML(levelInfo.description)}
              </p>

            </div>

            <div class="level-status">
              ${levelCompleted} / ${levelMissions.length} SELESAI
            </div>

          </div>

          <div class="mission-row">
      `;


      levelMissions.forEach(
        mission => {

          const done =
            completed.includes(
              Number(mission.id)
            );


          const unlocked =
            isMissionUnlocked(
              mission.id
            );


          let status =
            "TERKUNCI";


          let button =
            "🔒";


          if (done) {

            status =
              "SELESAI";

            button =
              "Ulangi";
          }

          else if (unlocked) {

            status =
              "TERSEDIA";

            button =
              "Mulai";
          }


          html += `

            <article
              class="
                mission-card
                ${done ? "completed" : ""}
                ${!unlocked ? "locked" : ""}
              "
            >

              <div class="mission-card-top">

                <span class="mission-code">
                  MISSION ${String(mission.id).padStart(2, "0")}
                </span>

                <span class="mission-state">
                  ${status}
                </span>

              </div>

              <h4>
                ${escapeHTML(mission.title)}
              </h4>

              <p>
                ${escapeHTML(mission.levelName)}
              </p>

              <div class="mission-card-footer">

                <span class="trap-mini">
                  ${escapeHTML(mission.trapType)}
                </span>

                <button
                  class="mission-action"
                  ${
                    unlocked
                      ? `onclick="startMission(${mission.id})"`
                      : "disabled"
                  }
                >
                  ${button}
                </button>

              </div>

            </article>
          `;

        }
      );


      html += `
          </div>
        </section>
      `;

    }
  );


  container.innerHTML =
    html;


  updateProgressDisplay();

  updatePosttestUnlockPanel();

  updateStudentInfo();
}


function updateProgressDisplay() {

  const completed =
    getCompletedMissions();


  const total =
    Array.isArray(missions)
      ? missions.length
      : 0;


  setText(
    "missionProgress",
    `${completed.length} / ${total}`
  );


  const fill =
    document.getElementById(
      "missionProgressFill"
    );


  if (fill) {

    fill.style.width =
      total
        ? `${Math.min((completed.length / total) * 100, 100)}%`
        : "0%";
  }
}


function updatePosttestUnlockPanel() {

  const panel =
    document.getElementById(
      "posttestUnlockPanel"
    );


  if (!panel) {
    return;
  }


  if (
    allMissionsCompleted() &&
    !hasCompletedPosttest()
  ) {

    panel.classList.remove(
      "hidden"
    );
  }

  else {

    panel.classList.add(
      "hidden"
    );
  }
}


// =========================================================
// MISSION ENGINE
// =========================================================

function startMission(id) {

  if (!hasCompletedPretest()) {

    alert(
      "Selesaikan Pretest terlebih dahulu."
    );

    return;
  }


  const mission =
    getMissionById(id);


  if (!mission) {

    alert(
      "Mission tidak ditemukan."
    );

    return;
  }


  if (!isMissionUnlocked(id)) {

    alert(
      "Selesaikan mission sebelumnya terlebih dahulu."
    );

    return;
  }


  currentMissionId =
    Number(id);


  currentStep = 0;


  answers =
    createEmptyMissionAnswers();


  scores =
    createEmptyMissionScores();


  renderMissionHeader();

  renderMissionStep();

  showScreen(
    "screenMission"
  );
}


function renderMissionHeader() {

  const mission =
    getMissionById(
      currentMissionId
    );


  if (!mission) {
    return;
  }


  setText(
    "missionLevel",
    `LEVEL ${mission.level} — ${mission.levelName}`
  );


  setText(
    "missionNumber",
    `MISSION ${String(mission.id).padStart(2, "0")}`
  );


  setText(
    "missionTrapType",
    mission.trapType
  );


  setText(
    "missionTitle",
    mission.title
  );


  setText(
    "missionStimulus",
    mission.stimulus
  );


  setText(
    "missionAIClaim",
    mission.aiClaim
  );


  setText(
    "missionConfidence",
    `AI Confidence: ${mission.confidence} • Simulasi`
  );
}


function updateStepIndicators() {

  const indicators =
    document.querySelectorAll(
      ".step-indicator"
    );


  indicators.forEach(
    (indicator, index) => {

      indicator.classList.remove(
        "active",
        "done"
      );


      if (index < currentStep) {
        indicator.classList.add("done");
      }


      if (index === currentStep) {
        indicator.classList.add("active");
      }

    }
  );
}


function radioChoice(
  name,
  options,
  selected
) {

  return options
    .map(option => {

      const checked =
        selected === option.value
          ? "checked"
          : "";


      return `

        <label class="choice-card">

          <input
            type="radio"
            name="${name}"
            value="${escapeHTML(option.value)}"
            ${checked}
          >

          <span>
            ${escapeHTML(option.text)}
          </span>

        </label>
      `;
    })
    .join("");
}


function checkboxChoice(
  name,
  options,
  selectedValues
) {

  return options
    .map(option => {

      const checked =
        selectedValues.includes(
          option.value
        )
          ? "checked"
          : "";


      return `

        <label class="choice-card">

          <input
            type="checkbox"
            name="${name}"
            value="${escapeHTML(option.value)}"
            ${checked}
          >

          <span>
            ${escapeHTML(option.text)}
          </span>

        </label>
      `;
    })
    .join("");
}


function renderMissionStep() {

  const mission =
    getMissionById(
      currentMissionId
    );


  const container =
    document.getElementById(
      "stepContent"
    );


  if (!mission || !container) {
    return;
  }


  updateStepIndicators();


  // CLAIM
  if (currentStep === 0) {

    container.innerHTML = `

      <div class="step-box">

        <span class="step-label">
          STEP 01 — CLAIM
        </span>

        <h3>
          Tentukan posisi awalmu
        </h3>

        <p>
          ${escapeHTML(mission.claim.question)}
        </p>

        <div class="choice-list">

          ${radioChoice(
            "claimAnswer",
            mission.claim.options,
            answers.claim
          )}

        </div>

        <div class="step-actions">

          <span></span>

          <button
            class="primary-btn"
            onclick="saveClaim()"
          >
            Lanjut ke CHECK →
          </button>

        </div>

      </div>
    `;

    return;
  }


  // CHECK
  if (currentStep === 1) {

    const options =
      mission.check.multiple
        ? checkboxChoice(
            "checkAnswer",
            mission.check.options,
            answers.check
          )
        : radioChoice(
            "checkAnswer",
            mission.check.options,
            answers.check[0] || null
          );


    container.innerHTML = `

      <div class="step-box">

        <span class="step-label">
          STEP 02 — CHECK
        </span>

        <h3>
          Periksa informasi penting
        </h3>

        <p>
          ${escapeHTML(mission.check.question)}
        </p>

        <div class="choice-list">
          ${options}
        </div>

        <div class="step-actions">

          <button
            class="secondary-btn"
            onclick="previousStep()"
          >
            ← Kembali
          </button>

          <button
            class="primary-btn"
            onclick="saveCheck()"
          >
            Lanjut ke TEST →
          </button>

        </div>

      </div>
    `;

    return;
  }


  // TEST
  if (currentStep === 2) {

    container.innerHTML = `

      <div class="step-box">

        <span class="step-label">
          STEP 03 — TEST
        </span>

        <h3>
          Uji klaim dengan bukti
        </h3>

        <p>
          ${escapeHTML(mission.test.question)}
        </p>

        <div class="choice-list">

          ${radioChoice(
            "testAnswer",
            mission.test.options,
            answers.test
          )}

        </div>

        <div class="step-actions">

          <button
            class="secondary-btn"
            onclick="previousStep()"
          >
            ← Kembali
          </button>

          <button
            class="primary-btn"
            onclick="saveTest()"
          >
            Lanjut ke CORRECT →
          </button>

        </div>

      </div>
    `;

    return;
  }


  // CORRECT
  if (currentStep === 3) {

    container.innerHTML = `

      <div class="step-box">

        <span class="step-label">
          STEP 04 — CORRECT
        </span>

        <h3>
          Perbaiki kesimpulan
        </h3>

        <p>
          ${escapeHTML(mission.correct.question)}
        </p>

        <div class="choice-list">

          ${radioChoice(
            "correctAnswer",
            mission.correct.options,
            answers.correct
          )}

        </div>

        <div class="step-actions">

          <button
            class="secondary-btn"
            onclick="previousStep()"
          >
            ← Kembali
          </button>

          <button
            class="primary-btn"
            onclick="saveCorrect()"
          >
            Lanjut ke JUSTIFY →
          </button>

        </div>

      </div>
    `;

    return;
  }


  // JUSTIFY
  if (currentStep === 4) {

    container.innerHTML = `

      <div class="step-box">

        <span class="step-label">
          STEP 05 — JUSTIFY
        </span>

        <h3>
          Pertahankan keputusanmu
        </h3>

        <p>
          ${escapeHTML(mission.justify.prompt)}
        </p>

        <textarea
          id="justifyAnswer"
          class="justify-input"
          rows="7"
          placeholder="Tuliskan alasan berdasarkan bukti dan hasil pengujian..."
        >${escapeHTML(answers.justify)}</textarea>

        <div class="step-actions">

          <button
            class="secondary-btn"
            onclick="previousStep()"
          >
            ← Kembali
          </button>

          <button
            class="primary-btn"
            onclick="submitMission()"
          >
            Selesaikan Investigasi
          </button>

        </div>

      </div>
    `;
  }
}


function saveClaim() {

  const selected =
    document.querySelector(
      'input[name="claimAnswer"]:checked'
    );


  if (!selected) {

    alert(
      "Pilih salah satu jawaban."
    );

    return;
  }


  answers.claim =
    selected.value;


  currentStep = 1;

  renderMissionStep();
}


function saveCheck() {

  const mission =
    getMissionById(
      currentMissionId
    );


  if (!mission) {
    return;
  }


  if (mission.check.multiple) {

    const selected =
      [
        ...document.querySelectorAll(
          'input[name="checkAnswer"]:checked'
        )
      ];


    if (!selected.length) {

      alert(
        "Pilih minimal satu informasi."
      );

      return;
    }


    answers.check =
      selected.map(
        input =>
          input.value
      );
  }

  else {

    const selected =
      document.querySelector(
        'input[name="checkAnswer"]:checked'
      );


    if (!selected) {

      alert(
        "Pilih salah satu jawaban."
      );

      return;
    }


    answers.check =
      [selected.value];
  }


  currentStep = 2;

  renderMissionStep();
}


function saveTest() {

  const selected =
    document.querySelector(
      'input[name="testAnswer"]:checked'
    );


  if (!selected) {

    alert(
      "Pilih hasil pengujian."
    );

    return;
  }


  answers.test =
    selected.value;


  currentStep = 3;

  renderMissionStep();
}


function saveCorrect() {

  const selected =
    document.querySelector(
      'input[name="correctAnswer"]:checked'
    );


  if (!selected) {

    alert(
      "Pilih kesimpulan atau koreksi."
    );

    return;
  }


  answers.correct =
    selected.value;


  currentStep = 4;

  renderMissionStep();
}


function previousStep() {

  if (currentStep <= 0) {
    return;
  }


  if (currentStep === 4) {

    const textarea =
      document.getElementById(
        "justifyAnswer"
      );


    if (textarea) {
      answers.justify =
        textarea.value;
    }
  }


  currentStep--;

  renderMissionStep();
}


// =========================================================
// MISSION GAMIFICATION SCORING
// =========================================================

function calculateMissionScores() {

  const mission =
    getMissionById(
      currentMissionId
    );


  scores =
    createEmptyMissionScores();


  scores.claim =
    answers.claim ===
    mission.claim.bestAnswer
      ? 10
      : 0;


  const expected =
    [...mission.check.correctAnswers]
      .sort();


  const selected =
    [...answers.check]
      .sort();


  const exact =
    expected.length ===
      selected.length &&
    expected.every(
      (value, index) =>
        value === selected[index]
    );


  scores.check =
    exact
      ? 20
      : calculatePartialCheckScore(
          expected,
          selected
        );


  scores.test =
    answers.test ===
    mission.test.correctAnswer
      ? 25
      : 0;


  scores.correct =
    answers.correct ===
    mission.correct.correctAnswer
      ? 20
      : 0;


  scores.justify =
    calculateGamificationJustify(
      answers.justify,
      mission.justify.keywords || []
    );


  return (
    scores.claim +
    scores.check +
    scores.test +
    scores.correct +
    scores.justify
  );
}


function calculatePartialCheckScore(
  expected,
  selected
) {

  if (
    !expected.length ||
    !selected.length
  ) {
    return 0;
  }


  const correctSelected =
    selected.filter(
      value =>
        expected.includes(value)
    ).length;


  const incorrectSelected =
    selected.filter(
      value =>
        !expected.includes(value)
    ).length;


  let ratio =
    (
      correctSelected -
      incorrectSelected
    ) /
    expected.length;


  ratio =
    Math.max(
      0,
      Math.min(1, ratio)
    );


  return Math.round(
    ratio * 20
  );
}


function calculateGamificationJustify(
  justification,
  keywords
) {

  const text =
    String(justification)
      .toLowerCase()
      .trim();


  if (text.length < 10) {
    return 0;
  }


  if (!keywords.length) {
    return 15;
  }


  const matches =
    keywords.filter(
      keyword =>
        text.includes(
          String(keyword)
            .toLowerCase()
        )
    ).length;


  const ratio =
    matches /
    keywords.length;


  if (ratio >= .8) {
    return 25;
  }

  if (ratio >= .5) {
    return 20;
  }

  if (ratio > 0) {
    return 10;
  }


  return 5;
}


function submitMission() {

  const textarea =
    document.getElementById(
      "justifyAnswer"
    );


  if (!textarea) {
    return;
  }


  const justification =
    textarea.value.trim();


  if (justification.length < 15) {

    alert(
      "Tuliskan alasan yang lebih lengkap berdasarkan bukti."
    );

    textarea.focus();

    return;
  }


  answers.justify =
    justification;


  const totalScore =
    calculateMissionScores();


  saveMissionAttempt(
    totalScore
  );


  saveCompletedMission(
    currentMissionId
  );


  renderMissionResult(
    totalScore
  );


  showScreen(
    "screenResult"
  );
}


function saveMissionAttempt(
  totalScore
) {

  const participant =
    getParticipant();


  const mission =
    getMissionById(
      currentMissionId
    );


  const attempt = {

    participantCode:
      participant.code,

    className:
      participant.className,

    missionId:
      currentMissionId,

    level:
      mission
        ? mission.level
        : null,

    answers:
      JSON.parse(
        JSON.stringify(answers)
      ),

    gamificationScores:
      JSON.parse(
        JSON.stringify(scores)
      ),

    gamificationTotal:
      totalScore,

    submittedAt:
      new Date().toISOString()

  };


  let attempts = [];


  try {

    const saved =
      localStorage.getItem(
        getMissionAttemptKey()
      );


    if (saved) {

      const parsed =
        JSON.parse(saved);


      if (Array.isArray(parsed)) {
        attempts = parsed;
      }
    }
  }

  catch {

    attempts = [];
  }


  attempts.push(
    attempt
  );


  localStorage.setItem(
    getMissionAttemptKey(),
    JSON.stringify(attempts)
  );
}


function renderMissionResult(
  totalScore
) {

  const mission =
    getMissionById(
      currentMissionId
    );


  if (!mission) {
    return;
  }


  setText(
    "resultMission",
    `MISSION ${String(mission.id).padStart(2, "0")}`
  );


  setText(
    "resultStatus",
    mission.result.status
  );


  setText(
    "resultScore",
    totalScore
  );


  setText(
    "scoreClaim",
    scores.claim
  );


  setText(
    "scoreCheck",
    scores.check
  );


  setText(
    "scoreTest",
    scores.test
  );


  setText(
    "scoreCorrect",
    scores.correct
  );


  setText(
    "scoreJustify",
    scores.justify
  );


  setText(
    "resultExplanation",
    mission.result.explanation
  );
}


function finishMission() {

  renderMissionMap();

  showScreen(
    "screenMap"
  );
}


function restartMission() {

  if (!currentMissionId) {
    return;
  }


  startMission(
    currentMissionId
  );
}


function backToMap() {

  renderMissionMap();

  showScreen(
    "screenMap"
  );
}


// =========================================================
// POSTTEST
// =========================================================

function openPosttestIntro() {

  if (!allMissionsCompleted()) {

    alert(
      "Selesaikan seluruh 15 mission terlebih dahulu."
    );

    return;
  }


  if (hasCompletedPosttest()) {

    continueAfterPosttest();

    return;
  }


  showScreen(
    "screenPosttestIntro"
  );
}


function startPosttest() {

  if (!allMissionsCompleted()) {

    alert(
      "Posttest belum terbuka."
    );

    return;
  }


  if (hasCompletedPosttest()) {

    continueAfterPosttest();

    return;
  }


  currentPosttestIndex = 0;

  posttestStartedAt =
    new Date().toISOString();


  posttestResponses =
    createEmptyAssessmentResponses(
      posttestQuestions
    );


  renderPosttestQuestion();

  showScreen(
    "screenPosttest"
  );
}


function renderPosttestQuestion() {

  const question =
    posttestQuestions[
      currentPosttestIndex
    ];


  const response =
    posttestResponses[
      currentPosttestIndex
    ];


  if (!question || !response) {
    return;
  }


  setText(
    "posttestCounter",
    `${currentPosttestIndex + 1} / ${posttestQuestions.length}`
  );


  setText(
    "posttestQuestionNumber",
    `QUESTION ${String(question.id).padStart(2, "0")}`
  );


  setText(
    "posttestIndicator",
    question.indicator
  );


  setText(
    "posttestQuestion",
    question.question
  );


  const stimulus =
    document.getElementById(
      "posttestStimulus"
    );


  if (stimulus) {

    stimulus.innerHTML =
      escapeHTML(
        question.stimulus
      ).replaceAll(
        "\n",
        "<br>"
      );
  }


  renderAssessmentOptions(
    "posttestAnswerOptions",
    "posttestAnswer",
    question.answers,
    response.answer
  );


  renderAssessmentOptions(
    "posttestReasonOptions",
    "posttestReason",
    question.reasons,
    response.reason
  );


  updatePosttestProgress();

  updatePosttestNavigation();
}


function saveCurrentPosttestAnswer() {

  const answer =
    document.querySelector(
      'input[name="posttestAnswer"]:checked'
    );


  const reason =
    document.querySelector(
      'input[name="posttestReason"]:checked'
    );


  if (!answer) {

    alert(
      "Pilih jawaban terlebih dahulu."
    );

    return false;
  }


  if (!reason) {

    alert(
      "Pilih alasan terlebih dahulu."
    );

    return false;
  }


  posttestResponses[
    currentPosttestIndex
  ].answer =
    answer.value;


  posttestResponses[
    currentPosttestIndex
  ].reason =
    reason.value;


  return true;
}


function savePosttestSelectionWithoutValidation() {

  const answer =
    document.querySelector(
      'input[name="posttestAnswer"]:checked'
    );


  const reason =
    document.querySelector(
      'input[name="posttestReason"]:checked'
    );


  if (answer) {

    posttestResponses[
      currentPosttestIndex
    ].answer =
      answer.value;
  }


  if (reason) {

    posttestResponses[
      currentPosttestIndex
    ].reason =
      reason.value;
  }
}


function nextPosttestQuestion() {

  if (!saveCurrentPosttestAnswer()) {
    return;
  }


  if (
    currentPosttestIndex <
    posttestQuestions.length - 1
  ) {

    currentPosttestIndex++;

    renderPosttestQuestion();

    return;
  }


  renderPosttestConfirmation();

  showScreen(
    "screenPosttestConfirm"
  );
}


function previousPosttestQuestion() {

  savePosttestSelectionWithoutValidation();


  if (currentPosttestIndex > 0) {

    currentPosttestIndex--;

    renderPosttestQuestion();
  }
}


function updatePosttestProgress() {

  const percentage =
    Math.round(
      (
        (
          currentPosttestIndex + 1
        ) /
        posttestQuestions.length
      ) * 100
    );


  setText(
    "posttestProgressText",
    `${percentage}%`
  );


  const fill =
    document.getElementById(
      "posttestProgressFill"
    );


  if (fill) {

    fill.style.width =
      `${percentage}%`;
  }
}


function updatePosttestNavigation() {

  const previous =
    document.getElementById(
      "posttestPreviousButton"
    );


  const next =
    document.getElementById(
      "posttestNextButton"
    );


  if (previous) {

    previous.style.visibility =
      currentPosttestIndex === 0
        ? "hidden"
        : "visible";
  }


  if (next) {

    next.innerHTML =
      currentPosttestIndex ===
      posttestQuestions.length - 1
        ? "Periksa Posttest →"
        : "Soal Berikutnya →";
  }
}


function renderPosttestConfirmation() {

  const completed =
    posttestResponses.filter(
      item =>
        item.answer &&
        item.reason
    ).length;


  const missing =
    posttestResponses
      .filter(
        item =>
          !item.answer ||
          !item.reason
      )
      .map(
        item =>
          item.id
      );


  setText(
    "posttestAnsweredSummary",
    `${completed} / ${posttestQuestions.length}`
  );


  setText(
    "posttestCompletionStatus",
    missing.length
      ? "BELUM LENGKAP"
      : "LENGKAP"
  );


  const box =
    document.getElementById(
      "posttestMissingBox"
    );


  if (box) {

    box.textContent =
      missing.length
        ? `Belum lengkap pada soal: ${missing.join(", ")}.`
        : "";
  }


  const button =
    document.getElementById(
      "submitPosttestButton"
    );


  if (button) {

    button.disabled =
      missing.length > 0;


    button.style.opacity =
      missing.length
        ? ".45"
        : "1";
  }
}


function returnToPosttest() {

  const missingIndex =
    posttestResponses.findIndex(
      item =>
        !item.answer ||
        !item.reason
    );


  currentPosttestIndex =
    missingIndex >= 0
      ? missingIndex
      : posttestQuestions.length - 1;


  renderPosttestQuestion();

  showScreen(
    "screenPosttest"
  );
}


function getStoredPretestResult() {

  try {

    const saved =
      localStorage.getItem(
        getPretestKey()
      );


    return saved
      ? JSON.parse(saved)
      : null;

  }

  catch {

    return null;
  }
}


function createPrePostComparison(
  pretest,
  posttest
) {

  if (!pretest) {
    return null;
  }


  const pre =
    Number(
      pretest.score100
    );


  const post =
    Number(
      posttest.score100
    );


  const gain =
    post - pre;


  let normalizedGain = null;


  if (
    Number.isFinite(pre) &&
    Number.isFinite(post) &&
    pre < 100
  ) {

    normalizedGain =
      Number(
        (
          (
            post - pre
          ) /
          (
            100 - pre
          )
        ).toFixed(3)
      );
  }


  const indicatorComparison = {};


  Object.keys(
    posttest.indicators
  ).forEach(indicator => {

    const preIndicator =
      pretest.indicators &&
      pretest.indicators[indicator]
        ? Number(
            pretest.indicators[
              indicator
            ].score100
          )
        : null;


    const postIndicator =
      Number(
        posttest.indicators[
          indicator
        ].score100
      );


    indicatorComparison[
      indicator
    ] = {

      pretest:
        preIndicator,

      posttest:
        postIndicator,

      gain:
        preIndicator !== null
          ? postIndicator -
            preIndicator
          : null

    };
  });


  return {

    pretestScore100:
      pre,

    posttestScore100:
      post,

    gainScore:
      gain,

    normalizedGain:
      normalizedGain,

    indicators:
      indicatorComparison

  };
}


function submitPosttest() {

  const incomplete =
    posttestResponses.some(
      item =>
        !item.answer ||
        !item.reason
    );


  if (incomplete) {

    alert(
      "Masih ada soal yang belum lengkap."
    );

    return;
  }


  const participant =
    getParticipant();


  const result =
    calculateAssessmentResult(
      posttestQuestions,
      posttestResponses
    );


  const pretest =
    getStoredPretestResult();


  const record = {

    completed: true,

    participantCode:
      participant.code,

    className:
      participant.className,

    assessment:
      "POSTTEST_CT",

    startedAt:
      posttestStartedAt,

    submittedAt:
      new Date().toISOString(),

    responses:
      posttestResponses,

    rawScore:
      result.rawScore,

    maxScore:
      result.maxScore,

    score100:
      result.score100,

    indicators:
      result.indicators,

    itemResults:
      result.itemResults,

    comparison:
      createPrePostComparison(
        pretest,
        result
      )

  };


  localStorage.setItem(
    getPosttestKey(),
    JSON.stringify(record)
  );


  showScreen(
    "screenPosttestCompleted"
  );
}


function continueAfterPosttest() {

  if (!hasCompletedPosttest()) {

    alert(
      "Selesaikan Posttest terlebih dahulu."
    );

    return;
  }


  if (hasCompletedCAL()) {

    continueAfterCAL();

    return;
  }


  showScreen(
    "screenCALIntro"
  );
}


// =========================================================
// CRITICAL AI LITERACY
// =========================================================

function startCAL() {

  if (!hasCompletedPosttest()) {

    alert(
      "Selesaikan Posttest terlebih dahulu."
    );

    return;
  }


  if (hasCompletedCAL()) {

    continueAfterCAL();

    return;
  }


  currentCALIndex = 0;

  calStartedAt =
    new Date().toISOString();


  calResponses =
    createEmptyAssessmentResponses(
      calQuestions
    );


  renderCALQuestion();

  showScreen(
    "screenCAL"
  );
}


function renderCALQuestion() {

  const question =
    calQuestions[
      currentCALIndex
    ];


  const response =
    calResponses[
      currentCALIndex
    ];


  if (!question || !response) {
    return;
  }


  setText(
    "calCounter",
    `${currentCALIndex + 1} / ${calQuestions.length}`
  );


  setText(
    "calQuestionNumber",
    `CASE ${String(question.id).padStart(2, "0")}`
  );


  setText(
    "calIndicator",
    question.indicator
  );


  setText(
    "calQuestion",
    question.question
  );


  const stimulus =
    document.getElementById(
      "calStimulus"
    );


  if (stimulus) {

    stimulus.innerHTML =
      escapeHTML(
        question.stimulus
      ).replaceAll(
        "\n",
        "<br>"
      );
  }


  renderAssessmentOptions(
    "calAnswerOptions",
    "calAnswer",
    question.answers,
    response.answer
  );


  renderAssessmentOptions(
    "calReasonOptions",
    "calReason",
    question.reasons,
    response.reason
  );


  updateCALProgress();

  updateCALNavigation();
}


function saveCurrentCALAnswer() {

  const answer =
    document.querySelector(
      'input[name="calAnswer"]:checked'
    );


  const reason =
    document.querySelector(
      'input[name="calReason"]:checked'
    );


  if (!answer) {

    alert(
      "Pilih keputusan terlebih dahulu."
    );

    return false;
  }


  if (!reason) {

    alert(
      "Pilih alasan terlebih dahulu."
    );

    return false;
  }


  calResponses[
    currentCALIndex
  ].answer =
    answer.value;


  calResponses[
    currentCALIndex
  ].reason =
    reason.value;


  return true;
}


function saveCALSelectionWithoutValidation() {

  const answer =
    document.querySelector(
      'input[name="calAnswer"]:checked'
    );


  const reason =
    document.querySelector(
      'input[name="calReason"]:checked'
    );


  if (answer) {

    calResponses[
      currentCALIndex
    ].answer =
      answer.value;
  }


  if (reason) {

    calResponses[
      currentCALIndex
    ].reason =
      reason.value;
  }
}


function nextCALQuestion() {

  if (!saveCurrentCALAnswer()) {
    return;
  }


  if (
    currentCALIndex <
    calQuestions.length - 1
  ) {

    currentCALIndex++;

    renderCALQuestion();

    return;
  }


  renderCALConfirmation();

  showScreen(
    "screenCALConfirm"
  );
}


function previousCALQuestion() {

  saveCALSelectionWithoutValidation();


  if (currentCALIndex > 0) {

    currentCALIndex--;

    renderCALQuestion();
  }
}


function updateCALProgress() {

  const percentage =
    Math.round(
      (
        (
          currentCALIndex + 1
        ) /
        calQuestions.length
      ) * 100
    );


  setText(
    "calProgressText",
    `${percentage}%`
  );


  const fill =
    document.getElementById(
      "calProgressFill"
    );


  if (fill) {

    fill.style.width =
      `${percentage}%`;
  }
}


function updateCALNavigation() {

  const previous =
    document.getElementById(
      "calPreviousButton"
    );


  const next =
    document.getElementById(
      "calNextButton"
    );


  if (previous) {

    previous.style.visibility =
      currentCALIndex === 0
        ? "hidden"
        : "visible";
  }


  if (next) {

    next.innerHTML =
      currentCALIndex ===
      calQuestions.length - 1
        ? "Periksa Verification Check →"
        : "Kasus Berikutnya →";
  }
}


function renderCALConfirmation() {

  const completed =
    calResponses.filter(
      item =>
        item.answer &&
        item.reason
    ).length;


  const missing =
    calResponses
      .filter(
        item =>
          !item.answer ||
          !item.reason
      )
      .map(
        item =>
          item.id
      );


  setText(
    "calAnsweredSummary",
    `${completed} / ${calQuestions.length}`
  );


  setText(
    "calCompletionStatus",
    missing.length
      ? "BELUM LENGKAP"
      : "LENGKAP"
  );


  const box =
    document.getElementById(
      "calMissingBox"
    );


  if (box) {

    box.textContent =
      missing.length
        ? `Belum lengkap pada kasus: ${missing.join(", ")}.`
        : "";
  }


  const button =
    document.getElementById(
      "submitCALButton"
    );


  if (button) {

    button.disabled =
      missing.length > 0;


    button.style.opacity =
      missing.length
        ? ".45"
        : "1";
  }
}


function returnToCAL() {

  const missingIndex =
    calResponses.findIndex(
      item =>
        !item.answer ||
        !item.reason
    );


  currentCALIndex =
    missingIndex >= 0
      ? missingIndex
      : calQuestions.length - 1;


  renderCALQuestion();

  showScreen(
    "screenCAL"
  );
}


function submitCAL() {

  const incomplete =
    calResponses.some(
      item =>
        !item.answer ||
        !item.reason
    );


  if (incomplete) {

    alert(
      "Masih ada kasus yang belum lengkap."
    );

    return;
  }


  const participant =
    getParticipant();


  const result =
    calculateAssessmentResult(
      calQuestions,
      calResponses
    );


  const record = {

    completed: true,

    participantCode:
      participant.code,

    className:
      participant.className,

    assessment:
      "CRITICAL_AI_LITERACY",

    startedAt:
      calStartedAt,

    submittedAt:
      new Date().toISOString(),

    responses:
      calResponses,

    rawScore:
      result.rawScore,

    maxScore:
      result.maxScore,

    score100:
      result.score100,

    indicators:
      result.indicators,

    itemResults:
      result.itemResults

  };


  localStorage.setItem(
    getCALKey(),
    JSON.stringify(record)
  );


  showScreen(
    "screenCALCompleted"
  );
}


// =========================================================
// CAL → STUDENT RESPONSE
// =========================================================

function continueAfterCAL() {

  if (!hasCompletedCAL()) {

    alert(
      "Critical AI Literacy belum selesai."
    );

    return;
  }


  if (hasCompletedStudentResponse()) {

    showFinalComplete();

    return;
  }


  showScreen(
    "screenResponseIntro"
  );
}


// =========================================================
// STUDENT RESPONSE
// =========================================================

function startStudentResponse() {

  if (!hasCompletedCAL()) {

    alert(
      "Selesaikan Critical AI Literacy terlebih dahulu."
    );

    return;
  }


  if (hasCompletedStudentResponse()) {

    showFinalComplete();

    return;
  }


  currentResponseIndex = 0;

  responseStartedAt =
    new Date().toISOString();


  studentResponses =
    createEmptyStudentResponses();


  reflectionHelpful = "";
  reflectionImprovement = "";


  renderStudentResponse();

  showScreen(
    "screenResponse"
  );
}


// =========================================================
// RENDER RESPONSE ITEM
// =========================================================

function renderStudentResponse() {

  const statement =
    responseStatements[
      currentResponseIndex
    ];


  const response =
    studentResponses[
      currentResponseIndex
    ];


  if (!statement || !response) {
    return;
  }


  setText(
    "responseCounter",
    `${currentResponseIndex + 1} / ${responseStatements.length}`
  );


  setText(
    "responseQuestionNumber",
    `STATEMENT ${String(statement.id).padStart(2, "0")}`
  );


  setText(
    "responseStatement",
    statement.text
  );


  renderStudentResponseOptions(
    response.value
  );


  updateStudentResponseProgress();

  updateStudentResponseNavigation();
}


// =========================================================
// RESPONSE OPTIONS
// =========================================================

function renderStudentResponseOptions(
  selectedValue
) {

  const container =
    document.getElementById(
      "responseOptions"
    );


  if (!container) {
    return;
  }


  const options = [

    {
      value: 1,
      label: "Sangat Tidak Setuju"
    },

    {
      value: 2,
      label: "Tidak Setuju"
    },

    {
      value: 3,
      label: "Setuju"
    },

    {
      value: 4,
      label: "Sangat Setuju"
    }

  ];


  container.innerHTML =
    options
      .map(option => {

        const checked =
          Number(selectedValue) ===
          Number(option.value)
            ? "checked"
            : "";


        return `

          <label class="response-option-card">

            <input
              type="radio"
              name="studentResponse"
              value="${option.value}"
              ${checked}
            >

            <strong>
              ${option.value}
            </strong>

            <span>
              ${escapeHTML(option.label)}
            </span>

          </label>
        `;
      })
      .join("");
}


// =========================================================
// SAVE CURRENT RESPONSE
// =========================================================

function saveCurrentStudentResponse() {

  const selected =
    document.querySelector(
      'input[name="studentResponse"]:checked'
    );


  if (!selected) {

    alert(
      "Pilih salah satu respons terlebih dahulu."
    );

    return false;
  }


  studentResponses[
    currentResponseIndex
  ].value =
    Number(selected.value);


  return true;
}


function saveStudentResponseWithoutValidation() {

  const selected =
    document.querySelector(
      'input[name="studentResponse"]:checked'
    );


  if (selected) {

    studentResponses[
      currentResponseIndex
    ].value =
      Number(selected.value);
  }
}


// =========================================================
// RESPONSE NAVIGATION
// =========================================================

function nextStudentResponse() {

  if (!saveCurrentStudentResponse()) {
    return;
  }


  if (
    currentResponseIndex <
    responseStatements.length - 1
  ) {

    currentResponseIndex++;

    renderStudentResponse();

    return;
  }


  loadReflectionValues();

  showScreen(
    "screenReflection"
  );
}


function previousStudentResponse() {

  saveStudentResponseWithoutValidation();


  if (currentResponseIndex > 0) {

    currentResponseIndex--;

    renderStudentResponse();
  }
}


// =========================================================
// RESPONSE PROGRESS
// =========================================================

function updateStudentResponseProgress() {

  const percentage =
    Math.round(
      (
        (
          currentResponseIndex + 1
        ) /
        responseStatements.length
      ) * 100
    );


  setText(
    "responseProgressText",
    `${percentage}%`
  );


  const fill =
    document.getElementById(
      "responseProgressFill"
    );


  if (fill) {

    fill.style.width =
      `${percentage}%`;
  }
}


function updateStudentResponseNavigation() {

  const previous =
    document.getElementById(
      "responsePreviousButton"
    );


  const next =
    document.getElementById(
      "responseNextButton"
    );


  if (previous) {

    previous.style.visibility =
      currentResponseIndex === 0
        ? "hidden"
        : "visible";
  }


  if (next) {

    next.innerHTML =
      currentResponseIndex ===
      responseStatements.length - 1
        ? "Lanjut ke Refleksi →"
        : "Pernyataan Berikutnya →";
  }
}


// =========================================================
// REFLECTION
// =========================================================

function loadReflectionValues() {

  const helpful =
    document.getElementById(
      "reflectionHelpful"
    );


  const improvement =
    document.getElementById(
      "reflectionImprovement"
    );


  if (helpful) {
    helpful.value =
      reflectionHelpful;
  }


  if (improvement) {
    improvement.value =
      reflectionImprovement;
  }
}


function saveReflectionValues() {

  const helpful =
    document.getElementById(
      "reflectionHelpful"
    );


  const improvement =
    document.getElementById(
      "reflectionImprovement"
    );


  if (helpful) {

    reflectionHelpful =
      helpful.value.trim();
  }


  if (improvement) {

    reflectionImprovement =
      improvement.value.trim();
  }
}


function backToLastStudentResponse() {

  saveReflectionValues();


  currentResponseIndex =
    responseStatements.length - 1;


  renderStudentResponse();

  showScreen(
    "screenResponse"
  );
}


// =========================================================
// REVIEW RESPONSE
// =========================================================

function reviewStudentResponse() {

  saveReflectionValues();


  if (
    reflectionHelpful.length < 5
  ) {

    alert(
      "Tuliskan jawaban singkat untuk refleksi pertama."
    );


    const textarea =
      document.getElementById(
        "reflectionHelpful"
      );


    if (textarea) {
      textarea.focus();
    }


    return;
  }


  if (
    reflectionImprovement.length < 5
  ) {

    alert(
      "Tuliskan jawaban singkat untuk refleksi kedua."
    );


    const textarea =
      document.getElementById(
        "reflectionImprovement"
      );


    if (textarea) {
      textarea.focus();
    }


    return;
  }


  renderStudentResponseConfirmation();


  showScreen(
    "screenResponseConfirm"
  );
}


// =========================================================
// RESPONSE CONFIRMATION
// =========================================================

function renderStudentResponseConfirmation() {

  const answered =
    studentResponses.filter(
      item =>
        Number.isInteger(
          item.value
        )
    ).length;


  const missing =
    studentResponses
      .filter(
        item =>
          !Number.isInteger(
            item.value
          )
      )
      .map(
        item =>
          item.id
      );


  setText(
    "responseAnsweredSummary",
    `${answered} / ${responseStatements.length}`
  );


  setText(
    "responseCompletionStatus",
    missing.length
      ? "BELUM LENGKAP"
      : "LENGKAP"
  );


  const box =
    document.getElementById(
      "responseMissingBox"
    );


  if (box) {

    box.textContent =
      missing.length
        ? `Belum dijawab pada pernyataan: ${missing.join(", ")}.`
        : "";
  }


  setText(
    "reflectionHelpfulStatus",
    reflectionHelpful.length >= 5
      ? "Sudah diisi"
      : "Belum diisi"
  );


  setText(
    "reflectionImprovementStatus",
    reflectionImprovement.length >= 5
      ? "Sudah diisi"
      : "Belum diisi"
  );


  const submitButton =
    document.getElementById(
      "submitResponseButton"
    );


  const complete =
    missing.length === 0 &&
    reflectionHelpful.length >= 5 &&
    reflectionImprovement.length >= 5;


  if (submitButton) {

    submitButton.disabled =
      !complete;


    submitButton.style.opacity =
      complete
        ? "1"
        : ".45";
  }
}


// =========================================================
// RETURN TO RESPONSE
// =========================================================

function returnToStudentResponse() {

  const missingIndex =
    studentResponses.findIndex(
      item =>
        !Number.isInteger(
          item.value
        )
    );


  if (missingIndex >= 0) {

    currentResponseIndex =
      missingIndex;


    renderStudentResponse();


    showScreen(
      "screenResponse"
    );

    return;
  }


  loadReflectionValues();


  showScreen(
    "screenReflection"
  );
}


// =========================================================
// RESPONSE ANALYSIS
// =========================================================

function calculateStudentResponseResult() {

  const values =
    studentResponses
      .map(
        item =>
          Number(item.value)
      )
      .filter(
        value =>
          Number.isFinite(value)
      );


  const total =
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    );


  const maxScore =
    responseStatements.length * 4;


  const average =
    values.length
      ? Number(
          (
            total /
            values.length
          ).toFixed(2)
        )
      : 0;


  const percentage =
    maxScore
      ? Number(
          (
            (
              total /
              maxScore
            ) * 100
          ).toFixed(2)
        )
      : 0;


  return {

    total,
    maxScore,
    average,
    percentage

  };
}


// =========================================================
// SUBMIT STUDENT RESPONSE
// =========================================================

function submitStudentResponse() {

  if (!hasCompletedCAL()) {

    alert(
      "Critical AI Literacy belum selesai."
    );

    return;
  }


  if (hasCompletedStudentResponse()) {

    showFinalComplete();

    return;
  }


  const missing =
    studentResponses.some(
      item =>
        !Number.isInteger(
          item.value
        )
    );


  if (missing) {

    alert(
      "Masih ada pernyataan yang belum dijawab."
    );

    return;
  }


  if (
    reflectionHelpful.length < 5 ||
    reflectionImprovement.length < 5
  ) {

    alert(
      "Lengkapi kedua pertanyaan refleksi terlebih dahulu."
    );

    return;
  }


  const participant =
    getParticipant();


  const result =
    calculateStudentResponseResult();


  const record = {

    completed: true,

    participantCode:
      participant.code,

    className:
      participant.className,

    assessment:
      "STUDENT_RESPONSE",

    startedAt:
      responseStartedAt,

    submittedAt:
      new Date().toISOString(),

    scale:
      {
        minimum: 1,
        maximum: 4,
        labels: {
          1: "Sangat Tidak Setuju",
          2: "Tidak Setuju",
          3: "Setuju",
          4: "Sangat Setuju"
        }
      },

    responses:
      studentResponses.map(
        item => {

          const statement =
            responseStatements.find(
              data =>
                data.id === item.id
            );


          return {

            id:
              item.id,

            statement:
              statement
                ? statement.text
                : "",

            value:
              item.value

          };
        }
      ),

    reflection:
      {

        mostHelpful:
          reflectionHelpful,

        improvement:
          reflectionImprovement

      },

    summary:
      result

  };


  localStorage.setItem(
    getResponseKey(),
    JSON.stringify(record)
  );


  showFinalComplete();
}


// =========================================================
// FINAL COMPLETE
// =========================================================

function showFinalComplete() {

  const participant =
    getParticipant();


  setText(
    "finalParticipantCode",
    participant.code
  );


  setText(
    "finalParticipantClass",
    participant.className
  );


  showScreen(
    "screenFinalComplete"
  );
}


// =========================================================
// RESTORE PARTICIPANT
// =========================================================

function restoreParticipantForm() {

  const participant =
    getParticipant();


  const code =
    document.getElementById(
      "studentCode"
    );


  const className =
    document.getElementById(
      "studentClass"
    );


  if (
    code &&
    participant.code
  ) {

    code.value =
      participant.code;
  }


  if (
    className &&
    participant.className
  ) {

    className.value =
      participant.className;
  }


  updateStudentInfo();
}


// =========================================================
// SYSTEM VALIDATION
// =========================================================

function validateSystem() {

  let valid = true;


  if (
    typeof missions === "undefined"
  ) {

    console.error(
      "AI TRAP LAB ERROR: missions.js tidak berhasil dimuat."
    );

    valid = false;
  }

  else if (
    !Array.isArray(missions)
  ) {

    console.error(
      "AI TRAP LAB ERROR: missions bukan array."
    );

    valid = false;
  }

  else {

    console.log(
      `AI TRAP LAB: ${missions.length} missions loaded.`
    );


    if (missions.length !== 15) {

      console.warn(
        `PERINGATAN: Seharusnya terdapat 15 mission, tetapi ditemukan ${missions.length}.`
      );
    }
  }


  console.log(
    `Pretest CT: ${pretestQuestions.length} items.`
  );


  console.log(
    `Posttest CT: ${posttestQuestions.length} items.`
  );


  console.log(
    `Critical AI Literacy: ${calQuestions.length} cases.`
  );


  console.log(
    `Student Response: ${responseStatements.length} statements.`
  );


  return valid;
}


// =========================================================
// DEVELOPMENT STATUS
// =========================================================

function printParticipantStatus() {

  const participant =
    getParticipant();


  if (!participant.code) {
    return;
  }


  console.log(
    "AI TRAP LAB PARTICIPANT STATUS"
  );


  console.log(
    "Participant:",
    participant.code
  );


  console.log(
    "Class:",
    participant.className
  );


  console.log(
    "Pretest:",
    hasCompletedPretest()
  );


  console.log(
    "Missions:",
    `${getCompletedMissions().length}/15`
  );


  console.log(
    "Posttest:",
    hasCompletedPosttest()
  );


  console.log(
    "CAL:",
    hasCompletedCAL()
  );


  console.log(
    "Student Response:",
    hasCompletedStudentResponse()
  );
}


// =========================================================
// INITIALIZATION
// =========================================================

window.addEventListener(
  "DOMContentLoaded",
  function() {

    validateSystem();


    restoreParticipantForm();


    pretestResponses =
      createEmptyAssessmentResponses(
        pretestQuestions
      );


    posttestResponses =
      createEmptyAssessmentResponses(
        posttestQuestions
      );


    calResponses =
      createEmptyAssessmentResponses(
        calQuestions
      );


    studentResponses =
      createEmptyStudentResponses();


    printParticipantStatus();


    showScreen(
      "screenLanding"
    );

  }
);