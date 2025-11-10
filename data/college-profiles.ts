import { Metadata } from "next";

export type CollegeBadgeIcon =
  | "award"
  | "shield"
  | "sparkles"
  | "trophy"
  | "users";

export interface CollegeHeroContent {
  tagline: string;
  description: string;
  badges: { label: string; icon: CollegeBadgeIcon }[];
  primaryAction: { label: string; href: string };
  secondaryAction: { label: string; href: string };
}

export interface CourseDetail {
  name: string;
  fees: string;
  duration: string;
  studyMode: string;
  coursesOffered: string[];
  eligibility: string;
  brochureUrl: string;
  expertsUrl: string;
}

export interface AdmissionStep {
  title: string;
  description: string;
  highlight?: boolean;
}

export interface PlacementHighlight {
  label: string;
  value: string;
}

export interface ReviewDetail {
  quote: string;
  name: string;
  role: string;
  rating?: number;
}

export interface AlumniDetail {
  name: string;
  role: string;
  company: string;
  image: string;
}

export interface FaqDetail {
  question: string;
  answer: string;
}

export interface CollegeProfile {
  slug: string;
  name: string;
  shortName?: string;
  location: string;
  heroImage: string;
  hero: CollegeHeroContent;
  about: string[];
  courses: CourseDetail[];
  admission: {
    title: string;
    subtitle: string;
    steps: AdmissionStep[];
  };
  recruiters: {
    title: string;
    logos: string[];
    cutoff: string[];
    placements: PlacementHighlight[];
  };
  reviews: ReviewDetail[];
  alumni: AlumniDetail[];
  faqs: FaqDetail[];
  metadata: Metadata;
}

