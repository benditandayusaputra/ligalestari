-- ============================================================
-- SEED data demo LigaLestari — dijalankan setelah db/schema.sql.
-- Nilainya sengaja dibuat identik dengan fallback demo di
-- `shared/data/*` supaya tampilan dengan/tanpa database sama.
--
-- Akun (tabel `profil`) TIDAK diseed di sini: sandinya harus di-hash
-- lebih dulu — lihat db/migrate.mjs.
-- ============================================================

insert into musim values (1, 'Musim Genap ''25/''26', 9, 16, '12 Jul', 12,
  'Event aktif · 2× Poin', 'Pekan Tanam Pohon', 12);

-- poin = poin_sampah + poin_pohon; kg/pohon/co2 sejalan dengan
-- ringkasan dampak liga di halaman klasemen.
insert into tim (id, nama, julukan, emblem, warna, poin, kg, pohon, co2, tren,
  poin_sampah, poin_pohon, jumlah_siswa, kode_gabung) values
  ('rpl',  'XII RPL 1',  'Rajawali', 'R1', '#4cc38a', 4820, 318, 64, 1180,  1, 2620, 2200, 36, 'RPL1-7K2M'),
  ('tkj',  'XI TKJ 2',   'Garuda',   'G2', '#E6B422', 4510, 296, 58, 1040,  2, 2960, 1550, 38, 'TKJ2-3H9P'),
  ('mm',   'X MM 1',     'Elang',    'E1', '#2D8FE0', 4185, 271, 51,  910,  0, 2710, 1475, 29, 'MM1-5J4Q'),
  ('akl',  'XII AKL 3',  'Banteng',  'A3', '#C0392B', 3760, 244, 44,  770, -1, 2440, 1320, 33, 'AKL3-8R6T'),
  ('dkv',  'XI DKV 1',   'Serigala', 'D1', '#7B4BD1', 3340, 210, 39,  690,  1, 2100, 1240, 24, 'DKV1-2W7B'),
  ('tb',   'X TB 2',     'Rusa',     'B2', '#14A38B', 2980, 188, 33,  560, -2, 1880, 1100, 26, 'TB2-9C4N'),
  ('otkp', 'XII OTKP 1', 'Macan',    'M1', '#E8731B', 2610, 162, 28,  470,  0, 1620,  990, 31, 'OTKP-6D3F'),
  ('aphp', 'XI APHP 2',  'Beruang',  'P2', '#5A6B7B', 2210, 138, 22,  360,  1, 1380,  830, 27, 'APHP-4G8H');

insert into siswa (kelas_id, nama, nis, poin, peran, level, nama_level, kg, pohon,
  persen_level, poin_ke_level_berikut) values
  ('rpl', 'Aditya Pratama', 'NIS 2231045', 520, 'Kapten', 6, 'Eco Warrior',   48, 9, 72, 180),
  ('rpl', 'Siti Nurhaliza', 'NIS 2231046', 430, 'Wakil',  5, 'Penjaga Hijau', 39, 6, 55, 240),
  ('rpl', 'Bagas Saputra',  'NIS 2231047', 395, null,     5, 'Penjaga Hijau', 36, 5, 40, 305),
  ('rpl', 'Dewi Lestari',   'NIS 2231048', 360, null,     4, 'Pejuang Hijau', 33, 4, 88,  40),
  ('rpl', 'Rizki Ananda',   'NIS 2231049', 340, null,     4, 'Pejuang Hijau', 30, 4, 70,  60),
  ('rpl', 'Putri Maharani', 'NIS 2231050', 300, null,     4, 'Pejuang Hijau', 26, 3, 50, 100);

-- Tabel acuan serapan CO2 (Endes N. Dahlan, 2007 — IPB).
insert into jenis_pohon values
  ('Trembesi', 'Samanea saman',          28488, 'Dahlan, IPB', '#4cc38a'),
  ('Beringin', 'Ficus benjamina',        535.9, 'Dahlan, IPB', '#0e6b46'),
  ('Mahoni',   'Swietenia mahagoni',     295.7, 'Dahlan, IPB', '#5C7A12'),
  ('Angsana',  'Pterocarpus indicus',     11.1, 'Dahlan, IPB', '#d9a13a'),
  ('Bungur',   'Lagerstroemia speciosa',  10.4, 'Dahlan, IPB', '#7B4BD1');

