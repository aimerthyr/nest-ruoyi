export function bigintReplacer(_key: string, value: any) {
  return typeof value === 'bigint' ? value.toString() : value;
}
