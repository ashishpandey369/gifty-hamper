import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-functions.js";
import { app } from "./firebase-auth.js";

const functions = getFunctions(app, "asia-south1");

const getImageKitAuth = httpsCallable(functions, "getImageKitAuth");
const uploadImageKitFromUrl = httpsCallable(functions, "uploadImageKitFromUrl");
const deleteImageKitFile = httpsCallable(functions, "deleteImageKitFile");

export const IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/giftyhamper";
export const IMAGEKIT_PUBLIC_KEY = "public_Rt1oqiUStVe495Q5BXhyFI19G+c=";

function safeFileName(value = "image.webp") {
  const cleaned = String(value)
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 120);
  return cleaned || "image.webp";
}

export async function getImageKitUploadAuth() {
  const response = await getImageKitAuth();
  return response.data;
}

export async function uploadImageFile(file, { folder, fileName } = {}) {
  if (!(file instanceof Blob)) {
    throw new Error("A valid image file is required.");
  }

  const auth = await getImageKitUploadAuth();
  const form = new FormData();

  form.append("file", file);
  form.append("fileName", safeFileName(fileName || "image.webp"));
  form.append("folder", folder || "/gifty-hamper/other");
  form.append("useUniqueFileName", "true");
  form.append("publicKey", auth.publicKey || IMAGEKIT_PUBLIC_KEY);
  form.append("token", auth.token);
  form.append("signature", auth.signature);
  form.append("expire", String(auth.expire));

  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: form
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(body?.message || "ImageKit upload failed.");
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

export async function uploadImageUrl(sourceUrl, { folder, fileName } = {}) {
  const response = await uploadImageKitFromUrl({
    sourceUrl,
    folder: folder || "/gifty-hamper/other",
    fileName: safeFileName(fileName || "image.webp")
  });

  return response.data;
}

export async function deleteImageFile(fileId) {
  if (!fileId) return { deleted: false, fileId: "" };
  const response = await deleteImageKitFile({ fileId });
  return response.data;
}