-- co2 = jumlah × rate acuan metodologi (Angsana 11,1 · Bungur 10,4 ·
-- Mahoni 295,7 kg/pohon/th), dibulatkan.
insert into titik_tanam (kelas_id, x, y, jumlah, jenis_pohon, co2, tanggal, foto) values
  ('rpl', 14, 24, 8, 'Angsana',  89, '12 Feb 2026', '/foto-tanam/tanam-1.svg'),
  ('rpl', 40, 72, 5, 'Bungur',   52, '03 Mar 2026', '/foto-tanam/tanam-2.svg'),
  ('tkj', 62, 30, 6, 'Angsana',  67, '18 Feb 2026', '/foto-tanam/tanam-3.svg'),
  ('tkj', 24, 58, 4, 'Bungur',   42, '27 Feb 2026', '/foto-tanam/tanam-4.svg'),
  ('mm',  78, 62, 7, 'Angsana',  78, '05 Mar 2026', '/foto-tanam/tanam-1.svg'),
  ('mm',  52, 46, 3, 'Angsana',  33, '21 Feb 2026', '/foto-tanam/tanam-2.svg'),
  ('akl', 33, 34, 5, 'Bungur',   52, '09 Mar 2026', '/foto-tanam/tanam-3.svg'),
  ('akl', 70, 80, 4, 'Angsana',  44, '14 Mar 2026', '/foto-tanam/tanam-4.svg'),
  ('dkv', 46, 18, 6, 'Angsana',  67, '16 Feb 2026', '/foto-tanam/tanam-2.svg'),
  ('dkv', 18, 80, 3, 'Bungur',   31, '01 Mar 2026', '/foto-tanam/tanam-1.svg'),
  ('mm',  86, 34, 2, 'Mahoni',  591, '22 Mar 2026', '/foto-tanam/tanam-3.svg');

insert into event_liga (nama, jenis, rate, status, periode, urutan) values
  ('Setoran Sampah Harian', 'sampah', 'tarif kategori · 8–20 poin / kg', 'Aktif',     'Tiap hari sekolah', 1),
  ('Pekan Tanam Pohon',     'pohon',  '2× · 100 poin / pohon',           'Aktif',     '1–12 Jul 2026',     2),
  ('Bank Sampah Spesial',   'sampah', '1,5× tarif kategori',             'Terjadwal', '15 Jul 2026',       3),
  ('Tanam Pohon Hari Bumi', 'pohon',  '50 poin / pohon',                 'Selesai',   '22 Apr 2026',       4);

-- poin selalu = kg × tarif kategori (shared/data/kategori-sampah.ts).
insert into setoran (dibuat, waktu, kelas, kategori, kg, poin) values
  (current_date + time '09:42', '09.42', 'XII RPL 1',  'plastik',   12.5, 150),
  (current_date + time '09:18', '09.18', 'XI TKJ 2',   'organik',    8.0,  64),
  (current_date + time '08:55', '08.55', 'X MM 1',     'logam',      5.2,  78),
  (current_date + time '08:30', '08.30', 'XII AKL 3',  'kertas',     6.4,  64),
  (current_date + time '08:05', '08.05', 'XI DKV 1',   'kaca',       4.5,  54),
  (current_date + time '07:50', '07.50', 'XI APHP 2',  'b3-ringan',  1.6,  32);

insert into bukti_tanam (id, kelas_id, pohon, jenis_pohon, co2, koordinat, lokasi, waktu) values
  (1, 'tkj',  6, 'Trembesi', 171, '-6.91732, 107.61912', 'Lapangan belakang sekolah', '20 mnt lalu'),
  (2, 'mm',   4, 'Mangga',    48, '-6.91688, 107.62041', 'Taman depan gerbang',       '1 jam lalu'),
  (3, 'rpl',  8, 'Mahoni',   144, '-6.91801, 107.61855', 'Sisi timur kantin',         '2 jam lalu'),
  (4, 'aphp', 3, 'Ketapang',  45, '-6.91760, 107.62110', 'Halaman parkir guru',       '3 jam lalu');

