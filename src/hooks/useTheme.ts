import { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { StorageService } from '../services/storageService';

export const useTheme = () => {
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    language: 'en',
    autoSave: true,
    fontSize: 'md'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const loadSettings = async () => {
    try {
      const savedSettings = await StorageService.getSettings();
      setSettings(savedSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    await StorageService.saveSettings(updatedSettings);
  };

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  return {
    settings,
    updateSettings,
    toggleTheme
  };
};