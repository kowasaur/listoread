import type { Author, Edition } from "./firebase";

export const getInputById = (id: string) => <HTMLInputElement>document.getElementById(id);

export const inputValue = (id: string) => getInputById(id).value.trim();

export function fullName(author: Author) {
    if (author.surname_first) return `${author.surname} ${author.given_name}`;
    return `${author.given_name} ${author.surname}`;
}

export function editionAuthors(edition: Edition) {
    const authors = edition.books.flatMap(b => b.authors);

    // in theory should never happen but does because not loading nested refs
    if (authors.some(a => a === undefined)) return [];

    return authors.filter((a, i, all) => all.findIndex(a2 => a2.id === a.id) === i);
}

// Format to YYYY-MM-DD
export function formatDate(date?: Date): string {
    if (date === undefined) return "";
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "2-digit" });
    const day = date.toLocaleString("default", { day: "2-digit" });
    return `${year}-${month}-${day}`;
}