insert into notifikasi (judul, isi, waktu, tag, warna, ikon, belum_dibaca, urutan) values
  ('Kelasmu naik ke peringkat #1!', 'Rajawali menyalip Garuda. Pertahankan posisi!', '5 mnt lalu',  'Peringkat',  '#4cc38a', 'lucide:arrow-up',       true,  1),
  ('Event baru: Pekan Tanam Pohon', 'Poin pohon dihitung 2× sampai 12 Juli.',        '2 jam lalu',  'Event',      '#0e6b46', 'lucide:calendar-days',  true,  2),
  ('Bukti tanam pohon disetujui',   '8 pohon Mahoni · +400 Poin Hijau masuk.',       'Kemarin',     'Verifikasi', '#2D8FE0', 'lucide:check',          false, 3),
  ('Garuda mendekat!',              'Selisih tinggal 310 poin di posisi #2.',        'Kemarin',     'Peringatan', '#C0392B', 'lucide:triangle-alert', false, 4),
  ('Musim berakhir 12 hari lagi',   'Pekan 9 dari 16. Genjot setoran terakhir!',     '2 hari lalu', 'Tenggat',    '#E6B422', 'lucide:clock',          false, 5);

insert into badge (nama, syarat, dapat, urutan) values
  ('Pemilah Pemula', 'Setor pertama',  true,  1),
  ('Rajin Setor',    '10× setor',      true,  2),
  ('Penjaga Pohon',  'Tanam 5 pohon',  true,  3),
  ('100 Kg Club',    '100 kg sampah',  true,  4),
  ('Juara Pekan',    '#1 sepekan',     true,  5),
  ('Hat-trick',      '3× juara pekan', false, 6),
  ('Sultan Kompos',  '50 kg organik',  false, 7),
  ('Rimbawan',       '25 pohon',       false, 8);

insert into riwayat_tim (kelas_id, teks, waktu, poin, warna, urutan) values
  ('rpl', 'Setor 12,5 kg plastik',       'Hari ini · 09.42', '+150', '#0e6b46', 1),
  ('rpl', '8 pohon Mahoni diverifikasi', 'Kemarin',          '+400', '#4cc38a', 2),
  ('rpl', 'Naik ke peringkat #1',        '2 hari lalu',      null,   '#E6B422', 3),
  ('rpl', 'Setor 9,0 kg organik',        '3 hari lalu',      '+72',  '#0e6b46', 4);

insert into laporan_bulanan (bulan, kg, urutan) values
  ('Feb', 210, 1), ('Mar', 326, 2), ('Apr', 421, 3), ('Mei', 295, 4), ('Jun', 484, 5);

insert into laporan_spesies (nama, jumlah, co2, persen, warna, urutan) values
  ('Trembesi', 96, 2736, 34, '#4cc38a', 1),
  ('Mahoni',   84, 1512, 30, '#0e6b46', 2),
  ('Mangga',   71,  852, 25, '#E6B422', 3),
  ('Ketapang', 31,  465, 11, '#C77F3E', 4);

-- Pusat peta bawaan: SMK Negeri 26 Jakarta (Rawamangun) — sumber OpenStreetMap.
insert into pengaturan (kunci, nilai) values
  ('lokasi_sekolah', '{"lat":-6.194564,"lng":106.887387,"zoom":18}');

