'use client';

import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = true, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -6, transition: { duration: 0.2 } } : {}}
      className={`bg-dark-card border border-dark-border rounded-2xl p-6 transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}