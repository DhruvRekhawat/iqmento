import Image from "next/image";

import { Container } from "@/components/shared/container";

interface CollegeCardProps {
  name: string;
  description: string;
  mentors: number;
  reviews: number;
  image: string;
}

const MOST_BOOKED: CollegeCardProps[] = [
  {
    name: "Indian Institute of Technology, Delhi",
    description:
      "Engineering meets innovation—connect with alumni now leading at Google and Tesla.",
    mentors: 15,
    reviews: 42,
    image: "/college-placeholder.svg",
  },
  {
    name: "Indian Institute of Management, Bangalore",
    description:
      "Decode admissions essays, interviews, and campus culture with seasoned mentors.",
    mentors: 18,
    reviews: 38,
    image: "/college-placeholder.svg",
  },
  {
    name: "Georgia Institute of Technology",
    description:
      "Navigate international admissions, scholarships, and STEM pathways with clarity.",
    mentors: 12,
    reviews: 27,
    image: "/college-placeholder.svg",
  },
];

const RISING: CollegeCardProps[] = [
  {
    name: "BITS Pilani",
    description:
      "Understand dual degrees, practice schools, and startup ecosystems from insiders.",
    mentors: 11,
    reviews: 26,
    image: "/college-placeholder.svg",
  },
  {
    name: "University of Toronto",
    description:
      "Plan your global undergraduate journey with guidance on co-ops and research tracks.",
    mentors: 9,
    reviews: 22,
    image: "/college-placeholder.svg",
  },
  {
    name: "Ashoka University",
    description:
      "Explore interdisciplinary majors, financial aid, and vibrant campus life with mentors.",
    mentors: 7,
    reviews: 18,
    image: "/college-placeholder.svg",
  },
];

export function FeaturedColleges() {
  return (
    <section id="colleges" className="bg-white py-24 sm:py-32">
      <Container>
        <header className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-4xl font-medium leading-tight tracking-tight text-foreground-strong sm:text-5xl md:text-[3.5rem]">
            Featured Colleges
          </h2>
          <p className="text-lg text-foreground-muted sm:max-w-2xl sm:text-xl">
            See where students are connecting the most this week.
          </p>
        </header>

        <div className="mt-16 flex flex-col gap-14">
          <CollegeGroup
            title="Most Booked Mentors This Week"
            colleges={MOST_BOOKED}
          />
          <CollegeGroup title="Rising Colleges" colleges={RISING} />
        </div>
      </Container>
    </section>
  );
}

function CollegeGroup({
  title,
  colleges,
}: {
  title: string;
  colleges: CollegeCardProps[];
}) {
  return (
    <div className="flex flex-col gap-8">
      <h3 className="text-center text-3xl font-semibold tracking-tight text-[#4e4e4e] sm:text-4xl">
        {title}
      </h3>
      <div className="grid gap-8 lg:grid-cols-3">
        {colleges.map((college) => (
          <CollegeCard key={college.name} {...college} />
        ))}
      </div>
    </div>
  );
}

function CollegeCard({
  name,
  description,
  mentors,
  reviews,
  image,
}: CollegeCardProps) {
  return (
    <article className="flex h-full flex-col gap-6 rounded-3xl border border-[rgba(16,19,34,0.08)] bg-[#f1f1f1] p-6 shadow-soft transition-transform duration-300 hover:-translate-y-2 hover:shadow-card">
      <div className="relative h-40 overflow-hidden rounded-2xl bg-[#626262]">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover object-center opacity-60"
        />
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3 text-sm text-[#535353]">
          <RatingStars />
          <span>{reviews} Reviews</span>
        </div>

        <h4 className="text-2xl font-semibold leading-snug tracking-[-0.02em] text-[#2c2c2c]">
          {name}
        </h4>
        <p className="text-sm leading-relaxed text-[#535353]">{description}</p>

        <div className="flex items-center gap-3 text-sm font-medium text-[#535353]">
          <svg
            width="18"
            height="16"
            viewBox="0 0 18 16"
            fill="none"
            aria-hidden
          >
            <path
              d="M6.333 9.333a3.167 3.167 0 1 0 0-6.333 3.167 3.167 0 0 0 0 6.333ZM11.667 15c0-2.209-2.387-4-5.333-4-2.947 0-5.334 1.791-5.334 4"
              stroke="#535353"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M12.667 6.333a2.333 2.333 0 1 0 0-4.666 2.333 2.333 0 0 0 0 4.666ZM17 13.667c0-1.86-2.06-3.367-4.333-3.367-.713 0-1.39.112-2 .31"
              stroke="#535353"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {mentors} Mentors Available
        </div>
      </div>
    </article>
  );
}

function RatingStars() {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          width="16"
          height="15"
          viewBox="0 0 16 15"
          fill="none"
          aria-hidden
        >
          <path
            d="M7.235 1.665c.3-.724 1.307-.724 1.607 0l1.1 2.65c.12.29.375.492.678.527l2.838.327c.79.091 1.107 1.064.515 1.608l-2.15 1.99a.917.917 0 0 0-.276.83l.63 2.804c.176.78-.668 1.394-1.35.997l-2.429-1.39a.917.917 0 0 0-.895 0l-2.43 1.39c-.681.397-1.525-.217-1.35-.998l.631-2.804a.917.917 0 0 0-.276-.829L1.027 6.777c-.592-.544-.275-1.517.515-1.608l2.838-.327a.917.917 0 0 0 .678-.527l1.1-2.65Z"
            fill="#9747FF"
          />
        </svg>
      ))}
    </div>
  );
}

