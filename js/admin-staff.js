import {
  auth,
  db,
  doc,
  getDoc,
  onAuthStateChanged,
  signOut
} from "./firebase-auth.js";

import {
  collection,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const $ = (selector) => document.querySelector(selector);

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

async function loadStaff(currentRole) {
  const snapshot = await Promise.race([getDocs(collection(db, "users")), new Promise((_, reject) => setTimeout(() => reject(new Error("Firestore request timed out after 10 seconds.")), 10000))]);
  const users = snapshot.docs.map(item => ({
    id: item.id,
    ...item.data()
  }));

  const list = $("#staff-list");

  if (!users.length) {
    list.innerHTML = '<tr><td colspan="5">No staff profiles found.</td></tr>';
    return;
  }

  list.innerHTML = users.map(user => {
    const role = user.role || "admin";
    const active = user.active === true;
    const canManage = currentRole === "super_admin"
      ? role === "owner" || role === "admin"
      : role === "admin";

    const roleOptions = currentRole === "super_admin"
      ? '<option value="owner"' + (role === "owner" ? " selected" : "") + '>Owner</option>' +
        '<option value="admin"' + (role === "admin" ? " selected" : "") + '>Admin</option>'
      : '<option value="admin" selected>Admin</option>';

    return '<tr>' +
      '<td><strong>' + escapeHtml(user.email || "No email") + '</strong></td>' +
      '<td><span class="staff-role">' + escapeHtml(roleLabel(role)) + '</span></td>' +
      '<td><span class="status-pill ' + (active ? "" : "draft") + '">' + (active ? "Active" : "Inactive") + '</span></td>' +
      '<td><code>' + escapeHtml(user.id) + '</code></td>' +
      '<td>' +
        (canManage
          ? '<div class="staff-actions">' +
              '<select data-role-for="' + escapeHtml(user.id) + '">' + roleOptions + '</select>' +
              '<button type="button" class="admin-secondary" data-save-user="' + escapeHtml(user.id) + '">Save</button>' +
              '<button type="button" class="admin-secondary" data-toggle-user="' + escapeHtml(user.id) + '">' + (active ? "Deactivate" : "Activate") + '</button>' +
            '</div>'
          : '<span class="admin-help">Protected</span>') +
      '</td>' +
    '</tr>';
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
        await loadStaff(currentRole);
      } catch (error) {
        console.error(error);
        alert("Unable to update this staff role. Check the Firebase rules and account permissions.");
      } finally {
        button.disabled = false;
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
        await loadStaff(currentRole);
      } catch (error) {
        console.error(error);
        alert("Unable to update this staff status.");
      } finally {
        button.disabled = false;
      }
    });
  });
}

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("admin-login.html");
    return;
  }

  try {
    const tokenResult = await user.getIdTokenResult(true);
    const claimRole = tokenResult.claims.role || "admin";

    $("#admin-user-email").textContent = (user.email || "Signed-in admin") + " • " + claimRole;

    if (claimRole !== "super_admin") {
      const profile = await getDoc(doc(db, "users", user.uid));
      const data = profile.exists() ? profile.data() : null;

      if (!data || data.role !== "owner" || data.active !== true) {
        showAccess("Access restricted", "Only the Super Admin and active Owner can manage staff.");
        return;
      }
    }

    $("#staff-access").hidden = true;
    $("#staff-content").hidden = false;

    await loadStaff(claimRole);
  } catch (error) {
    console.error("Staff page error:", error);
    showAccess("Unable to load staff management", error?.message || "Please refresh the page and check your Firebase connection.");
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
  await loadStaff(tokenResult.claims.role || "admin");
});
