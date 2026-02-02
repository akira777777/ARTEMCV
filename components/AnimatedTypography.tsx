import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterProps {
  texts: string[];
  speed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
}

export const TypewriterText: React.FC<TypewriterProps> = ({
  texts,
  speed = 100,
  pauseDuration = 1500,
  className = "",
  cursorClassName = ""
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentText = texts[currentTextIndex];
    
    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        if (charIndex < currentText.length) {
          setDisplayText(currentText.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          // Finished typing, pause then delete
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Deleting backward
        if (charIndex > 0) {
          setDisplayText(currentText.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, texts, currentTextIndex, speed, pauseDuration]);

  return (
    <div className={`relative inline-block ${className}`}>
      <span>{displayText}</span>
      <motion.span
        className={`inline-block ml-1 w-1 h-8 bg-emerald-400 ${cursorClassName}`}
        animate={{
          opacity: [1, 0],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
};

// Animated counter component
interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<CounterProps> = ({
  end,
  duration = 2000,
  suffix = "",
  className = ""
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Cubic easing
      const currentValue = Math.floor(easedProgress * end);
      
      setCount(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span className={`font-black ${className}`}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

// Gradient text with animated underline
interface AnimatedTitleProps {
  children: React.ReactNode;
  className?: string;
  underlineColor?: string;
}

export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  children,
  className = "",
  underlineColor = "from-emerald-500 to-cyan-500"
}) => {
  return (
    <motion.h2
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <span className="gradient-text">{children}</span>
      <motion.div
        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${underlineColor}`}
        initial={{ width: 0 }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </motion.h2>
  );
};

// Staggered reveal for lists
interface StaggeredListProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggeredList: React.FC<StaggeredListProps> = ({
  children,
  className = "",
  staggerDelay = 0.1
}) => {
  const childrenArray = React.Children.toArray(children);
  
  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <motion.div
          key={index}
          className="staggered-reveal"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.6, 
            delay: index * staggerDelay,
            ease: "easeOut"
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};