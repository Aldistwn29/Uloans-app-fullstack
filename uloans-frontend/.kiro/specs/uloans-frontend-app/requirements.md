# Requirements Document

## Introduction

ULoans Frontend adalah aplikasi web React + Vite untuk sistem manajemen pinjaman digital. Aplikasi ini menyediakan antarmuka pengguna bagi nasabah untuk mendaftar, masuk, melihat profil, mengajukan pinjaman, memantau status pinjaman, dan membatalkan pengajuan yang masih dalam status `PENDING`. Frontend mengonsumsi API Express yang berjalan di `http://localhost:8080/api/v1` dan tidak boleh mengimplementasikan aturan finansial, otorisasi kepemilikan, atau keputusan kredit di sisi klien — semua aturan tersebut sepenuhnya dikendalikan oleh backend.

Stack yang sudah terpasang: React 19, Vite 8, React Router DOM v7, Axios, Tailwind CSS v4 (via `@tailwindcss/vite`), Lucide React.

---

## Glossary

- **App**: Aplikasi frontend ULoans secara keseluruhan.
- **Router**: Komponen React Router DOM yang mengelola navigasi halaman.
- **API_Client**: Instance Axios terpusat yang dikonfigurasi dengan base URL, interceptor autentikasi, dan penanganan error.
- **Auth_Service**: Modul yang mengenkapsulasi pemanggilan `POST /auth/register` dan `POST /auth/login`.
- **Profile_Service**: Modul yang mengenkapsulasi pemanggilan `GET /profile`.
- **Loan_Service**: Modul yang mengenkapsulasi pemanggilan `GET /loans`, `POST /loans`, dan `PATCH /loans/:id/cancel`.
- **Session_Manager**: Modul yang bertanggung jawab menyimpan, membaca, dan menghapus token autentikasi selama sesi pengguna berlangsung.
- **RegistrationForm**: Komponen halaman untuk pendaftaran akun nasabah baru.
- **LoginForm**: Komponen halaman untuk masuk ke akun.
- **ProfilePage**: Komponen halaman yang menampilkan data profil nasabah yang sedang login.
- **LoanListPage**: Komponen halaman yang menampilkan daftar pinjaman nasabah.
- **CreateLoanForm**: Komponen form untuk mengajukan pinjaman baru.
- **PrivateRoute**: Komponen route guard yang mengalihkan pengguna yang belum autentikasi ke halaman login.
- **LoanStatusBadge**: Komponen UI yang menampilkan status pinjaman dengan label teks dan warna semantik.
- **Nasabah**: Pengguna akhir yang sudah terdaftar dan terautentikasi.
- **Token**: Credential autentikasi yang dikembalikan backend setelah login berhasil — field-nya harus diverifikasi dari respons API sebelum diimplementasikan.
- **PENDING**: Status pinjaman yang berarti pengajuan sedang menunggu keputusan; satu-satunya status di mana pembatalan diizinkan.
- **APPROVED**: Status pinjaman yang berarti pengajuan telah disetujui.
- **REJECTED**: Status pinjaman yang berarti pengajuan telah ditolak.
- **CANCELLED**: Status pinjaman yang berarti pengajuan telah dibatalkan oleh nasabah.

---

## Requirements

### Requirement 1: Fondasi Aplikasi dan Sistem Routing

**User Story:** Sebagai pengembang, saya ingin aplikasi memiliki shell routing yang berfungsi dengan layout global dan proteksi route, agar semua halaman dapat dirender dengan navigasi yang konsisten dan unauthenticated users diarahkan ke login.

#### Acceptance Criteria

