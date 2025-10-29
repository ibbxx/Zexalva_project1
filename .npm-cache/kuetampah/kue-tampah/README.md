## Kue Tampah — Next.js App Router + NextAuth + Prisma

Monorepo e-commerce untuk pemesanan kue tampah. Tumpukan utama: Next.js App Router, NextAuth, Prisma, TypeScript, Tailwind.

---

### 1. Persyaratan
- Node.js 20+ (gunakan `corepack` bawaan)
- pnpm (`corepack enable`)
- SQLite untuk dev lokal (default) atau Postgres via `DATABASE_URL`

### 2. Setup Cepat
```bash
corepack pnpm install
cp .env.example .env.local
# Edit .env.local sesuai kebutuhan

# Generate Prisma Client
corepack pnpm db:generate

# Sinkronisasi schema (pastikan DATABASE_URL terset)
DATABASE_URL="file:./dev.db" NEXTAUTH_SECRET="dev_secret" corepack pnpm db:push

# Seed user+data dasar
corepack pnpm tsx prisma/seed.ts

# Jalankan dev server
corepack pnpm dev
```
App akan berjalan di `http://localhost:3000` (atau port alternatif jika sibuk).

### 3. Variabel Lingkungan Minimal
| Nama | Contoh | Wajib | Keterangan |
| --- | --- | --- | --- |
| `NEXTAUTH_SECRET` | `dev_secret` | ✅ | Gunakan string acak > 32 karakter untuk produksi |
| `DATABASE_URL` | `file:./dev.db` | ✅ | SQLite lokal atau Postgres/Planetscale |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | ✅ | Digunakan API client | 

Opsional:
- GitHub OAuth: `GITHUB_ID`, `GITHUB_SECRET`
- Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- SMTP (EmailProvider): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

### 4. Seed Pengguna
`prisma/seed.ts` membuat tiga akun kredensial default:

| Role | Email | Password |
| --- | --- | --- |
| ADMIN | `admin@kue-tampah.local` | `password123` |
| STAFF | `staff@kue-tampah.local` | `password123` |
| CUSTOMER | `customer@kue-tampah.local` | `password123` |

Jalankan dengan:
```bash
corepack pnpm tsx prisma/seed.ts
```

### 5. Pengujian & Kualitas
```bash
corepack pnpm lint
corepack pnpm typecheck
# Pastikan server dev/preview berjalan sebelum e2e
E2E_BASE_URL=http://localhost:3000 corepack pnpm test:e2e
```

### 6. Autentikasi & Guard Role
- Server helper `auth()` ⇒ `lib/auth/index.ts`
- Guard role siap pakai ⇒ `lib/auth/guards.ts`

Contoh pemakaian guard di layout server:
```ts
// app/(admin)/layout.tsx
import { requireRole } from "@/lib/auth/guards";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole({ allowedRoles: ["ADMIN", "STAFF"] });
  return <>{children}</>;
}
```

### 7. OAuth & SMTP Opsional
aktifkan GitHub/Email dengan mengisi env lalu restart server. Lihat komentar di `lib/auth/options.ts` untuk cara mengaktifkan `EmailProvider`.

### 8. Commit & CI
```bash
git add .
git commit -m "feat(auth): seed default roles and add guards"
```

Pastikan lint/typecheck/test hijau sebelum push/deploy.
