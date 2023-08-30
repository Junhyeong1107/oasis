import { initializeApp } from "firebase/app";

import {
  getAuth,
  createUserWithEmailAndPassword as createUser,
  signInWithEmailAndPassword as signin,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  ref as strRef,
  doc,
  setDoc,
  query as storeQuery,
  where,
  getDocs,
} from "firebase/firestore";

import {
  getStorage,
  ref as stoRef,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBqdA8pRCzNFqTvi1vdkJVWyak9ZWkGuHw",
  authDomain: "test-91df1.firebaseapp.com",
  databaseURL: "https://test-91df1-default-rtdb.firebaseio.com",
  projectId: "test-91df1",
  storageBucket: "test-91df1.appspot.com",
  messagingSenderId: "374659317858",
  appId: "1:374659317858:web:df2ba5599af9b39b5dd13b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize auth object
const db = getFirestore(app); // Initialize firestore object
const storage = getStorage(app); // Initialize storage object

export { auth, createUser, signin };
export { db, collection, addDoc, doc, getDoc, strRef, setDoc, storeQuery,where,getDocs};
export { storage, stoRef, uploadBytes, getDownloadURL, listAll };

export async function uploadImage(file, fileName) {
  const storageRef = stoRef(storage, `images/${fileName}`); // fileName을 사용하여 경로 설정
  await uploadBytes(storageRef, file);
  return storageRef;
}

export async function saveButtonText(buttonIndex, buttonText) {
  try {
    const buttonRef = collection(db, "buttons"); // 'buttons' 컬렉션을 사용하거나 변경하세요
    const docRef = await addDoc(buttonRef, { buttonIndex, buttonText });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
}
export const saveImageDataToFirestore = async (imageURL, associatedText,userNickname,userAddress) => {
  try {
    const docRef = await addDoc(collection(db, "images"), {
      imageURL: imageURL,
      associatedText: associatedText,
      nickname: userNickname,
      address: userAddress,
    });

    console.log("Image data saved with ID: ", docRef.id);
  } catch (error) {
    console.error("Error saving image data:", error);
  }
};

export const getUserDataFromFirestore = async (uid) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      return userDocSnapshot.data();
    } else {
      throw new Error("User Not Found");
    }
  } catch (error) {
    throw error;
  }
};
