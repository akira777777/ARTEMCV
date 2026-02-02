/**
 * @deprecated This component is not used. Use BaseLayout or DefaultLayout instead.
 * TODO: Remove this file in next cleanup.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Zap, Users, Rocket, Shield, TrendingUp } from 'lucide-react';

interface FramerLayoutProps {
  className?: string;
}

const FramerLayout: React.FC<FramerLayoutProps> = ({ className = '' }) => {
  return (
    <section 
      id="framer-layout" 
      className={`relative min-h-screen py-20 px-6 overflow-hidden ${className}`}
      aria-label="Framer-inspired landing page"
    >
      {/* Background with existing color scheme */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-teal-900/15 to-orange-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(16,185,129,0.15),transparent_50%),radial-gradient(ellipse_at_70%_70%,rgba(245,158,11,0.12),transparent_50%)]" />
      </div>

      {/* Aurora effect layer */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(16,185,129,0.1)_25%,rgba(6,182,212,0.12)_50%,rgba(245,158,11,0.08)_75%,transparent_100%)] animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Hero Section - Framer-inspired */}
        <div className="text-center mb-20 animate-fade-up">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 via-teal-400 to-orange-400 bg-clip-text text-transparent">
              Full Stack Developer & Designer
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
              Engineering high-performance web applications where motion meets scalability. 
              Focused on React 19 and resilient architecture.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button 
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 neon-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book A Free Call
              </motion.button>
              
              <motion.button 
                className="px-8 py-4 border-2 border-teal-400 text-teal-400 font-semibold rounded-full hover:bg-teal-400 hover:text-gray-900 transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Projects
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Stats Section - Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { value: '39%', label: 'Performance Improvement', description: 'Reduction in load times', icon: Zap },
            { value: '49%', label: 'Efficiency Boost', description: 'Increased development speed', icon: TrendingUp },
            { value: '2.3x', label: 'Scalability', description: 'Enhanced system capacity', icon: Rocket }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="glass-card-modern p-8 text-center border border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:-translate-y-2 hover:scale-105"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index, duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <stat.icon className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <div className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{stat.label}</h3>
              <p className="text-gray-400">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Process Section */}
        <div className="mb-20">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Our Simple & Smart Process
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                step: 'STEP 1', 
                title: 'Discovery & Research', 
                description: 'Understanding your vision and technical requirements through deep analysis.',
                icon: '🔍',
                color: 'border-orange-500'
              },
              { 
                step: 'STEP 2', 
                title: 'Design & Architecture', 
                description: 'Creating robust systems with cutting-edge technology and scalable solutions.',
                icon: '⚙️',
                color: 'border-teal-500'
              },
              { 
                step: 'STEP 3', 
                title: 'Build & Deploy', 
                description: 'Bringing ideas to life with precision engineering and continuous optimization.',
                icon: '🚀',
                color: 'border-green-500'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                className={`glass-card-modern p-6 ${step.color} hover:${step.color.replace('border-', 'border-').replace('-500', '-400')} transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                whileHover={{ x: -4, y: -4 }}
              >
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{step.icon}</span>
                  <span className="text-sm font-semibold text-orange-400 tracking-wider">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {[
            {
              title: 'Workflow Automation',
              description: 'Streamline processes with intelligent automation solutions tailored to your business needs.',
              icon: '🔄',
              color: 'from-green-500 to-teal-500'
            },
            {
              title: 'AI-Powered Solutions',
              description: 'Leverage cutting-edge artificial intelligence to drive innovation and competitive advantage.',
              icon: '🤖',
              color: 'from-teal-500 to-cyan-500'
            },
            {
              title: 'Seamless Integration',
              description: 'Connect your existing systems with modern APIs and microservices architecture.',
              icon: '🔗',
              color: 'from-orange-500 to-amber-500'
            },
            {
              title: 'Performance Optimization',
              description: 'Supercharge your applications with advanced optimization techniques and monitoring.',
              icon: '⚡',
              color: 'from-purple-500 to-pink-500'
            },
            {
              title: 'Security First',
              description: 'Enterprise-grade security protocols and compliance standards built into every solution.',
              icon: '🛡️',
              color: 'from-blue-500 to-indigo-500'
            },
            {
              title: 'Scalable Architecture',
              description: 'Future-proof systems designed to grow with your business demands and user base.',
              icon: '📊',
              color: 'from-emerald-500 to-green-500'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="glass-card-modern p-6 group hover:border-green-400/50 transition-all duration-300 hover:-translate-y-2 hover:scale-105"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="glass-card-modern p-12 max-w-4xl mx-auto border border-gradient-to-r from-green-500/30 via-teal-500/30 to-orange-500/30 hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 via-teal-400 to-orange-400 bg-clip-text text-transparent">
              Ready to Transform Your Digital Presence?
            </h2>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's build something extraordinary together. Schedule a free consultation to discuss your project vision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button 
                className="px-8 py-4 bg-gradient-to-r from-green-500 via-teal-500 to-orange-500 text-white font-bold rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105 text-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Project
              </motion.button>
              
              <motion.button 
                className="px-8 py-4 border-2 border-teal-400 text-teal-400 font-semibold rounded-full hover:bg-teal-400 hover:text-gray-900 transition-all duration-300 hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 blob-bg bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full" />
      <div className="absolute bottom-20 right-10 w-48 h-48 blob-bg bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full" />
      
      {/* Interactive grid dots */}
      <div className="absolute inset-0 interactive-grid opacity-20" />
    </section>
  );
};

export default FramerLayout;