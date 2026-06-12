"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  role: "student" | "teacher";
}

const studentLinks = [
  { href: "/dashboard/student",          label: "Inicio",    icon: "◈" },
  { href: "/dashboard/student/entregas", label: "Entregas",  icon: "◎" },
  { href: "/dashboard/student/materia/fundamentos-programacion", label: "Materias", icon: "◌" },
];

const teacherLinks = [
  { href: "/dashboard/teacher",           label: "Dashboard", icon: "◈" },
  { href: "/dashboard/teacher/entregas",  label: "Entregas",  icon: "◎" },
  { href: "#",                            label: "Estudiantes", icon: "◌" },
  { href: "#",                            label: "Cursos",    icon: "◫" },
];

const USER_INFO = {
  student: { initials: "MF", name: "María Fernanda" },
  teacher: { initials: "DC", name: "Diego Cedillo" },
};

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const links = role === "student" ? studentLinks : teacherLinks;
  const user  = USER_INFO[role];

  const isActive = (href: string) =>
    href !== "#" && (pathname === href || (href !== `/dashboard/${role}` && pathname.startsWith(href)));

  return (
    <aside className="w-64 shrink-0 border-r border-border min-h-screen bg-canvas pt-8 relative">
      {/* Logo */}
      <div className="px-6 mb-10">
        <Link href="/" className="font-display font-bold text-lg text-carbon">
          éxodo<span className="text-sky">tech</span>
        </Link>
        <p className="text-xs text-carbon/35 mt-1 font-mono">
          {role === "student" ? "portal estudiante" : "portal docente"}
        </p>
      </div>

      {/* Nav links */}
      <nav className="px-3 space-y-0.5">
        {links.map((link) => (
          <Link
            key={link.href + link.label}
            href={link.href}
            className={`sidebar-link ${isActive(link.href) ? "active" : ""}`}
          >
            <span className="text-base leading-none">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      {/* User info */}
      <div className="absolute bottom-8 left-0 w-64 px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-ash flex items-center justify-center text-carbon/55 text-xs font-semibold">
            {user.initials}
          </div>
          <div>
            <p className="text-sm font-medium text-carbon">{user.name}</p>
            <p className="text-xs text-carbon/35">{role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
