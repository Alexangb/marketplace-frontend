'use client';

import { useCallback, useRef, useState } from 'react';

interface UsePullToRefreshProps {
  onRefresh: () => Promise<void>;
  threshold?: number;
}

export function usePullToRefresh({ onRefresh, threshold = 100 }: UsePullToRefreshProps) {
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const isRefreshing = useRef(false);
  const isTouching = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      isTouching.current = true;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0 && !isRefreshing.current && isTouching.current && startY.current) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;
      
      if (distance > threshold && distance < 200) {
        e.preventDefault();
        setRefreshing(true);
      }
    }
  }, [threshold]);

  const handleTouchEnd = useCallback(async () => {
    isTouching.current = false;
    if (refreshing && !isRefreshing.current) {
      isRefreshing.current = true;
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        isRefreshing.current = false;
      }
    }
    startY.current = 0;
  }, [refreshing, onRefresh]);

  // Registrar eventos
  useCallback(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { refreshing };
}

// Componente de indicador de carga (por eso necesita .tsx)
export function PullToRefreshIndicator({ refreshing }: { refreshing: boolean }) {
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
      refreshing ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="flex justify-center items-center py-3 bg-blue-600 text-white text-sm">
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
        Actualizando...
      </div>
    </div>
  );
}