import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <div>
      <div className="h-4 bg-gradient-to-r from-[#0eb4b2] to-[#10467b]"></div>
      <div className="bg-gray-800">
        <div className="container mx-auto text-white py-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:gap-4 lg:flex-row lg:justify-between lg:gap-4 items-center">
            <Link href="/" className="flex items-center mb-4 sm:mb-0 lg:mb-0">
              <Image
                src="/assets/xterium_logo-01.png"
                alt="Xterium Logo"
                width={150}
                height={40}
                className="h-10 mr-3"
              />
            </Link>
            <ul className="flex flex-col items-center sm:flex-row sm:items-center gap-1 sm:gap-4 lg:flex-row lg:items-center lg:gap-4  text-slate-400 text-sm">
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-gray-200"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-gray-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-gray-200">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <nav className="bg-black">
        <div className="container py-4 mx-auto flex flex-col sm:flex-row lg:flex-row justify-between items-center">
          <p className="footer-left text-white text-xs text-slate-400">
            © 2024 Xterium UI. All rights reserved.
          </p>
          <p className="text-xs text-white mt-2 lg:mt-0">v1.0.0</p>
        </div>
      </nav>
    </div>
  );
}
