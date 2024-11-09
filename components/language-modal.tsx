"use client";
import { useState, useEffect } from "react";

type Props = {
  onSelectLanguage: (lang: "tr" | "en") => void;
};

export function LanguageModal({ onSelectLanguage }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("locale");

    if (!savedLanguage) {
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Please select your language</h2>

        <div className="flex gap-4">
          <button
            className="flex-1 p-4 border rounded hover:bg-gray-100"
            onClick={() => {
              onSelectLanguage("tr");
              setIsOpen(false);
            }}
          >
            🇹🇷 Türkçe
          </button>

          <button
            className="flex-1 p-4 border rounded hover:bg-gray-100"
            onClick={() => {
              onSelectLanguage("en");
              setIsOpen(false);
            }}
          >
            🇬🇧 English
          </button>
        </div>
      </div>
    </div>
  );
}
