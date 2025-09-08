# EmotiBuild UI/UX Requirements

## Overview

EmotiBuild is designed as a Base MiniApp with a focus on emotional wellness and resilience building. The UI/UX should be calming, intuitive, and accessible while maintaining the technical requirements for Base integration.

## Design Philosophy

### Core Principles
1. **Calming & Supportive**: Colors and interactions should promote emotional well-being
2. **Intuitive Navigation**: Users should easily understand how to track moods and access coping mechanisms
3. **Mobile-First**: Optimized for mobile devices within the Base MiniApp framework
4. **Accessible**: WCAG 2.1 AA compliance for inclusive design
5. **Progressive Disclosure**: Show information gradually to avoid overwhelming users

### Emotional Design Goals
- Create a safe, non-judgmental space for emotional expression
- Use visual cues that promote calm and stability
- Provide immediate positive feedback for healthy behaviors
- Maintain consistency to build user trust and comfort

## Design System

### Color Palette

#### Primary Colors
```css
--color-primary: hsl(220 89.8% 52.4%);     /* Blue - Trust, stability */
--color-accent: hsl(150 65% 5%);           /* Dark green - Growth, calm */
--color-background: hsl(220 20% 10%);      /* Dark blue - Depth, focus */
--color-surface: hsl(220 20% 14%);         /* Lighter dark blue - Cards */
```

#### Text Colors
```css
--color-text-primary: hsl(220 10% 95%);    /* Light gray - High contrast */
--color-text-secondary: hsl(220 10% 80%);  /* Medium gray - Supporting text */
--color-text-muted: hsl(220 10% 60%);      /* Muted gray - Placeholders */
```

#### Mood-Specific Colors
```css
--mood-happy: linear-gradient(135deg, #fbbf24, #f59e0b);
--mood-sad: linear-gradient(135deg, #60a5fa, #3b82f6);
--mood-anxious: linear-gradient(135deg, #f87171, #ec4899);
--mood-angry: linear-gradient(135deg, #ef4444, #dc2626);
--mood-excited: linear-gradient(135deg, #a855f7, #ec4899);
--mood-calm: linear-gradient(135deg, #34d399, #3b82f6);
--mood-frustrated: linear-gradient(135deg, #fb923c, #ef4444);
--mood-grateful: linear-gradient(135deg, #a855f7, #6366f1);
--mood-overwhelmed: linear-gradient(135deg, #6b7280, #4b5563);
--mood-content: linear-gradient(135deg, #22c55e, #16a34a);
```

### Typography

#### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif;
```

#### Type Scale
```css
--text-display: 2rem;      /* 32px - Main headings */
--text-heading: 1.25rem;   /* 20px - Section headings */
--text-body: 1rem;         /* 16px - Body text */
--text-caption: 0.875rem;  /* 14px - Small text */
--text-micro: 0.75rem;     /* 12px - Micro text */
```

#### Font Weights
```css
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing System

