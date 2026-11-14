const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./service-account.json");

initializeApp({
  credential: cert(serviceAccount)
});

const auth = getAuth();
const db = getFirestore();

const uid = process.argv[2];

if (!uid) {
  console.error("ERROR: Please provide the Firebase UID.");
  console.error("Example: node delete-staff-user.js USER_UID");
  process.exit(1);
}

async function deleteStaffUser() {
  try {
    const user = await auth.getUser(uid);

    console.log("");
    console.log("User found:");
    console.log("Email:", user.email || "No email");
    console.log("UID:", user.uid);
    console.log("");

    await auth.deleteUser(uid);
    console.log("SUCCESS: Firebase Authentication account deleted.");

    await db.collection("users").doc(uid).delete();
    console.log("SUCCESS: Firestore staff profile deleted.");

    console.log("");
    console.log("DONE: Staff account completely deleted.");
    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("ERROR:", error.message);
    process.exit(1);
  }
}

deleteStaffUser();