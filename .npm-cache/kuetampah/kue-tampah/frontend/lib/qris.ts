const DEFAULT_QRIS_API = "https://api.qrserver.com/v1/create-qr-code/";

export type QRISParams = {
  total: number;
  customerName: string;
  orderId: string;
};

export const buildQRISUrl = ({ total, customerName, orderId }: QRISParams) => {
  const base = process.env.NEXT_PUBLIC_QRIS_API_URL ?? DEFAULT_QRIS_API;
  const payload = {
    orderId,
    customerName,
    total,
  };

  const data = encodeURIComponent(JSON.stringify(payload));
  const size = "340x340";

  const url = new URL(base);
  if (!url.searchParams.has("size")) {
    url.searchParams.set("size", size);
  }
  url.searchParams.set("data", data);

  return url.toString();
};
