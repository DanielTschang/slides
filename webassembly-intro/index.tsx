import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  type SlideTransition,
  Step,
  Steps,
  useSlidePageNumber,
} from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

export const design: DesignSystem = {
  palette: { bg: '#0c0a18', text: '#f3f1ff', accent: '#654ff0' },
  fonts: {
    display:
      '"JetBrains Mono", "SF Mono", ui-monospace, Menlo, "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", monospace',
    body: '-apple-system, BlinkMacSystemFont, "Inter", "PingFang TC", "Noto Sans TC", "Microsoft JhengHei", system-ui, sans-serif',
  },
  typeScale: { hero: 180, body: 34 },
  radius: 14,
};

// ─── Webfont (latin mono only; CJK falls back to the system stack) ──────────
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&display=swap';
const FONT_LINK_ID = 'osd-webfont-webassembly-intro';
if (typeof document !== 'undefined') {
  let link = document.getElementById(FONT_LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  if (link.href !== FONT_HREF) link.href = FONT_HREF;
}

// ─── Extra palette (outside the DesignSystem shape) ─────────────────────────
const accentSoft = '#a798ff';
const rust = '#ff7a3d';
const mint = '#7ee2b8';
const muted = '#8e89ad';
const surface = '#151229';
const line = '#2a2550';

const mono = 'var(--osd-font-display)';

// ─── Transitions: RISE as house, SETTLE for the cover ──────────────────────
const EASE_OUT = 'cubic-bezier(0, 0, 0.2, 1)';
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
const HOLD: Keyframe[] = [{ opacity: 1 }, { opacity: 1 }];

export const transition: SlideTransition = {
  duration: 260,
  exit: { duration: 260, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 260,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ],
  },
};

// ─── Shared layout ──────────────────────────────────────────────────────────
const base: CSSProperties = {
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  position: 'relative',
  backgroundColor: 'var(--osd-bg)',
  backgroundImage:
    'linear-gradient(rgba(101,79,240,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(101,79,240,0.07) 1px, transparent 1px)',
  backgroundSize: '80px 80px',
  color: 'var(--osd-text)',
  fontFamily: 'var(--osd-font-body)',
};

const Footer = ({ chapter }: { chapter: string }) => {
  const { current, total } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 140,
        right: 140,
        bottom: 52,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: mono,
        fontSize: 22,
        color: muted,
        letterSpacing: '0.08em',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 14, height: 14, background: 'var(--osd-accent)', borderRadius: 3 }} />
        WEBASSEMBLY 入門
      </span>
      <span>{chapter}</span>
      <span>
        {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  );
};

const Frame = ({ chapter, children }: { chapter: string; children: ReactNode }) => (
  <div style={{ ...base, padding: '110px 140px 0' }}>
    {children}
    <Footer chapter={chapter} />
  </div>
);

const Header = ({ eyebrow, title }: { eyebrow: string; title: ReactNode }) => (
  <div>
    <div
      style={{
        fontFamily: mono,
        fontSize: 26,
        fontWeight: 500,
        color: accentSoft,
        letterSpacing: '0.12em',
      }}
    >
      {eyebrow}
    </div>
    <h2
      style={{
        fontFamily: mono,
        fontSize: 72,
        fontWeight: 800,
        lineHeight: 1.2,
        margin: '20px 0 0',
        letterSpacing: '-0.01em',
      }}
    >
      {title}
    </h2>
  </div>
);

// Stylised Wasm mark: a square with a notch, "WA" set into it.
const WasmMark = ({ size }: { size: number }) => (
  <div
    style={{
      position: 'relative',
      width: size,
      height: size,
      background: 'var(--osd-accent)',
      borderRadius: size * 0.05,
      boxShadow: '0 40px 140px rgba(101,79,240,0.45)',
    }}
  >
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: -size * 0.17,
        width: size * 0.34,
        height: size * 0.34,
        marginLeft: -size * 0.17,
        borderRadius: '50%',
        background: 'var(--osd-bg)',
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: size * 0.09,
        textAlign: 'center',
        fontFamily: mono,
        fontWeight: 800,
        fontSize: size * 0.36,
        lineHeight: 1,
        color: '#ffffff',
        letterSpacing: '-0.02em',
      }}
    >
      WA
    </div>
  </div>
);

// ─── 01 Cover ───────────────────────────────────────────────────────────────
const Cover: Page = () => (
  <div
    style={{
      ...base,
      padding: '0 140px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      isolation: 'isolate',
    }}
  >
    <div
      style={{
        position: 'absolute',
        zIndex: -1,
        right: -200,
        top: 140,
        width: 1000,
        height: 800,
        background: 'radial-gradient(closest-side, rgba(101,79,240,0.22), transparent)',
      }}
    />
    <div style={{ fontFamily: mono, fontSize: 28, color: muted, letterSpacing: '0.12em' }}>
      <span style={{ color: accentSoft }}>00 61 73 6d</span> 01 00 00 00
    </div>
    <h1
      style={{
        fontFamily: mono,
        fontSize: 'var(--osd-size-hero)',
        fontWeight: 800,
        lineHeight: 1.05,
        letterSpacing: '-0.03em',
        margin: '36px 0 32px',
      }}
    >
      WebAssembly
    </h1>
    <p style={{ fontSize: 44, lineHeight: 1.5, color: muted, margin: 0, maxWidth: 1180 }}>
      讓任何語言，以<span style={{ color: 'var(--osd-text)' }}>接近原生的速度</span>
      ，安全地跑在任何地方
    </p>
    <div
      style={{
        marginTop: 72,
        display: 'flex',
        gap: 24,
        fontFamily: mono,
        fontSize: 26,
        color: accentSoft,
        letterSpacing: '0.08em',
      }}
    >
      <span>10 分鐘入門</span>
      <span style={{ color: line }}>/</span>
      <span>2026.10.22</span>
    </div>
    <div style={{ position: 'absolute', right: 140, top: '50%', marginTop: -180 }}>
      <WasmMark size={360} />
    </div>
  </div>
);