1. THE App SHALL merender konten halaman yang sesuai berdasarkan URL path saat ini menggunakan React Router DOM.
2. THE Router SHALL mendefinisikan route publik untuk `/register` dan `/login` yang dapat diakses tanpa autentikasi.
3. THE Router SHALL mendefinisikan route privat untuk `/dashboard`, `/profile`, dan `/loans/create` yang hanya dapat diakses oleh pengguna yang sudah terautentikasi.
4. WHEN pengguna yang belum terautentikasi mencoba mengakses route privat, THE PrivateRoute SHALL mengalihkan pengguna ke halaman `/login`.
5. WHEN pengguna yang sudah terautentikasi mengakses `/login` atau `/register`, THE Router SHALL mengalihkan pengguna ke `/dashboard`.
6. THE App SHALL menampilkan layout yang responsif yang berfungsi pada lebar layar mobile (≥320px) dan desktop (≥1024px) tanpa scrolling horizontal.
7. THE App SHALL mendefinisikan Inter sebagai font antarmuka utama dan IBM Plex Mono sebagai font monospace finansial di dalam konfigurasi tipografi Tailwind CSS v4, sehingga kedua font tersedia sebagai utility class di seluruh aplikasi.
8. THE App SHALL menerapkan token warna, tipografi, spacing, dan radius dari panduan desain secara terpusat di satu file konfigurasi Tailwind CSS v4 (misalnya `src/index.css` dengan `@theme`), bukan didefinisikan secara terpencar di masing-masing komponen.
9. WHEN aplikasi pertama kali dimuat dan tidak ada token tersimpan di Session_Manager, THE PrivateRoute SHALL mengalihkan pengguna ke `/login` segera tanpa merender konten halaman privat.
10. WHEN aplikasi pertama kali dimuat dan token tersedia di Session_Manager, THE PrivateRoute SHALL menampilkan indikator loading sementara request pertama yang terautentikasi sedang berlangsung, dan baru mengalihkan ke `/login` jika backend mengembalikan HTTP 401.

---

### Requirement 2: API Client Terpusat

**User Story:** Sebagai pengembang, saya ingin ada satu instance Axios terpusat yang menangani konfigurasi HTTP, injeksi token, dan normalisasi error, agar komponen dan service tidak menduplikasi konfigurasi transport.

#### Acceptance Criteria

1. THE API_Client SHALL dikonfigurasi dengan base URL `http://localhost:8080/api/v1` di satu lokasi terpusat.
2. THE API_Client SHALL menyertakan request interceptor yang secara otomatis menambahkan header `Authorization: Bearer <token>` pada setiap request ke endpoint privat (semua endpoint kecuali `POST /auth/register` dan `POST /auth/login`), menggunakan token yang dibaca dari Session_Manager — ketika token adalah null, undefined, atau string kosong, header Authorization tidak ditambahkan.
3. WHEN token tidak tersedia (null, undefined, atau string kosong) di Session_Manager, THE API_Client SHALL mengirim request tanpa header Authorization.
4. THE API_Client SHALL menyertakan response interceptor yang menormalkan error dari format envelope `{ success: false, message: "..." }` menjadi objek Error yang konsisten dengan properti `message: string` yang dapat dibaca dan properti `isNetworkError: boolean` untuk membedakan jenis error.
5. WHEN API mengembalikan status HTTP 401 dan path URL saat ini bukan `/login`, THE API_Client SHALL menghapus sesi yang tersimpan dan mengalihkan pengguna ke halaman `/login` satu kali.
6. THE API_Client SHALL membedakan error jaringan (tidak ada koneksi, `isNetworkError: true`) dari error respons API (4xx/5xx, `isNetworkError: false`) dan menyediakan properti `isNetworkError` yang berbeda untuk masing-masing kondisi tersebut.
7. IF response tidak memiliki field `message`, THEN THE API_Client SHALL menggunakan pesan fallback non-kosong yang menyebutkan kategori status HTTP (misalnya "Terjadi kesalahan pada permintaan" untuk 4xx, "Terjadi kesalahan pada server" untuk 5xx).

---

### Requirement 3: Registrasi Nasabah

**User Story:** Sebagai pengunjung baru, saya ingin mendaftar akun menggunakan nama, email, dan password, agar saya dapat mengakses layanan pinjaman ULoans.

#### Acceptance Criteria

