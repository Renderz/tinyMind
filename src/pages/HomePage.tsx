import { useNavigate } from "react-router-dom";
import { m } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "../components/LanguageToggle";
import { SoundToggle } from "../components/SoundToggle";

export function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const games = [
    { id: "schulte", path: "/schulte", emoji: "🔢", title: t("schulte.title"), desc: t("schulte.description"), color: "from-purple-400 to-indigo-500" },
    { id: "memory", path: "/memory", emoji: "🃏", title: t("memory.title"), desc: t("memory.description"), color: "from-pink-400 to-rose-500" },
    { id: "snake", path: "/snake", emoji: "🐍", title: t("snake.title"), desc: t("snake.description"), color: "from-green-400 to-emerald-500" },
  ];

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <SoundToggle />
        <LanguageToggle />
      </div>

      <m.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="text-5xl font-bold text-purple-600 mb-2"
      >
        {t("app.title")}
      </m.h1>
      <p className="text-xl text-purple-400 mb-10">{t("app.subtitle")}</p>

      <div className="flex flex-col gap-4 w-full max-w-md">
        {games.map((game, i) => (
          <m.button
            key={game.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(game.path)}
            className={`bg-gradient-to-r ${game.color} rounded-3xl p-6 shadow-xl text-white flex items-center gap-4`}
          >
            <span className="text-5xl">{game.emoji}</span>
            <div className="text-left">
              <h2 className="text-2xl font-bold">{game.title}</h2>
              <p className="text-white/80">{game.desc}</p>
            </div>
          </m.button>
        ))}
      </div>
    </m.div>
  );
}
