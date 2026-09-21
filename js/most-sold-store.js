import { db } from "./firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

export const MOST_SOLD_SETTINGS_COLLECTION = "homepageSettings";
export const MOST_SOLD_SETTINGS_ID = "mostSoldCategories";
export const MAX_MOST_SOLD_IMAGES = 20;

function clean(value) {
  return String(value || "").trim();
}

export function normaliseMostSoldImage(image = {}) {
  return {
    url: clean(image.url),
    fileId: clean(image.fileId)
  };
}

export function normaliseMostSoldSettings(data = {}) {
  const images = Array.isArray(data.images)
    ? data.images.map(normaliseMostSoldImage).filter(item => item.url).slice(0, MAX_MOST_SOLD_IMAGES)
    : [];

  return {
    id: MOST_SOLD_SETTINGS_ID,
    active: data.active !== false,
    images
  };
}

export async function loadMostSoldImages() {
  const snapshot = await getDoc(doc(db, MOST_SOLD_SETTINGS_COLLECTION, MOST_SOLD_SETTINGS_ID));
  return snapshot.exists() ? normaliseMostSoldSettings(snapshot.data()).images : [];
}

export async function saveMostSoldImages(images) {
  const cleaned = (Array.isArray(images) ? images : [])
    .map(normaliseMostSoldImage)
    .filter(item => item.url)
    .slice(0, MAX_MOST_SOLD_IMAGES);

  await setDoc(
    doc(db, MOST_SOLD_SETTINGS_COLLECTION, MOST_SOLD_SETTINGS_ID),
    {
      images: cleaned,
      active: cleaned.length > 0
    },
    { merge: true }
  );

  return cleaned;
}
