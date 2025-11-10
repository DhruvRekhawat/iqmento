export interface MentorSummary {
  label: string;
  value: string;
}

export interface FocusArea {
  title: string;
  description: string;
}

export interface SessionOffering {
  title: string;
  description: string;
  duration: string;
  format: string;
  price: string;
}

export interface AlumniReview {
  quote: string;
  name: string;
  role: string;
  rating?: number;
}

export interface AlumniProfile {
  slug: string;
  name: string;
  headline: string;
  location: string;
  heroTagline: string;
  heroSummary: string[];
  overview: string[];
  image: string;
  heroImage: string;
  availability: string;
  stats: MentorSummary[];
  focusAreas: FocusArea[];
  sessions: SessionOffering[];
  highlights: string[];
  resources: { label: string; href: string }[];
  reviews: AlumniReview[];
  featuredQuote: string;
  bookingUrl: string;
  questionUrl: string;
}

export const alumniProfiles: AlumniProfile[] = [
  {
    slug: "aditi-mehra",
    name: "Aditi Mehra",
    headline: "Lead Product Designer · Google",
    location: "San Francisco, USA",
    heroTagline:
      "Crafting human-centered systems that scale from zero-to-one launches to global rollouts.",
    heroSummary: [
      "Aditi blends Indian craft sensibilities with Silicon Valley pace. From building sustainable furniture projects at NID to leading design systems at Google, her journey bridges empathy, function, and aesthetics.",
      "She loves mentoring emerging designers on portfolio storytelling, systems thinking, and navigating international design cultures with confidence.",
    ],
    overview: [
      "Aditi Mehra is a product designer blending Indian craft sensibilities with global technology ecosystems. From building sustainable furniture projects at NID to leading design systems at Google, her journey bridges empathy, function, and aesthetics.",
      "She is known for running design thinking bootcamps across five countries, coaching product teams through accessibility audits, and mentoring emerging designers on portfolio storytelling, systems thinking, and navigating international design cultures with confidence.",
    ],
    image: "/alumini-placeholder.png",
    heroImage: "/alumini-placeholder.png",
    availability: "2 sessions available this week · Pacific Time",
    stats: [
      { label: "Experience", value: "8+ years" },
      { label: "Previous Roles", value: "Apple, IDEO, Google" },
      { label: "Mentees Guided", value: "120+" },
    ],
    focusAreas: [
      {
        title: "Design Systems & Tooling",
        description:
          "Ship resilient design systems and documentation that teams actually adopt across platforms.",
      },
      {
        title: "Portfolio Storytelling",
        description:
          "Elevate case studies with crisp narratives, measurable outcomes, and polished visuals that stand out to hiring panels.",
      },
      {
        title: "Global Career Navigation",
        description:
          "Plan masters programs, work visas, and role transitions while balancing creativity, compensation, and culture fit.",
      },
    ],
    sessions: [
      {
        title: "Portfolio & Case Study Review",
        description:
          "60-minute deep dive on structure, visuals, and strategic framing. Leave with annotated feedback, next steps, and resource links.",
        duration: "60 min",
        format: "1:1 on Zoom · Recording shared",
        price: "₹4,500 / $55",
      },
      {
        title: "Design System Strategy Clinic",
        description:
          "Workshop your system roadmap, tooling stack, governance model, and adoption playbook tailored to your org stage.",
        duration: "75 min",
        format: "Collaborative FigJam + follow-up doc",
        price: "₹5,200 / $62",
      },
      {
        title: "Career Clarity + Offer Review",
        description:
          "Compare multiple offers, negotiate confidently, and map a 12-month growth plan across product companies or studios.",
        duration: "50 min",
        format: "Live mentoring + compensation worksheet",
        price: "₹3,800 / $48",
      },
    ],
    highlights: [
      "Led the Material 4 migration for Google Workspace",
      "Hosted design thinking bootcamps across 5 countries",
      "Part of NID’s global alumni council",
    ],
    resources: [
      { label: "Download Portfolio Template", href: "https://iqmento.com/resources/aditi-portfolio-template" },
      { label: "Watch Systems Scaling Panel", href: "https://iqmento.com/watch/design-systems-summit" },
    ],
    reviews: [
      {
        quote:
          "Aditi rewired how I framed outcomes. My portfolio finally feels like a narrative instead of pretty screens.",
        name: "Rhea Mukherjee",
        role: "Sr. Product Designer · Amsterdam",
        rating: 5,
      },
      {
        quote:
          "Her system audit checklist saved us months of rework. We now have adoption across design, eng, and PM.",
        name: "Karthik Nair",
        role: "Design Manager · Bengaluru",
        rating: 5,
      },
      {
        quote:
          "Walked into salary negotiations with clarity and data. Landed my dream role in Berlin.",
        name: "Meenal Singh",
        role: "UX Designer · Berlin",
        rating: 4,
      },
    ],
    featuredQuote:
      "“Mentors arrive at every stage. I want to be the one who shows up right when you need them the most.”",
    bookingUrl: "https://iqmento.com/book/aditi-mehra",
    questionUrl: "https://iqmento.com/message/aditi-mehra",
  },
  {
    slug: "arjun-iyer",
    name: "Arjun Iyer",
    headline: "Staff AI Product Manager · Microsoft",
    location: "Seattle, USA",
    heroTagline: "Building trustworthy AI products that balance velocity, ethics, and business value.",
    heroSummary: [
      "Arjun has spent a decade transforming research into lovable products at Flipkart, Freshworks, and Microsoft’s AI org.",
      "He mentors PMs on scoping AI bets, collaborating with research, and communicating impact to leadership.",
    ],
    overview: [
      "Arjun Iyer has spent the last decade transforming research prototypes into lovable, revenue-driving products. He has shipped conversational AI at Flipkart, scaled SaaS adoption at Freshworks, and now leads responsible AI programs at Microsoft.",
      "At IQMento he mentors PMs on scoping AI bets, partnering with research, and communicating impact to leadership so that the right ideas ship with the right guardrails.",
    ],
    image: "/alumini-placeholder.png",
    heroImage: "/alumini-placeholder.png",
    availability: "Weekend slots · Pacific & India friendly",
    stats: [
      { label: "Experience", value: "10 years" },
      { label: "Launches Led", value: "30+" },
      { label: "Exits Coached", value: "12" },
    ],
    focusAreas: [
      {
        title: "AI Product Strategy",
        description:
          "Define responsible AI roadmaps, success metrics, and launch criteria that satisfy legal, design, and GTM stakeholders.",
      },
      {
        title: "PM Career Navigation",
        description:
          "Prep for senior/staff PM interviews with case drills and real feedback on executive communication.",
      },
      {
        title: "Cross-Functional Leadership",
        description:
          "Build alignment with research, data science, and design teams — even when incentives diverge.",
      },
    ],
    sessions: [
      {
        title: "AI Product Case Simulation",
        description:
          "Mock interview with live whiteboarding, applied ethics scenarios, and debrief on strengths + growth areas.",
        duration: "75 min",
        format: "Live simulation + feedback doc",
        price: "₹5,800 / $70",
      },
      {
        title: "Roadmap & OKR Workshop",
        description:
          "Bring your current roadmap. Arjun stress-tests bets, dependencies, and storytelling for leadership reviews.",
        duration: "60 min",
        format: "Working session + async review",
        price: "₹4,900 / $60",
      },
    ],
    highlights: [
      "PMF coach for 3 YC-backed startups",
      "Ex-Flipkart, Freshworks, Microsoft AI",
      "Guest lecturer at ISB & IIMB",
    ],
    resources: [
      { label: "Responsible AI Checklist", href: "https://iqmento.com/resources/ai-checklist" },
      { label: "PM Staff Interview Kit", href: "https://iqmento.com/resources/staff-pm-kit" },
    ],
    reviews: [
      {
        quote:
          "The AI case drill was tougher than my real interview. That confidence boost helped me crack Microsoft.",
        name: "Vishal Kumar",
        role: "Senior PM · Hyderabad",
        rating: 5,
      },
      {
        quote:
          "Arjun’s alignment tactics helped me rescue a cross-functional project that was weeks behind.",
        name: "Divya Sharma",
        role: "Product Lead · Singapore",
        rating: 4,
      },
    ],
    featuredQuote:
      "“Great PMs translate ambiguity into clarity. Mentorship accelerates that translation.”",
    bookingUrl: "https://iqmento.com/book/arjun-iyer",
    questionUrl: "https://iqmento.com/message/arjun-iyer",
  },
  {
    slug: "meera-chawla",
    name: "Meera Chawla",
    headline: "VP Growth · Duolingo",
    location: "New York, USA",
    heroTagline: "Scaling playful brands with ruthless experimentation and community love.",
    heroSummary: [
      "Meera blends performance marketing chops with product-led storytelling. She has grown mobile apps to 200M users across edtech and fintech.",
      "She mentors operators on growth loops, retention design, and global go-to-market playbooks.",
    ],
    overview: [
      "Meera Chawla blends performance marketing chops with product-led storytelling. She has grown mobile apps to 200M+ MAU across edtech, fintech, and consumer social with a bias for experimentation.",
      "Her mentorship focuses on designing compounding growth loops, retaining communities with humane nudges, and preparing operators for leadership transitions without sacrificing health.",
    ],
    image: "/alumini-placeholder.png",
    heroImage: "/alumini-placeholder.png",
    availability: "Limited weekday mornings ET",
    stats: [
      { label: "Experience", value: "12 years" },
      { label: "MAU Scaled", value: "200M+" },
      { label: "Teams Led", value: "50+" },
    ],
    focusAreas: [
      {
        title: "Growth Loops & Retention",
        description:
          "Design experiments that compound — from activation to referral flywheels and lifecycle journeys.",
      },
      {
        title: "GTM for New Regions",
        description:
          "Localize positioning, pricing, and partnerships while protecting brand voice.",
      },
      {
        title: "Leadership & Culture",
        description:
          "Coach emerging leaders on hiring bar, feedback rituals, and mental stamina.",
      },
    ],
    sessions: [
      {
        title: "Growth Loop Diagnostic",
        description:
          "Audit your current funnel, identify compounding loops, and leave with a prioritized experimentation roadmap.",
        duration: "70 min",
        format: "Live FigJam + follow-up doc",
        price: "₹6,200 / $75",
      },
      {
        title: "Executive Coaching Sprint",
        description:
          "3-session sprint focused on communication, stakeholder alignment, and sustainable operating rhythm.",
        duration: "3 x 45 min",
        format: "Zoom + async accountability",
        price: "₹14,500 / $175",
      },
    ],
    highlights: [
      "Built Duolingo’s streak retention engine",
      "Ex-Head of Growth at Razorpay",
      "Angel investor in 12 consumer startups",
    ],
    resources: [
      { label: "Experiment Prioritization Template", href: "https://iqmento.com/resources/growth-template" },
      { label: "Retention Playbook", href: "https://iqmento.com/resources/retention-guide" },
    ],
    reviews: [
      {
        quote:
          "Our activation metric jumped 18% after the roadmap Meera co-created with us.",
        name: "Arpit Batra",
        role: "Growth Lead · Mumbai",
        rating: 5,
      },
      {
        quote:
          "She helped me navigate a tough exec transition while keeping the team energized.",
        name: "Laura Chen",
        role: "Director of Growth · Toronto",
        rating: 5,
      },
    ],
    featuredQuote:
      "“Growth is a craft. You iterate faster when someone hands you the right instruments.”",
    bookingUrl: "https://iqmento.com/book/meera-chawla",
    questionUrl: "https://iqmento.com/message/meera-chawla",
  },
  {
    slug: "riyaz-kapoor",
    name: "Riyaz Kapoor",
    headline: "Founder & CTO · Lumi Labs",
    location: "Bengaluru, India",
    heroTagline: "From dorm-room prototypes to Series B in four years — mentoring builders on the same path.",
    heroSummary: [
      "Riyaz co-founded Lumi Labs, a computer vision startup acquired in 2023. He now advises deep-tech founders on product strategy, fundraising, and team design.",
      "He is passionate about making deep-tech commercialization more accessible for students from tier-2 cities.",
    ],
    overview: [
      "Riyaz Kapoor co-founded Lumi Labs, a computer vision startup that went from dorm-room prototype to Series B in under four years before a 2023 acquisition. He previously shipped perception systems at NVIDIA and helped build the core ML team at a leading retail SaaS player.",
      "He now mentors deep-tech founders on translating research into pilots, crafting fundraising narratives, and building lean engineering teams that can compete globally from India.",
    ],
    image: "/alumini-placeholder.png",
    heroImage: "/alumini-placeholder.png",
    availability: "Evening IST slots · 3 per week",
    stats: [
      { label: "Experience", value: "9 years" },
      { label: "Capital Raised", value: "$48M" },
      { label: "Patents", value: "7" },
    ],
    focusAreas: [
      {
        title: "Tech to Market",
        description:
          "Translate research into customer-validated prototypes, secure pilots, and prep for scale.",
      },
      {
        title: "Fundraising Narrative",
        description:
          "Craft data-backed stories, metrics, and diligence rooms that align investors faster.",
      },
      {
        title: "Team & Culture",
        description:
          "Set up engineering rituals, hiring loops, and equity structures that retain top talent.",
      },
    ],
    sessions: [
      {
        title: "Pitch + Data Room Review",
        description:
          "Bring your deck and metrics. Riyaz shares investor POV, suggests storyline tweaks, and stress-tests Q&A.",
        duration: "60 min",
        format: "Zoom + async edit round",
        price: "₹7,000 / $85",
      },
      {
        title: "Prototype Strategy Deep Dive",
        description:
          "Map technical roadmap, set success metrics, and identify build-vs-buy decisions for your next milestone.",
        duration: "90 min",
        format: "Whiteboard session",
        price: "₹7,800 / $92",
      },
    ],
    highlights: [
      "Exited Lumi Labs to Stripe in 2023",
      "Built CV stack used by 200+ retailers",
      "Mentor at Sequoia Surge & Entrepreneur First",
    ],
    resources: [
      { label: "Deep-Tech Fundraising Checklist", href: "https://iqmento.com/resources/deeptech-fundraising" },
      { label: "Pilot Playbook", href: "https://iqmento.com/resources/pilot-playbook" },
    ],
    reviews: [
      {
        quote:
          "Riyaz’s feedback on our pitch deck landed us three investor follow-ups within a week.",
        name: "Sneha Patil",
        role: "Founder · Pune",
        rating: 5,
      },
      {
        quote:
          "He spotted technical debt risks early and helped us restructure our roadmap before hiring.",
        name: "Mohit S",
        role: "CTO · Chennai",
        rating: 4,
      },
    ],
    featuredQuote:
      "“Students from small towns deserve the same unfair advantages. I mentor to level that playing field.”",
    bookingUrl: "https://iqmento.com/book/riyaz-kapoor",
    questionUrl: "https://iqmento.com/message/riyaz-kapoor",
  },
  {
    slug: "isha-singh",
    name: "Isha Singh",
    headline: "Head of Design Research · Airbnb",
    location: "London, UK",
    heroTagline: "Design research that earns trust — across cultures, regulations, and community expectations.",
    heroSummary: [
      "Isha leads Airbnb’s trust & safety research team in EMEA. Previously at Spotify and IDEO, she specializes in sensitive research and service design.",
      "She coaches researchers and PMs on operationalizing insights, influencing policy, and designing ethical frameworks.",
    ],
    overview: [
      "Isha Singh leads Airbnb’s trust & safety research team across EMEA. Previously at Spotify and IDEO, she specializes in highly sensitive research, service design, and policy storytelling.",
      "Her mentoring approach helps researchers operationalize insights, influence policy teams, and build ethical frameworks that protect both communities and businesses.",
    ],
    image: "/alumini-placeholder.png",
    heroImage: "/alumini-placeholder.png",
    availability: "Fridays · GMT & IST friendly",
    stats: [
      { label: "Experience", value: "11 years" },
      { label: "Markets Researched", value: "26" },
      { label: "Playbooks Published", value: "9" },
    ],
    focusAreas: [
      {
        title: "Sensitive Research Ops",
        description:
          "Design participant safeguards, data policies, and rituals that build trust with regulators and communities.",
      },
      {
        title: "Insight to Action",
        description:
          "Turn qualitative insights into product, policy, and ops decisions leadership backs.",
      },
      {
        title: "Research Career Growth",
        description:
          "Navigate senior IC vs. manager tracks, build influence, and negotiate for research investments.",
      },
    ],
    sessions: [
      {
        title: "Research Plan Audit",
        description:
          "Stress-test your study design, screeners, and success metrics. Leave with tailored templates and red flags to address.",
        duration: "55 min",
        format: "Live review + annotated doc",
        price: "₹4,900 / $60",
      },
      {
        title: "Leadership Coaching",
        description:
          "Three-session journey to sharpen influence, stakeholder storytelling, and team rituals.",
        duration: "3 x 45 min",
        format: "Zoom + async feedback",
        price: "₹13,800 / $165",
      },
    ],
    highlights: [
      "Shaped Airbnb’s Safety Research Guidelines",
      "Former IDEO & Spotify researcher",
      "Speaker at IxDA, UXRConf",
    ],
    resources: [
      { label: "Sensitive Research Field Guide", href: "https://iqmento.com/resources/sensitive-research" },
      { label: "Stakeholder Mapping Template", href: "https://iqmento.com/resources/stakeholder-map" },
    ],
    reviews: [
      {
        quote:
          "Isha gave me a stakeholder plan that finally got leadership to fund our research backlog.",
        name: "Neha Thomas",
        role: "Research Lead · Dublin",
        rating: 5,
      },
      {
        quote:
          "Her guidance on participant safety protocols saved our launch in the EU.",
        name: "Omar Khalid",
        role: "Policy PM · Berlin",
        rating: 5,
      },
    ],
    featuredQuote:
      "“Empathy needs rigor. I mentor so teams never have to choose between the two.”",
    bookingUrl: "https://iqmento.com/book/isha-singh",
    questionUrl: "https://iqmento.com/message/isha-singh",
  },
];

export function getAlumniProfile(slug: string) {
  return alumniProfiles.find((profile) => profile.slug === slug);
}


