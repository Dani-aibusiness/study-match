export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-400 sm:flex-row">
        <p>© {new Date().getFullYear()} StudyMatch.</p>
        <p className="text-slate-500">Student intake flow — this week&apos;s build</p>
      </div>
    </footer>
  );
}
