import {
  auth,
  db,
  doc,
  getDoc,
  onAuthStateChanged,
  signOut
} from "./firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  deleteUser
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  setDoc,
  deleteDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const staffCreatorApp = initializeApp({
  apiKey: "AIzaSyA_i3OuD8zEnmsTjobg1yUt9zSHZAYb4ug",
  authDomain: "gifty-hamper.firebaseapp.com",
  projectId: "gifty-hamper",
  storageBucket: "gifty-hamper.firebasestorage.app",
  messagingSenderId: "941922060172",
  appId: "1:941922060172:web:23d85fd867bec63b7a78a9"
}, "staffCreator");

const staffCreatorAuth = getAuth(staffCreatorApp);

const $ = (selector) => document.querySelector(selector);

function showDiagnostic(message) {
  const box = $("#staff-access");
  if (!box) return;
  box.hidden = false;
  box.innerHTML = "<strong>Staff page status</strong><span>" + message + "</span>";
}

window.addEventListener("error", (event) => {
  console.error("Staff page error:", event.error || event.message);
  showDiagnostic("JavaScript error: " + (event.message || "Unknown error"));
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Staff page promise error:", event.reason);
  showDiagnostic("Firebase error: " + (event.reason?.message || String(event.reason)));
});

showDiagnostic("JavaScript loaded. Waiting for Firebase Authentication…");

async function loadLatestUpdate() {
  const target = $("#admin-last-update");
  if (!target) return;
  try {
    const response = await fetch("latest-update.txt?t=" + Date.now(), { cache: "no-store" });
    if (!response.ok) throw new Error("Unable to read update timestamp.");
    const value = (await response.text()).trim();
    target.textContent = value ? "Latest update: " + value : "Latest update: unavailable";
  } catch (error) {
    console.warn("Latest update timestamp error:", error);
    target.textContent = "Latest update: unavailable";
  }
}

loadLatestUpdate();

setTimeout(() => {
  const box = $("#staff-access");
  const content = $("#staff-content");
  if (box && !box.hidden && content?.hidden) {
    showAccess(
      "Authentication check is not completing",
      "Firebase did not finish the sign-in check within 12 seconds. Open F12 → Console and send me the error shown there."
    );
  }
}, 12000);

function withTimeout(promise, message = "Firebase request timed out after 10 seconds.") {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), 10000))
  ]);
}

function showAccess(message, detail) {
  const box = $("#staff-access");
  box.hidden = false;
  box.innerHTML = "<strong>" + message + "</strong><span>" + detail + "</span>";
}

