import Link from "next/link";
import TypewriterHero from "@/components/wow/TypewriterHero";
import { mockCourses } from "@/lib/mockData";

export default function HomePage() {
  return (
    <>
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="pt-24 pb-16 bg-surface">
        <div className="container mx-auto px-6 max-w-5xl">
          <p className="font-mono text-xs text-sky tracking-widest uppercase mb-6">
            Escuela de programación · Cuenca, Ecuador
          </p>

          {/* Typewriter — layout fijo, no salta */}
          <TypewriterHero />

          <p className="mt-8 text-lg text-carbon/55 max-w-xl leading-relaxed">
            Rutas claras, mentores reales y una comunidad que sabe que
            el código es el lenguaje del siglo XXI. Empieza donde estás.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#rutas"
              className="inline-flex items-center gap-2 bg-sky text-white font-medium px-7 py-3.5 rounded-md hover:bg-sky/90 transition-colors text-sm"
            >
              Ver rutas de aprendizaje
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="#filosofia"
              className="text-sm font-medium text-carbon/40 hover:text-carbon transition-colors"
            >
              Nuestra filosofía
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap gap-12 border-t border-border pt-10">
            {[
              { value: "2",      label: "rutas activas" },
              { value: "100%",   label: "proyectos reales" },
              { value: "Austro", label: "región prioritaria" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display font-bold text-3xl text-carbon">{s.value}</p>
                <p className="text-sm text-carbon/35 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFIESTO ────────────────────────────────────────────── */}
      <section id="filosofia" className="py-28 border-t border-border">
        <div className="container mx-auto px-6 max-w-3xl">
          <p className="font-mono text-xs text-sky tracking-widest uppercase mb-10">
            Filosofía
          </p>
          <blockquote className="font-display font-bold text-display-lg text-carbon leading-tight border-l-4 border-sky pl-6" style={{ borderRadius: 0 }}>
            "No enseñamos tecnología.<br />
            Enseñamos a pensar con ella."
          </blockquote>
          <div className="mt-12 space-y-6 text-carbon/55 text-lg leading-relaxed">
            <p>
              Vivimos en una época donde cualquier persona con acceso a internet
              puede aprender a construir software. Pero la mayoría de los cursos
              enseñan herramientas, no mentalidad.
            </p>
            <p>
              En éxodotech creemos que la programación es una habilidad de
              resolución de problemas, y que la IA no reemplaza al programador —
              lo potencia. Por eso nuestras rutas combinan fundamentos sólidos
              con productividad real desde el día uno.
            </p>
            <p className="font-medium text-carbon">
              Sin relleno. Sin teoría vacía. Solo construcción deliberada.
            </p>
          </div>
        </div>
      </section>

      {/* ── RUTAS ─────────────────────────────────────────────────── */}
      <section id="rutas" className="py-24 bg-surface">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <div>
              <p className="font-mono text-xs text-sky tracking-widest uppercase mb-4">Rutas</p>
              <h2 className="font-display font-bold text-display-lg text-carbon">Elige tu camino</h2>
            </div>
            <p className="text-sm text-carbon/45 max-w-xs">
              Cada ruta está diseñada como un sistema completo, no como una lista de videos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {mockCourses.map((course) => (
              <article
                key={course.slug}
                className="bg-white p-8 rounded-lg border border-border hover:border-sky/30 transition-colors group"
              >
                <div className="flex items-start justify-between mb-6">
                  <span className="inline-block text-xs font-mono text-sky bg-sky/10 px-3 py-1 rounded">
                    {course.level}
                  </span>
                  <span className="text-xs text-carbon/30 font-mono">{course.duration}</span>
                </div>
                <h3 className="font-display font-semibold text-xl text-carbon mb-3">{course.title}</h3>
                <p className="text-sm text-carbon/50 leading-relaxed">{course.tagline}</p>
                <div className="mt-8 text-sm font-medium text-carbon/25 group-hover:text-sky transition-colors">
                  Ver ruta →
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="py-28">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <h2 className="font-display font-bold text-display-xl text-carbon mb-6">
            El mejor momento era ayer.<br />El segundo mejor es ahora.
          </h2>
          <p className="text-carbon/45 mb-10">
            Inscripciones abiertas para la próxima cohorte en Cuenca.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-sky text-white font-medium px-8 py-4 rounded-md hover:bg-sky/90 transition-colors"
          >
            Acceder al portal →
          </Link>
        </div>
      </section>
    </>
  );
}
