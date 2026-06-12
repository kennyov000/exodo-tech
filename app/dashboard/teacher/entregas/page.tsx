import Link from "next/link";
import { mockTeacherSubmissions } from "@/lib/mockData";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  graded:  "Calificado",
};

export default function TeacherEntregasPage() {
  return (
    <div>
      <div className="mb-10">
        <p className="font-mono text-xs text-sky tracking-widest uppercase mb-2">
          Docente
        </p>
        <h1 className="font-display font-bold text-3xl text-carbon">
          Bandeja de entregas
        </h1>
      </div>

      {/* Stats row */}
      <div className="flex gap-6 mb-8">
        <div className="bg-ash rounded-md px-6 py-4 text-center">
          <p className="font-display font-bold text-2xl text-carbon">
            {mockTeacherSubmissions.filter(s => s.status === "pending").length}
          </p>
          <p className="text-xs text-carbon/40 mt-1">por calificar</p>
        </div>
        <div className="bg-ash rounded-md px-6 py-4 text-center">
          <p className="font-display font-bold text-2xl text-carbon">
            {mockTeacherSubmissions.length}
          </p>
          <p className="text-xs text-carbon/40 mt-1">total</p>
        </div>
      </div>

      {/* DataTable */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ash border-b border-border">
            <tr>
              {["Estudiante", "Tarea", "Curso", "Enviado", "Estado", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-mono text-carbon/40 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockTeacherSubmissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-ash/50 transition-colors">
                <td className="px-5 py-4 font-medium text-carbon">
                  {sub.studentName}
                </td>
                <td className="px-5 py-4 text-carbon/70">
                  {sub.assignmentTitle}
                </td>
                <td className="px-5 py-4 text-carbon/50">{sub.courseTitle}</td>
                <td className="px-5 py-4 font-mono text-xs text-carbon/40">
                  {new Date(sub.submittedAt).toLocaleDateString("es-EC")}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block text-xs font-mono px-2.5 py-1 rounded ${
                      sub.status === "pending"
                        ? "bg-sky/10 text-sky"
                        : "bg-carbon/5 text-carbon/50"
                    }`}
                  >
                    {STATUS_LABELS[sub.status]}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/dashboard/teacher/evaluar/${sub.id}`}
                    className="text-xs text-sky hover:underline"
                  >
                    {sub.status === "pending" ? "Evaluar →" : "Ver →"}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
