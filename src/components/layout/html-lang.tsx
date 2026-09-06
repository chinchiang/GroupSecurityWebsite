"use client";

import { useEffect } from "react";
import type { Locale } from "@/config/site";

/** Keeps <html lang> in sync with the locale segment being rendered. */
export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
