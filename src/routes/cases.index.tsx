import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { api, type ApiCase } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fingerprint, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/cases/")({
  head: () => ({ meta: [{ title: "Cases — Code of Crime" }, { name: "description", content: "Browse interactive forensic case files." }] }),
  component: CasesPage,
});

function CasesPage() {
  const [cases, setCases] = useState<ApiCase[]>([]);
  useEffect(() => {
    api
      .listCases()
      .then(async (rows) => {
        if (rows.length) return setCases(rows);
        await api.seed();
        const seeded = await api.listCases();
        setCases(seeded);
      })
      .catch(() => setCases([]));
  }, []);

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-5xl text-blood glow-blood">CASE FILES</h1>
            <p className="text-muted-foreground mt-2">Pick a case. Examine the evidence. Make the call.</p>
          </div>
          <Badge variant="outline" className="border-tape text-tape">{cases.length} active</Badge>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <Link key={c.id} to="/cases/$caseId" params={{ caseId: String(c.id) }} className="group">
              <Card className="h-full bg-card/60 border-border hover:border-blood hover:shadow-blood transition overflow-hidden">
                <div className="h-32 bg-gradient-noir relative grid-noise">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Fingerprint className="h-16 w-16 text-blood/40" />
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-blood text-primary-foreground">{c.is_paid ? `INR ${c.price_inr}` : "FREE"}</Badge>
                    <Badge variant="outline" className="border-evidence text-evidence">{c.unlocked ? "Unlocked" : "Locked"}</Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-display text-2xl group-hover:text-evidence transition">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{c.story}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-blood font-semibold">
                    Open case file <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {cases.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-20 border border-dashed border-border rounded-xl">
              No cases yet. Admin can add cases from the admin panel.
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
