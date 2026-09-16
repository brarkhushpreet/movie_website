import Image from "next/image";
import { BrandLogo } from "./BrandLogo";

export function AuthBackdrop({ children }: { children: React.ReactNode }) {
  return (
    <main className="cinema-grain relative min-h-screen overflow-hidden bg-vanta-ink">
      <Image
        src="https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg"
        alt=""
        fill
        priority
        className="object-cover opacity-45"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.76)_0%,rgba(0,0,0,.28)_42%,rgba(0,0,0,.92)_100%)]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1400px] flex-col px-5 py-6 sm:px-10 sm:py-8">
        <BrandLogo href="/login" />
        <div className="flex flex-1 items-center justify-center py-10">{children}</div>
        <p className="text-center text-[11px] text-white/35">Demo streaming experience · Film metadata provided by TMDB</p>
      </div>
    </main>
  );
}