export const collegeProfiles: CollegeProfile[] = [
  {
    slug: "national-institute-of-design-ahmedabad",
    name: "National Institute of Design (NID), Ahmedabad",
    shortName: "NID Ahmedabad",
    location: "Ahmedabad, Gujarat",
    heroImage: "/colleges/hero.png",
    hero: {
      tagline: "Craft the future of Indian design with the studio-first campus that shaped the industry.",
      description:
        "From legendary workshops to live industry collaborations, experience how NID mentors help you build portfolios, ace DAT, and thrive in the country’s most coveted design ecosystem.",
      badges: [
        { label: "Institute of National Importance", icon: "trophy" },
        { label: "UGC Recognized", icon: "shield" },
      ],
      primaryAction: {
        label: "Apply Now",
        href: "https://nid.edu/admissions",
      },
      secondaryAction: {
        label: "Download Brochure",
        href: "https://nid.edu/uploads/files/NID_Brochure.pdf",
      },
    },
    about: [
      "The National Institute of Design (NID), Ahmedabad, is India’s premier design institution known for pioneering design education. Established in 1961, NID has shaped India’s design ecosystem through its strong academic rigor, studio-based learning, and industry collaboration.",
      "Its alumni are globally recognized for their impact in product design, visual communication, and strategic innovation across technology, lifestyle, and social-impact sectors.",
    ],
    courses: [
      {
        name: "B.Des (Bachelor of Design)",
        fees: "₹6,000",
        duration: "4 Years",
        studyMode: "Full-time · Residential",
        coursesOffered: [
          "Industrial Design",
          "Communication Design",
          "Textile & Apparel Design",
        ],
        eligibility:
          "Class 12 (any stream) with 60% aggregate · Qualify NID DAT Prelims & Mains · Meet age criteria (20 years for general category).",
        brochureUrl: "https://nid.edu/uploads/files/NID_Brochure.pdf",
        expertsUrl: "https://iqmento.com/mentor/nid-bdes",
      },
      {
        name: "M.Des (Master of Design)",
        fees: "₹6,000",
        duration: "2.5 Years",
        studyMode: "Full-time · Studio-based",
        coursesOffered: [
          "Product Design",
          "UX / UI Design",
          "Strategic Design Management",
        ],
        eligibility:
          "Bachelor’s degree in Design/Architecture/Engineering · Qualify NID DAT (M.Des) · Studio Test + Personal Interview.",
        brochureUrl: "https://nid.edu/uploads/files/NID_MDes_Brochure.pdf",
        expertsUrl: "https://iqmento.com/mentor/nid-mdes",
      },
    ],
    admission: {
      title: "Admission Process",
      subtitle: "Know every milestone from application to final offer.",
      steps: [
        {
          title: "Apply Online",
          description:
            "Submit your NID application on the official portal with portfolio highlights and supporting documents.",
        },
        {
          title: "Entrance Exam",
          description: "Appear for NID DAT (Prelims for all, Mains for shortlisted candidates).",
        },
        {
          title: "Studio Test & Interview",
          description: "Participate in studio-based assessments, juries, and personal interviews on campus.",
        },
        {
          title: "Merit List & Admission",
          description: "Final seat allocation based on DAT score, studio performance, and category rank.",
          highlight: true,
        },
      ],
    },
    recruiters: {
      title: "Top Recruiters at NID Ahmedabad",
      logos: ["IDEO", "Tata Elxsi", "Microsoft", "Flipkart", "IBM", "Accenture", "Adobe", "Godrej"],
      cutoff: [
        "B.Des Eligibility: Pass 10+2 from any recognized board · General category age limit: 20 years.",
        "NID DAT 2024 Cutoff (General): 68 marks (approximate).",
      ],
      placements: [
        { label: "Highest Package", value: "₹25 LPA" },
        { label: "Average Package", value: "₹9.5 LPA" },
      ],
    },
    reviews: [
      {
        quote:
          "The studio tours with alumni made me understand how juries work and what gets appreciated. It changed the way I prepared for the mains.",
        name: "Priya Sharma",
        role: "B.Des Applicant · Delhi",
        rating: 5,
      },
      {
        quote:
          "My mentor walked me through her DAT portfolio in detail. That clarity helped me push my sketches and storytelling to the next level.",
        name: "Rahul Mehta",
        role: "Product Design Aspirant · Mumbai",
        rating: 4,
      },
      {
        quote:
          "Hearing about life at NID—hostels, workshops, electives—directly from seniors made the decision so much easier for my family and me.",
        name: "Anjali Verma",
        role: "Parent of 2024 Admit · Jaipur",
        rating: 5,
      },
      {
        quote:
          "The placements insight session showed me how NID grads build careers across consulting and tech, not just core design.",
        name: "Devansh Rao",
        role: "M.Des Interaction Design · Bengaluru",
        rating: 4,
      },
    ],
    alumni: [
      {
        name: "Jiyesh Shah",
        role: "Sr. Product Designer · Class of 2018",
        company: "Google",
        image: "/alumini-placeholder.png",
      },
      {
        name: "Aanya Rao",
        role: "Design Strategist · Class of 2017",
        company: "Notion",
        image: "/alumini-placeholder.png",
      },
      {
        name: "Karthik Menon",
        role: "UX Lead · Class of 2016",
        company: "Spotify",
        image: "/alumini-placeholder.png",
      },
      {
        name: "Misbah Ali",
        role: "Design Researcher · Class of 2015",
        company: "IDEO",
        image: "/alumini-placeholder.png",
      },
      {
        name: "Rhea Patel",
        role: "Service Designer · Class of 2014",
        company: "Airbnb",
        image: "/alumini-placeholder.png",
      },
    ],
    faqs: [
      {
        question: "Is NID a government college?",
        answer:
          "Yes. NID Ahmedabad is an Institute of National Importance under the NID Act 2014 and functions under the Department for Promotion of Industry and Internal Trade (DPIIT), Government of India.",
      },
      {
        question: "What is the entrance exam for NID?",
        answer:
          "Admissions are through the NID Design Aptitude Test (DAT). It has two stages—Prelims (written + aptitude) and Mains (studio test + interview). Scores from both rounds determine the final merit list.",
      },
      {
        question: "Is hostel accommodation available?",
        answer:
          "Yes. Separate hostels for all batches are available on campus with mess facilities. First-year students are required to stay in campus housing.",
      },
      {
        question: "Can I apply to multiple disciplines?",
        answer:
          "You can select up to two disciplines during the application. Mains studio tests are tailored to the disciplines you shortlist.",
      },
    ],
    metadata: {
      title: "NID Ahmedabad — Courses, Admission, Alumni & Reviews | IQMento",
      description:
        "Explore NID Ahmedabad with verified alumni—admission process, DAT prep tips, placements, recruiters, and mentor-led insights tailored to design aspirants.",
      openGraph: {
        title: "NID Ahmedabad — Courses, Admission, Alumni & Reviews | IQMento",
        description:
          "Explore NID Ahmedabad with verified alumni—admission process, DAT prep tips, placements, recruiters, and mentor-led insights tailored to design aspirants.",
      },
      twitter: {
        card: "summary_large_image",
        title: "NID Ahmedabad — Courses, Admission, Alumni & Reviews | IQMento",
        description:
          "Explore NID Ahmedabad with verified alumni—admission process, DAT prep tips, placements, recruiters, and mentor-led insights tailored to design aspirants.",
      },
    },
  },
];

export function getCollegeProfile(slug: string) {
  return collegeProfiles.find((college) => college.slug === slug);
}


