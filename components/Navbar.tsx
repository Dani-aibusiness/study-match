"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PRIMARY_NAV, MORE_NAV } from "@/lib/siteContent";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the menu whenever the page changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const linkClass = (href: string) =>
    `transition hover:text-white ${
      pathname === href ? "text-white" : "text-slate-300"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 font-bold text-slate-950">
            S
          </span>
          <span className="text-lg font-semibold text-white">StudyMatch</span>
        </Link>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
          {PRIMARY_NAV.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}

          <div className="relative">
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="true"
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-1 text-slate-300 transition hover:text-white"
            >
              More <span aria-hidden="true">{open ? "▴" : "▾"}</span>
            </button>
            {open && (
              <>
                <button
                  type="button"
                  aria-label="Close menu"
                  tabIndex={-1}
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 z-40 cursor-default"
                />
                <div className="absolute right-0 z-50 mt-3 w-52 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-xl">
                  {MORE_NAV.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={`block rounded-md px-3 py-2 hover:bg-slate-900 ${linkClass(
                        l.href
                      )}`}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
