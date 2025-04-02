// utils/cache.js
const cache = {
    get: (key) => {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    },
    set: (key, value, ttl = 3600000) => {
      const item = {
        value,
        expiry: Date.now() + ttl
      };
      localStorage.setItem(key, JSON.stringify(item));
    }
  };
  
  // Usage in component:
  const cachedData = cache.get('content');
  if (cachedData) setTalks(cachedData.value);