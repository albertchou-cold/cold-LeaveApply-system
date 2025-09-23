'use client';

import { ReactNode } from 'react';
import '../../lib/i18n'; // 初始化 i18n

interface I18nProviderProps {
  children: ReactNode;
}

export default function I18nProvider({ children }: I18nProviderProps) {
  return <>{children}</>;
}
