import Link from "next/link";
import { mockTeacherSubmissions } from "@/lib/mockData";

export default function TeacherDashboard() {
  const pending = mockTeacherSubmissions.filter((s) => s.status === "pending");

  return (
    <div>
      <div className="mb-10">
        <p className="font-mono text-xs text-sky tracking-widest uppercase mb-2">
          Panel docente
        </p>
        <h1 className="font-display font-bold text-3xl text-carbon">
          Hola, Diego
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { value: pending.length,                            label: "por calificar" },
          { value: mockTeacherSubmissions.length,             label: "entregas totales" },
          { value: 12,                                         label: "estudiantes activos" },
        ].map((s) => (
          <div key={s.label} className="bg-surface rounded-lg p-5">
            <p className="font-display font-bold text-4xl text-carbon">{s.value}</p>
            <p className="text-xs text-carbon/35 font-mono mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pending entregas */}
      <div className="mb-10">
        <h2 className="font-display font-semibold text-lg text-carbon mb-4">
          Entregas pendientes de calificar
        </h2>
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                {["Estudiante", "Tarea", "Curso", "Enviado", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-mono text-carbon/35 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pending.map((sub) => (
                <tr key={sub.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-5 py-4 font-medium text-carbon">{sub.studentName}</td>
                  <td className="px-5 py-4 text-carbon/60">{sub.assignmentTitle}</td>
                  <td className="px-5 py-4 text-carbon/40">{sub.courseTitle}</td>
                  <td className="px-5 py-4 font-mono text-xs text-carbon/35">
                    {new Date(sub.submittedAt).toLocaleDateString("es-EC")}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/dashboard/teacher/evaluar/${sub.id}`}
                      className="text-xs text-sky hover:underline font-medium"
                    >
                      Evaluar →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* All submissions quick view */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg text-carbon">
            Todas las entregas
          </h2>
          <Link
            href="/dashboard/teacher/entregas"
            className="text-xs text-sky hover:underline"
          >
            Ver bandeja completa →
          </Link>
        </div>
        <div className="space-y-2">
          {mockTeacherSubmissions.map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between p-4 bg-surface rounded-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-ash flex items-center justify-center text-xs font-medium text-carbon/50">
                  {sub.studentName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-carbon">{sub.studentName}</p>
                  <p className="text-xs text-carbon/40">{sub.assignmentTitle}</p>
                </div>
              </div>
              <span
                className={`text-xs font-mono px-2.5 py-1 rounded ${
                  sub.status === "pending"
                    ? "bg-sky/10 text-sky"
                    : "bg-ash text-carbon/40"
                }`}
              >
                {sub.status === "pending" ? "Pendiente" : `${sub.grade}/10`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
