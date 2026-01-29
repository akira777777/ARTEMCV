'use client';

import { Project } from '@/lib/constants';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import Image from 'next/image';
import { MouseEvent } from 'react';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

export function ProjectCard({ project, className }: { project: Project; className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative rounded-3xl border border-white/10 bg-white/5 overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(168, 85, 247, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative h-full flex flex-col p-6 z-10">
        <div className="relative w-full h-48 mb-6 rounded-2xl overflow-hidden">
           <Image
             src={project.image}
             alt={project.title}
             fill
             className="object-cover group-hover:scale-105 transition-transform duration-500"
           />
        </div>

        <h3 className="text-2xl font-bold mb-2 text-white">{project.title}</h3>
        <p className="text-gray-400 mb-4 line-clamp-3 flex-grow">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech) => (
            <span key={tech} className="px-3 py-1 text-xs rounded-full bg-white/10 text-white/80">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-4 mt-auto">
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium hover:text-purple-400 transition-colors"
            >
              <FiExternalLink /> Live Demo
            </a>
          )}
          {project.githubLink && project.githubLink !== '#' && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium hover:text-purple-400 transition-colors"
            >
              <FiGithub /> Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
