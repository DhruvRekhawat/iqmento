import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/shared/container";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "How It Works", href: "#roadmap" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "About Us", href: "#audience" },
  { label: "Mentors", href: "#alumni" },
  { label: "Contact", href: "#footer" },
];

export function Footer() {
  return (
    <footer
      id="footer"
      className="bg-[#191c19] py-16 text-[#ECEEEC] sm:py-24"
    >
      <Container>
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-16 lg:flex-row lg:justify-between">
            <div className="flex max-w-xl flex-col gap-8">
              <Link href="#hero" className="flex items-center gap-3">
                <Image
                  src="/logo.svg"
                  alt="IQMento"
                  width={140}
                  height={30}
                  className="h-8 w-auto invert"
                />
              </Link>

              <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#adb3ab]">
                {NAV_LINKS.map((item, index) => (
                  <span key={item.label} className="flex items-center gap-3">
                    <Link
                      href={item.href}
                      className="transition-colors duration-200 hover:text-white"
                    >
                      {item.label}
                    </Link>
                    {index !== NAV_LINKS.length - 1 && (
                      <span className="text-[#3c403c]">/</span>
                    )}
                  </span>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-12 text-sm text-[#adb3ab] lg:min-w-[420px]">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#3c403c]">
                  Contact Us
                </p>
                <Link
                  href="tel:+18919891191"
                  className="flex items-center gap-2 text-2xl font-semibold tracking-[-0.02em] text-white"
                >
                  <span className="text-[#3c403c]">(</span>+1 891 989-11-91
                  <span className="text-[#3c403c]">)</span>
                </Link>
              </div>

              <div className="grid gap-10 sm:grid-cols-2">
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#3c403c]">
                    Location
                  </p>
                  <p className="max-w-[220px] leading-relaxed">
                    2972 Westheimer Rd. Santa Ana,
                    <br />
                    Illinois 85486
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#3c403c]">
                    Email
                  </p>
                  <Link
                    href="mailto:hello@iqmento.com"
                    className="leading-relaxed hover:text-white"
                  >
                    hello@iqmento.com
                  </Link>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#3c403c]">
                  Hours
                </p>
                <p className="text-lg font-semibold tracking-[-0.02em] text-white">
                  Monday – Friday
                </p>
                <p>9:00 AM – 6:00 PM IST</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <Link
              href="#hero"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#3c403c] text-[#adb3ab] transition-colors duration-200 hover:border-white hover:text-white"
            >
              ↑
            </Link>
            <p className="text-sm text-[#3c403c]">© {new Date().getFullYear()} IQMento. All rights reserved.</p>
            <div className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#262926]/70 shadow-soft sm:flex-row">
              <div className="flex items-center px-10 py-6">
                <p className="text-xl font-semibold leading-snug tracking-[-0.02em] text-[#d1d5db]">
                  Explore
                  <br />
                  our success
                </p>
              </div>
              <div className="relative h-40 w-44 sm:h-36">
                <Image
                  src="/footer/explore_our_success.svg"
                  alt="Explore our success"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

