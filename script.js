const API_URL = "https://itemsinventory.great-site.net/htdocs/barang.php";

const itemList = document.getElementById("item-list");
const form = document.getElementById("item-form");
const namaInput = document.getElementById("item-nama");
const lokasiInput = document.getElementById("item-lokasi");
const stokInput = document.getElementById("item-stok");
const kategoriInput = document.getElementById("item-kategori");
const searchInput = document.getElementById("search");
const kategoriFilterInput = document.getElementById("filter-kategori");

let editingId = null;

async function fetchData(searchFilter = "", kategoriFilter = "") {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Gagal fetch data");
    const data = await res.json();

    const filtered = data.filter(item =>
      item.nama.toLowerCase().includes(searchFilter.toLowerCase()) &&
      item.kategori.toLowerCase().includes(kategoriFilter.toLowerCase())
    );

    renderItems(filtered);
  } catch (err) {
    console.error("❌ FETCH ERROR:", err);
    itemList.innerHTML = "<li style='color:red'>Gagal mengambil data dari server.</li>";
  }
}

function renderItems(items) {
  itemList.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.nama}</strong><br>
      Kategori: ${item.kategori || "-"}<br>
      Lokasi: ${item.lokasi}<br>
      Stok: ${item.stok}<br>
      <div class="controls">
        <button onclick="editItem('${item.id}', '${item.nama}', '${item.lokasi}', ${item.stok}, '${item.kategori}')">Edit</button>
        <button onclick="deleteItem('${item.id}')">Hapus</button>
      </div>
    `;
    itemList.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nama = namaInput.value.trim();
  const lokasi = lokasiInput.value.trim();
  const stok = parseInt(stokInput.value);
  const kategori = kategoriInput.value.trim();

  if (!nama || !lokasi || isNaN(stok) || !kategori) return;

  const itemData = { nama, lokasi, stok, kategori };

  try {
    if (editingId) {
      await fetch(`${API_URL}?method=patch&id=${editingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData)
      });
      editingId = null;
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData)
      });
    }
    form.reset();
    fetchData(searchInput.value, kategoriFilterInput.value);
  } catch (err) {
    alert("❌ Gagal menyimpan data.");
    console.error(err);
  }
});

function editItem(id, nama, lokasi, stok, kategori) {
  namaInput.value = nama;
  lokasiInput.value = lokasi;
  stokInput.value = stok;
  kategoriInput.value = kategori;
  editingId = id;
}

async function deleteItem(id) {
  if (confirm("Yakin ingin menghapus barang ini?")) {
    try {
      await fetch(`${API_URL}?method=delete&id=${id}`, {
        method: "POST"
      });
      fetchData(searchInput.value, kategoriFilterInput.value);
    } catch (err) {
      alert("❌ Gagal menghapus data.");
      console.error(err);
    }
  }
}

searchInput.addEventListener("input", () => {
  fetchData(searchInput.value, kategoriFilterInput.value);
});

kategoriFilterInput.addEventListener("change", () => {
  fetchData(searchInput.value, kategoriFilterInput.value);
});

fetchData("", "");
