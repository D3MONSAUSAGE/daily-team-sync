
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FramerTreeAnimation from './FramerTreeAnimation';
import FramerFlowerAnimation from './FramerFlowerAnimation';
import FramerCityAnimation from './FramerCityAnimation';
import FramerOceanAnimation from './FramerOceanAnimation';
import FramerSpaceAnimation from './FramerSpaceAnimation';
import FramerParticleSystem from './FramerParticleSystem';
import { shouldReduceMotion } from './AnimationUtils';

interface FramerAnimationControllerProps {
  progress: number;
  animationType: 'tree' | 'flower' | 'city' | 'ocean' | 'space';
  isActive: boolean;
}

const FramerAnimationController: React.FC<FramerAnimationControllerProps> = ({
  progress,
  animationType,
  isActive
}) => {
  const reducedMotion = shouldReduceMotion();
  const stage = progress === 0 ? 'seed' : progress < 100 ? 'growing' : 'complete';

  if (reducedMotion) {
    // Fallback to basic animation for reduced motion
    const fallbackEmojis = {
      tree: { seed: '🌱', growing: '🌿', complete: '🌳' },
      flower: { seed: '🌱', growing: '🌺', complete: '🌸' },
      city: { seed: '🏗️', growing: '🏢', complete: '🏙️' },
      ocean: { seed: '💧', growing: '🪸', complete: '🌊' },
      space: { seed: '☄️', growing: '🪐', complete: '🌌' }
    };
    
    const emoji = fallbackEmojis[animationType][stage];
    
    return (
      <div className="w-full h-full bg-gradient-to-b from-sky-200 to-sky-100 rounded-xl overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl">
            {emoji}
          </div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const getBackgroundGradient = () => {
    switch (animationType) {
      case 'flower':
        return isActive 
          ? [
              'linear-gradient(to bottom, #fdf2f8, #fce7f3)',
              'linear-gradient(to bottom, #fef3f2, #fed7d7)', 
              'linear-gradient(to bottom, #fdf2f8, #fce7f3)'
            ]
          : 'linear-gradient(to bottom, #fdf2f8, #fce7f3)';
      case 'city':
        return isActive 
          ? [
              'linear-gradient(to bottom, #eff6ff, #dbeafe)',
              'linear-gradient(to bottom, #f0f9ff, #e0f2fe)', 
              'linear-gradient(to bottom, #eff6ff, #dbeafe)'
            ]
          : 'linear-gradient(to bottom, #eff6ff, #dbeafe)';
      case 'ocean':
        return isActive 
          ? [
              'linear-gradient(to bottom, #0c4a6e, #0369a1)',
              'linear-gradient(to bottom, #164e63, #0891b2)', 
              'linear-gradient(to bottom, #0c4a6e, #0369a1)'
            ]
          : 'linear-gradient(to bottom, #0c4a6e, #0369a1)';
      case 'space':
        return isActive 
          ? [
              'linear-gradient(to bottom, #1e1b4b, #312e81)',
              'linear-gradient(to bottom, #581c87, #7c3aed)', 
              'linear-gradient(to bottom, #1e1b4b, #312e81)'
            ]
          : 'linear-gradient(to bottom, #1e1b4b, #312e81)';
      default: // tree
        return isActive 
          ? [
              'linear-gradient(to bottom, #e0f2fe, #bae6fd)',
              'linear-gradient(to bottom, #dbeafe, #bfdbfe)', 
              'linear-gradient(to bottom, #e0f2fe, #bae6fd)'
            ]
          : 'linear-gradient(to bottom, #e0f2fe, #bae6fd)';
    }
  };

  const backgroundVariants = {
    animate: {
      background: getBackgroundGradient(),
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const getParticleTheme = () => {
    switch (animationType) {
      case 'flower':
        return 'garden';
      case 'city':
        return 'city';
      case 'ocean':
        return 'ocean';
      case 'space':
        return 'space';
      default:
        return 'forest';
    }
  };

  return (
    <motion.div 
      className="relative w-full h-80 rounded-xl overflow-hidden cursor-pointer"
      variants={backgroundVariants}
      animate="animate"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={animationType}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Render the appropriate animation based on type */}
          {animationType === 'tree' && (
            <FramerTreeAnimation 
              progress={progress}
              isActive={isActive}
            />
          )}
          
          {animationType === 'flower' && (
            <FramerFlowerAnimation 
              progress={progress}
              isActive={isActive}
            />
          )}

          {animationType === 'city' && (
            <FramerCityAnimation 
              progress={progress}
              isActive={isActive}
            />
          )}

          {animationType === 'ocean' && (
            <FramerOceanAnimation 
              progress={progress}
              isActive={isActive}
            />
          )}

          {animationType === 'space' && (
            <FramerSpaceAnimation 
              progress={progress}
              isActive={isActive}
            />
          )}

          {/* Enhanced Particle System */}
          <FramerParticleSystem 
            isActive={isActive} 
            stage={stage} 
            theme={getParticleTheme()}
            progress={progress}
            intensity={progress < 30 ? 'low' : progress < 70 ? 'medium' : 'high'}
          />

          {/* Interactive Click Effect */}
          {isActive && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                background: [
                  'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0) 0%, rgba(34, 197, 94, 0) 100%)',
                  'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0) 70%)',
                  'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0) 0%, rgba(34, 197, 94, 0) 100%)'
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Camera shake effect for milestones */}
      {(progress === 25 || progress === 50 || progress === 75 || progress === 100) && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            x: [0, -2, 2, -1, 1, 0],
            y: [0, 1, -1, 2, -2, 0]
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};

export default FramerAnimationController;
