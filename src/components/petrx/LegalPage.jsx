import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function LegalPage({ eyebrow, title, lastUpdated, intro, sections, children }) {
  return (
    <div className="py-10 md:py-16 bg-porcelain min-h-screen">
      <div className="max-w-3xl mx-auto px-5 md:px-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-ink/50 hover:text-ink text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="flex items-center gap-2 text-sage text-xs font-semibold tracking-wider uppercase mb-3">
          <ShieldCheck className="w-4 h-4" /> {eyebrow}
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-3 leading-tight">{title}</h1>
        {lastUpdated && (
          <p className="text-ink/40 text-sm mb-8">Last updated: {lastUpdated}</p>
        )}

        {intro && (
          <p className="text-ink/60 text-base leading-relaxed mb-10">{intro}</p>
        )}

        <div className="space-y-10">
          {sections.map((section, idx) => (
            <section key={idx}>
              <h2 className="font-display text-xl text-ink mb-3">{section.heading}</h2>
              {section.body && (
                <p className="text-ink/60 text-sm md:text-base leading-relaxed">{section.body}</p>
              )}
              {section.list && (
                <ul className="mt-3 space-y-2">
                  {section.list.map((item, i) => (
                    <li key={i} className="text-ink/60 text-sm md:text-base leading-relaxed flex gap-2.5">
                      <span className="text-sage flex-shrink-0 mt-0.5">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.subsections && (
                <div className="mt-3 space-y-5">
                  {section.subsections.map((sub, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-ink text-sm md:text-base mb-1.5">{sub.heading}</h3>
                      <p className="text-ink/60 text-sm md:text-base leading-relaxed">{sub.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {children}

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-ink/40 text-sm leading-relaxed">
            Questions about this policy? Contact our pharmacy team at{" "}
            <a href="mailto:care@petrx.com" className="text-sage font-medium hover:underline">care@petrx.com</a>{" "}
            or call <a href="tel:+18885551234" className="text-sage font-medium hover:underline">(888) 555-1234</a>.
          </p>
        </div>
      </div>
    </div>
  );
}