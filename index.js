document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Ambil nilai username dan password
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Tentukan username dan password yang benar
    const validUsername = "Tekno_";
    const validPassword = "Cibeber123";

    // Validasi inputan pengguna
    if (username === validUsername && password === validPassword) {
        // Jika valid, arahkan ke halaman dashboard
        window.location.href = "dashboard.html";
    } else {
        // Jika tidak valid, beri peringatan
        alert("Username atau Password salah. Coba lagi.");
    }
});