1. THE RegistrationForm SHALL menampilkan field input untuk nama lengkap, alamat email, dan kata sandi, masing-masing dengan label yang terlihat dan terasosiasi secara programatik menggunakan atribut `for`/`htmlFor` atau `aria-label`.
2. WHEN pengguna mengirim form, THE RegistrationForm SHALL memvalidasi bahwa nama memiliki minimal 2 dan maksimal 100 karakter sebelum mengirim request ke API.
3. WHEN pengguna mengirim form, THE RegistrationForm SHALL memvalidasi bahwa email memiliki format yang secara sintaksis valid (sesuai standar validasi HTML5 `type="email"`) sebelum mengirim request ke API.
4. WHEN pengguna mengirim form, THE RegistrationForm SHALL memvalidasi bahwa password memiliki minimal 6 dan maksimal 128 karakter sebelum mengirim request ke API.
5. IF validasi sisi klien gagal, THEN THE RegistrationForm SHALL menampilkan pesan error yang dikaitkan dengan field yang relevan tanpa mengirim request ke API.
6. WHILE form sedang diproses, THE RegistrationForm SHALL menonaktifkan tombol submit dan menampilkan indikator loading untuk mencegah pengiriman duplikat.
7. WHEN Auth_Service mengembalikan respons sukses dari `POST /auth/register` dan respons mengandung token autentikasi, THE RegistrationForm SHALL menyimpan token ke Session_Manager dan mengalihkan pengguna ke `/dashboard`.
8. WHEN Auth_Service mengembalikan respons sukses dari `POST /auth/register` dan respons tidak mengandung token autentikasi, THE RegistrationForm SHALL mengalihkan pengguna ke `/login`.
9. IF API mengembalikan error karena email sudah terdaftar, THEN THE RegistrationForm SHALL menampilkan pesan yang dapat dipahami tanpa mengekspos detail implementasi backend.
10. IF terjadi error jaringan atau server, THEN THE RegistrationForm SHALL menampilkan pesan error yang jelas dan mempertahankan nilai nama dan email yang telah diisi pengguna — field password tidak dipertahankan karena alasan keamanan.
11. THE RegistrationForm SHALL menyediakan tautan navigasi ke halaman login untuk pengguna yang sudah memiliki akun.
12. THE RegistrationForm SHALL menggunakan `type="email"` untuk field email dan `type="password"` untuk field kata sandi.

---

### Requirement 4: Login Nasabah

**User Story:** Sebagai nasabah terdaftar, saya ingin masuk menggunakan email dan password, agar saya mendapatkan akses ke fitur-fitur yang memerlukan autentikasi.

#### Acceptance Criteria

1. THE LoginForm SHALL menampilkan field input untuk email (`type="email"`) dan password (`type="password"`) dengan label yang terlihat dan terasosiasi secara programatik menggunakan atribut `for`/`htmlFor` atau `aria-label`.
2. WHEN pengguna mengirim form, THE LoginForm SHALL memvalidasi bahwa field email tidak kosong dan memiliki format email yang sintaksis valid, serta field password tidak kosong, sebelum mengirim request ke API.
3. WHILE form sedang diproses, THE LoginForm SHALL menonaktifkan tombol submit dan menampilkan indikator loading untuk mencegah pengiriman duplikat.
4. WHEN Auth_Service menerima respons sukses dari `POST /auth/login`, THE Session_Manager SHALL menyimpan token autentikasi sehingga API_Client dapat membacanya untuk menambahkan header `Authorization: Bearer` pada request berikutnya.
5. WHEN Auth_Service menerima respons sukses, THE LoginForm SHALL mengalihkan pengguna ke `/dashboard`.
6. IF API mengembalikan error autentikasi (kredensial salah), THEN THE LoginForm SHALL menampilkan pesan error yang jelas tanpa mengekspos detail seperti "email tidak ditemukan" vs "password salah" secara terpisah, dan SHALL mengosongkan field password sementara mempertahankan nilai email yang telah diisi.
7. IF terjadi error jaringan, THEN THE LoginForm SHALL menampilkan pesan error koneksi yang dapat dibedakan dari error autentikasi.
8. THE LoginForm SHALL menyediakan tautan navigasi ke halaman registrasi untuk pengguna baru.
9. THE Session_Manager SHALL tidak mencatat token, password, atau credential sensitif ke dalam console atau log.

