import React from 'react';
import { Box, Typography, Button, useTheme, useMediaQuery, IconButton } from '@mui/material';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Explore as ExploreIcon,
  LibraryBooks as ContentIcon,
  Map as MapIcon,
  Search as PassionFinderIcon,
  Bolt as ActionIcon,
  Forum as ChatIcon,
  ArrowForward
} from '@mui/icons-material';


const onboardingSteps = [
  {
    title: "Explore Horizons",
    icon: <ExploreIcon sx={{ fontSize: 60 }} />,
    description: "Discover the vast landscape of social causes",
    path: '/',
    color: "#7C4DFF"
  },
  {
    title: "Content Library",
    icon: <ContentIcon sx={{ fontSize: 60 }} />,
    description: "Access curated videos, articles, and resources",
    path: '/content',
    color: "#2196F3"
  },
  {
    title: "Global Connections",
    icon: <MapIcon sx={{ fontSize: 60 }} />,
    description: "Find like-minded activists worldwide",
    path: '/map',
    color: "#4CAF50"
  },
  {
    title: "Find Your Passion",
    icon: <PassionFinderIcon sx={{ fontSize: 60 }} />,
    description: "Discover what moves you through our interactive quiz",
    path: '/passion-finder',
    color: "#FF5722"
  },
  {
    title: "Take Action",
    icon: <ActionIcon sx={{ fontSize: 60 }} />,
    description: "Support causes through direct engagement",
    path: '/action',
    color: "#9C27B0",
    protected: true
  },
  {
    title: "Community Hub",
    icon: <ChatIcon sx={{ fontSize: 60 }} />,
    description: "Collaborate with change-makers in real-time",
    path: '/chat',
    color: "#FFC107",
    protected: true
  }
];

const FloatingParticle = ({ color }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  
  return (
    <motion.div
      style={{
        position: 'absolute',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        width: 150,
        height: 150,
        x,
        y,
        rotate,
        scale: 0.7,
        opacity: 0.3
      }}
      animate={{
        x: [0, 100, -50, 0],
        y: [0, -80, 100, 0],
        rotate: [0, 180, 360],
        scale: [0.7, 1.2, 0.7],
        opacity: [0.3, 0.8, 0.3]
      }}
      transition={{
        duration: Math.random() * 10 + 10,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'anticipate'
      }}
    />
  );
};


