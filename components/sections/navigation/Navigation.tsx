import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Colleges", href: "/colleges" },
  { label: "Alumini", href: "/alumini" },
  { label: "About Us", href: "/about-us" },
  { label: "FAQ", href: "#faq" },
  { label: "Become a Mentor", href: "#cta" },
];

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 w-full bg-black/95 text-white backdrop-blur-xl">
      <Container bleed>
        <nav className="flex items-center justify-between gap-8 py-4 pl-6 pr-4 md:px-12">
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

          <div className="hidden items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-3 backdrop-blur-lg lg:flex">
            <ul className="flex items-center gap-12 text-sm font-ui tracking-[-0.03em]">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition-colors duration-200 hover:text-accent-lime"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="glass"
              size="md"
              className="hidden border-white/20 px-6 text-sm text-white/90 hover:text-white md:inline-flex"
            >
              <Link href="#cta">Sign In</Link>
            </Button>
            <Button
              asChild
              variant="accent"
              size="md"
              className="px-7 text-sm font-semibold text-white"
            >
              <Link href="#cta">Join Now</Link>
            </Button>
          </div>
        </nav>
      </Container>
    </header>
  );
}

