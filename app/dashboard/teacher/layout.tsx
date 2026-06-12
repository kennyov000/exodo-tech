import Sidebar from "@/components/layout/Sidebar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen relative">
      <Sidebar role="teacher" />
      <main className="flex-1 min-h-screen bg-canvas">
        <div className="max-w-6xl mx-auto px-8 py-10">{children}</div>
      </main>
    </div>
  );
}
