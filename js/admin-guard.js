import {
  auth,
  db,
  doc,
  getDoc,
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
    const claimRole = tokenResult.claims.role || "admin";

    // Read this user's application profile from Firestore.
    // The custom claim remains the authorization source for Super Admin access.
    const profileSnapshot = await getDoc(doc(db, "users", user.uid));
    const profile = profileSnapshot.exists() ? profileSnapshot.data() : null;
    const profileRole = profile?.role || claimRole;
    const active = profile?.active !== false;

    document.documentElement.classList.remove("admin-auth-checking");

    const email = document.querySelector("#admin-user-email");
    if (email) {
      email.textContent = `${user.email || "Signed-in admin"} • ${claimRole}`;
    }

    // Make the authenticated user and both Firebase role sources
    // available to the admin dashboard.
    window.giftyAdminUser = {
      uid: user.uid,
      email: user.email || "",
      role: claimRole,
      profileRole,
      active,
      firestoreProfile: profile
    };

    document.documentElement.dataset.adminRole = claimRole;

    console.log("Gifty Hamper admin:", {
      uid: user.uid,
      email: user.email,
      customClaimRole: claimRole,
      firestoreRole: profileRole,
      active,
      firestoreProfileFound: !!profile
    });
  } catch (error) {
    console.error("Unable to read Firebase admin profile:", error);
    document.documentElement.classList.remove("admin-auth-checking");

    const email = document.querySelector("#admin-user-email");
    if (email) email.textContent = user.email || "Signed-in admin";

    // Keep the secure custom-claim role available even if Firestore
    // is temporarily unavailable.
    window.giftyAdminUser = {
      uid: user.uid,
      email: user.email || "",
      role: "admin",
      profileRole: "unavailable",
      active: true,
      firestoreProfile: null
    };
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
