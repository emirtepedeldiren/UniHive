import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <span className="text-7xl mb-6">🐝</span>
      <h1 className="headline-md text-hive-black mb-2">
        Arı bulunamadı!
      </h1>
      <p className="body-sm text-on-surface-variant mb-6">
        Aradığın sayfa ya uçtu ya da hiç var olmadı.
      </p>
      <Link href="/" className="btn-primary">
        Ana Sayfaya Dön
      </Link>
    </div>
  );
}
