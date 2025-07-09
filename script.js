const itemList = document.getElementById("item-list");
const form = document.getElementById("item-form");
const namaInput = document.getElementById("item-nama");
const lokasiInput = document.getElementById("item-lokasi");
const stokInput = document.getElementById("item-stok");
const kategoriInput = document.getElementById("item-kategori");

let editingId = null;

async function fetchData() {
  try {
    const snapshot = await db.collection("barang").get();
    itemList.innerHTML = "";
    snapshot.forEach(doc => {
      const item = doc.data();
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
    });
  } catch (err) {
    console.error("❌ Gagal fetch data:", err);
  }
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

fetchData();
