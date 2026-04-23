import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card/50">
      <div className="crime-tape py-2 text-center text-xs">
        ⚠ Crime scene · Do not cross · Code of Crime · Crime scene · Do not cross ⚠
      </div>
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-8 md:grid-cols-3">
        <div className="flex items-start gap-3">
          <img src={logo} alt="Code of Crime" className="h-12 w-12 object-contain" />
          <div>
            <div className="font-display text-2xl text-blood">CODE OF CRIME</div>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Interactive forensic learning. Solve cases. Master the science.
            </p>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg text-evidence mb-2">Investigate</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>Cases</li><li>Courses</li><li>Forensic tools</li><li>Leaderboard (soon)</li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg text-evidence mb-2">Contact</h4>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li>
              <a href="mailto:codeofcrime@annexra.in" className="hover:text-blood transition-colors">
                codeofcrime@annexra.in
              </a>
            </li>
            <li>
              <a href="tel:7010902009" className="hover:text-blood transition-colors">
                70109 02009
              </a>
            </li>
            <li>
              <a 
                href="https://www.instagram.com/code_ofcrime?igsh=MXZtMnhwcHc2YzQxag%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-blood transition-colors"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Code of Crime · Supported by{" "}
        <span className="text-tape font-semibold">codeofcrime@annexra.in</span>
      </div>
    </footer>
  );
}