function roleLabel(role) {
  if (role === "super_admin") return "Super Admin";
  if (role === "owner") return "Owner";
  if (role === "admin") return "Admin";
  return role || "Unknown";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadStaff(currentRole, currentUid) {
  let users = [];

  if (currentRole === "owner") {
    // Owner sees their own Owner profile so they can always see
    // their account status and expiry, plus the Admin profiles.
    const [ownerSnapshot, adminSnapshot] = await Promise.all([
      withTimeout(getDoc(doc(db, "users", currentUid))),
      withTimeout(
        getDocs(query(collection(db, "users"), where("role", "==", "admin")))
      )
    ]);

    if (ownerSnapshot.exists()) {
      users.push({
        id: ownerSnapshot.id,
        ...ownerSnapshot.data(),
        isCurrentOwner: true
      });
    }

    users.push(
      ...adminSnapshot.docs.map(item => ({
        id: item.id,
        ...item.data()
      }))
    );
  } else {
    const snapshot = await withTimeout(getDocs(collection(db, "users")));

    users = snapshot.docs.map(item => ({
      id: item.id,
      ...item.data()
    }));
  }

  const list = $("#staff-list");

  if (!users.length) {
    list.innerHTML = '<tr><td colspan="6">' +
      (currentRole === "owner"
        ? "No Owner or Admin profiles found."
        : "No staff profiles found.") +
      "</td></tr>";
    return;
  }

  list.innerHTML = users.map(user => {
    const role = user.role || "admin";
    const active = user.active === true;
    const expiresAt = user.expiresAt?.toDate ? user.expiresAt.toDate() : null;
    const expired = expiresAt ? expiresAt.getTime() <= Date.now() : false;
    const effectiveActive = active && !expired;

    const canManage = currentRole === "super_admin"
      ? role === "owner" || role === "admin"
      : role === "admin" && user.id !== currentUid;

    const canDelete = canManage && user.id !== currentUid;
    const canExtend =
      currentRole === "super_admin" &&
      (role === "owner" || role === "admin") &&
      expired;

    const saleButton = role === "admin"
      ? '<a class="admin-secondary staff-sale-button" href="admin-sale.html">Sale</a>'
      : "";

    const roleOptions = currentRole === "super_admin"
      ? '<option value="owner"' + (role === "owner" ? " selected" : "") + '>Owner</option>' +
        '<option value="admin"' + (role === "admin" ? " selected" : "") + '>Admin</option>'
      : '<option value="admin" selected>Admin</option>';

    const ownerMarker = user.isCurrentOwner
      ? ' <small style="display:block;margin-top:4px;opacity:.7;">Your account</small>'
      : "";

    return "<tr>" +
      "<td><strong>" + escapeHtml(user.email || "No email") + "</strong>" + ownerMarker + "</td>" +
      "<td><span class="staff-role">" + escapeHtml(roleLabel(role)) + "</span></td>" +
      "<td><span class="status-pill " + (effectiveActive ? "" : "draft") + "">" +
        (expired ? "Expired" : (active ? "Active" : "Inactive")) +
      "</span></td>" +
      "<td><span class="staff-validity " + (expired ? "expired" : "") +
        "" data-expiry="" + (expiresAt ? expiresAt.toISOString() : "") + "">" +
        (expiresAt ? formatRemaining(expiresAt) : "No expiry") +
      "</span></td>" +
      "<td><code>" + escapeHtml(user.id) + "</code></td>" +
      "<td>" +
        (canManage
          ? '<div class="staff-actions">' +
              '<select data-role-for="' + escapeHtml(user.id) + '">' + roleOptions + "</select>" +
              '<button type="button" class="admin-secondary" data-save-user="' + escapeHtml(user.id) + '">Save</button>' +
              (expired
                ? (canExtend
                    ? '<button type="button" class="admin-secondary" data-extend-user="' + escapeHtml(user.id) + '">Extend</button>'
                    : "")
                : '<button type="button" class="admin-secondary" data-toggle-user="' + escapeHtml(user.id) + '">' +
                    (effectiveActive ? "Deactivate" : "Activate") +
                  "</button>") +
              (canDelete
                ? '<button type="button" class="admin-secondary danger" data-delete-user="' + escapeHtml(user.id) + '">Delete</button>'
                : "") +
              saleButton +
            "</div>"
          : saleButton) +
      "</td>" +
    "</tr>";
  }).join("");

  list.querySelectorAll("[data-save-user]").forEach(button => {
    button.addEventListener("click", async () => {
      const userId = button.dataset.saveUser;
      const select = list.querySelector('[data-role-for="' + CSS.escape(userId) + '"]');
      if (!select) return;

      button.disabled = true;

      try {
        await updateDoc(doc(db, "users", userId), {
          role: select.value
        });
        alert("Staff role updated.");
        await loadStaff(currentRole, currentUid);
      } catch (error) {
        console.error(error);
        alert("Unable to update this staff role. Check the Firebase rules and account permissions.");
      } finally {
        button.disabled = false;
      }
    });
  });

  list.querySelectorAll("[data-delete-user]").forEach(button => {
    button.addEventListener("click", async () => {
      const userId = button.dataset.deleteUser;
      const row = button.closest("tr");
      const email = row?.querySelector("td strong")?.textContent || userId;

      if (!confirm("Delete " + email + " from Gifty Hamper staff? This will remove their application access.")) {
        return;
      }

      button.disabled = true;
      button.textContent = "Deleting…";

      try {
        await deleteDoc(doc(db, "users", userId));
        alert("Staff user deleted successfully.");
        await loadStaff(currentRole, currentUid);
      } catch (error) {
        console.error("Delete staff error:", error);
        alert("Unable to delete this staff user. Check the Firebase Firestore rules.");
        button.disabled = false;
        button.textContent = "Delete";
      }
    });
  });

  list.querySelectorAll("[data-toggle-user]").forEach(button => {
    button.addEventListener("click", async () => {
      const userId = button.dataset.toggleUser;
      const row = button.closest("tr");
      const activeNow = row?.querySelector(".status-pill")?.textContent.trim() === "Active";

      button.disabled = true;

      try {
        await updateDoc(doc(db, "users", userId), {
          active: !activeNow
        });
        alert(activeNow ? "Staff account marked inactive." : "Staff account activated.");
        await loadStaff(currentRole, currentUid);
      } catch (error) {
        console.error(error);
        alert("Unable to update this staff status.");
      } finally {
        button.disabled = false;
      }
    });
  });
}

function formatRemaining(expiresAt) {
  const diff = expiresAt.getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.ceil(diff / 86400000);
  return days === 1 ? "1 day left" : days + " days left";
}

function refreshValidityLabels() {
  document.querySelectorAll("[data-expiry]").forEach(element => {
    const raw = element.dataset.expiry;
    if (!raw) return;
    const expiresAt = new Date(raw);
    const diff = expiresAt.getTime() - Date.now();

    if (diff <= 0) {
      element.textContent = "Expired";
      element.classList.add("expired");
      return;
    }

    const days = Math.ceil(diff / 86400000);
    element.textContent = days === 1 ? "1 day left" : days + " days left";
  });
}

setInterval(refreshValidityLabels, 60000);

let staffRoleToCreate = "admin";
let staffCreateMode = "create";
let currentManagerRole = "";
let currentManagerUid = "";

function openStaffModal(role) {
  staffCreateMode = "create";
  staffRoleToCreate = role;
  $("#staff-modal-title").textContent = role === "owner" ? "Add Owner" : "Add Admin";
  $("#new-staff-role").textContent = role === "owner" ? "Owner" : "Admin";
  $("#new-staff-email").value = "";
  $("#new-staff-password").value = "";
  $("#new-staff-password-confirm").value = "";
  $("#new-staff-validity").value = "30";
  $("#staff-modal-status").textContent = "";
  $("#create-staff-account").disabled = false;
  $("#staff-modal").hidden = false;
  setTimeout(() => $("#new-staff-email")?.focus(), 0);
}

function closeStaffModal() {
  $("#staff-modal").hidden = true;
}

function randomTemporaryPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = new Uint32Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, value => chars[value % chars.length]).join("");
}

