import {
  auth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from "./firebase-auth.js";

const form = document.querySelector("#admin-login-form");
const emailInput = document.querySelector("#admin-email");
const passwordInput = document.querySelector("#admin-password");
const submitButton = document.querySelector("#admin-login-submit");
const message = document.querySelector("#admin-login-message");
const resetButton = document.querySelector("#admin-reset-password");

const setMessage = (text, type = "") => {
  message.textContent = text;
  message.className = "admin-login-message " + type;
};

const params = new URLSearchParams(window.location.search);
const reason = params.get("reason");
if (reason === "owner-expired") {
  setMessage(
    "Your Owner account's validity has expired. Please contact your Owner to renew access.",
    "error"
  );
} else if (reason === "account-expired") {
  setMessage(
    "Your admin account is inactive or its validity has expired. Please contact your Owner.",
    "error"
  );
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.replace("admin.html");
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    setMessage("Enter your email and password.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Signing in…";
  setMessage("Checking your account…");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    setMessage("Login successful. Opening admin panel…", "success");
    window.setTimeout(() => window.location.replace("admin.html"), 300);
  } catch (error) {
    console.error(error);
    const code = error?.code || "";
    const text = code === "auth/invalid-credential"
      ? "The email or password is incorrect."
      : code === "auth/too-many-requests"
        ? "Too many attempts. Please wait a while and try again."
        : "We could not sign you in. Please check your details.";
    setMessage(text, "error");
    submitButton.disabled = false;
    submitButton.textContent = "Sign in";
  }
});

resetButton.addEventListener("click", async () => {
  const email = emailInput.value.trim();

  if (!email) {
    setMessage("Enter your email first, then choose Forgot password.", "error");
    emailInput.focus();
    return;
  }

  resetButton.disabled = true;
  try {
    await sendPasswordResetEmail(auth, email);
    setMessage("If that account exists, Firebase has sent a password reset email.", "success");
  } catch (error) {
    console.error(error);
    setMessage("We could not send the reset email. Check the email address and try again.", "error");
  } finally {
    resetButton.disabled = false;
  }
});
