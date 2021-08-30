export const prettifyEnum = (string: string) => {
    let s = string.toLowerCase();
    return s[0].toUpperCase() + s.slice(1)
}