async function createStaffAccount() {
  const email = $("#new-staff-email").value.trim().toLowerCase();
  const password = $("#new-staff-password").value;
  const confirmPassword = $("#new-staff-password-confirm").value;
  const validityDays = Number($("#new-staff-validity").value);
  const status = $("#staff-modal-status");
  const button = $("#create-staff-account");

  if (!email || !email.includes("@")) {
    status.textContent = "Enter a valid email address.";
    return;
  }
  if (password.length < 6) {
    status.textContent = "Password must be at least 6 characters.";
    return;
  }
  if (password !== confirmPassword) {
    status.textContent = "Passwords do not match.";
    return;
  }
  if (!Number.isInteger(validityDays) || validityDays < 1 || validityDays > 3650) {
    status.textContent = "Validity must be between 1 and 3650 days.";
    return;
  }

  button.disabled = true;
  status.textContent = "Creating Firebase account…";

  try {
    const credential = await createUserWithEmailAndPassword(
      staffCreatorAuth,
      email,
      password
    );

    const expiresAt = new Date(Date.now() + validityDays * 86400000);

    try {
      await setDoc(doc(db, "users", credential.user.uid), {
        email,
        role: staffRoleToCreate,
        active: true,
        expiresAt: Timestamp.fromDate(expiresAt),
        ...(staffRoleToCreate === "admin" && currentManagerRole === "owner"
          ? { ownerUid: currentManagerUid }
          : {})
      });
    } catch (profileError) {
      await deleteUser(credential.user);
      throw profileError;
    }

    status.textContent = "Account created successfully.";
    $("#new-staff-email").value = "";
    $("#new-staff-password").value = "";
    $("#new-staff-password-confirm").value = "";

    setTimeout(async () => {
      closeStaffModal();
      const tokenResult = await auth.currentUser.getIdTokenResult(true);
      const profile = await getDoc(doc(db, "users", auth.currentUser.uid));
      const role = tokenResult.claims.role === "super_admin"
        ? "super_admin"
        : (profile.exists() ? profile.data().role : "admin");
      await loadStaff(role, currentManagerUid);
    }, 700);
  } catch (error) {
    console.error("Create staff error:", error);
    status.textContent = error?.code === "auth/email-already-in-use"
      ? "That email already has a Firebase account."
      : (error?.message || "Unable to create the staff account.");
    button.disabled = false;
  }
}

