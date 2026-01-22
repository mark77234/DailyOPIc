import {
  LEVEL_OPTIONS,
  LevelId,
  TARGET_LEVEL_STORAGE_KEY,
} from "@/constants/opic";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useTargetLevel() {
  const [selectedLevel, setSelectedLevel] = useState<LevelId | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSavedLevel = async () => {
      try {
        const stored = await AsyncStorage.getItem(TARGET_LEVEL_STORAGE_KEY);
        if (stored && LEVEL_OPTIONS.some((o) => o.id === stored)) {
          setSelectedLevel(stored as LevelId);
        }
      } catch (e) {
        console.error("Failed to load saved target level", e);
      }
    };

    loadSavedLevel();
  }, []);

  const save = async (level: LevelId) => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      await AsyncStorage.setItem(TARGET_LEVEL_STORAGE_KEY, level);
    } catch (e) {
      console.error("Failed to save target level", e);
      throw e;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    selectedLevel,
    setSelectedLevel,
    isSaving,
    save,
  };
}