#### Base Unit: 4px
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
```

### Border Radius
```css
--radius-sm: 6px;    /* Small elements */
--radius-md: 10px;   /* Cards, buttons */
--radius-lg: 16px;   /* Large cards */
--radius-full: 9999px; /* Pills, avatars */
```

### Shadows
```css
--shadow-card: 0 4px 12px hsla(0, 0%, 0%, 0.1);
--shadow-elevated: 0 8px 24px hsla(0, 0%, 0%, 0.15);
--shadow-modal: 0 16px 48px hsla(0, 0%, 0%, 0.2);
```

## Component Library

### 1. AppShell
**Purpose**: Main application container
**Variants**: Default
**Requirements**:
- Fixed header with app branding
- Scrollable main content area
- Fixed bottom navigation
- Gradient background for visual depth

### 2. MoodInput
**Purpose**: Mood selection and entry interface
**Variants**: 
- `emoji` - Emoji-based selection (primary)
- `slider` - Intensity slider
- `text` - Text input for notes
- `tag` - Trigger tag selection

**Requirements**:
- Large, touch-friendly emoji buttons
- Clear visual feedback for selections
- Progressive form flow (mood → triggers → notes)
- Smooth transitions between steps
- Validation and error states

### 3. CopingCard
**Purpose**: Display coping mechanism information
**Variants**:
- `summary` - Collapsed view with basic info
- `detail` - Expanded view with full content

**Requirements**:
- Clear visual hierarchy
- Type-specific icons and colors
- Favorite toggle functionality
- Premium content indicators
- Difficulty and duration badges
- Smooth expand/collapse animations

### 4. PrimaryButton
**Purpose**: Main action buttons
**Variants**:
- `default` - Standard button
- `disabled` - Inactive state

**Requirements**:
- Minimum 44px touch target
- Clear visual feedback on press
- Loading states for async actions
- Consistent padding and typography

### 5. Modal
**Purpose**: Overlay dialogs and detailed views
**Variants**: Default

**Requirements**:
- Backdrop blur effect
- Smooth slide-up animation
- Close button accessibility
- Scroll handling for long content
- Focus management

### 6. Navigation
**Purpose**: Bottom tab navigation
**Requirements**:
- Three main tabs: Journal, Coping, Dashboard
- Active state indicators
- Icon + label combination
- Safe area handling for mobile devices

## User Flows

### 1. First-Time User Experience

#### Welcome Flow
1. **Landing Screen**
   - App logo and tagline
   - Brief explanation of purpose
   - "Get Started" call-to-action
   - Calming background animation

2. **Onboarding Steps**
   - Step 1: "Track Your Emotions" - Explain mood logging
   - Step 2: "Discover Coping Tools" - Show mechanism library
   - Step 3: "Build Resilience" - Introduce dashboard
   - Progress indicators for each step

3. **First Mood Entry**
   - Guided mood selection
   - Optional trigger identification
   - Encouraging completion message
   - Automatic navigation to coping library

#### Success Criteria
- User completes first mood entry within 2 minutes
- User explores at least one coping mechanism
- User understands navigation structure

### 2. Daily Mood Logging

#### Entry Flow
1. **Mood Selection**
   - Grid of 10 mood emojis
   - Large, accessible touch targets
   - Hover/press states for feedback
   - Selected state highlighting

2. **Intensity Rating**
   - 1-10 slider with visual feedback
   - Color-coded intensity levels
   - Optional - can skip if desired

3. **Trigger Identification**
   - Common triggers as quick-select tags
   - Custom trigger input field
   - Multiple selection capability
   - "Skip" option available

4. **Notes (Optional)**
   - Free-form text input
   - Character count indicator
   - Auto-save functionality
   - Placeholder text for guidance

5. **Completion**
   - Success animation
   - Suggested coping mechanisms
   - Option to use a coping tool immediately

#### Success Criteria
- Complete entry in under 60 seconds
- High completion rate (>80%)
- Low abandonment at any step

### 3. Coping Mechanism Discovery

#### Browse Flow
1. **Library Overview**
   - Filter by type (breathing, mindfulness, etc.)
   - Sort by duration, difficulty
   - Search functionality
   - Favorites section

2. **Mechanism Details**
   - Expandable cards with full instructions
   - Duration and difficulty indicators
   - Tags for easy categorization
   - "Try This" action button

3. **Usage Tracking**
   - Mark as "used" functionality
   - Add to favorites
   - Usage history tracking
   - Progress feedback

#### Success Criteria
- User tries at least one mechanism per session
- High favorite-to-usage conversion
- Diverse mechanism type exploration

### 4. Resilience Dashboard

#### Dashboard Components
1. **Overall Score**
   - Large, prominent resilience score
   - Visual progress indicator
   - Trend arrow (up/down/stable)
   - Contextual explanation

2. **Mood Trends**
   - 7-day mood stability chart
   - Color-coded mood frequency
   - Pattern recognition highlights

3. **Coping Usage**
   - Most-used mechanisms
   - Usage frequency metrics
   - Effectiveness indicators

4. **Streak Tracking**
   - Daily logging streak counter
   - Milestone celebrations
   - Motivation messaging

#### Success Criteria
- Users check dashboard regularly
- Clear understanding of progress
- Motivation to maintain streaks

## Accessibility Requirements

### WCAG 2.1 AA Compliance

#### Color and Contrast
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text
- Color not the only means of conveying information
- High contrast mode support

#### Keyboard Navigation
- All interactive elements keyboard accessible
- Logical tab order throughout application
- Visible focus indicators
- Keyboard shortcuts for common actions

#### Screen Reader Support
- Semantic HTML structure
- ARIA labels for complex interactions
- Alt text for all images and icons
- Screen reader announcements for state changes

#### Motor Accessibility
- Minimum 44px touch targets
- No time-based interactions required
- Gesture alternatives available
- Reduced motion preferences respected

### Inclusive Design Considerations

#### Emotional Sensitivity
- Neutral, non-judgmental language
- Avoid triggering imagery or colors
- Provide content warnings where appropriate
- Multiple ways to express emotions

#### Cultural Considerations
- Inclusive emoji and imagery
- Culturally neutral coping mechanisms
- Multiple language support (future)
- Respect for diverse emotional expressions

## Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
--mobile: 320px;      /* Small phones */
--mobile-lg: 375px;   /* Large phones */
--tablet: 768px;      /* Tablets */
--desktop: 1024px;    /* Desktop (future) */
```

