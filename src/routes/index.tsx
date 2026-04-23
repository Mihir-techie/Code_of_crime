import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import logo from "@/assets/logo.png";
import { Fingerprint, Microscope, Brain, Trophy, ShieldCheck, Search } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Code of Crime — Become the Investigator" },
      { name: "description", content: "Interactive forensic learning. Solve cases, analyze evidence, master the science." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-noise opacity-40" />
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blood/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-evidence/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs uppercase tracking-widest text-tape">
              <ShieldCheck className="h-3 w-3" /> Case file #001 unlocked
            </div>
            <h1 className="mt-5 font-display text-6xl md:text-7xl leading-none">
              <span className="text-blood glow-blood">CRACK THE CASE.</span><br />
              <span className="text-evidence glow-evidence">DECODE THE CRIME.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              Code of Crime is an interactive forensic learning platform. Analyze evidence, use simulated forensic tools, answer investigation questions, and earn your detective badge.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/cases">
                <Button size="lg" className="bg-gradient-blood shadow-blood font-display tracking-widest text-base">
                  <Search className="h-5 w-5" /> Start Investigating
                </Button>
              </Link>
              <Link to="/courses">
                <Button size="lg" variant="outline" className="font-display tracking-widest text-base">
                  Browse Courses
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex gap-6 text-sm text-muted-foreground">
              <div><span className="font-display text-2xl text-evidence block leading-none">12+</span>Cases</div>
              <div><span className="font-display text-2xl text-evidence block leading-none">04</span>Modules</div>
              <div><span className="font-display text-2xl text-evidence block leading-none">100%</span>Hands-on</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-blood blur-3xl opacity-30 rounded-full" />
            <img src={logo} alt="Code of Crime emblem" className="relative mx-auto max-w-md w-full drop-shadow-2xl" />
          </div>
        </div>

        <div className="crime-tape py-2 text-xs">
          ⚠ Crime scene · Do not cross · Crime scene · Do not cross · Crime scene · Do not cross ⚠
        </div>
      </section>

      {/* MODULES */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="font-display text-4xl text-center">Forensic <span className="text-blood">Modules</span></h2>
        <p className="text-center text-muted-foreground mt-2">Train across the four pillars of modern forensics.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Fingerprint, title: "Fingerprints", desc: "Loops, whorls, arches, minutiae matching." },
            { icon: Microscope, title: "Blood Pattern", desc: "Spatter analysis, velocity, directionality." },
            { icon: Brain, title: "DNA Basics", desc: "Sample handling, sequencing fundamentals." },
            { icon: ShieldCheck, title: "Cyber Forensics", desc: "Logs, metadata, digital chain of custody." },
          ].map((m) => (
            <Card key={m.title} className="bg-card/60 backdrop-blur border-border hover:border-blood transition group">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-gradient-blood flex items-center justify-center shadow-blood group-hover:scale-110 transition">
                  <m.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mt-4 font-display text-xl">{m.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <h2 className="font-display text-4xl text-center">How a <span className="text-evidence">Case</span> Works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {[
            { n: "01", t: "Read the report", d: "Open the incident file and the story." },
            { n: "02", t: "Examine evidence", d: "Zoom prints, review witness notes." },
            { n: "03", t: "Answer questions", d: "Make decisions like a real detective." },
            { n: "04", t: "Get your verdict", d: "Score, feedback, and the truth revealed." },
          ].map((s) => (
            <div key={s.n} className="relative rounded-xl border border-border bg-card/60 p-6">
              <div className="font-display text-5xl text-blood/50 absolute right-4 top-2">{s.n}</div>
              <Trophy className="h-6 w-6 text-evidence" />
              <h3 className="mt-3 font-display text-xl">{s.t}</h3>
              <p className="text-sm text-muted-foreground mt-1">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <div className="rounded-2xl bg-gradient-noir border border-border p-12 shadow-noir">
          <h2 className="font-display text-4xl">Ready to <span className="text-blood">earn your badge</span>?</h2>
          <p className="text-muted-foreground mt-2">Create a free account and crack your first case.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/register"><Button size="lg" className="bg-gradient-blood shadow-blood">Join the Force</Button></Link>
            <Link to="/cases"><Button size="lg" variant="outline">Try a case</Button></Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