-- Isi artikel identik dengan shared/data/artikel.ts.
insert into artikel (slug, judul, kategori, menit_baca, ringkasan, tanggal, thumb_tag, thumb_alt, isi, sumber) values
  ('memilah-sampah-organik-anorganik', 'Memilah Sampah Organik & Anorganik dengan Benar', 'sampah', 5,
   'Langkah dasar yang sering terlewat: memisahkan sampah sejak dari sumbernya supaya mudah diolah dan bernilai poin.',
   '2026-02-09', 'foto · tempat sampah terpilah', 'dua tempat sampah berlabel organik dan anorganik',
   '[{"jenis":"paragraf","teks":"Memilah sampah adalah fondasi dari semua program daur ulang. Tanpa pemilahan yang benar di sumbernya, sampah organik dan anorganik bercampur dan jauh lebih sulit diolah."},{"jenis":"judul","teks":"Kenali tiga kelompok utama"},{"jenis":"poin","teks":"Organik — sisa makanan, daun, kulit buah. Bisa dijadikan kompos."},{"jenis":"poin","teks":"Anorganik — plastik, kertas, logam, kaca. Bisa didaur ulang atau disetor."},{"jenis":"poin","teks":"Residu — popok, puntung, styrofoam. Sulit didaur ulang, dibuang terakhir."},{"jenis":"paragraf","teks":"Saat menyetor ke event LigaLestari, sampah yang sudah terpilah ditimbang lebih cepat dan langsung dihitung jadi Poin Hijau untuk kelasmu."},{"jenis":"judul","teks":"Tips di kelas"},{"jenis":"paragraf","teks":"Sediakan minimal dua wadah berbeda warna, beri label jelas, dan tunjuk piket harian untuk mengecek isinya. Kebiasaan kecil ini menjaga kualitas setoran tetap tinggi."}]',
   '["KLHK — Sistem Informasi Pengelolaan Sampah Nasional (SIPSN), 2023.","Kementerian LHK — Panduan Pemilahan Sampah Rumah Tangga."]'),
  ('trembesi-raksasa-penyerap-karbon', 'Trembesi: Sang Raksasa Penyerap Karbon', 'pohon', 4,
   'Satu pohon trembesi dewasa diperkirakan menyerap puluhan ribu kilogram CO₂ per tahun. Kenapa ia begitu istimewa?',
   '2026-02-16', 'foto · pohon trembesi rindang', 'pohon trembesi besar dengan tajuk melebar',
   '[{"jenis":"paragraf","teks":"Trembesi (Samanea saman) terkenal sebagai salah satu pohon peneduh dengan daya serap karbon tertinggi. Tajuknya yang lebar dan pertumbuhannya cepat membuatnya favorit untuk penghijauan."},{"jenis":"judul","teks":"Mengapa serapannya tinggi"},{"jenis":"paragraf","teks":"Estimasi yang banyak dikutip menyebut satu trembesi dewasa mampu menyerap sekitar 28.488 kg CO₂ per tahun. Angka ini adalah estimasi maksimum pada kondisi ideal dan akan bervariasi menurut usia serta lingkungan."},{"jenis":"judul","teks":"Catatan penanaman"},{"jenis":"poin","teks":"Butuh ruang luas — tajuk dewasa bisa melebar belasan meter."},{"jenis":"poin","teks":"Cocok untuk lapangan atau tepi area sekolah, bukan dekat bangunan."},{"jenis":"paragraf","teks":"Karena dampaknya besar, setiap trembesi yang ditanam di LigaLestari memberi kontribusi CO₂ yang signifikan pada total dampak kelasmu."}]',
   '["Endes N. Dahlan, IPB — kajian serapan CO₂ pohon trembesi.","Lihat halaman Metodologi Dampak LigaLestari untuk rincian perhitungan."]'),
  ('botol-plastik-jadi-ecobrick', 'Dari Botol Plastik ke Ecobrick', 'sampah', 6,
   'Mengubah sampah plastik lunak jadi bata padat yang bisa dipakai membuat bangku dan taman sekolah.',
   '2026-02-23', 'foto · ecobrick warna-warni', 'botol plastik diisi padat menjadi ecobrick',
   '[{"jenis":"paragraf","teks":"Ecobrick adalah botol plastik yang diisi padat dengan sampah plastik bersih dan kering hingga menjadi bata yang kokoh. Ini cara menahan plastik agar tidak mencemari lingkungan."},{"jenis":"judul","teks":"Cara membuat"},{"jenis":"poin","teks":"Kumpulkan botol seragam dan plastik bersih-kering."},{"jenis":"poin","teks":"Potong kecil plastik, masukkan, padatkan dengan tongkat."},{"jenis":"poin","teks":"Timbang — botol 600 ml idealnya berisi ±200 gram plastik."},{"jenis":"paragraf","teks":"Ecobrick yang padat bisa dirangkai jadi bangku, meja, atau pembatas taman. Selain mengurangi sampah, hasilnya bermanfaat langsung untuk sekolah."}]',
   '["Global Ecobrick Alliance — panduan kepadatan ecobrick."]'),
  ('cara-menanam-pohon-optimal', 'Cara Menanam Pohon agar Tumbuh Optimal', 'pohon', 5,
   'Menanam itu mudah, merawat agar hidup itu kuncinya. Panduan singkat dari lubang tanam sampai perawatan awal.',
   '2026-03-02', 'foto · penanaman bibit', 'tangan menanam bibit pohon di lubang tanam',
   '[{"jenis":"paragraf","teks":"Keberhasilan penghijauan tidak diukur dari jumlah yang ditanam, tapi dari berapa yang bertahan hidup. Perawatan bulan-bulan pertama menentukan."},{"jenis":"judul","teks":"Langkah dasar"},{"jenis":"poin","teks":"Gali lubang dua kali lebar polybag bibit."},{"jenis":"poin","teks":"Lepas polybag hati-hati tanpa merusak akar."},{"jenis":"poin","teks":"Timbun, padatkan pelan, lalu siram sampai lembap."},{"jenis":"poin","teks":"Beri ajir/penyangga bila bibit masih lemah."},{"jenis":"paragraf","teks":"Catat tanggal tanam dan lokasinya. Di LigaLestari, data ini muncul di Peta Persebaran Pohon sebagai bukti dampak kelasmu."}]',
   '["Kementerian LHK — pedoman teknis penanaman pohon."]'),
  ('kompos-sisa-makanan-kantin', 'Kompos dari Sisa Makanan Kantin', 'sampah', 7,
   'Sisa makanan kantin bukan masalah, tapi bahan baku. Ubah jadi kompos untuk taman sekolah.',
   '2026-03-09', 'foto · komposter sekolah', 'wadah komposter berisi sisa organik dan daun',
   '[{"jenis":"paragraf","teks":"Sampah organik mendominasi timbulan sampah sekolah. Dengan pengomposan sederhana, sisa makanan berubah jadi pupuk gratis sekaligus mengurangi beban TPA."},{"jenis":"judul","teks":"Metode sederhana"},{"jenis":"poin","teks":"Cacah sisa organik agar cepat terurai."},{"jenis":"poin","teks":"Selang-seling lapisan basah (sisa makanan) dan kering (daun)."},{"jenis":"poin","teks":"Aduk berkala, jaga kelembapan seperti spons diperas."},{"jenis":"paragraf","teks":"Dalam beberapa minggu kompos matang berbau tanah dan siap menyuburkan tanaman. Volume sampah yang dikelola juga dihitung sebagai kontribusi kelas."}]',
   '["KLHK — panduan pengomposan skala komunitas."]'),
  ('mengenal-pohon-angsana', 'Mengenal Pohon Angsana di Lingkungan Sekolah', 'pohon', 3,
   'Peneduh jalan yang umum, tumbuh cepat, dan ramah dirawat — pilihan aman untuk penghijauan pemula.',
   '2026-03-16', 'foto · pohon angsana berbunga', 'pohon angsana dengan bunga kuning',
   '[{"jenis":"paragraf","teks":"Angsana (Pterocarpus indicus) sering dijumpai sebagai pohon peneduh jalan. Pertumbuhannya cepat dan perawatannya relatif mudah, cocok untuk area sekolah."},{"jenis":"judul","teks":"Karakter singkat"},{"jenis":"poin","teks":"Bunga kuning harum saat musimnya."},{"jenis":"poin","teks":"Tajuk rindang, memberi keteduhan cepat."},{"jenis":"paragraf","teks":"Estimasi serapannya sekitar 11,1 kg CO₂ per pohon per tahun — lebih kecil dari trembesi, tapi mudah hidup dan tetap berkontribusi pada total dampak."}]',
   '["Lihat tabel acuan di halaman Metodologi Dampak LigaLestari."]');

-- Selaraskan urutan identitas setelah seed dengan id eksplisit.
select setval(pg_get_serial_sequence('bukti_tanam', 'id'), (select max(id) from bukti_tanam));
