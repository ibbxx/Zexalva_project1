'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { formatCurrency } from '@/lib/currency';

type QRISModalProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  total: number;
  customerName: string;
  qrImageUrl: string;
  orderId: string;
};

export const QRISModal = ({ open, onOpenChange, total, customerName, qrImageUrl, orderId }: QRISModalProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />
      <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md rounded-[var(--radius-lg)] bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-[var(--brand-black)]">
              QRIS Pembayaran
            </Dialog.Title>
            <Dialog.Close className="rounded-full bg-[var(--brand-surface)] p-1 text-[var(--brand-muted)] transition hover:text-[var(--brand-black)]">
              <X size={18} />
            </Dialog.Close>
          </div>
          <p className="mt-2 text-sm text-[var(--brand-muted)]">
            Scan QR berikut dan selesaikan pembayaran untuk pesanan <strong>{customerName}</strong>.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="rounded-[var(--radius-md)] border border-[var(--brand-pink-200)] bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrImageUrl}
                alt="QRIS Pembayaran"
                className="h-72 w-72 max-w-full rounded-[var(--radius-sm)] border border-[var(--brand-surface)] object-cover"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-[var(--brand-muted)]">Total Pembayaran</p>
              <p className="text-2xl font-semibold text-[var(--brand-black)]">{formatCurrency(total)}</p>
              <p className="mt-2 text-xs text-[var(--brand-muted)]">ID Pesanan: {orderId}</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-[var(--brand-muted)]">
            Setelah pembayaran berhasil, mohon kirim bukti transfer ke WhatsApp agar tim kami dapat memproses pesanan
            kamu.
          </p>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
