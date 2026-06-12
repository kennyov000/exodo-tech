import Link from "next/link";
import { mockStudent, mockAssignments } from "@/lib/mockData";

export default function StudentDashboard() {
  const s = mockStudent;
  const pending = mockAssignments.filter((a) => a.status === "pending");

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-xs text-sky tracking-widest uppercase mb-2">
          Bienvenida de vuelta
        </p>
        <h1 className="font-display font-bold text-3xl text-carbon">
          {s.name}
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-ash rounded-lg p-6">
          <p className="text-xs font-mono text-carbon/40 uppercase tracking-wide mb-3">
            Clase actual
          </p>
          <p className="font-display font-semibold text-carbon text-base leading-snug">
            {s.currentCourse}
          </p>
          <p className="text-xs text-carbon/40 mt-2">{s.currentModule}</p>
        </div>

        <div className="bg-ash rounded-lg p-6">
          <p className="text-xs font-mono text-carbon/40 uppercase tracking-wide mb-3">
            Tareas pendientes
          </p>
          <p className="font-display font-bold text-4xl text-carbon">
            {s.pendingCount}
          </p>
          <Link
            href="/dashboard/student/entregas"
            className="text-xs text-sky mt-2 inline-block hover:underline"
          >
            Ver entregas →
          </Link>
        </div>

        <div className="bg-ash rounded-lg p-6">
          <p className="text-xs font-mono text-carbon/40 uppercase tracking-wide mb-3">
            Progreso general
          </p>
          <p className="font-display font-bold text-4xl text-carbon">
            {s.progress}%
          </p>
          <div className="mt-3 w-full bg-border rounded-full h-1.5">
            <div
              className="bg-sky h-1.5 rounded-full transition-all"
              style={{ width: `${s.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pending assignments */}
      <div>
        <h2 className="font-display font-semibold text-lg text-carbon mb-4">
          Entregas próximas
        </h2>
        <div className="space-y-3">
          {pending.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between p-4 border border-border rounded-md hover:border-sky/30 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-carbon">{a.title}</p>
                <p className="text-xs text-carbon/40 mt-0.5 font-mono">
                  vence {a.dueDate}
                </p>
              </div>
              <Link
                href="/dashboard/student/entregas"
                className="text-xs bg-sky text-white px-4 py-1.5 rounded hover:bg-sky/90 transition-colors"
              >
                Entregar
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Continue studying */}
      <div className="mt-10 border-t border-border pt-10">
        <h2 className="font-display font-semibold text-lg text-carbon mb-4">
          Continuar estudiando
        </h2>
        <Link
          href="/dashboard/student/materia/fundamentos-programacion"
          className="group flex items-center justify-between p-5 bg-carbon text-canvas rounded-lg hover:bg-carbon/90 transition-colors"
        >
          <div>
            <p className="font-display font-semibold">{s.currentCourse}</p>
            <p className="text-sm text-canvas/50 mt-1">{s.currentModule}</p>
          </div>
          <span className="text-canvas/40 group-hover:text-canvas transition-colors text-xl">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
