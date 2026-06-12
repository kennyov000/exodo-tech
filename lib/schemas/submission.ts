import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ["application/pdf", "text/plain"];

export const submissionSchema = z
  .object({
    text: z.string().optional(),
    file: z
      .instanceof(File)
      .refine((f) => f.size <= MAX_FILE_SIZE, "El archivo no puede superar 5 MB.")
      .refine(
        (f) => ACCEPTED_TYPES.includes(f.type),
        "Solo se aceptan archivos PDF o texto plano (.txt)."
      )
      .optional(),
  })
  .refine(
    (data) => data.text?.trim() || data.file,
    {
      message: "Debes adjuntar un archivo o escribir tu respuesta.",
      path: ["text"],
    }
  );

export type SubmissionFormValues = z.infer<typeof submissionSchema>;