Cover.transition = {
  duration: 280,
  exit: { duration: 280, easing: EASE_IN, keyframes: HOLD },
  enter: {
    duration: 280,
    easing: EASE_OUT,
    keyframes: [
      { opacity: 0, transform: 'translateY(12px)', filter: 'blur(4px)' },
      { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
    ],
  },
};

// ─── 02 Agenda ──────────────────────────────────────────────────────────────
const AgendaRow = ({ num, title, sub, last }: { num: string; title: string; sub: string; last?: boolean }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 56,
      padding: '32px 0',
      borderTop: `1px solid ${line}`,
      borderBottom: last ? `1px solid ${line}` : undefined,
    }}
  >
    <span
      style={{
        fontFamily: mono,
        fontSize: 88,
        fontWeight: 800,
        lineHeight: 1,
        color: 'var(--osd-accent)',
        width: 170,
      }}
    >
      {num}
    </span>
    <div>
      <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 32, color: muted, marginTop: 12, lineHeight: 1.5 }}>{sub}</div>
    </div>
  </div>
);

const Agenda: Page = () => (
  <Frame chapter="AGENDA">
    <Header eyebrow="AGENDA" title="今天聊三件事" />
    <div style={{ marginTop: 56 }}>
      <AgendaRow num="01" title="是什麼？" sub="二進位指令格式、沙箱模型、與 JavaScript 的分工" />
      <AgendaRow num="02" title="什麼情境適合？" sub="常見使用場景，以及該用與不該用的判斷準則" />
      <AgendaRow num="03" title="各語言差異" sub="同樣編譯成 Wasm 代價不同——以及為何推薦 Rust" last />
    </div>
  </Frame>
);

// ─── 03 What is it ──────────────────────────────────────────────────────────
const PropCard = ({ tag, title, desc }: { tag: string; title: string; desc: string }) => (
  <div
    style={{
      background: surface,
      border: `1px solid ${line}`,
      borderTop: '4px solid var(--osd-accent)',
      borderRadius: 'var(--osd-radius)',
      padding: '36px 36px 40px',
    }}
  >
    <div style={{ fontFamily: mono, fontSize: 22, color: accentSoft, letterSpacing: '0.14em' }}>{tag}</div>
    <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.2, marginTop: 16 }}>{title}</div>
    <div style={{ fontSize: 27, color: muted, lineHeight: 1.55, marginTop: 16 }}>{desc}</div>
  </div>
);

const WhatIs: Page = () => (
  <Frame chapter="01 · 是什麼">
    <Header eyebrow="01 · 是什麼" title="一種可攜的二進位指令格式" />
    <p style={{ fontSize: 40, lineHeight: 1.6, color: muted, margin: '40px 0 0' }}>
      不是一門新語言，而是各種語言共同的
      <span style={{ color: 'var(--osd-text)' }}>「編譯目標」</span>——一台規格公開的虛擬 CPU。
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, marginTop: 56 }}>
      <PropCard tag="FAST" title="接近原生速度" desc="靜態型別、預先編譯，載入後即可高速執行" />
      <PropCard tag="SAFE" title="沙箱隔離" desc="預設沒有任何權限，只能呼叫宿主給的函式" />
      <PropCard tag="PORTABLE" title="到處都能跑" desc="瀏覽器、伺服器、邊緣節點、嵌入式裝置" />
      <PropCard tag="POLYGLOT" title="語言中立" desc="Rust、C/C++、Go、C#、Kotlin 都能編譯過來" />
    </div>
    <div style={{ fontFamily: mono, fontSize: 24, color: muted, marginTop: 48, letterSpacing: '0.02em' }}>
      <span style={{ color: accentSoft }}>2019.12</span> 成為 W3C 正式推薦標準 —— 繼 HTML、CSS、JavaScript
      之後的第四個 Web 語言
    </div>
  </Frame>
);

