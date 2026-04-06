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

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AlumniFormProps {
  initialData?: {
    id?: string;
    slug: string;
    name: string;
    headline?: string;
    bio?: string;
    course?: string;
    graduationYear?: number;
    currentCompany?: string;
    currentJobRole?: string;
    jobLocation?: string;
    location?: string;
    mobileNumber?: string;
    mail?: string;
    profileImageUrl?: string;
    heroImageUrl?: string;
    isBookable?: boolean;
    isFeatured?: boolean;
    heroTagline?: string;
    heroSummary?: string[];
    overview?: string[];
    availability?: string;
    stats?: { label: string; value: string }[];
    focusAreas?: { title: string; description: string }[];
    sessions?: {
      title: string;
      description: string;
      duration: string;
      format: string;
      price: string;
    }[];
    highlights?: string[];
    resources?: { label: string; href: string }[];
    reviews?: {
      quote: string;
      name: string;
      role: string;
      rating?: number;
    }[];
    featuredQuote?: string;
    bookingUrl?: string;
    questionUrl?: string;
    published?: boolean;
    collegeId?: string;
  };
  colleges: { id: string; name: string }[];
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  isLoading?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "content", label: "Content" },
  { key: "sessions", label: "Sessions" },
  { key: "reviews", label: "Reviews & Links" },
];

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const SESSION_FIELDS = [
  { key: "title", label: "Title", placeholder: "e.g. Career Strategy Call" },
  {
    key: "description",
    label: "Description",
    type: "textarea" as const,
    placeholder: "What the session covers...",
  },
  { key: "duration", label: "Duration", placeholder: "e.g. 45 min" },
  {
    key: "format",
    label: "Format",
    type: "select" as const,
    placeholder: "Select format",
    options: [
      { label: "1-on-1", value: "1-on-1" },
      { label: "Group", value: "Group" },
      { label: "Workshop", value: "Workshop" },
    ],
  },
  { key: "price", label: "Price", placeholder: "e.g. ₹999" },
];

const REVIEW_FIELDS = [
  {
    key: "quote",
    label: "Quote",
    type: "textarea" as const,
    placeholder: "What the reviewer said...",
  },
  { key: "name", label: "Name", placeholder: "Reviewer name" },
  { key: "role", label: "Role", placeholder: "e.g. Student, IIM-A '24" },
  {
    key: "rating",
    label: "Rating",
    type: "number" as const,
    placeholder: "1-5",
  },
];

const RESOURCE_FIELDS = [
  { key: "label", label: "Label", placeholder: "e.g. LinkedIn" },
  { key: "href", label: "URL", placeholder: "https://..." },
];

