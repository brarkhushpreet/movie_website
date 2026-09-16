import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MemberGate } from "@/components/MemberGate";

// Fetch the catalog at runtime, without build-time TMDB secrets or an ISR store.
export const dynamic = "force-dynamic";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <MemberGate>
      <Header />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </MemberGate>
  );
}
