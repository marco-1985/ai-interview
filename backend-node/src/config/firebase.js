import admin from "firebase-admin";
import { env } from "./env.js";

let firebaseReady = false;

export function initFirebaseAdmin() {
  if (
    !env.firebaseProjectId ||
    !env.firebaseClientEmail ||
    !env.firebasePrivateKey ||
    admin.apps.length > 0
  ) {
    return;
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.firebaseProjectId,
      clientEmail: env.firebaseClientEmail,
      privateKey: env.firebasePrivateKey
    })
  });
  firebaseReady = true;
  console.log("Firebase Admin initialized");
}

async function firebasePasswordSignIn(email, password) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.firebaseWebApiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    }
  );

  const data = await response.json();
  return { ok: response.ok, data };
}

export async function createFirebaseUser({ email, password, displayName }) {
  if (firebaseReady) {
    try {
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName
      });
      return userRecord.uid;
    } catch (error) {
      if (error.code === "auth/email-already-exists") {
        const existing = await admin.auth().getUserByEmail(email);
        return existing.uid;
      }
      throw error;
    }
  }

  if (!env.firebaseWebApiKey) {
    throw new Error("Firebase is not configured. Set service account vars or FIREBASE_WEB_API_KEY.");
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${env.firebaseWebApiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true
      })
    }
  );

  const data = await response.json();
  if (!response.ok || !data.localId) {
    if (data?.error?.message === "EMAIL_EXISTS") {
      const existing = await firebasePasswordSignIn(email, password);
      if (existing.ok && existing.data.localId) {
        return existing.data.localId;
      }
      throw new Error("Email already exists in Firebase. Try login or use the same password.");
    }
    throw new Error(data.error?.message || "Firebase signup failed");
  }

  return data.localId;
}

export async function verifyFirebasePassword(email, password) {
  if (!env.firebaseWebApiKey) {
    // If web API key is not configured, skip runtime password check.
    return { ok: true, uid: null };
  }

  const result = await firebasePasswordSignIn(email, password);
  if (!result.ok || !result.data.localId) {
    return { ok: false, uid: null };
  }

  return { ok: true, uid: result.data.localId };
}
