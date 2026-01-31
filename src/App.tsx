import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './components/ProjectCard';
import ParticleField from './components/ParticleField';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

const PortfolioPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const projects = [
    {
      id: 1,
      title: "Detailing Hub 3D",
      description: "Interactive 3D car configurator using React Three Fiber",
      tech: ["React", "Three.js", "R3F", "GLSL", "GSAP"],
      impact: "Reduced user bounce rate by 35%",
      gradient: "from-blue-500 to-purple-600",
      icon: "🚗",
      link: "/detailing-hub"
    },
    {
      id: 2,
      title: "Dental Clinic Ecosystem",
      description: "AI-powered appointment orchestration and diagnostic visualization",
      tech: ["Next.js", "WebSockets", "AI/ML", "Real-time"],
      impact: "40% increase in online booking conversions",
      gradient: "from-pink-500 to-red-500",
      icon: "🦷",
      link: "/dental-ecosystem"
    },
    {
      id: 3,
      title: "The Barbershop Grid",
      description: "Magnetic scroll-driven gallery with dynamic layout shifts",
      tech: ["React", "Framer Motion", "Edge Runtime", "GSAP"],
      impact: "Optimized image delivery for <100ms LCP",
      gradient: "from-yellow-500 to-orange-500",
      icon: "✂️",
      link: "/barbershop-grid"
    }
  ];

  const skills = {
    frontend: ["Next.js 16", "Three.js/R3F", "Framer Motion", "GSAP", "Tailwind CSS"],
    backend: ["Go (Golang)", "PostgreSQL", "Edge Runtime", "Real-time Data Sync"],
    infrastructure: ["AWS Lambda", "OpenAI API", "CI/CD", "Serverless"]
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Generative Particle Background */}
      <ParticleField mousePosition={mousePosition} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex justify-between items-center py-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            Artem Mikhailov
          </motion.div>
          
          <div className="flex space-x-6">
            <a href="#projects" className="text-muted-foreground hover:text-foreground transition-colors">Projects</a>
            <a href="#skills" className="text-muted-foreground hover:text-foreground transition-colors">Skills</a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="py-20">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Engineer-Product-Designer
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-muted-foreground mb-8 leading-relaxed"
            >
              I build high-performance digital experiences where precision engineering meets immersive design. 
              Specializing in Next.js, Three.js, and AI-driven SaaS, I bridge the gap between complex backend 
              logic and fluid, interactive frontends.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center space-x-4"
            >
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity glow-on-hover">
                View Projects
              </button>
              <button className="px-8 py-3 border border-border rounded-lg font-semibold text-foreground hover:bg-muted transition-colors">
                Contact Me
              </button>
            </motion.div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tech Stack 2026</h2>
            <p className="text-muted-foreground">Cutting-edge technologies I specialize in</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(skills).map(([category, items]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-card p-6 rounded-xl border border-border"
              >
                <h3 className="text-xl font-semibold mb-4 capitalize">{category}</h3>
                <div className="space-y-2">
                  {items.map((tech) => (
                    <div key={tech} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
            <p className="text-muted-foreground">Innovative solutions that drive impact</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard 
                key={project.id}
                project={project}
                delay={index * 0.1}
              />
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Let's Build Something Amazing</h2>
            <p className="text-muted-foreground mb-8">
              Interested in collaborating or learning more about my work?
            </p>
            <div className="flex justify-center space-x-6">
              <a 
                href="mailto:artem@example.com" 
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
              >
                <Mail className="w-4 h-4" />
                <span>Get In Touch</span>
              </a>
              <a 
                href="#" 
                className="flex items-center space-x-2 px-6 py-3 border border-border rounded-lg font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Resume</span>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-muted-foreground border-t border-border">
          <p>&copy; 2026 Artem Mikhailov. Crafted with precision and passion.</p>
        </footer>
      </div>
    </div>
  );
};

export default PortfolioPage;