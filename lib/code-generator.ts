const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return code;
}

export function isValidCode(code: string): boolean {
  return /^[A-Z2-9]{6}$/.test(code.toUpperCase());
}

export function formatCode(code: string): string {
  return code.toUpperCase().replace(/([A-Z2-9]{3})([A-Z2-9]{3})/, "$1-$2");
}
