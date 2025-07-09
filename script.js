// script.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

// 🔧 Konfigurasi Firebase milikmu
const firebaseConfig = {
  apiKey: "AIzaSyD4gf6uFTflyt-xzs6QVATFORt6m9hlErw",
  authDomain: "items-8717a.firebaseapp.com",
  projectId: "items-8717a",
  storageBucket: "items-8717a.firebasestorage.app",
  messagingSenderId: "937383205110",
  appId: "1:937383205110:web:0139a94bb1a414566ff4d7",
  measurementId: "G-C496NQRZTR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const barangRef = collection(db, "barang");

// 🔽 Elemen DOM
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
    const snapshot = await getDocs(barangRef);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const filtered = data.filter(item =>
      item.nama.toLowerCase().includes(searchFilter.toLowerCase()) &&
      item.kategori.toLowerCase().includes(kategoriFilter.toLowerCase())
    );

    renderItems(filtered);
  } catch (err) {
    console.error("❌ FETCH ERROR:", err);
    itemList.innerHTML = "<li style='color:red'>Gagal mengambil data dari Firestore.</li>";
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

// 🔘 Submit Form
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
      const docRef = doc(db, "barang", editingId);
      await updateDoc(docRef, itemData);
      editingId = null;
    } else {
      await addDoc(barangRef, itemData);
    }
    form.reset();
    fetchData(searchInput.value, kategoriFilterInput.value);
  } catch (err) {
    alert("❌ Gagal menyimpan data.");
    console.error(err);
  }
});

window.editItem = function (id, nama, lokasi, stok, kategori) {
  namaInput.value = nama;
  lokasiInput.value = lokasi;
  stokInput.value = stok;
  kategoriInput.value = kategori;
  editingId = id;
};

window.deleteItem = async function (id) {
  if (confirm("Yakin ingin menghapus barang ini?")) {
    try {
      await deleteDoc(doc(db, "barang", id));
      fetchData(searchInput.value, kategoriFilterInput.value);
    } catch (err) {
      alert("❌ Gagal menghapus data.");
      console.error(err);
    }
  }
};

searchInput.addEventListener("input", () => {
  fetchData(searchInput.value, kategoriFilterInput.value);
});

kategoriFilterInput.addEventListener("change", () => {
  fetchData(searchInput.value, kategoriFilterInput.value);
});

// ⏬ Load awal
fetchData("", "");
