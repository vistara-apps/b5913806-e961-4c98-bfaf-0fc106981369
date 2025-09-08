# EmotiBuild Deployment Guide

## Overview

This guide covers the deployment process for EmotiBuild, a Base MiniApp built with Next.js 15. The application is designed to be deployed on Vercel with Base blockchain integration.

## Prerequisites

### Required Accounts
- [Vercel](https://vercel.com) account for hosting
- [OnchainKit API Key](https://onchainkit.xyz/) for Base integration
- [Neynar API Key](https://neynar.com) (optional, for Farcaster features)

### Development Environment
- Node.js 18+ 
- npm or yarn package manager
- Git for version control

## Environment Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# Base Configuration (Required)
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here

# Farcaster Integration (Optional)
NEXT_PUBLIC_NEYNAR_API_KEY=your_neynar_api_key_here

# Future Enhancements (Optional)
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
# OPENAI_API_KEY=your_openai_api_key_here
# NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id_here
```

### API Key Setup

#### OnchainKit API Key (Required)
1. Visit [OnchainKit](https://onchainkit.xyz/)
2. Sign up or log in to your account
3. Create a new project
4. Copy the API key to your environment variables

#### Neynar API Key (Optional)
1. Visit [Neynar](https://neynar.com)
2. Sign up for a developer account
3. Create a new application
4. Copy the API key to your environment variables

## Local Development

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd emotibuild-base-miniapp

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

### Development Server
The application will be available at `http://localhost:3000`

### Build Verification
```bash
# Test production build locally
npm run build
npm run start
```

## Vercel Deployment

### Automatic Deployment (Recommended)

1. **Connect Repository to Vercel**
   - Visit [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Select the repository containing EmotiBuild

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables**
   - In Vercel dashboard, go to Project Settings → Environment Variables
   - Add all required environment variables:
     ```
     NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_key_here
     NEXT_PUBLIC_NEYNAR_API_KEY=your_key_here
     ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application
   - You'll receive a deployment URL

### Manual Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel

# Follow the prompts to configure your deployment
```

### Custom Domain (Optional)

1. In Vercel dashboard, go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed by Vercel
4. SSL certificates are automatically provisioned

## Base MiniApp Configuration

### Frame Metadata

The application includes proper Frame metadata for Base integration:

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'EmotiBuild - Build Resilience',
  description: 'Track emotions and build resilience through guided coping mechanisms',
  openGraph: {
    title: 'EmotiBuild - Build Resilience',
    description: 'Track emotions and build resilience through guided coping mechanisms',
    images: ['/og-image.png'],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': '/og-image.png',
    'fc:frame:button:1': 'Start Tracking',
    'fc:frame:post_url': '/api/frame',
  },
};
```

### MiniKit Integration

The application is configured for MiniKit:

```typescript
// app/providers.tsx
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MiniKitProvider>
      {children}
    </MiniKitProvider>
  );
}
```

## Performance Optimization

### Build Optimization

The application is optimized for production:

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@coinbase/onchainkit', 'lucide-react'],
  },
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
};

export default nextConfig;
```

### Bundle Analysis

```bash
# Analyze bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

### Performance Monitoring

- Core Web Vitals are monitored automatically by Vercel
- Custom performance metrics can be added via Vercel Analytics

## Security Configuration

### Content Security Policy

```typescript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

### Environment Variable Security

- Never commit `.env.local` to version control
- Use Vercel's environment variable management
- Rotate API keys regularly
- Use different keys for development and production

## Monitoring and Logging

### Vercel Analytics

Enable Vercel Analytics for performance monitoring:

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking

For production error tracking, consider integrating:
- Sentry for error monitoring
- LogRocket for session replay
- Vercel's built-in error tracking

### Health Checks

Create a health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  });
}
```

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
   ```bash
   # Check TypeScript errors
   npm run build
   
   # Fix type issues
   npm run lint
   ```

2. **Environment Variable Issues**
   - Verify all required variables are set in Vercel
   - Check variable names match exactly
   - Ensure `NEXT_PUBLIC_` prefix for client-side variables

3. **API Integration Issues**
   - Verify API keys are valid and active
   - Check API rate limits
   - Review network requests in browser dev tools

4. **Performance Issues**
   - Analyze bundle size with `@next/bundle-analyzer`
   - Optimize images and assets
   - Enable compression and caching

### Debug Mode

Enable debug logging:

```typescript
// Add to your component
useEffect(() => {
  if (process.env.NODE_ENV === 'development') {
    localStorage.setItem('emotibuild_debug', 'true');
  }
}, []);
```

### Rollback Strategy

Vercel provides automatic rollback capabilities:

1. Go to Vercel dashboard → Deployments
2. Find the last working deployment
3. Click "Promote to Production"

## Maintenance

### Regular Updates

1. **Dependencies**
   ```bash
   # Check for updates
   npm outdated
   
   # Update dependencies
   npm update
   
   # Update major versions carefully
   npm install package@latest
   ```

2. **Security Updates**
   ```bash
   # Check for security vulnerabilities
   npm audit
   
   # Fix automatically
   npm audit fix
   ```

3. **Performance Monitoring**
   - Review Vercel Analytics monthly
   - Monitor Core Web Vitals
   - Check error rates and user feedback

### Backup Strategy

- Code is backed up in Git repository
- User data is stored locally (no server backup needed currently)
- Future: Implement database backups when backend is added

## Scaling Considerations

### Current Architecture
- Static site generation with client-side data storage
- No server-side database requirements
- Scales automatically with Vercel's CDN

### Future Scaling Plans
- Add Supabase for backend data storage
- Implement Redis for caching
- Consider edge functions for API routes
- Add monitoring for database performance

## Support and Documentation

### Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [OnchainKit Documentation](https://onchainkit.xyz/docs)
- [Base Documentation](https://docs.base.org/)

### Getting Help
- Check the troubleshooting section above
- Review Vercel deployment logs
- Open an issue in the project repository
- Contact the development team

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Build passes locally (`npm run build`)
- [ ] TypeScript compilation successful
- [ ] All tests passing
- [ ] Performance optimizations applied
- [ ] Security headers configured

### Post-Deployment
- [ ] Application loads correctly
- [ ] All features functional
- [ ] API integrations working
- [ ] Performance metrics acceptable
- [ ] Error tracking configured
- [ ] Analytics enabled
- [ ] Health check endpoint responding

### Production Readiness
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] CDN caching optimized
- [ ] Monitoring alerts set up
- [ ] Backup strategy implemented
- [ ] Documentation updated
- [ ] Team notified of deployment

This deployment guide ensures a smooth and secure deployment of EmotiBuild to production while maintaining optimal performance and user experience.
