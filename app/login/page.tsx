"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email:    z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});
type LoginValues = z.infer<typeof loginSchema>;

const DEMO_ACCOUNTS = {
  student: { email: "maria@exodotech.com",  password: "demo1234", label: "Estudiante",  role: "student" },
  teacher: { email: "diego@exodotech.com",  password: "demo1234", label: "Docente",     role: "teacher" },
} as const;

export default function LoginPage() {
  const router = useRouter();
  const [demoRole, setDemoRole] = useState<keyof typeof DEMO_ACCOUNTS>("student");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const selectDemo = (role: keyof typeof DEMO_ACCOUNTS) => {
    setDemoRole(role);
    setValue("email",    DEMO_ACCOUNTS[role].email,    { shouldValidate: false });
    setValue("password", DEMO_ACCOUNTS[role].password, { shouldValidate: false });
  };

  const onSubmit = async (data: LoginValues) => {
    await new Promise((r) => setTimeout(r, 600));
    const match = Object.values(DEMO_ACCOUNTS).find(
      (a) => a.email === data.email && a.password === data.password
    );
    if (match?.role === "teacher") router.push("/dashboard/teacher/entregas");
    else router.push("/dashboard/student");
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4">
      {/* Logo top */}
      <Link href="/" className="font-display font-bold text-2xl text-carbon mb-12">
        éxodo<span className="text-sky">tech</span>
      </Link>

      <div className="w-full max-w-sm bg-white border border-border rounded-xl p-8 shadow-none">
        <p className="font-mono text-xs text-sky tracking-widest uppercase mb-5">
          Acceso Portal
        </p>
        <h1 className="font-display font-bold text-2xl text-carbon mb-1">
          Bienvenido de vuelta
        </h1>
        <p className="text-sm text-carbon/45 mb-7">
          Ingresa con tus credenciales o elige una cuenta demo.
        </p>

        {/* Demo pills */}
        <div className="mb-6">
          <p className="text-xs font-medium text-carbon/45 mb-2">Cuentas demo</p>
          <div className="flex gap-2">
            {(Object.keys(DEMO_ACCOUNTS) as Array<keyof typeof DEMO_ACCOUNTS>).map(
              (role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => selectDemo(role)}
                  className={`flex-1 text-xs font-medium py-2 px-3 rounded-md border transition-all ${
                    demoRole === role
                      ? "border-sky bg-sky/10 text-sky"
                      : "border-border bg-canvas text-carbon/50 hover:border-sky/40"
                  }`}
                >
                  {DEMO_ACCOUNTS[role].label}
                </button>
              )
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-carbon/40 uppercase tracking-wide mb-1.5">
              Correo electrónico
            </label>
            <input
              {...register("email")}
              type="email"
              defaultValue={DEMO_ACCOUNTS.student.email}
              className="w-full border border-border rounded-md px-4 py-2.5 text-sm text-carbon bg-canvas focus:outline-none focus:ring-1 focus:ring-sky"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-mono text-carbon/40 uppercase tracking-wide mb-1.5">
              Contraseña
            </label>
            <input
              {...register("password")}
              type="password"
              defaultValue={DEMO_ACCOUNTS.student.password}
              className="w-full border border-border rounded-md px-4 py-2.5 text-sm text-carbon bg-canvas focus:outline-none focus:ring-1 focus:ring-sky"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-sky text-white font-semibold py-3 rounded-md hover:bg-sky/90 transition-colors disabled:opacity-50 text-sm font-display mt-2"
          >
            {isSubmitting ? "Ingresando..." : "Ingresar al portal →"}
          </button>
        </form>

        <p className="text-center text-xs text-carbon/25 font-mono mt-6">
          demo · sin datos reales · solo previsualización
        </p>
      </div>
    </div>
  );
}
