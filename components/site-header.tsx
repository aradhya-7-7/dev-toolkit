import { ModeToggle } from "@/components/mode-toggle";
import { Github } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black bg-white text-black dark:bg-black dark:text-white dark:border-white">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <a href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">DevToolkit</span>
        </a>
        <nav className="flex items-center space-x-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="border border-black dark:border-white rounded-md w-9 h-9 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
