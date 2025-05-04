let db; // Variabel untuk menyimpan database SQLite

// Inisialisasi database saat halaman dimuat
initDB();

async function initDB() {
  const SQL = await initSqlJs(); // Load SQL.js
  db = new SQL.Database(); // Buat database baru di memori

  // Buat tabel jika belum ada
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      use TEXT,
      reason TEXT,
      cost REAL,
      image TEXT,
      activePeriod TEXT
    )
  `);

  renderTable(); // Render tabel setelah database siap
}

// Fungsi untuk menyimpan data ke SQLite
document.getElementById("dataForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("itemName").value;
  const use = document.getElementById("itemUse").value;
  const reason = document.getElementById("itemReason").value;
  const cost = parseFloat(document.getElementById("itemCost").value);
  const imageFile = document.getElementById("itemImage").files[0];
  const activePeriod = document.getElementById("itemActivePeriod").value;

  const reader = new FileReader();
  reader.onload = function () {
    const imageSrc = reader.result;

    // Simpan data ke SQLite
    db.run(
      `
      INSERT INTO items (name, use, reason, cost, image, activePeriod)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [name, use, reason, cost, imageSrc, activePeriod]
    );

    renderTable(); // Update tabel setelah data disimpan
    e.target.reset();
  };

  // Read the image as base64
  reader.readAsDataURL(imageFile);
});

// Fungsi untuk menampilkan data dari SQLite ke tabel
function renderTable() {
  const table = document.getElementById("dataTable");
  const stmt = db.prepare("SELECT * FROM items"); // Ambil semua data dari SQLite
  const rows = stmt.getAsObject();

  let totalCost = 0;
  table.innerHTML = rows
    .map((item, index) => {
      totalCost += item.cost;

      return `
        <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>
                <a href="${
                  item.image
                }" data-toggle="lightbox" data-gallery="item-gallery" onclick="openImageModal('${
        item.image
      }')">
                    <img src="${
                      item.image
                    }" alt="Gambar" class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover;">
                </a>
            </td>
            <td>${item.use}</td>
            <td>${item.reason}</td>
            <td>Rp ${item.cost.toLocaleString()}</td>
            <td>${item.activePeriod}</td>
            <td>
                <button onclick="editItem(${item.id})" class="edit-button">
                    <i class="fa-solid fa-edit"></i> Edit
                </button>
                <button onclick="deleteItem(${item.id})" class="delete-button">
                    <i class="fa-solid fa-trash"></i> Hapus
                </button>
            </td>
        </tr>
      `;
    })
    .join("");

  // Hitung total biaya dan tampilkan
  document.getElementById(
    "totalCost"
  ).textContent = `Total Biaya: Rp ${totalCost.toLocaleString()}`;
}

// Fungsi untuk menghapus data dari SQLite
function deleteItem(id) {
  db.run(`DELETE FROM items WHERE id = ?`, [id]); // Hapus data dari SQLite
  renderTable(); // Update tabel setelah data dihapus
}

// Fungsi untuk mengedit data (fungsi ini hanya untuk menampilkan data di form edit)
function editItem(id) {
  const stmt = db.prepare("SELECT * FROM items WHERE id = ?");
  const item = stmt.getAsObject()[0]; // Ambil data item berdasarkan id

  document.getElementById("itemName").value = item.name;
  document.getElementById("itemUse").value = item.use;
  document.getElementById("itemReason").value = item.reason;
  document.getElementById("itemCost").value = item.cost;
  document.getElementById("itemActivePeriod").value = item.activePeriod;

  const submitButton = document.querySelector("form button");
  submitButton.textContent = "Update";
  submitButton.setAttribute("data-id", item.id);
}

// Fungsi untuk logout
function logout() {
  alert("Anda telah logout!");
  window.location.href = "index.html"; // Redirect ke halaman login setelah logout
}

// Fungsi untuk membuka modal gambar
function openImageModal(imageSrc) {
  const modal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const caption = document.getElementById("caption");

  modal.style.display = "block";
  modalImage.src = imageSrc;
  caption.innerHTML = "Klik gambar untuk menutup";
}

// Fungsi untuk menutup modal
function closeModal() {
  const modal = document.getElementById("imageModal");
  modal.style.display = "none";
}

// Plugin Ekko Lightbox
$(document).ready(function () {
  $(document).delegate('[data-toggle="lightbox"]', "click", function (event) {
    event.preventDefault();
    $(this).ekkoLightbox();
  });
});
