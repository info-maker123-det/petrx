import React from "react";
import Logo from "@/components/petrx/Logo";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-porcelain px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo className="h-10" />
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-[20px] bg-sage/10 border-[0.5px] border-sage/20 mb-4">
            <Icon className="w-6 h-6 text-sage" aria-hidden="true" />
          </div>
          <h1 className="font-display text-3xl text-ink tracking-tight">{title}</h1>
          {subtitle && <p className="text-ink/50 mt-2 text-sm">{subtitle}</p>}
        </div>
        <div className="cellular-card p-8 shadow-sm">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-ink/50 mt-6">{footer}</p>
        )}
      </div>
    </div>
  );
}