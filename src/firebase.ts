import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { collection, getFirestore } from "firebase/firestore";

export interface Author {
    given_name: string;
    surname: string;
    surname_first?: boolean;
    uploader: string;
}

export interface Publisher {
    publisher: string;
}

export interface Book {
    title: string;
    authors: Author[];
    uploader: string;
}

export interface Edition {
    title: string;
    subtitle?: string;
    books: Book[];
    publisher: string;
    url?: string;
    img_url?: string;
    uploader: string;
    readonly id: string; // added by VueFire
}

export interface ListItem {
    edition: Edition;
    uploader: string;
}

export const firebaseApp = initializeApp({
    apiKey: "AIzaSyAOME21OHL--AeH35Sgonr_F4md7TKkz0s",
    authDomain: "listoread.firebaseapp.com",
    projectId: "listoread",
    storageBucket: "listoread.appspot.com",
    messagingSenderId: "434308976599",
    appId: "1:434308976599:web:9f4a8675b4734924354592",
});

export const googleAuthProvider = new GoogleAuthProvider();

const db = getFirestore(firebaseApp);

export const authorsRef = collection(db, "authors");
export const publishersRef = collection(db, "publishers");
export const booksRef = collection(db, "books");
export const editionsRef = collection(db, "editions");
export const listItemsRef = collection(db, "list_items");