> **Open decision:** Field token pada respons login (`token`, `accessToken`, atau lainnya) harus diverifikasi dari source backend sebelum implementasi interceptor.

---

### Requirement 5: Manajemen Sesi dan Logout

**User Story:** Sebagai nasabah yang sudah login, saya ingin sesi saya dipertahankan selama saya menggunakan aplikasi dan dapat keluar dengan bersih, agar data saya tetap aman ketika saya selesai.

#### Acceptance Criteria

1. THE Session_Manager SHALL menyimpan token menggunakan mekanisme yang telah diverifikasi kompatibel dengan konfigurasi CORS dan CSRF backend, sehingga token dapat dibaca oleh API_Client untuk membentuk header `Authorization: Bearer` pada request berikutnya.
2. WHEN pengguna memilih logout, THE Session_Manager SHALL menghapus semua data sesi yang tersimpan.
3. WHEN pengguna logout, THE Router SHALL mengalihkan pengguna ke halaman `/login`.
4. WHILE token tersedia di Session_Manager, THE App SHALL mempertahankan status autentikasi pengguna di seluruh reload halaman tanpa meminta login ulang, selama token masih valid menurut backend.
5. WHEN backend mengembalikan HTTP 401 pada request apapun dan sesi belum ditandai sebagai berakhir, THE Session_Manager SHALL menandai sesi sebagai berakhir, menghapus token yang tersimpan, dan mengalihkan pengguna ke `/login` satu kali.
6. WHEN 401 diterima setelah sesi sudah ditandai berakhir (misalnya dari request paralel atau saat sudah di halaman `/login`), THE Session_Manager SHALL mengabaikan 401 tersebut tanpa memicu redirect tambahan.
7. THE App SHALL menampilkan kontrol logout yang dapat dijangkau dengan maksimal dua interaksi (misalnya satu klik untuk membuka menu, satu klik untuk konfirmasi logout) dari halaman mana pun yang memerlukan autentikasi.

---

### Requirement 6: Halaman Profil Nasabah

**User Story:** Sebagai nasabah yang sudah login, saya ingin melihat data profil akun saya, agar saya dapat memverifikasi informasi yang terdaftar.

#### Acceptance Criteria

1. WHEN ProfilePage dimuat, THE ProfilePage SHALL mengirim request `GET /profile` melalui Profile_Service menggunakan token autentikasi dari Session_Manager.
2. WHILE request profil sedang berlangsung, THE ProfilePage SHALL menampilkan indikator loading yang terlihat dan menonaktifkan elemen interaktif yang bergantung pada data profil; indikator loading dihilangkan segera setelah respons diterima (sukses atau error).
3. WHEN Profile_Service mengembalikan data profil dengan sukses, THE ProfilePage SHALL merender minimal field nama dan email yang dikonfirmasi ada dalam respons API — tidak ada field yang diinvensi atau diasumsikan selain yang telah diverifikasi dari backend.
4. IF Profile_Service mengembalikan error 401, THEN THE ProfilePage SHALL mengarahkan pengguna ke `/login` melalui mekanisme 401 terpusat di API_Client.
5. IF Profile_Service mengembalikan error jaringan atau server (non-401), THEN THE ProfilePage SHALL menampilkan pesan yang mengidentifikasi jenis kegagalan beserta tombol "Coba lagi" yang memicu ulang request `GET /profile` melalui Profile_Service.
6. THE ProfilePage SHALL menerapkan token warna, tipografi, spacing, dan radius dari konfigurasi Tailwind CSS v4 terpusat, konsisten dengan halaman-halaman lain di aplikasi.

---

### Requirement 7: Daftar Pinjaman Nasabah

**User Story:** Sebagai nasabah yang sudah login, saya ingin melihat seluruh daftar pengajuan pinjaman saya beserta statusnya, agar saya dapat memantau progres setiap pengajuan.

#### Acceptance Criteria

