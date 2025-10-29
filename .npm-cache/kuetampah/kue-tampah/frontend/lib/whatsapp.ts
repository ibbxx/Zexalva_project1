import { formatCurrency } from '@/lib/currency';
import { Product } from '@/lib/products';

type CheckoutPayload = {
  customerName: string;
  phone: string;
  notes?: string;
  deliveryMethod: 'pickup' | 'delivery';
  address?: string;
  items: Array<{ product: Product; quantity: number }>;
};

export const buildWhatsappMessage = (payload: CheckoutPayload) => {
  const lines: string[] = [
    '*Halo Toko Kue Tampah!*',
    '',
    'Saya ingin melakukan pemesanan dengan detail berikut:',
    `Nama: ${payload.customerName}`,
    `Nomor: ${payload.phone}`,
    `Metode Pengiriman: ${payload.deliveryMethod === 'pickup' ? 'Ambil di Toko' : 'Antar ke Alamat'}`,
  ];

  if (payload.deliveryMethod === 'delivery' && payload.address) {
    lines.push(`Alamat: ${payload.address}`);
  }

  lines.push('', '*Pesanan:*');

  payload.items.forEach((item, index) => {
    const subtotal = item.quantity * item.product.price;
    lines.push(
      `${index + 1}. ${item.product.name} x${item.quantity} - ${formatCurrency(item.product.price)} (Total ${formatCurrency(subtotal)})`,
    );
  });

  const total = payload.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
  lines.push('', `Total Pembayaran: *${formatCurrency(total)}*`);

  if (payload.notes) {
    lines.push('', `Catatan: ${payload.notes}`);
  }

  lines.push('', 'Mohon konfirmasi ketersediaan dan detail pembayaran ya. Terima kasih!');

  return encodeURIComponent(lines.join('\n'));
};
