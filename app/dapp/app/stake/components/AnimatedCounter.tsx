"use clinent"
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  className = '' 
}) => {
    const [displayValue, setDisplayValue] = useState(0);
    const spring = useSpring(0, { 
        damping: 30,
        stiffness: 100 
    });
  
    const display = useTransform(spring, (current) => Math.floor(current));

    useEffect(() => {
        spring.set(value);
    }, [spring, value]);

    useEffect(() => {
        const unsubscribe = display.on('change', (latest) => {
            setDisplayValue(latest);
        });
        return unsubscribe;
    }, [display]);

    return (
        <motion.span
            key={value}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={className}
            >
            {displayValue.toLocaleString()}
        </motion.span>
    );
};

export default AnimatedCounter;