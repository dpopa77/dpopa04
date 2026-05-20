'use client'
import { useState } from 'react'

type Issue = { severity: 'high' | 'medium' | 'low', category: string, text: string }

type Result = {
  score: number
  summary: string
  issues: Issue[]
  categories: string[]
  aiAnalysis?: string
  trackers: string[]
  trackerCount: number
  socialLogin: string[]
  scannedPages: number
  meta: {
    hasPrivacyPolicy: boolean
    hasCookieConsent: boolean
    hasTerms: boolean
    isHttps: boolean
    collectsPersonalData: boolean
    hasErasureRights: boolean
    hasRetentionPolicy: boolean
    hasSecurityContact: boolean
    hasCSP: boolean
    collectsAddress: boolean
    collectsDOB: boolean
  }
  error?: string
}

const APP_URLS: Record<string, string> = {
  'facebook': 'https://facebook.com',
  'instagram': 'https://instagram.com',
  'twitter': 'https://twitter.com',
  'x': 'https://x.com',
  'tiktok': 'https://tiktok.com',
  'youtube': 'https://youtube.com',
  'google': 'https://google.com',
  'amazon': 'https://amazon.co.uk',
  'ebay': 'https://ebay.co.uk',
  'spotify': 'https://spotify.com',
  'netflix': 'https://netflix.com',
  'uber': 'https://uber.com',
  'airbnb': 'https://airbnb.com',
  'linkedin': 'https://linkedin.com',
  'reddit': 'https://reddit.com',
  'whatsapp': 'https://whatsapp.com',
  'snapchat': 'https://snapchat.com',
  'discord': 'https://discord.com',
  'shopify': 'https://shopify.com',
  'notion': 'https://notion.so',
  'slack': 'https://slack.com',
  'zoom': 'https://zoom.us',
  'dropbox': 'https://dropbox.com',
  'paypal': 'https://paypal.com',
}

const resolveUrl = (input: string): string => {
  const cleaned = input.trim().toLowerCase()
  if (APP_URLS[cleaned]) return APP_URLS[cleaned]
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) return input.trim()
  return 'https://' + input.trim()
}

const severityConfig = {
  high: {
    color: 'text-red-600',
    bg: 'bg-red-50 border-red-100',
    dot: 'bg-red-400',
  },
  medium: {
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-100',
    dot: 'bg-amber-400',
  },
  low: {
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-100',
    dot: 'bg-blue-400',
  },
}

