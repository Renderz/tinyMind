import { useState } from "react";
import { getSoundEnabled, setSoundEnabled } from "../lib/storage";
import { setSoundEnabledGlobal } from "../lib/audio";

export function SoundToggle() {
  const [enabled, setEnabled] = useState(() => {
    const stored = getSoundEnabled();
    setSoundEnabledGlobal(stored);
    return stored;
  });

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setSoundEnabled(next);
    setSoundEnabledGlobal(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="px-3 py-1.5 rounded-full bg-white shadow-md text-lg active:scale-95 transition-transform"
    >
      {enabled ? "🔊" : "🔇"}
    </button>
  );
}