### Mobile Optimization (Primary)
- Single-column layouts
- Large touch targets (minimum 44px)
- Thumb-friendly navigation placement
- Optimized for portrait orientation
- Safe area handling for notched devices

### Tablet Considerations (Secondary)
- Two-column layouts where appropriate
- Larger content areas
- Enhanced navigation options
- Better use of screen real estate

## Animation and Micro-interactions

### Animation Principles
1. **Purposeful**: Every animation serves a functional purpose
2. **Subtle**: Gentle, calming movements
3. **Responsive**: Quick feedback for user actions
4. **Respectful**: Honor reduced motion preferences

### Key Animations

#### Page Transitions
```css
/* Slide up for modals */
transform: translateY(100%);
transition: transform 300ms ease-out;

/* Fade for content changes */
opacity: 0;
transition: opacity 200ms ease-in-out;
```

#### Micro-interactions
- Button press feedback (scale + color)
- Card hover states (subtle lift)
- Form validation (shake for errors)
- Success states (gentle pulse)
- Loading states (skeleton screens)

#### Mood-Specific Animations
- Happy: Gentle bounce
- Calm: Slow fade-in
- Anxious: Subtle vibration
- Excited: Quick pulse

### Performance Considerations
- Use CSS transforms over position changes
- Leverage GPU acceleration with `will-change`
- Limit concurrent animations
- Provide reduced motion alternatives

## Error States and Edge Cases

### Error Handling UI

#### Form Validation
- Inline validation with clear messaging
- Error state styling (red borders, icons)
- Success state confirmation
- Helpful correction suggestions

#### Network Errors
- Offline state indicators
- Retry mechanisms
- Graceful degradation
- Data persistence during outages

#### Empty States
- Encouraging first-use messaging
- Clear next steps
- Helpful illustrations
- Motivational copy

### Loading States
- Skeleton screens for content loading
- Progress indicators for long operations
- Optimistic UI updates where possible
- Timeout handling with user feedback

## Performance Requirements

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Bundle Size Optimization
- Code splitting by route
- Lazy loading for non-critical components
- Image optimization and lazy loading
- Tree shaking for unused code

### Runtime Performance
- Smooth 60fps animations
- Quick response to user interactions
- Efficient re-renders with React optimization
- Memory leak prevention

## Testing Requirements

### Visual Testing
- Cross-browser compatibility testing
- Device-specific testing (iOS/Android)
- Accessibility testing with screen readers
- Color blindness simulation testing

### User Testing
- Usability testing with target users
- A/B testing for key flows
- Emotional response testing
- Accessibility testing with disabled users

### Automated Testing
- Visual regression testing
- Component unit testing
- Integration testing for user flows
- Performance monitoring and alerts

## Future Enhancements

### Planned UI Improvements
- Dark/light theme toggle
- Customizable color schemes
- Advanced data visualizations
- Social sharing interfaces
- Gamification elements

### Advanced Features
- Voice input for mood logging
- Gesture-based navigation
- Haptic feedback integration
- AR/VR coping experiences
- AI-powered UI personalization

## Implementation Guidelines

### Development Standards
- Component-driven development
- Consistent naming conventions
- Comprehensive documentation
- Regular design system updates
- Cross-team collaboration protocols

### Quality Assurance
- Design review checkpoints
- Accessibility audits
- Performance monitoring
- User feedback integration
- Continuous improvement processes
