import React, { useRef, useState } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';

interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    strength?: number; // How strong the magnetic pull is
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
    children,
    className = '',
    onClick,
    strength = 30 // Default strength
}) => {
    const ref = useRef<HTMLButtonElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Physics for smooth movement
    const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseMove = (data: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;
        const { clientX, clientY } = data;
        const { height, width, left, top } = ref.current.getBoundingClientRect();

        // Calculate center of button
        const centerX = left + width / 2;
        const centerY = top + height / 2;

        // Calculate distance from center
        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;

        // Apply strength factor
        x.set(distanceX / (100 / strength));
        y.set(distanceY / (100 / strength));
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            ref={ref}
            className={`relative inline-flex items-center justify-center ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            style={{ x: springX, y: springY }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Content wrapper for isolated movement if needed later */}
            <span className="relative z-10 pointer-events-none">
                {children}
            </span>

            {/* Optional: Add a glow or background effect behind if desired */}
        </motion.button>
    );
};
