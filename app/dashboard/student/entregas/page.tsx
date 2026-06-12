"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { submissionSchema, type SubmissionFormValues } from "@/lib/schemas/submission";
import { mockAssignments } from "@/lib/mockData";

export default function EntregasPage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
  });

  const pending = mockAssignments.filter((a) => a.status === "pending");

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        setSelectedFile(file);
        setValue("file", file, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("file", file, { shouldValidate: true });
    }
  };

  const onSubmit = async (_data: SubmissionFormValues) => {
    await new Promise((r) => setTimeout(r, 800)); // simulate API
    setSubmitted(true);
    reset();
    setSelectedFile(null);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <p className="font-mono text-xs text-sky tracking-widest uppercase mb-2">
          Zona de entregas
        </p>
        <h1 className="font-display font-bold text-3xl text-carbon">
          Entregas
        </h1>
      </div>

      {submitted && (
        <div className="mb-8 p-4 bg-sky/8 border border-sky/20 rounded-md text-sm text-sky font-medium">
          ✓ Entrega registrada correctamente.
        </div>
      )}

      {/* Assignment selector */}
      <div className="mb-8">
        <label className="block text-xs font-mono text-carbon/40 uppercase tracking-wide mb-3">
          Tarea
        </label>
        <select className="w-full border border-border rounded-md px-4 py-2.5 text-sm text-carbon bg-canvas focus:outline-none focus:ring-1 focus:ring-sky">
          {pending.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title} · vence {a.dueDate}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Dropzone */}
        <div>
          <label className="block text-xs font-mono text-carbon/40 uppercase tracking-wide mb-3">
            Archivo (PDF o .txt, máx 5 MB)
          </label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={onDrop}
            className={`relative border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer
              ${dragActive
                ? "border-sky bg-sky/5"
                : "border-border hover:border-sky/40"
              }`}
          >
            <input
              type="file"
              accept=".pdf,.txt,text/plain,application/pdf"
              onChange={onFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {selectedFile ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-carbon">{selectedFile.name}</p>
                <p className="text-xs text-carbon/40 font-mono">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-carbon/50">
                  Arrastra tu archivo aquí o{" "}
                  <span className="text-sky underline">selecciona</span>
                </p>
                <p className="text-xs text-carbon/30 font-mono">PDF · TXT · máx 5 MB</p>
              </div>
            )}
          </div>
          {errors.file && (
            <p className="text-xs text-red-500 mt-2">{errors.file.message}</p>
          )}
        </div>

        {/* Text area */}
        <div>
          <label className="block text-xs font-mono text-carbon/40 uppercase tracking-wide mb-3">
            O escribe tu respuesta
          </label>
          <textarea
            {...register("text")}
            rows={6}
            placeholder="Pega tu código o describe tu solución aquí..."
            className="w-full border border-border rounded-md px-4 py-3 text-sm font-mono text-carbon bg-canvas placeholder-carbon/25 focus:outline-none focus:ring-1 focus:ring-sky resize-none"
          />
          {errors.text && (
            <p className="text-xs text-red-500 mt-2">{errors.text.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-sky text-white font-medium py-3 rounded-md hover:bg-sky/90 transition-colors disabled:opacity-50 text-sm"
        >
          {isSubmitting ? "Enviando..." : "Enviar entrega"}
        </button>
      </form>

      {/* Past submissions */}
      <div className="mt-14 border-t border-border pt-8">
        <h2 className="font-display font-semibold text-lg text-carbon mb-4">
          Historial
        </h2>
        <div className="space-y-3">
          {mockAssignments.filter(a => a.status === "graded").map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between p-4 bg-ash rounded-md text-sm"
            >
              <span className="text-carbon">{a.title}</span>
              <span className="font-mono text-xs text-carbon/40 bg-canvas px-2 py-1 rounded">
                calificado
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