const FOCUS_AREA_FIELDS = [
  { key: "title", label: "Title", placeholder: "e.g. Product Management" },
  {
    key: "description",
    label: "Description",
    type: "textarea" as const,
    placeholder: "Brief description of this focus area...",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AlumniForm({
  initialData,
  colleges,
  onSubmit,
  isLoading = false,
}: AlumniFormProps) {
  const isEdit = Boolean(initialData?.id);

  /* --- tab state --- */
  const [activeTab, setActiveTab] = React.useState("profile");

  /* --- slug tracking --- */
  const [slugManual, setSlugManual] = React.useState(false);

  /* --- form state --- */
  const [form, setForm] = React.useState(() => ({
    name: initialData?.name ?? "",
    slug: initialData?.slug ?? "",
    headline: initialData?.headline ?? "",
    bio: initialData?.bio ?? "",
    course: initialData?.course ?? "",
    graduationYear: initialData?.graduationYear?.toString() ?? "",
    currentCompany: initialData?.currentCompany ?? "",
    currentJobRole: initialData?.currentJobRole ?? "",
    location: initialData?.location ?? "",
    jobLocation: initialData?.jobLocation ?? "",
    mobileNumber: initialData?.mobileNumber ?? "",
    mail: initialData?.mail ?? "",
    collegeId: initialData?.collegeId ?? "",
    profileImageUrl: initialData?.profileImageUrl ?? "",
    heroImageUrl: initialData?.heroImageUrl ?? "",
    isBookable: initialData?.isBookable ?? false,
    isFeatured: initialData?.isFeatured ?? false,
    heroTagline: initialData?.heroTagline ?? "",
    heroSummary: initialData?.heroSummary ?? [],
    overview: initialData?.overview ?? [],
    availability: initialData?.availability ?? "",
    stats: initialData?.stats ?? [],
    focusAreas: (initialData?.focusAreas ?? []) as Record<string, string>[],
    sessions: (initialData?.sessions ?? []) as Record<string, string>[],
    highlights: initialData?.highlights ?? [],
    resources: (initialData?.resources ?? []) as Record<string, string>[],
    reviews: (initialData?.reviews ?? []).map((r) => ({
      ...r,
      rating: r.rating?.toString() ?? "",
    })) as Record<string, string>[],
    featuredQuote: initialData?.featuredQuote ?? "",
    bookingUrl: initialData?.bookingUrl ?? "",
    questionUrl: initialData?.questionUrl ?? "",
    published: initialData?.published ?? false,
  }));

  /* --- errors --- */
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  /* --- field helpers --- */
  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
    }
  }

  function setField(key: string) {
    return (value: string) => {
      set(key as keyof typeof form, value as never);
    };
  }

  /* --- auto-slug from name --- */
  function handleNameChange(value: string) {
    set("name", value);
    if (!slugManual) {
      set("slug", toSlug(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugManual(true);
    set("slug", value);
  }

  /* --- validation --- */
  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.slug.trim()) next.slug = "Slug is required";
    setErrors(next);
    if (Object.keys(next).length > 0) setActiveTab("profile");
    return Object.keys(next).length === 0;
  }

  /* --- submit --- */
  async function handleSubmit(published: boolean) {
    if (!validate()) return;

    const payload: Record<string, unknown> = {
      ...form,
      published,
      graduationYear: form.graduationYear
        ? parseInt(form.graduationYear, 10)
        : null,
      reviews: form.reviews.map((r) => ({
        ...r,
        rating: r.rating ? parseInt(r.rating, 10) : undefined,
      })),
    };

    if (initialData?.id) payload.id = initialData.id;

    await onSubmit(payload);
  }

  /* ---------------------------------------------------------------- */
  /*  Tab: Profile                                                     */
  /* ---------------------------------------------------------------- */

  function renderProfile() {
    const collegeOptions = colleges.map((c) => ({
      label: c.name,
      value: c.id,
    }));

    return (
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleNameChange}
            placeholder="Full name"
            required
            error={errors.name}
          />
          <FormField
            label="Slug"
            name="slug"
            value={form.slug}
            onChange={handleSlugChange}
            placeholder="auto-generated-from-name"
            required
            error={errors.slug}
            hint={
              slugManual
                ? "Manually edited. Clear to re-enable auto-generation."
                : "Auto-generated from name"
            }
          />
        </div>

        <FormField
          label="Headline"
          name="headline"
          value={form.headline}
          onChange={setField("headline")}
          placeholder="e.g. Product Manager at Google"
        />

        <FormField
          label="Bio"
          name="bio"
          value={form.bio}
          onChange={setField("bio")}
          type="textarea"
          placeholder="Short biography..."
          rows={4}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Course"
            name="course"
            value={form.course}
            onChange={setField("course")}
            placeholder="e.g. B.Tech CSE"
          />
          <FormField
            label="Graduation Year"
            name="graduationYear"
            value={form.graduationYear}
            onChange={setField("graduationYear")}
            type="number"
            placeholder="e.g. 2022"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Current Company"
            name="currentCompany"
            value={form.currentCompany}
            onChange={setField("currentCompany")}
            placeholder="e.g. Google"
          />
          <FormField
            label="Current Job Role"
            name="currentJobRole"
            value={form.currentJobRole}
            onChange={setField("currentJobRole")}
            placeholder="e.g. Senior PM"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Location"
            name="location"
            value={form.location}
            onChange={setField("location")}
            placeholder="e.g. Bangalore, India"
          />
          <FormField
            label="Job Location"
            name="jobLocation"
            value={form.jobLocation}
            onChange={setField("jobLocation")}
            placeholder="e.g. Remote / Bangalore"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Mobile Number"
            name="mobileNumber"
            value={form.mobileNumber}
            onChange={setField("mobileNumber")}
            placeholder="+91 98765 43210"
          />
          <FormField
            label="Email"
            name="mail"
            value={form.mail}
            onChange={setField("mail")}
            type="email"
            placeholder="alumni@example.com"
          />
        </div>

        <FormField
          label="College"
          name="collegeId"
          value={form.collegeId}
          onChange={setField("collegeId")}
          type="select"
          options={collegeOptions}
          placeholder="Select college..."
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <ImageUpload
            label="Profile Image"
            value={form.profileImageUrl}
            onChange={(url) => set("profileImageUrl", url)}
            folder="alumni"
          />
          <ImageUpload
            label="Hero Image"
            value={form.heroImageUrl}
            onChange={(url) => set("heroImageUrl", url)}
            folder="alumni"
          />
        </div>

        <div className="flex flex-wrap gap-8 pt-2">
          <ToggleSwitch
            label="Bookable"
            checked={form.isBookable}
            onChange={(v) => set("isBookable", v)}
            description="Allow students to book sessions with this alumni"
          />
          <ToggleSwitch
            label="Featured"
            checked={form.isFeatured}
            onChange={(v) => set("isFeatured", v)}
            description="Show on homepage and featured sections"
          />
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Tab: Content                                                     */
  /* ---------------------------------------------------------------- */

  function renderContent() {
    return (
      <div className="space-y-6">
        <FormField
          label="Hero Tagline"
          name="heroTagline"
          value={form.heroTagline}
          onChange={setField("heroTagline")}
          type="textarea"
          placeholder="A compelling one-liner for the hero section..."
          rows={2}
        />

        <StringList
          label="Hero Summary"
          values={form.heroSummary}
          onChange={(v) => set("heroSummary", v)}
          placeholder="Summary point..."
          multiline
        />

        <StringList
          label="Overview"
          values={form.overview}
          onChange={(v) => set("overview", v)}
          placeholder="Overview paragraph..."
          multiline
        />

        <KeyValueList
          label="Stats"
          values={form.stats}
          onChange={(v) => set("stats", v)}
          keyPlaceholder="Label (e.g. Students Mentored)"
          valuePlaceholder="Value (e.g. 200+)"
        />

        <ObjectList
          label="Focus Areas"
          fields={FOCUS_AREA_FIELDS}
          values={form.focusAreas}
          onChange={(v) => set("focusAreas", v)}
        />

        <StringList
          label="Highlights"
          values={form.highlights}
          onChange={(v) => set("highlights", v)}
          placeholder="Achievement or highlight..."
        />

        <FormField
          label="Featured Quote"
          name="featuredQuote"
          value={form.featuredQuote}
          onChange={setField("featuredQuote")}
          type="textarea"
          placeholder="A standout quote from this alumni..."
          rows={3}
        />

        <FormField
          label="Availability"
          name="availability"
          value={form.availability}
          onChange={setField("availability")}
          placeholder="e.g. Weekends, 2 slots/week"
        />
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Tab: Sessions                                                    */
  /* ---------------------------------------------------------------- */

  function renderSessions() {
    return (
      <div className="space-y-6">
        <ObjectList
          label="Sessions"
          fields={SESSION_FIELDS}
          values={form.sessions}
          onChange={(v) => set("sessions", v)}
        />
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Tab: Reviews & Links                                             */
  /* ---------------------------------------------------------------- */

  function renderReviews() {
    return (
      <div className="space-y-6">
        <ObjectList
          label="Reviews"
          fields={REVIEW_FIELDS}
          values={form.reviews}
          onChange={(v) => set("reviews", v)}
        />

        <ObjectList
          label="Resources"
          fields={RESOURCE_FIELDS}
          values={form.resources}
          onChange={(v) => set("resources", v)}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            label="Booking URL"
            name="bookingUrl"
            value={form.bookingUrl}
            onChange={setField("bookingUrl")}
            type="url"
            placeholder="https://calendly.com/..."
          />
          <FormField
            label="Question URL"
            name="questionUrl"
            value={form.questionUrl}
            onChange={setField("questionUrl")}
            type="url"
            placeholder="https://forms.google.com/..."
          />
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  const tabContent: Record<string, () => React.ReactNode> = {
    profile: renderProfile,
    content: renderContent,
    sessions: renderSessions,
    reviews: renderReviews,
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(true);
      }}
      className="space-y-6"
    >
      <div className="radius-lg bg-surface-strong border border-[rgba(16,19,34,0.12)] shadow-soft p-6">
        <TabNav tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        {tabContent[activeTab]?.()}
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          size="md"
          disabled={isLoading}
          onClick={() => handleSubmit(false)}
        >
          {isLoading ? "Saving..." : "Save as Draft"}
        </Button>
        <Button
          type="submit"
          variant="accent"
          size="md"
          disabled={isLoading}
        >
          {isLoading
            ? "Publishing..."
            : isEdit
              ? "Update & Publish"
              : "Publish"}
        </Button>
      </div>
    </form>
  );
}
