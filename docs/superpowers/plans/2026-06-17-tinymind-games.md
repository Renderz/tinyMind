# tinyMind 儿童游戏合集 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 4 岁孩子打造网页小游戏合集（舒尔特方格 + 记忆对对碰），部署到 GitHub Pages，手机/Pad 自适应，中英双语，含音效与动画。

**Architecture:** React 18 + TypeScript SPA，Vite 构建，Framer Motion 动画，Tailwind CSS 样式，react-i18next 双语，React Router 路由。每个游戏独立文件夹，通过通用组件（GameShell、Confetti、audio）复用基础设施。

**Tech Stack:** React 18, TypeScript, Vite, Framer Motion, Tailwind CSS, React Router, react-i18next, Vitest, Testing Library

---

## File Structure

```
tinyMind/
├── src/
│   ├── main.tsx                      # 入口
│   ├── index.css                     # Tailwind 指令 + 全局样式
│   ├── app/
│   │   ├── App.tsx                   # 路由 + 布局壳
│   │   └── __tests__/App.test.tsx
│   ├── components/
│   │   ├── GameShell.tsx             # 游戏页面通用壳（返回按钮 + 标题）
│   │   ├── Confetti.tsx              # 撒花粒子动画
│   │   ├── LanguageToggle.tsx        # 中英语言切换按钮
│   │   └── SoundToggle.tsx           # 音效开关
│   ├── games/
│   │   ├── schulte/
│   │   │   ├── SchultePage.tsx       # 路由入口（模式/难度选择 → 游戏 → 完成）
│   │   │   ├── SchulteSetup.tsx      # 模式+难度选择屏
│   │   │   ├── SchulteBoard.tsx      # 方格棋盘
│   │   │   ├── SchulteCell.tsx       # 单个格子
│   │   │   ├── schulteLogic.ts       # 纯函数：生成网格、生成目标序列
│   │   │   └── __tests__/schulteLogic.test.ts
│   │   └── memory-match/
│   │       ├── MemoryPage.tsx        # 路由入口（设置 → 游戏 → 完成）
│   │       ├── MemorySetup.tsx       # 难度+昵称设置屏
│   │       ├── MemoryBoard.tsx       # 卡片网格 + 回合管理
│   │       ├── MemoryCard.tsx        # 单张卡片（翻转动画）
│   │       ├── memoryLogic.ts        # 纯函数：生成卡片、检查配对
│   │       └── __tests__/memoryLogic.test.ts
│   ├── i18n/
│   │   ├── index.ts                  # i18n 配置
│   │   ├── zh.json                   # 中文文案
│   │   └── en.json                   # 英文文案
│   ├── lib/
│   │   ├── audio.ts                  # 音效播放（Web Audio API 合成音）
│   │   ├── storage.ts                # localStorage 封装
│   │   └── __tests__/storage.test.ts
│   ├── hooks/
│   │   ├── useTimer.ts               # 计时器 hook
│   │   └── __tests__/useTimer.test.ts
│   └── pages/
│       └── HomePage.tsx              # 首页游戏选择
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── .github/workflows/deploy.yml
└── vitest.config.ts
```

---

## Task 1: 初始化项目脚手架

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.js`
- Create: `src/main.tsx`
- Create: `src/index.css`
- Create: `index.html`
- Create: `vitest.config.ts`

- [ ] **Step 1: 用 Vite 创建 React+TS 项目**

```bash
cd /Users/jiangyifeng/github/tinyMind
npm create vite@latest . -- --template react-ts
```

如果提示目录非空，选择 "Ignore files and continue"。

- [ ] **Step 2: 安装依赖**

```bash
npm install
npm install framer-motion react-router-dom react-i18next i18next
npm install -D tailwindcss@3 postcss autoprefixer
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 3: 初始化 Tailwind CSS**

```bash
npx tailwindcss init -p
```

- [ ] **Step 4: 配置 Tailwind**

Write `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        rounded: ['"Comic Sans MS"', '"PingFang SC"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 5: 写全局 CSS（Tailwind 指令 + 移动端优化）**

Write `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
  }
  body {
    @apply bg-gradient-to-b from-sky-100 to-purple-100 min-h-screen;
  }
}
```

- [ ] **Step 6: 配置 Vite（base 路径适配 GitHub Pages）**

Write `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/tinyMind/",
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test-setup.ts",
  },
});
```

- [ ] **Step 7: 创建 test setup 文件**

Write `src/test-setup.ts`:

```ts
import "@testing-library/jest-dom";
```

- [ ] **Step 8: 更新 index.html（移动端 viewport + 防缩放）**

Write `index.html`:

```html
<!doctype html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>tinyMind 小游戏</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 9: 写最小化 main.tsx 确认能跑**

Write `src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-purple-600">tinyMind</h1>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 10: 验证项目能启动**

Run: `npm run dev`
Expected: 浏览器打开看到 "tinyMind" 紫色大字，背景渐变

- [ ] **Step 11: 验证测试能跑**

Run: `npx vitest run --reporter=verbose 2>&1 | head -5`
Expected: No tests found, no errors (vitest exits cleanly)

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TS + Tailwind + Framer Motion project"
```

---

## Task 2: i18n 国际化配置

**Files:**
- Create: `src/i18n/index.ts`
- Create: `src/i18n/zh.json`
- Create: `src/i18n/en.json`

- [ ] **Step 1: 写中文文案文件**

Write `src/i18n/zh.json`:

```json
{
  "app": {
    "title": "tinyMind 小游戏",
    "subtitle": "和爸爸妈妈一起玩！"
  },
  "common": {
    "start": "开始",
    "back": "返回",
    "restart": "再玩一次",
    "home": "首页",
    "completed": "完成啦！",
    "timeUsed": "用时 {{seconds}} 秒",
    "soundOn": "音效开",
    "soundOff": "音效关"
  },
  "schulte": {
    "title": "舒尔特方格",
    "description": "按顺序找数字，训练专注力",
    "mode": {
      "forward": "正序",
      "backward": "倒序",
      "random": "乱序"
    },
    "difficulty": {
      "3": "3×3 简单",
      "4": "4×4 中等",
      "5": "5×5 挑战"
    },
    "findNext": "下一个找：{{target}}",
    "bestTime": "最佳：{{seconds}} 秒"
  },
  "memory": {
    "title": "记忆对对碰",
    "description": "翻牌找配对，比比谁记得多",
    "player1": "玩家 1",
    "player2": "玩家 2",
    "difficulty": {
      "2": "2 对 简单",
      "4": "4 对 中等",
      "6": "6 对 挑战"
    },
    "turn": "轮到 {{name}}",
    "score": "{{name}}：{{score}} 分",
    "winner": "{{name}} 赢啦！",
    "tie": "平局，都很棒！"
  }
}
```

- [ ] **Step 2: 写英文文案文件**

Write `src/i18n/en.json`:

```json
{
  "app": {
    "title": "tinyMind Games",
    "subtitle": "Play with mom and dad!"
  },
  "common": {
    "start": "Start",
    "back": "Back",
    "restart": "Play Again",
    "home": "Home",
    "completed": "Great job!",
    "timeUsed": "Time: {{seconds}}s",
    "soundOn": "Sound On",
    "soundOff": "Sound Off"
  },
  "schulte": {
    "title": "Schulte Grid",
    "description": "Find numbers in order, train focus",
    "mode": {
      "forward": "Forward",
      "backward": "Backward",
      "random": "Random"
    },
    "difficulty": {
      "3": "3×3 Easy",
      "4": "4×4 Medium",
      "5": "5×5 Hard"
    },
    "findNext": "Next: {{target}}",
    "bestTime": "Best: {{seconds}}s"
  },
  "memory": {
    "title": "Memory Match",
    "description": "Flip cards to find pairs",
    "player1": "Player 1",
    "player2": "Player 2",
    "difficulty": {
      "2": "2 Pairs Easy",
      "4": "4 Pairs Medium",
      "6": "6 Pairs Hard"
    },
    "turn": "{{name}}'s turn",
    "score": "{{name}}: {{score}}",
    "winner": "{{name}} wins!",
    "tie": "It's a tie! Great job!"
  }
}
```

- [ ] **Step 3: 写 i18n 配置**

Write `src/i18n/index.ts`:

