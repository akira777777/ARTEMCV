/**
 * @deprecated This component is not imported anywhere.
 * TODO: Consider integrating into UI or remove in next cleanup.
 */
import React, { useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { useReducedMotion } from '../lib/hooks';

type RevealMode = 'letters' | 'words' | 'lines';

interface TextRevealProps {
  text: string;
  mode?: RevealMode;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const letterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    rotateX: -90,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: 'spring',
      damping: 12,
      stiffness: 200,
    },
  },
};

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 100,
    },
  },
};

const lineVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    skewY: 3,
  },
  visible: {
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 80,
    },
  },
};

const TextReveal: React.FC<TextRevealProps> = ({
  text,
  mode = 'words',
  className = '',
  delay = 0,
  staggerDelay = 0.03,
  once = true,
  as = 'div',
}) => {
  const prefersReducedMotion = useReducedMotion();

  const elements = useMemo(() => {
    switch (mode) {
      case 'letters':
        return text.split('').map((char, i) => ({
          key: `${char}-${i}`,
          content: char === ' ' ? '\u00A0' : char,
        }));
      case 'words':
        return text.split(' ').map((word, i) => ({
          key: `${word}-${i}`,
          content: word,
        }));
      case 'lines':
        return text.split('\n').map((line, i) => ({
          key: `${line}-${i}`,
          content: line,
        }));
      default:
        return [{ key: 'text', content: text }];
    }
  }, [text, mode]);

  const getVariants = () => {
    switch (mode) {
      case 'letters':
        return letterVariants;
      case 'words':
        return wordVariants;
      case 'lines':
        return lineVariants;
      default:
        return wordVariants;
    }
  };

  const customContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  // If reduced motion, render static text
  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      className={`${className} ${mode === 'letters' ? 'inline-flex flex-wrap' : ''}`}
      variants={customContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px' }}
      style={{ perspective: 1000 }}
    >
      {elements.map(({ key, content }, index) => (
        <motion.span
          key={key}
          variants={getVariants()}
          className={`inline-block ${mode === 'words' ? 'mr-[0.25em]' : ''}`}
          style={{ 
            transformStyle: 'preserve-3d',
            display: mode === 'lines' ? 'block' : 'inline-block',
          }}
        >
          {content}
        </motion.span>
      ))}
    </MotionTag>
  );
};

// Specialized components for common use cases
export const RevealHeading: React.FC<Omit<TextRevealProps, 'as'> & { level?: 1 | 2 | 3 | 4 }> = ({
  level = 2,
  ...props
}) => {
  const tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
  return <TextReveal {...props} as={tag} mode="words" />;
};

export const RevealParagraph: React.FC<Omit<TextRevealProps, 'as' | 'mode'>> = (props) => {
  return <TextReveal {...props} as="p" mode="words" staggerDelay={0.02} />;
};

export default TextReveal;
