// Commission request form.
//
// Interface only for now: submissions are validated and handed to
// submitCommission(), which is a placeholder. To store them in Firebase,
// replace the body of submitCommission() with a Firestore write, e.g.
//
//   import { initializeApp } from "https://www.gstatic.com/firebasejs/<version>/firebase-app.js";
//   import { getFirestore, collection, addDoc, serverTimestamp }
//     from "https://www.gstatic.com/firebasejs/<version>/firebase-firestore.js";
//   const db = getFirestore(initializeApp({ /* your firebaseConfig */ }));
//   async function submitCommission(data) {
//     await addDoc(collection(db, "commissions"), { ...data, createdAt: serverTimestamp() });
//   }
//
// Anything thrown from submitCommission() shows as an error message under
// the button and leaves the form filled in so the visitor can retry.

async function submitCommission(data) {
  console.info("[commission] Not connected to a backend yet. Would submit:", data);
  await new Promise((resolve) => setTimeout(resolve, 400));
}

const form = document.getElementById("commission-form");
const statusEl = document.getElementById("commission-status");
const button = form.querySelector("button[type=submit]");

const fields = {
  email: document.getElementById("c-email"),
  description: document.getElementById("c-description"),
  budget: document.getElementById("c-budget"),
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate() {
  const errors = {};
  const email = fields.email.value.trim();
  const description = fields.description.value.trim();
  const budget = Number(fields.budget.value);

  if (!email) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(email)) errors.email = "That email doesn't look right.";

  if (!description) errors.description = "Please describe the commission.";
  else if (description.length < 10) errors.description = "A little more detail, please.";

  if (!fields.budget.value.trim()) errors.budget = "Please enter a budget.";
  else if (!Number.isFinite(budget) || budget <= 0) errors.budget = "Budget must be a number above 0.";

  for (const name of Object.keys(fields)) {
    const message = errors[name] || "";
    document.getElementById(`c-${name}-error`).textContent = message;
    fields[name].setAttribute("aria-invalid", message ? "true" : "false");
  }
  return errors;
}

// Clear a field's error as soon as the visitor fixes it.
for (const [name, input] of Object.entries(fields)) {
  input.addEventListener("input", () => {
    if (input.getAttribute("aria-invalid") !== "true") return;
    const errors = validate();
    if (!errors[name]) {
      document.getElementById(`c-${name}-error`).textContent = "";
      input.setAttribute("aria-invalid", "false");
    }
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "";
  statusEl.className = "commission-status";

  const errors = validate();
  const firstBad = Object.keys(fields).find((name) => errors[name]);
  if (firstBad) {
    fields[firstBad].focus();
    return;
  }

  const data = {
    email: fields.email.value.trim(),
    description: fields.description.value.trim(),
    budget: Number(fields.budget.value),
    currency: document.getElementById("c-currency").value,
    page: location.href,
  };

  button.disabled = true;
  button.textContent = "Sending…";
  try {
    await submitCommission(data);
    form.reset();
    for (const input of Object.values(fields)) input.setAttribute("aria-invalid", "false");
    statusEl.textContent = "Thanks! Your request was sent. I'll reply by email.";
    statusEl.classList.add("ok");
  } catch (error) {
    console.error("[commission] submit failed", error);
    statusEl.textContent = "Sorry, that didn't go through. Please try again.";
    statusEl.classList.add("fail");
  } finally {
    button.disabled = false;
    button.textContent = "Send request";
  }
});