// ─── 04 How it works ────────────────────────────────────────────────────────
const FlowNode = ({
  step,
  title,
  items,
  highlight,
}: {
  step: string;
  title: string;
  items: string[];
  highlight?: boolean;
}) => (
  <div
    style={{
      width: 344,
      height: 320,
      boxSizing: 'border-box',
      padding: 32,
      background: highlight ? 'rgba(101,79,240,0.18)' : surface,
      border: `1px solid ${highlight ? 'var(--osd-accent)' : line}`,
      borderRadius: 'var(--osd-radius)',
    }}
  >
    <div style={{ fontFamily: mono, fontSize: 22, color: accentSoft, letterSpacing: '0.14em' }}>{step}</div>
    <div style={{ fontFamily: mono, fontSize: 40, fontWeight: 700, lineHeight: 1.2, marginTop: 14 }}>{title}</div>
    <div style={{ fontFamily: mono, fontSize: 26, color: muted, lineHeight: 1.7, marginTop: 20 }}>
      {items[0]}
      <br />
      {items[1]}
      <br />
      {items[2]}
    </div>
  </div>
);

const FlowArrow = () => (
  <div
    style={{
      width: 88,
      height: 320,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: mono,
      fontSize: 44,
      color: accentSoft,
    }}
  >
    →
  </div>
);

const RuntimeNote = ({ label, text }: { label: string; text: string }) => (
  <div style={{ borderLeft: '4px solid var(--osd-accent)', paddingLeft: 28 }}>
    <div style={{ fontFamily: mono, fontSize: 22, color: accentSoft, letterSpacing: '0.14em' }}>{label}</div>
    <div style={{ fontSize: 32, lineHeight: 1.5, marginTop: 10 }}>{text}</div>
  </div>
);

const HowItWorks: Page = () => (
  <Frame chapter="01 · 是什麼">
    <Header eyebrow="01 · 怎麼運作" title="寫一次，編譯成 .wasm，到處執行" />
    <div style={{ display: 'flex', marginTop: 72 }}>
      <Steps>
        <FlowNode step="STEP 1" title="原始碼" items={['Rust', 'C / C++', 'Go · C# · …']} />
        <Step>
          <div style={{ display: 'flex' }}>
            <FlowArrow />
            <FlowNode step="STEP 2" title="編譯器" items={['rustc · LLVM', 'Emscripten', 'TinyGo']} />
          </div>
        </Step>
        <Step>
          <div style={{ display: 'flex' }}>
            <FlowArrow />
            <FlowNode
              step="STEP 3"
              title=".wasm"
              items={['二進位位元組碼', '型別化 import', '型別化 export']}
              highlight
            />
          </div>
        </Step>
        <Step>
          <div style={{ display: 'flex' }}>
            <FlowArrow />
            <FlowNode step="STEP 4" title="執行環境" items={['瀏覽器', 'Node.js · Deno', 'Wasmtime · WAMR']} />
          </div>
        </Step>
      </Steps>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginTop: 56 }}>
      <RuntimeNote label="IN THE BROWSER" text="與 JS 互相呼叫，Web API 經由 JS 存取" />
      <RuntimeNote label="OUTSIDE THE BROWSER" text="透過 WASI 存取檔案、網路、時鐘等系統介面" />
    </div>
  </Frame>
);

// ─── 05 Wasm × JS ───────────────────────────────────────────────────────────
const RoleItem = ({ children, color }: { children: ReactNode; color: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 34, lineHeight: 1.6 }}>
    <span style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
    {children}
  </div>
);

const RoleCard = ({
  tag,
  name,
  color,
  highlight,
  children,
}: {
  tag: string;
  name: string;
  color: string;
  highlight?: boolean;
  children: ReactNode;
}) => (
  <div
    style={{
      padding: 48,
      background: highlight ? 'rgba(101,79,240,0.14)' : surface,
      border: `1px solid ${highlight ? 'var(--osd-accent)' : line}`,
      borderRadius: 'var(--osd-radius)',
    }}
  >
    <div style={{ fontFamily: mono, fontSize: 24, color, letterSpacing: '0.14em' }}>{tag}</div>
    <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.2, marginTop: 12, marginBottom: 28 }}>{name}</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
  </div>
);

const WithJs: Page = () => (
  <Frame chapter="01 · 是什麼">
    <Header eyebrow="01 · 與 JavaScript 的關係" title="不是取代 JS，而是分工" />
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 120px 1fr',
        alignItems: 'center',
        marginTop: 64,
      }}
    >
      <RoleCard tag="JAVASCRIPT" name="膠水與介面" color={muted}>
        <RoleItem color={muted}>DOM 操作與 UI 互動</RoleItem>
        <RoleItem color={muted}>事件、網路請求、Web API</RoleItem>
        <RoleItem color={muted}>串接各模組的流程控制</RoleItem>
      </RoleCard>
      <div style={{ textAlign: 'center', fontFamily: mono }}>
        <div style={{ fontSize: 56, color: accentSoft, lineHeight: 1 }}>⇄</div>
        <div style={{ fontSize: 20, color: muted, marginTop: 16, lineHeight: 1.5 }}>
          import
          <br />
          export
        </div>
      </div>
      <RoleCard tag="WEBASSEMBLY" name="運算核心" color={accentSoft} highlight>
        <RoleItem color="var(--osd-accent)">影像、音訊、影片編解碼</RoleItem>
        <RoleItem color="var(--osd-accent)">物理模擬、加解密、壓縮</RoleItem>
        <RoleItem color="var(--osd-accent)">重用既有的原生程式庫</RoleItem>
      </RoleCard>
    </div>
    <div style={{ fontSize: 32, lineHeight: 1.6, color: muted, marginTop: 48 }}>
      <span style={{ color: 'var(--osd-text)' }}>跨界呼叫有成本：</span>
      資料透過線性記憶體交換，來回次數越少越好
    </div>
  </Frame>
);