```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zh from "./zh.json";
import en from "./en.json";

i18n.use(initReactI18next).init({
  resources: {
    zh: { translation: zh },
    en: { translation: en },
  },
  lng: "zh",
  fallbackLng: "zh",
  interpolation: { escapeValue: false },
});

export default i18n;
```

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add i18n config with zh/en translations"
```

---

## Task 3: lib/storage.ts — localStorage 封装

**Files:**
- Create: `src/lib/storage.ts`
- Test: `src/lib/__tests__/storage.test.ts`

- [ ] **Step 1: 写失败测试**

Write `src/lib/__tests__/storage.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { getBestTime, setBestTime, getSoundEnabled, setSoundEnabled } from "../storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getBestTime / setBestTime", () => {
    it("returns null when no best time stored", () => {
      expect(getBestTime("schulte-forward-3")).toBeNull();
    });

    it("stores and retrieves best time", () => {
      setBestTime("schulte-forward-3", 15.5);
      expect(getBestTime("schulte-forward-3")).toBe(15.5);
    });

    it("only keeps the lower value", () => {
      setBestTime("schulte-forward-3", 20);
      setBestTime("schulte-forward-3", 10);
      expect(getBestTime("schulte-forward-3")).toBe(10);
    });

    it("does not overwrite with a worse value", () => {
      setBestTime("schulte-forward-3", 10);
      setBestTime("schulte-forward-3", 20);
      expect(getBestTime("schulte-forward-3")).toBe(10);
    });
  });

  describe("getSoundEnabled / setSoundEnabled", () => {
    it("defaults to true", () => {
      expect(getSoundEnabled()).toBe(true);
    });

    it("stores and retrieves sound setting", () => {
      setSoundEnabled(false);
      expect(getSoundEnabled()).toBe(false);
    });
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/lib/__tests__/storage.test.ts`
Expected: FAIL — "Cannot find module '../storage'"

- [ ] **Step 3: 写实现**

Write `src/lib/storage.ts`:

```ts
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
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run src/lib/__tests__/storage.test.ts`
Expected: PASS — 6 tests passed

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add localStorage helper for best times and sound setting"
```

---

## Task 4: lib/audio.ts — Web Audio API 音效合成

**Files:**
- Create: `src/lib/audio.ts`

- [ ] **Step 1: 写音效合成工具**

Write `src/lib/audio.ts`:

```ts
type SoundType = "correct" | "wrong" | "flip" | "win";

let audioContext: AudioContext | null = null;
let soundEnabled = true;

export function setSoundEnabledGlobal(enabled: boolean): void {
  soundEnabled = enabled;
}

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

function playTone(frequency: number, duration: number, delay: number = 0, type: OscillatorType = "sine"): void {
  if (!soundEnabled) return;
  const ctx = getContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  const startTime = ctx.currentTime + delay;
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

export function playSound(type: SoundType): void {
  switch (type) {
    case "correct":
      playTone(523.25, 0.15, 0);
      playTone(659.25, 0.15, 0.08);
      break;
    case "wrong":
      playTone(200, 0.2, 0, "triangle");
      break;
    case "flip":
      playTone(440, 0.08, 0, "square");
      break;
    case "win":
      playTone(523.25, 0.15, 0);
      playTone(659.25, 0.15, 0.1);
      playTone(783.99, 0.15, 0.2);
      playTone(1046.5, 0.3, 0.3);
      break;
  }
}
```

Note: audio.ts uses Web Audio API to synthesize tones at runtime — no external sound files needed, keeping deployment zero-asset.

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add Web Audio API sound synthesis for game feedback"
```

---

## Task 5: useTimer Hook

**Files:**
- Create: `src/hooks/useTimer.ts`
- Test: `src/hooks/__tests__/useTimer.test.ts`

- [ ] **Step 1: 写失败测试**

Write `src/hooks/__tests__/useTimer.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTimer } from "../useTimer";

describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts at 0 seconds", () => {
    const { result } = renderHook(() => useTimer());
    expect(result.current.elapsed).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  it("starts counting when start() is called", () => {
    const { result } = renderHook(() => useTimer());
    act(() => result.current.start());
    expect(result.current.isRunning).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(result.current.elapsed).toBeCloseTo(1.5, 1);
  });

  it("stops when stop() is called", () => {
    const { result } = renderHook(() => useTimer());
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(2000));
    act(() => result.current.stop());
    expect(result.current.isRunning).toBe(false);
    expect(result.current.elapsed).toBeCloseTo(2, 0);

    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.elapsed).toBeCloseTo(2, 0);
  });

  it("resets to 0", () => {
    const { result } = renderHook(() => useTimer());
    act(() => result.current.start());
    act(() => vi.advanceTimersByTime(3000));
    act(() => result.current.reset());
    expect(result.current.elapsed).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/hooks/__tests__/useTimer.test.ts`
Expected: FAIL — "Cannot find module '../useTimer'"

- [ ] **Step 3: 写实现**

Write `src/hooks/useTimer.ts`:

```ts
import { useState, useRef, useCallback } from "react";

export function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const baseRef = useRef(0);

  const tick = useCallback(() => {
    if (startTimeRef.current !== null) {
      const now = performance.now();
      setElapsed((now - startTimeRef.current + baseRef.current) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const start = useCallback(() => {
    startTimeRef.current = performance.now();
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (startTimeRef.current !== null) {
      baseRef.current += performance.now() - startTimeRef.current;
      startTimeRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startTimeRef.current = null;
    baseRef.current = 0;
    setElapsed(0);
    setIsRunning(false);
  }, []);

  return { elapsed, isRunning, start, stop, reset };
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run src/hooks/__tests__/useTimer.test.ts`
Expected: PASS — 4 tests passed

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add useTimer hook for game timing"
```

---

## Task 6: Confetti 撒花组件

**Files:**
- Create: `src/components/Confetti.tsx`

- [ ] **Step 1: 写 Confetti 组件**

Write `src/components/Confetti.tsx`:

```tsx
import { motion } from "framer-motion";
import { useMemo } from "react";

const COLORS = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#C7CEEA", "#FFAAA5"];
const COUNT = 30;

export function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.3,
        rotate: Math.random() * 360,
        duration: 1 + Math.random(),
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: p.color, left: `${p.x}%`, top: "-20px" }}
          initial={{ y: 0, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: 0, rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add Confetti celebration component"
```

---

## Task 7: LanguageToggle + SoundToggle 组件

**Files:**
- Create: `src/components/LanguageToggle.tsx`
- Create: `src/components/SoundToggle.tsx`

- [ ] **Step 1: 写 LanguageToggle**

Write `src/components/LanguageToggle.tsx`:

```tsx
import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const isZh = i18n.language === "zh";

  return (
    <button
      onClick={() => i18n.changeLanguage(isZh ? "en" : "zh")}
      className="px-3 py-1.5 rounded-full bg-white shadow-md text-sm font-bold text-purple-600 active:scale-95 transition-transform"
    >
      {isZh ? "EN" : "中"}
    </button>
  );
}
```

- [ ] **Step 2: 写 SoundToggle**

Write `src/components/SoundToggle.tsx`:

```tsx
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getSoundEnabled, setSoundEnabled } from "../lib/storage";
import { setSoundEnabledGlobal } from "../lib/audio";

export function SoundToggle() {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const stored = getSoundEnabled();
    setEnabled(stored);
    setSoundEnabledGlobal(stored);
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setSoundEnabled(next);
    setSoundEnabledGlobal(next);
  };

  return (
    <button
      onClick={toggle}
      className="px-3 py-1.5 rounded-full bg-white shadow-md text-lg active:scale-95 transition-transform"
    >
      {enabled ? "🔊" : "🔇"}
    </button>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add LanguageToggle and SoundToggle components"
```

---

## Task 8: GameShell 通用壳组件

**Files:**
- Create: `src/components/GameShell.tsx`

- [ ] **Step 1: 写 GameShell 组件**

Write `src/components/GameShell.tsx`:

```tsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface GameShellProps {
  title: string;
  children: React.ReactNode;
  showBack?: boolean;
}

export function GameShell({ title, children, showBack = true }: GameShellProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.div
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
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add GameShell layout component with back button and toggles"
```

---

## Task 9: 舒尔特方格逻辑（纯函数）

**Files:**
- Create: `src/games/schulte/schulteLogic.ts`
- Test: `src/games/schulte/__tests__/schulteLogic.test.ts`

- [ ] **Step 1: 写失败测试**

Write `src/games/schulte/__tests__/schulteLogic.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { generateGrid, generateTargetSequence, type SchulteMode } from "../schulteLogic";

describe("generateGrid", () => {
  it("generates a 3x3 grid with numbers 1-9 shuffled", () => {
    const grid = generateGrid(3);
    expect(grid).toHaveLength(9);
    const sorted = [...grid].sort((a, b) => a - b);
    expect(sorted).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("generates a 5x5 grid with numbers 1-25 shuffled", () => {
    const grid = generateGrid(5);
    expect(grid).toHaveLength(25);
    const sorted = [...grid].sort((a, b) => a - b);
    expect(sorted).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
  });

  it("shuffles (two calls unlikely identical)", () => {
    // Run 20 times; at least one should differ
    let allSame = true;
    const first = generateGrid(4).join(",");
    for (let i = 0; i < 20; i++) {
      if (generateGrid(4).join(",") !== first) {
        allSame = false;
        break;
      }
    }
    expect(allSame).toBe(false);
  });
});

describe("generateTargetSequence", () => {
  const size = 3;
  const max = size * size;

  it("forward mode: 1 to max", () => {
    const seq = generateTargetSequence("forward", size);
    expect(seq).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("backward mode: max to 1", () => {
    const seq = generateTargetSequence("backward", size);
    expect(seq).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1]);
  });

  it("random mode: contains all numbers 1-max, no repeats", () => {
    const seq = generateTargetSequence("random", size);
    expect(seq).toHaveLength(max);
    const sorted = [...seq].sort((a, b) => a - b);
    expect(sorted).toEqual(Array.from({ length: max }, (_, i) => i + 1));
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/games/schulte/__tests__/schulteLogic.test.ts`
Expected: FAIL — "Cannot find module '../schulteLogic'"

- [ ] **Step 3: 写实现**

Write `src/games/schulte/schulteLogic.ts`:

```ts
export type SchulteMode = "forward" | "backward" | "random";

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateGrid(size: number): number[] {
  const total = size * size;
  return shuffle(Array.from({ length: total }, (_, i) => i + 1));
}

export function generateTargetSequence(mode: SchulteMode, size: number): number[] {
  const total = size * size;
  const numbers = Array.from({ length: total }, (_, i) => i + 1);

  switch (mode) {
    case "forward":
      return numbers;
    case "backward":
      return numbers.reverse();
    case "random":
      return shuffle(numbers);
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run src/games/schulte/__tests__/schulteLogic.test.ts`
Expected: PASS — 5 tests passed

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add schulte grid logic (grid generation + target sequence)"
```

---

## Task 10: 舒尔特方格 — 设置屏

**Files:**
- Create: `src/games/schulte/SchulteSetup.tsx`

- [ ] **Step 1: 写设置屏组件**

Write `src/games/schulte/SchulteSetup.tsx`:

```tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { SchulteMode } from "./schulteLogic";

interface SchulteSetupProps {
  onStart: (mode: SchulteMode, size: number) => void;
  bestTimes: Record<string, number | null>;
}

export function SchulteSetup({ onStart, bestTimes }: SchulteSetupProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<SchulteMode>("forward");
  const [size, setSize] = useState(3);

  const modes: SchulteMode[] = ["forward", "backward", "random"];
  const sizes = [3, 4, 5];

  const bestKey = `schulte-${mode}-${size}`;

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="w-full">
        <p className="text-lg font-bold text-purple-600 mb-3 text-center">{t("schulte.mode.forward")}</p>
        <div className="flex gap-3 justify-center flex-wrap">
          {modes.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-5 py-3 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
                mode === m
                  ? "bg-purple-500 text-white shadow-lg scale-105"
                  : "bg-white text-purple-500 shadow-md"
              }`}
            >
              {t(`schulte.mode.${m}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="text-lg font-bold text-purple-600 mb-3 text-center">{t("schulte.difficulty.3").split(" ")[1]}</p>
        <div className="flex gap-3 justify-center">
          {sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-5 py-3 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
                size === s
                  ? "bg-sky-500 text-white shadow-lg scale-105"
                  : "bg-white text-sky-500 shadow-md"
              }`}
            >
              {t(`schulte.difficulty.${s}`)}
            </button>
          ))}
        </div>
      </div>

      {bestTimes[bestKey] != null && (
        <p className="text-purple-400 font-bold">
          {t("schulte.bestTime", { seconds: bestTimes[bestKey] })}
        </p>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onStart(mode, size)}
        className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white font-bold text-2xl shadow-xl"
      >
        {t("common.start")}
      </motion.button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add schulte grid setup screen (mode + difficulty selection)"
```

---

## Task 11: 舒尔特方格 — 棋盘与格子

**Files:**
- Create: `src/games/schulte/SchulteCell.tsx`
- Create: `src/games/schulte/SchulteBoard.tsx`

- [ ] **Step 1: 写 SchulteCell 组件**

Write `src/games/schulte/SchulteCell.tsx`:

```tsx
import { motion } from "framer-motion";

interface SchulteCellProps {
  number: number;
  state: "default" | "correct" | "wrong";
  onClick: () => void;
}

export function SchulteCell({ number, state, onClick }: SchulteCellProps) {
  const bg =
    state === "correct"
      ? "bg-green-400 text-white"
      : state === "wrong"
      ? "bg-red-300 text-white"
      : "bg-white text-purple-700";

  return (
    <motion.button
      onClick={onClick}
      animate={
        state === "wrong"
          ? { x: [0, -8, 8, -6, 6, 0] }
          : state === "correct"
          ? { scale: [1, 1.15, 1] }
          : {}
      }
      transition={{ duration: 0.3 }}
      className={`w-full aspect-square rounded-2xl shadow-md font-bold flex items-center justify-center ${bg} transition-colors duration-200`}
      style={{ fontSize: "clamp(1.5rem, 6vw, 2.5rem)" }}
    >
      {number}
    </motion.button>
  );
}
```

- [ ] **Step 2: 写 SchulteBoard 组件**

Write `src/games/schulte/SchulteBoard.tsx`:

```tsx
import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { SchulteCell } from "./SchulteCell";
import { generateGrid, generateTargetSequence, type SchulteMode } from "./schulteLogic";
import { useTimer } from "../../hooks/useTimer";
import { playSound } from "../../lib/audio";

interface SchulteBoardProps {
  mode: SchulteMode;
  size: number;
  onComplete: (elapsed: number) => void;
}

export function SchulteBoard({ mode, size, onComplete }: SchulteBoardProps) {
  const { t } = useTranslation();
  const [grid] = useState(() => generateGrid(size));
  const [targetSeq] = useState(() => generateTargetSequence(mode, size));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wrongCell, setWrongCell] = useState<number | null>(null);
  const timer = useTimer();

  useEffect(() => {
    if (currentIndex >= targetSeq.length && timer.isRunning) {
      timer.stop();
      playSound("win");
      onComplete(timer.elapsed);
    }
  }, [currentIndex]);

  const handleCellClick = useCallback(
    (cellValue: number) => {
      if (currentIndex === 0 && !timer.isRunning) {
        timer.start();
      }

      if (cellValue === targetSeq[currentIndex]) {
        playSound("correct");
        setCurrentIndex((prev) => prev + 1);
      } else {
        playSound("wrong");
        setWrongCell(cellValue);
        setTimeout(() => setWrongCell(null), 400);
      }
    },
    [currentIndex, targetSeq, timer]
  );

  const getCellState = (cellValue: number): "default" | "correct" | "wrong" => {
    const targetIndex = targetSeq.indexOf(cellValue);
    if (targetIndex < currentIndex) return "correct";
    if (wrongCell === cellValue) return "wrong";
    return "default";
  };

  const nextTarget = targetSeq[currentIndex];

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold text-purple-600">
          {t("common.timeUsed", { seconds: timer.elapsed.toFixed(1) })}
        </span>
        {mode === "random" && nextTarget && (
          <motion.span
            key={nextTarget}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-bold text-pink-500 bg-pink-100 px-4 py-1 rounded-full"
          >
            {t("schulte.findNext", { target: nextTarget })}
          </motion.span>
        )}
      </div>

      <div
        className="grid gap-2 w-full"
        style={{
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          maxWidth: `${size * 90}px`,
        }}
      >
        {grid.map((number, i) => (
          <SchulteCell
            key={i}
            number={number}
            state={getCellState(number)}
            onClick={() => handleCellClick(number)}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add schulte grid board with cells, timing, and mode feedback"
```

---

## Task 12: 舒尔特方格 — 页面整合

**Files:**
- Create: `src/games/schulte/SchultePage.tsx`

- [ ] **Step 1: 写 SchultePage**

Write `src/games/schulte/SchultePage.tsx`:

```tsx
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GameShell } from "../../components/GameShell";
import { Confetti } from "../../components/Confetti";
import { SchulteSetup } from "./SchulteSetup";
import { SchulteBoard } from "./SchulteBoard";
import type { SchulteMode } from "./schulteLogic";
import { getBestTime, setBestTime } from "../../lib/storage";

type Phase = "setup" | "playing" | "done";

export function SchultePage() {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>("setup");
  const [mode, setMode] = useState<SchulteMode>("forward");
  const [size, setSize] = useState(3);
  const [finalTime, setFinalTime] = useState(0);
  const [bestTimes, setBestTimes] = useState<Record<string, number | null>>({});

  const refreshBestTime = useCallback((m: SchulteMode, s: number) => {
    const key = `schulte-${m}-${s}`;
    setBestTimes((prev) => ({ ...prev, [key]: getBestTime(key) }));
  }, []);

  const handleStart = useCallback((m: SchulteMode, s: number) => {
    setMode(m);
    setSize(s);
    setPhase("playing");
  }, []);

  const handleComplete = useCallback(
    (elapsed: number) => {
      setFinalTime(elapsed);
      const key = `schulte-${mode}-${size}`;
      setBestTime(key, elapsed);
      setPhase("done");
    },
    [mode, size]
  );

  const handleRestart = useCallback(() => {
    refreshBestTime(mode, size);
    setPhase("setup");
  }, [mode, size, refreshBestTime]);

  return (
    <GameShell title={t("schulte.title")}>
      <AnimatePresence mode="wait">
        {phase === "setup" && (
          <motion.div key="setup" exit={{ opacity: 0 }} className="w-full">
            <SchulteSetup onStart={handleStart} bestTimes={bestTimes} />
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div key="playing" exit={{ opacity: 0 }} className="w-full">
            <SchulteBoard mode={mode} size={size} onComplete={handleComplete} />
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div
            key="done"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <Confetti />
            <h2 className="text-4xl font-bold text-purple-600">{t("common.completed")}</h2>
            <p className="text-2xl font-bold text-purple-500">
              {t("common.timeUsed", { seconds: finalTime.toFixed(1) })}
            </p>
            <button
              onClick={handleRestart}
              className="px-8 py-3 rounded-full bg-purple-500 text-white font-bold text-xl shadow-lg active:scale-95 transition-transform"
            >
              {t("common.restart")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add schulte grid page integrating setup, board, and completion"
```

---

## Task 13: 记忆对对碰逻辑（纯函数）

**Files:**
- Create: `src/games/memory-match/memoryLogic.ts`
- Test: `src/games/memory-match/__tests__/memoryLogic.test.ts`

- [ ] **Step 1: 写失败测试**

Write `src/games/memory-match/__tests__/memoryLogic.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { generateCards, isMatch } from "../memoryLogic";

describe("generateCards", () => {
  it("generates 4 cards for 2 pairs", () => {
    const cards = generateCards(2);
    expect(cards).toHaveLength(4);
    const emojiCounts: Record<string, number> = {};
    cards.forEach((c) => {
      emojiCounts[c.emoji] = (emojiCounts[c.emoji] || 0) + 1;
    });
    expect(Object.keys(emojiCounts)).toHaveLength(2);
    Object.values(emojiCounts).forEach((count) => expect(count).toBe(2));
  });

  it("generates 12 cards for 6 pairs", () => {
    const cards = generateCards(6);
    expect(cards).toHaveLength(12);
  });

  it("each card starts face down and not matched", () => {
    const cards = generateCards(4);
    cards.forEach((card) => {
      expect(card.isFlipped).toBe(false);
      expect(card.isMatched).toBe(false);
    });
  });

  it("shuffles card positions", () => {
    const first = generateCards(4).map((c) => c.emoji).join(",");
    let allSame = true;
    for (let i = 0; i < 20; i++) {
      if (generateCards(4).map((c) => c.emoji).join(",") !== first) {
        allSame = false;
        break;
      }
    }
    expect(allSame).toBe(false);
  });
});

describe("isMatch", () => {
  it("returns true when emojis match", () => {
    expect(isMatch({ emoji: "🐶" }, { emoji: "🐶" })).toBe(true);
  });

  it("returns false when emojis differ", () => {
    expect(isMatch({ emoji: "🐶" }, { emoji: "🐱" })).toBe(false);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/games/memory-match/__tests__/memoryLogic.test.ts`
Expected: FAIL — "Cannot find module '../memoryLogic'"

- [ ] **Step 3: 写实现**

Write `src/games/memory-match/memoryLogic.ts`:

```ts
export interface MemoryCardData {
  id: number;
  emoji: string;
  nameZh: string;
  nameEn: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJI_POOL: { emoji: string; nameZh: string; nameEn: string }[] = [
  { emoji: "🐶", nameZh: "小狗", nameEn: "Dog" },
  { emoji: "🐱", nameZh: "小猫", nameEn: "Cat" },
  { emoji: "🐰", nameZh: "兔子", nameEn: "Rabbit" },
  { emoji: "🐻", nameZh: "小熊", nameEn: "Bear" },
  { emoji: "🐼", nameZh: "熊猫", nameEn: "Panda" },
  { emoji: "🦁", nameZh: "狮子", nameEn: "Lion" },
  { emoji: "🐸", nameZh: "青蛙", nameEn: "Frog" },
  { emoji: "🐵", nameZh: "猴子", nameEn: "Monkey" },
  { emoji: "🚗", nameZh: "汽车", nameEn: "Car" },
  { emoji: "🍎", nameZh: "苹果", nameEn: "Apple" },
  { emoji: "🍌", nameZh: "香蕉", nameEn: "Banana" },
  { emoji: "⚽", nameZh: "足球", nameEn: "Ball" },
];

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateCards(pairs: number): MemoryCardData[] {
  const selected = shuffle(EMOJI_POOL).slice(0, pairs);
  const cards: MemoryCardData[] = selected.flatMap((item, pairIndex) => {
    const baseId = pairIndex * 2;
    return [
      { ...item, id: baseId, isFlipped: false, isMatched: false },
      { ...item, id: baseId + 1, isFlipped: false, isMatched: false },
    ];
  });
  return shuffle(cards);
}

export function isMatch(cardA: Pick<MemoryCardData, "emoji">, cardB: Pick<MemoryCardData, "emoji">): boolean {
  return cardA.emoji === cardB.emoji;
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run src/games/memory-match/__tests__/memoryLogic.test.ts`
Expected: PASS — 5 tests passed

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add memory match logic (card generation + match checking)"
```

---

## Task 14: 记忆对对碰 — 设置屏

**Files:**
- Create: `src/games/memory-match/MemorySetup.tsx`

- [ ] **Step 1: 写设置屏组件**

Write `src/games/memory-match/MemorySetup.tsx`:

```tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface MemorySetupProps {
  onStart: (pairs: number, player1: string, player2: string) => void;
}

export function MemorySetup({ onStart }: MemorySetupProps) {
  const { t } = useTranslation();
  const [pairs, setPairs] = useState(2);
  const [player1, setPlayer1] = useState(t("memory.player1"));
  const [player2, setPlayer2] = useState(t("memory.player2"));

  const pairOptions = [2, 4, 6];

  return (
    <div className="w-full flex flex-col items-center gap-8">
      <div className="w-full">
        <p className="text-lg font-bold text-purple-600 mb-3 text-center">❤️</p>
        <div className="flex flex-col gap-3 items-center">
          <input
            type="text"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
            maxLength={10}
            className="px-4 py-3 rounded-2xl bg-white shadow-md text-center font-bold text-pink-600 text-lg w-48 outline-none focus:ring-2 ring-pink-300"
            placeholder={t("memory.player1")}
          />
          <span className="text-2xl">🆚</span>
          <input
            type="text"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
            maxLength={10}
            className="px-4 py-3 rounded-2xl bg-white shadow-md text-center font-bold text-sky-600 text-lg w-48 outline-none focus:ring-2 ring-sky-300"
            placeholder={t("memory.player2")}
          />
        </div>
      </div>

      <div className="w-full">
        <p className="text-lg font-bold text-purple-600 mb-3 text-center">🎮</p>
        <div className="flex gap-3 justify-center flex-wrap">
          {pairOptions.map((p) => (
            <button
              key={p}
              onClick={() => setPairs(p)}
              className={`px-5 py-3 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
                pairs === p
                  ? "bg-sky-500 text-white shadow-lg scale-105"
                  : "bg-white text-sky-500 shadow-md"
              }`}
            >
              {t(`memory.difficulty.${p}`)}
            </button>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onStart(pairs, player1 || t("memory.player1"), player2 || t("memory.player2"))}
        className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white font-bold text-2xl shadow-xl"
      >
        {t("common.start")}
      </motion.button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add memory match setup screen (nicknames + difficulty)"
```

---

## Task 15: 记忆对对碰 — 卡片与棋盘

**Files:**
- Create: `src/games/memory-match/MemoryCard.tsx`
- Create: `src/games/memory-match/MemoryBoard.tsx`

- [ ] **Step 1: 写 MemoryCard 组件（3D 翻转）**

Write `src/games/memory-match/MemoryCard.tsx`:

```tsx
import { motion } from "framer-motion";
import type { MemoryCardData } from "./memoryLogic";

interface MemoryCardProps {
  card: MemoryCardData;
  isRevealed: boolean;
  lang: "zh" | "en";
  onClick: () => void;
  disabled: boolean;
}

export function MemoryCard({ card, isRevealed, lang, onClick, disabled }: MemoryCardProps) {
  const showFront = isRevealed || card.isMatched;

  return (
    <div className="w-full" style={{ perspective: "800px" }}>
      <motion.button
        onClick={onClick}
        disabled={disabled}
        animate={{ rotateY: showFront ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
        className="relative w-full aspect-square rounded-2xl shadow-md disabled:cursor-default"
      >
        {/* 背面 */}
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-3xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          ❓
        </div>
        {/* 正面 */}
        <div
          className={`absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-1 ${
            card.isMatched ? "bg-green-200" : "bg-white"
          }`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-4xl">{card.emoji}</span>
          {card.isMatched && (
            <span className="text-xs font-bold text-purple-500">
              {lang === "zh" ? card.nameZh : card.nameEn}
            </span>
          )}
        </div>
      </motion.button>
    </div>
  );
}
```

- [ ] **Step 2: 写 MemoryBoard 组件（回合管理）**

Write `src/games/memory-match/MemoryBoard.tsx`:

```tsx
import { useState, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MemoryCard } from "./MemoryCard";
import { generateCards, isMatch, type MemoryCardData } from "./memoryLogic";
import { playSound } from "../../lib/audio";

interface MemoryBoardProps {
  pairs: number;
  player1: string;
  player2: string;
  onComplete: (scores: [number, number]) => void;
}

export function MemoryBoard({ pairs, player1, player2, onComplete }: MemoryBoardProps) {
  const { t, i18n } = useTranslation();
  const [cards, setCards] = useState<MemoryCardData[]>(() => generateCards(pairs));
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<0 | 1>(0);
  const [scores, setScores] = useState<[number, number]>([0, 0]);
  const [locked, setLocked] = useState(false);

  const allMatched = cards.every((c) => c.isMatched);

  useEffect(() => {
    if (allMatched && cards.length > 0) {
      playSound("win");
      const timer = setTimeout(() => onComplete(scores), 1500);
      return () => clearTimeout(timer);
    }
  }, [allMatched, cards.length, scores, onComplete]);

  const handleClick = useCallback(
    (cardId: number) => {
      if (locked) return;
      const card = cards.find((c) => c.id === cardId);
      if (!card || card.isMatched || flippedIds.includes(cardId)) return;

      playSound("flip");
      const newFlipped = [...flippedIds, cardId];
      setFlippedIds(newFlipped);

      if (newFlipped.length === 2) {
        setLocked(true);
        const [idA, idB] = newFlipped;
        const cardA = cards.find((c) => c.id === idA)!;
        const cardB = cards.find((c) => c.id === idB)!;

        if (isMatch(cardA, cardB)) {
          setTimeout(() => {
            playSound("correct");
            setCards((prev) =>
              prev.map((c) =>
                c.id === idA || c.id === idB ? { ...c, isMatched: true } : c
              )
            );
            setScores((prev) => {
              const next = [...prev] as [number, number];
              next[currentPlayer]++;
              return next;
            });
            setFlippedIds([]);
            setLocked(false);
          }, 600);
        } else {
          setTimeout(() => {
            setFlippedIds([]);
            setCurrentPlayer((p) => (p === 0 ? 1 : 0));
            setLocked(false);
          }, 1200);
        }
      }
    },
    [cards, flippedIds, locked, currentPlayer]
  );

  const playerName = currentPlayer === 0 ? player1 : player2;
  const playerColor = currentPlayer === 0 ? "text-pink-500" : "text-sky-500";
  const playerBg = currentPlayer === 0 ? "bg-pink-100" : "bg-sky-100";

  const cols = pairs <= 2 ? 2 : pairs <= 4 ? 4 : 4;

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-full flex justify-center gap-6">
        <div className={`px-4 py-2 rounded-2xl font-bold text-lg ${currentPlayer === 0 ? "bg-pink-200 text-pink-700 scale-105" : "bg-white text-pink-400"}`}>
          {player1}: {scores[0]}
        </div>
        <div className={`px-4 py-2 rounded-2xl font-bold text-lg ${currentPlayer === 1 ? "bg-sky-200 text-sky-700 scale-105" : "bg-white text-sky-400"}`}>
          {player2}: {scores[1]}
        </div>
      </div>

      <div className={`px-6 py-2 rounded-full font-bold text-lg ${playerBg} ${playerColor}`}>
        {t("memory.turn", { name: playerName })}
      </div>

      <div
        className="grid gap-2 w-full"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, maxWidth: `${cols * 90}px` }}
      >
        {cards.map((card) => (
          <MemoryCard
            key={card.id}
            card={card}
            isRevealed={flippedIds.includes(card.id)}
            lang={i18n.language as "zh" | "en"}
            onClick={() => handleClick(card.id)}
            disabled={locked}
          />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add memory match board with cards, turn management, and scoring"
```

---

## Task 16: 记忆对对碰 — 页面整合

**Files:**
- Create: `src/games/memory-match/MemoryPage.tsx`

- [ ] **Step 1: 写 MemoryPage**

Write `src/games/memory-match/MemoryPage.tsx`:

```tsx
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GameShell } from "../../components/GameShell";
import { Confetti } from "../../components/Confetti";
import { MemorySetup } from "./MemorySetup";
import { MemoryBoard } from "./MemoryBoard";

type Phase = "setup" | "playing" | "done";

export function MemoryPage() {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>("setup");
  const [pairs, setPairs] = useState(2);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [finalScores, setFinalScores] = useState<[number, number]>([0, 0]);

  const handleStart = useCallback((p: number, p1: string, p2: string) => {
    setPairs(p);
    setPlayer1(p1);
    setPlayer2(p2);
    setPhase("playing");
  }, []);

  const handleComplete = useCallback((scores: [number, number]) => {
    setFinalScores(scores);
    setPhase("done");
  }, []);

  const winnerText =
    finalScores[0] > finalScores[1]
      ? t("memory.winner", { name: player1 })
      : finalScores[0] < finalScores[1]
      ? t("memory.winner", { name: player2 })
      : t("memory.tie");

  return (
    <GameShell title={t("memory.title")}>
      <AnimatePresence mode="wait">
        {phase === "setup" && (
          <motion.div key="setup" exit={{ opacity: 0 }} className="w-full">
            <MemorySetup onStart={handleStart} />
          </motion.div>
        )}

        {phase === "playing" && (
          <motion.div key="playing" exit={{ opacity: 0 }} className="w-full">
            <MemoryBoard
              pairs={pairs}
              player1={player1}
              player2={player2}
              onComplete={handleComplete}
            />
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div
            key="done"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-6"
          >
            <Confetti />
            <h2 className="text-4xl font-bold text-purple-600">{winnerText}</h2>
            <div className="flex gap-6 text-2xl font-bold">
              <span className="text-pink-500">{player1}: {finalScores[0]}</span>
              <span className="text-sky-500">{player2}: {finalScores[1]}</span>
            </div>
            <button
              onClick={() => setPhase("setup")}
              className="px-8 py-3 rounded-full bg-purple-500 text-white font-bold text-xl shadow-lg active:scale-95 transition-transform"
            >
              {t("common.restart")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </GameShell>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add memory match page integrating setup, board, and completion"
```

---

## Task 17: 首页

**Files:**
- Create: `src/pages/HomePage.tsx`

- [ ] **Step 1: 写首页组件**

Write `src/pages/HomePage.tsx`:

```tsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "../components/LanguageToggle";
import { SoundToggle } from "../components/SoundToggle";

export function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const games = [
    { id: "schulte", path: "/schulte", emoji: "🔢", title: t("schulte.title"), desc: t("schulte.description"), color: "from-purple-400 to-indigo-500" },
    { id: "memory", path: "/memory", emoji: "🃏", title: t("memory.title"), desc: t("memory.description"), color: "from-pink-400 to-rose-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <SoundToggle />
        <LanguageToggle />
      </div>

      <motion.h1
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="text-5xl font-bold text-purple-600 mb-2"
      >
        {t("app.title")}
      </motion.h1>
      <p className="text-xl text-purple-400 mb-10">{t("app.subtitle")}</p>

      <div className="flex flex-col gap-4 w-full max-w-md">
        {games.map((game, i) => (
          <motion.button
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
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: add home page with game selection cards"
```

---

## Task 18: App 路由与入口整合

**Files:**
- Create: `src/app/App.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: 写 App 路由**

Write `src/app/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { HomePage } from "../pages/HomePage";
import { SchultePage } from "../games/schulte/SchultePage";
import { MemoryPage } from "../games/memory-match/MemoryPage";

export function App() {
  return (
    <BrowserRouter basename="/tinyMind">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schulte" element={<SchultePage />} />
          <Route path="/memory" element={<MemoryPage />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}
```

- [ ] **Step 2: 更新 main.tsx 整合 i18n 和 App**

Write `src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./i18n";
import { App } from "./app/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 3: 验证开发服务器**

Run: `npm run dev`
Expected: 首页显示标题和两个游戏卡片，点击可进入设置/游戏页面

- [ ] **Step 4: 验证全部测试通过**

Run: `npx vitest run`
Expected: ALL PASS

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: wire up routing, i18n, and app entry point"
```

---

## Task 19: GitHub Pages 部署

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 写 GitHub Actions 部署工作流**

Write `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 验证生产构建**

Run: `npm run build`
Expected: `dist/` 目录生成，无错误

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "ci: add GitHub Pages auto-deploy workflow"
```

- [ ] **Step 4: 推送并启用 Pages**

```bash
git push origin main
```

Then in GitHub repo Settings → Pages → Source: select "GitHub Actions"

---

## Summary

- **Task 1**: 项目脚手架 (Vite + React + TS + Tailwind + Framer Motion)
- **Task 2**: i18n 国际化配置 (中英双语)
- **Task 3**: localStorage 封装 (最佳成绩 + 音效设置)
- **Task 4**: Web Audio 音效合成 (零素材依赖)
- **Task 5**: useTimer Hook (计时器)
- **Task 6**: Confetti 撒花组件
- **Task 7**: LanguageToggle + SoundToggle
- **Task 8**: GameShell 通用壳
- **Task 9**: 舒尔特方格逻辑 (TDD)
- **Task 10-12**: 舒尔特方格 UI (设置 → 棋盘 → 完成)
- **Task 13**: 记忆对对碰逻辑 (TDD)
- **Task 14-16**: 记忆对对碰 UI (设置 → 棋盘 → 完成)
- **Task 17**: 首页
- **Task 18**: 路由整合
- **Task 19**: GitHub Pages 部署
