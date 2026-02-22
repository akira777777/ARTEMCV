import { ContactSectionEnhanced } from "./components/ContactSectionEnhanced";
import { useEffect, useMemo, useState } from 'react'
import './App.css'

const focusAreas = [
  {
    title: 'Brand Foundations',
    description: 'Clarify your visual voice and messaging system, then distill it into actionable guidelines that scale across every channel.',
    bullets: ['Identity audit & competitive mapping', 'Narrative framework & tone kit', 'Color, type & motion tokens'],
    metric: '2-4 weeks',
    stat: 'Aligned teams, faster launches',
  },
  {
    title: 'Product Experience',
    description: 'Design modular product flows with a consistent rhythm across touchpoints, crafted for conversion and long-term retention.',
    bullets: ['UX architecture & information design', 'Interaction prototyping & testing', 'Launch-ready component library'],
    metric: '4-8 weeks',
    stat: 'Sharper journeys, higher retention',
  },
  {
    title: 'Growth Systems',
    description: 'Optimize marketing surfaces with clear hierarchy, adaptive layouts, and performance-first modules built to iterate fast.',
    bullets: ['Landing systems & A/B frameworks', 'Content ops & editorial templates', 'Experiment playbooks & analytics'],
    metric: '3-6 weeks',
    stat: 'Faster iteration, better lift',
  },
]

const features = [
  { icon: '⬡', title: 'Modular Layouts', description: 'Section-based building blocks with consistent spacing rules and flexible content choreography.' },
  { icon: '✦', title: 'Precision Typography', description: 'A refined type scale that separates headlines, supporting lines, and metadata with editorial clarity.' },
  { icon: '◈', title: 'Intentional Motion', description: 'Subtle motion cues highlight priority actions without distracting from core messaging.' },
  { icon: '⚡', title: 'Performance-First', description: 'Responsive surfaces tuned for speed, with reusable tokens and minimal layout shift.' },
  { icon: '⟳', title: 'Conversion Paths', description: 'Strategic CTA placement with progressive depth, from glanceable value to detailed proof.' },
  { icon: '◎', title: 'Editorial Detail', description: 'Polished visual rhythm inspired by modern editorial systems and digital studios.' },
]

const caseStudies = [
  { title: 'Helio Finance', label: 'Product Design System', outcome: 'Unified 12 teams on one reusable UI kit with shared tokens and documentation.', metrics: ['38% faster shipping', '26% drop in rework', '4 new product launches'] },
  { title: 'Northwind Studios', label: 'Brand & Web', outcome: 'Translated premium positioning into a high-converting 3-page marketing surface.', metrics: ['1.9x demo requests', '18% higher retention', 'Editorial-ready CMS'] },
  { title: 'Arcadia Logistics', label: 'Growth Site', outcome: 'Rebuilt modular marketing to support regional personalization at scale.', metrics: ['32% lower CAC', '50+ localized pages', '2-week release cycle'] },
]

const insights = [
  { title: 'Designing for confident decision making', meta: 'Strategy - 6 min read' },
  { title: 'How modular systems keep marketing in sync', meta: 'Systems - 4 min read' },
  { title: 'Turning data into narrative layouts', meta: 'Growth - 5 min read' },
]

const testimonials = [
  { quote: "They brought an editorial clarity we did not know we were missing. The system now scales effortlessly and our team ships with more confidence.", name: 'Hana Lee', role: 'VP Product, Helio Finance', initials: 'HL' },
  { quote: "The new site feels premium, fast, and purposeful. Stakeholders finally align on direction, and our conversion rate proves it.", name: 'Marcus Feld', role: 'Head of Brand, Northwind', initials: 'MF' },
]

const stats = [
  { label: 'Avg. project lift', value: '24%' },
  { label: 'Client NPS', value: '72' },
  { label: 'Launch velocity', value: '2.1x' },
]

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Insights', href: '#insights' },
  { label: 'Contact', href: '#contact' },
]

const clients = ['Helio Finance', 'Northwind', 'Arcadia', 'Meridian', 'Sovra Labs', 'Orion Co.']

const processSteps = [
  { n: '01', title: 'Align & map', desc: 'Workshops, audits, and system mapping to define the brand logic and user journey.' },
  { n: '02', title: 'Prototype & refine', desc: 'Interactive modules built in Webflow with tested content hierarchy and motion.' },
  { n: '03', title: 'Launch & scale', desc: 'Delivery playbooks, QA, and ongoing optimization support included.' },
]

