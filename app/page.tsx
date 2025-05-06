import React from "react";
import WalletCreationSteps from "./components/shared/createWallet";
import ImportWalletSteps from "./components/shared/importWallet";
import TransferingTokenSteps from "./components/shared/transferringToken";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="relative h-screen flex flex-col justify-end">
        <div
          className="h-[500px]"
          style={{
            backgroundImage: "url('/assets/layered-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "top",
          }}
        >
          <div className="z-20 container mx-auto text-center flex flex-col justify-center items-center pt-16 h-full">
            <h1 className="text-[2em] md:text-[4em] leading-tight mb-6 text-white unbounded">
              Your Gateway to <span className="text-[#50e8e3]">Blockchain</span>
            </h1>

            <div className="text-center mt-8 flex justify-center unbounded px-4 text-xs md:text-md">
              <h2 className="text-white max-w-[900px]">
                Secure, seamless, and powerful. The Xterium Wallet Extension is
                your trusted companion for managing digital assets and
                interacting with Blockchain--right from your browser.
              </h2>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center md:gap-4 mt-10 w-full">
              <a
                href="https://chromewebstore.google.com/detail/xterium/klfhdmiebenifpdmdmkjicdohjilabdg"
                className="text-white text-left py-6 px-8 text-sm rounded-full uppercase bg-contain bg-no-repeat bg-center unbounded w-[300px]"
                style={{
                  backgroundImage: "url('/assets/button-bg-1.png')",
                }}
              >
                Download for Chrome
              </a>
              <Link
                href="#get-started-section"
                className="text-white text-left py-6 px-8 text-sm rounded-full uppercase bg-contain bg-no-repeat bg-center unbounded w-[300px]"
                style={{
                  backgroundImage: "url('/assets/button-bg-2.png')",
                }}
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section
        className="py-4 md:py-16 bg-no-repeat bg-cover h-[500px] mt-10 relative"
        style={{
          backgroundImage: "url('/assets/layered-bg-white.png')",
          backgroundPosition: "top",
        }}
      >
        <img
          src="/assets/phone.png"
          alt=""
          className="absolute right-0 bottom-0 h-[400px] hidden md:block"
        />
        <div className="container md:mx-4 z-10 absolute">
          <div className="flex flex-col md:flex-row gap-4">
            <h3 className="flex-1 text-white text-lg mb-8 mx-4 uppercase unbounded">
              Why Choose{" "}
              <span className="text-[#07bab4] text-3xl">Xterium</span> Wallet?
            </h3>
            <ul className="w-full md:w-[500px]">
              <li className="p-2 md:p-4 flex items-center gap-4 unbounded justify-end md:justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#136867"
                  className="w-10 h-10 mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
                <h4 className="mb-2 w-fit py-2 text-[#124e54]">
                  Secure Key Storage
                </h4>
                {/* <p className="text-sm opacity-80">
                  Your private keys are encrypted and stored securely, giving
                  you full control of your assets.
                </p> */}
              </li>
              <li className="p-2 md:p-4 flex items-center gap-4 unbounded justify-end md:justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#136867"
                  className="w-10 h-10 mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                <h4 className="mb-2 w-fit py-2 text-[#124e54]">
                  Send and Receive Token
                </h4>
                {/* <p className="text-sm opacity-80">
                  Easily manage tokens with just a few clicks.
                </p> */}
              </li>
              <li className="p-2 md:p-4 flex items-center gap-4 unbounded justify-end md:justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#136867"
                  className="w-10 h-10 mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                  />
                </svg>
                <h4 className="mb-2 w-fit py-2 text-[#124e54]">
                  Smart Contract Interaction
                </h4>
                {/* <p className="text-sm opacity-80">
                  Connect to decentralized applications and execute smart
                  contracts effortlessly.
                </p> */}
              </li>
              <li className="p-2 md:p-4 flex items-center gap-4 unbounded justify-end md:justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#136867"
                  className="w-10 h-10 mb-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                  />
                </svg>
                <h4 className="mb-2 w-fit py-2 text-[#124e54]">
                  Token Management
                </h4>
                {/* <p className="text-sm opacity-80">
                  View, manage, and trade your tokens in one intuitive
                  dashboard.
                </p> */}
              </li>
            </ul>
          </div>
        </div>
        <div
          style={{
            backgroundImage: "url('/assets/layered-bg2.png')",
            backgroundPosition: "top",
          }}
          className="absolute bg-no-repeat bg-cover left-0 bottom-0 h-[100px] w-full"
        ></div>
      </section>

      <section className="bg-black max-h-screen text-white relative unbounded overflow-hidden">
        <div className="py-16 container mx-auto flex gap-8">
          <div className="flex-1 mx-4">
            <h3 className="text-white text-lg mb-8 text-left xs:text-center">
              Getting Started with Xterium Wallet
            </h3>

            <ul className="flex flex-col gap-4">
              <li className="py-4">
                <h4 className="">1. Download the Extension</h4>
                <p className="text-theme-default text-xs">
                  Available for Chrome, Firefox, and more.
                </p>
              </li>
              <li className="py-4">
                <h4 className="">2. Create or Import a Wallet</h4>
                <p className="text-theme-default text-xs">
                  Generate a new wallet or import your existing one securely.
                </p>
              </li>
              <li className="py-4">
                <h4 className="">3. Start Managing Your Digital Assets</h4>
                <p className="text-theme-default text-xs">
                  Access your tokens, send/receive tokens, and interact with
                  Xode dApps.
                </p>
              </li>
            </ul>
          </div>
          {/* <div className="w-fit">
          <img src="/screen.png" alt="" className="w-[300px] rounded-xl" />
          </div> */}
        </div>
      </section>

      <section
        id="get-started-section"
        className="bg-white max-h-screen relative unbounded overflow-hidden px-4"
      >
        <div className="py-16 container mx-auto gap-8">
          <h3 className="text-lg mb-8 text-left xs:text-center">
            Download the Xterium App
          </h3>
          <div className="flex gap-4">
            <div className="flex-1 hidden md:block">
              <img
                src="/phone-app.jpeg"
                alt=""
                className="block mx-auto h-[500px] rounded-xl"
              />
            </div>
            <div className="flex-1 flex flex-col md:items-end md:text-right justify-center">
              <h4 className="text-3xl my-8">
                Seamless Blockchain Access <br />— Anytime, Anywhere
              </h4>
              <p className="text-sm my-4 font-bold">
                Manage your digital assets and interact with the Xode ecosystem
                through a secure, easy-to-use wallet designed for all your
                devices.
              </p>
              <p className="text-xs my-4">
                Whether you prefer browser or mobile, the Xterium Wallet has you
                covered.
              </p>
              <div className="my-8 flex flex-col md:flex-row gap-4 justify-end w-full">
                <a
                  href="https://chromewebstore.google.com/detail/xterium/klfhdmiebenifpdmdmkjicdohjilabdg"
                  target="_blank"
                  className="text-white bg-black py-4 px-8 rounded-[100px] flex items-center gap-4 flex-1"
                >
                  <img src="/logo-xtension.png" alt="" className="size-8" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs">Download for</span>Chrome
                  </div>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.xterium.wallet&pli=1"
                  target="_blank"
                  className="text-white bg-black py-4 px-8 rounded-[100px] flex items-center gap-4 flex-1"
                >
                  <img src="/logo-playstore.webp" alt="" className="size-8" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs">Download on</span>Play Store
                  </div>
                </a>
              </div>
              <p className="my-8 text-sm text-theme-default">
                We’re bringing the full Xterium experience to iPhones soon.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-black">
        <WalletCreationSteps />
        <ImportWalletSteps />
        <TransferingTokenSteps />
      </div>
    </div>
  );
}
