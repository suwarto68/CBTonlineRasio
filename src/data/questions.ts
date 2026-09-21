import { Question } from '../types';

export const EXAM_QUESTIONS: Question[] = [
  // ==========================================
  // INDIKATOR 3.1: Konsep Rasio & Selisih
  // ==========================================
  {
    id: 1,
    indicator: '3.1',
    indicatorTitle: 'Menjelaskan konsep rasio dan membedakannya dengan selisih',
    cognitiveLevel: 'pemahaman', // 1/2 Pemahaman
    type: 'pg', // PG 1/8
    stimulusTitle: 'Aktivitas Ekstrakurikuler di SMP Negeri 1 Wanaraya',
    stimulusText: `Pada awal semester ganjil tahun ajaran 2026/2027, SMP Negeri 1 Wanaraya mengadakan pendataan minat ekstrakurikuler sains dan robotik untuk siswa Fase D kelas 7. Dari hasil pendataan kelas 7A dan 7B, tercatat ada 24 siswa laki-laki dan 36 siswa perempuan yang mendaftar. Pembina ekstrakurikuler ingin menganalisis komposisi peserta untuk pengelompokan tim praktikum. Beberapa siswa masih sering keliru memahami perbedaan antara membandingkan jumlah peserta dengan cara rasio (perbandingan dua besaran) dan cara selisih (pengurangan dua besaran).`,
    stimulusGraphicType: 'table',
    stimulusData: {
      headers: ['Kelompok', 'Jumlah Peserta (Orang)', 'Keterangan'],
      rows: [
        ['Siswa Laki-laki', '24', 'Terdaftar aktif'],
        ['Siswa Perempuan', '36', 'Terdaftar aktif'],
        ['Total Peserta', '60', 'Sains & Robotik']
      ]
    },
    questionText: 'Berdasarkan data tersebut, bentuk rasio paling sederhana antara jumlah siswa laki-laki terhadap siswa perempuan, serta selisih jumlah antara kedua kelompok tersebut berturut-turut adalah...',
    options: [
      { id: 'A', text: '2 : 3 dan 12 orang' },
      { id: 'B', text: '3 : 2 dan 12 orang' },
      { id: 'C', text: '2 : 5 dan 10 orang' },
      { id: 'D', text: '4 : 6 dan 15 orang' }
    ],
    correctOption: 'A',
    explanation: 'Rasio laki-laki terhadap perempuan = 24 : 36 = (24÷12) : (36÷12) = 2 : 3. Sedangkan selisihnya dihitung melalui operasi pengurangan besaran: 36 - 24 = 12 orang. Jadi jawabannya adalah 2 : 3 dan 12 orang.'
  },
  {
    id: 2,
    indicator: '3.1',
    indicatorTitle: 'Menjelaskan konsep rasio dan membedakannya dengan selisih',
    cognitiveLevel: 'aplikasi', // 1/10 Aplikasi
    type: 'pg', // PG 2/8
    stimulusTitle: 'Pembersihan Lingkungan & Gerakan Literasi Hijau',
    stimulusText: `Dalam rangka program Adiwiyata di SMPN 1 Wanaraya, OSIS membagikan bibit tanaman perdu dan pohon peneduh kepada perwakilan kelas 7A dan 7B. Rasio banyaknya bibit tanaman perdu terhadap tanaman peneduh yang diserahkan ke panitia adalah 5 : 3. Jika total seluruh bibit tanaman yang dibagikan adalah 64 batang pohon, panitia ingin mengetahui seberapa jauh perbedaan jumlah fisik antara kedua jenis tanaman tersebut untuk ditata di koridor sekolah.`,
    stimulusGraphicType: 'infographic',
    stimulusData: {
      tag: 'Data Pembagian Bibit Adiwiyata',
      ratio: 'Perdu : Peneduh = 5 : 3',
      total: '64 batang bibit tanaman'
    },
    questionText: 'Berapakah selisih jumlah bibit tanaman perdu dengan bibit tanaman peneduh yang diterima oleh panitia?',
    options: [
      { id: 'A', text: '8 batang' },
      { id: 'B', text: '16 batang' },
      { id: 'C', text: '24 batang' },
      { id: 'D', text: '40 batang' }
    ],
    correctOption: 'B',
    explanation: 'Jumlah bagian rasio = 5 + 3 = 8 bagian. Nilai 1 bagian = 64 ÷ 8 = 8 batang. Tanaman perdu = 5 × 8 = 40 batang. Tanaman peneduh = 3 × 8 = 24 batang. Selisih = 40 - 24 = 16 batang (atau langsung (5 - 3) × 8 = 2 × 8 = 16 batang).'
  },
  {
    id: 3,
    indicator: '3.1',
    indicatorTitle: 'Menjelaskan konsep rasio dan membedakannya dengan selisih',
    cognitiveLevel: 'penalaran', // 1/8 Penalaran
    type: 'pg_kompleks', // PGK 1/8
    stimulusTitle: 'Analisis Komposisi Sampel Sampah Organik dan Anorganik',
    stimulusText: `Kader Lingkungan Hidup SMP Negeri 1 Wanaraya melakukan survei audit timbunan sampah harian di kantin sekolah. Dari pengukuran selama 3 hari berturut-turut, perbandingan massa sampah organik terhadap anorganik adalah 7 : 4. Petugas kebersihan mencatat bahwa selisih berat antara sampah organik dan anorganik yang terkumpul pada hari pertama adalah 15 kg. Para kader kemudian mengkaji berbagai pernyataan matematis mengenai volume, proporsi, dan estimasi berat total sampah untuk menyusun laporan bank sampah sekolah.`,
    stimulusGraphicType: 'chart',
    stimulusData: {
      type: 'bar',
      label: 'Rasio Massa Sampah (Organik : Anorganik = 7 : 4)',
      difference: 'Selisih Massa = 15 kg'
    },
    questionText: 'Manakah pernyataan-pernyataan berikut yang BENAR terkait data sampah di atas? (Pilihlah semua pernyataan yang benar)',
    complexOptions: [
      { id: 'opt1', text: 'Berat 1 satuan bagian perbandingan tersebut setara dengan 5 kg.', isCorrect: true },
      { id: 'opt2', text: 'Total massa gabungan sampah organik dan anorganik yang terkumpul adalah 55 kg.', isCorrect: true },
      { id: 'opt3', text: 'Massa sampah organik yang terkumpul adalah 28 kg.', isCorrect: false },
      { id: 'opt4', text: 'Massa sampah anorganik yang terkumpul pada hari itu adalah 20 kg.', isCorrect: true }
    ],
    explanation: 'Selisih perbandingan = 7 - 4 = 3 bagian. Jika 3 bagian = 15 kg, maka 1 bagian = 15 ÷ 3 = 5 kg (Pernyataan 1 Benar). Total massa = (7 + 4) × 5 kg = 11 × 5 = 55 kg (Pernyataan 2 Benar). Massa organik = 7 × 5 = 35 kg (Pernyataan 3 Salah karena tertulis 28 kg). Massa anorganik = 4 × 5 = 20 kg (Pernyataan 4 Benar).'
  },
  {
    id: 4,
    indicator: '3.1',
    indicatorTitle: 'Menjelaskan konsep rasio dan membedakannya dengan selisih',
    cognitiveLevel: 'aplikasi', // 2/10 Aplikasi
    type: 'benar_salah', // BS 1/4
    stimulusTitle: 'Perbandingan Tabungan Koperasi Siswa Mandiri',
    stimulusText: `Dua orang siswa kelas 7B, Bayu dan Gilang, rajin menabung uang saku mereka di Koperasi Siswa SMP Negeri 1 Wanaraya setiap hari Jumat. Dalam pembukuan bendahara koperasi pada akhir bulan Agustus 2026, tercatat rasio tabungan Bayu terhadap tabungan Gilang adalah 4 : 5. Jumlah tabungan Gilang tercatat sebesar Rp125.000,00. Wali kelas ingin memvalidasi catatan keuangan kedua siswa tersebut agar tidak terjadi kesalahan pencatatan transaksi tabungan.`,
    stimulusGraphicType: 'table',
    stimulusData: {
      headers: ['Nama Siswa', 'Rasio Bagian', 'Nominal Tabungan'],
      rows: [
        ['Bayu', '4', 'Belum diverifikasi'],
        ['Gilang', '5', 'Rp125.000,00']
      ]
    },
    questionText: 'Tentukan kebenaran dari setiap pernyataan berikut berdasarkan analisis rasio dan selisih tabungan!',
    trueFalseStatements: [
      { id: 's1', statement: 'Besar tabungan Bayu di koperasi siswa adalah Rp100.000,00.', isTrue: true },
      { id: 's2', statement: 'Selisih nominal tabungan antara Gilang dan Bayu adalah Rp30.000,00.', isTrue: false },
      { id: 's3', statement: 'Jumlah gabungan seluruh tabungan Bayu dan Gilang adalah Rp225.000,00.', isTrue: true }
    ],
    explanation: 'Nilai 1 bagian = Rp125.000 ÷ 5 = Rp25.000. Tabungan Bayu = 4 × Rp25.000 = Rp100.000 (Pernyataan 1 BENAR). Selisih tabungan = Rp125.000 - Rp100.000 = Rp25.000, bukan Rp30.000 (Pernyataan 2 SALAH). Jumlah gabungan = Rp100.000 + Rp125.000 = Rp225.000 (Pernyataan 3 BENAR).'
  },
  {
    id: 5,
    indicator: '3.1',
    indicatorTitle: 'Menjelaskan konsep rasio dan membedakannya dengan selisih',
    cognitiveLevel: 'penalaran', // 2/8 Penalaran
    type: 'pg_kompleks', // PGK 2/8
    stimulusTitle: 'Perbandingan Rasio Usia Kakak Beradik dari Waktu ke Waktu',
    stimulusText: `Dalam pembelajaran proyek matematika terpadu di kelas 7A, Bu Guru meminta siswa mengamati konsep rasio dibandingkan selisih pada pertumbuhan usia dua bersaudara, Farhan (usia 12 tahun) dan adiknya Nabila (usia 8 tahun). Farhan berpendapat bahwa rasio usia mereka akan selalu tetap sama sepanjang hidup mereka, sedangkan Nabila berpendapat bahwa yang tetap konstan adalah selisih usianya, bukan nilai rasionya. Siswa diminta melakukan penyelidikan matematis untuk kondisi saat ini dan 4 tahun yang akan datang.`,
    stimulusGraphicType: 'table',
    stimulusData: {
      headers: ['Waktu', 'Usia Farhan', 'Usia Nabila', 'Selisih (Tahun)', 'Rasio Sederhana'],
      rows: [
        ['Saat ini (2026)', '12 tahun', '8 tahun', '4 tahun', '3 : 2 (1,50)'],
        ['4 Tahun Lagi (2030)', '16 tahun', '12 tahun', '4 tahun', '4 : 3 (1,33)']
      ]
    },
    questionText: 'Berdasarkan telaah matematis tentang sifat rasio dan selisih, manakah kesimpulan yang BENAR? (Pilih semua yang benar)',
    complexOptions: [
      { id: 'opt1', text: 'Selisih usia Farhan dan Nabila tidak pernah berubah yaitu selalu 4 tahun.', isCorrect: true },
      { id: 'opt2', text: 'Rasio usia Farhan terhadap Nabila saat ini adalah 3 : 2.', isCorrect: true },
      { id: 'opt3', text: 'Nilai rasio usia Farhan terhadap Nabila akan selalu bernilai tetap 3 : 2 setiap tahunnya.', isCorrect: false },
      { id: 'opt4', text: 'Empat tahun mendatang, nilai perbandingan usia Farhan terhadap Nabila menjadi 4 : 3.', isCorrect: true }
    ],
    explanation: 'Selisih umur dua orang selalu konstan seiring berjalannya waktu (12 - 8 = 4 tahun, dan 16 - 12 = 4 tahun). Rasio saat ini 12 : 8 = 3 : 2. Namun rasio tidak bernilai konstan jika kedua besaran ditambah angka yang sama (pada 4 tahun mendatang menjadi 16 : 12 = 4 : 3). Jadi pernyataan 1, 2, dan 4 benar.'
  },

  // ==========================================
  // INDIKATOR 3.2: Faktor Skala & Masalah Skala
  // ==========================================
  {
    id: 6,
    indicator: '3.2',
    indicatorTitle: 'Menggunakan faktor skala untuk menyelesaikan masalah',
    cognitiveLevel: 'pemahaman', // 2/2 Pemahaman
    type: 'pg', // PG 3/8
    stimulusTitle: 'Peta Wilayah Zonasi Sekolah Kabupaten Barito Kuala',
    stimulusText: `Dalam peta tata ruang zonasi PPDB SMP Negeri 1 Wanaraya di Kabupaten Barito Kuala, Kalimantan Selatan, dicantumkan skala peta sebesar 1 : 150.000. Faktor skala ini memiliki makna bahwa setiap 1 sentimeter panjang yang diukur pada bidang peta mewakili ukuran jarak sebenarnya di permukaan bumi dalam satuan sentimeter yang sama. Seorang siswa ingin mengukur jarak lurus dari balai desa Wanaraya menuju gedung sekolah pada lembar peta tersebut.`,
    stimulusGraphicType: 'map',
    stimulusData: {
      title: 'Skala Peta Wanaraya',
      scaleText: '1 : 150.000',
      mapDistance: '4 cm pada peta'
    },
    questionText: 'Jika jarak antara balai desa Wanaraya dengan gerbang sekolah pada peta terukur sepanjang 4 cm, berapakah jarak sebenarnya antara kedua lokasi tersebut?',
    options: [
      { id: 'A', text: '0,6 km' },
      { id: 'B', text: '6,0 km' },
      { id: 'C', text: '60 km' },
      { id: 'D', text: '600 km' }
    ],
    correctOption: 'B',
    explanation: 'Jarak sebenarnya = Jarak pada peta ÷ Skala = 4 cm × 150.000 = 600.000 cm. Dikonversi ke kilometer: 600.000 cm = 6.000 m = 6 km. Pilihan jawaban yang tepat adalah B.'
  },
  {
    id: 7,
    indicator: '3.2',
    indicatorTitle: 'Menggunakan faktor skala untuk menyelesaikan masalah',
    cognitiveLevel: 'aplikasi', // 3/10 Aplikasi
    type: 'pg', // PG 4/8
    stimulusTitle: 'Denah Rancang Bangun Laboratorium Komputer Baru',
    stimulusText: `Tim sarana dan prasarana SMP Negeri 1 Wanaraya sedang merancang denah ruang laboratorium komputer modern untuk persiapan ANBK mandiri. Pada gambar rancangan arsitektur dengan skala 1 : 120, ruangan tersebut digambarkan berbentuk persegi panjang dengan ukuran panjang 10 cm dan lebar 7,5 cm. Kepala sekolah meminta panitia menghitung luas lantai sebenarnya agar dapat memesan keramik dan meja komputer dengan presisi.`,
    stimulusGraphicType: 'infographic',
    stimulusData: {
      shape: 'Persegi Panjang',
      panjangDenah: '10 cm',
      lebarDenah: '7,5 cm',
      skala: '1 : 120'
    },
    questionText: 'Berapakah luas sebenarnya dari lantai ruang laboratorium komputer sekolah tersebut?',
    options: [
      { id: 'A', text: '90 m²' },
      { id: 'B', text: '108 m²' },
      { id: 'C', text: '120 m²' },
      { id: 'D', text: '144 m²' }
    ],
    correctOption: 'B',
    explanation: 'Panjang sebenarnya = 10 cm × 120 = 1.200 cm = 12 meter. Lebar sebenarnya = 7,5 cm × 120 = 900 cm = 9 meter. Luas sebenarnya = Panjang × Lebar = 12 m × 9 m = 108 m². Jawaban tepat adalah B.'
  },
  {
    id: 8,
    indicator: '3.2',
    indicatorTitle: 'Menggunakan faktor skala untuk menyelesaikan masalah',
    cognitiveLevel: 'aplikasi', // 4/10 Aplikasi
    type: 'pg_kompleks', // PGK 3/8
    stimulusTitle: 'Pembuatan Maket Gapura Sekolah dengan Faktor Skala',
    stimulusText: `Regu Pramuka Penggalang SMP Negeri 1 Wanaraya membuat maket miniatur gerbang sekolah dari stik es krim untuk pameran edukasi. Gerbang sekolah yang asli memiliki tinggi 4,8 meter dan lebar bentang 7,2 meter. Siswa menggunakan faktor skala pengecilan 1 : 40 dalam membuat maket tersebut. Setelah maket selesai dirangkai, dewan juri perlombaan melakukan verifikasi ukuran miniatur untuk menilai ketelitian matematis peserta.`,
    stimulusGraphicType: 'table',
    stimulusData: {
      headers: ['Komponen', 'Ukuran Sebenarnya', 'Faktor Skala Maket'],
      rows: [
        ['Tinggi Gerbang', '4,8 meter (480 cm)', '1 : 40'],
        ['Lebar Gerbang', '7,2 meter (720 cm)', '1 : 40']
      ]
    },
    questionText: 'Pilihlah semua pernyataan berikut yang BENAR mengenai ukuran maket gerbang sekolah tersebut!',
    complexOptions: [
      { id: 'opt1', text: 'Tinggi miniatur gerbang pada maket adalah 12 cm.', isCorrect: true },
      { id: 'opt2', text: 'Lebar bentang miniatur gerbang pada maket adalah 18 cm.', isCorrect: true },
      { id: 'opt3', text: 'Rasio antara tinggi maket terhadap tinggi sebenarnya setara dengan 1/40.', isCorrect: true },
      { id: 'opt4', text: 'Jika maket diperbesar dua kali lipat, maka skalanya berubah menjadi 1 : 80.', isCorrect: false }
    ],
    explanation: 'Tinggi maket = 480 cm ÷ 40 = 12 cm (Pernyataan 1 Benar). Lebar maket = 720 cm ÷ 40 = 18 cm (Pernyataan 2 Benar). Faktor skala maket : sebenarnya adalah 1 : 40 atau 1/40 (Pernyataan 3 Benar). Jika maket diperbesar dua kali lipat, skalanya menjadi (2/40) = 1 : 20, bukan 1 : 80 (Pernyataan 4 Salah).'
  },
  {
    id: 9,
    indicator: '3.2',
    indicatorTitle: 'Menggunakan faktor skala untuk menyelesaikan masalah',
    cognitiveLevel: 'penalaran', // 3/8 Penalaran
    type: 'benar_salah', // BS 2/4
    stimulusTitle: 'Analisis Perbandingan Skala Dua Peta Berbeda',
    stimulusText: `Dalam pembelajaran IPS dan Matematika terpadu, siswa kelas 7 meneliti dua lembar peta wilayah Marabahan dan Wanaraya. Peta A memiliki skala 1 : 50.000, sedangkan Peta B memiliki skala 1 : 200.000. Jarak antara dua lokasi di lapangan yang sebenarnya adalah sama persis, yaitu sejauh 10 km. Guru meminta siswa menelaah kaitan antara nilai skala angka, tingkat kedetailan visual objek pada peta, dan representasi jarak sentimeter pada masing-masing lembar peta.`,
    stimulusGraphicType: 'table',
    stimulusData: {
      headers: ['Peta', 'Skala Angka', 'Jarak Sebenarnya Lapangan'],
      rows: [
        ['Peta A', '1 : 50.000', '10 km (1.000.000 cm)'],
        ['Peta B', '1 : 200.000', '10 km (1.000.000 cm)']
      ]
    },
    questionText: 'Tentukan kebenaran dari setiap pernyataan perbandingan skala berikut ini!',
    trueFalseStatements: [
      { id: 's1', statement: 'Jarak antara dua lokasi tersebut pada Peta A tergambar sepanjang 20 cm.', isTrue: true },
      { id: 's2', statement: 'Jarak antara dua lokasi tersebut pada Peta B tergambar sepanjang 5 cm.', isTrue: true },
      { id: 's3', statement: 'Peta B memiliki skala yang lebih besar dibandingkan Peta A sehingga gambar terlihat lebih rinci.', isTrue: false }
    ],
    explanation: 'Jarak pada Peta A = 1.000.000 cm ÷ 50.000 = 20 cm (Pernyataan 1 BENAR). Jarak pada Peta B = 1.000.000 cm ÷ 200.000 = 5 cm (Pernyataan 2 BENAR). Nilai 1/50.000 > 1/200.000, jadi Peta A yang memiliki skala lebih besar (large scale) dan gambar lebih rinci, bukan Peta B (Pernyataan 3 SALAH).'
  },
  {
    id: 10,
    indicator: '3.2',
    indicatorTitle: 'Menggunakan faktor skala untuk menyelesaikan masalah',
    cognitiveLevel: 'penalaran', // 4/8 Penalaran
    type: 'pg_kompleks', // PGK 4/8
    stimulusTitle: 'Perbesaran Foto Dokumentasi Siswa Berprestasi',
    stimulusText: `Pengelola mading sekolah ingin mencetak ulang pas foto siswa peraih medali KSN matematika untuk dipajang di lobi utama. Foto asli siswa tersebut berukuran 3 cm × 4 cm. Desainer grafis sekolah hendak memperbesar foto tersebut dengan faktor skala perbesaran tertentu sehingga foto tetap proporsional (sebangun) dan tidak mengalami distorsi bentuk wajah. Rencana bingkai pigura yang tersedia di lobi memiliki beberapa variasi ukuran pajangan standar.`,
    stimulusGraphicType: 'infographic',
    stimulusData: {
      ukuranAwal: '3 cm × 4 cm (Rasio 3 : 4)',
      sifat: 'Perbesaran faktor skala k > 1 (proporsional)'
    },
    questionText: 'Manakah di antara ukuran bingkai berikut yang tepat dan sebangun dengan pas foto asli tanpa mengubah rasio bentuknya? (Pilihlah semua yang benar)',
    complexOptions: [
      { id: 'opt1', text: 'Ukuran 15 cm × 20 cm dengan faktor perbesaran k = 5.', isCorrect: true },
      { id: 'opt2', text: 'Ukuran 24 cm × 32 cm dengan faktor perbesaran k = 8.', isCorrect: true },
      { id: 'opt3', text: 'Ukuran 18 cm × 25 cm dengan faktor perbesaran k = 6.', isCorrect: false },
      { id: 'opt4', text: 'Ukuran 30 cm × 40 cm dengan faktor perbesaran k = 10.', isCorrect: true }
    ],
    explanation: 'Rasio dimensi asli adalah 3 : 4. Ukuran sebangun diperoleh dengan mengalikan kedua dimensi dengan faktor k yang sama. 3×5=15 & 4×5=20 (Opsi 1 Benar). 3×8=24 & 4×8=32 (Opsi 2 Benar). 3×6=18 tetapi 4×6=24, bukan 25 (Opsi 3 Salah). 3×10=30 & 4×10=40 (Opsi 4 Benar).'
  },

  // ==========================================
  // INDIKATOR 3.3: Rasio Ekuivalen & Proporsi
  // ==========================================
  {
    id: 11,
    indicator: '3.3',
    indicatorTitle: 'Menghubungkan rasio ekuivalen dengan proporsi',
    cognitiveLevel: 'aplikasi', // 5/10 Aplikasi
    type: 'pg', // PG 5/8
    stimulusTitle: 'Pembagian Keuntungan Usaha Bazar Kewirausahaan',
    stimulusText: `Dalam bazar P5 (Projek Penguatan Profil Pelajar Pancasila) di SMP Negeri 1 Wanaraya, kelompok wirausaha yang terdiri dari Dina dan Rina memproduksi minuman herbal sari jahe merah. Berdasarkan modal dan waktu kerja yang disepakati, perbandingan pembagian laba bersih antara Dina dan Rina ditetapkan berbanding 2 : 3. Pada penutupan bazar hari Sabtu, bendahara membagikan bagian keuntungan kepada Dina sebesar Rp40.000,00. Rina ingin mengetahui bagian hak keuntungan yang akan ia terima sesuai prinsip proporsi rasio ekuivalen.`,
    stimulusGraphicType: 'infographic',
    stimulusData: {
      bagDina: '2 bagian = Rp40.000,00',
      bagRina: '3 bagian = ?',
      prinsip: 'Rasio Laba Dina : Rina = 2 : 3'
    },
    questionText: 'Berdasarkan rasio ekuivalen tersebut, berapakah uang keuntungan yang diterima oleh Rina?',
    options: [
      { id: 'A', text: 'Rp50.000,00' },
      { id: 'B', text: 'Rp60.000,00' },
      { id: 'C', text: 'Rp70.000,00' },
      { id: 'D', text: 'Rp80.000,00' }
    ],
    correctOption: 'B',
    explanation: 'Rasio uang Dina : Rina = 2 : 3. Dina = 2k = Rp40.000 → k = Rp20.000. Maka uang Rina = 3k = 3 × Rp20.000 = Rp60.000,00. Jawaban yang benar adalah B.'
  },
  {
    id: 12,
    indicator: '3.3',
    indicatorTitle: 'Menghubungkan rasio ekuivalen dengan proporsi',
    cognitiveLevel: 'aplikasi', // 6/10 Aplikasi
    type: 'pg', // PG 6/8
    stimulusTitle: 'Resep Minuman Teh Manis Jumbo untuk Acara Sekolah',
    stimulusText: `Ibu guru pembina OSIS menyiapkan racikan konsentrat sirup gula dan teh melati untuk konsumsi tamu peringatan HUT SMPN 1 Wanaraya. Untuk membuat 12 gelas minuman teh manis dengan rasa manis yang pas, dibutuhkan 300 gram gula pasir dan 1,5 liter air teh. Panitia memperkirakan jumlah tamu undangan yang hadir pada sesi siang bertambah menjadi 36 orang dengan takaran gelas yang sama persis. Panitia perlu menyiapkan tambahan bahan dengan mempertahankan rasa (proporsi) yang ekuivalen.`,
    stimulusGraphicType: 'recipe',
    stimulusData: {
      takaranAwal: '12 gelas teh manis',
      gulaAwal: '300 gram',
      airAwal: '1,5 liter',
      targetGelas: '36 gelas teh manis'
    },
    questionText: 'Berapa gram gula pasir dan liter air teh yang dibutuhkan panitia agar rasio rasa minuman tetap ekuivalen untuk 36 gelas tamu tersebut?',
    options: [
      { id: 'A', text: '600 gram gula dan 3,0 liter air teh' },
      { id: 'B', text: '750 gram gula dan 3,5 liter air teh' },
      { id: 'C', text: '900 gram gula dan 4,5 liter air teh' },
      { id: 'D', text: '1.200 gram gula dan 6,0 liter air teh' }
    ],
    correctOption: 'C',
    explanation: 'Faktor pengali proporsi = 36 gelas ÷ 12 gelas = 3 kali lipat. Maka gula pasir = 300 gram × 3 = 900 gram. Air teh = 1,5 liter × 3 = 4,5 liter. Jawaban yang tepat adalah C.'
  },
  {
    id: 13,
    indicator: '3.3',
    indicatorTitle: 'Menghubungkan rasio ekuivalen dengan proporsi',
    cognitiveLevel: 'penalaran', // 5/8 Penalaran
    type: 'pg_kompleks', // PGK 5/8
    stimulusTitle: 'Tabel Rasio Ekuivalen Produksi Percetakan Buku Modul',
    stimulusText: `Percetakan mitra sekolah mencetak buku lembar kerja siswa (LKS) matematika Fase D. Mesin cetak digital beroperasi dengan kecepatan konstan sehingga jumlah buku yang diproduksi berbanding lurus secara proporsional dengan durasi waktu operasional mesin. Operator menyajikan tabel hubungan antara lama waktu mesin bekerja (dalam jam) dengan jumlah buku yang berhasil dicetak untuk monitoring harian efisiensi bengkel grafika.`,
    stimulusGraphicType: 'table',
    stimulusData: {
      headers: ['Waktu Operasional Mesin (jam)', 'Jumlah Buku LKS Tercetak (eksemplar)'],
      rows: [
        ['2 jam', '150 eksemplar'],
        ['4 jam', '300 eksemplar'],
        ['6 jam', '450 eksemplar'],
        ['p jam', '600 eksemplar'],
        ['10 jam', 'q eksemplar']
      ]
    },
    questionText: 'Berdasarkan konsep rasio ekuivalen dan proporsi pada tabel di atas, manakah pernyataan berikut yang BENAR? (Pilihlah semua jawaban benar)',
    complexOptions: [
      { id: 'opt1', text: 'Laju pencetakan mesin adalah 75 eksemplar buku per 1 jam.', isCorrect: true },
      { id: 'opt2', text: 'Nilai p yang melengkapi tabel di atas adalah 8 jam.', isCorrect: true },
      { id: 'opt3', text: 'Nilai q yang melengkapi tabel di atas adalah 750 eksemplar.', isCorrect: true },
      { id: 'opt4', text: 'Rasio antara waktu dan jumlah cetakan bersifat berbalik nilai.', isCorrect: false }
    ],
    explanation: 'Rasio ekuivalen = 150/2 = 300/4 = 75 eksemplar/jam (Opsi 1 Benar). Untuk mencetak 600 eksemplar: p = 600 ÷ 75 = 8 jam (Opsi 2 Benar). Dalam 10 jam: q = 10 × 75 = 750 eksemplar (Opsi 3 Benar). Hubungan ini merupakan proporsi senilai (berbanding lurus), bukan berbalik nilai (Opsi 4 Salah).'
  },
  {
    id: 14,
    indicator: '3.3',
    indicatorTitle: 'Menghubungkan rasio ekuivalen dengan proporsi',
    cognitiveLevel: 'aplikasi', // 7/10 Aplikasi
    type: 'benar_salah', // BS 3/4
    stimulusTitle: 'Peracikan Komposisi Pupuk Kompos Pertanian Sekolah',
    stimulusText: `Dalam mata pelajaran IPA Terapan, siswa kelas 7A mempraktikkan pembuatan pupuk kompos dengan mencampurkan kotoran ternak fermentasi dan serbuk gergaji dengan rasio proporsional 3 : 5. Artinya, setiap 3 kg kotoran ternak memerlukan 5 kg serbuk gergaji agar proses dekomposisi mikroorganisme berjalan optimal tanpa menimbulkan bau menyengat. Siswa membawa berbagai ukuran bahan dari rumah untuk dicampur di laboratorium terbuka sekolah.`,
    stimulusGraphicType: 'table',
    stimulusData: {
      headers: ['Bahan Kompos', 'Perbandingan Baku', 'Kebutuhan Campuran Lapangan'],
      rows: [
        ['Kotoran Ternak Fermentasi', '3 bagian', '18 kg'],
        ['Serbuk Gergaji Kering', '5 bagian', 'Perlu dihitung']
      ]
    },
    questionText: 'Tentukan kebenaran dari pernyataan-pernyataan proporsi komposisi pupuk kompos berikut!',
    trueFalseStatements: [
      { id: 's1', statement: 'Jika siswa menggunakan 18 kg kotoran ternak, maka serbuk gergaji yang diperlukan adalah 30 kg.', isTrue: true },
      { id: 's2', statement: 'Campuran 12 kg kotoran ternak dan 20 kg serbuk gergaji memiliki rasio yang ekuivalen dengan resep baku.', isTrue: true },
      { id: 's3', statement: 'Rasio 3 : 5 setara nilainya dengan rasio 9 : 20.', isTrue: false }
    ],
    explanation: 'Pengali untuk 18 kg = 18 ÷ 3 = 6. Maka serbuk gergaji = 5 × 6 = 30 kg (Pernyataan 1 BENAR). 12 : 20 disederhanakan dibagi 4 menjadi 3 : 5, ekuivalen dengan resep (Pernyataan 2 BENAR). 3 : 5 jika dikalikan 3 menjadi 9 : 15, bukan 9 : 20 (Pernyataan 3 SALAH).'
  },
  {
    id: 15,
    indicator: '3.3',
    indicatorTitle: 'Menghubungkan rasio ekuivalen dengan proporsi',
    cognitiveLevel: 'penalaran', // 6/8 Penalaran
    type: 'pg_kompleks', // PGK 6/8
    stimulusTitle: 'Proporsi Kurs Valuta Asing dan Harga Cenderamata',
    stimulusText: `Koperasi sekolah kedatangan rombongan studi tiru dari sekolah mitra luar negeri. Koperasi menjual gantungan kunci anyaman purun khas Barito Kuala. Harga 4 buah gantungan kunci adalah Rp60.000,00. Dua perwakilan tamu, Mr. David dan Mr. John, ingin membeli gantungan kunci tersebut dalam jumlah berbeda untuk cinderamata bagi keluarga mereka di negaranya. Kasir koperasi menggunakan rumus proporsi langsung untuk menghitung tagihan belanja secara akurat.`,
    stimulusGraphicType: 'table',
    stimulusData: {
      headers: ['Kuantitas Souvenir', 'Harga Pembayaran (Rupiah)'],
      rows: [
        ['4 buah gantungan kunci', 'Rp60.000,00'],
        ['1 buah gantungan kunci', 'Rp15.000,00 (Harga Satuan)']
      ]
    },
    questionText: 'Manakah transaksi belanja berikut yang sesuai dengan rasio harga satuan di koperasi sekolah? (Pilihlah semua yang benar)',
    complexOptions: [
      { id: 'opt1', text: 'Mr. David membeli 7 buah gantungan kunci dengan total bayar Rp105.000,00.', isCorrect: true },
      { id: 'opt2', text: 'Mr. John membeli 10 buah gantungan kunci dengan total bayar Rp150.000,00.', isCorrect: true },
      { id: 'opt3', text: 'Uang sebesar Rp90.000,00 cukup tepat untuk membeli 5 buah gantungan kunci.', isCorrect: false },
      { id: 'opt4', text: 'Uang sebesar Rp180.000,00 dapat digunakan untuk membeli 12 buah gantungan kunci.', isCorrect: true }
    ],
    explanation: 'Harga 1 buah = Rp60.000 ÷ 4 = Rp15.000. Beli 7 buah = 7 × Rp15.000 = Rp105.000 (Opsi 1 Benar). Beli 10 buah = 10 × Rp15.000 = Rp150.000 (Opsi 2 Benar). Beli 5 buah seharusnya 5 × Rp15.000 = Rp75.000, bukan Rp90.000 (Opsi 3 Salah). Beli 12 buah = 12 × Rp15.000 = Rp180.000 (Opsi 4 Benar).'
  },

  // ==========================================
  // INDIKATOR 3.4: Laju Perubahan Satuan
  // ==========================================
  {
    id: 16,
    indicator: '3.4',
    indicatorTitle: 'Menggunakan rasio untuk menyelesaikan masalah laju perubahan satuan',
    cognitiveLevel: 'aplikasi', // 8/10 Aplikasi
    type: 'pg', // PG 7/8
    stimulusTitle: 'Perjalanan Bus Study Tour SMPN 1 Wanaraya ke Banjarmasin',
    stimulusText: `Dalam kegiatan karyawisata edukatif ke museum di Banjarmasin, bus pariwisata yang membawa rombongan siswa kelas 7 menempuh jarak total 180 km dalam durasi waktu perjalanan selama 3 jam tanpa henti di jalan arteri trans-Kalimantan. Sopir bus mengemudi dengan laju yang teratur dan mematuhi batas rambu kecepatan. Guru pendamping meminta siswa memanfaatkan data speedometer dan waktu tempuh tersebut untuk menghitung laju kelajuan rata-rata dalam satuan internasional (m/s) sesuai materi rasio laju satuan.`,
    stimulusGraphicType: 'chart',
    stimulusData: {
      kendaraan: 'Bus Pariwisata Sekolah',
      jarakTempuh: '180 km',
      waktuTempuh: '3 jam',
      infoKonversi: '1 km = 1.000 m dan 1 jam = 3.600 detik'
    },
    questionText: 'Berapakah kelajuan bus tersebut dalam satuan km/jam, dan jika dikonversikan ke satuan meter per detik (m/s) berturut-turut adalah...',
    options: [
      { id: 'A', text: '50 km/jam dan 13,89 m/s' },
      { id: 'B', text: '60 km/jam dan 16,67 m/s' },
      { id: 'C', text: '60 km/jam dan 20,00 m/s' },
      { id: 'D', text: '90 km/jam dan 25,00 m/s' }
    ],
    correctOption: 'B',
    explanation: '1. Kelajuan dalam km/jam = 180 km ÷ 3 jam = 60 km/jam. 2. Konversi ke m/s = (60 × 1.000 m) ÷ (3.600 detik) = 60.000 m ÷ 3.600 s = 16,67 m/s. Pilihan yang tepat adalah B (sesuai contoh infografis materi rasio).'
  },
  {
    id: 17,
    indicator: '3.4',
    indicatorTitle: 'Menggunakan rasio untuk menyelesaikan masalah laju perubahan satuan',
    cognitiveLevel: 'aplikasi', // 9/10 Aplikasi
    type: 'pg', // PG 8/8
    stimulusTitle: 'Efisiensi Konsumsi Bahan Bakar Kendaraan Operasional',
    stimulusText: `Mobil dinas operasional sekolah SMPN 1 Wanaraya diisi bahan bakar bensin jenis Pertalite sebanyak 8 liter dan dapat menempuh jarak sejauh 96 km di jalur pedesaan. Di akhir pekan ini, kepala sekolah ditugaskan menghadiri rapat koordinasi musyawarah kerja kepala sekolah (MKKS) ke ibu kota provinsi dengan perkiraan jarak tempuh pulang-pergi sejauh 240 km. Bagian tata usaha sekolah ingin memperkirakan kebutuhan anggaran bahan bakar secara efisien berdasarkan rasio konsumsi bahan bakar per kilometer.`,
    stimulusGraphicType: 'infographic',
    stimulusData: {
      kapasitasBBM: '8 liter',
      jarakJangkau: '96 km',
      efisiensi: '12 km / liter'
    },
    questionText: 'Berapa liter bahan bakar bensin yang diperlukan untuk menempuh jarak 240 km tersebut?',
    options: [
      { id: 'A', text: '16 liter' },
      { id: 'B', text: '18 liter' },
      { id: 'C', text: '20 liter' },
      { id: 'D', text: '24 liter' }
    ],
    correctOption: 'C',
    explanation: 'Laju konsumsi per liter = 96 km ÷ 8 liter = 12 km/liter. Kebutuhan bensin untuk 240 km = 240 km ÷ (12 km/liter) = 20 liter. Jawaban yang tepat adalah C.'
  },
  {
    id: 18,
    indicator: '3.4',
    indicatorTitle: 'Menggunakan rasio untuk menyelesaikan masalah laju perubahan satuan',
    cognitiveLevel: 'penalaran', // 7/8 Penalaran
    type: 'pg_kompleks', // PGK 7/8
    stimulusTitle: 'Pengisian Toren Penampungan Air Bersih Musholla Sekolah',
    stimulusText: `Untuk memenuhi kebutuhan wudhu jamaah musholla SMP Negeri 1 Wanaraya, dipasang toren penampung air berkapasitas 1.200 liter. Pompa air listrik otomatis mengalirkan air dari sumur bor ke dalam toren dengan debit konstan sebesar 40 liter per menit. Petugas kebersihan sekolah mencatat waktu pengisian toren dari kondisi kosong hingga penuh untuk mengevaluasi konsumsi daya listrik pompa setiap pagi hari sebelum jam pelajaran dimulai.`,
    stimulusGraphicType: 'table',
    stimulusData: {
      headers: ['Parameter', 'Nilai / Kapasitas', 'Satuan Baku'],
      rows: [
        ['Volume Toren Kosong', '1.200', 'Liter'],
        ['Debit Aliran Pompa', '40', 'Liter / menit'],
        ['Daya Listrik Pompa', '250', 'Watt']
      ]
    },
    questionText: 'Manakah kesimpulan yang BENAR mengenai laju pengisian toren air tersebut? (Pilihlah semua jawaban benar)',
    complexOptions: [
      { id: 'opt1', text: 'Waktu yang dibutuhkan untuk mengisi toren hingga penuh adalah 30 menit.', isCorrect: true },
      { id: 'opt2', text: 'Dalam waktu 15 menit, volume air yang telah terisi ke dalam toren adalah 600 liter.', isCorrect: true },
      { id: 'opt3', text: 'Debit aliran 40 liter/menit setara dengan laju 2.400 liter per jam.', isCorrect: true },
      { id: 'opt4', text: 'Toren akan penuh dalam waktu tepat 1 jam pengisian.', isCorrect: false }
    ],
    explanation: 'Waktu pengisian penuh = 1.200 liter ÷ 40 liter/menit = 30 menit = 0,5 jam (Opsi 1 Benar, Opsi 4 Salah). Dalam 15 menit: 15 × 40 = 600 liter (Opsi 2 Benar). Debit per jam = 40 liter/menit × 60 menit/jam = 2.400 liter/jam (Opsi 3 Benar).'
  },
  {
    id: 19,
    indicator: '3.4',
    indicatorTitle: 'Menggunakan rasio untuk menyelesaikan masalah laju perubahan satuan',
    cognitiveLevel: 'aplikasi', // 10/10 Aplikasi
    type: 'benar_salah', // BS 4/4
    stimulusTitle: 'Kecepatan Mengetik Data Operator Komputer ANBK',
    stimulusText: `Dalam simulasi teknis gladi bersih ANBK, proktor sekolah menguji kecepatan mengetik naskah narasi dua orang staf operator, yaitu Pak Adi dan Bu Siti. Pak Adi mampu mengetik 180 kata dalam waktu 3 menit dengan akurasi 98%. Sedangkan Bu Siti mampu mengetik 250 kata dalam waktu 5 menit dengan akurasi 97%. Proktor ingin membandingkan laju kecepatan mengetik rata-rata per menit (words per minute / WPM) dari kedua staf tersebut untuk penugasan entri data asesmen.`,
    stimulusGraphicType: 'table',
    stimulusData: {
      headers: ['Nama Operator', 'Jumlah Kata Terketik', 'Waktu Pengerjaan'],
      rows: [
        ['Pak Adi', '180 kata', '3 menit'],
        ['Bu Siti', '250 kata', '5 menit']
      ]
    },
    questionText: 'Tentukan kebenaran dari pernyataan perbandingan laju pengetikan berikut!',
    trueFalseStatements: [
      { id: 's1', statement: 'Laju mengetik Pak Adi adalah 60 kata per menit.', isTrue: true },
      { id: 's2', statement: 'Laju mengetik Bu Siti adalah 50 kata per menit.', isTrue: true },
      { id: 's3', statement: 'Bu Siti memiliki laju pengetikan per menit yang lebih cepat daripada Pak Adi.', isTrue: false }
    ],
    explanation: 'Laju Pak Adi = 180 ÷ 3 = 60 kata/menit (Pernyataan 1 BENAR). Laju Bu Siti = 250 ÷ 5 = 50 kata/menit (Pernyataan 2 BENAR). Laju Pak Adi (60 WPM) lebih cepat daripada Bu Siti (50 WPM), sehingga Pernyataan 3 SALAH.'
  },
  {
    id: 20,
    indicator: '3.4',
    indicatorTitle: 'Menggunakan rasio untuk menyelesaikan masalah laju perubahan satuan',
    cognitiveLevel: 'penalaran', // 8/8 Penalaran
    type: 'pg_kompleks', // PGK 8/8
    stimulusTitle: 'Perbandingan Efisiensi Unduh Data Jaringan Server Sekolah',
    stimulusText: `Laboratorium CBT SMP Negeri 1 Wanaraya menggunakan dua jalur koneksi internet cadangan untuk sinkronisasi soal asesmen dari pusat. Jalur Serat Optik A memiliki laju transfer data unduhan rata-rata 12 MegaByte per detik (MB/s). Sedangkan Jalur Nirkabel B memiliki kecepatan unduh rata-rata 8 MB/s. Tim teknisi TIK sekolah sedang mengunduh berkas sinkronisasi VHD simulasi ANBK yang memiliki ukuran total 3,6 GigaByte (setara dengan 3.600 MegaByte).`,
    stimulusGraphicType: 'chart',
    stimulusData: {
      ukuranFile: '3.600 MB (3,6 GB)',
      jalurA: '12 MB/detik (Serat Optik)',
      jalurB: '8 MB/detik (Nirkabel Cadangan)'
    },
    questionText: 'Manakah pernyataan-pernyataan berikut yang BENAR berdasarkan analisis laju unduh data jaringan tersebut? (Pilihlah semua jawaban benar)',
    complexOptions: [
      { id: 'opt1', text: 'Waktu yang dibutuhkan Jalur A untuk mengunduh berkas hingga selesai adalah 300 detik (5 menit).', isCorrect: true },
      { id: 'opt2', text: 'Waktu yang dibutuhkan Jalur B untuk mengunduh berkas hingga selesai adalah 450 detik (7,5 menit).', isCorrect: true },
      { id: 'opt3', text: 'Selisih waktu penyelesaian unduh antara Jalur B dan Jalur A adalah 2,5 menit (150 detik).', isCorrect: true },
      { id: 'opt4', text: 'Jalur B dapat menyelesaikan unduhan lebih cepat daripada Jalur A.', isCorrect: false }
    ],
    explanation: 'Waktu Jalur A = 3.600 MB ÷ 12 MB/s = 300 detik = 5 menit (Opsi 1 Benar). Waktu Jalur B = 3.600 MB ÷ 8 MB/s = 450 detik = 7,5 menit (Opsi 2 Benar). Selisih waktu = 450 - 300 = 150 detik = 2,5 menit (Opsi 3 Benar). Jalur A lebih cepat daripada Jalur B (Opsi 4 Salah).'
  }
];
