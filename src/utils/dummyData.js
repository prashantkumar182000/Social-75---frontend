// src/utils/dummyData.js
export const dummyNGOs = [
    {
      id: 1,
      name: "Green Earth Initiative",
      type: "NGO",
      mission: "Promoting sustainable environmental practices through community engagement and education.",
      location: "New Delhi, India",
      website: "https://greenearth.org",
      category: "environment"
    },
    {
      id: 2,
      name: "Education for All",
      type: "NGO",
      mission: "Providing free education and resources to underprivileged children across rural India.",
      location: "Mumbai, India",
      website: "https://edu4all.org",
      category: "education"
    },
    {
      id: 3,
      name: "Health Warriors",
      type: "NGO",
      mission: "Improving healthcare access in remote areas through mobile clinics and awareness programs.",
      location: "Chennai, India",
      website: "https://healthwarriors.in",
      category: "health"
    },
  ];
  
  export const dummyTalks = [
    {
      id: 1,
      title: "The real reason you feel so busy",
      speaker: "Dorie Clark",
      duration: 360,
      description: "These days, almost all of us feel pressed for time. Leadership expert Dorie Clark shares three hidden reasons people fall into an endless loop of feeling constantly busy, and invites you to question what really motivates how you spend your time.",
      url: "https://www.ted.com/talks/dorie_clark_the_real_reason_you_feel_so_busy_and_what_to_do_about_it"
    },
    {
      id: 2,
      title: "The benefits of not being a jerk to yourself",
      speaker: "Dan Harris",
      duration: 780,
      description: "After more than two decades as an anchor for ABC News, an on-air panic attack sent Dan Harris's life in a new direction: he became a dedicated meditator and, to some, even a guru. In a wise, funny talk, he shares his years-long quest to improve his relationships with everyone (starting with himself) and explains the science behind loving-kindness meditation, and how it can boost your resiliency.",
      url: "https://www.ted.com/talks/dan_harris_the_benefits_of_not_being_a_jerk_to_yourself"
    },
    {
      id: 3,
      title: "The habits of happiness",
      speaker: "Matthieu Ricard",
      duration: 1260,
      description: "What is happiness, and how can we all get some? Biochemist turned Buddhist monk Matthieu Ricard says we can train our minds in habits of well-being, to generate a true sense of serenity and fulfillment.",
      url: "https://www.ted.com/talks/matthieu_ricard_the_habits_of_happiness"
    },
  ];

  export const dummyMapUsers = [
    {
      id: '101',
      location: { lat: 28.6139, lng: 77.2090 },
      interest: "Urban tree planting",
      category: "environment",
      timestamp: "2023-10-15T09:30:00Z",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      connections: ['102', '201']
    },
    {
      id: '102',
      location: { lat: 19.0760, lng: 72.8777 },
      interest: "Beach cleanup initiatives",
      category: "environment",
      timestamp: "2023-11-02T14:15:00Z",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      connections: ['101']
    },
    {
      id: '201',
      location: { lat: 12.9716, lng: 77.5946 },
      interest: "STEM education for girls",
      category: "education",
      timestamp: "2023-09-28T10:45:00Z",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      id: '202',
      location: { lat: 17.3850, lng: 78.4867 },
      interest: "Digital literacy in villages",
      category: "education",
      timestamp: "2023-10-30T16:20:00Z",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    {
      id: '301',
      location: { lat: 22.5726, lng: 88.3639 },
      interest: "Gender equality workshops",
      category: "social",
      timestamp: "2023-11-10T11:00:00Z",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg"
    },
    {
      id: '302',
      location: { lat: 26.9124, lng: 75.7873 },
      interest: "Disability rights advocacy",
      category: "social",
      timestamp: "2023-10-22T13:45:00Z",
      avatar: "https://randomuser.me/api/portraits/men/81.jpg"
    },
    {
      id: '401',
      location: { lat: 8.5241, lng: 76.9366 },
      interest: "Mental health awareness",
      category: "health",
      timestamp: "2023-11-05T09:15:00Z",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
      id: '402',
      location: { lat: 25.5941, lng: 85.1376 },
      interest: "Rural healthcare access",
      category: "health",
      timestamp: "2023-10-18T15:30:00Z",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      id: '501',
      location: { lat: 13.0827, lng: 80.2707 },
      interest: "AI for agricultural solutions",
      category: "technology",
      timestamp: "2023-11-12T10:00:00Z",
      avatar: "https://randomuser.me/api/portraits/women/71.jpg"
    },
    {
      id: '502',
      location: { lat: 18.5204, lng: 73.8567 },
      interest: "Open-source social tools",
      category: "technology",
      timestamp: "2023-10-05T14:50:00Z",
      avatar: "https://randomuser.me/api/portraits/men/64.jpg"
    },
    {
      id: '601',
      location: { lat: 15.2993, lng: 74.1240 },
      interest: "Sustainable tourism",
      category: "environment",
      timestamp: "2023-11-08T12:30:00Z",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg"
    },
    {
      id: '602',
      location: { lat: 30.7333, lng: 76.7794 },
      interest: "Civic tech for transparency",
      category: "technology",
      timestamp: "2023-10-25T17:00:00Z",
      avatar: "https://randomuser.me/api/portraits/men/55.jpg"
    },
    {
      id: '603',
      location: { lat: 23.0225, lng: 72.5714 },
      interest: "Financial literacy programs",
      category: "education",
      timestamp: "2023-11-01T10:20:00Z",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg"
    },
    {
      id: '604',
      location: { lat: 26.8467, lng: 80.9462 },
      interest: "Menstrual hygiene education",
      category: "health",
      timestamp: "2023-10-14T11:45:00Z",
      avatar: "https://randomuser.me/api/portraits/women/19.jpg"
    }
  ];
  
  export const interestClusters = [
    { name: "Climate Action", count: 24, icon: "🌱", category: "environment" },
    { name: "Education Reform", count: 19, icon: "📚", category: "education" },
    { name: "Mental Health", count: 16, icon: "🧠", category: "health" },
    { name: "Gender Equality", count: 22, icon: "⚧", category: "social" },
    { name: "Civic Technology", count: 17, icon: "💻", category: "technology" }
  ];
  
  export const dummyConnections = [
    {
      id: 'conn1',
      userId: '101',
      connectedUserId: '102',
      status: 'connected',
      timestamp: "2023-11-10T14:30:00Z"
    },
    {
      id: 'conn2',
      userId: '101',
      connectedUserId: '201',
      status: 'pending',
      timestamp: "2023-11-12T09:15:00Z"
    }
  ];
  