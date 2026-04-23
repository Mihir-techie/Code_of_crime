import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { api, type ApiCourse } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/courses/$courseId")({
  component: CourseDetail,
});

function CourseDetail() {
  const { courseId } = Route.useParams();
  const [course, setCourse] = useState<ApiCourse | null>(null);

  useEffect(() => {
    api
      .listCourses()
      .then((rows) => setCourse(rows.find((r) => String(r.id) === courseId) || null))
      .catch(() => setCourse(null));
  }, [courseId]);

  if (!course) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="font-display text-4xl text-blood">Course not found</h1>
          <Link to="/courses" className="text-evidence underline mt-4 inline-block">Back to courses</Link>
        </div>
      </Layout>
    );
  }

  const locked = Boolean(course.is_paid && !course.unlocked);

  return (
    <Layout>
      <section className="mx-auto max-w-6xl px-4 py-10">
        <Link to="/courses" className="text-sm text-muted-foreground hover:text-evidence inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> All courses
        </Link>

        <div className="mt-3 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <Badge className={!course.is_paid ? "bg-tape text-background" : "bg-blood"}>
              {!course.is_paid ? "FREE" : `INR ${course.price_inr}`}
            </Badge>
            <h1 className="mt-2 font-display text-5xl text-evidence glow-evidence">{course.title}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">{course.description}</p>
          </div>
          <Card className="bg-card/60 border-border w-full md:w-72">
            <CardContent className="p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Course access</div>
              <div className="font-display text-3xl text-evidence">{locked ? "Locked" : "Unlocked"}</div>
              <div className="text-xs text-muted-foreground">
                {locked ? "Purchase to unlock this premium course." : "Ready to learn"}
              </div>
            </CardContent>
          </Card>
        </div>

        {locked ? (
          <Card className="mt-8 bg-gradient-noir border-blood shadow-blood">
            <CardContent className="p-12 text-center">
              <Lock className="h-12 w-12 mx-auto text-tape" />
              <h2 className="font-display text-3xl mt-3">Premium course</h2>
              <p className="text-muted-foreground mt-2">Purchase to unlock this course.</p>
              <Button className="mt-6 bg-gradient-blood shadow-blood" disabled>Buy for INR {course.price_inr}</Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mt-8 bg-card/60 border-border">
            <CardContent className="p-8">
              <div className="text-xs uppercase tracking-widest text-tape">Video</div>
              {course.video_url ? (
                <div className="mt-4 aspect-video bg-black rounded-lg overflow-hidden border border-border">
                  {course.video_url.includes("youtube.com") || course.video_url.includes("youtu.be") ? (
                    <iframe
                      className="w-full h-full"
                      src={course.video_url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                      allowFullScreen
                    />
                  ) : (
                    <video
                      className="w-full h-full"
                      controls
                      src={course.video_url.startsWith("http") ? course.video_url : `${api.baseUrl.replace("/api", "")}${course.video_url}`}
                    />
                  )}
                </div>
              ) : (
                <p className="mt-2 text-foreground/90">Video will be added by admin.</p>
              )}
              <div className="mt-6 text-xs uppercase tracking-widest text-tape">Notes</div>
              <p className="mt-2 whitespace-pre-wrap text-foreground/90">{course.notes || "Notes will be added by admin."}</p>
            </CardContent>
          </Card>
        )}
      </section>
    </Layout>
  );
}
