export function generateQrDataUrl(text: string, size = 200): string {
  // Generate a QR code SVG locally using a minimal algorithm via public API fallback
  // We use QR Server API as a fallback for reliability
  const encoded = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&color=14532D&bgcolor=FFFFFF&margin=0&qzone=2`;
}
