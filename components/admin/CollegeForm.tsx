"use client";

import * as React from "react";
import { TabNav } from "@/components/admin/TabNav";
import { FormField } from "@/components/admin/FormField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ToggleSwitch } from "@/components/admin/ToggleSwitch";
import {
  StringList,
  KeyValueList,
  ObjectList,
} from "@/components/admin/DynamicList";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HeroBadge {
  label: string;
  icon: string;
}

interface HeroAction {
  label: string;
  href: string;
}

interface HeroData {
  tagline?: string;
  description?: string;
  badges?: HeroBadge[];
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
}

interface CourseData {
  name: string;
  fees: string;
  duration: string;
  studyMode: string;
  coursesOffered: string[];
  eligibility: string;
  brochureUrl: string;
  expertsUrl: string;
}

interface AdmissionStep {
  title: string;
  description: string;
  highlight?: boolean;
}

interface AdmissionData {
  title: string;
  subtitle: string;
  steps: AdmissionStep[];
}

interface RecruitersData {
  title: string;
  logos: string[];
  cutoff: string[];
  placements: { label: string; value: string }[];
}

interface ReviewData {
  quote: string;
  name: string;
  role: string;
  rating?: number;
}

interface FaqData {
  question: string;
  answer: string;
}

export interface CollegeFormData {
  id?: string;
  slug: string;
  name: string;
  shortName?: string;
  location: string;
  heroImageUrl?: string;
  hero?: HeroData;
  about?: string[];
  courses?: CourseData[];
  admission?: AdmissionData;
  recruiters?: RecruitersData;
  reviews?: ReviewData[];
  faqs?: FaqData[];
  collegeType?: string;
  collegeTier?: string;
  rating?: number;
  metaTitle?: string;
  metaDescription?: string;
  published?: boolean;
}