// ─── 06 Use cases ───────────────────────────────────────────────────────────
const UseCard = ({ num, title, desc, examples }: { num: string; title: string; desc: string; examples: string }) => (
  <div
    style={{
      height: 250,
      boxSizing: 'border-box',
      padding: '36px 40px',
      background: surface,
      border: `1px solid ${line}`,
      borderRadius: 'var(--osd-radius)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
      <span style={{ fontFamily: mono, fontSize: 28, fontWeight: 700, color: 'var(--osd-accent)' }}>{num}</span>
      <span style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.2 }}>{title}</span>
    </div>
    <div style={{ fontSize: 30, color: muted, lineHeight: 1.5, marginTop: 16 }}>{desc}</div>
    <div style={{ fontFamily: mono, fontSize: 24, color: accentSoft, lineHeight: 1.5, marginTop: 20 }}>
      <span style={{ color: muted }}>例｜</span>
      {examples}
    </div>
  </div>
);

const UseCases: Page = () => (
  <Frame chapter="02 · 適用情境">
    <Header eyebrow="02 · 什麼情境適合" title="四種最常見的使用場景" />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 64 }}>
      <Steps>
        <Step>
          <UseCard
            num="01"
            title="瀏覽器內的重運算"
            desc="影像、影音、3D 等桌面級應用搬進瀏覽器"
            examples="Figma · Photoshop Web · Google Earth"
          />
        </Step>
        <Step>
          <UseCard
            num="02"
            title="移植既有 C/C++ 程式庫"
            desc="不重寫，直接把成熟的原生程式碼帶上 Web"
            examples="SQLite · FFmpeg · AutoCAD Web"
          />
        </Step>
        <Step>
          <UseCard
            num="03"
            title="邊緣運算與 Serverless"
            desc="啟動極快、隔離成本低，比容器更輕量"
            examples="Cloudflare Workers · Fastly Compute · Spin"
          />
        </Step>
        <Step>
          <UseCard
            num="04"
            title="外掛與沙箱擴充"
            desc="讓第三方程式碼安全地跑在你的系統裡"
            examples="Envoy · Shopify Functions · Zed 擴充"
          />
        </Step>
      </Steps>
    </div>
  </Frame>
);

// ─── 07 Decision rule ───────────────────────────────────────────────────────
const VerdictItem = ({ children }: { children: ReactNode }) => (
  <div style={{ fontSize: 34, lineHeight: 1.6, padding: '18px 0', borderTop: `1px solid ${line}` }}>{children}</div>
);

const VerdictColumn = ({ good, children }: { good?: boolean; children: ReactNode }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
      <span
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: mono,
          fontSize: 32,
          fontWeight: 800,
          background: good ? 'var(--osd-accent)' : 'transparent',
          border: good ? 'none' : `2px solid ${muted}`,
          boxSizing: 'border-box',
          color: good ? '#ffffff' : muted,
        }}
      >
        {good ? '✓' : '✕'}
      </span>
      <span style={{ fontSize: 40, fontWeight: 700, color: good ? 'var(--osd-text)' : muted }}>
        {good ? '適合' : '不太適合'}
      </span>
    </div>
    <div style={{ color: good ? 'var(--osd-text)' : muted }}>{children}</div>
  </div>
);

const DecisionRule: Page = () => (
  <Frame chapter="02 · 適用情境">
    <Header
      eyebrow="02 · 判斷準則"
      title={
        <>
          瓶頸在 <span style={{ color: accentSoft }}>CPU</span>，才值得考慮 Wasm
        </>
      }
    />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, marginTop: 64 }}>
      <Steps>
        <VerdictColumn good>
          <VerdictItem>大量數值運算、緊密迴圈</VerdictItem>
          <VerdictItem>重用既有的原生程式庫</VerdictItem>
          <VerdictItem>隔離不受信任的程式碼</VerdictItem>
          <VerdictItem>多平台共用同一份核心邏輯</VerdictItem>
        </VerdictColumn>
        <Step>
          <VerdictColumn>
            <VerdictItem>一般表單、CRUD 型網頁</VerdictItem>
            <VerdictItem>頻繁操作 DOM 的互動</VerdictItem>
            <VerdictItem>少量運算：跨界成本吃掉紅利</VerdictItem>
            <VerdictItem>首次載入體積極度敏感</VerdictItem>
          </VerdictColumn>
        </Step>
      </Steps>
    </div>
  </Frame>
);

// ─── 08 Hidden costs (supplement to the decision rule) ──────────────────────
const copyColor = 'rgba(142,137,173,0.55)';
const callColor = '#4a4478';

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <span style={{ width: 22, height: 22, borderRadius: 4, background: color }} />
    {label}
  </span>
);

