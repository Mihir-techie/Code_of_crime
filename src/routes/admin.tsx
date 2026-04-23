import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LayoutDashboard, FileText, BookOpen, Users } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) navigate({ to: "/login" });
    else if (user && user.role !== "admin") navigate({ to: "/dashboard" });
  }, [user, navigate]);

  if (!user || user.role !== "admin") return null;

  const links = [
    { to: "/admin" as const, label: "Overview", icon: LayoutDashboard, exact: true },
    { to: "/admin/cases" as const, label: "Cases", icon: FileText },
    { to: "/admin/courses" as const, label: "Courses", icon: BookOpen },
    { to: "/admin/users" as const, label: "Users", icon: Users },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 grid gap-6 md:grid-cols-[220px_1fr]">
        <aside className="space-y-1">
          <div className="text-xs uppercase tracking-widest text-tape mb-3">Control room</div>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.exact }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-card border border-transparent transition"
              activeProps={{ className: "bg-card border-border text-evidence" }}
            >
              <l.icon className="h-4 w-4" /> {l.label}
            </Link>
          ))}
        </aside>
        <section>
          <Outlet />
        </section>
      </div>
      <Footer />
    </div>
  );
}
