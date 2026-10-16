export const AWARDS = [
  "Ni un rasguño",
  "Coro de diez",
  "Plaza diversa",
  "La plaza resiste",
];
export function validAwards(value) {
  return Array.isArray(value)
    ? [...new Set(value.filter((name) => AWARDS.includes(name)))].slice(
        0,
        AWARDS.length,
      )
    : [];
}
