import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-canvas/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link href="/" className="font-display font-bold text-xl text-carbon tracking-tight">
          éxodo<span className="text-sky">tech</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#rutas"    className="text-sm font-medium text-carbon/50 hover:text-carbon transition-colors">Rutas</Link>
          <Link href="#filosofia" className="text-sm font-medium text-carbon/50 hover:text-carbon transition-colors">Filosofía</Link>
        </nav>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-sky text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-sky/90 transition-colors"
        >
          Acceso Portal
        </Link>
      </div>
    </header>
  );
}
