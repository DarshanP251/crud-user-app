const API_URL = "/api/users";

const records = document.getElementById("records");
const modal = document.getElementById("editModal");
const editForm = document.getElementById("editForm");

const editUploadBox = document.getElementById("editUploadBox");
const editPhotoInput = document.getElementById("editPhoto");
const editPreview = document.getElementById("editPreview");

let currentEditId = null;

/* =========================
   LOAD USERS
========================= */
async function loadUsers() {
  try {
    const res = await fetch(API_URL);
    const users = await res.json();
    records.innerHTML = "";

    users.forEach(user => {
      const row = document.createElement("div");
      row.className = "table-row";

      row.innerHTML = `
        <div class="user-cell">
          <img src="${BACKEND_URL}/uploads/${user.photo}" />
          <strong>${user.name}</strong>
        </div>

        <div>${user.email}</div>
        <div>${user.mobile}</div>

        <div class="action-buttons">
          <button class="edit" onclick="openEdit('${user._id}')">Edit</button>
          <button class="delete" onclick="deleteUser('${user._id}')">Delete</button>
        </div>
      `;

      records.appendChild(row);
    });
  } catch (err) {
    alert("Failed to load users");
  }
}

/* =========================
   OPEN EDIT MODAL
========================= */
async function openEdit(id) {
  const res = await fetch(API_URL);
  const users = await res.json();
  const user = users.find(u => u._id === id);

  document.getElementById("editName").value = user.name;
  document.getElementById("editDob").value = user.dob.split("T")[0];
  document.getElementById("editEmail").value = user.email;
  document.getElementById("editMobile").value = user.mobile;

  editPreview.src = `${BACKEND_URL}/uploads/${user.photo}`;
  editPreview.style.display = "block";

  currentEditId = id;
  modal.classList.add("show");
}

/* =========================
   CLOSE MODAL
========================= */
function closeModal() {
  modal.classList.remove("show");
  editForm.reset();
  editPreview.style.display = "none";
  currentEditId = null;
}

/* =========================
   IMAGE PREVIEW
========================= */
editUploadBox.onclick = () => editPhotoInput.click();

editPhotoInput.onchange = () => {
  const file = editPhotoInput.files[0];
  if (file) {
    editPreview.src = URL.createObjectURL(file);
    editPreview.style.display = "block";
  }
};

/* =========================
   UPDATE USER
========================= */
editForm.addEventListener("submit", async e => {
  e.preventDefault();

  const data = new FormData(editForm);

  try {
    const res = await fetch(`${API_URL}/${currentEditId}`, {
      method: "PUT",
      body: data
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.message || "Update failed");
      return;
    }

    closeModal();
    loadUsers();
  } catch {
    alert("Server error while updating user");
  }
});

/* =========================
   DIGITS ONLY (MOBILE)
========================= */
function allowOnlyDigits(input) {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "").slice(0, 10);
  });
}

allowOnlyDigits(document.getElementById("editMobile"));

/* =========================
   DELETE USER
========================= */
async function deleteUser(id) {
  if (!confirm("Delete this user?")) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadUsers();
  } catch {
    alert("Failed to delete user");
  }
}

loadUsers();
