export const inputValue = (id: string) =>
    (<HTMLInputElement>document.getElementById(id)).value.trim();
