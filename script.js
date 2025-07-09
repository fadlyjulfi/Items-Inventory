const itemList = document.getElementById("item-list");
const form = document.getElementById("item-form");
const namaInput = document.getElementById("item-nama");
const lokasiInput = document.getElementById("item-lokasi");
const stokInput = document.getElementById("item-stok");
const kategoriInput = document.getElementById("item-kategori");
const filterKategori = document.getElementById("filter-kategori");

let editingId = null;

// Ambil semua data barang dan render
async function fetchData() {
  try {
    const snapshot = await db.collection("barang").get();
    const filterValue = filterKategori.value.toLowerCase();
    const kategoriSet = new Set();

    itemList.innerHTML = "";
    snapshot.forEach(doc => {
      const item = doc.data();
      kategoriSet.add(item.kategori);

      const cocok = !filterValue || item.kategori.toLowerCase() === filterValue;
      if (cocok) {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${item.nama}</strong> - ${item.kategori}<br>
          Lokasi: ${item.lokasi}, Stok: ${item.stok}<br>
          <div class="controls">
            <button onclick="editItem('${doc.id}', '${item.nama}', '${item.lokasi}', ${item.stok}, '${item.kategori}')">Edit</button>
            <button onclick="deleteItem('${doc.id}')">Hapus</button>
          </div>
        `;
        itemList.appendChild(li);
      }
    });

    updateKategoriDropdown(Array.from(kategoriSet));
  } catch (err) {
    console.error("❌ Gagal fetch data:", err);
  }
}

// Update isi dropdown kategori (input & filter)
function updateKategoriDropdown(kategoriList) {
  kategoriInput.innerHTML = `<option value="">Pilih Kategori</option>`;
  filterKategori.innerHTML = `<option value="">🔍 Semua Kategori</option>`;

  kategoriList.sort().forEach(kat => {
    const opt1 = document.createElement("option");
    opt1.value = opt1.textContent = kat;
    kategoriInput.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = opt2.textContent = kat;
    filterKategori.appendChild(opt2);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    nama: namaInput.value,
    lokasi: lokasiInput.value,
    stok: parseInt(stokInput.value),
    kategori: kategoriInput.value
  };
  try {
    if (editingId) {
      await db.collection("barang").doc(editingId).update(data);
      editingId = null;
    } else {
      await db.collection("barang").add(data);
    }
    form.reset();
    fetchData();
  } catch (err) {
    console.error("❌ Gagal simpan data:", err);
  }
});

window.editItem = function(id, nama, lokasi, stok, kategori) {
  namaInput.value = nama;
  lokasiInput.value = lokasi;
  stokInput.value = stok;
  kategoriInput.value = kategori;
  editingId = id;
};

window.deleteItem = async function(id) {
  if (confirm("Yakin hapus?")) {
    await db.collection("barang").doc(id).delete();
    fetchData();
  }
};

filterKategori.addEventListener("change", fetchData);
fetchData();
