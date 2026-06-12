"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { mockTeacherSubmissions } from "@/lib/mockData";
import { notFound } from "next/navigation";
import { useState } from "react";

const gradeSchema = z.object({
  grade: z
    .number({ invalid_type_error: "Ingresa una nota numérica." })
    .min(0, "Mínimo 0")
    .max(10, "Máximo 10"),
  feedback: z.string().min(10, "El feedback debe tener al menos 10 caracteres."),
});

type GradeFormValues = z.infer<typeof gradeSchema>;

interface Props {
  params: { id: string };
}

export default function EvaluarPage({ params }: Props) {
  const submission = mockTeacherSubmissions.find((s) => s.id === params.id);
  if (!submission) notFound();

  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GradeFormValues>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      grade:    submission.grade ?? undefined,
      feedback: submission.feedback ?? "",
    },
  });

  const onSubmit = async (_data: GradeFormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    setSaved(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-xs text-sky tracking-widest uppercase mb-2">
          Evaluación
        </p>
        <h1 className="font-display font-bold text-2xl text-carbon">
          {submission.assignmentTitle}
        </h1>
        <p className="text-sm text-carbon/40 mt-1">
          {submission.studentName} · {submission.courseTitle}
        </p>
      </div>

      {/* Split screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[70vh]">
        {/* LEFT — submission viewer */}
        <div className="border border-border rounded-lg overflow-hidden flex flex-col">
          <div className="bg-ash px-5 py-3 border-b border-border flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-carbon/20" />
            <span className="text-xs font-mono text-carbon/40">
              {submission.fileUrl ? "documento.pdf" : "respuesta.txt"}
            </span>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            {submission.text ? (
              <pre className="font-mono text-sm text-carbon leading-relaxed whitespace-pre-wrap">
                {submission.text}
              </pre>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-carbon/30">
                  <p className="text-4xl mb-3">PDF</p>
                  <p className="text-sm">
                    El PDF se cargaría desde{" "}
                    <code className="text-xs bg-ash px-1 py-0.5 rounded">
                      {submission.fileUrl}
                    </code>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — grading form */}
        <div className="border border-border rounded-lg p-8 flex flex-col">
          <h2 className="font-display font-semibold text-lg text-carbon mb-6">
            Calificación y feedback
          </h2>

          {saved && (
            <div className="mb-6 p-3 bg-sky/8 border border-sky/20 rounded text-sm text-sky font-medium">
              ✓ Evaluación guardada
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1 flex flex-col">
            {/* Grade input */}
            <div>
              <label className="block text-xs font-mono text-carbon/40 uppercase tracking-wide mb-2">
                Nota (0 – 10)
              </label>
              <input
                {...register("grade", { valueAsNumber: true })}
                type="number"
                step="0.5"
                min={0}
                max={10}
                className="w-32 border border-border rounded-md px-4 py-2.5 text-2xl font-display font-bold text-carbon bg-canvas focus:outline-none focus:ring-1 focus:ring-sky"
              />
              {errors.grade && (
                <p className="text-xs text-red-500 mt-1">{errors.grade.message}</p>
              )}
            </div>

            {/* Feedback */}
            <div className="flex-1 flex flex-col">
              <label className="block text-xs font-mono text-carbon/40 uppercase tracking-wide mb-2">
                Feedback
              </label>
              <textarea
                {...register("feedback")}
                placeholder="Escribe observaciones, puntos de mejora o felicitaciones..."
                className="flex-1 border border-border rounded-md px-4 py-3 text-sm text-carbon bg-canvas placeholder-carbon/25 focus:outline-none focus:ring-1 focus:ring-sky resize-none min-h-[180px]"
              />
              {errors.feedback && (
                <p className="text-xs text-red-500 mt-1">{errors.feedback.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-sky text-white font-medium py-3 rounded-md hover:bg-sky/90 transition-colors disabled:opacity-50 text-sm"
            >
              {isSubmitting ? "Guardando..." : "Guardar evaluación"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
