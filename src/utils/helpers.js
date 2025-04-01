// src/utils/helpers.js
export const getRandomImage = (id) => {
  const seeds = ['nature', 'technology', 'education', 'health', 'community'];
  const randomSeed = seeds[id % seeds.length] || Math.random().toString(36);
  return `https://picsum.photos/seed/${randomSeed}-${id}/400/300`;
};

export const getInterestColor = (interest) => {
  const colors = {
    climate: 'green',
    education: 'orange',
    health: 'red',
    social: 'violet',
    technology: 'blue'
  };
  
  if (interest.toLowerCase().includes('climate')) return 'green';
  if (interest.toLowerCase().includes('educate')) return 'orange';
  if (interest.toLowerCase().includes('health')) return 'red';
  if (interest.toLowerCase().includes('social')) return 'violet';
  if (interest.toLowerCase().includes('tech')) return 'blue';
  return 'green'; // default
};

export const getCategoryColor = (category) => {
  const colors = {
    environment: '#4CAF50',
    education: '#FF9800',
    social: '#F44336',
    health: '#9C27B0',
    technology: '#2196F3',
    default: '#607D8B'
  };
  return colors[category] || colors.default;
};