1. WHEN LoanListPage dimuat, THE LoanListPage SHALL mengirim request `GET /loans` melalui Loan_Service menggunakan token autentikasi.
2. WHILE request daftar pinjaman sedang berlangsung, THE LoanListPage SHALL menampilkan indikator loading.
3. WHEN Loan_Service mengembalikan daftar yang tidak kosong, THE LoanListPage SHALL menampilkan setiap pinjaman dengan minimal informasi: jumlah pinjaman (amount), tenor (dalam bulan), status, dan tanggal pengajuan — diformat sesuai ketentuan di Requirement 7 kriteria 8 dan pemetaan status di kriteria 6.
4. WHEN Loan_Service mengembalikan daftar kosong, THE LoanListPage SHALL menampilkan pesan yang menjelaskan bahwa belum ada pengajuan pinjaman, beserta tautan atau tombol yang mengarahkan ke halaman `/loans/create`.
5. WHEN daftar pinjaman berhasil dimuat, THE LoanListPage SHALL menampilkan status setiap pinjaman menggunakan LoanStatusBadge yang menerjemahkan nilai backend ke label Bahasa Indonesia berikut: `PENDING` → "Menunggu keputusan", `APPROVED` → "Disetujui", `REJECTED` → "Ditolak", `CANCELLED` → "Dibatalkan".
6. THE LoanStatusBadge SHALL mengomunikasikan status menggunakan teks label dan warna latar sesuai pemetaan: `PENDING` (bg `#FEF3C7`, teks `#92400E`), `APPROVED` (bg `#DCFCE7`, teks `#166534`), `REJECTED` (bg `#FEE2E2`, teks `#991B1B`), `CANCELLED` (bg `#F1F5F9`, teks `#475569`) — teks label selalu hadir, tidak hanya warna.
7. IF request daftar pinjaman gagal karena error jaringan atau server, THEN THE LoanListPage SHALL menampilkan pesan error yang menggantikan konten daftar beserta tombol "Coba lagi" yang memicu ulang request `GET /loans` melalui Loan_Service.
8. THE LoanListPage SHALL memformat nilai jumlah pinjaman sebagai Rupiah Indonesia menggunakan `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })`.
9. WHEN daftar pinjaman berhasil dimuat, THE LoanListPage SHALL menampilkan aksi "Batalkan" hanya pada baris pinjaman yang memiliki status `PENDING`.

---

### Requirement 8: Formulir Pengajuan Pinjaman

**User Story:** Sebagai nasabah yang sudah login, saya ingin mengajukan pinjaman baru dengan memasukkan jumlah dan tenor, agar permohonan kredit saya dapat diproses oleh sistem ULoans.

#### Acceptance Criteria

1. THE CreateLoanForm SHALL menampilkan field input untuk jumlah pinjaman (amount) dan pilihan tenor (3, 6, 12, atau 24 bulan), masing-masing dengan label yang terasosiasi secara programatik menggunakan atribut `for`/`htmlFor` atau `aria-label`.
2. WHEN pengguna mengirim form, THE CreateLoanForm SHALL memvalidasi bahwa amount adalah angka positif, minimal Rp500.000, dan maksimal Rp500.000.000 sebelum mengirim request ke API.
3. WHEN pengguna mengirim form, THE CreateLoanForm SHALL memvalidasi bahwa tenor yang dipilih adalah salah satu dari nilai yang diizinkan: 3, 6, 12, atau 24 bulan.
4. IF validasi sisi klien gagal, THEN THE CreateLoanForm SHALL menampilkan pesan error yang dikaitkan dengan field yang relevan tanpa mengirim request ke API.
5. WHILE form sedang diproses, THE CreateLoanForm SHALL menonaktifkan tombol submit dan menampilkan indikator loading untuk mencegah pengajuan duplikat.
6. WHEN Loan_Service mengembalikan respons sukses dari `POST /loans`, THE LoanListPage SHALL diperbarui untuk mencerminkan pinjaman yang baru dibuat — baik melalui refetch atau dengan menambahkan data dari respons API ke daftar yang ada.
7. WHEN Loan_Service mengembalikan respons sukses, THE CreateLoanForm SHALL mengarahkan pengguna ke halaman daftar pinjaman (`/dashboard` atau `/loans`).
8. IF API mengembalikan error validasi, THEN THE CreateLoanForm SHALL menampilkan pesan error backend yang dikaitkan dengan field yang relevan dan mempertahankan nilai yang telah diisi pengguna.
9. IF terjadi error jaringan atau server, THEN THE CreateLoanForm SHALL menampilkan pesan yang mengindikasikan kegagalan pengiriman dan mempertahankan nilai form agar pengguna tidak perlu mengisi ulang.
10. THE CreateLoanForm SHALL menggunakan `type="number"` atau `inputmode="numeric"` untuk field amount, dengan placeholder yang menunjukkan format Rupiah dan batas minimum Rp500.000 serta maksimum Rp500.000.000.

