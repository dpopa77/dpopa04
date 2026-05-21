export default function Privacy() {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="border-b border-slate-200 bg-white">
          <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-2">
            <a href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="font-bold text-slate-800">PrivaChek</span>
            </a>
          </div>
        </div>
  
        <div className="max-w-2xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Privacy Policy</h1>
          <p className="text-slate-400 text-sm mb-8">Last updated: 21 May 2026</p>
  
          <div className="space-y-8 text-slate-700">
  
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Who we are</h2>
              <p className="text-sm leading-relaxed">PrivaChek is a free GDPR compliance scanner operated by Daniel Popa. Our website is at privachek.org. You can contact us at privacy@privachek.org.</p>
            </section>
  
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">What data we collect</h2>
              <p className="text-sm leading-relaxed mb-3">We collect minimal data to operate the service:</p>
              <ul className="text-sm space-y-2 list-disc pl-5">
                <li><strong>URLs you scan</strong> — we process the URL you submit to perform the scan. We do not store these permanently.</li>
                <li><strong>Email address</strong> — only if you choose to submit it to receive your report. We do not share this with third parties.</li>
                <li><strong>Server logs</strong> — standard server logs including IP addresses, collected automatically by our hosting provider (Vercel). These are retained for up to 30 days.</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">How we use your data</h2>
              <ul className="text-sm space-y-2 list-disc pl-5">
                <li>To perform the GDPR compliance scan you requested</li>
                <li>To email you your scan report if you requested it</li>
                <li>To improve the service based on usage patterns</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Legal basis for processing</h2>
              <p className="text-sm leading-relaxed">We process your data on the basis of legitimate interest (operating the service) and consent (where you provide your email address).</p>
            </section>
  
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Data retention</h2>
              <p className="text-sm leading-relaxed">We do not store scan results permanently. Email addresses submitted for reports are retained for up to 12 months. Server logs are retained for up to 30 days.</p>
            </section>
  
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Your rights</h2>
              <p className="text-sm leading-relaxed mb-3">Under GDPR you have the right to:</p>
              <ul className="text-sm space-y-2 list-disc pl-5">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data (right to erasure)</li>
                <li>Object to processing of your data</li>
                <li>Data portability</li>
              </ul>
              <p className="text-sm leading-relaxed mt-3">To exercise any of these rights, email us at <a href="mailto:privacy@privachek.org" className="text-indigo-600 underline">privacy@privachek.org</a>. We will respond within 30 days.</p>
            </section>
  
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Third party services</h2>
              <p className="text-sm leading-relaxed">We use the following third party services:</p>
              <ul className="text-sm space-y-2 list-disc pl-5 mt-2">
                <li><strong>Vercel</strong> — hosting provider (US-based). Data may be transferred outside the EU under standard contractual clauses.</li>
                <li><strong>Anthropic</strong> — AI analysis provider (US-based). Scan data is sent to Anthropic's API for analysis. Data may be transferred outside the EU under standard contractual clauses.</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Cookies</h2>
              <p className="text-sm leading-relaxed">PrivaChek uses only essential cookies required for the service to function. We do not use tracking or advertising cookies.</p>
            </section>
  
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Contact</h2>
              <p className="text-sm leading-relaxed">For any privacy-related questions, contact us at <a href="mailto:privacy@privachek.org" className="text-indigo-600 underline">privacy@privachek.org</a>.</p>
            </section>
  
          </div>
        </div>
      </main>
    )
  }
  