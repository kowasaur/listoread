import type { Author, Edition, Datey } from "./firebase";

export const getInputById = (id: string) => <HTMLInputElement>document.getElementById(id);

export const inputValue = (id: string) => getInputById(id).value.trim();

export function fullName(author: Author) {
    let first = author.given_name;
    let last = author.surname;
    if (author.surname_first) [first, last] = [last, first];
    if (first !== "") first += " ";
    return first + last;
}

export function editionAuthors(edition: Edition) {
    const authors = edition.books.flatMap(b => b.authors);

    // in theory should never happen but does because not loading nested refs
    if (authors.some(a => a === undefined)) return [];

    return authors.filter((a, i, all) => all.findIndex(a2 => a2.id === a.id) === i);
}

// Format to YYYY-MM-DD
export function formatDate(date: Datey): string {
    if (!date) return "";
    if (typeof date === "number") return date.toString();
    const d = date.toDate();
    const year = d.getFullYear();
    const month = d.toLocaleString("default", { month: "2-digit" });
    const day = d.toLocaleString("default", { day: "2-digit" });
    return `${year}-${month}-${day}`;
}

export function capLength(str: string, max: number = 50): string {
    return str.length > max ? str.slice(0, max - 3) + "..." : str;
}
