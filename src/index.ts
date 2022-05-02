import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;

console.log(serviceAccount);
if (serviceAccount) {
  initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
  });

  const db = getFirestore();

  console.log(db);
}
