import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, BookOpen } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState({ cases: 0, courses: 0 });

  useEffect(() => {
    Promise.all([api.listCases(), api.listCourses()]).then(([cases, courses]) => {
      setStats({ cases: cases.length, courses: courses.length });
    });
  }, []);

  const cards = [
    { icon: Users, label: "Users", value: "Live", c: "bg-gradient-blood" },
    { icon: FileText, label: "Cases", value: stats.cases, c: "bg-gradient-evidence" },
    { icon: BookOpen, label: "Courses", value: stats.courses, c: "bg-gradient-blood" },
    { icon: BookOpen, label: "Storage", value: "Permanent DB", c: "bg-gradient-evidence" },
  ];

  return (
    <div>
      <h1 className="font-display text-4xl text-blood glow-blood">ADMIN OVERVIEW</h1>
      <p className="text-muted-foreground">Platform pulse at a glance.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="bg-card/60 border-border overflow-hidden">
            <CardContent className="p-5">
              <div className={`h-12 w-12 rounded-lg ${c.c} grid place-items-center text-primary-foreground shadow-blood`}>
                <c.icon className="h-6 w-6" />
              </div>
              <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
              <div className="font-display text-4xl">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="bg-card/60 border-border">
          <CardContent className="p-5">
            <h3 className="font-display text-2xl">Quick actions</h3>
            <p className="text-sm text-muted-foreground mt-1">Use the sidebar to manage cases, courses, and users.</p>
            <ul className="mt-3 text-sm space-y-1 text-muted-foreground list-disc list-inside">
              <li>Create new cases with evidence and questions</li>
              <li>Publish courses with lessons and pricing</li>
              <li>All created data stays permanent in backend database</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-gradient-noir border-blood shadow-blood">
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-widest text-tape">Engagement</div>
            <div className="font-display text-5xl mt-1">LIVE</div>
            <div className="text-sm text-muted-foreground">Connected to Flask backend API</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
