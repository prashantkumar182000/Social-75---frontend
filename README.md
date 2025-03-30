# 🌍 Social 75 - Frontend

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://socio-99-frontend.vercel.app/)
[![React](https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-4.4-orange?style=for-the-badge&logo=vite)](https://vitejs.dev/)

The frontend of Social 75 - A comprehensive social impact platform connecting activists, NGOs, and volunteers through curated content, interactive maps, and community features.

## ✨ Features

- **Content Library**: Browse TED Talks and educational resources
- **Action Hub**: Discover NGOs and social initiatives
- **Interactive Map**: Visualize global impact locations
- **Community Chat**: Real-time discussion forums
- **Gamification**: Earn points and badges for engagement
- **Responsive Design**: Optimized for all devices

## 🛠 Tech Stack

| Category       | Technologies Used |
|----------------|-------------------|
| Framework      | React 18          |
| Build Tool     | Vite 4            |
| UI Library     | Material-UI (MUI) |
| State Management | Redux Toolkit    |
| Animation      | Framer Motion     |
| API Client     | Axios             |
| Hosting        | Vercel            |

## 🚀 Deployment

1. **Vercel Automatic Deployments**:
   - Connected to GitHub repository
   - Auto-deploys on `main` branch push
   - Environment variables configured in Vercel dashboard

2. **Environment Variables**:
```env
VITE_API_URL=https://socio-99.onrender.com
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
```

## 🧑‍💻 Development Setup

1. Clone repository:
```bash
git clone https://github.com/prashantkumar182000/Social-75---frontend.git
cd Social-75---frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

4. Create production build:
```bash
npm run build
```

## 📂 Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/           # Page-level components
├── redux/           # State management
├── utils/           # Helper functions
├── firebase.js      # Firebase configuration
├── App.jsx          # Main application
└── main.jsx         # Entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgements

- [Material-UI](https://mui.com/) for UI components
- [Vercel](https://vercel.com/) for hosting
- [Render](https://render.com/) for backend services
```