const scoreConfig = (score: number) => {
  if (score >= 80) return { grade: 'A', color: 'text-emerald-600', ring: '#10b981', bg: 'bg-emerald-50', border: 'border-emerald-100' }
  if (score >= 60) return { grade: 'B', color: 'text-amber-600', ring: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-100' }
  if (score >= 40) return { grade: 'C', color: 'text-orange-600', ring: '#f97316', bg: 'bg-orange-50', border: 'border-orange-100' }
  return { grade: 'F', color: 'text-red-600', ring: '#ef4444', bg: 'bg-red-50', border: 'border-red-100' }
}

function ScoreRing({ score }: { score: number }) {
  const config = scoreConfig(score)
  const radius = 52
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={radius} fill="none"
          stroke={config.ring}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-black ${config.color}`}>{score}</span>
        <span className="text-slate-400 text-xs tracking-wider">/ 100</span>
      </div>
    </div>
  )
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Result | null>(null)
  const [resolvedUrl, setResolvedUrl] = useState('')

  const handleScan = async () => {
    if (!url) return
    const resolved = resolveUrl(url)
    setResolvedUrl(resolved)
    setLoading(true)
    setResult(null)
    const res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: resolved })
    })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  const highCount = result?.issues?.filter(i => i.severity === 'high').length ?? 0
  const medCount = result?.issues?.filter(i => i.severity === 'medium').length ?? 0
  const lowCount = result?.issues?.filter(i => i.severity === 'low').length ?? 0
  const config = result ? scoreConfig(result.score) : null

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="font-bold text-slate-800">PrivaChek</span>
          </div>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
            Free GDPR Scanner
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
            Is your website<br />
            <span className="text-indigo-600">GDPR compliant?</span>
          </h1>
          <p className="text-slate-500 text-base">
            Scan any website or app in seconds. No login required.
          </p>
        </div>

        {/* Search box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm mb-10 flex gap-2">
          <input
            className="flex-1 px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none bg-transparent"
            placeholder="Website URL or app name — e.g. mapleparking.co.uk or Notion"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleScan()}
          />
          <button
            onClick={handleScan}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors shrink-0"
          >
            {loading ? 'Scanning...' : 'Scan now'}
          </button>
        </div>

        {/* Error */}
        {result?.error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm mb-4">
            ⚠ {result.error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
            <div className="w-10 h-10 border-2 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 text-sm">Scanning <span className="font-medium text-slate-700">{resolvedUrl}</span></p>
            <p className="text-slate-400 text-xs mt-1">Checking pages and running AI analysis...</p>
          </div>
        )}

        {result && !result.error && config && (
          <div className="space-y-4">

            {/* Score card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-6">
                <ScoreRing score={result.score} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-2xl font-black ${config.color}`}>Grade {config.grade}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.bg} ${config.color} border ${config.border}`}>
                      {result.score}/100
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mb-3">{result.summary}</p>
                  <div className="flex gap-3 text-xs flex-wrap">
                    {highCount > 0 && <span className="bg-red-50 text-red-600 border border-red-100 px-2 py-1 rounded-full">{highCount} high risk</span>}
                    {medCount > 0 && <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2 py-1 rounded-full">{medCount} medium</span>}
                    {lowCount > 0 && <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 rounded-full">{lowCount} low</span>}
                    {result.scannedPages && (
                      <span className="bg-slate-50 text-slate-400 border border-slate-100 px-2 py-1 rounded-full">{result.scannedPages} pages scanned</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            {result.aiAnalysis && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-indigo-500">✦</span>
                  <h2 className="text-xs uppercase tracking-widest text-indigo-500 font-semibold">AI Analysis</h2>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">{result.aiAnalysis}</p>
              </div>
            )}

            {/* Checks */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-4">Compliance Checks</h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'HTTPS', pass: result.meta.isHttps },
                  { label: 'Privacy Policy', pass: result.meta.hasPrivacyPolicy },
                  { label: 'Cookie Consent', pass: result.meta.hasCookieConsent },
                  { label: 'Terms of Service', pass: result.meta.hasTerms },
                  { label: 'Right to Erasure', pass: result.meta.hasErasureRights },
                  { label: 'Data Retention Policy', pass: result.meta.hasRetentionPolicy },
                  { label: 'Security Contact', pass: result.meta.hasSecurityContact },
                  { label: 'Security Headers', pass: result.meta.hasCSP },
                ].map(({ label, pass }) => (
                  <div key={label} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm border ${pass ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${pass ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span className={`text-sm ${pass ? 'text-slate-600' : 'text-slate-500'}`}>{label}</span>
                    <span className={`ml-auto text-sm font-medium ${pass ? 'text-emerald-600' : 'text-red-500'}`}>
                      {pass ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trackers */}
            {result.trackerCount > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3">
                  Trackers Detected
                  <span className="ml-2 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-xs normal-case">{result.trackerCount}</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {result.trackers.map(t => (
                    <span key={t} className="bg-red-50 text-red-600 border border-red-100 text-xs px-3 py-1.5 rounded-full font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Login */}
            {result.socialLogin?.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-3">Social Login Detected</h2>
                <div className="flex flex-wrap gap-2">
                  {result.socialLogin.map(t => (
                    <span key={t} className="bg-amber-50 text-amber-600 border border-amber-100 text-xs px-3 py-1.5 rounded-full font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Issues */}
            {result.issues.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-5">
                  Issues Found
                  <span className="ml-2 bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full text-xs normal-case">{result.issues.length}</span>
                </h2>
                <div className="space-y-5">
                  {result.categories?.map(category => {
                    const categoryIssues = result.issues.filter(i => i.category === category)
                    return (
                      <div key={category}>
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{category}</h3>
                        <ul className="space-y-2">
                          {categoryIssues.map((issue, i) => (
                            <li key={i} className={`flex gap-3 p-3 rounded-xl border ${severityConfig[issue.severity].bg}`}>
                              <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${severityConfig[issue.severity].dot}`} />
                              <div>
                                <span className={`text-xs font-bold uppercase mr-2 ${severityConfig[issue.severity].color}`}>
                                  {issue.severity}
                                </span>
                                <span className="text-slate-600 text-sm">{issue.text}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <p className="text-slate-400 text-xs text-center pb-8">
              Scanned {result.scannedPages} page{result.scannedPages > 1 ? 's' : ''}. Results are informational only — not legal advice.
            </p>

          </div>
        )}
      </div>
    </main>
  )
}