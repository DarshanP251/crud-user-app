const API_URL = "https://crud-user-backend-1zr1.onrender.com/api/users";

const form = document.getElementById("userForm");
const uploadBox = document.getElementById("uploadBox");
const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");
const mobileInput = document.getElementById("mobile");

/* =========================
   IMAGE UPLOAD PREVIEW
========================= */
uploadBox.addEventListener("click", () => photoInput.click());

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
  }
});

/* =========================
   MOBILE DIGITS ONLY
========================= */
mobileInput.addEventListener("input", () => {
  mobileInput.value = mobileInput.value.replace(/\D/g, "").slice(0, 10);
});

/* =========================
   FORM SUBMIT
========================= */
form.addEventListener("submit", async e => {
  e.preventDefault();

  // ✅ Manual validation (instead of HTML required)
  if (!photoInput.files.length) {
    alert("Please upload a photo");
    return;
  }

  const submitBtn = form.querySelector("button");
  submitBtn.disabled = true;
  submitBtn.textContent = "Saving...";

  try {
    const data = new FormData(form);

    const res = await fetch(API_URL, {
      method: "POST",
      body: data
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Failed to add user");
      return;
    }

    alert("User added successfully");
    form.reset();
    preview.style.display = "none";
  } catch (err) {
    alert("Server error. Please try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Save User";
  }
});
