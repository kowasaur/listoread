import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, type User } from "firebase/auth";
import {
    Query,
    QueryConstraint,
    Timestamp,
    collection,
    getFirestore,
    query,
    where,
} from "firebase/firestore";

interface Doc {
    uploader: string;
    readonly id: string; // added by VueFire
}

export interface Author extends Doc {
    given_name: string;
    surname: string;
    surname_first?: boolean;
}

export interface Publisher extends Doc {
    publisher: string;
}

export interface Book extends Doc {
    title: string;
    authors: Author[];
}

export interface Edition extends Doc {
    title: string;
    subtitle?: string;
    books: Book[];
    publisher: Publisher;
    url?: string;
    img_url?: string;
}

export interface ListItem extends Doc {
    edition: Edition;
    group: ListGroup | null;
}

export interface ListGroup extends Doc {
    order: number;
    name: string;
    colour: string;
}

export type LocalListGroup = ListGroup | Omit<ListGroup, "order" | "uploader">;
export type FormListGroup = Omit<ListGroup, "id" | "order">;

export type Datey = Timestamp | number | null;
export interface Reading extends Doc {
    edition: Edition;
    book: Book;
    start: Timestamp | null;
    finish: Datey;
}

export interface Note extends Doc {
    book: Book;
    note: string;
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
export const listGroupsRef = collection(db, "list_groups");
export const readingsRef = collection(db, "readings");
export const notesRef = collection(db, "notes");

type MaybeUser = User | undefined | null;
export function whereUser(qRef: Query, user: MaybeUser, ...constraints: QueryConstraint[]) {
    return query(qRef, where("uploader", "==", user?.uid ?? null), ...constraints);
}
