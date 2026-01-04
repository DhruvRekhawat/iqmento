"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, GraduationCap, Building2 } from "lucide-react";

interface SearchResult {
  id: string;
  slug: string;
  name: string;
  type: "college" | "alumni";
  location?: string;
  image?: string;
  subtitle?: string;
}

interface SearchBarProps {
  placeholder?: string;
  colleges?: Array<{
    slug: string;
    name: string;
    location: string;
    heroImage?: string | null;
  }>;
  alumni?: Array<{
    slug: string;
    name: string;
    location?: string;
    headline?: string;
    image?: string;
  }>;
  className?: string;
}

export function SearchBar({
  placeholder = "Search by College, City, or Course",
  colleges = [],
  alumni = [],
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Combine and transform data for search
  const allItems: SearchResult[] = useMemo(
    () => [
      ...colleges.map((college) => ({
        id: `college-${college.slug}`,
        slug: college.slug,
        name: college.name,
        type: "college" as const,
        location: college.location,
        image: college.heroImage || undefined,
      })),
      ...alumni.map((alum) => ({
        id: `alumni-${alum.slug}`,
        slug: alum.slug,
        name: alum.name,
        type: "alumni" as const,
        location: alum.location,
        subtitle: alum.headline,
        image: alum.image,
      })),
    ],
    [colleges, alumni]
  );

  // Filter results based on query using useMemo
  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const filtered = allItems.filter((item) => {
      // Ensure we have valid strings to search
      const name = (item.name || "").toLowerCase();
      const location = (item.location || "").toLowerCase();
      const subtitle = (item.subtitle || "").toLowerCase();
      
      const nameMatch = name.includes(searchTerm);
      const locationMatch = location.includes(searchTerm);
      const subtitleMatch = subtitle.includes(searchTerm);
      
      return nameMatch || locationMatch || subtitleMatch;
    });

    return filtered.slice(0, 8); // Limit to 8 results
  }, [query, allItems]);

  // Update isOpen based on results
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(results.length > 0 && query.trim().length > 0);
    setFocusedIndex(-1);
  }, [results, query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Only handle navigation keys when dropdown is open and has results
    if (isOpen && results.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
          return;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          return;
        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0 && results[focusedIndex]) {
            const result = results[focusedIndex];
            window.location.href = `/${result.type === "college" ? "colleges" : "alumini"}/${result.slug}`;
          }
          return;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setQuery("");
          return;
      }
    }
    // For Escape key, always close dropdown even if no results
    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery("");
  };

  const getResultHref = (result: SearchResult) => {
    return `/${result.type === "college" ? "colleges" : "alumini"}/${result.slug}`;
  };

  // Determine if custom styling is provided
  const hasCustomStyling = className.includes("border") || className.includes("bg-white/70");
  const defaultFormClass = "group flex w-full items-center gap-3 rounded-full bg-white/95 px-6 py-4 text-left shadow-[0_28px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl";
  // Ensure custom className includes flex layout
  const formClass = hasCustomStyling 
    ? `${className} flex items-center` 
    : defaultFormClass;

  return (
    <div ref={searchRef} className="relative z-20 w-full">
      <form
        className={`${formClass} pointer-events-auto`}
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (results.length > 0 && focusedIndex >= 0) {
            const result = results[focusedIndex];
            window.location.href = getResultHref(result);
          }
        }}
        onClick={(e) => {
          // Ensure clicks on the form focus the input
          if (inputRef.current && e.target !== inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        <Search className={`h-5 w-5 shrink-0 pointer-events-none ${hasCustomStyling ? "text-[#A5A9C6] transition group-focus-within:text-[#6260FF]" : "text-[#9ca3af]"}`} />
        <input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={query}
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            // Open dropdown when user starts typing
            if (e.target.value.trim()) {
              setIsOpen(true);
            }
          }}
          onFocus={() => {
            // Open dropdown if there are results or if user has typed something
            if (results.length > 0 || query.trim()) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          className={`flex-1 bg-transparent pointer-events-auto border-0 outline-none ${hasCustomStyling ? "h-6 w-full text-base text-[#3A3D52] placeholder:text-[#9EA1B9]" : "text-sm text-[#404957] placeholder:text-[#9ca3af]"} focus-visible:outline-none`}
        />
      </form>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full z-[100] mt-2 w-full rounded-2xl border border-[#e5e7ef] bg-white shadow-[0_28px_70px_rgba(0,0,0,0.35)]">
          <div className="max-h-[400px] overflow-y-auto p-2">
            {results.map((result, index) => (
              <Link
                key={result.id}
                href={getResultHref(result)}
                onClick={() => handleResultClick(result)}
                className={`group flex items-center gap-4 rounded-xl px-4 py-3 transition-colors ${
                  index === focusedIndex
                    ? "bg-[#edeaff] text-[#2f23a8]"
                    : "hover:bg-[#f5f5f5] text-[#11121b]"
                }`}
              >
                {/* Image/Icon */}
                <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-[#f0f0f0]">
                  {result.type === "college" ? (
                    // Colleges: Always show icon, never show image
                    <div className="flex h-full w-full items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-[#9ca3af]" />
                    </div>
                  ) : (
                    // Alumni: Show image if available, otherwise show icon
                    result.image ? (
                      <Image
                        src={result.image}
                        alt={result.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Building2 className="h-6 w-6 text-[#9ca3af]" />
                      </div>
                    )
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {result.type === "alumni" ? (
                    // Alumni: Description first, then name + tag, then location
                    <>

                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold truncate">{result.name}</h3>
                        <span className="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium bg-[#e0f2fe] text-[#0369a1]">
                          Alumni
                        </span>
                      </div>
                      {result.subtitle && (
                        <p className="text-xs text-[#5b5f72] truncate mb-1 text-start">{result.subtitle}</p>
                      )}
                      {result.location && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-[#9ca3af]">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{result.location}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    // College: Name + tag, then location
                    <>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold truncate">{result.name}</h3>
                        <span className="flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium bg-[#edeaff] text-[#4f39f6]">
                          College
                        </span>
                      </div>
                      {result.location && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-[#9ca3af]">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{result.location}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute top-full z-[100] mt-2 w-full rounded-2xl border border-[#e5e7ef] bg-white p-6 text-center shadow-[0_28px_70px_rgba(0,0,0,0.35)]">
          <p className="text-sm text-[#5b5f72]">No results found for &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}

