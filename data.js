const storedData = JSON.parse(localStorage.getItem("itemData")) || [];

function navigateToData() {
  window.location.href = "data.html";
}

function navigateToDashboard() {
  window.location.href = "dashboard.html";
}

function renderTable() {
  const table = document.getElementById("dataTable");
  let totalCost = 0;

  table.innerHTML = storedData
    .map((item, index) => {
      totalCost += item.cost;

      return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>
                        <!-- Image wrapped in <a> tag with data-toggle="lightbox" for lightbox functionality -->
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
                        <button onclick="editItem(${index})" class="edit-button">
                            <i class="fa-solid fa-edit"></i> Edit
                        </button>
                        <button onclick="deleteItem(${index})" class="delete-button">
                            <i class="fa-solid fa-trash"></i> Hapus
                        </button>
                    </td>
                </tr>
            `;
    })
    .join("");

  // Calculate total cost and display it
  document.getElementById(
    "totalCost"
  ).textContent = `Total Biaya: Rp ${totalCost.toLocaleString()}`;
}

function deleteItem(index) {
  storedData.splice(index, 1);
  localStorage.setItem("itemData", JSON.stringify(storedData));
  renderTable();
}

function editItem(index) {
  const item = storedData[index];
  document.getElementById("itemName").value = item.name;
  document.getElementById("itemUse").value = item.use;
  document.getElementById("itemReason").value = item.reason;
  document.getElementById("itemCost").value = item.cost;
  document.getElementById("itemActivePeriod").value = item.activePeriod;
  const submitButton = document.querySelector("form button");
  submitButton.textContent = "Update";
  submitButton.setAttribute("data-index", index);
}

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

    // Save data to localStorage
    storedData.push({ name, use, reason, cost, image: imageSrc, activePeriod });
    localStorage.setItem("itemData", JSON.stringify(storedData));
    renderTable();
    e.target.reset();
  };

  // Read the image as base64
  reader.readAsDataURL(imageFile);
});

renderTable();

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

$(document).ready(function () {
  $(document).delegate('[data-toggle="lightbox"]', "click", function (event) {
    event.preventDefault();
    $(this).ekkoLightbox();
  });
});
function openImageModal(imageSrc) {
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    const caption = document.getElementById("caption");

    modal.style.display = "block";
    modalImage.src = imageSrc;
    caption.innerHTML = "Klik gambar untuk menutup";
}
