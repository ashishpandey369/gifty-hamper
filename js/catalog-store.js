import {
  db
} from "./firebase-auth.js";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

export const DEFAULT_CATALOG = [
  { id:"little-joy", name:"The Little Joy Hamper", description:"Thoughtful everyday gifting", price:1499, occasion:"Birthday", categories:["Gift Sets","Appreciation Gifts"], label:"Everyday", imageClass:"image-sage", stock:10 },
  { id:"good-things", name:"Good Things Gift Box", description:"A warm collection of favourites", price:1999, occasion:"Thank You", categories:["Gift Sets","Premium Gifts"], label:"Curated", imageClass:"image-sand", stock:10 },
  { id:"just-for-you", name:"Just For You Hamper", description:"Made for meaningful moments", price:2499, occasion:"Birthday", categories:["Gift Sets","Celebration Gifts"], label:"Special", imageClass:"image-rose", stock:10 },
  { id:"signature-luxe", name:"Signature Luxe Hamper", description:"Premium gifting, beautifully packed", price:3999, occasion:"Corporate", categories:["Premium Gifts","Employee Gifts","Gift Sets"], label:"Premium", imageClass:"image-night", stock:10 },
  { id:"festive-glow", name:"Festive Glow Box", description:"A bright celebration in a box", price:1799, occasion:"Festive", categories:["Festive Gifts","Gift Sets"], label:"Festive", imageClass:"image-sand", stock:10 },
  { id:"office-cheer", name:"Office Cheer Hamper", description:"A polished team appreciation gift", price:2299, occasion:"Corporate", categories:["Office Accessories","Employee Gifts","Appreciation Gifts"], label:"Teams", imageClass:"image-sage", stock:10 },
  { id:"warm-thanks", name:"Warm Thanks Box", description:"A simple way to say thank you", price:1299, occasion:"Thank You", categories:["Appreciation Gifts","Gift Sets"], label:"Thoughtful", imageClass:"image-rose", stock:10 },
  { id:"grand-celebration", name:"Grand Celebration Hamper", description:"A premium gift for big moments", price:4999, occasion:"Festive", categories:["Celebration Gifts","Premium Gifts","Gift Sets"], label:"Premium", imageClass:"image-night", stock:10 }
];

export function normaliseProduct(product) {
  return {
    ...product,
    stock: Number.isFinite(Number(product.stock)) ? Math.max(0, Number(product.stock)) : 0,
    salePrice: product.salePrice ?? "",
    lowStock: Number.isFinite(Number(product.lowStock)) ? Math.max(0, Number(product.lowStock)) : 5,
    featured: product.featured ?? false,
    active: product.active ?? true,
    majorCategory: product.majorCategory === "Gifts" ? "Gifts for Everyone" : (product.majorCategory || "Gifts for Everyone"),
    images: Array.isArray(product.images) && product.images.length
      ? product.images
      : (product.image ? [product.image] : [])
  };
}

export async function loadPublicCatalog() {
  const snapshot = await getDocs(
    query(collection(db, "products"), where("active", "==", true))
  );
  return snapshot.docs.map(item => normaliseProduct({ id:item.id, ...item.data() }));
}

export async function loadAdminCatalog() {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map(item => normaliseProduct({ id:item.id, ...item.data() }));
}

export async function getCatalogProduct(id) {
  const snapshot = await getDoc(doc(db, "products", id));
  return snapshot.exists()
    ? normaliseProduct({ id:snapshot.id, ...snapshot.data() })
    : null;
}

export async function saveCatalogProduct(product) {
  const normalised = normaliseProduct(product);
  await setDoc(doc(db, "products", normalised.id), normalised);
  return normalised;
}

export async function seedDefaultCatalog() {
  for (const product of DEFAULT_CATALOG) {
    await saveCatalogProduct(product);
  }
  return DEFAULT_CATALOG.map(normaliseProduct);
}