const Onboarding = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleStepClick = (path, requiresAuth) => {
    if (requiresAuth && !user) {
      navigate('/login', { state: { from: path } });
    } else {
      navigate(path);
    }
  };
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (event) => {
    mouseX.set(event.clientX);
    mouseY.set(event.clientY);
  };

  const backgroundX = useTransform(mouseX, [0, window.innerWidth], [-50, 50]);
  const backgroundY = useTransform(mouseY, [0, window.innerHeight], [-50, 50]);

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: theme.palette.mode === 'dark' 
          ? 'radial-gradient(circle at center, #0f0c29 0%, #302b63 50%, #24243e 100%)' 
          : 'radial-gradient(circle at center, #f5f7fa 0%, #c3cfe2 100%)',
        cursor: 'grab',
        '&:active': { cursor: 'grabbing' }
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Elements */}
      <motion.div 
        style={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(45deg, #7C4DFF22, #2196F322, #FF572222)'
            : 'linear-gradient(45deg, #7C4DFF11, #2196F311, #FF572211)',
          x: backgroundX,
          y: backgroundY,
          rotate: 45
        }}
      />
      
      <AnimatePresence>
        {[...Array(15)].map((_, i) => (
          <FloatingParticle 
            key={i}
            color={theme.palette.mode === 'dark' 
              ? `hsl(${i * 25}, 70%, 50%)`
              : `hsl(${i * 25}, 70%, 70%)`}
          />
        ))}
      </AnimatePresence>

      {/* Interactive Light Beam */}
      <motion.div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at ${mouseX}px ${mouseY}px, 
            ${theme.palette.mode === 'dark' ? '#7C4DFF22' : '#2196F311'} 0%, 
            transparent 80%)`,
          pointerEvents: 'none'
        }}
      />

      {/* Warping Grid */}
      <motion.div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            ${theme.palette.mode === 'dark' ? '#7C4DFF22' : '#2196F311'} 10px,
            ${theme.palette.mode === 'dark' ? '#7C4DFF22' : '#2196F311'} 20px
          )`,
          x: useTransform(mouseX, [0, window.innerWidth], [-20, 20]),
          y: useTransform(mouseY, [0, window.innerHeight], [-20, 20])
        }}
      />

      {/* Main Content Container */}
      <Box sx={{
        position: 'relative',
        zIndex: 2,
        maxWidth: 1200,
        margin: 'auto',
        p: 4,
        pt: 12
      }}>
        {/* Animated Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography variant="h2" sx={{
            fontSize: isMobile ? '2.5rem' : '4rem',
            fontWeight: 900,
            mb: 2,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #7C4DFF, #2196F3, #FF5722)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: '"Space Mono", monospace',
            textShadow: '0 0 20px rgba(124,77,255,0.3)'
          }}>
            Enter The Matrix
          </Typography>
          
          <motion.div
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Typography variant="h5" sx={{
              mb: 6,
              fontWeight: 300,
              fontSize: isMobile ? '1.2rem' : '1.5rem',
              textAlign: 'center',
              maxWidth: 800,
              mx: 'auto',
              background: 'linear-gradient(45deg, #fff, #aaa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Choose your path to social revolution
            </Typography>
          </motion.div>
        </motion.div>

        {/* Steps Grid */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 4,
          mb: 8
        }}>
          {onboardingSteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box 
                onClick={() => handleStepClick(step.path, step.protected)}
                sx={{
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(25,25,36,0.5)'
                    : 'rgba(255,255,255,0.5)',
                  borderRadius: 4,
                  p: 4,
                  height: '100%',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${theme.palette.mode === 'dark' 
                    ? 'rgba(124,77,255,0.3)' 
                    : 'rgba(33,150,243,0.3)'}`,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: `0 0 30px ${step.color}44`
                  }
                }}
              >
                {/* Hover Effect Layer */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: mouseY,
                    left: mouseX,
                    background: `radial-gradient(circle, ${step.color}44 0%, transparent 70%)`,
                    width: 200,
                    height: 200,
                    x: '-50%',
                    y: '-50%',
                    pointerEvents: 'none'
                  }}
                />

                {/* Glow Border */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: -1,
                    left: -1,
                    right: -1,
                    bottom: -1,
                    borderRadius: 4,
                    border: `2px solid ${step.color}`,
                    opacity: 0,
                    boxShadow: `0 0 20px ${step.color}`
                  }}
                  animate={{
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />

                {/* Step Content */}
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 3,
                  position: 'relative',
                  zIndex: 1
                }}>
                  {/* Icon Container */}
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      y: [0, -5, 5, 0]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity
                    }}
                  >
                    <Box sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}80 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 3,
                      boxShadow: `0 0 20px ${step.color}44`
                    }}>
                      {step.icon}
                    </Box>
                  </motion.div>
                  
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700,
                    color: step.color,
                    textShadow: `0 0 10px ${step.color}44`
                  }}>
                    {step.label || step.title}
                  </Typography>
                </Box>

                <Typography variant="body1" sx={{ 
                  mb: 3,
                  color: theme.palette.text.secondary
                }}>
                  {step.description}
                </Typography>

                <motion.div
                  animate={{
                    x: [0, 10, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  <IconButton sx={{
                    background: `linear-gradient(45deg, ${step.color}, ${step.color}cc)`,
                    color: '#fff',
                    '&:hover': {
                      boxShadow: `0 0 15px ${step.color}`
                    }
                  }}>
                    <ArrowForward />
                  </IconButton>
                </motion.div>
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* Auth Section */}
        {!user && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 1, -1, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity
              }}
            >
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(45deg, #7C4DFF, #2196F3)',
                  color: '#fff',
                  fontSize: '1.2rem',
                  px: 6,
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 900,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  boxShadow: '0 0 30px #7C4DFF44',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #6a3dcc, #1e88e5)',
                    boxShadow: '0 0 40px #7C4DFF66'
                  }
                }}
              >
                Initiate Sequence
              </Button>
            </motion.div>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Onboarding;