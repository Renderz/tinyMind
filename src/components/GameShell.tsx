import { useNavigate } from "react-router-dom";
import { m } from "framer-motion";
import { SoundToggle } from "./SoundToggle";
import { LanguageToggle } from "./LanguageToggle";

interface GameShellProps {
  title: string;
  children: React.ReactNode;
  showBack?: boolean;
}

export function GameShell({ title, children, showBack = true }: GameShellProps) {
  const navigate = useNavigate();

  return (
    <m.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="min-h-screen flex flex-col items-center px-4 py-6"
    >
      <div className="w-full max-w-2xl flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-2xl active:scale-90 transition-transform"
            >
              ←
            </button>
          )}
          <h1 className="text-2xl font-bold text-purple-700">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <SoundToggle />
          <LanguageToggle />
        </div>
      </div>
      <div className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center">
        {children}
      </div>
    </m.div>
  );
}
