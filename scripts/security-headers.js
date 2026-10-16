export const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self'; style-src-attr 'none'; img-src 'self' data: blob:; font-src 'self'; connect-src 'none'; media-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=()",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Cross-Origin-Opener-Policy": "same-origin",
};
export const HTTPS_HEADERS = {
  "Strict-Transport-Security": "max-age=31536000",
};
export function staticHeadersFile() {
  return (
    "/*\n" +
    Object.entries({
      ...SECURITY_HEADERS,
      ...HTTPS_HEADERS,
      "Cache-Control": "no-cache",
    })
      .map(([name, value]) => `  ${name}: ${value}`)
      .join("\n") +
    "\n"
  );
}
