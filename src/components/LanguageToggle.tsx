import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const isZh = i18n.language === "zh";

  return (
    <button
      type="button"
      onClick={() => i18n.changeLanguage(isZh ? "en" : "zh")}
      className="px-3 py-1.5 rounded-full bg-white shadow-md text-sm font-bold text-purple-600 active:scale-95 transition-transform"
    >
      {isZh ? "EN" : "中"}
    </button>
  );
}
