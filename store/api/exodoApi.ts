import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Course,
  Student,
  Assignment,
  Submission,
  TeacherSubmission,
} from "@/types";

export const exodoApi = createApi({
  reducerPath: "exodoApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "/api",
    prepareHeaders: (headers) => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("exodo_token")
          : null;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Course", "Student", "Assignment", "Submission"],
  endpoints: (builder) => ({
    // ── Public ──────────────────────────────────────────────────────
    getCourses: builder.query<Course[], void>({
      query: () => "/courses",
      providesTags: ["Course"],
    }),

    // ── Student dashboard ────────────────────────────────────────────
    getStudentDashboard: builder.query<Student, void>({
      query: () => "/student/dashboard",
      providesTags: ["Student"],
    }),
    getMateriaBySlug: builder.query<Course, string>({
      query: (slug) => `/courses/${slug}`,
    }),
    getStudentAssignments: builder.query<Assignment[], void>({
      query: () => "/student/assignments",
      providesTags: ["Assignment"],
    }),
    submitAssignment: builder.mutation<
      { id: string },
      { assignmentId: string; file?: File; text?: string }
    >({
      query: ({ assignmentId, file, text }) => {
        const body = new FormData();
        if (file) body.append("file", file);
        if (text) body.append("text", text);
        return { url: `/assignments/${assignmentId}/submit`, method: "POST", body };
      },
      invalidatesTags: ["Submission"],
    }),

    // ── Teacher dashboard ────────────────────────────────────────────
    getTeacherSubmissions: builder.query<TeacherSubmission[], void>({
      query: () => "/teacher/submissions",
      providesTags: ["Submission"],
    }),
    getSubmissionById: builder.query<TeacherSubmission, string>({
      query: (id) => `/teacher/submissions/${id}`,
    }),
    gradeSubmission: builder.mutation<
      void,
      { id: string; grade: number; feedback: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/teacher/submissions/${id}/grade`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Submission"],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetStudentDashboardQuery,
  useGetMateriaBySlugQuery,
  useGetStudentAssignmentsQuery,
  useSubmitAssignmentMutation,
  useGetTeacherSubmissionsQuery,
  useGetSubmissionByIdQuery,
  useGradeSubmissionMutation,
} = exodoApi;
