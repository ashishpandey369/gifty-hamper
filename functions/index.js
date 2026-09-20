const crypto = require("node:crypto");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const { setGlobalOptions } = require("firebase-functions/v2");

initializeApp();

setGlobalOptions({
  region: "asia-south1",
  maxInstances: 10
});

const IMAGEKIT_PRIVATE_KEY = defineSecret("IMAGEKIT_PRIVATE_KEY");
const IMAGEKIT_PUBLIC_KEY = "public_Rt1oqiUStVe495Q5BXhyFI19G+c=";

function requireCatalogStaff(request) {
  if (!request.auth?.uid) {
    throw new HttpsError("unauthenticated", "You must be signed in.");
  }

  return getFirestore().doc(`users/${request.auth.uid}`).get().then(async snapshot => {
    if (!snapshot.exists) {
      throw new HttpsError("permission-denied", "Your account does not have catalog access.");
    }

    const profile = snapshot.data() || {};
    let isSuperAdmin = false;

    try {
      const userRecord = await getAuth().getUser(request.auth.uid);
      isSuperAdmin = userRecord.customClaims?.role === "super_admin";
    } catch (_) {
      // Fall back to the Firestore profile for non-super-admin users.
    }

    const active = profile.active === true;
    const roleAllowed = isSuperAdmin || profile.role === "owner" || profile.role === "admin";
    const catalogEnabled = isSuperAdmin || profile.features?.catalog !== false;

    if (!active && !isSuperAdmin) {
      throw new HttpsError("permission-denied", "Your account is inactive or expired.");
    }

    if (!roleAllowed || !catalogEnabled) {
      throw new HttpsError("permission-denied", "Catalog access is disabled for your account.");
    }

    return {
      uid: request.auth.uid,
      role: isSuperAdmin ? "super_admin" : profile.role
    };
  });
}

function cleanFileName(value) {
  const cleaned = String(value || "image.webp")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 120);
  return cleaned || "image.webp";
}

function cleanFolder(value, fallback) {
  const folder = String(value || fallback)
    .trim()
    .replace(/[^a-zA-Z0-9/_-]+/g, "_")
    .replace(/\/+/g, "/")
    .replace(/^\/+|\/+$/g, "");
  return "/" + (folder || fallback);
}

function imageKitBasicAuth() {
  return "Basic " + Buffer.from(`${IMAGEKIT_PRIVATE_KEY.value()}:`).toString("base64");
}

exports.getImageKitAuth = onCall(
  { secrets: [IMAGEKIT_PRIVATE_KEY], cors: true },
  async request => {
    await requireCatalogStaff(request);

    const expire = Math.floor(Date.now() / 1000) + 60 * 30;
    const token = crypto.randomUUID();
    const signature = crypto
      .createHmac("sha1", IMAGEKIT_PRIVATE_KEY.value())
      .update(token + expire)
      .digest("hex");

    return {
      token,
      expire,
      signature,
      publicKey: IMAGEKIT_PUBLIC_KEY
    };
  }
);

exports.uploadImageKitFromUrl = onCall(
  { secrets: [IMAGEKIT_PRIVATE_KEY], cors: true, timeoutSeconds: 60 },
  async request => {
    await requireCatalogStaff(request);

    const sourceUrl = String(request.data?.sourceUrl || "").trim();
    const fileName = cleanFileName(request.data?.fileName);
    const folder = cleanFolder(request.data?.folder, "gifty-hamper/other");

    if (!/^https?:\/\//i.test(sourceUrl)) {
      throw new HttpsError("invalid-argument", "Only public HTTP/HTTPS image URLs can be imported.");
    }

    const form = new FormData();
    form.append("file", sourceUrl);
    form.append("fileName", fileName);
    form.append("folder", folder);
    form.append("useUniqueFileName", "true");
    form.append("publicKey", IMAGEKIT_PUBLIC_KEY);

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      headers: {
        Authorization: imageKitBasicAuth()
      },
      body: form
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("ImageKit URL upload failed", response.status, body);
      throw new HttpsError("internal", body?.message || "ImageKit could not import that image URL.");
    }

    return {
      fileId: body.fileId || "",
      filePath: body.filePath || "",
      url: body.url || "",
      thumbnailUrl: body.thumbnailUrl || "",
      width: body.width || 0,
      height: body.height || 0,
      size: body.size || 0
    };
  }
);

exports.deleteImageKitFile = onCall(
  { secrets: [IMAGEKIT_PRIVATE_KEY], cors: true, timeoutSeconds: 30 },
  async request => {
    await requireCatalogStaff(request);

    const fileId = String(request.data?.fileId || "").trim();
    if (!fileId) {
      throw new HttpsError("invalid-argument", "An ImageKit file ID is required.");
    }

    const response = await fetch(
      "https://api.imagekit.io/v1/files/" + encodeURIComponent(fileId),
      {
        method: "DELETE",
        headers: {
          Authorization: imageKitBasicAuth(),
          Accept: "application/json"
        }
      }
    );

    if (!response.ok && response.status !== 404) {
      const body = await response.text();
      console.error("ImageKit delete failed", response.status, body);
      throw new HttpsError("internal", "ImageKit could not delete the file.");
    }

    return { deleted: true, fileId };
  }
);
