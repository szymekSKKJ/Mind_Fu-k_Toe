import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDjKNWHCtwWvRp7QUNx4OE_j7RBJCYbCxo",
  authDomain: "mind-fu-k-toe.firebaseapp.com",
  projectId: "mind-fu-k-toe",
  storageBucket: "mind-fu-k-toe.appspot.com",
  messagingSenderId: "333047274167",
  appId: "1:333047274167:web:61784fe649333e77458b32",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