---

### Requirement 9: Pembatalan Pinjaman

**User Story:** Sebagai nasabah, saya ingin membatalkan pengajuan pinjaman yang masih berstatus PENDING, agar saya tidak terikat pada pengajuan yang sudah tidak relevan.

#### Acceptance Criteria

1. THE LoanListPage SHALL menampilkan tombol atau aksi "Batalkan" hanya untuk pinjaman yang statusnya `PENDING`, sebagai affordance UX — bukan sebagai kontrol otorisasi.
2. WHEN nasabah memicu aksi batalkan pada pinjaman PENDING, THE LoanListPage SHALL meminta konfirmasi eksplisit dari pengguna sebelum mengirim request ke API.
3. WHEN pengguna mengonfirmasi pembatalan, THE Loan_Service SHALL mengirim request `PATCH /loans/:id/cancel` menggunakan ID pinjaman yang sesuai.
4. WHILE request pembatalan sedang berlangsung, THE LoanListPage SHALL menampilkan indikator loading pada aksi pembatalan dan mencegah aksi pembatalan duplikat untuk pinjaman yang sama.
5. WHEN Loan_Service mengembalikan respons sukses dari `PATCH /loans/:id/cancel`, THE LoanListPage SHALL memperbarui tampilan pinjaman untuk mencerminkan status terbaru yang dikembalikan oleh backend.
6. IF backend menolak pembatalan (misalnya pinjaman tidak lagi berstatus PENDING atau nasabah bukan pemilik), THEN THE LoanListPage SHALL menampilkan pesan error backend yang dapat dipahami, seperti `Hanya pinjaman berstatus PENDING yang dapat dibatalkan`.
7. IF terjadi error jaringan saat pembatalan, THEN THE LoanListPage SHALL menampilkan pesan error koneksi tanpa mengubah status pinjaman di tampilan UI.
8. THE LoanListPage SHALL tidak menampilkan tombol batalkan untuk semua status selain `PENDING` — termasuk `APPROVED`, `REJECTED`, `CANCELLED`, maupun status lain yang tidak dikenal (whitelist approach: tombol hanya muncul ketika `loan.status === 'PENDING'`).

---

### Requirement 10: Penanganan State Asinkron Global

**User Story:** Sebagai nasabah, saya ingin mendapatkan feedback yang jelas untuk setiap operasi asinkron — termasuk loading, sukses, kosong, dan error — agar saya selalu tahu apa yang sedang terjadi di aplikasi.

#### Acceptance Criteria

1. THE App SHALL menampilkan indikator loading yang visible untuk setiap operasi jaringan yang sedang berlangsung di halaman terkait.
2. THE App SHALL menampilkan pesan error yang dapat dibaca oleh manusia untuk setiap kegagalan operasi jaringan, tanpa mengekspos stack trace, detail internal server, atau credential sensitif.
3. THE App SHALL menampilkan empty state yang eksplisit dan intentional untuk setiap koleksi data yang dapat kosong (daftar pinjaman).
4. THE App SHALL menonaktifkan semua tombol submit dan aksi yang sedang dalam proses untuk mencegah permintaan duplikat.
5. IF sebuah request gagal karena timeout atau kehilangan koneksi, THEN THE App SHALL menampilkan pesan error jaringan yang berbeda dari pesan error API, sehingga pengguna dapat membedakan masalah koneksi dari penolakan oleh server.
6. THE App SHALL mempertahankan nilai yang diisi pengguna di form setelah error yang dapat dipulihkan, kecuali ada alasan keamanan yang mengharuskan field dikosongkan.

