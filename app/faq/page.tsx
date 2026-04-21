"use client";

import { useState } from "react";
import Link from "next/link";
import { faqs } from "@/data/faqs";

import { Navigation } from "@/components/sections/navigation";
import { Footer } from "@/components/sections/footer";
import { CallToAction } from "@/components/sections/cta";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navigation />

      <main className="bg-surface">
        <div className="relative min-h-screen py-20 px-4 overflow-hidden bg-gradient-to-b from-white to-gray-50">

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#9a3bff]/5 blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#818cf8]/5 blur-[100px]" />
          </div>

          <div className="relative max-w-3xl mx-auto">

            {/* Title */}
            <div className="text-center mb-16">
              <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#9a3bff]/10 text-[#9a3bff] border border-[#9a3bff]/20">
                Support
              </span>
              <h1 className="text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                Frequently Asked
                <br />
                <span className="bg-gradient-to-r from-[#9a3bff] via-[#a855f7] to-[#818cf8] bg-clip-text text-transparent">
                  Questions
                </span>
              </h1>
              <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto leading-relaxed">
                Everything you need to know about IQMento
              </p>
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={index}
                    className={`group relative rounded-2xl border transition-all duration-300 ${
                      isOpen
                        ? "bg-white border-[#9a3bff]/30 shadow-[0_4px_24px_rgba(154,59,255,0.10)]"
                        : "bg-white border-gray-100 hover:border-[#9a3bff]/20 hover:shadow-sm"
                    }`}
                  >
                    {/* Left accent bar */}
                    {isOpen && (
                      <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-gradient-to-b from-[#9a3bff] to-[#818cf8]" />
                    )}

                    {/* Question */}
                    <button
                      onClick={() => toggle(index)}
                      className="w-full flex justify-between items-center px-6 py-5 text-left"
                    >
                      <span
                        className={`font-semibold text-base leading-snug transition-colors duration-200 ${
                          isOpen ? "text-[#9a3bff]" : "text-gray-800 group-hover:text-gray-900"
                        }`}
                      >
                        {faq.question}
                      </span>

                      {/* Icon */}
                      <div
                        className={`ml-4 flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-300 ${
                          isOpen
                            ? "bg-[#9a3bff] border-[#9a3bff]"
                            : "bg-gray-50 border-gray-200 group-hover:border-[#9a3bff]/40"
                        }`}
                      >
                        <svg
                          className={`w-3.5 h-3.5 ${isOpen ? "text-white" : "text-gray-500"}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          {isOpen ? (
                            <path d="M5 12h14" />
                          ) : (
                            <path d="M12 5v14M5 12h14" />
                          )}
                        </svg>
                      </div>
                    </button>

                    {/* Answer */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-60" : "max-h-0"
                      }`}
                    >
                      <div className="px-6 pb-5">
                        <div className="h-px bg-gray-100 mb-4" />
                        <p className="text-gray-500 leading-relaxed text-sm">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contact link */}
            <p className="text-center mt-10 text-sm text-gray-400">
              Still have questions?{" "}
              <Link
                href="/login"
                className="text-[#9a3bff] font-medium hover:underline transition-colors"
              >
                Contact support
              </Link>
            </p>

          </div>
        </div>

        <CallToAction />
      </main>

      <Footer />
    </>
  );
}