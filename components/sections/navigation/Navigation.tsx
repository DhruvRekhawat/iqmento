"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { useAuth } from "@/lib/auth";

const NAV_ITEMS: { label: string; href: string }[] = [
    { label: "Home", href: "/" }, // ✅ ADDED
  { label: "Colleges", href: "/colleges" },
  { label: "Alumni", href: "/alumni" },
  { label: "About Us", href: "/about-us" },
  { label: "FAQ", href: "/faq" },
  { label: "Become a Mentor", href: "#cta" },
];

export function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const dashboardPath = React.useMemo(() => {
    if (!user) return "/dashboard/student";
    if (user.role === "EDUCATOR") return "/dashboard/educator";
    if (user.role === "ADMIN") return "/admin";
    return "/dashboard/student";
  }, [user]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 w-full bg-black/95 text-white backdrop-blur-xl">
      <Container bleed>
        <nav className="flex items-center justify-between py-4 px-4 md:px-8 lg:px-12">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="IQMento logo"
              width={134}
              height={28}
              priority
              className="h-7 w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-3 backdrop-blur-lg">
            <ul className="flex items-center gap-10 text-sm font-ui">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-accent-lime transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button asChild variant="accent">
                <Link href={dashboardPath}>Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="glass"
                  className="hidden md:inline-flex"
                >
                  <Link href="/login">Sign In</Link>
                </Button>

                <Button asChild variant="accent">
                  <Link href="/register">Join Now</Link>
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-md border border-white/20"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden px-4 pb-4">
            <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg">
              
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-sm hover:text-accent-lime"
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
                {isAuthenticated ? (
                  <Link
                    href={dashboardPath}
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-semibold"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="text-sm"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-semibold"
                    >
                      Join Now
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}