interface CollegeFormProps {
  initialData?: CollegeFormData;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading?: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TABS = [
  { key: "basic", label: "Basic Info" },
  { key: "hero", label: "Hero" },
  { key: "courses", label: "Courses" },
  { key: "admission", label: "Admission" },
  { key: "recruiters", label: "Recruiters" },
  { key: "reviews", label: "Reviews & FAQs" },
  { key: "seo", label: "SEO" },
];

const COLLEGE_TYPE_OPTIONS = [
  { label: "IIT", value: "IIT" },
  { label: "NIT", value: "NIT" },
  { label: "IIM", value: "IIM" },
  { label: "NID", value: "NID" },
  { label: "Medical", value: "Medical" },
  { label: "Law", value: "Law" },
  { label: "Arts", value: "Arts" },
  { label: "Commerce", value: "Commerce" },
  { label: "Engineering", value: "Engineering" },
  { label: "Design", value: "Design" },
  { label: "Business", value: "Business" },
  { label: "Other", value: "Other" },
];

const COLLEGE_TIER_OPTIONS = [
  { label: "Tier 1", value: "Tier 1" },
  { label: "Tier 2", value: "Tier 2" },
  { label: "Tier 3", value: "Tier 3" },
];

const BADGE_ICON_OPTIONS = [
  { label: "Award", value: "award" },
  { label: "Shield", value: "shield" },
  { label: "Sparkles", value: "sparkles" },
  { label: "Trophy", value: "trophy" },
  { label: "Users", value: "users" },
];

const STUDY_MODE_OPTIONS = [
  { label: "Full-time", value: "Full-time" },
  { label: "Part-time", value: "Part-time" },
  { label: "Online", value: "Online" },
  { label: "Hybrid", value: "Hybrid" },
];

const CARD =
  "radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Flatten course objects for ObjectList (coursesOffered[] -> comma string) */
function coursesToRecords(
  courses: CourseData[]
): Record<string, string>[] {
  return courses.map((c) => ({
    name: c.name ?? "",
    fees: c.fees ?? "",
    duration: c.duration ?? "",
    studyMode: c.studyMode ?? "",
    eligibility: c.eligibility ?? "",
    coursesOffered: Array.isArray(c.coursesOffered)
      ? c.coursesOffered.join(", ")
      : "",
    brochureUrl: c.brochureUrl ?? "",
    expertsUrl: c.expertsUrl ?? "",
  }));
}

function recordsToCourses(
  records: Record<string, string>[]
): CourseData[] {
  return records.map((r) => ({
    name: r.name ?? "",
    fees: r.fees ?? "",
    duration: r.duration ?? "",
    studyMode: r.studyMode ?? "",
    eligibility: r.eligibility ?? "",
    coursesOffered: (r.coursesOffered ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    brochureUrl: r.brochureUrl ?? "",
    expertsUrl: r.expertsUrl ?? "",
  }));
}

function stepsToRecords(
  steps: AdmissionStep[]
): Record<string, string>[] {
  return steps.map((s) => ({
    title: s.title ?? "",
    description: s.description ?? "",
    highlight: s.highlight ? "true" : "",
  }));
}

function recordsToSteps(
  records: Record<string, string>[]
): AdmissionStep[] {
  return records.map((r) => ({
    title: r.title ?? "",
    description: r.description ?? "",
    highlight:
      r.highlight === "true" || r.highlight === "yes" || r.highlight === "1",
  }));
}

function reviewsToRecords(
  reviews: ReviewData[]
): Record<string, string>[] {
  return reviews.map((r) => ({
    quote: r.quote ?? "",
    name: r.name ?? "",
    role: r.role ?? "",
    rating: r.rating != null ? String(r.rating) : "",
  }));
}

function recordsToReviews(
  records: Record<string, string>[]
): ReviewData[] {
  return records.map((r) => ({
    quote: r.quote ?? "",
    name: r.name ?? "",
    role: r.role ?? "",
    rating: r.rating ? Number(r.rating) : undefined,
  }));
}

function faqsToRecords(
  faqs: FaqData[]
): Record<string, string>[] {
  return faqs.map((f) => ({
    question: f.question ?? "",
    answer: f.answer ?? "",
  }));
}

function recordsToFaqs(
  records: Record<string, string>[]
): FaqData[] {
  return records.map((r) => ({
    question: r.question ?? "",
    answer: r.answer ?? "",
  }));
}

function badgesToRecords(
  badges: HeroBadge[]
): Record<string, string>[] {
  return badges.map((b) => ({
    label: b.label ?? "",
    icon: b.icon ?? "",
  }));
}

function recordsToBadges(
  records: Record<string, string>[]
): HeroBadge[] {
  return records.map((r) => ({
    label: r.label ?? "",
    icon: r.icon ?? "",
  }));
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CollegeForm({
  initialData,
  onSubmit,
  isLoading = false,
}: CollegeFormProps) {
  const isEdit = Boolean(initialData?.id);

  // --- Tab state ---
  const [activeTab, setActiveTab] = React.useState("basic");

  // --- Slug manual-edit tracking ---
  const [slugManuallyEdited, setSlugManuallyEdited] = React.useState(false);

  // --- Form state ---
  const [name, setName] = React.useState(initialData?.name ?? "");
  const [shortName, setShortName] = React.useState(
    initialData?.shortName ?? ""
  );
  const [slug, setSlug] = React.useState(initialData?.slug ?? "");
  const [location, setLocation] = React.useState(
    initialData?.location ?? ""
  );
  const [heroImageUrl, setHeroImageUrl] = React.useState(
    initialData?.heroImageUrl ?? ""
  );
  const [collegeType, setCollegeType] = React.useState(
    initialData?.collegeType ?? ""
  );
  const [collegeTier, setCollegeTier] = React.useState(
    initialData?.collegeTier ?? ""
  );
  const [rating, setRating] = React.useState(
    initialData?.rating != null ? String(initialData.rating) : ""
  );

  // Hero
  const [heroTagline, setHeroTagline] = React.useState(
    initialData?.hero?.tagline ?? ""
  );
  const [heroDescription, setHeroDescription] = React.useState(
    initialData?.hero?.description ?? ""
  );
  const [heroBadges, setHeroBadges] = React.useState<
    Record<string, string>[]
  >(badgesToRecords(initialData?.hero?.badges ?? []));
  const [primaryActionLabel, setPrimaryActionLabel] = React.useState(
    initialData?.hero?.primaryAction?.label ?? ""
  );
  const [primaryActionHref, setPrimaryActionHref] = React.useState(
    initialData?.hero?.primaryAction?.href ?? ""
  );
  const [secondaryActionLabel, setSecondaryActionLabel] = React.useState(
    initialData?.hero?.secondaryAction?.label ?? ""
  );
  const [secondaryActionHref, setSecondaryActionHref] = React.useState(
    initialData?.hero?.secondaryAction?.href ?? ""
  );

  // Courses
  const [courses, setCourses] = React.useState<Record<string, string>[]>(
    coursesToRecords(initialData?.courses ?? [])
  );

  // Admission
  const [admissionTitle, setAdmissionTitle] = React.useState(
    initialData?.admission?.title ?? ""
  );
  const [admissionSubtitle, setAdmissionSubtitle] = React.useState(
    initialData?.admission?.subtitle ?? ""
  );
  const [admissionSteps, setAdmissionSteps] = React.useState<
    Record<string, string>[]
  >(stepsToRecords(initialData?.admission?.steps ?? []));

  // Recruiters
  const [recruitersTitle, setRecruitersTitle] = React.useState(
    initialData?.recruiters?.title ?? ""
  );
  const [recruitersLogos, setRecruitersLogos] = React.useState<string[]>(
    initialData?.recruiters?.logos ?? []
  );
  const [recruitersCutoff, setRecruitersCutoff] = React.useState<string[]>(
    initialData?.recruiters?.cutoff ?? []
  );
  const [recruitersPlacements, setRecruitersPlacements] = React.useState<
    { label: string; value: string }[]
  >(initialData?.recruiters?.placements ?? []);

  // Reviews
  const [reviews, setReviews] = React.useState<Record<string, string>[]>(
    reviewsToRecords(initialData?.reviews ?? [])
  );

  // FAQs
  const [faqs, setFaqs] = React.useState<Record<string, string>[]>(
    faqsToRecords(initialData?.faqs ?? [])
  );

  // SEO
  const [metaTitle, setMetaTitle] = React.useState(
    initialData?.metaTitle ?? ""
  );
  const [metaDescription, setMetaDescription] = React.useState(
    initialData?.metaDescription ?? ""
  );

  // Published
  const [published, setPublished] = React.useState(
    initialData?.published ?? false
  );

  // --- Auto-slug on name change (create mode only) ---
  React.useEffect(() => {
    if (!isEdit && !slugManuallyEdited) {
      setSlug(generateSlug(name));
    }
  }, [name, isEdit]);

  // If initial data has a slug, mark as manually edited so we don't overwrite
  React.useEffect(() => {
    if (isEdit) {
      setSlugManuallyEdited(true);
    }
  }, [isEdit]);

  // --- Validation ---
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Name is required";
    if (!slug.trim()) next.slug = "Slug is required";
    if (!location.trim()) next.location = "Location is required";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setActiveTab("basic");
    }
    return Object.keys(next).length === 0;
  }

  // --- Build payload ---
  function buildPayload(publishState: boolean): Record<string, unknown> {
    const payload: Record<string, unknown> = {
      name: name.trim(),
      shortName: shortName.trim() || undefined,
      slug: slug.trim(),
      location: location.trim(),
      heroImageUrl: heroImageUrl || undefined,
      collegeType: collegeType || undefined,
      collegeTier: collegeTier || undefined,
      rating: rating ? Number(rating) : undefined,
      hero: {
        tagline: heroTagline || undefined,
        description: heroDescription || undefined,
        badges: recordsToBadges(heroBadges).filter((b) => b.label),
        primaryAction:
          primaryActionLabel || primaryActionHref
            ? { label: primaryActionLabel, href: primaryActionHref }
            : undefined,
        secondaryAction:
          secondaryActionLabel || secondaryActionHref
            ? { label: secondaryActionLabel, href: secondaryActionHref }
            : undefined,
      },
      courses: recordsToCourses(courses).filter((c) => c.name),
      admission: {
        title: admissionTitle || undefined,
        subtitle: admissionSubtitle || undefined,
        steps: recordsToSteps(admissionSteps).filter((s) => s.title),
      },
      recruiters: {
        title: recruitersTitle || undefined,
        logos: recruitersLogos.filter(Boolean),
        cutoff: recruitersCutoff.filter(Boolean),
        placements: recruitersPlacements.filter(
          (p) => p.label || p.value
        ),
      },
      reviews: recordsToReviews(reviews).filter((r) => r.quote || r.name),
      faqs: recordsToFaqs(faqs).filter((f) => f.question),
      metaTitle: metaTitle.trim() || undefined,
      metaDescription: metaDescription.trim() || undefined,
      published: publishState,
    };

    if (initialData?.id) {
      payload.id = initialData.id;
    }

    return payload;
  }

  async function handleSubmit(publishState: boolean) {
    if (!validate()) return;
    setPublished(publishState);
    await onSubmit(buildPayload(publishState));
  }

  // ---------------------------------------------------------------------------
  // Tab renderers
  // ---------------------------------------------------------------------------

  function renderBasicInfo() {
    return (
      <div className={CARD}>
        <h3 className="text-sm font-semibold text-foreground-strong uppercase tracking-wider mb-5">
          Basic Information
        </h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            label="College Name"
            name="name"
            value={name}
            onChange={(v) => setName(v)}
            required
            error={errors.name}
            placeholder="e.g. Indian Institute of Technology Bombay"
          />
          <FormField
            label="Short Name"
            name="shortName"
            value={shortName}
            onChange={setShortName}
            placeholder="e.g. IIT Bombay"
          />
          <FormField
            label="Slug"
            name="slug"
            value={slug}
            onChange={(v) => {
              setSlugManuallyEdited(true);
              setSlug(v);
            }}
            required
            error={errors.slug}
            placeholder="iit-bombay"
            hint={
              !isEdit && !slugManuallyEdited
                ? "Auto-generated from name"
                : undefined
            }
          />
          <FormField
            label="Location"
            name="location"
            value={location}
            onChange={setLocation}
            required
            error={errors.location}
            placeholder="e.g. Mumbai, Maharashtra"
          />
          <FormField
            label="College Type"
            name="collegeType"
            value={collegeType}
            onChange={setCollegeType}
            type="select"
            options={COLLEGE_TYPE_OPTIONS}
            placeholder="Select type..."
          />
          <FormField
            label="College Tier"
            name="collegeTier"
            value={collegeTier}
            onChange={setCollegeTier}
            type="select"
            options={COLLEGE_TIER_OPTIONS}
            placeholder="Select tier..."
          />
          <FormField
            label="Rating"
            name="rating"
            value={rating}
            onChange={setRating}
            type="number"
            placeholder="e.g. 4.5"
          />
        </div>
        <div className="mt-5">
          <ImageUpload
            label="Hero Image"
            value={heroImageUrl}
            onChange={setHeroImageUrl}
            folder="colleges"
          />
        </div>
      </div>
    );
  }

  function renderHero() {
    return (
      <div className={CARD}>
        <h3 className="text-sm font-semibold text-foreground-strong uppercase tracking-wider mb-5">
          Hero Section
        </h3>
        <div className="space-y-5">
          <FormField
            label="Tagline"
            name="heroTagline"
            value={heroTagline}
            onChange={setHeroTagline}
            type="textarea"
            rows={2}
            placeholder="A short catchy tagline for the hero section"
          />
          <FormField
            label="Description"
            name="heroDescription"
            value={heroDescription}
            onChange={setHeroDescription}
            type="textarea"
            rows={3}
            placeholder="Brief description shown in the hero section"
          />

          <ObjectList
            label="Badges"
            fields={[
              { key: "label", label: "Label", placeholder: "e.g. #1 in India" },
              {
                key: "icon",
                label: "Icon",
                type: "select",
                options: BADGE_ICON_OPTIONS,
                placeholder: "Select icon...",
              },
            ]}
            values={heroBadges}
            onChange={setHeroBadges}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Primary Action Label"
              name="primaryActionLabel"
              value={primaryActionLabel}
              onChange={setPrimaryActionLabel}
              placeholder="e.g. Apply Now"
            />
            <FormField
              label="Primary Action URL"
              name="primaryActionHref"
              value={primaryActionHref}
              onChange={setPrimaryActionHref}
              placeholder="e.g. /apply"
            />
            <FormField
              label="Secondary Action Label"
              name="secondaryActionLabel"
              value={secondaryActionLabel}
              onChange={setSecondaryActionLabel}
              placeholder="e.g. Download Brochure"
            />
            <FormField
              label="Secondary Action URL"
              name="secondaryActionHref"
              value={secondaryActionHref}
              onChange={setSecondaryActionHref}
              placeholder="e.g. /brochure.pdf"
            />
          </div>
        </div>
      </div>
    );
  }

  function renderCourses() {
    return (
      <div className={CARD}>
        <h3 className="text-sm font-semibold text-foreground-strong uppercase tracking-wider mb-5">
          Courses
        </h3>
        <ObjectList
          label="Courses"
          fields={[
            { key: "name", label: "Course Name", placeholder: "e.g. B.Tech" },
            { key: "fees", label: "Fees", placeholder: "e.g. 2,00,000/year" },
            {
              key: "duration",
              label: "Duration",
              placeholder: "e.g. 4 years",
            },
            {
              key: "studyMode",
              label: "Study Mode",
              type: "select",
              options: STUDY_MODE_OPTIONS,
              placeholder: "Select mode...",
            },
            {
              key: "eligibility",
              label: "Eligibility",
              type: "textarea",
              placeholder: "Eligibility criteria",
            },
            {
              key: "coursesOffered",
              label: "Courses Offered (comma-separated)",
              placeholder: "CSE, ECE, ME, CE",
            },
            {
              key: "brochureUrl",
              label: "Brochure URL",
              placeholder: "https://...",
            },
            {
              key: "expertsUrl",
              label: "Experts URL",
              placeholder: "https://...",
            },
          ]}
          values={courses}
          onChange={setCourses}
        />
      </div>
    );
  }

  function renderAdmission() {
    return (
      <div className={CARD}>
        <h3 className="text-sm font-semibold text-foreground-strong uppercase tracking-wider mb-5">
          Admission
        </h3>
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Title"
              name="admissionTitle"
              value={admissionTitle}
              onChange={setAdmissionTitle}
              placeholder="e.g. Admission Process"
            />
            <FormField
              label="Subtitle"
              name="admissionSubtitle"
              value={admissionSubtitle}
              onChange={setAdmissionSubtitle}
              placeholder="e.g. Follow these steps to apply"
            />
          </div>

          <ObjectList
            label="Admission Steps"
            fields={[
              {
                key: "title",
                label: "Step Title",
                placeholder: "e.g. Register Online",
              },
              {
                key: "description",
                label: "Description",
                type: "textarea",
                placeholder: "Describe this step...",
              },
              {
                key: "highlight",
                label: "Highlight (true/false)",
                placeholder: "true or leave empty",
              },
            ]}
            values={admissionSteps}
            onChange={setAdmissionSteps}
          />
        </div>
      </div>
    );
  }

  function renderRecruiters() {
    return (
      <div className={CARD}>
        <h3 className="text-sm font-semibold text-foreground-strong uppercase tracking-wider mb-5">
          Recruiters & Placements
        </h3>
        <div className="space-y-6">
          <FormField
            label="Section Title"
            name="recruitersTitle"
            value={recruitersTitle}
            onChange={setRecruitersTitle}
            placeholder="e.g. Top Recruiters"
          />

          <StringList
            label="Recruiter Logos (URLs)"
            values={recruitersLogos}
            onChange={setRecruitersLogos}
            placeholder="https://logo-url.png"
          />

          <StringList
            label="Cutoff Details"
            values={recruitersCutoff}
            onChange={setRecruitersCutoff}
            placeholder="e.g. JEE Advanced Rank < 500"
          />

          <KeyValueList
            label="Placement Statistics"
            values={recruitersPlacements}
            onChange={setRecruitersPlacements}
            keyPlaceholder="e.g. Highest Package"
            valuePlaceholder="e.g. 2.1 Cr"
          />
        </div>
      </div>
    );
  }

  function renderReviewsFaqs() {
    return (
      <div className="space-y-6">
        <div className={CARD}>
          <h3 className="text-sm font-semibold text-foreground-strong uppercase tracking-wider mb-5">
            Reviews
          </h3>
          <ObjectList
            label="Student Reviews"
            fields={[
              {
                key: "quote",
                label: "Quote",
                type: "textarea",
                placeholder: "What the student said...",
              },
              { key: "name", label: "Name", placeholder: "Student name" },
              {
                key: "role",
                label: "Role",
                placeholder: "e.g. B.Tech CSE, 2024",
              },
              {
                key: "rating",
                label: "Rating (1-5)",
                type: "number",
                placeholder: "e.g. 4.5",
              },
            ]}
            values={reviews}
            onChange={setReviews}
          />
        </div>

        <div className={CARD}>
          <h3 className="text-sm font-semibold text-foreground-strong uppercase tracking-wider mb-5">
            FAQs
          </h3>
          <ObjectList
            label="Frequently Asked Questions"
            fields={[
              {
                key: "question",
                label: "Question",
                placeholder: "e.g. What is the admission process?",
              },
              {
                key: "answer",
                label: "Answer",
                type: "textarea",
                placeholder: "Detailed answer...",
              },
            ]}
            values={faqs}
            onChange={setFaqs}
          />
        </div>
      </div>
    );
  }

  function renderSeo() {
    return (
      <div className={CARD}>
        <h3 className="text-sm font-semibold text-foreground-strong uppercase tracking-wider mb-5">
          SEO & Meta
        </h3>
        <div className="space-y-5">
          <FormField
            label="Meta Title"
            name="metaTitle"
            value={metaTitle}
            onChange={setMetaTitle}
            placeholder="Page title for search engines"
            hint={`${metaTitle.length}/60 characters recommended`}
          />
          <FormField
            label="Meta Description"
            name="metaDescription"
            value={metaDescription}
            onChange={setMetaDescription}
            type="textarea"
            rows={3}
            placeholder="Brief description for search engine results"
            hint={`${metaDescription.length}/160 characters recommended`}
          />
          <ToggleSwitch
            label="Published"
            checked={published}
            onChange={setPublished}
            description="When enabled, this college page will be visible to users."
          />
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(published);
      }}
      className="space-y-6"
    >
      <TabNav tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "basic" && renderBasicInfo()}
      {activeTab === "hero" && renderHero()}
      {activeTab === "courses" && renderCourses()}
      {activeTab === "admission" && renderAdmission()}
      {activeTab === "recruiters" && renderRecruiters()}
      {activeTab === "reviews" && renderReviewsFaqs()}
      {activeTab === "seo" && renderSeo()}

      {/* Footer — always visible */}
      <div
        className={cn(
          "radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft px-6 py-4",
          "flex items-center justify-end gap-3"
        )}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={() => handleSubmit(false)}
        >
          {isLoading ? "Saving..." : "Save as Draft"}
        </Button>
        <Button
          type="button"
          variant="accent"
          size="sm"
          disabled={isLoading}
          onClick={() => handleSubmit(true)}
        >
          {isLoading ? "Publishing..." : "Publish"}
        </Button>
      </div>
    </form>
  );
}
