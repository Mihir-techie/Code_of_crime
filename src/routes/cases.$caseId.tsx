import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useEffect, useMemo, useState } from "react";
import { api, type ApiCase } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { FileText, Trophy, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/cases/$caseId")({
  component: CaseDetail,
});

function CaseDetail() {
  const { caseId } = Route.useParams();
  const [c, setC] = useState<ApiCase | null>(null);
  const [loadError, setLoadError] = useState("");
  const [step, setStep] = useState<"blog" | "quiz" | "verdict">("blog");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitResult, setSubmitResult] = useState<{
    score: number;
    correct_answers: number;
    total_questions: number;
    passed: boolean;
    certificate?: { download_url: string };
  } | null>(null);

  useEffect(() => {
    api
      .getCase(caseId)
      .then((row) => {
        setC(row);
        setLoadError("");
      })
      .catch((error) => {
        setC(null);
        setLoadError(error instanceof Error ? error.message : "Unable to load case");
      });
  }, [caseId]);

  const parsedQuestions = useMemo(
    () =>
      (c?.questions || []).map((q) => ({
        ...q,
        options: JSON.parse(q.options_json || "[]") as string[],
      })),
    [c],
  );

  async function submit() {
    if (!c) return;
    const result = await api.submitCase(c.id, answers);
    setSubmitResult(result);
    setStep("verdict");
  }

  if (!c) {
    return (
      <Layout>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="font-display text-4xl text-blood">
            {loadError.includes("Purchase required") ? "Case is locked" : "Case file not found"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {loadError || "This case may not exist."}
          </p>
          <Link to="/cases" className="text-evidence underline mt-4 inline-block">Back to all cases</Link>
        </div>
      </Layout>
    );
  }

  const stepIndex = ["blog", "quiz", "verdict"].indexOf(step);

  return (
    <Layout>
      <section className="mx-auto max-w-5xl px-4 py-10">
        <Link to="/cases" className="text-sm text-muted-foreground hover:text-evidence">← All cases</Link>

        <div className="mt-3 flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blood">{c.is_paid ? `INR ${c.price_inr}` : "FREE"}</Badge>
              <Badge variant="outline" className="border-evidence text-evidence">{c.unlocked ? "Unlocked" : "Locked"}</Badge>
            </div>
            <h1 className="mt-2 font-display text-5xl text-blood glow-blood">{c.title}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">{c.story}</p>
          </div>
          <div className="w-full md:w-64">
            <div className="text-xs text-muted-foreground mb-1 uppercase tracking-widest">Investigation progress</div>
            <Progress value={(stepIndex / 3) * 100} />
          </div>
        </div>

        {/* STEP: BLOG */}
        {step === "blog" && (
          <div className="mt-8 grid gap-5">
            <Card className="bg-card/60 border-border">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 text-evidence text-sm uppercase tracking-widest"><FileText className="h-4 w-4" /> Incident report & Evidence</div>
                <div className="mt-6">
                  <h3 className="font-display text-2xl text-blood mb-3">The Story</h3>
                  <p className="leading-relaxed text-foreground/90 whitespace-pre-wrap">{c.story}</p>
                </div>
                <div className="my-8 border-t border-border border-dashed" />
                <div>
                  <h3 className="font-display text-2xl text-tape mb-3">Evidence</h3>
                  <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">{c.evidence}</p>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end">
              <Button onClick={() => setStep("quiz")} className="bg-gradient-blood shadow-blood">Start Investigation →</Button>
            </div>
          </div>
        )}

        {/* STEP: QUIZ */}
        {step === "quiz" && (
          <Card className="mt-8 bg-card/60 border-border">
            <CardContent className="p-8 space-y-8">
              {parsedQuestions.map((q, i) => (
                <div key={q.id}>
                  <div className="text-xs text-tape uppercase tracking-widest">Question {i + 1}</div>
                  <h3 className="font-display text-2xl mt-1">{q.prompt}</h3>
                  <RadioGroup
                    className="mt-3"
                    value={answers[String(q.id)] ?? ""}
                    onValueChange={(v) => setAnswers((a) => ({ ...a, [String(q.id)]: v }))}
                  >
                    {q.options.map((opt) => (
                      <Label
                        key={opt}
                        htmlFor={`${q.id}-${opt}`}
                        className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-3 cursor-pointer hover:border-evidence transition"
                      >
                        <RadioGroupItem value={opt} id={`${q.id}-${opt}`} />
                        <span className="text-sm">{opt}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              ))}
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep("blog")}>← Back to Case File</Button>
                <Button
                  onClick={submit}
                  disabled={Object.keys(answers).length !== parsedQuestions.length}
                  className="bg-gradient-blood shadow-blood"
                >
                  Submit Verdict →
                </Button>
              </div>
              {!user && (
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-tape" />
                  <span>You are not logged in.{" "}
                    <button className="text-evidence underline" onClick={() => navigate({ to: "/login" })}>Login</button>
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* STEP: VERDICT */}
        {step === "verdict" && (
          <Card className="mt-8 bg-gradient-noir border-blood shadow-blood">
            <CardContent className="p-8 text-center">
              <Trophy className="h-12 w-12 mx-auto text-tape" />
              <div className="font-display text-7xl mt-2 text-evidence glow-evidence">{submitResult?.score ?? 0}%</div>
              <div className="text-muted-foreground">
                {submitResult?.correct_answers ?? 0} of {submitResult?.total_questions ?? 0} correct
              </div>
              <div className="mt-6 text-left bg-background/40 border border-border rounded-lg p-5">
                <div className="text-xs text-tape uppercase tracking-widest">Final verdict</div>
                <p className="mt-2 text-foreground/90">{c.final_verdict_question || "Case completed."}</p>
                {submitResult?.passed && submitResult?.certificate?.download_url && (
                  <a
                    href={`${api.baseUrl.replace("/api", "")}${submitResult.certificate.download_url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-evidence underline"
                  >
                    Download certificate
                  </a>
                )}
              </div>
              <div className="mt-6 flex justify-center gap-3">
                <Button variant="outline" onClick={() => { setAnswers({}); setStep("blog"); }}>Replay case</Button>
                <Link to="/cases"><Button className="bg-gradient-blood shadow-blood">More cases</Button></Link>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </Layout>
  );
}
