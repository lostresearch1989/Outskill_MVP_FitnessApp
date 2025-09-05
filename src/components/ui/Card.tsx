import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  onClick 
}) => {
  const cardClasses = `
    bg-white rounded-2xl shadow-lg border border-gray-100 
    transition-all duration-300 overflow-hidden
    ${hover ? 'hover:shadow-xl hover:border-gray-200 cursor-pointer' : ''}
    ${className}
  `;

  const CardComponent = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { y: -2, scale: 1.01 },
    whileTap: { scale: 0.99 },
    onClick,
  } : {};

  return (
    <CardComponent 
      className={cardClasses}
      {...motionProps}
    >
      {children}
    </CardComponent>
  );
};