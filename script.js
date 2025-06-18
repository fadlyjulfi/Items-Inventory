const SUPABASE_URL = "https://evvavlryheowsnvlukww.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dmF2bHJ5aGVvd3Nudmx1a3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyMTM4MjQsImV4cCI6MjA2NTc4OTgyNH0.DolOithfUAILJm3WAuZQzHWyYxMAjVRmJlGVzoINL3s";

const itemList = document.getElementById("item-list");
const form = document.getElementById("item-form");
const namaInput = document.getElementById("item-nama");
const lokasiInput = document.getElementById("item-lokasi");
const stokInput = document.getElementById("item-stok");
const searchInput = document.getElementById("search");

let editingId = null;

async function fetchData(filter = "") {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/barang?select=*`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    }
  });
  const data = await res.json();
  const filtered = data.filter(item =>
    item.nama.toLowerCase().includes(filter.toLowerCase())
  );
  renderItems(filtered);
}

function renderItems(items) {
  itemList.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.nama}</strong><br>
      Lokasi: ${item.lokasi}<br>
      Stok: ${item.stok}<br>
      <div class="controls">
        <button onclick="editItem('${item.id}', '${item.nama}', '${item.lokasi}', ${item.stok})">Edit</button>
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

  if (!nama || !lokasi || isNaN(stok)) return;

  if (editingId) {
    await fetch(`${SUPABASE_URL}/rest/v1/barang?id=eq.${editingId}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nama, lokasi, stok })
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
      body: JSON.stringify({ nama, lokasi, stok })
    });
  }

  form.reset();
  fetchData(searchInput.value);
});

function editItem(id, nama, lokasi, stok) {
  namaInput.value = nama;
  lokasiInput.value = lokasi;
  stokInput.value = stok;
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
    fetchData(searchInput.value);
  }
}

searchInput.addEventListener("input", () => {
  fetchData(searchInput.value);
});

fetchData();
