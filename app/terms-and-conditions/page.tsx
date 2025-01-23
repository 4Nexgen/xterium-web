import React from "react";

export default function TermsAndConditionsPage() {
  return (
    <div className="p-8 text-white">
      <div className="policy-content mt-36">
        <div className="policy-details container mx-auto">
          <div className="mb-12">
            <h4 className="text-3xl font-bold mb-8 text-slate-400">Xterium Term Of Use</h4>
            <p className="text-lg mt-2 text-gray-400 text-justify">
              Welcome to Xterium! These Terms of Use (&quot;Terms&quot;) govern
              your use of our website [www.Xterium.net] (&quot;Website&quot;)
              and any associated services provided by Xterium (&quot;we&quot;,
              &quot;us&quot;, or &quot;our&quot;). By accessing or using the
              Website, you agree to be bound by these Terms. If you do not agree
              with these Terms, please do not use the Website.
            </p>
          </div>
          <div className="mb-12">
            <h4 className="font-bold text-slate-400">1. User Eligibility</h4>
            <p className="text-lg mt-2 text-gray-400 text-justify">
              You must be at least 13 years old to use this Website. By using
              the Website, you represent and warrant that you are at least 13
              years old.
            </p>
          </div>
          <div className="mb-12">
            <h4 className="font-bold text-slate-400">2. Use of the Website</h4>
            <p className="text-lg mt-2 text-gray-400 text-justify">
              2.1. License: Subject to these Terms, we grant you a limited,
              non-exclusive, non-transferable, and revocable license to use the
              Website for your personal, non-commercial use.
            </p>
            <p className="text-lg mt-2 text-gray-400 text-justify">
              2.2. Prohibited Activities: You agree not to:
            </p>
            <ul className="list-inside list-disc text-lg mt-4 text-gray-400 text-justify">
              <li className="mb-2">
                Use the Website for any unlawful purpose or in violation of any
                applicable laws.
              </li>
              <li className="mb-2">
                Interfere with or disrupt the integrity or performance of the
                Website.
              </li>
              <li className="mb-2">
                Attempt to gain unauthorized access to the Website or its
                related systems or networks.
              </li>
              <li className="mb-2">
                Engage in any form of automated data collection or scraping
                without our prior written consent.
              </li>
              <li className="mb-2">
                Post, transmit, or share content that is harmful, offensive,
                obscene, or otherwise objectionable.
              </li>
            </ul>
            <p className="text-lg mt-2 text-gray-400 text-justify">
              2.3. Intellectual Property: All content on this Website, including
              but not limited to text, graphics, logos, and images, is protected
              by intellectual property rights and is the property of Xterium or
              its licensors.
            </p>
          </div>

          <div className="mb-12">
            <h4 className="font-bold text-slate-400">3. User-Generated Content</h4>
            <p className="text-lg mt-2 text-gray-400 text-justify">
              3.1. Submission of Content: By submitting content (such as
              comments, reviews, or contributions) to the Website, you grant us
              a worldwide, irrevocable, non-exclusive, royalty-free license to
              use, reproduce, modify, publish, translate, distribute, and
              display the content.
            </p>
            <p className="text-lg mt-2 text-gray-400 text-justify">
              3.2. Responsibility for Content: You are solely responsible for
              the content you submit, and you represent and warrant that you
              have all necessary rights to do so.
            </p>
          </div>

          <div className="mb-12">
            <h4 className="font-bold text-slate-400">4. Privacy</h4>
            <p className="text-lg mt-2 text-gray-400 text-justify">
              Our{" "}
              <a
                href="/privacy-policy"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </a>{" "}
              explains how we collect, use, and disclose information about you.
              By using the Website, you consent to the practices described in
              the Privacy Policy.
            </p>
          </div>

          <div className="mb-12">
            <h4 className="font-bold text-slate-400">5. Third-Party Links</h4>
            <p className="text-lg mt-2 text-gray-400 text-justify">
              The Website may contain links to third-party websites. We do not
              endorse or assume any responsibility for the content, privacy
              policies, or practices of any third-party sites.
            </p>
          </div>

          <div className="mb-12">
            <h4 className="font-bold text-slate-400">6. Disclaimer of Warranties</h4>
            <p className="text-lg mt-2 text-gray-400 text-justify">
              The Website is provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, either express or
              implied. We disclaim all warranties, including but not limited to,
              implied warranties of merchantability, fitness for a particular
              purpose, and non-infringement.
            </p>
          </div>

          <div className="mb-12">
            <h4 className="font-bold text-slate-400">7. Limitation of Liability</h4>
            <p className="text-lg mt-2 text-gray-400 text-justify">
              In no event shall Xterium, its officers, directors, employees, or
              agents be liable for any indirect, consequential, special,
              incidental, or punitive damages arising out of or in connection
              with your use of the Website.
            </p>
          </div>

          <div className="mb-12">
            <h4 className="font-bold text-slate-400">8. Governing Law and Jurisdiction</h4>
            <p className="text-lg mt-2 text-gray-400 text-justify">
              These Terms are governed by and construed in accordance with the
              laws of [Jurisdiction], without regard to its conflict of law
              principles.
            </p>
          </div>

          <div className="mb-12">
            <h4 className="font-bold text-slate-400">9. Changes to the Terms</h4>
            <p className="text-lg mt-2 text-gray-400 text-justify">
              We may update these Terms from time to time for legal or
              regulatory reasons. The date of the latest revision will be
              indicated at the beginning of the document.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
