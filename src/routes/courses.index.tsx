import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { api, type ApiCourse } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/courses/")({
  head: () => ({ meta: [{ title: "Courses — Code of Crime" }, { name: "description", content: "Forensic learning modules and certifications." }] }),
  component: CoursesPage,
});

function CoursesPage() {
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  useEffect(() => {
    api.listCourses().then(setCourses).catch(() => setCourses([]));
  }, []);

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="font-display text-5xl text-evidence glow-evidence">FORENSIC COURSES</h1>
        <p className="text-muted-foreground mt-2">Structured lessons. Real-world scenarios. Pace yourself.</p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Card key={c.id} className="bg-card/60 border-border hover:border-evidence transition flex flex-col">
              <div className="h-32 bg-gradient-evidence grid-noise grid place-items-center">
                <BookOpen className="h-12 w-12 text-secondary-foreground/70" />
              </div>
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl">{c.title}</h3>
                  {!c.is_paid ? (
                    <Badge className="bg-tape text-background">FREE</Badge>
                  ) : (
                    <Badge className="bg-blood">INR {c.price_inr}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2 flex-1">{c.description}</p>
                <div className="mt-3 text-xs text-muted-foreground">{c.unlocked ? "Unlocked" : "Locked (purchase required)"}</div>
                <Link to="/courses/$courseId" params={{ courseId: String(c.id) }} className="mt-4">
                  <Button className="w-full bg-gradient-blood shadow-blood">
                    {!c.is_paid || c.unlocked ? "Start learning" : "View course"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
          {courses.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-20 border border-dashed rounded-xl">
              No published courses yet.
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
