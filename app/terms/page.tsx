export default function Terms() {
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
          <h1 className="text-3xl font-black text-slate-900 mb-2">Terms of Service</h1>
          <p className="text-slate-400 text-sm mb-8">Last updated: 21 May 2026</p>
  
          <div className="space-y-8 text-slate-700">
  
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">1. About PrivaChek</h2>
              <p className="text-sm leading-relaxed">PrivaChek is a free GDPR compliance scanning tool. By using our service at privachek.org, you agree to these terms.</p>
            </section>
  
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">2. Use of the service</h2>
              <ul className="text-sm space-y-2 list-disc pl-5">
                <li>You may use PrivaChek to scan websites you own or have permission to scan</li>
                <li>You may not use PrivaChek to scan websites without authorisation</li>
                <li>You may not use the service for any unlawful purpose</li>
                <li>You may not attempt to overload or abuse the service</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">3. Accuracy of results</h2>
              <p className="text-sm leading-relaxed">PrivaChek scans publicly accessible pages and provides informational results only. Our results are not legal advice. We cannot guarantee the accuracy or completeness of any scan. Always consult a qualified legal professional for compliance advice.</p>
            </section>
  
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">4. Limitation of liability</h2>
              <p className="text-sm leading-relaxed">PrivaChek is provided "as is" without warranty of any kind. We are not liable for any damages arising from your use of the service or reliance on scan results.</p>
            </section>
  
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">5. Intellectual property</h2>
              <p className="text-sm leading-relaxed">All content, design, and code on privachek.org is owned by PrivaChek. You may not copy or reproduce any part of the service without permission.</p>
            </section>
  
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">6. Changes to terms</h2>
              <p className="text-sm leading-relaxed">We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
            </section>
  
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">7. Contact</h2>
              <p className="text-sm leading-relaxed">For any questions about these terms, contact us at <a href="mailto:privacy@privachek.org" className="text-indigo-600 underline">privacy@privachek.org</a>.</p>
            </section>
  
          </div>
        </div>
      </main>
    )
  }
