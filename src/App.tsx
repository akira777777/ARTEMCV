import { ContactSectionEnhanced } from "./components/ContactSectionEnhanced";
import { useEffect, useMemo, useState } from 'react'
import './App.css'

const focusAreas = [
  {
    title: 'Brand Foundations',
    description:
      'Clarify your visual voice and messaging system, then distill it into actionable guidelines that scale.',
    bullets: ['Identity audit', 'Narrative framework', 'Tone of voice kit'],
    metric: '2-4 weeks',
    stat: 'Aligned teams, faster launches',
  },
  {
    title: 'Product Experience',
    description:
      'Design modular product flows with a consistent rhythm across touchpoints, crafted for conversion.',
    bullets: ['UX architecture', 'Interaction prototyping', 'Launch-ready UI'],
    metric: '4-8 weeks',
    stat: 'Sharper journeys, higher retention',
  },
  {
    title: 'Growth Systems',
    description:
      'Optimize marketing surfaces with clear hierarchy, adaptive layouts, and performance-first modules.',
    bullets: ['Landing systems', 'Content ops', 'Experiment playbooks'],
    metric: '3-6 weeks',
    stat: 'Faster iteration, better lift',
  },
]

const features = [
  {
    title: 'Modular Layouts',
    description:
      'Section-based building blocks with consistent spacing rules and flexible content choreography.',
  },
  {
    title: 'Precision Typography',
    description:
      'A refined type scale that separates headlines, supporting lines, and metadata with clarity.',
  },
  {
    title: 'Intentional Motion',
    description:
      'Subtle motion cues highlight priority actions without distracting from core messaging.',
  },
  {
    title: 'Performance-First',
    description:
      'Responsive surfaces tuned for speed, with reusable tokens and minimal layout shift.',
  },
  {
    title: 'Conversion Paths',
    description:
      'Strategic CTA placement with progressive depth, from glanceable value to detailed proof.',
  },
  {
    title: 'Editorial Detail',
    description:
      'Polished visual rhythm inspired by modern editorial systems and digital studios.',
  },
]

const caseStudies = [
  {
    title: 'Helio Finance',
    label: 'Product Design System',
    outcome: 'Unified 12 teams on one reusable UI kit.',
    metrics: ['38% faster shipping', '26% drop in rework', '4 new product launches'],
  },
  {
    title: 'Northwind Studios',
    label: 'Brand & Web',
    outcome: 'Translated premium positioning into a 3-page marketing surface.',
    metrics: ['1.9x demo requests', '18% higher retention', 'Editorial-ready CMS'],
  },
  {
    title: 'Arcadia Logistics',
    label: 'Growth Site',
    outcome: 'Rebuilt modular marketing to support regional personalization.',
    metrics: ['32% lower CAC', '50+ localized pages', '2-week release cycle'],
  },
]

const insights = [
  {
    title: 'Designing for confident decision making',
    meta: 'Strategy · 6 min',
  },
  {
    title: 'How modular systems keep marketing in sync',
    meta: 'Systems · 4 min',
  },
  {
    title: 'Turning data into narrative layouts',
    meta: 'Growth · 5 min',
  },
]

