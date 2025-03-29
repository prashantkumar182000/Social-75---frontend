// src/utils/helpers.js
export const getRandomImage = (id) => {
  const seeds = ['nature', 'technology', 'education', 'health', 'community'];
  const randomSeed = seeds[id % seeds.length] || Math.random().toString(36);
  return `https://picsum.photos/seed/${randomSeed}-${id}/400/300`;
};