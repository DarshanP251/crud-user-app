const API_URL = "http://localhost:5000/api/users";

const form = document.getElementById("userForm");
const records = document.getElementById("records");
const layout = document.getElementById("layout");

const uploadBox = document.getElementById("uploadBox");
const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");

let editId = null;

/* ===== IMAGE PREVIEW ===== */
uploadBox.onclick = () => photoInput.click();

photoInput.onchange = () => {
  const file = photoInput.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
  }
};

/* ===== LOAD USERS ===== */
async function loadUsers() {
  const res = await fetch(API_URL);
  const users = await res.json();

  records.innerHTML = "";

  if (users.length === 0) {
    layout.classList.add("empty");
    layout.classList.remove("filled");
    return;
  }

  layout.classList.add("filled");
  layout.classList.remove("empty");

  users.forEach(user => {
    const card = document.createElement("div");
    card.className = "user-card";

    card.innerHTML = `
      <div class="actions">
        <span onclick="editUser('${user._id}')">✏️</span>
        <span onclick="deleteUser('${user._id}')">🗑️</span>
      </div>
      <img src="http://localhost:5000/uploads/${user.photo}">
      <h3>${user.name}</h3>
      <p>${user.email}</p>
      <p>${user.mobile}</p>
    `;

    records.appendChild(card);
  });
}

/* ===== CREATE / UPDATE ===== */
form.addEventListener("submit", async e => {
  e.preventDefault();

  const data = new FormData(form);
  const url = editId ? `${API_URL}/${editId}` : API_URL;
  const method = editId ? "PUT" : "POST";

  await fetch(url, { method, body: data });

  form.reset();
  preview.style.display = "none";
  editId = null;

  loadUsers();
});

/* ===== EDIT ===== */
async function editUser(id) {
  const res = await fetch(API_URL);
  const users = await res.json();
  const user = users.find(u => u._id === id);

  document.getElementById("name").value = user.name;
  document.getElementById("dob").value = user.dob.split("T")[0];
  document.getElementById("email").value = user.email;
  document.getElementById("mobile").value = user.mobile;

  editId = id;
}

/* ===== DELETE ===== */
async function deleteUser(id) {
  if (!confirm("Delete this user?")) return;

  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadUsers();
}

loadUsers();
