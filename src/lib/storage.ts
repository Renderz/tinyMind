const BEST_TIME_PREFIX = "best-time:";
const SOUND_KEY = "sound-enabled";

export function getBestTime(key: string): number | null {
  const value = localStorage.getItem(BEST_TIME_PREFIX + key);
  return value === null ? null : parseFloat(value);
}

export function setBestTime(key: string, time: number): void {
  const current = getBestTime(key);
  if (current === null || time < current) {
    localStorage.setItem(BEST_TIME_PREFIX + key, String(time));
  }
}

export function getSoundEnabled(): boolean {
  const value = localStorage.getItem(SOUND_KEY);
  return value === null ? true : value === "true";
}

export function setSoundEnabled(enabled: boolean): void {
  localStorage.setItem(SOUND_KEY, String(enabled));
}
