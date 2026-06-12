"use client";

/**
 * CodeMarquee — WOW element
 *
 * A slow infinite horizontal ribbon of real code fragments rendered
 * in JetBrains Mono at low opacity. It sits behind the hero copy,
 * creating depth without noise. Pauses on hover.
 *
 * Design decision: Using actual code from the school's curriculum
 * (Kotlin, React, TypeScript) makes it feel authentic rather than decorative.
 */

const SNIPPETS = [
  "fun main() {",
  "val escuela = éxodotech()",
  "useState<Course[]>([])",
  "@RestController",
  "interface Futuro {",
  "data class Estudiante(",
  "const aprender = async () =>",
  "SELECT * FROM conocimiento",
  "git commit -m 'inicio'",
  ".map { it.transform() }",
  "type Ruta = 'fundamentos' | 'ia'",
  "coroutineScope {",
  "export default function Hero()",
  "zod.object({ email: z.string() })",
  "docker compose up --build",
  "return ResponseEntity.ok()",
  "useEffect(() => {}, [slug])",
  "suspend fun aprender(): Result<T>",
  "class Mentor : Companion",
  "const [paso, setPaso] = useState(0)",
];

// Duplicate for seamless loop
const ALL = [...SNIPPETS, ...SNIPPETS];

export default function CodeMarquee() {
  return (
    <div
      aria-hidden
      className="pointer-events-none select-none w-full overflow-hidden py-3"
    >
      <div className="marquee-track">
        {ALL.map((snippet, i) => (
          <span
            key={i}
            className="inline-block font-mono text-sm text-carbon/20 px-6 whitespace-nowrap"
          >
            {snippet}
            <span className="mx-6 text-carbon/10">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
