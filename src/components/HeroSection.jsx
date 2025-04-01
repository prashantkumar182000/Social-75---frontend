import React from 'react';
import { Box, Typography, Button, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';

// Premium font styling with Clash Display + Satoshi combo
const PremiumTypography = ({ children, variant = 'h1', shadow = true, glow = false, ...props }) => (
  <Typography
    variant={variant}
    sx={{
      fontFamily: '"Clash Display", -apple-system, BlinkMacSystemFont, sans-serif',
      letterSpacing: variant === 'h1' ? '-0.05em' : '0.02em',
      lineHeight: 1.1,
      textShadow: shadow ? '0 4px 20px rgba(0,0,0,0.25)' : 'none',
      position: 'relative',
      ...(glow && {
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, #6366F1 0%, #EC4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          zIndex: -1,
          filter: 'blur(15px)',
          opacity: 0.7
        }
      }),
      ...props.sx
    }}
    {...props}
  >
    {children}
  </Typography>
);

const HeroSection = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Premium color scheme
  const bgGradient = 'linear-gradient(152deg, #0A0A12 0%, #1A1A2E 100%)';

  // Parallax effects
  const backgroundX = useTransform(mouseX, [0, window.innerWidth], [-30, 30]);
  const backgroundY = useTransform(mouseY, [0, window.innerHeight], [-30, 30]);

  return (
    <Box 
      component={motion.div}
      onMouseMove={(e) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      }}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: bgGradient,
        position: 'relative',
        overflow: 'hidden',
        px: isMobile ? 4 : 8,
        py: 12
      }}
    >
      {/* Dynamic grid background */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200%',
          height: '200%',
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          x: backgroundX,
          y: backgroundY,
          zIndex: 0
        }}
      />

      {/* Floating energy spheres */}
      {[
        { size: 400, color: 'rgba(79, 70, 229, 0.15)', x: '10%', y: '20%' },
        { size: 600, color: 'rgba(236, 72, 153, 0.1)', x: '80%', y: '50%' },
        { size: 300, color: 'rgba(167, 139, 250, 0.12)', x: '30%', y: '70%' }
      ].map((orb, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            borderRadius: '50%',
            x: orb.x,
            y: orb.y,
            filter: 'blur(60px)'
          }}
          animate={{
            x: [orb.x, `calc(${orb.x} + 5%)`, orb.x],
            y: [orb.y, `calc(${orb.y} + 3%)`, orb.y],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      ))}

      {/* Content */}
      <Box sx={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1200px',
        mx: 'auto',
        textAlign: 'center'
      }}>
        {/* Social 75 Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: '2rem' }}
        >
          <PremiumTypography 
            variant="h3"
            glow
            sx={{
              fontSize: isMobile ? '1.8rem' : '2.5rem',
              background: 'linear-gradient(90deg, #A5B4FC 0%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <motion.span
              animate={{ 
                rotate: [0, 15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 5,
                repeat: Infinity
              }}
            >
              ✨
            </motion.span>
            SOCIAL 75
            <motion.span
              animate={{ 
                rotate: [0, -15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                delay: 2
              }}
            >
              ✨
            </motion.span>
          </PremiumTypography>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <PremiumTypography 
            variant="h5"
            sx={{
              color: '#A5B4FC',
              mb: 2,
              fontWeight: 600,
              letterSpacing: '4px',
              fontFamily: '"Satoshi", sans-serif'
            }}
          >
            THE FUTURE OF ACTIVISM
          </PremiumTypography>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <PremiumTypography 
            variant="h1"
            sx={{
              fontSize: isMobile ? '3.5rem' : '5.5rem',
              background: 'linear-gradient(90deg, #FFFFFF 30%, #A5B4FC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
              fontWeight: 700
            }}
          >
            Power Your Passion
          </PremiumTypography>
        </motion.div>

        {/* Subhead */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <PremiumTypography 
            variant="h4"
            shadow={false}
            sx={{
              color: 'rgba(255,255,255,0.85)',
              mb: 5,
              fontSize: isMobile ? '1.2rem' : '1.5rem',
              fontWeight: 400,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
              fontFamily: '"Satoshi", sans-serif'
            }}
          >
            Social 75 connects you with the tools, community, and resources to turn your 
            vision for change into reality. Join thousands of activists making an impact.
          </PremiumTypography>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Button
            component={Link}
            to="/onboarding"
            variant="contained"
            sx={{
              background: 'linear-gradient(90deg, #6366F1 0%, #A855F7 100%)',
              color: 'white',
              fontSize: '1.1rem',
              px: 6,
              py: 2,
              borderRadius: '12px',
              fontWeight: 600,
              letterSpacing: '1px',
              position: 'relative',
              overflow: 'hidden',
              border: 'none',
              boxShadow: '0 10px 30px rgba(99, 102, 241, 0.5)',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 15px 40px rgba(99, 102, 241, 0.7)',
                background: 'linear-gradient(90deg, #6366F1 0%, #EC4899 100%)'
              }
            }}
          >
            <motion.span
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%']
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'linear'
              }}
              style={{
                display: 'block',
                position: 'relative',
                zIndex: 2
              }}
            >
              JOIN THE MOVEMENT
            </motion.span>
            
            {/* Button shine effect */}
            <motion.div
              animate={{
                x: ['-100%', '150%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '50%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                transform: 'skewX(-20deg)'
              }}
            />
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ marginTop: '6rem' }}
        >
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? 3 : 6,
            flexWrap: 'wrap'
          }}>
            {[
              { value: '10K+', label: 'Activists' },
              { value: '500+', label: 'Organizations' },
              { value: '24/7', label: 'Support' }
            ].map((stat, i) => (
              <Box key={i} sx={{ textAlign: 'center' }}>
                <PremiumTypography 
                  variant="h2" 
                  sx={{ 
                    color: '#E0E7FF',
                    mb: 1,
                    fontSize: isMobile ? '2rem' : '3rem'
                  }}
                >
                  {stat.value}
                </PremiumTypography>
                <PremiumTypography 
                  variant="h6" 
                  shadow={false}
                  sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: '"Satoshi", sans-serif',
                    fontWeight: 500,
                    letterSpacing: '1px'
                  }}
                >
                  {stat.label}
                </PremiumTypography>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Box>

      {/* Scroll indicator */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3
        }}
        animate={{
          y: [0, 15, 0],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
      >
        <PremiumTypography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255,255,255,0.7)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: '"Satoshi", sans-serif',
            fontWeight: 500
          }}
        >
          <motion.div
            animate={{
              y: [0, 10, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity
            }}
          >
            ↓
          </motion.div>
          EXPLORE SOCIAL 75
        </PremiumTypography>
      </motion.div>
    </Box>
  );
};

export default HeroSection;