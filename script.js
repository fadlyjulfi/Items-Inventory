const SUPABASE_URL = "https://flsjawyahxsoqdewtynd.supabase.co";
const SUPABASE_KEY =
  "4OTgyNH0.DolOithfUAILJm3WAuZQzHWyYxMAjVRmJlGVzoINL3s";

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
  const res = await fetch(`${SUPABASE_URL}/rest/v1/barang?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  const data = await res.json();
  const filtered = data.filter(item =>
    item.nama.toLowerCase().includes(searchFilter.toLowerCase()) &&
    item.kategori.toLowerCase().includes(kategoriFilter.toLowerCase())
  );
  renderItems(filtered);
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
        <button onclick="editItem('${item.id}', '${item.nama}', '${item.lokasi}', ${item.stok}, '${item.kategori || ""}')">Edit</button>
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

  if (editingId) {
    await fetch(`${SUPABASE_URL}/rest/v1/barang?id=eq.${editingId}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nama, lokasi, stok, kategori })
    });
    editingId = null;
  } else {
    await fetch(`${SUPABASE_URL}/rest/v1/barang`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nama, lokasi, stok, kategori })
    });
  }

  form.reset();
  fetchData(searchInput.value, kategoriFilterInput.value);
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
    await fetch(`${SUPABASE_URL}/rest/v1/barang?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });
    fetchData(searchInput.value, kategoriFilterInput.value);
  }
}

searchInput.addEventListener("input", () => {
  fetchData(searchInput.value, kategoriFilterInput.value);
});

kategoriFilterInput.addEventListener("change", () => {
  fetchData(searchInput.value, kategoriFilterInput.value);
});

fetchData("", "");
              
