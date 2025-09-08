# EmotiBuild API Documentation

## Overview

EmotiBuild is a Base MiniApp that provides emotional wellness tracking and coping mechanism management. This document outlines the API requirements and integration points for the application.

## Required APIs

### 1. OnchainKit (Coinbase)

**Purpose**: Base blockchain integration and MiniKit functionality
**Documentation**: https://onchainkit.xyz/
**Status**: ✅ Implemented

**Configuration**:
```typescript
// Required environment variable
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
```

**Usage**:
- MiniKit provider setup for Base MiniApp functionality
- Wallet connection capabilities
- Frame-ready signaling
- Future micro-transaction support

**Implementation**:
```typescript
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
```

### 2. Farcaster (Neynar) - Optional

**Purpose**: Social integration and user profile data
**Documentation**: https://docs.farcaster.xyz/
**Status**: 🔄 Planned for future implementation

**Configuration**:
```typescript
// Optional environment variable
NEXT_PUBLIC_NEYNAR_API_KEY=your_neynar_api_key_here
```

**Planned Features**:
- User profile fetching
- Social sharing of mood entries
- Community features
- Cast creation for mood sharing

**API Endpoints**:
- `/v2/user/bulk` - Fetch user profiles
- `/v2/casts` - Create and manage casts
- `/v2/follows` - Manage social connections

### 3. Supabase - Future Enhancement

**Purpose**: Backend-as-a-service for data persistence
**Documentation**: https://supabase.com/docs
**Status**: 🔄 Planned for future implementation

**Configuration**:
```typescript
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Planned Schema**:
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farcaster_id TEXT,
  wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mood entries table
CREATE TABLE mood_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  mood TEXT NOT NULL,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  triggers TEXT[],
  notes TEXT,
  coping_mechanisms_used TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coping mechanisms table
CREATE TABLE coping_mechanisms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  duration INTEGER,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  tags TEXT[],
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. OpenAI/Anthropic - Future Enhancement

**Purpose**: AI-powered emotional analysis and insights
**Documentation**: https://platform.openai.com/docs/api-reference
**Status**: 🔄 Planned for future implementation

**Configuration**:
```typescript
OPENAI_API_KEY=your_openai_api_key_here
```

**Planned Features**:
- Emotional pattern analysis
- Personalized coping strategy recommendations
- Mood trend insights
- Automated journaling prompts

**API Endpoints**:
- `/v1/chat/completions` - Generate insights and recommendations
- `/v1/embeddings` - Analyze emotional patterns

### 5. Privy - Future Enhancement

**Purpose**: Web3 authentication and wallet management
**Documentation**: https://docs.privy.io/
**Status**: 🔄 Planned for future implementation

**Configuration**:
```typescript
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
```

**Planned Features**:
- Secure user authentication
- Smart wallet management
- Onchain identity verification
- Micro-payment processing

## Current Data Storage

### Local Storage Implementation

Currently, EmotiBuild uses browser localStorage for data persistence:

**Storage Keys**:
- `emotibuild_user` - User profile data
- `emotibuild_mood_entries` - Mood entry history
- `emotibuild_coping_mechanisms` - Available coping mechanisms

**Data Models**:
```typescript
interface User {
  id: string;
  farcasterId?: string;
  walletAddress?: string;
  moodEntries: MoodEntry[];
  favoriteCopingMechanisms: string[];
  createdAt: Date;
}

interface MoodEntry {
  id: string;
  userId: string;
  timestamp: Date;
  mood: MoodType;
  intensity: number; // 1-10 scale
  triggers: string[];
  notes: string;
  copingMechanismsUsed: string[];
}

interface CopingMechanism {
  id: string;
  name: string;
  description: string;
  type: CopingType;
  content: string;
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  isPremium: boolean;
}
```

## API Integration Roadmap

### Phase 1: Core Functionality ✅
- [x] OnchainKit integration
- [x] Local storage implementation
- [x] Basic mood tracking
- [x] Coping mechanism library
- [x] Resilience dashboard

### Phase 2: Enhanced Features 🔄
- [ ] Supabase backend integration
- [ ] Real-time data synchronization
- [ ] User authentication
- [ ] Data backup and restore

### Phase 3: Social Features 🔄
- [ ] Farcaster integration
- [ ] Social mood sharing
- [ ] Community features
- [ ] Friend connections

### Phase 4: AI-Powered Insights 🔄
- [ ] OpenAI integration
- [ ] Emotional pattern analysis
- [ ] Personalized recommendations
- [ ] Predictive insights

### Phase 5: Web3 Features 🔄
- [ ] Privy authentication
- [ ] Onchain achievements
- [ ] Micro-transaction support
- [ ] NFT rewards system

## Error Handling

### API Error Responses
```typescript
interface APIError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}
```

### Common Error Scenarios
- Network connectivity issues
- API rate limiting
- Authentication failures
- Data validation errors
- Storage quota exceeded

## Rate Limiting

### Current Limitations
- LocalStorage: ~5-10MB per domain
- No API rate limits (local storage only)

### Future API Limits
- Neynar: 1000 requests/hour (free tier)
- OpenAI: Varies by plan
- Supabase: 500MB database (free tier)

## Security Considerations

### Current Implementation
- Client-side data storage only
- No sensitive data transmission
- Basic input validation

### Future Security Measures
- API key rotation
- Rate limiting implementation
- Data encryption at rest
- Secure authentication flows
- CORS configuration
- Input sanitization

## Testing

### API Testing Strategy
- Unit tests for API integration functions
- Mock API responses for development
- Error scenario testing
- Performance testing for large datasets

### Test Environment Setup
```bash
# Install dependencies
npm install

# Run tests
npm run test

# Run with coverage
npm run test:coverage
```

## Monitoring and Analytics

### Planned Metrics
- API response times
- Error rates by endpoint
- User engagement metrics
- Feature usage statistics
- Performance benchmarks

### Monitoring Tools
- Application performance monitoring
- Error tracking and alerting
- Usage analytics
- API health checks

## Support and Troubleshooting

### Common Issues
1. **Build Failures**: Check TypeScript types and API configurations
2. **Storage Issues**: Clear localStorage if data becomes corrupted
3. **API Errors**: Verify environment variables and API keys
4. **Performance**: Monitor bundle size and optimize imports

### Debug Mode
```typescript
// Enable debug logging
localStorage.setItem('emotibuild_debug', 'true');
```

### Contact Information
- GitHub Issues: [Repository Issues](https://github.com/vistara-apps/emotibuild/issues)
- Documentation: [Project README](../README.md)
- Support: Open an issue for technical support
