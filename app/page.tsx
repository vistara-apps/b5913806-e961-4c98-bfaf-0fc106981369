'use client';

import { useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { AppShell } from '@/components/AppShell';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();

  useEffect(() => {
    // Signal that the frame is ready for interaction
    setFrameReady();
  }, [setFrameReady]);

  return <AppShell />;
}
