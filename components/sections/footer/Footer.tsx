import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/shared/container";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Special Offers", href: "#roadmap" },
  { label: "Blog", href: "#testimonials" },
  { label: "About Us", href: "#audience" },
  { label: "Payment & Delivery", href: "#features" },
  { label: "Contacts", href: "#footer" },
];

export function Footer() {
  return (
    <footer id="footer" className="bg-[#060807] pb-14 pt-20 text-[#d6dcd7] sm:pb-20 sm:pt-24">
      <Container className="flex flex-col gap-20">
        <div className="flex flex-col gap-16 lg:flex-row lg:justify-between">
          
          {/* LEFT SECTION */}
          <div className="flex flex-col gap-6">
            <Link href="#hero" className="text-[2.6rem] font-semibold tracking-[-0.03em] text-white">
              Catalog<span className="ml-2 text-[#aab5ad]">↗</span>
            </Link>

            <nav className="flex flex-wrap items-center gap-3 text-base font-medium text-[#aab5ad]">
              {NAV_LINKS.map((item, index) => (
                <span key={item.label} className="flex items-center gap-3">
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                  {index !== NAV_LINKS.length - 1 && (
                    <span className="text-[#4a544e]">/</span>
                  )}
                </span>
              ))}
            </nav>
          </div>

          {/* RIGHT SECTION */}
          <section className="grid gap-10 text-sm font-medium text-[#c2ccc6] sm:grid-cols-2 lg:grid-cols-4 lg:text-base">
            
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-[#aab5ad]">
                Contact Us
              </p>
              <Link href="tel:+18919891191" className="text-xl font-semibold tracking-[-0.02em] text-white">
                +1 891 989-11-91
              </Link>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-[#aab5ad]">
                Location
              </p>
              <p>2972 Westheimer Rd. Santa Ana, Illinois 85486</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-[#aab5ad]">
                Email
              </p>
              <Link href="mailto:hello@iqmento.com" className="transition-colors hover:text-white">
                hello@iqmento.com
              </Link>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.28em] text-[#aab5ad]">
                Mo—Fr
              </p>
              <p className="text-2xl font-semibold text-white">9am—6pm</p>
            </div>
          </section>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col gap-12">
          <p className="text-sm text-[#aab5ad]">
            © {new Date().getFullYear()} — Copyright
          </p>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            
            <Link
              href="#hero"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#1f221f] text-white transition-colors hover:border-white"
            >
              ↑
            </Link>

            <div className="relative flex w-full max-w-[1060px] items-center overflow-hidden rounded-[24px]">
              <Image
                src="/footer/explore_our_success.svg"
                alt="Explore our success"
                width={1060}
                height={180}
                className="h-full w-full object-cover"
              />

             <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6 md:px-10 pt-2 sm:pt-0">
                
             <div className="flex flex-col gap-0 text-left text-white leading-tight">
               <span className="text-sm sm:text-base font-medium tracking-[-0.01em]">
                    Explore
                  </span>
                <span className="text-sm sm:text-base font-medium tracking-[-0.01em]">
                    our success
                  </span>
                </div>

                <div className="flex h-full items-center">
                  <span className="mx-12 hidden h-12 w-px bg-white/20 sm:block" />
                  <span className="text-2xl text-white">↗</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </footer>
  );
}