function App() {
  const [activeFocus, setActiveFocus] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  const activeFocusArea = useMemo(() => focusAreas[activeFocus], [activeFocus])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(progress)
      setScrolled(scrollTop > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'))
    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('reveal-visible'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <div className="page">
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Page scroll progress"
      />

      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <nav className="nav container" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="Artemcv Studio">
            <span className="brand-mark" aria-hidden="true">AC</span>
            <span className="brand-text">Artemcv Studio</span>
          </a>

          <button
            className="nav-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>

          <div id="primary-navigation" className={`nav-links${menuOpen ? ' open' : ''}`}>
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
          </div>

          <a className="btn primary" href="#contact">Book a Call</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-copy reveal" data-reveal>
                <div className="hero-pill">Studio for product-forward brands</div>
                <h1 id="hero-heading">
                  A cleaner, bolder web presence for teams who ship with purpose.
                  <span className="hero-accent"> Modular by design.</span>
                </h1>
                <p>
                  We blend the polish of Kitpro Fluke with the modular clarity of Aspekto to craft
                  high-performing Webflow experiences. Clean structure, refined typography, and
                  subtle motion that feels premium instead of loud.
                </p>
                <div className="hero-actions">
                  <a className="btn primary" href="#services">Explore Services</a>
                  <a className="btn ghost" href="#work">See Work</a>
                </div>
                <div className="hero-badges">
                  <span>Webflow Enterprise</span>
                  <span>Design Systems</span>
                  <span>Growth UX</span>
                </div>
              </div>

              <div className="hero-card reveal reveal-delay-2" data-reveal>
                <div className="hero-card-top">
                  <span className="hero-card-label">Live delivery dashboard</span>
                  <span className="hero-card-tag">Q1 Launch</span>
                </div>
                <div className="hero-card-metric">
                  <h3>+42%</h3>
                  <p>Conversion uplift from layout optimization and content hierarchy tuning.</p>
                </div>
                <div className="hero-card-list">
                  <div>
                    <span>Signal</span>
                    <strong>Clarity in every section</strong>
                  </div>
                  <div>
                    <span>Motion</span>
                    <strong>Micro-interactions on scroll</strong>
                  </div>
                  <div>
                    <span>Scale</span>
                    <strong>Reusable modules and tokens</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-stats reveal reveal-delay-3" data-reveal>
              {stats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="clients" aria-label="Trusted by">
          <div className="container">
            <div className="clients-inner reveal" data-reveal>
              <span className="clients-label">Trusted by</span>
              <div className="clients-grid">
                {clients.map((c) => (
                  <span key={c}>{c}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="section" aria-labelledby="services-heading">
          <div className="container">
            <div className="section-header reveal" data-reveal>
              <div>
                <p className="eyebrow">Services</p>
                <h2 id="services-heading">Strategic surfaces with a system-first mindset.</h2>
              </div>
              <p className="section-lead">
                Modular layouts, expressive typography, and performance-minded interactions.
                Designed for clarity, iteration, and scale.
              </p>
            </div>
            <div className="features-grid">
              {features.map((feature, i) => (
                <div className={`feature-card reveal reveal-delay-${(i % 3) + 1}`} data-reveal key={feature.title}>
                  <div className="feature-icon" aria-hidden="true">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <button className="text-link" type="button">Explore detail</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="focus" aria-labelledby="focus-heading">
          <div className="container focus-grid">
            <div className="focus-left reveal" data-reveal>
              <p className="eyebrow">Focus Areas</p>
              <h2 id="focus-heading">Choose your path. We design the system around it.</h2>
              <div className="focus-tabs" role="tablist" aria-label="Focus areas">
                {focusAreas.map((area, index) => (
                  <button
                    key={area.title}
                    type="button"
                    role="tab"
                    id={`focus-tab-${index}`}
                    aria-controls="focus-panel"
                    aria-selected={activeFocus === index}
                    className={activeFocus === index ? 'active' : ''}
                    onClick={() => setActiveFocus(index)}
                  >
                    {area.title}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="focus-panel reveal reveal-delay-2"
              data-reveal
              role="tabpanel"
              id="focus-panel"
              aria-labelledby={`focus-tab-${activeFocus}`}
              tabIndex={0}
            >
              <div className="focus-panel-inner">
                <h3>{activeFocusArea.title}</h3>
                <p>{activeFocusArea.description}</p>
                <ul>
                  {activeFocusArea.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <div className="focus-meta">
                  <span>{activeFocusArea.metric}</span>
                  <span>{activeFocusArea.stat}</span>
                </div>
                <a className="btn teal" href="#contact">Build this system</a>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="section alt" aria-labelledby="work-heading">
          <div className="container">
            <div className="section-header reveal" data-reveal>
              <div>
                <p className="eyebrow">Selected Work</p>
                <h2 id="work-heading">Elegant, modular builds that stay brand-forward.</h2>
              </div>
              <p className="section-lead">
                Every engagement includes a scalable layout framework, micro-interactions tuned to
                user intent, and a mobile-first responsive grid.
              </p>
            </div>
            <div className="case-grid">
              {caseStudies.map((study, i) => (
                <article key={study.title} className={`case-card reveal reveal-delay-${i + 1}`} data-reveal>
                  <div className="case-header">
                    <span className="case-tag">{study.label}</span>
                    <button className="icon-button" type="button">View</button>
                  </div>
                  <h3>{study.title}</h3>
                  <p>{study.outcome}</p>
                  <div className="case-metrics">
                    {study.metrics.map((metric) => (
                      <span key={metric}>{metric}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="section" aria-labelledby="process-heading">
          <div className="container">
            <div className="section-header reveal" data-reveal>
              <div>
                <p className="eyebrow">Process</p>
                <h2 id="process-heading">Structure first. Then the creative detail.</h2>
              </div>
              <p className="section-lead">
                A collaborative, rapid-feedback workflow that keeps every stakeholder aligned and
                each module production-ready.
              </p>
            </div>
            <div className="process-steps">
              {processSteps.map((step, i) => (
                <div key={step.n} className={`reveal reveal-delay-${i + 1}`} data-reveal>
                  <span>{step.n}</span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section highlight" aria-labelledby="testimonials-heading">
          <div className="container">
            <div className="highlight-grid">
              <div className="reveal" data-reveal>
                <p className="eyebrow">Testimonials</p>
                <h2 id="testimonials-heading">Teams stay aligned because the system stays sharp.</h2>
                <p style={{ marginTop: '1.25rem' }}>
                  Our clients consistently report that clarity, speed, and premium craft define the
                  collaboration and the outcome.
                </p>
                <div style={{ marginTop: '1.75rem' }}>
                  <a className="btn primary" href="#contact">Start a conversation</a>
                </div>
              </div>
              <div className="testimonial-stack">
                {testimonials.map((item, i) => (
                  <figure key={item.name} className={`reveal reveal-delay-${i + 1}`} data-reveal>
                    <blockquote>{item.quote}</blockquote>
                    <figcaption>
                      <div className="testimonial-avatar" aria-hidden="true">{item.initials}</div>
                      <div className="testimonial-info">
                        <strong>{item.name}</strong>
                        <span>{item.role}</span>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="insights" className="section" aria-labelledby="insights-heading">
          <div className="container">
            <div className="section-header reveal" data-reveal>
              <div>
                <p className="eyebrow">Insights</p>
                <h2 id="insights-heading">Editorial thinking for modern digital teams.</h2>
              </div>
              <a className="text-link" href="#contact">View all articles</a>
            </div>
            <div className="insight-grid">
              {insights.map((insight, i) => (
                <article key={insight.title} className={`reveal reveal-delay-${i + 1}`} data-reveal>
                  <p className="insight-meta">{insight.meta}</p>
                  <h3>{insight.title}</h3>
                  <button className="text-link" type="button">Read</button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <ContactSectionEnhanced />
      </main>

      <footer className="site-footer reveal" data-reveal>
        <div className="container footer-grid">
          <div className="footer-brand">
            <span className="brand-mark" aria-hidden="true">AC</span>
            <div>
              <strong>Artemcv Studio</strong>
              <p>Strategic Webflow systems for modern teams.</p>
            </div>
          </div>
          <nav className="footer-links" aria-label="Footer navigation">
            <a href="#services">Services</a>
            <a href="#work">Work</a>
            <a href="#process">Process</a>
            <a href="#contact">Contact</a>
          </nav>
          <p className="footer-note">2026 Artemcv Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App