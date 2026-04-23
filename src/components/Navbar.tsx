import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, User as UserIcon, Menu, X } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navLinks = (
    <>
      <Link to="/" activeOptions={{ exact: true }} className="hover:text-evidence transition" activeProps={{ className: "text-evidence" }} onClick={() => setOpen(false)}>Home</Link>
      <Link to="/cases" className="hover:text-evidence transition" activeProps={{ className: "text-evidence" }} onClick={() => setOpen(false)}>Cases</Link>
      <Link to="/courses" className="hover:text-evidence transition" activeProps={{ className: "text-evidence" }} onClick={() => setOpen(false)}>Courses</Link>
      {user && (
        <Link to="/dashboard" className="hover:text-evidence transition" activeProps={{ className: "text-evidence" }} onClick={() => setOpen(false)}>Dashboard</Link>
      )}
      {user?.role === "admin" && (
        <Link to="/admin" className="text-tape font-semibold flex items-center gap-1" activeProps={{ className: "underline" }} onClick={() => setOpen(false)}>
          <Shield className="h-4 w-4" /> Admin
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Code of Crime" className="h-10 w-10 object-contain rounded" />
          <div className="leading-none">
            <div className="font-display text-xl text-blood glow-blood">CODE OF</div>
            <div className="font-display text-xl text-evidence glow-evidence -mt-1">CRIME</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">{navLinks}</nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <UserIcon className="h-4 w-4" /> {user.name}
              </div>
              <Button variant="ghost" size="sm" onClick={() => { logout(); navigate({ to: "/" }); }}>
                <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:inline-block"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link to="/register"><Button size="sm" className="bg-gradient-blood shadow-blood">Join</Button></Link>
            </>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-background/95 px-4 py-4 flex flex-col gap-3 text-sm">
          {navLinks}
          {!user && <Link to="/login" onClick={() => setOpen(false)} className="hover:text-evidence">Login</Link>}
        </nav>
      )}
    </header>
  );
}
