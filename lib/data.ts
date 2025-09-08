import { CopingMechanism } from './types';

export const MOOD_EMOJIS = {
  'very-happy': '😄',
  'happy': '😊',
  'neutral': '😐',
  'sad': '😢',
  'very-sad': '😭',
  'anxious': '😰',
  'angry': '😠',
  'excited': '🤩',
} as const;

export const MOOD_LABELS = {
  'very-happy': 'Very Happy',
  'happy': 'Happy',
  'neutral': 'Neutral',
  'sad': 'Sad',
  'very-sad': 'Very Sad',
  'anxious': 'Anxious',
  'angry': 'Angry',
  'excited': 'Excited',
} as const;

export const COPING_MECHANISMS: CopingMechanism[] = [
  {
    id: '1',
    name: '4-7-8 Breathing',
    description: 'A calming breathing technique to reduce anxiety',
    type: 'breathing',
    content: 'Inhale for 4 counts, hold for 7 counts, exhale for 8 counts. Repeat 3-4 times.',
    duration: 2,
  },
  {
    id: '2',
    name: 'Gratitude Reflection',
    description: 'Focus on three things you\'re grateful for today',
    type: 'mindfulness',
    content: 'Take a moment to think of three specific things you\'re grateful for today. Write them down or say them aloud.',
    duration: 3,
  },
  {
    id: '3',
    name: 'Positive Affirmation',
    description: 'Boost your confidence with self-affirming statements',
    type: 'affirmation',
    content: 'Repeat: "I am capable, I am strong, I can handle whatever comes my way." Say it with conviction.',
    duration: 1,
  },
  {
    id: '4',
    name: '5-Minute Walk',
    description: 'Get moving to boost your mood naturally',
    type: 'exercise',
    content: 'Take a 5-minute walk, preferably outside. Focus on your surroundings and breathe deeply.',
    duration: 5,
  },
  {
    id: '5',
    name: 'Creative Doodling',
    description: 'Express yourself through simple drawing',
    type: 'creative',
    content: 'Grab a pen and paper. Doodle whatever comes to mind for 5 minutes. Don\'t worry about making it perfect.',
    duration: 5,
  },
  {
    id: '6',
    name: 'Body Scan Meditation',
    description: 'Release tension through mindful awareness',
    type: 'mindfulness',
    content: 'Lie down and mentally scan your body from head to toe. Notice any tension and consciously relax those areas.',
    duration: 10,
    isPremium: true,
  },
];

export const COMMON_TRIGGERS = [
  'Work stress',
  'Relationship issues',
  'Financial concerns',
  'Health worries',
  'Social situations',
  'Family dynamics',
  'Sleep issues',
  'Weather',
  'News/media',
  'Technology problems',
];
