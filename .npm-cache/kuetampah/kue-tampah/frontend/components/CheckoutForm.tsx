'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { useCart } from '@/context/CartContext';
import { buildQRISUrl } from '@/lib/qris';
import { buildWhatsappMessage } from '@/lib/whatsapp';
import { QRISModal } from '@/components/QRISModal';

const formSchema = z
  .object({
    name: z.string().min(2, 'Nama minimal 2 karakter.'),
    phone: z
      .string()
      .min(8, 'Nomor telepon tidak valid.')
      .regex(/^[0-9+]+$/, 'Nomor telepon hanya boleh berisi angka dan +.'),
    address: z.string().optional(),
    deliveryMethod: z.enum(['pickup', 'delivery']),
    paymentMethod: z.enum(['transfer', 'qris', 'cod']),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod === 'delivery') {
      if (!data.address || data.address.trim().length < 10) {
        ctx.addIssue({
          path: ['address'],
          code: z.ZodIssueCode.custom,
          message: 'Alamat dibutuhkan untuk pengantaran.',
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

const CHECKOUT_FORM_STORAGE_KEY = 'kue-tampah-checkout-form';
const defaultFormValues: FormValues = {
  name: '',
  phone: '',
  address: '',
  deliveryMethod: 'delivery',
  paymentMethod: 'transfer',
  notes: '',
};

export const CheckoutForm = () => {
  const { items, subtotal, completeCheckout } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrisData, setQrisData] = useState<{ open: boolean; qrUrl: string; orderId: string; name: string }>({
    open: false,
    qrUrl: '',
    orderId: '',
    name: '',
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(CHECKOUT_FORM_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        reset({ ...defaultFormValues, ...parsed });
      } catch {
        reset(defaultFormValues);
      }
    }
  }, [reset]);

  const watchedValues = watch();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(CHECKOUT_FORM_STORAGE_KEY, JSON.stringify(watchedValues));
  }, [watchedValues]);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '6281234567890';

  const onSubmit = async (data: FormValues) => {
    if (items.length === 0) {
      toast.error('Keranjangmu masih kosong.');
      return;
    }
    if (!whatsappNumber) {
      toast.error('Nomor WhatsApp belum dikonfigurasi.');
      return;
    }

    setIsSubmitting(true);
    const orderId = `KT-${Date.now()}`;

    try {
      const encodedMessage = buildWhatsappMessage({
        customerName: data.name,
        phone: data.phone,
        deliveryMethod: data.deliveryMethod,
        address: data.address,
        notes: data.notes,
        items,
      });
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      toast.success('Checkout dibuka di WhatsApp.');

      if (data.paymentMethod === 'qris') {
        const qrUrl = buildQRISUrl({
          total: subtotal,
          customerName: data.name,
          orderId,
        });
        setQrisData({ open: true, qrUrl, orderId, name: data.name });
      } else {
        completeCheckout();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deliveryMethod = watch('deliveryMethod');
  const paymentMethod = watch('paymentMethod');

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-[var(--radius-lg)] bg-white/90 p-6 shadow-card backdrop-blur"
      >
        <div>
          <h2 className="text-xl font-semibold text-[var(--brand-brown-700)]">Data Pemesan</h2>
          <p className="text-sm text-[var(--brand-muted)]">
            Seluruh data tersimpan di perangkatmu agar proses checkout berikutnya lebih cepat.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-[var(--brand-brown-700)]">Nama Lengkap</span>
            <input
              type="text"
              {...register('name')}
              className="rounded-[var(--radius-md)] border border-[var(--brand-brown-300)] bg-white px-3 py-2 text-base focus:border-[var(--brand-brown-500)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-cream-200)]"
              placeholder="Contoh: Anisa Putri"
            />
            {errors.name && <span className="text-xs text-[var(--brand-brown-500)]">{errors.name.message}</span>}
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-[var(--brand-brown-700)]">Nomor WhatsApp</span>
            <input
              type="tel"
              {...register('phone')}
              className="rounded-[var(--radius-md)] border border-[var(--brand-brown-300)] bg-white px-3 py-2 text-base focus:border-[var(--brand-brown-500)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-cream-200)]"
              placeholder="Contoh: 628123456789"
            />
            {errors.phone && <span className="text-xs text-[var(--brand-brown-500)]">{errors.phone.message}</span>}
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-[var(--brand-brown-700)]">Metode Pengiriman</span>
            <select
              {...register('deliveryMethod')}
              className="rounded-[var(--radius-md)] border border-[var(--brand-brown-300)] bg-white px-3 py-2 text-base focus:border-[var(--brand-brown-500)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-cream-200)]"
            >
              <option value="delivery">Antar ke alamat</option>
              <option value="pickup">Ambil sendiri di dapur</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-[var(--brand-brown-700)]">Metode Pembayaran</span>
            <select
              {...register('paymentMethod')}
              className="rounded-[var(--radius-md)] border border-[var(--brand-brown-300)] bg-white px-3 py-2 text-base focus:border-[var(--brand-brown-500)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-cream-200)]"
            >
              <option value="transfer">Transfer Bank</option>
              <option value="qris">QRIS</option>
              <option value="cod">Bayar di tempat (COD)</option>
            </select>
            {paymentMethod === 'qris' && (
              <span className="text-xs text-[var(--brand-muted)]">QRIS akan muncul setelah kamu submit form.</span>
            )}
          </label>
        </div>

        {deliveryMethod === 'delivery' && (
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-medium text-[var(--brand-brown-700)]">Alamat Lengkap</span>
            <textarea
              rows={3}
              {...register('address')}
              className="rounded-[var(--radius-md)] border border-[var(--brand-brown-300)] bg-white px-3 py-2 text-base focus:border-[var(--brand-brown-500)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-cream-200)]"
              placeholder="Contoh: Jl. Sukajadi No. 15, Bandung"
            />
            {errors.address && <span className="text-xs text-[var(--brand-brown-500)]">{errors.address.message}</span>}
          </label>
        )}

        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-[var(--brand-brown-700)]">Catatan Tambahan</span>
          <textarea
            rows={3}
            {...register('notes')}
            className="rounded-[var(--radius-md)] border border-[var(--brand-brown-300)] bg-white px-3 py-2 text-base focus:border-[var(--brand-brown-500)] focus:outline-none focus:ring-4 focus:ring-[var(--brand-cream-200)]"
            placeholder="Permintaan khusus, jadwal pengiriman, dll (opsional)"
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting || items.length === 0}
          className="w-full rounded-full bg-[var(--brand-brown-500)] px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-[var(--brand-brown-700)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Memproses…' : 'Kirim Pesanan via WhatsApp'}
        </button>
      </form>

      <QRISModal
        open={qrisData.open}
        onOpenChange={(open) => {
          setQrisData((prev) => ({ ...prev, open }));
          if (!open) {
            completeCheckout();
            toast.success('QRIS ditutup. Keranjang dikosongkan.');
          }
        }}
        total={subtotal}
        customerName={qrisData.name}
        qrImageUrl={qrisData.qrUrl}
        orderId={qrisData.orderId}
      />
    </>
  );
};
