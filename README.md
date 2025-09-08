# EmotiBuild - Base MiniApp

Build resilience, one emotion at a time.

## Overview

EmotiBuild is a Base MiniApp that helps users track their emotions and build resilience through guided journaling and coping mechanisms. Built with Next.js 15, TypeScript, and OnchainKit for seamless Base integration.

## Features

### 🎯 Core Features
- **Daily Mood Journal**: Quick, simple entries to log emotions and identify triggers
- **Coping Mechanism Library**: Curated collection of techniques for stress relief and resilience building
- **Resilience Dashboard**: Track progress with insights and metrics

### 🛠 Technical Features
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for responsive design
- OnchainKit integration for Base blockchain
- Local storage for data persistence
- Mobile-first responsive design

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd emotibuild-base-miniapp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main page component
│   ├── providers.tsx      # MiniKit provider setup
│   ├── globals.css        # Global styles with Tailwind
│   ├── loading.tsx        # Loading UI
│   └── error.tsx          # Error boundary
├── components/            # React components
│   ├── AppShell.tsx       # Main app container
│   ├── MoodJournal.tsx    # Mood tracking interface
│   ├── CopingLibrary.tsx  # Coping mechanisms browser
│   ├── ResilienceDashboard.tsx # Progress tracking
│   ├── Navigation.tsx     # Bottom navigation
│   └── WelcomeScreen.tsx  # First-time user experience
├── lib/                   # Utilities and types
│   ├── types.ts           # TypeScript type definitions
│   ├── utils.ts           # Utility functions
│   └── storage.ts         # Local storage management
└── public/                # Static assets
```

## Key Components

### MoodJournal
- Emoji-based mood selection
- Intensity slider (1-10 scale)
- Trigger identification
- Optional notes
- Recent entries display

### CopingLibrary
- Categorized coping mechanisms
- Favorites system
- Free vs premium content
- Detailed instructions
- Usage tracking

### ResilienceDashboard
- Overall resilience score
- Mood stability metrics
- Coping usage statistics
- Streak tracking
- Personalized insights

## Data Model

### User
- `id`: Unique identifier
- `farcasterId`: Optional Farcaster ID
- `walletAddress`: Optional wallet address
- `moodEntries`: Array of mood entry IDs
- `favoriteCopingMechanisms`: Array of favorite mechanism IDs

### MoodEntry
- `id`: Unique identifier
- `userId`: Reference to user
- `timestamp`: Entry creation time
- `mood`: Selected mood type
- `intensity`: Mood intensity (1-10)
- `triggers`: Array of trigger strings
- `notes`: Optional text notes
- `copingMechanismsUsed`: Array of used mechanism IDs

### CopingMechanism
- `id`: Unique identifier
- `name`: Mechanism name
- `description`: Brief description
- `type`: Category (breathing, mindfulness, etc.)
- `content`: Detailed instructions
- `duration`: Time required in minutes
- `difficulty`: Easy, medium, or hard
- `tags`: Array of relevant tags
- `isPremium`: Premium content flag

## Design System

### Colors
- Primary: `hsl(220 89.8% 52.4%)` - Blue
- Accent: `hsl(150 65% 5%)` - Dark green
- Background: `hsl(220 20% 10%)` - Dark blue
- Surface: `hsl(220 20% 14%)` - Lighter dark blue
- Text Primary: `hsl(220 10% 95%)` - Light gray
- Text Secondary: `hsl(220 10% 80%)` - Medium gray

### Typography
- Display: `text-3xl font-semibold leading-9`
- Heading: `text-xl font-medium leading-7`
- Body: `text-base font-normal leading-6`
- Caption: `text-sm font-normal leading-5`

### Components
- Glass cards with backdrop blur
- Gradient buttons
- Smooth animations and transitions
- Mobile-first responsive design

## Base Integration

EmotiBuild uses OnchainKit's MiniKitProvider for seamless Base blockchain integration:

- Wallet connection capabilities
- Base chain configuration
- Future micro-transaction support
- Onchain identity features

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style
- TypeScript strict mode
- ESLint + Prettier configuration
- Consistent component patterns
- Comprehensive error handling

## Future Enhancements

### Planned Features
- AI-powered emotional analysis
- Social sharing capabilities
- Advanced analytics
- Premium coping content
- Onchain achievements
- Community features

### Technical Improvements
- Supabase backend integration
- Real-time data synchronization
- Push notifications
- Offline support
- Performance optimizations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for emotional wellness and resilience building.