const BarSeg = ({ grow, color, label }: { grow: number; color: string; label?: string }) => (
  <div
    style={{
      flexGrow: grow,
      flexBasis: 0,
      background: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: mono,
      fontSize: 22,
      color: '#ffffff',
      letterSpacing: '0.06em',
    }}
  >
    {label}
  </div>
);

const CostBar = ({
  title,
  verdict,
  good,
  children,
}: {
  title: string;
  verdict: string;
  good?: boolean;
  children: ReactNode;
}) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.5 }}>{title}</span>
      <span style={{ fontSize: 26, color: good ? accentSoft : muted }}>{verdict}</span>
    </div>
    <div
      style={{
        display: 'flex',
        gap: 3,
        height: 44,
        marginTop: 10,
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  </div>
);

const CostCard = ({ title, cost, fix }: { title: string; cost: string; fix: string }) => (
  <div
    style={{
      padding: 28,
      background: surface,
      border: `1px solid ${line}`,
      borderRadius: 'var(--osd-radius)',
    }}
  >
    <div style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.3 }}>{title}</div>
    <div style={{ fontSize: 26, color: muted, lineHeight: 1.55, marginTop: 10 }}>{cost}</div>
    <div
      style={{
        fontSize: 26,
        lineHeight: 1.55,
        marginTop: 14,
        paddingTop: 14,
        borderTop: `1px solid ${line}`,
      }}
    >
      <span style={{ fontFamily: mono, color: accentSoft }}>對策｜</span>
      {fix}
    </div>
  </div>
);

const HiddenCosts: Page = () => (
  <Frame chapter="02 · 適用情境">
    <Header eyebrow="02 · 補充：隱藏成本" title="划不划算，看計算與搬運的比例" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 48 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 24,
          color: muted,
        }}
      >
        <span style={{ display: 'flex', gap: 40 }}>
          <LegendItem color={copyColor} label="搬運：資料複製進出" />
          <LegendItem color={callColor} label="跨界呼叫" />
          <LegendItem color="var(--osd-accent)" label="實際計算" />
        </span>
        <span style={{ fontFamily: mono, fontSize: 22 }}>比例為示意，非實測</span>
      </div>
      <Steps>
        <CostBar title="影像調亮度：每個像素做一次加法" verdict="✕ 搬運佔大半，直接用 JS 可能更快">
          <BarSeg grow={40} color={copyColor} label="搬入" />
          <BarSeg grow={6} color={callColor} />
          <BarSeg grow={14} color="var(--osd-accent)" label="計算" />
          <BarSeg grow={40} color={copyColor} label="搬出" />
        </CostBar>
        <Step>
          <CostBar title="影片編碼、物理模擬：資料常駐、反覆運算" verdict="✓ 計算主導，Wasm 優勢明顯" good>
            <BarSeg grow={5} color={copyColor} />
            <BarSeg grow={2} color={callColor} />
            <BarSeg grow={88} color="var(--osd-accent)" label="計算" />
            <BarSeg grow={5} color={copyColor} />
          </CostBar>
        </Step>
        <Step>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginTop: 20 }}>
            <CostCard
              title="記憶體複製"
              cost="Wasm 只看得到自己的線性記憶體，資料進出都要複製一份"
              fix="讓資料常駐在 Wasm 記憶體，JS 直接寫入 memory.buffer"
            />
            <CostCard
              title="字串與物件轉換"
              cost="UTF-16 字串要轉成 UTF-8 再複製，物件還得序列化"
              fix="傳數字與 TypedArray，避免在邊界來回傳字串、JSON"
            />
            <CostCard
              title="細碎的跨界呼叫"
              cost="單次呼叫很便宜，但百萬次逐筆呼叫會累積成瓶頸"
              fix="批次處理：一次傳一整批，在 Wasm 內跑完迴圈"
            />
          </div>
        </Step>
      </Steps>
    </div>
  </Frame>
);

// ─── 09 Language comparison ─────────────────────────────────────────────────
const TABLE_COLS = '320px 420px 360px 1fr';

const SizeBar = ({ large, label }: { large?: boolean; label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <span
      style={{
        width: large ? 200 : 48,
        height: 14,
        borderRadius: 7,
        background: large ? muted : mint,
        opacity: large ? 0.7 : 1,
      }}
    />
    <span style={{ fontFamily: mono, fontSize: 28, color: large ? muted : mint }}>{label}</span>
  </div>
);

const LangRow = ({
  lang,
  memory,
  large,
  fit,
  highlight,
}: {
  lang: string;
  memory: string;
  large?: boolean;
  fit: string;
  highlight?: boolean;
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: TABLE_COLS,
      alignItems: 'center',
      padding: '18px 28px',
      borderTop: `1px solid ${line}`,
      background: highlight ? 'rgba(255,122,61,0.09)' : 'transparent',
      boxShadow: highlight ? `inset 4px 0 0 ${rust}` : undefined,
    }}
  >
    <span style={{ fontFamily: mono, fontSize: 34, fontWeight: 700, color: highlight ? rust : 'var(--osd-text)' }}>
      {lang}
    </span>
    <span style={{ fontSize: 30, lineHeight: 1.6 }}>{memory}</span>
    <SizeBar large={large} label={large ? 'MB 級' : 'KB 級'} />
    <span style={{ fontSize: 30, lineHeight: 1.6, color: highlight ? 'var(--osd-text)' : muted }}>{fit}</span>
  </div>
);

