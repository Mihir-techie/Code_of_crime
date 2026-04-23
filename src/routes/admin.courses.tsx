import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, type ApiCourse } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/admin/courses")({
  component: AdminCourses,
});

function AdminCourses() {
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [notes, setNotes] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.listCourses().then(setCourses).catch(() => setCourses([]));
  }, []);

  async function createCourse() {
    setMessage("");
    const created = await api.createCourse({
      title,
      description,
      video_url: videoUrl,
      notes,
      is_paid: isPaid,
      price_inr: isPaid ? price : 0,
      is_published: true,
    });
    setCourses((prev) => [created, ...prev]);
    setTitle("");
    setDescription("");
    setVideoUrl("");
    setNotes("");
    setIsPaid(false);
    setPrice(0);
    setMessage("Course created successfully.");
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      setMessage("Uploading video...");
      const res = await api.uploadVideo(file);
      setVideoUrl(res.url);
      setMessage("Video uploaded successfully.");
    } catch (err: any) {
      setMessage(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-4xl text-blood glow-blood">COURSES</h1>
      <p className="text-muted-foreground">Create permanent courses with video and notes.</p>

      <Card className="mt-6 bg-card/60 border-border">
        <CardContent className="p-5 grid gap-3">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <Label>Description</Label>
          <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          <Label>Video Upload</Label>
          <div className="flex flex-col gap-2">
            <Input type="file" accept="video/*" onChange={handleVideoUpload} disabled={isUploading} />
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground">Or provide direct URL:</span>
              <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="/static/uploads/..." />
            </div>
          </div>
          <Label>Notes</Label>
          <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} />
            <span className="text-sm">Paid course</span>
          </div>
          {isPaid && (
            <>
              <Label>Price INR</Label>
              <Input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} />
            </>
          )}
          <Button onClick={createCourse} disabled={isUploading} className="bg-gradient-blood shadow-blood">Create Course</Button>
          {message && <p className="text-sm text-evidence">{message}</p>}
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-3">
        {courses.map((c) => (
          <Card key={c.id} className="bg-card/60 border-border">
            <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-evidence grid place-items-center text-secondary-foreground">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-xl">{c.title || "(untitled)"}</div>
                  <div className="text-xs text-muted-foreground flex gap-2 mt-0.5 items-center">
                    {c.is_published ? <Badge className="bg-tape text-background">Published</Badge> : <Badge variant="outline">Draft</Badge>}
                    <span>{!c.is_paid ? "Free" : `INR ${c.price_inr}`}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {courses.length === 0 && (
          <div className="text-center text-muted-foreground py-12 border border-dashed rounded-xl">No courses yet.</div>
        )}
      </div>
    </div>
  );
}
