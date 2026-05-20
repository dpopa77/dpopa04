import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const TRACKERS = [
  { name: 'Google Analytics', patterns: ['google-analytics.com', 'gtag('] },
  { name: 'Facebook Pixel', patterns: ['facebook.com/tr', 'fbq('] },
  { name: 'Hotjar', patterns: ['hotjar.com', 'hj('] },
  { name: 'Mixpanel', patterns: ['mixpanel.com', 'mixpanel.track'] },
  { name: 'Segment', patterns: ['segment.com', 'analytics.track'] },
  { name: 'TikTok Pixel', patterns: ['analytics.tiktok.com', 'ttq.track'] },
  { name: 'Intercom', patterns: ['intercom.io', 'Intercom('] },
  { name: 'Hubspot', patterns: ['hubspot.com', 'hs-scripts.com'] },
  { name: 'Clarity (Microsoft)', patterns: ['clarity.ms'] },
  { name: 'LinkedIn Insight', patterns: ['snap.licdn.com', '_linkedin_partner'] },
  { name: 'Twitter/X Pixel', patterns: ['static.ads-twitter.com', 'twq('] },
  { name: 'Heap Analytics', patterns: ['heapanalytics.com'] },
  { name: 'Amplitude', patterns: ['amplitude.com'] },
  { name: 'FullStory', patterns: ['fullstory.com'] },
  { name: 'Crisp Chat', patterns: ['crisp.chat'] },
  { name: 'Drift', patterns: ['drift.com', 'js.driftt.com'] },
  { name: 'Zendesk', patterns: ['zendesk.com', 'zdassets.com'] },
  { name: 'Optimizely', patterns: ['optimizely.com'] },
  { name: 'VWO', patterns: ['vwo.com', 'visualwebsiteoptimizer.com'] },
  { name: 'Klaviyo', patterns: ['klaviyo.com'] },
  { name: 'Mailchimp', patterns: ['mailchimp.com', 'list-manage.com'] },
  { name: 'ConvertKit', patterns: ['convertkit.com'] },
  { name: 'Stripe', patterns: ['js.stripe.com'] },
  { name: 'PayPal', patterns: ['paypal.com', 'paypalobjects.com'] },
  { name: 'Google Maps', patterns: ['maps.googleapis.com', 'maps.google.com'] },
  { name: 'YouTube Embed', patterns: ['youtube.com/embed', 'ytimg.com'] },
  { name: 'Vimeo Embed', patterns: ['vimeo.com', 'vimeocdn.com'] },
  { name: 'Typeform', patterns: ['typeform.com'] },
  { name: 'Google Tag Manager', patterns: ['googletagmanager.com'] },
]

const SOCIAL_LOGIN = [
  { name: 'Google Login', patterns: ['accounts.google.com', 'gsi/client'] },
  { name: 'Facebook Login', patterns: ['connect.facebook.net'] },
  { name: 'Apple Login', patterns: ['appleid.apple.com'] },
  { name: 'GitHub Login', patterns: ['github.com/login/oauth'] },
]

async function fetchPage(url: string): Promise<{ html: string, headers: Headers }> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PrivaChek/1.0)' }
  })
  const html = await res.text()
  return { html, headers: res.headers }
}

async function findPrivacyPage(baseUrl: string, html: string): Promise<string> {
  const linkRegex = /href=["']([^"']*(?:privacy|gdpr|data-protection|datenschutz)[^"']*)["']/gi
  const matches = [...html.matchAll(linkRegex)]

  for (const match of matches.slice(0, 3)) {
    let href = match[1]
    if (href.startsWith('/')) {
      const base = new URL(baseUrl)
      href = `${base.protocol}//${base.host}${href}`
    } else if (!href.startsWith('http')) {
      href = `${baseUrl.replace(/\/$/, '')}/${href}`
    }
    try {
      const res = await fetch(href, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PrivaChek/1.0)' }
      })
      const text = await res.text()
      return text
    } catch {
      continue
    }
  }
  return ''
}

