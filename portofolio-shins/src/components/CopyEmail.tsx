"use client";

import React from "react";
import { useState } from "react";
import { useLanguage } from "./LanguageContext";

export default function CopyEmail({ email }: { email: string }) {
  const [ok, setOk] = useState(false);
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setOk(true);
          setTimeout(() => setOk(false), 1800);
        } catch (_err) {}
      }}
      className="inline-flex items-center gap-2 rounded-full border border-dune/30 px-6 py-3 text-sm font-medium text-sand transition hover:border-chakra hover:bg-chakra/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chakra"
    >
      <span aria-live="polite">
        {ok ? t.contact.copied : t.contact.copyEmail}
      </span>
    </button>
  );
}