const LangHead = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: TABLE_COLS,
      padding: '0 28px 16px',
      fontFamily: mono,
      fontSize: 22,
      color: muted,
      letterSpacing: '0.14em',
    }}
  >
    <span>語言</span>
    <span>記憶體 / RUNTIME</span>
    <span>輸出體積</span>
    <span>最適合</span>
  </div>
);

const Languages: Page = () => (
  <Frame chapter="03 · 各語言差異">
    <Header eyebrow="03 · 各語言差異" title="同樣編譯成 Wasm，代價大不同" />
    <div style={{ marginTop: 56, borderBottom: `1px solid ${line}` }}>
      <LangHead />
      <LangRow lang="Rust" memory="所有權系統，無 GC" fit="新專案、效能關鍵模組" highlight />
      <LangRow lang="C / C++" memory="手動管理，無 GC" fit="移植既有原生程式庫" />
      <LangRow lang="Go" memory="自帶 GC + runtime" large fit="Go 團隊；TinyGo 可大幅瘦身" />
      <LangRow lang="Java" memory="GC（可用 WasmGC）" large fit="Java 團隊；TeaVM、J2Wasm" />
      <LangRow lang="AssemblyScript" memory="輕量 GC · 類 TS 語法" fit="前端工程師快速上手" />
    </div>
    <div style={{ fontFamily: mono, fontSize: 24, color: muted, marginTop: 32, lineHeight: 1.6 }}>
      * WasmGC 已在主流瀏覽器上線，Java、Kotlin、Dart 等 GC 語言可直接用引擎內建的 GC
    </div>
  </Frame>
);

// ─── 10 Why Rust ────────────────────────────────────────────────────────────
const ReasonRow = ({ num, title, desc }: { num: string; title: string; desc: string }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '140px 1fr',
      alignItems: 'baseline',
      padding: '20px 0',
      borderTop: `1px solid ${line}`,
    }}
  >
    <span style={{ fontFamily: mono, fontSize: 52, fontWeight: 800, lineHeight: 1, color: rust }}>{num}</span>
    <div>
      <div style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.2 }}>{title}</div>
      <div style={{ fontSize: 30, color: muted, lineHeight: 1.5, marginTop: 10 }}>{desc}</div>
    </div>
  </div>
);

const WhyRust: Page = () => (
  <Frame chapter="03 · 為何推薦 Rust">
    <Header
      eyebrow="03 · 為何推薦 Rust"
      title={
        <>
          <span style={{ color: rust }}>Rust</span>：Wasm 生態的一等公民
        </>
      }
    />
    <div style={{ marginTop: 40 }}>
      <Steps>
        <Step>
          <ReasonRow num="01" title="沒有 GC，也沒有肥大的 runtime" desc="產出體積小，效能穩定可預期" />
        </Step>
        <Step>
          <ReasonRow num="02" title="編譯期保證記憶體安全" desc="不必在 C/C++ 的效能與指標錯誤之間做取捨" />
        </Step>
        <Step>
          <ReasonRow
            num="03"
            title="工具鏈開箱即用"
            desc="官方 wasm32 target，wasm-bindgen 自動產生 JS / TS 綁定"
          />
        </Step>
        <Step>
          <ReasonRow
            num="04"
            title="生態系的核心語言"
            desc="Wasmtime、Wasmer、Spin 等 runtime 本身就是用 Rust 寫的"
          />
        </Step>
      </Steps>
    </div>
  </Frame>
);

// ─── 11 Code ────────────────────────────────────────────────────────────────
const K = ({ children }: { children: ReactNode }) => <span style={{ color: accentSoft }}>{children}</span>;
const A = ({ children }: { children: ReactNode }) => <span style={{ color: rust }}>{children}</span>;
const N = ({ children }: { children: ReactNode }) => <span style={{ color: mint }}>{children}</span>;
const Cm = ({ children }: { children: ReactNode }) => <span style={{ color: muted }}>{children}</span>;

const CodeCard = ({ file, tag, children }: { file: string; tag: string; children: ReactNode }) => (
  <div
    style={{
      background: surface,
      border: `1px solid ${line}`,
      borderRadius: 'var(--osd-radius)',
    }}
  >
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '14px 36px',
        borderBottom: `1px solid ${line}`,
        fontFamily: mono,
        fontSize: 22,
        color: muted,
        letterSpacing: '0.06em',
      }}
    >
      <span>{file}</span>
      <span style={{ color: accentSoft }}>{tag}</span>
    </div>
    <div
      style={{
        padding: '28px 36px',
        fontFamily: mono,
        fontSize: 30,
        lineHeight: 1.5,
        whiteSpace: 'pre',
      }}
    >
      {children}
    </div>
  </div>
);

