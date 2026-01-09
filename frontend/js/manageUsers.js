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

    if (!res.ok) {
      throw new Error("Fetch failed");
    }

    const users = await res.json();
    records.innerHTML = "";

    if (users.length === 0) {
      records.innerHTML = "<p style='opacity:0.6'>No users found</p>";
      return;
    }

    users.forEach(user => {
      const row = document.createElement("div");
      row.className = "table-row";

      row.innerHTML = `
        <div class="user-cell">
          <img src="/uploads/${user.photo}" />
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
    console.error(err);
  }
}

/* =========================
   OPEN EDIT MODAL
========================= */
async function openEdit(id) {
  try {
    const res = await fetch(API_URL);
    const users = await res.json();
    const user = users.find(u => u._id === id);

    if (!user) {
      alert("User not found");
      return;
    }

    document.getElementById("editName").value = user.name;
    document.getElementById("editDob").value = user.dob.split("T")[0];
    document.getElementById("editEmail").value = user.email;
    document.getElementById("editMobile").value = user.mobile;

    editPreview.src = `/uploads/${user.photo}`;
    editPreview.style.display = "block";

    currentEditId = id;
    modal.classList.add("show");
  } catch (err) {
    alert("Failed to open edit modal");
    console.error(err);
  }
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

  if (!currentEditId) return;

  const data = new FormData(editForm);

  try {
    const res = await fetch(`${API_URL}/${currentEditId}`, {
      method: "PUT",
      body: data
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Update failed");
      return;
    }

    closeModal();
    loadUsers();
  } catch (err) {
    alert("Server error while updating user");
    console.error(err);
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
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

    if (!res.ok) {
      throw new Error("Delete failed");
    }

    loadUsers();
  } catch (err) {
    alert("Failed to delete user");
    console.error(err);
  }
}

loadUsers();