---

### Requirement 11: Aksesibilitas dan Desain Responsif

**User Story:** Sebagai nasabah, saya ingin dapat menggunakan seluruh fitur aplikasi menggunakan keyboard dan pada berbagai ukuran layar, agar tidak ada hambatan dalam mengakses layanan.

#### Acceptance Criteria

1. THE App SHALL menggunakan elemen HTML semantik (`<nav>`, `<main>`, `<header>`, `<form>`, `<button>`) di seluruh komponen layout dan interaktif.
2. THE App SHALL memastikan setiap kontrol interaktif dapat dioperasikan sepenuhnya menggunakan keyboard, termasuk navigasi dengan Tab, aktivasi dengan Enter/Space, dan penutupan modal dengan Escape.
3. THE App SHALL memastikan setiap input form memiliki label yang terasosiasi secara programatik menggunakan atribut `for`/`id` atau `aria-label`.
4. THE App SHALL tidak menggunakan warna saja untuk mengomunikasikan status pinjaman atau kondisi error — setiap perbedaan warna SHALL disertai dengan teks label atau ikon dengan accessible name.
5. THE App SHALL mempertahankan focus indicator yang terlihat untuk semua elemen interaktif, menggunakan Primary Blue (`#00529B`) sebagai warna outline focus.
6. THE App SHALL memastikan rasio kontras teks utama terhadap latar belakang memenuhi minimum WCAG 2.1 AA.
7. THE App SHALL merender layout yang dapat digunakan pada lebar layar minimal 320px tanpa scrolling horizontal.
8. WHERE animasi atau transisi digunakan, THE App SHALL menghormati preferensi `prefers-reduced-motion` dengan menonaktifkan atau meminimalkan motion.

---

### Requirement 12: Keamanan Sisi Klien

**User Story:** Sebagai nasabah, saya ingin data dan credential saya tidak terekspos secara tidak sengaja melalui antarmuka frontend, agar privasi dan keamanan akun saya terjaga.

#### Acceptance Criteria

1. THE App SHALL tidak menyimpan password, token, atau data sensitif di console log, local storage yang tidak terenkripsi, atau sumber yang terekspos ke ekstension browser pihak ketiga tanpa evaluasi keamanan yang eksplisit.
2. THE App SHALL tidak mengimplementasikan keputusan otorisasi di sisi klien sebagai pengganti penegakan backend — route guard adalah affordance UX, bukan kontrol keamanan.
3. THE App SHALL tidak merender input pengguna menggunakan `dangerouslySetInnerHTML` atau metode injeksi HTML yang tidak aman.
4. THE App SHALL tidak menyertakan secret, API key, atau credential dalam source code atau environment variable yang diekspos ke browser.
5. THE App SHALL tidak memperlihatkan detail error internal server atau stack trace kepada pengguna akhir.
6. IF konten yang dikembalikan oleh API berisi karakter HTML, THEN THE App SHALL merender konten tersebut sebagai teks biasa, bukan sebagai markup HTML.

---

## Correctness Properties

### CP-1: Konsistensi Status Pinjaman (Invariant)

Untuk setiap pinjaman yang ditampilkan di `LoanListPage`, status yang dirender oleh `LoanStatusBadge` harus selalu merupakan translasi langsung dari nilai enum yang dikembalikan backend, bukan hasil inferensi atau kalkulasi sisi klien.

- Invariant: `displayedLabel(loan) = statusMap[loan.status]` untuk semua `loan` di daftar
- `statusMap` hanya boleh berisi: `{ PENDING, APPROVED, REJECTED, CANCELLED }`
- Tombol "Batalkan" muncul jika dan hanya jika `loan.status === 'PENDING'`

