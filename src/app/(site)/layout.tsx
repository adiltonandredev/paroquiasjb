import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/cookie-banner";
import { SocialFloating } from "@/components/site/SocialFloating";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      
      {/* ADICIONE A LINHA ABAIXO PARA O BANNER APARECER */}
      <CookieBanner />
      <SocialFloating />
    </div>
  );
}