const CodeDemo: Page = () => (
  <Frame chapter="03 · 為何推薦 Rust">
    <Header eyebrow="03 · 實際長這樣" title="幾行 Rust，瀏覽器直接呼叫" />
    <div style={{ display: 'grid', gridTemplateColumns: '700px 1fr', gap: 48, marginTop: 56 }}>
      <CodeCard file="src/lib.rs" tag="RUST">
        <div>
          <K>use</K>
          {' wasm_bindgen::prelude::*;'}
        </div>
        <div> </div>
        <div>
          <A>#[wasm_bindgen]</A>
        </div>
        <div>
          <K>pub fn</K>
          {' fib(n: '}
          <K>u32</K>
          {') -> '}
          <K>u64</K>
          {' {'}
        </div>
        <div>
          {'    '}
          <K>let</K>
          {' ('}
          <K>mut</K>
          {' a, '}
          <K>mut</K>
          {' b) = ('}
          <N>0</N>
          {', '}
          <N>1</N>
          {');'}
        </div>
        <div>
          {'    '}
          <K>for</K>
          {' _ '}
          <K>in</K>
          {' '}
          <N>0</N>
          {'..n {'}
        </div>
        <div>{'        (a, b) = (b, a + b);'}</div>
        <div>{'    }'}</div>
        <div>{'    a'}</div>
        <div>{'}'}</div>
      </CodeCard>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <CodeCard file="terminal" tag="BUILD">
          <div>
            <Cm>$</Cm>
            {' wasm-pack build --target web'}
          </div>
        </CodeCard>
        <CodeCard file="main.js" tag="JS">
          <div>
            <K>import</K>
            {' init, { fib } '}
            <K>from</K>
            {' '}
            <N>'./pkg/fib.js'</N>
            {';'}
          </div>
          <div> </div>
          <div>
            <K>await</K>
            {' init();'}
          </div>
          <div>
            {'console.log(fib('}
            <N>50</N>
            {')); '}
            <Cm>{'// 12586269025n'}</Cm>
          </div>
        </CodeCard>
        <div style={{ fontFamily: mono, fontSize: 24, color: muted, lineHeight: 1.6, marginTop: 4 }}>
          產出 <span style={{ color: accentSoft }}>fib_bg.wasm</span> + JS 膠水 +{' '}
          <span style={{ color: accentSoft }}>fib.d.ts</span> 型別定義
        </div>
      </div>
    </div>
  </Frame>
);

// ─── 12 Closing ─────────────────────────────────────────────────────────────
const Takeaway = ({ num, children }: { num: string; children: ReactNode }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '120px 1fr',
      alignItems: 'baseline',
      padding: '20px 0',
      borderTop: `1px solid ${line}`,
    }}
  >
    <span style={{ fontFamily: mono, fontSize: 40, fontWeight: 800, color: 'var(--osd-accent)' }}>{num}</span>
    <span style={{ fontSize: 44, fontWeight: 600, lineHeight: 1.4 }}>{children}</span>
  </div>
);