const testimonials = [
  {
    quote:
      'They brought an editorial clarity we did not know we were missing. The system now scales effortlessly.',
    name: 'Hana Lee',
    role: 'VP Product, Helio Finance',
  },
  {
    quote:
      'The new site feels premium, fast, and purposeful. Stakeholders finally align on direction.',
    name: 'Marcus Feld',
    role: 'Head of Brand, Northwind',
  },
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

function App() {
  const [activeFocus, setActiveFocus] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  const activeFocusArea = useMemo(() => focusAreas[activeFocus], [activeFocus])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'))

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('reveal-visible'))
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
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' },
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <div className="page">
      <header className="site-header">
        <nav className="nav container">
          <a className="brand" href="#top">
            <span className="brand-mark">AC</span>
            <span className="brand-text">Artemcv Studio</span>
          </a>

          <button
            className="nav-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </button>

          <div
            id="primary-navigation"
            className={`nav-links ${menuOpen ? 'open' : ''}`}
          >
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
          </div>

          <a className="btn primary" href="#contact">
            Book a Call
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero reveal" data-reveal>
          <div className="container">
            <div className="hero-grid">
              <div className="hero-copy reveal" data-reveal>
                <div className="hero-pill">Studio for product-forward brands</div>
                <h1>
                  A cleaner, bolder web presence for teams who ship with purpose.
                  <span className="hero-accent"> Modular by design.</span>
                </h1>
                <p>
                  We blend the polish of Kitpro Fluke with the modular clarity of Aspekto to craft
                  high-performing Webflow experiences. Clean structure, refined typography, and
                  subtle motion that feels premium instead of loud.
                </p>
                <div className="hero-actions">
                  <a className="btn primary" href="#services">
                    Explore Services
                  </a>
                  <a className="btn ghost" href="#work">
                    See Work
                  </a>
                </div>
                <div className="hero-badges">
                  <span>Webflow Enterprise</span>
                  <span>Design Systems</span>
                  <span>Growth UX</span>
                </div>
              </div>

              <div className="hero-card reveal" data-reveal>
                <div className="hero-card-top">
                  <span className="hero-card-label">Live delivery dashboard</span>
                  <span className="hero-card-tag">Q1 Launch</span>
                </div>
                <div className="hero-card-metric">
                  <h3>+42%</h3>
                  <p>Conversion uplift from layout optimization + content hierarchy tuning.</p>
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
                    <strong>Reusable modules & tokens</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-stats reveal" data-reveal>
              {stats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="clients reveal" data-reveal>
          <div className="container clients-grid">
            <p>Trusted by product and brand teams across finance, logistics, and SaaS.</p>
            <div className="client-row">
              <span>Helio</span>
              <span>Northwind</span>
              <span>Arcadia</span>
              <span>Beaumont</span>
              <span>Vertex</span>
            </div>
          </div>
        </section>

        <section id="services" className="section reveal" data-reveal>
          <div className="container">
            <div className="section-header">
              <div>
                <p className="eyebrow">Services</p>
                <h2>Strategic surfaces with a system-first mindset.</h2>
              </div>
              <p className="section-lead">
                Modular layouts, expressive typography, and performance-minded interactions.
                Everything is designed for clarity, iteration, and scale.
              </p>
            </div>

            <div className="features-grid">
              {features.map((feature) => (
                <div className="feature-card reveal" data-reveal key={feature.title}>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <button className="text-link" type="button">
                    Explore detail
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="focus reveal" data-reveal>
          <div className="container focus-grid">
            <div className="focus-left">
              <p className="eyebrow">Focus Areas</p>
              <h2>Choose your path. We design the system around it.</h2>
              <div className="focus-tabs" role="tablist">
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
              className="focus-panel reveal"
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
                <a className="btn ghost" href="#contact">
                  Build this system
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="section alt reveal" data-reveal>
          <div className="container">
            <div className="section-header">
              <div>
                <p className="eyebrow">Selected Work</p>
                <h2>Elegant, modular builds that stay brand-forward.</h2>
              </div>
              <p className="section-lead">
                Every engagement includes a scalable layout framework, micro-interactions tuned to
                user intent, and a mobile-first responsive grid.
              </p>
            </div>

            <div className="case-grid">
              {caseStudies.map((study) => (
                <article key={study.title} className="case-card reveal" data-reveal>
                  <div className="case-header">
                    <span className="case-tag">{study.label}</span>
                    <button className="icon-button" type="button">
                      View
                    </button>
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

        <section id="process" className="section reveal" data-reveal>
          <div className="container">
            <div className="section-header">
              <div>
                <p className="eyebrow">Process</p>
                <h2>Structure first. Then the creative detail.</h2>
              </div>
              <p className="section-lead">
                A collaborative, rapid-feedback workflow that keeps every stakeholder aligned and
                each module production-ready.
              </p>
            </div>

            <div className="process-steps">
              <div className="reveal" data-reveal>
                <span>01</span>
                <h3>Align & map</h3>
                <p>Workshops, audits, and system mapping to define the brand logic.</p>
              </div>
              <div className="reveal" data-reveal>
                <span>02</span>
                <h3>Prototype & refine</h3>
                <p>Interactive modules built in Webflow with tested content hierarchy.</p>
              </div>
              <div className="reveal" data-reveal>
                <span>03</span>
                <h3>Launch & scale</h3>
                <p>Delivery playbooks, QA, and ongoing optimization support.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section highlight reveal" data-reveal>
          <div className="container">
            <div className="highlight-grid">
              <div>
                <p className="eyebrow">Testimonials</p>
                <h2>Teams stay aligned because the system stays sharp.</h2>
              </div>
              <div className="testimonial-stack">
                {testimonials.map((item) => (
                  <figure key={item.name} className="reveal" data-reveal>
                    <blockquote>{item.quote}</blockquote>
                    <figcaption>
                      <strong>{item.name}</strong>
                      <span>{item.role}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="insights" className="section reveal" data-reveal>
          <div className="container">
            <div className="section-header">
              <div>
                <p className="eyebrow">Insights</p>
                <h2>Editorial thinking for modern digital teams.</h2>
              </div>
              <a className="text-link" href="#contact">
                View all articles
              </a>
            </div>
            <div className="insight-grid">
              {insights.map((insight) => (
                <article key={insight.title} className="reveal" data-reveal>
                  <p>{insight.meta}</p>
                  <h3>{insight.title}</h3>
                  <button className="icon-button" type="button">
                    Read
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <ContactSectionEnhanced />
      </main>

      <footer className="site-footer reveal" data-reveal>
        <div className="container footer-grid">
          <div>
            <span className="brand-mark">AC</span>
            <div>
              <strong>Artemcv Studio</strong>
              <p>Strategic Webflow systems for modern teams.</p>
            </div>
          </div>
          <div className="footer-links">
            <a href="#services">Services</a>
            <a href="#work">Work</a>
            <a href="#process">Process</a>
            <a href="#contact">Contact</a>
          </div>
          <p className="footer-note">© 2026 Artemcv Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
