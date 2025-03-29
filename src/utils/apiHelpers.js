import { dummyNGOs, dummyTalks } from './dummyData';

export const fetchWithFallback = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    return data.length > 0 ? data : null;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};

export const getNGOs = async () => {
  const liveData = await fetchWithFallback('https://socio-99.onrender.com/api/action-hub');
  return liveData || dummyNGOs;
};

export const getTalks = async () => {
  const liveData = await fetchWithFallback('https://socio-99.onrender.com/api/content');
  return liveData || dummyTalks;
};