const Closing: Page = () => (
  <Frame chapter="TAKEAWAYS">
    <Header eyebrow="TAKEAWAYS" title="三個重點帶回家" />
    <div style={{ marginTop: 56, borderBottom: `1px solid ${line}` }}>
      <Takeaway num="01">
        Wasm 是可攜、安全、接近原生速度的<span style={{ color: accentSoft }}>編譯目標</span>
      </Takeaway>
      <Takeaway num="02">
        瓶頸在 <span style={{ color: accentSoft }}>CPU</span>、要重用原生程式碼、或需要沙箱時才用它
      </Takeaway>
      <Takeaway num="03">
        新專案要寫 Wasm，<span style={{ color: rust }}>Rust</span> 是目前最成熟的選擇
      </Takeaway>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 72 }}>
      <div style={{ fontFamily: mono, fontSize: 96, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
        Q &amp; A
      </div>
      <div style={{ fontFamily: mono, fontSize: 26, color: muted, lineHeight: 1.7, textAlign: 'right' }}>
        webassembly.org
        <br />
        developer.mozilla.org/docs/WebAssembly
      </div>
    </div>
  </Frame>
);

export const notes: (string | undefined)[] = [
  `（約 30 秒）
大家好，今天用 10 分鐘介紹 WebAssembly，簡稱 Wasm。
上面這串 00 61 73 6d 是每個 .wasm 檔案開頭的 magic number，翻成 ASCII 就是「\\0asm」。
一句話定位：讓任何語言，以接近原生的速度，安全地跑在任何地方。`,
  `（約 30 秒）
今天分三段：先講它是什麼，再講什麼情境適合用，最後比較各語言編譯成 Wasm 的差異，以及為什麼我推薦 Rust。`,
  `（約 1 分鐘）
最容易誤會的一點：Wasm 不是一門要你去學的新語言，而是一個編譯目標，像一台規格公開的虛擬 CPU。
四個特性：快——靜態型別、預先編譯；安全——跑在沙箱裡，預設什麼權限都沒有；可攜——同一份 .wasm 到處跑；語言中立——很多語言都能編譯過來。
補充：2019 年它成為 W3C 正式標準，是 HTML、CSS、JS 之後第四個 Web 語言。`,
  `（約 1 分鐘，按 → 逐步顯示流程）
流程很單純：用你熟悉的語言寫程式 → 編譯器輸出 .wasm → 交給執行環境。
.wasm 裡是二進位位元組碼，加上型別明確的 import 和 export，這就是它跟外界溝通的唯一管道。
執行環境不只瀏覽器：Node、Deno，以及 Wasmtime 這類獨立 runtime。
瀏覽器外靠 WASI 這套標準介面拿到檔案、網路、時鐘等能力。`,
  `（約 1 分鐘）
常有人問：Wasm 會取代 JavaScript 嗎？不會，它們是分工。
JS 負責 DOM、事件、API 這些「膠水」；Wasm 負責吃 CPU 的運算核心。
要注意：JS 和 Wasm 之間來回呼叫有成本，傳大量資料要透過線性記憶體。設計時盡量「一次丟進去、算完再拿出來」。`,
  `（約 1 分 30 秒，按 → 逐張顯示）
四種最常見的場景：
一、瀏覽器內的重運算，例如 Figma、Photoshop Web、Google Earth。
二、移植既有 C/C++ 程式庫，例如 SQLite、FFmpeg、AutoCAD，不必重寫。
三、邊緣運算和 Serverless，啟動快、隔離便宜，比容器更輕。
四、外掛系統，讓第三方程式碼安全地跑在你的產品裡，例如 Envoy、Shopify Functions、Zed 編輯器的擴充。`,
  `（約 1 分鐘，按 → 顯示右欄）
判斷準則一句話：瓶頸在 CPU，才值得考慮 Wasm。
適合：大量運算、重用原生程式庫、隔離不受信任的程式碼、多平台共用核心邏輯。
（→）不太適合：一般 CRUD 網頁、頻繁操作 DOM、少量運算——跨界成本反而吃掉效能紅利，還有對首次載入體積極度敏感的情境。`,
  `（約 1 分 15 秒，按 → 依序顯示第二條長條、成本卡片）
上一頁說「瓶頸在 CPU」，這頁講更細的原因：Wasm 划不划算，取決於「計算」跟「搬運」的比例。
Wasm 只看得到自己的線性記憶體，JS 的資料要先複製進去，算完再複製出來。
像調亮度這種每個像素只做一次加法的工作，複製的時間可能跟計算差不多，甚至更久，直接用 JS 可能還更快。
（→）反過來，影片編碼、物理模擬這種資料留在 Wasm 裡反覆運算的工作，搬運只佔一點點，優勢就很明顯。
（→）三個常見的隱藏成本：
一、記憶體複製——對策是讓資料常駐在 Wasm 記憶體，JS 透過 memory.buffer 直接寫進去。
二、字串和物件轉換——JS 字串是 UTF-16，要轉成 UTF-8 再複製，物件還要序列化；盡量只傳數字和 TypedArray。
三、細碎的跨界呼叫——單次很便宜，但逐筆呼叫一百萬次就會變成瓶頸；改成一次傳一整批，在 Wasm 裡跑完迴圈。`,
  `（約 1 分 15 秒）
同樣是編譯成 Wasm，不同語言的代價差很多，關鍵在記憶體管理和 runtime。
Rust、C/C++ 沒有 GC，輸出通常是 KB 級；Go 要把 GC 和 runtime 一起打包，Java 則要帶上不少標準函式庫，常常是 MB 級。
TinyGo 可以讓 Go 瘦身；AssemblyScript 語法像 TypeScript，前端上手快。
Java 可以用 TeaVM 或 Google 的 J2Wasm 編譯。搭配已在主流瀏覽器上線的 WasmGC，GC 直接交給瀏覽器引擎，不必自己打包，Java、Kotlin、Dart 這些語言的體積正在快速改善。`,
  `（約 1 分鐘，按 → 逐條顯示）
為什麼推薦 Rust？四個理由：
一、沒有 GC、沒有大 runtime，體積小、效能穩定。
二、記憶體安全在編譯期就保證，不用在 C/C++ 的效能和指標錯誤之間取捨。
三、工具鏈開箱即用：官方 wasm32 target，wasm-bindgen 自動產生 JS 和 TypeScript 綁定。
四、Wasm 生態的核心專案，像 Wasmtime、Wasmer、Spin，本身就是用 Rust 寫的。`,
  `（約 1 分鐘）
實際看一下有多簡單：左邊是一個 Rust 的 fib 函式，只多了一行 #[wasm_bindgen] 標註。
跑一次 wasm-pack build，就產出 .wasm、JS 膠水和 .d.ts 型別定義。
前端只要 import、await init()，就能像呼叫一般 JS 函式一樣呼叫它。注意 u64 會對應到 JS 的 BigInt，所以結果後面有個 n。`,
  `（約 15 秒 + Q&A）
最後三個重點：Wasm 是編譯目標；瓶頸在 CPU 才用；新專案用 Rust 寫最成熟。
延伸閱讀可以看 webassembly.org 和 MDN。謝謝大家，開放提問。`,
];

export const meta: SlideMeta = {
  title: 'WebAssembly 入門',
  createdAt: '2026-10-20T15:58:29.223Z',
};

export default [
  Cover,
  Agenda,
  WhatIs,
  HowItWorks,
  WithJs,
  UseCases,
  DecisionRule,
  HiddenCosts,
  Languages,
  WhyRust,
  CodeDemo,
  Closing,
] satisfies Page[];
