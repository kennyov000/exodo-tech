import { mockCourses } from "@/lib/mockData";
import { notFound } from "next/navigation";

interface Props {
  params: { slug: string };
}

export default function MateriaPage({ params }: Props) {
  const course = mockCourses.find((c) => c.slug === params.slug);
  if (!course) notFound();

  const module = course.modules[0];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-carbon/30 mb-12">
        <span>{course.title}</span>
        <span>/</span>
        <span className="text-carbon/60">{module?.title ?? "Módulo"}</span>
      </nav>

      {/* Module header */}
      <div className="mb-10">
        <span className="inline-block font-mono text-xs text-sky bg-sky/8 px-3 py-1 rounded mb-4">
          {course.level} · {course.duration}
        </span>
        <h1 className="font-display font-bold text-display-lg text-carbon">
          {module?.title ?? course.title}
        </h1>
      </div>

      {/* Content — prose-exodo applies our custom vars */}
      <article className="prose prose-exodo prose-lg max-w-none">
        {/* In production, use next-mdx-remote or similar to render module.content */}
        <p>
          Una variable es un espacio en memoria al que le asignamos un nombre
          para poder referirnos a él después. En Kotlin, usamos{" "}
          <code>val</code> para valores inmutables y <code>var</code> para
          variables mutables.
        </p>

        <pre>
          <code className="language-kotlin">
{`// Val: inmutable (preferido cuando sea posible)
val nombre = "éxodotech"
val año    = 2025

// Var: mutable
var contador = 0
contador += 1

// Tipo explícito
val precio: Double = 19.99`}
          </code>
        </pre>

        <h2>¿Por qué importa la inmutabilidad?</h2>
        <p>
          Cuando declaras un valor como <code>val</code>, el compilador garantiza
          que nadie lo cambiará después. Esto reduce errores, facilita el
          razonamiento sobre el código y habilita optimizaciones del compilador.
        </p>

        <blockquote>
          Escribe <code>val</code> por defecto. Cambia a <code>var</code> solo
          cuando realmente necesites mutar el valor.
        </blockquote>

        <h2>Tipos básicos</h2>
        <pre>
          <code className="language-kotlin">
{`val entero:   Int     = 42
val decimal:  Double  = 3.14
val texto:    String  = "Hola"
val bandera:  Boolean = true
val caracter: Char    = 'K'`}
          </code>
        </pre>
      </article>

      {/* Module navigation */}
      <div className="mt-16 border-t border-border pt-8 flex justify-between text-sm">
        <span className="text-carbon/30">← Módulo anterior</span>
        <span className="text-sky cursor-pointer hover:underline">
          Siguiente módulo →
        </span>
      </div>
    </div>
  );
}
