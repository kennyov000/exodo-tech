export default function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-display font-bold text-carbon/80">
          éxodo<span className="text-sky">tech</span>
        </span>
        <p className="text-sm text-carbon/40">
          Cuenca, Ecuador · {new Date().getFullYear()} · Todos los derechos reservados
        </p>
        <p className="text-xs text-carbon/30 font-mono">
          &lt;construido con propósito /&gt;
        </p>
      </div>
    </footer>
  );
}
