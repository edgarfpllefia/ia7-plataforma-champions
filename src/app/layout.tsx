import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { NavAuth } from "@/components/NavAuth";
import { Providers } from "@/components/Providers";

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "UCL · Champions League 2025/26",
  description: "Resultados, equipos y clasificación de la UEFA Champions League 2025/26",
};

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/equipos", label: "Equipos" },
  { href: "/partidos", label: "Partidos" },
  { href: "/resultados", label: "Resultados" },
  { href: "/clasificacion", label: "Clasificación" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${bebas.variable} ${dmSans.variable} antialiased bg-[#06080f] text-white min-h-screen font-dm`}>
        <Providers>
          {/* Ambient background glow */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-20%] left-[10%] w-[600px] h-[400px] bg-blue-700/8 rounded-full blur-[120px]" />
            <div className="absolute top-[30%] right-[-5%] w-[400px] h-[400px] bg-indigo-800/6 rounded-full blur-[100px]" />
          </div>

          <nav className="relative z-50 border-b border-white/5 bg-[#06080f]/80 backdrop-blur-xl sticky top-0">
            <div className="container mx-auto max-w-7xl px-5 flex items-center justify-between h-[60px]">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative w-9 h-9">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl rotate-3 group-hover:rotate-6 transition-transform duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                    </svg>
                  </div>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-bebas text-xl tracking-[0.12em] text-white">Champions</span>
                  <span className="text-[10px] font-medium tracking-[0.2em] text-blue-400 uppercase">2025 / 26</span>
                </div>
              </Link>

              {/* Nav */}
              <div className="hidden md:flex items-center">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="relative px-4 py-1.5 text-[13px] font-medium tracking-wide text-gray-400 hover:text-white transition-colors duration-200 group"
                  >
                    {label}
                    <span className="absolute bottom-0 left-4 right-4 h-px bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                  </Link>
                ))}
              </div>

              {/* Auth dinámico */}
              <NavAuth />
            </div>
          </nav>

          <div className="relative z-10">
            {children}
          </div>

          <footer className="relative z-10 border-t border-white/5 mt-24 py-10">
            <div className="container mx-auto max-w-7xl px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                </div>
                <span className="font-bebas text-lg tracking-widest text-white/50">Champions SaaS</span>
              </div>
              <p className="text-xs text-gray-700 tracking-wide">UEFA Champions League 2025/26 · Proyecto IA7 M0613</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
