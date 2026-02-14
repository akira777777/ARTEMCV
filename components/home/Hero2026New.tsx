'use client'

import React, { Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Code2, Rocket } from 'lucide-react'
import { MagneticButton } from '../MagneticButton'
import { Scene } from '../scene/Scene3D'

export function Hero2026New() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* 3D Background Scene */}
      <div className="absolute inset-0 -z-10">
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />}>
          <Scene />
        </Suspense>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] -z-10" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--primary),transparent_95%)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--primary),transparent_95%)_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10" />

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center"
      >
        {/* Badge */}
        <motion.div
          variants={fadeInUp}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Welcome to the Future</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={fadeInUp}
          className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 text-balance"
        >
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Building
          </span>
          <br />
          <span className="text-foreground">Tomorrow's</span>
          <br />
          <span className="bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent">
            Experiences
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={fadeInUp}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-balance leading-relaxed"
        >
          Transforming bold ideas into stunning digital realities through cutting-edge
          technology and innovative design
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Primary Button with Gradient */}
          <MagneticButton
            className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] hover:scale-105"
            onClick={() => console.log('View Work clicked')}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              View My Work
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </MagneticButton>

          {/* Outline Button with Glassmorphism */}
          <MagneticButton
            className="group relative px-8 py-4 rounded-full bg-background/20 backdrop-blur-md border-2 border-primary/30 text-foreground font-semibold text-lg overflow-hidden transition-all duration-300 hover:border-primary/60 hover:bg-background/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
            onClick={() => console.log('Get in Touch clicked')}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              Get in Touch
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            {/* Glass reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </MagneticButton>
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          variants={fadeInUp}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            { label: 'Projects Completed', value: '50+' },
            { label: 'Years Experience', value: '8+' },
            { label: 'Happy Clients', value: '100+' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative p-6 rounded-2xl bg-background/40 backdrop-blur-md border border-primary/10 hover:border-primary/30 transition-all duration-300"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ height: ['20%', '80%', '20%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 bg-primary rounded-full"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
