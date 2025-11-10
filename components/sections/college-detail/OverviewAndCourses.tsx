import type { ReactNode } from "react";
import { Bookmark, FileText, GraduationCap, Timer, UsersRound } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import type { CourseDetail } from "@/data/college-profiles";

interface OverviewAndCoursesProps {
  about: string[];
  courses: CourseDetail[];
}

export function OverviewAndCoursesSection({ about, courses }: OverviewAndCoursesProps) {
  return (
    <section className="bg-white py-24 sm:py-32">
      <Container className="flex flex-col gap-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8c8faa]">
              About the College
            </span>
            <h2 className="text-pretty text-5xl font-medium leading-[0.9] tracking-[-0.04em] text-[#0d0f1c] sm:text-[3.2rem]">
              The ecosystem that shaped India’s design revolution.
            </h2>
          </div>
          <div className="flex flex-col gap-6 text-lg leading-relaxed text-[#535353]">
            {about.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-pretty tracking-[-0.01em]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {courses.map((course) => (
            <CourseCard key={course.name} course={course} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function CourseCard({ course }: { course: CourseDetail }) {
  return (
    <article className="flex h-full flex-col gap-8 rounded-[28px] border border-[#e4e6f3] bg-[#f9f9ff] p-8 shadow-[0_32px_120px_-80px_rgba(15,23,42,0.55)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_40px_140px_-70px_rgba(15,23,42,0.45)]">
      <header className="flex items-center justify-between rounded-2xl border border-[#e0e3f4] bg-white px-6 py-5 shadow-[0_22px_50px_-40px_rgba(15,23,42,0.35)]">
        <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#1a1d2b] sm:text-xl">
          {course.name}
        </h3>
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#d5d8f0] bg-[#f1f4ff] text-[#4f39f6]">
          <Bookmark className="h-5 w-5" />
        </span>
      </header>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#e0e2ef] bg-white px-5 py-4 text-sm font-medium text-[#2f3242] shadow-[0_15px_35px_-28px_rgba(15,23,42,0.35)]">
        <Metric icon={<FileText className="h-4 w-4" />} label="Fees" value={course.fees} />
        <Metric icon={<Timer className="h-4 w-4" />} label="Duration" value={course.duration} />
        <Metric icon={<UsersRound className="h-4 w-4" />} label="Study Mode" value={course.studyMode} />
      </div>

      <div className="flex flex-col gap-6 rounded-2xl border border-[#e0e2ef] bg-white px-6 py-6 shadow-[0_15px_35px_-30px_rgba(15,23,42,0.3)]">
        <div className="flex flex-col gap-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-[#777a8b]">
            <GraduationCap className="h-4 w-4 text-[#4f39f6]" />
            Courses Offered
          </h4>
          <ul className="flex flex-wrap gap-3">
            {course.coursesOffered.map((item) => (
              <li
                key={item}
                className="rounded-full border border-[#d7dbed] bg-[#f4f6ff] px-4 py-2 text-sm font-medium tracking-tight text-[#2e3144]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#777a8b]">
            Eligibility
          </h4>
          <p className="text-sm leading-relaxed text-[#5d6073]">{course.eligibility}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          asChild
          variant="accent"
          size="md"
          className="h-12 flex-1 rounded-full border border-black/5 px-6 text-sm font-semibold shadow-[0_18px_40px_rgba(79,57,246,0.28)]"
        >
          <a href={course.brochureUrl} target="_blank" rel="noopener noreferrer">
            Download Brochure
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          size="md"
          className="h-12 flex-1 rounded-full border-[#d7dbed] bg-white px-6 text-sm font-semibold text-[#1d2238] shadow-[0_16px_40px_-28px_rgba(15,23,42,0.4)] hover:border-[#bfc6e4]"
        >
          <a href={course.expertsUrl} target="_blank" rel="noopener noreferrer">
            Talk to our Experts
          </a>
        </Button>
      </div>
    </article>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#e2e4f1] bg-[#f9f9ff] px-4 py-2 text-sm text-[#2f3140]">
      <span className="text-[#4f39f6]">{icon}</span>
      <span className="font-semibold">{value}</span>
      <span className="text-xs uppercase tracking-[0.24em] text-[#8f93a8]">{label}</span>
    </span>
  );
}


