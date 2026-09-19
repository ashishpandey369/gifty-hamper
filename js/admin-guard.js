import {
  auth,
  onAuthStateChanged,
  signOut
} from "./firebase-auth.js";

const setLoadingState = () => {
  document.documentElement.classList.add("admin-auth-checking");
};

setLoadingState();

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("admin-login.html");
    return;
  }

  try {
    // Refresh the ID token so newly assigned Firebase custom claims are available.
    const tokenResult = await user.getIdTokenResult(true);
    const role = tokenResult.claims.role || "admin";

    document.documentElement.classList.remove("admin-auth-checking");

    const email = document.querySelector("#admin-user-email");
    if (email) {
      email.textContent = `${user.email || "Signed-in admin"} • ${role}`;
    }

    // Make the authenticated user and role available to the admin dashboard.
    window.giftyAdminUser = {
      uid: user.uid,
      email: user.email || "",
      role
    };

    document.documentElement.dataset.adminRole = role;

    console.log("Gifty Hamper admin:", {
      uid: user.uid,
      email: user.email,
      role
    });
  } catch (error) {
    console.error("Unable to read Firebase admin role:", error);
    document.documentElement.classList.remove("admin-auth-checking");

    const email = document.querySelector("#admin-user-email");
    if (email) email.textContent = user.email || "Signed-in admin";
  }

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