export async function POST(req: NextRequest) {
  const { url } = await req.json()

  if (!url) return NextResponse.json({ error: 'No URL provided' }, { status: 400 })

  let normalizedUrl = url.trim()
  if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
    normalizedUrl = 'https://' + normalizedUrl
  }

  try {
    const { html, headers } = await fetchPage(normalizedUrl)
    const htmlLower = html.toLowerCase()

    const privacyPageHtml = await findPrivacyPage(normalizedUrl, html)
    const combinedHtml = (html + privacyPageHtml).toLowerCase()

    const issues: { severity: 'high' | 'medium' | 'low', category: string, text: string }[] = []
    let score = 100

    // HTTPS
    if (!normalizedUrl.startsWith('https://')) {
      issues.push({ severity: 'high', category: 'Security', text: 'Site is not using HTTPS — required for secure data handling' })
      score -= 20
    }

    // CSP header
    const csp = headers.get('content-security-policy')
    if (!csp) {
      issues.push({ severity: 'low', category: 'Security', text: 'No Content Security Policy header detected — CSP reduces risk of XSS attacks and data theft' })
      score -= 5
    }

    // X-Frame-Options
    const xframe = headers.get('x-frame-options')
    if (!xframe) {
      issues.push({ severity: 'low', category: 'Security', text: 'No X-Frame-Options header — site may be vulnerable to clickjacking attacks' })
      score -= 5
    }

    // Privacy policy
    const hasPrivacy = combinedHtml.includes('privacy')
    if (!hasPrivacy) {
      issues.push({ severity: 'high', category: 'Legal', text: 'No privacy policy detected on homepage or linked pages — legally required under GDPR' })
      score -= 20
    }

    // Right to erasure
    const hasErasure = ['delete my data', 'right to erasure', 'right to be forgotten', 'delete your data', 'remove my data', 'article 17'].some(k => combinedHtml.includes(k))
    if (!hasErasure) {
      issues.push({ severity: 'medium', category: 'Legal', text: 'Right to erasure not detected — required under GDPR Article 17' })
      score -= 10
    }

    // Data retention
    const hasRetention = ['data retention', 'retain your data', 'keep your data', 'retention period', 'how long we keep'].some(k => combinedHtml.includes(k))
    if (!hasRetention) {
      issues.push({ severity: 'low', category: 'Legal', text: 'No data retention policy detected — GDPR requires disclosure of how long data is kept' })
      score -= 5
    }

    // Cookie consent
    const hasCookieConsent = [
      'cookie-consent', 'cookieconsent', 'cookie_consent',
      'accept cookies', 'we use cookies', 'cookie banner',
      'gdpr', 'cookiebot', 'onetrust', 'axeptio',
      'cookie preferences', 'manage cookies', 'cookie settings'
    ].some(k => htmlLower.includes(k))

    if (!hasCookieConsent) {
      issues.push({ severity: 'high', category: 'Cookies', text: 'No cookie consent mechanism detected — required for EU visitors' })
      score -= 20
    }

    // Terms
    if (!combinedHtml.includes('terms')) {
      issues.push({ severity: 'medium', category: 'Legal', text: 'No terms of service detected on homepage or linked pages' })
      score -= 10
    }

    // Trackers
    const foundTrackers: string[] = []
    for (const tracker of TRACKERS) {
      if (tracker.patterns.some(p => html.includes(p))) {
        foundTrackers.push(tracker.name)
      }
    }

    if (foundTrackers.length > 0) {
      issues.push({
        severity: 'high',
        category: 'Tracking',
        text: `Tracking scripts detected without verified consent: ${foundTrackers.join(', ')}`
      })
      score -= Math.min(foundTrackers.length * 3, 20)
    }

    // Social login
    const foundSocialLogin: string[] = []
    for (const social of SOCIAL_LOGIN) {
      if (social.patterns.some(p => html.includes(p))) {
        foundSocialLogin.push(social.name)
      }
    }

    if (foundSocialLogin.length > 0) {
      issues.push({
        severity: 'medium',
        category: 'Authentication',
        text: `Social login detected (${foundSocialLogin.join(', ')}) — third party data sharing must be disclosed in privacy policy`
      })
      score -= 5
    }

    // Personal data forms
    const hasEmailInput = html.includes('type="email"') || html.includes("type='email'")
    const hasPhoneInput = html.includes('type="tel"') || html.includes("type='tel'")
    const hasPasswordInput = html.includes('type="password"') || html.includes("type='password'")
    const hasAddressInput = htmlLower.includes('postcode') || htmlLower.includes('zip code') || htmlLower.includes('address')
    const hasDOBInput = htmlLower.includes('date of birth') || htmlLower.includes('dob') || html.includes('type="date"')

    if ((hasEmailInput || hasPhoneInput) && !hasCookieConsent && !hasPrivacy) {
      issues.push({
        severity: 'high',
        category: 'Data Collection',
        text: 'Forms collect personal data (email/phone) but no privacy notice found'
      })
      score -= 15
    }

    if (hasPasswordInput) {
      issues.push({
        severity: 'low',
        category: 'Security',
        text: 'Password input detected — ensure passwords are hashed and never logged'
      })
    }

    if (hasAddressInput) {
      issues.push({
        severity: 'medium',
        category: 'Data Collection',
        text: 'Physical address collection detected — sensitive personal data requiring explicit disclosure'
      })
      score -= 5
    }

    if (hasDOBInput) {
      issues.push({
        severity: 'medium',
        category: 'Data Collection',
        text: 'Date of birth collection detected — age-related data requires additional GDPR protections'
      })
      score -= 5
    }

    // Children
    const targetChildren = ['for kids', 'for children', 'child friendly', 'ages 13', 'under 13', 'parental consent', 'coppa'].some(k => htmlLower.includes(k))
    if (targetChildren) {
      issues.push({
        severity: 'high',
        category: 'Legal',
        text: 'Site may target children — COPPA and GDPR-K require parental consent for under-13 data collection'
      })
      score -= 20
    }

    // Security contact
    const hasSecurityContact = ['security@', 'dpo@', 'privacy@', 'data protection officer', 'dpo'].some(k => combinedHtml.includes(k))
    if (!hasSecurityContact) {
      issues.push({
        severity: 'low',
        category: 'Legal',
        text: 'No Data Protection Officer or privacy contact detected — recommended for GDPR compliance'
      })
      score -= 5
    }

    // US infrastructure
    const usHosted = ['amazonaws.com', 'cloudfront.net', 'fastly.net', 'azurewebsites.net', 'googleusercontent.com']
    const foundUS = usHosted.filter(h => html.includes(h))
    if (foundUS.length > 0 && !combinedHtml.includes('data transfer')) {
      issues.push({
        severity: 'medium',
        category: 'Data Transfer',
        text: `US-based infrastructure detected (${foundUS.join(', ')}) — GDPR requires disclosure of data transfers outside EU`
      })
      score -= 5
    }

    const finalScore = Math.max(score, 0)

    const summary = finalScore >= 80
      ? 'Good compliance overall — a few issues to address.'
      : finalScore >= 50
      ? 'Moderate compliance — several important issues found.'
      : 'Poor compliance — significant GDPR risks detected.'

    const aiPrompt = `You are a GDPR compliance expert. A website has been scanned and here are the results:

URL: ${normalizedUrl}
Score: ${finalScore}/100
Issues found:
${issues.map(i => `- [${i.severity.toUpperCase()}] [${i.category}] ${i.text}`).join('\n')}
Trackers detected: ${foundTrackers.length > 0 ? foundTrackers.join(', ') : 'None'}
Social login: ${foundSocialLogin.length > 0 ? foundSocialLogin.join(', ') : 'None'}
Has privacy policy: ${hasPrivacy}
Has cookie consent: ${hasCookieConsent}
Has terms of service: ${combinedHtml.includes('terms')}
Collects personal data: ${hasEmailInput || hasPhoneInput}

Write a short, plain-English analysis (3-4 sentences) explaining:
1. The biggest risk this site faces
2. The most important thing they should fix first
3. The potential consequence if they don't

Write directly to the website owner. Be specific, helpful, and avoid legal jargon. Do not use bullet points.`

    let aiAnalysis = ''
    try {
      const aiResponse = await client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 300,
        messages: [{ role: 'user', content: aiPrompt }]
      })
      aiAnalysis = aiResponse.content[0].type === 'text'
        ? aiResponse.content[0].text
        : ''
    } catch (aiErr) {
      console.error('AI analysis failed:', aiErr)
      aiAnalysis = ''
    }

    const categories = [...new Set(issues.map(i => i.category))]

    return NextResponse.json({
      score: finalScore,
      issues,
      categories,
      summary,
      aiAnalysis,
      trackerCount: foundTrackers.length,
      trackers: foundTrackers,
      socialLogin: foundSocialLogin,
      scannedPages: privacyPageHtml ? 2 : 1,
      meta: {
        hasPrivacyPolicy: hasPrivacy,
        hasCookieConsent,
        hasTerms: combinedHtml.includes('terms'),
        isHttps: normalizedUrl.startsWith('https://'),
        collectsPersonalData: hasEmailInput || hasPhoneInput,
        hasErasureRights: hasErasure,
        hasRetentionPolicy: hasRetention,
        hasSecurityContact,
        hasCSP: !!csp,
        collectsAddress: hasAddressInput,
        collectsDOB: hasDOBInput,
      }
    })

  } catch (err) {
    console.error('SCAN ERROR:', err)
    return NextResponse.json({
      error: 'Could not fetch the URL. Make sure it is publicly accessible.'
    }, { status: 500 })
  }
}