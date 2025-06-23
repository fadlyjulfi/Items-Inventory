const SUPABASE_URL = "https://flsjawyahxsoqdewtynd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsc2phd3lhaHhzb3FkZXd0eW5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2NTczNDcsImV4cCI6MjA2NjIzMzM0N30.x47QB8O-WC0e10FXm3Ih8nUwgv5W0XdKMxM098SRMY";

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
  console.log("🔄 Memanggil fetchData...");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/barang?select=*`, {
  headers: {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`
  }
});

  });
  const data = await res.json();
  console.log("📦 Data dari Supabase:", data);

  const filtered = data.filter(item =>
    item.nama.toLowerCase().includes(searchFilter.toLowerCase()) &&
    item.kategori.toLowerCase().includes(kategoriFilter.toLowerCase())
  );

  renderItems(filtered);
}

function renderItems(items) {
  console.log("🔧 Menampilkan", items.length, "barang");
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

  if (!nama || !lokasi || isNaN(stok) || !kategori) {
    alert("Isi semua data!");
    return;
  }

  const payload = { nama, lokasi, stok, kategori };
  console.log("📤 Menyimpan ke Supabase:", payload);

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/barang`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorData = await res.text();
      alert("❌ Gagal menambahkan: " + errorData);
      return;
    }

    console.log("✅ Data berhasil ditambahkan.");
    form.reset();
    fetchData();

  } catch (err) {
    alert("❌ ERROR: " + err.message);
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
