# BricksApp 🏗️

A modern construction management platform built with React, TypeScript, and Tailwind CSS. BricksApp helps construction teams manage projects, coordinate bricklayers, and streamline communication.

## Features

- **Multi-language Support** - Danish, English, Spanish, Italian, Lithuanian
- **Dark/Light Theme** - Toggle between themes
- **Role-based Dashboards** - Different views for Bricklayers, Project Managers, and Recruiters
- **Video Tutorials** - Construction phase tutorials with video content
- **Recruitment System** - Integrated application form for new bricklayers
- **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: GitHub Pages

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bricksapp.git
cd bricksapp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

## Demo Accounts

For testing purposes, you can use these demo accounts:

- **Bricklayer**: lars@bricksapp.dk / password123
- **Project Manager**: mette@bricksapp.dk / password123  
- **Recruiter**: anne@bricksapp.dk / password123

## Project Structure

```
src/
├── components/          # React components
│   ├── dashboards/     # Role-specific dashboards
│   ├── pages/          # Page components
│   └── ...
├── context/            # React contexts (Auth, Language, Theme)
├── data/               # Mock data
├── translations/       # Multi-language translations
├── types/              # TypeScript type definitions
└── ...
```

## Deployment

This project is configured for GitHub Pages deployment. The app will automatically deploy when you push to the main branch.

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@bricksapp.dk or create an issue in this repository. # Updated Sun Jun 22 12:01:09 CEST 2025
