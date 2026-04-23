import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const { user: me } = useAuth();

  return (
    <div>
      <h1 className="font-display text-4xl text-blood glow-blood">USERS</h1>
      <p className="text-muted-foreground">Connected admin account.</p>

      <Card className="mt-6 bg-card/60 border-border">
        <CardContent className="p-6">
          {me ? (
            <div className="space-y-2">
              <div><span className="text-muted-foreground">Name:</span> {me.name}</div>
              <div><span className="text-muted-foreground">Email:</span> {me.email}</div>
              <div><span className="text-muted-foreground">Role:</span> <Badge className="bg-blood">Admin</Badge></div>
            </div>
          ) : (
            <p className="text-muted-foreground">No admin session found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
