import type { Course, TeacherSubmission } from "@/types";

export const mockCourses: Course[] = [
  {
    slug: "fundamentos-programacion",
    title: "Fundamentos de la Programación",
    tagline: "Del cero absoluto a construir tu primer proyecto real en semanas.",
    level: "Fundamentos",
    duration: "8 semanas",
    modules: [
      {
        id: "m1",
        title: "Variables y tipos de datos",
        content: `# Variables y tipos de datos\n\nUna variable es un espacio en memoria con un nombre...\n\n\`\`\`kotlin\nval nombre = "éxodo"\nvar contador = 0\n\`\`\``,
      },
    ],
  },
  {
    slug: "productividad-ia",
    title: "Productividad con IA",
    tagline: "Domina Claude, Cursor y las herramientas que ya están transformando el trabajo.",
    level: "Fundamentos",
    duration: "6 semanas",
    modules: [],
  },
  {
    slug: "kotlin-backend",
    title: "Kotlin & Spring Boot",
    tagline: "Arquitectura de microservicios moderna. Del concepto al despliegue.",
    level: "Avanzado",
    duration: "12 semanas",
    modules: [],
  },
  {
    slug: "react-typescript",
    title: "React + TypeScript",
    tagline: "Construye interfaces que importan. Diseño de sistemas de componentes de nivel profesional.",
    level: "Intermedio",
    duration: "10 semanas",
    modules: [],
  },
];

export const mockStudent = {
  id: "s1",
  name: "María Fernanda",
  currentCourse: "Fundamentos de la Programación",
  currentModule: "Variables y tipos de datos",
  progress: 42,
  pendingCount: 2,
};

export const mockAssignments = [
  {
    id: "a1",
    title: "Ejercicio: FizzBuzz",
    courseSlug: "fundamentos-programacion",
    dueDate: "2025-07-15",
    status: "pending" as const,
  },
  {
    id: "a2",
    title: "Proyecto: API REST simple",
    courseSlug: "kotlin-backend",
    dueDate: "2025-07-22",
    status: "pending" as const,
  },
  {
    id: "a3",
    title: "Refactoring con clases",
    courseSlug: "fundamentos-programacion",
    dueDate: "2025-07-08",
    status: "graded" as const,
  },
];

export const mockTeacherSubmissions: TeacherSubmission[] = [
  {
    id: "sub1",
    studentName: "Juan Carlos Pinto",
    assignmentTitle: "Ejercicio: FizzBuzz",
    courseTitle: "Fundamentos de la Programación",
    text: "fun main() {\n  for (i in 1..100) {\n    println(when {\n      i % 15 == 0 -> \"FizzBuzz\"\n      i % 3  == 0 -> \"Fizz\"\n      i % 5  == 0 -> \"Buzz\"\n      else        -> \"$i\"\n    })\n  }\n}",
    submittedAt: "2025-07-10T14:22:00Z",
    status: "pending",
  },
  {
    id: "sub2",
    studentName: "Valeria Suárez",
    assignmentTitle: "Proyecto: Landing Page",
    courseTitle: "React + TypeScript",
    fileUrl: "/mock/submission-valeria.pdf",
    submittedAt: "2025-07-09T09:15:00Z",
    status: "graded",
    grade: 9.5,
    feedback: "Excelente uso de componentes. Mejorar la accesibilidad en el nav.",
  },
  {
    id: "sub3",
    studentName: "Diego Morocho",
    assignmentTitle: "API REST simple",
    courseTitle: "Kotlin & Spring Boot",
    text: "@RestController\n@RequestMapping(\"/api\")\nclass HelloController {\n  @GetMapping(\"/hello\")\n  fun hello() = mapOf(\"msg\" to \"Hola desde éxodotech\")\n}",
    submittedAt: "2025-07-11T16:40:00Z",
    status: "pending",
  },
];
