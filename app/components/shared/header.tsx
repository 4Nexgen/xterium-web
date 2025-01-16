import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <nav
      style={{ backgroundImage: "url('/assets/xterium_bg-06.png')" }}
      className="bg-no-repeat h-[168px] bg-contain relative"
    >
      <div className="container mx-auto flex justify-between items-center py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/XTERUIM_logo-02.png"
            alt="Xterium Logo"
            width={80}
            height={80}
            className="absolute left-12 top-1/5 transform -translate-y-1/ sm:left-10 sm:top-1/3 md:left-12 md:top-1/4 lg:left-16 lg:top-1/4"
          />
        </Link>
        <a
          href="https://chromewebstore.google.com/detail/xterium/klfhdmiebenifpdmdmkjicdohjilabdg"
          className="text-theme-default border-2 border-theme-default py-2 px-4 rounded-full text-xs font-bold uppercase flex items-center gap-2 -ml-2 mt-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
          Download
        </a>
      </div>
    </nav>
  );
}
