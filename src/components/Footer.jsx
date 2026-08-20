import { profile } from "../data/profile";

export default function Footer() {
  return (
    <footer className="border-t border-line/70 bg-cream-2/60 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 text-sm text-muted md:flex-row md:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}.
        </p>
        <div className="flex gap-5">
          <a href={`mailto:${profile.email}`} className="transition-colors hover:text-green-deep">
            Email
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-green-deep">
            LinkedIn
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-green-deep">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