**Testability:** yes — property (invariant)

---

### CP-2: Pencegahan Pengiriman Duplikat (Idempotence dari sisi UX)

Setelah tombol submit atau aksi ditekan dan request sedang berlangsung, semua aksi yang sama harus dinonaktifkan hingga request selesai — sukses atau gagal.

- Property: menekan tombol dua kali cepat hanya menghasilkan satu request
- Berlaku untuk: submit registrasi, submit login, submit pengajuan pinjaman, aksi batalkan pinjaman

**Testability:** yes — property (idempotence)

---

### CP-3: Keselamatan Data Form Setelah Error (Invariant)

Setelah request API gagal dengan error yang dapat dipulihkan (4xx atau error jaringan), nilai yang diisi pengguna di form harus tetap terjaga dan tidak dikosongkan, kecuali field password setelah error autentikasi.

- Invariant: `formValues.after_error == formValues.before_submit` untuk semua field non-password pada error yang dapat dipulihkan

**Testability:** yes — property (invariant)

---

### CP-4: Sesi 401 Tidak Membuat Loop Redirect (Error Condition)

Ketika backend mengembalikan HTTP 401, aplikasi harus mengalihkan pengguna ke `/login` tepat satu kali, bahkan jika request 401 terjadi saat sudah berada di halaman `/login`.

- Property: `countRedirectsTo('/login', given_401_response) <= 1`
- Tidak boleh ada loop redirect yang tak terbatas

**Testability:** yes — example (edge case)

---

### CP-5: Format Nilai Finansial (Invariant)

Setiap nilai amount pinjaman yang ditampilkan harus diformat menggunakan `Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })` secara konsisten di seluruh aplikasi.

- Round-trip property: `parse(format(amount))` harus menghasilkan nilai numerik yang setara dengan `amount` semula (dalam batas presisi Rupiah)
- Invariant: semua elemen yang menampilkan nilai finansial menggunakan formatter yang sama

**Testability:** yes — property (round-trip + invariant)

---

### CP-6: Validasi Form Sebelum Request API (Metamorphic)

Untuk setiap kombinasi input pada form registrasi dan pengajuan pinjaman, validasi sisi klien harus memblokir request ketika minimal satu aturan validasi dilanggar, dan mengizinkan request hanya ketika semua aturan terpenuhi.

- Property: `isValid(input) = true` iff `name.length >= 2 AND isValidEmail(email) AND password.length >= 6` (registrasi)
- Property: `isValid(input) = true` iff `amount >= 500000 AND tenor in [3,6,12,24]` (pengajuan pinjaman)
- Metamorphic: menambahkan satu pelanggaran aturan ke input yang valid harus selalu menghasilkan `isValid = false`

**Testability:** yes — property (metamorphic)

---

## Open Decisions (Harus Diverifikasi Sebelum Implementasi)

1. **Field token login**: Nama field credential di respons `POST /auth/login` (`token`, `accessToken`, atau lainnya) harus dikonfirmasi dari source backend sebelum implementasi interceptor.
2. **Strategi penyimpanan token**: Pilihan antara `localStorage`, `sessionStorage`, atau cookie harus dievaluasi terhadap konfigurasi CORS, CSRF, dan deployment backend sebelum diputuskan.
3. **Respons registrasi**: Apakah `POST /auth/register` mengembalikan token sehingga pengguna langsung terotentikasi, atau hanya mengembalikan data user sehingga pengguna perlu diarahkan ke halaman login.
4. **Shape respons profile dan loans**: Field eksak dalam objek profil dan objek pinjaman harus dikonfirmasi dari running backend atau source controller sebelum merender data.
5. **Metode HTTP cancel**: API contract mencatat `PATCH /loans/:id/cancel` tapi tabel endpoint menunjukkan `POST /loans/:id/cancel` — harus dikonfirmasi dari source route backend.
6. **Lokasi penyimpanan token**: Apakah backend mendukung cookie HttpOnly atau hanya Bearer token di header — ini mempengaruhi pilihan implementasi Session_Manager.
