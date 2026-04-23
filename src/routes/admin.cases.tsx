import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api, type ApiCase } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/admin/cases")({
  component: AdminCases,
});

function AdminCases() {
  const [cases, setCases] = useState<ApiCase[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [story, setStory] = useState("");
  const [evidence, setEvidence] = useState("");
  const [verdict, setVerdict] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState(0);
  const [questions, setQuestions] = useState<{ prompt: string; options: string; correctAnswer: string }[]>([]);
  const [qPrompt, setQPrompt] = useState("");
  const [qOptions, setQOptions] = useState("");
  const [qCorrect, setQCorrect] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.listCases().then(setCases).catch(() => setCases([]));
  }, []);

  async function createCase() {
    setMessage("");
    
    const parsedQuestions = questions.map((q) => {
      const opts = q.options.split("\n").map((x) => x.trim()).filter(Boolean);
      return {
        prompt: q.prompt,
        options: opts,
        correct_answer: q.correctAnswer,
      };
    });

    const created = await api.createCase({
      title,
      slug: slug || title.toLowerCase().replaceAll(" ", "-"),
      story,
      evidence,
      final_verdict_question: verdict,
      is_paid: isPaid,
      price_inr: isPaid ? price : 0,
      is_published: true,
      questions: parsedQuestions,
    });
    setCases((prev) => [created, ...prev]);
    setTitle("");
    setSlug("");
    setStory("");
    setEvidence("");
    setVerdict("");
    setIsPaid(false);
    setPrice(0);
    setQuestions([]);
    setMessage("Case and questions created successfully.");
  }

  function addDraftQuestion() {
    if (!qPrompt || !qOptions || !qCorrect) return;
    setQuestions([...questions, { prompt: qPrompt, options: qOptions, correctAnswer: qCorrect }]);
    setQPrompt("");
    setQOptions("");
    setQCorrect("");
  }

  return (
    <div>
      <h1 className="font-display text-4xl text-blood glow-blood">CASES</h1>
      <p className="text-muted-foreground">Create permanent case files and quiz questions.</p>

      <Card className="mt-6 bg-card/60 border-border">
        <CardContent className="p-5 grid gap-3">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          <Label>Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          <Label>Case story (blog format)</Label>
          <Textarea rows={5} value={story} onChange={(e) => setStory(e.target.value)} />
          <Label>Evidence list</Label>
          <Textarea rows={5} value={evidence} onChange={(e) => setEvidence(e.target.value)} />
          <Label>Final verdict question</Label>
          <Input value={verdict} onChange={(e) => setVerdict(e.target.value)} />
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} />
            <span className="text-sm">Paid case</span>
          </div>
          {isPaid && (
            <>
              <Label>Price INR</Label>
              <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
            </>
          )}
          <div className="mt-4 pt-4 border-t border-border">
            <h3 className="font-display text-2xl text-evidence mb-3">Questions ({questions.length})</h3>
            {questions.map((q, i) => (
              <div key={i} className="mb-3 p-3 border border-border rounded bg-background/50">
                <p className="font-bold">{i + 1}. {q.prompt}</p>
                <p className="text-xs text-muted-foreground mt-1">Options: {q.options.split("\n").join(", ")}</p>
                <p className="text-xs text-green-500 mt-1">Correct: {q.correctAnswer}</p>
              </div>
            ))}

            <div className="grid gap-3 mt-4">
              <Label>Question prompt</Label>
              <Input value={qPrompt} onChange={(e) => setQPrompt(e.target.value)} />
              <Label>Options (one per line)</Label>
              <Textarea rows={4} value={qOptions} onChange={(e) => setQOptions(e.target.value)} />
              <Label>Correct answer (must match option text)</Label>
              <Input value={qCorrect} onChange={(e) => setQCorrect(e.target.value)} />
              <Button variant="outline" onClick={addDraftQuestion}>+ Add Question to Case</Button>
            </div>
          </div>

          <Button onClick={createCase} className="mt-4 bg-gradient-blood shadow-blood">Create Case & Questions</Button>
          {message && <p className="text-sm text-green-500">{message}</p>}
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-3">
        {cases.map((c) => (
          <Card key={c.id} className="bg-card/60 border-border">
            <CardContent className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-blood grid place-items-center text-primary-foreground shadow-blood">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-xl">{c.title}</div>
                  <div className="text-xs text-muted-foreground flex gap-2 mt-0.5">
                    <Badge variant="outline" className="border-blood text-blood">{c.is_paid ? `INR ${c.price_inr}` : "FREE"}</Badge>
                    <span>ID {c.id}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {cases.length === 0 && (
          <div className="text-center text-muted-foreground py-12 border border-dashed rounded-xl">No cases yet.</div>
        )}
      </div>
    </div>
  );
}
