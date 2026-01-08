const API_URL = "http://localhost:5000/api/users";

const form = document.getElementById("userForm");
const uploadBox = document.getElementById("uploadBox");
const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");
const mobileInput = document.getElementById("mobile");

/* =========================
   IMAGE UPLOAD PREVIEW
========================= */
uploadBox.onclick = () => photoInput.click();

photoInput.onchange = () => {
  const file = photoInput.files[0];
  if (file) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
  }
};

/* =========================
   MOBILE DIGITS ONLY
========================= */
function allowOnlyDigits(input) {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "").slice(0, 10);
  });
}

allowOnlyDigits(mobileInput);

/* =========================
   FORM SUBMIT
========================= */
form.addEventListener("submit", async e => {
  e.preventDefault();

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
  } catch (error) {
    alert("Server error. Please try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Save User";
  }
});
