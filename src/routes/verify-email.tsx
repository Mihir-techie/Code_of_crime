import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verify-email")({
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying...");
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setMessage("Verification token missing.");
      return;
    }
    api
      .verifyEmail(token)
      .then((res) => {
        setOk(true);
        setMessage(res.message || "Email verified successfully.");
      })
      .catch((error) => {
        setOk(false);
        setMessage(error instanceof Error ? error.message : "Verification failed.");
      });
  }, []);

  return (
    <Layout>
      <section className="mx-auto max-w-xl px-4 py-16">
        <Card className="bg-card/70 border-border">
          <CardContent className="p-8 text-center space-y-4">
            <h1 className="font-display text-4xl text-blood">Email Verification</h1>
            <p className={ok ? "text-green-500" : "text-muted-foreground"}>{message}</p>
            <Button onClick={() => navigate({ to: "/login" })} className="bg-gradient-blood shadow-blood">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
}
