'use client'
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

import { Container } from "@/components/shared/container";
import type { CollegeProfile } from "@/data/college-profiles";

interface FaqsSectionProps {
  faqs: CollegeProfile["faqs"];
  name: string;
}

export function FaqsSection({ faqs, name }: FaqsSectionProps) {
  const [openIndex, setOpenIndex] = useState(1);

  return (
    <section className="bg-white py-24 sm:py-32">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8c8faa]">
            FAQs
          </span>
          <h2 className="text-pretty text-4xl font-medium leading-tight tracking-[-0.04em] text-[#0d0f1c] sm:text-[3rem]">
            FAQs related to {name}
          </h2>
          <p className="text-base leading-relaxed text-[#5f6274]">
            Clear, alumni-backed answers to the questions we hear most from applicants, parents, and lateral entrants.
          </p>
        </div>

        <div className="flex flex-col divide-y divide-[#e4e6f3] rounded-[28px] border border-[#e2e5f5] bg-[#f8f8ff]">
          {faqs.map((faq, index) => {
            const isOpen = index === openIndex;
            return (
              <div
                key={faq.question}
                className={`flex flex-col gap-4 px-8 py-6 transition-colors ${
                  isOpen ? "bg-white" : "bg-transparent"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-6 text-left"
                >
                  <div className="flex items-center gap-5">
                    <span className="rounded-full bg-[#edefff] px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#4a3aff]">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="text-lg font-semibold tracking-[-0.02em] text-[#170f49]">
                      {faq.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <Minus className="h-5 w-5 shrink-0 text-[#4a3aff]" />
                  ) : (
                    <Plus className="h-5 w-5 shrink-0 text-[#a0a3bd]" />
                  )}
                </button>
                {isOpen ? (
                  <p className="pl-[86px] text-sm leading-relaxed text-[#6f6c8f]">{faq.answer}</p>
                ) : null}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}


