import {
  auth,
  onAuthStateChanged,
  signOut
} from "./firebase-auth.js";

const setLoadingState = () => {
  document.documentElement.classList.add("admin-auth-checking");
};

setLoadingState();

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.replace("admin-login.html");
    return;
  }

  document.documentElement.classList.remove("admin-auth-checking");

  const email = document.querySelector("#admin-user-email");
  if (email) email.textContent = user.email || "Signed-in admin";

  const logout = document.querySelector("#admin-logout");
  if (logout) {
    logout.addEventListener("click", async () => {
      logout.disabled = true;
      logout.textContent = "Signing out…";
      await signOut(auth);
      window.location.replace("admin-login.html");
    });
  }
});