$("#add-owner")?.addEventListener("click", () => openStaffModal("owner"));
$("#add-admin")?.addEventListener("click", () => openStaffModal("admin"));
$("#create-staff-account")?.addEventListener("click", createStaffAccount);

document.querySelectorAll("[data-close-staff-modal]").forEach(element => {
  element.addEventListener("click", closeStaffModal);
});

onAuthStateChanged(auth, async (user) => {
  showDiagnostic(user ? "Firebase Authentication detected your signed-in account. Loading permissions…" : "Firebase Authentication is ready, but no signed-in account was detected.");
  if (!user) {
    window.location.replace("admin-login.html");
    return;
  }

  try {
    showDiagnostic("Signed in as " + (user.email || "your account") + ". Reading your Firebase permissions…");
    const tokenResult = await withTimeout(user.getIdTokenResult(true), "Firebase token request timed out after 10 seconds.");
    const claimRole = tokenResult.claims.role || "";
    const profileSnapshot = await withTimeout(getDoc(doc(db, "users", user.uid)));
    const profile = profileSnapshot.exists() ? profileSnapshot.data() : null;
    const profileRole = profile?.role || "";

    currentManagerUid = user.uid;
    currentManagerRole = claimRole === "super_admin" ? "super_admin" : profileRole;

    const effectiveRole = claimRole === "super_admin" ? "super_admin" : profileRole;

    $("#admin-user-email").textContent =
      (user.email || "Signed-in admin") + " • " + (effectiveRole || "unknown");

    const managerExpiry = profile?.expiresAt?.toDate ? profile.expiresAt.toDate() : null;
    const managerExpired = managerExpiry ? managerExpiry.getTime() <= Date.now() : false;

    if (
      !["super_admin", "owner"].includes(effectiveRole) ||
      profile?.active === false ||
      managerExpired
    ) {
      showAccess("Access restricted", "Only the Super Admin and active Owner can manage staff.");
      return;
    }

    $("#staff-access").hidden = true;
    $("#staff-content").hidden = false;

    const validity = $("#admin-account-validity");

    if (validity) {
      if (effectiveRole === "super_admin") {
        validity.textContent = "Unlimited access";
      } else if (managerExpiry) {
        const updateManagerValidity = () => {
          const diff = managerExpiry.getTime() - Date.now();
          validity.textContent =
            diff <= 0
              ? "Expired"
              : (Math.ceil(diff / 86400000) + " days left");
        };

        updateManagerValidity();
        setInterval(updateManagerValidity, 60000);
      }
    }

    $("#add-owner").hidden = effectiveRole !== "super_admin";
    $("#add-admin").hidden = !["super_admin", "owner"].includes(effectiveRole);

    await loadStaff(effectiveRole, user.uid);
  } catch (error) {
    console.error("Staff page error:", error);
    showAccess(
      "Unable to load staff management",
      error?.message || "Please refresh the page and check your Firebase connection."
    );
  }

  const logout = $("#admin-logout");

  if (logout) {
    logout.addEventListener("click", async () => {
      logout.disabled = true;
      logout.textContent = "Signing out…";
      await signOut(auth);
      window.location.replace("admin-login.html");
    });
  }
});

$("#staff-refresh")?.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  const tokenResult = await user.getIdTokenResult(true);
  const profile = await getDoc(doc(db, "users", user.uid));
  const role = tokenResult.claims.role === "super_admin"
    ? "super_admin"
    : (profile.exists() ? profile.data().role : "admin");

  await loadStaff(role, user.uid);
});
