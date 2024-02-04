import type { Author } from "./firebase";

export const getInputById = (id: string) => <HTMLInputElement>document.getElementById(id);

export const inputValue = (id: string) => getInputById(id).value.trim();

export function fullName(author: Author) {
    if (author.surname_first) return `${author.surname} ${author.given_name}`;
    return `${author.given_name} ${author.surname}`;
}
