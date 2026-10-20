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
const FONT_LINK_ID = 'osd-webfont-deckgl-intro';
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
// accent / accentSoft = deck.gl, mint = Leaflet, rust = arcs & trips highlights
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
        DECK.GL 入門
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

// Stylised "deck of layers": basemap → aggregation → points & arcs.
const LayerStack = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 520 520" style={{ display: 'block', overflow: 'visible' }}>
    <defs>
      <linearGradient id="dgl-cover-arc" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={rust} />
        <stop offset="100%" stopColor={accentSoft} />
      </linearGradient>
    </defs>
    <line x1="40" y1="160" x2="40" y2="380" stroke={line} strokeWidth="2" strokeDasharray="6 8" />
    <line x1="480" y1="160" x2="480" y2="380" stroke={line} strokeWidth="2" strokeDasharray="6 8" />
    <line x1="260" y1="270" x2="260" y2="490" stroke={line} strokeWidth="2" strokeDasharray="6 8" />
    {/* basemap */}
    <polygon points="260,270 480,380 260,490 40,380" fill="rgba(142,137,173,0.08)" stroke={muted} strokeWidth="2" />
    <line x1="150" y1="325" x2="370" y2="435" stroke={line} strokeWidth="2" />
    <line x1="370" y1="325" x2="150" y2="435" stroke={line} strokeWidth="2" />
    {/* aggregation */}
    <polygon
      points="260,160 480,270 260,380 40,270"
      fill="rgba(101,79,240,0.16)"
      stroke="var(--osd-accent)"
      strokeWidth="2"
    />
    <ellipse cx="220" cy="270" rx="86" ry="40" fill={accentSoft} opacity="0.28" />
    <ellipse cx="320" cy="282" rx="52" ry="24" fill={accentSoft} opacity="0.22" />
    {/* points & arcs */}
    <polygon points="260,50 480,160 260,270 40,160" fill="rgba(101,79,240,0.10)" stroke={accentSoft} strokeWidth="2" />
    <path d="M180 150 Q 240 30 320 115" fill="none" stroke="url(#dgl-cover-arc)" strokeWidth="4" />
    <path d="M200 180 Q 300 50 380 160" fill="none" stroke="url(#dgl-cover-arc)" strokeWidth="4" />
    <path d="M150 165 Q 190 80 270 90" fill="none" stroke="url(#dgl-cover-arc)" strokeWidth="4" />
    <circle cx="180" cy="150" r="7" fill={mint} />
    <circle cx="230" cy="120" r="6" fill={mint} />
    <circle cx="300" cy="140" r="6" fill={mint} />
    <circle cx="340" cy="175" r="7" fill={mint} />
    <circle cx="260" cy="195" r="6" fill={mint} />
    <circle cx="200" cy="180" r="7" fill={mint} />
    <circle cx="320" cy="115" r="7" fill={mint} />
    <circle cx="150" cy="165" r="7" fill={mint} />
    <circle cx="380" cy="160" r="7" fill={mint} />
    <circle cx="270" cy="90" r="7" fill={mint} />
  </svg>
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
    <div style={{ fontFamily: mono, fontSize: 28, color: muted, letterSpacing: '0.06em' }}>
      <span style={{ color: accentSoft }}>new</span> Deck({'{ '}
      <span style={{ color: accentSoft }}>layers</span>
      {' })'}
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
      deck.gl
    </h1>
    <p style={{ fontSize: 44, lineHeight: 1.5, color: muted, margin: 0, maxWidth: 1000 }}>
      用 <span style={{ color: 'var(--osd-text)' }}>GPU</span>，把百萬筆資料變成
      <br />
      可互動的地圖
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
      <span style={{ color: mint }}>vs Leaflet</span>
    </div>
    <div style={{ position: 'absolute', right: 160, top: '50%', marginTop: -260 }}>
      <LayerStack size={520} />
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
      <AgendaRow num="01" title="deck.gl 是什麼？" sub="GPU 驅動的資料視覺化框架，以及它的 Layer 模型" />
      <AgendaRow num="02" title="與 Leaflet 比較" sub="設計哲學、渲染方式、資料量級的根本差異" />
      <AgendaRow num="03" title="什麼時候該用？" sub="適用場景、選用時機，以及 Leaflet 就夠用的情況" last />
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
    <Header eyebrow="01 · 是什麼" title="GPU 驅動的大規模資料視覺化框架" />
    <p style={{ fontSize: 40, lineHeight: 1.6, color: muted, margin: '40px 0 0' }}>
      不是地圖函式庫，而是把資料
      <span style={{ color: 'var(--osd-text)' }}>「一層一層疊上去」</span>的渲染引擎。
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, marginTop: 56 }}>
      <PropCard tag="GPU" title="GPU 渲染" desc="WebGL2 / WebGPU，百萬筆資料仍流暢互動" />
      <PropCard tag="LAYERS" title="圖層組合" desc="每種視覺化是一個 Layer，像疊圖一樣組合" />
      <PropCard tag="DECLARATIVE" title="宣告式 API" desc="給資料與取值函式，更新與重繪交給框架" />
      <PropCard tag="INTEROP" title="底圖中立" desc="可疊在 MapLibre、Mapbox、Google Maps、ArcGIS 上" />
    </div>
    <div style={{ fontFamily: mono, fontSize: 24, color: muted, marginTop: 48, letterSpacing: '0.02em' }}>
      <span style={{ color: accentSoft }}>2016</span> 由 Uber 開源，現由 OpenJS 基金會的 vis.gl 維護 ——
      kepler.gl、CARTO 皆以它為核心
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

const NoteItem = ({ label, text }: { label: string; text: string }) => (
  <div style={{ borderLeft: '4px solid var(--osd-accent)', paddingLeft: 28 }}>
    <div style={{ fontFamily: mono, fontSize: 22, color: accentSoft, letterSpacing: '0.14em' }}>{label}</div>
    <div style={{ fontSize: 32, lineHeight: 1.5, marginTop: 10 }}>{text}</div>
  </div>
);

const HowItWorks: Page = () => (
  <Frame chapter="01 · 是什麼">
    <Header eyebrow="01 · 怎麼運作" title="資料 → Layer → GPU，一次畫完" />
    <div style={{ display: 'flex', marginTop: 72 }}>
      <Steps>
        <FlowNode step="STEP 1" title="資料" items={['JSON · CSV', 'Arrow · 二進位', 'MVT 向量圖磚']} />
        <Step>
          <div style={{ display: 'flex' }}>
            <FlowArrow />
            <FlowNode step="STEP 2" title="Accessor" items={['getPosition', 'getFillColor', 'getRadius']} />
          </div>
        </Step>
        <Step>
          <div style={{ display: 'flex' }}>
            <FlowArrow />
            <FlowNode
              step="STEP 3"
              title="Layer"
              items={['Scatterplot', 'Arc · Hexagon', 'Trips · 3D Tiles']}
              highlight
            />
          </div>
        </Step>
        <Step>
          <div style={{ display: 'flex' }}>
            <FlowArrow />
            <FlowNode step="STEP 4" title="GPU" items={['屬性存成 buffer', 'shader 平行繪製', '畫面即時更新']} />
          </div>
        </Step>
      </Steps>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginTop: 56 }}>
      <NoteItem label="WHY FAST" text="資料只上傳一次，平移縮放只改相機矩陣" />
      <NoteItem label="GPU PICKING" text="百萬個點中滑鼠 hover，也能即時命中" />
    </div>
  </Frame>
);

// ─── 05 Layer catalog ───────────────────────────────────────────────────────
const GlyphDots = () => (
  <svg width="72" height="72" viewBox="0 0 72 72">
    <circle cx="14" cy="50" r="5" fill={mint} />
    <circle cx="28" cy="28" r="5" fill={mint} />
    <circle cx="42" cy="52" r="5" fill={mint} />
    <circle cx="56" cy="20" r="5" fill={mint} />
    <circle cx="58" cy="44" r="5" fill={mint} />
    <circle cx="24" cy="62" r="4" fill={mint} />
    <circle cx="40" cy="34" r="4" fill={mint} />
  </svg>
);

const GlyphArc = () => (
  <svg width="72" height="72" viewBox="0 0 72 72">
    <defs>
      <linearGradient id="dgl-glyph-arc" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={rust} />
        <stop offset="100%" stopColor={accentSoft} />
      </linearGradient>
    </defs>
    <path d="M10 60 Q 36 -4 62 60" fill="none" stroke="url(#dgl-glyph-arc)" strokeWidth="4" />
    <circle cx="10" cy="60" r="5" fill={rust} />
    <circle cx="62" cy="60" r="5" fill={accentSoft} />
  </svg>
);

const GlyphHex = () => (
  <svg width="72" height="72" viewBox="0 0 72 72">
    <polygon points="36,8 60,22 60,50 36,64 12,50 12,22" fill="rgba(101,79,240,0.35)" stroke={accentSoft} strokeWidth="3" />
    <polygon points="36,22 48,29 48,43 36,50 24,43 24,29" fill={accentSoft} />
  </svg>
);

const GlyphHeat = () => (
  <svg width="72" height="72" viewBox="0 0 72 72">
    <defs>
      <radialGradient id="dgl-glyph-heat">
        <stop offset="0%" stopColor={rust} />
        <stop offset="45%" stopColor="#654ff0" />
        <stop offset="100%" stopColor="#654ff0" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="30" cy="38" r="30" fill="url(#dgl-glyph-heat)" />
    <circle cx="52" cy="26" r="18" fill="url(#dgl-glyph-heat)" />
  </svg>
);

const GlyphTrips = () => (
  <svg width="72" height="72" viewBox="0 0 72 72">
    <defs>
      <linearGradient id="dgl-glyph-trips" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor={rust} stopOpacity="0" />
        <stop offset="100%" stopColor={rust} />
      </linearGradient>
    </defs>
    <path
      d="M8 62 L26 40 L40 48 L62 14"
      fill="none"
      stroke="url(#dgl-glyph-trips)"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="62" cy="14" r="6" fill={rust} />
  </svg>
);

const GlyphCube = () => (
  <svg width="72" height="72" viewBox="0 0 72 72">
    <polygon points="36,8 62,22 36,36 10,22" fill={accentSoft} />
    <polygon points="10,22 36,36 36,66 10,52" fill="#654ff0" />
    <polygon points="36,36 62,22 62,52 36,66" fill="rgba(101,79,240,0.45)" />
  </svg>
);

const LayerCard = ({ icon, name, desc }: { icon: ReactNode; name: string; desc: string }) => (
  <div
    style={{
      height: 240,
      boxSizing: 'border-box',
      padding: '32px 36px',
      background: surface,
      border: `1px solid ${line}`,
      borderRadius: 'var(--osd-radius)',
    }}
  >
    {icon}
    <div style={{ fontFamily: mono, fontSize: 34, fontWeight: 700, lineHeight: 1.2, marginTop: 20 }}>{name}</div>
    <div style={{ fontSize: 28, color: muted, lineHeight: 1.5, marginTop: 10 }}>{desc}</div>
  </div>
);

const LayerCatalog: Page = () => (
  <Frame chapter="01 · 是什麼">
    <Header eyebrow="01 · 圖層家族" title="內建數十種 Layer，挑一個就能畫" />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32, marginTop: 56 }}>
      <LayerCard icon={<GlyphDots />} name="ScatterplotLayer" desc="大量點位：GPS、門市、感測器" />
      <LayerCard icon={<GlyphArc />} name="ArcLayer" desc="起訖流向：通勤、物流、航線" />
      <LayerCard icon={<GlyphHex />} name="HexagonLayer" desc="空間聚合，即時分箱成 3D 柱" />
      <LayerCard icon={<GlyphHeat />} name="HeatmapLayer" desc="密度熱區，縮放時即時重算" />
      <LayerCard icon={<GlyphTrips />} name="TripsLayer" desc="時間軸動畫：車流、船隻軌跡" />
      <LayerCard icon={<GlyphCube />} name="Tile3DLayer" desc="3D Tiles：城市模型、點雲" />
    </div>
  </Frame>
);

// ─── 06 Code ────────────────────────────────────────────────────────────────
const K = ({ children }: { children: ReactNode }) => <span style={{ color: accentSoft }}>{children}</span>;
const A = ({ children }: { children: ReactNode }) => <span style={{ color: rust }}>{children}</span>;
const N = ({ children }: { children: ReactNode }) => <span style={{ color: mint }}>{children}</span>;

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
        padding: '24px 36px',
        fontFamily: mono,
        fontSize: 26,
        lineHeight: 1.5,
        whiteSpace: 'pre',
      }}
    >
      {children}
    </div>
  </div>
);

const CodeDemo: Page = () => (
  <Frame chapter="01 · 是什麼">
    <Header eyebrow="01 · 實際長這樣" title="十幾行，畫出一百萬個點" />
    <div style={{ display: 'grid', gridTemplateColumns: '1000px 1fr', gap: 64, marginTop: 48 }}>
      <CodeCard file="main.js" tag="JS">
        <div>
          <K>new</K>
          {' Deck({'}
        </div>
        <div>{'  initialViewState: {'}</div>
        <div>
          {'    longitude: '}
          <N>121.5</N>
          {', latitude: '}
          <N>25.04</N>
          {', zoom: '}
          <N>11</N>
          {','}
        </div>
        <div>{'  },'}</div>
        <div>
          {'  controller: '}
          <K>true</K>
          {','}
        </div>
        <div>{'  layers: ['}</div>
        <div>
          {'    '}
          <K>new</K> <A>ScatterplotLayer</A>
          {'({'}
        </div>
        <div>
          {'      data: '}
          <N>'/gps-points.json'</N>
          {','}
        </div>
        <div>
          {'      getPosition: '}
          <K>d</K>
          {' => d.coord,'}
        </div>
        <div>
          {'      getFillColor: ['}
          <N>101</N>
          {', '}
          <N>79</N>
          {', '}
          <N>240</N>
          {'],'}
        </div>
        <div>
          {'      radiusMinPixels: '}
          <N>2</N>
          {','}
        </div>
        <div>{'    }),'}</div>
        <div>{'  ],'}</div>
        <div>{'});'}</div>
      </CodeCard>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 44, paddingTop: 12 }}>
        <NoteItem label="DATA" text="陣列、URL 或二進位資料都可以" />
        <NoteItem label="ACCESSOR" text="告訴它每筆資料的位置、顏色、大小" />
        <NoteItem label="REACTIVE" text="換一組新的 layers，只重繪有變的部分" />
      </div>
    </div>
  </Frame>
);

// ─── 07 Two philosophies ────────────────────────────────────────────────────
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

const Philosophy: Page = () => (
  <Frame chapter="02 · vs Leaflet">
    <Header eyebrow="02 · 與 Leaflet 比較" title="兩種截然不同的出發點" />
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 120px 1fr',
        alignItems: 'center',
        marginTop: 64,
      }}
    >
      <RoleCard tag="LEAFLET" name="輕量的「地圖」" color={mint}>
        <RoleItem color={mint}>DOM + SVG / Canvas 2D 繪製</RoleItem>
        <RoleItem color={mint}>圖磚底圖、Marker、Popup</RoleItem>
        <RoleItem color={mint}>約 42 KB，外掛生態豐富</RoleItem>
      </RoleCard>
      <div style={{ textAlign: 'center', fontFamily: mono, fontSize: 48, fontWeight: 800, color: muted }}>vs</div>
      <RoleCard tag="DECK.GL" name="GPU 的「資料」引擎" color={accentSoft} highlight>
        <RoleItem color="var(--osd-accent)">WebGL2 / WebGPU 繪製</RoleItem>
        <RoleItem color="var(--osd-accent)">資料圖層、3D、時間動畫</RoleItem>
        <RoleItem color="var(--osd-accent)">底圖交給 MapLibre 等</RoleItem>
      </RoleCard>
    </div>
    <div style={{ fontSize: 32, lineHeight: 1.6, color: muted, marginTop: 48 }}>
      <span style={{ color: mint }}>Leaflet</span> 從「地圖」出發，
      <span style={{ color: accentSoft }}>deck.gl</span> 從「資料」出發
    </div>
  </Frame>
);

// ─── 08 Comparison table ────────────────────────────────────────────────────
const CMP_COLS = '340px 1fr 1fr';

const CompareHead = () => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: CMP_COLS,
      padding: '0 28px 16px',
      fontFamily: mono,
      fontSize: 24,
      letterSpacing: '0.14em',
    }}
  >
    <span style={{ color: muted }}>面向</span>
    <span style={{ color: mint }}>LEAFLET</span>
    <span style={{ color: accentSoft }}>DECK.GL</span>
  </div>
);

const CompareRow = ({ label, leaflet, deck }: { label: string; leaflet: string; deck: string }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: CMP_COLS,
      alignItems: 'center',
      padding: '18px 28px',
      borderTop: `1px solid ${line}`,
    }}
  >
    <span style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.6 }}>{label}</span>
    <span style={{ fontSize: 30, lineHeight: 1.6, color: muted }}>{leaflet}</span>
    <span style={{ fontSize: 30, lineHeight: 1.6 }}>{deck}</span>
  </div>
);

const Comparison: Page = () => (
  <Frame chapter="02 · vs Leaflet">
    <Header eyebrow="02 · 逐項比較" title="一張表看懂差異" />
    <div style={{ marginTop: 56, borderBottom: `1px solid ${line}` }}>
      <CompareHead />
      <CompareRow label="渲染方式" leaflet="DOM · SVG · Canvas 2D" deck="WebGL2 · WebGPU" />
      <CompareRow label="舒適資料量" leaflet="數千～數萬筆" deck="數十萬～數百萬筆" />
      <CompareRow label="3D / 傾斜旋轉" leaflet="不支援（需外掛）" deck="內建 pitch、bearing、3D 圖層" />
      <CompareRow label="底圖" leaflet="內建圖磚圖層" deck="搭配 MapLibre、Google Maps 等" />
      <CompareRow label="套件體積" leaflet="約 42 KB（gzip）" deck="數百 KB 起" />
      <CompareRow label="上手門檻" leaflet="低，API 直覺" deck="中，需理解 Layer 與 accessor" />
    </div>
  </Frame>
);

// ─── 09 Scale ───────────────────────────────────────────────────────────────
// Log axis: 100 → 0px, each ×10 → +240px, 10M → 1200px.
const SCALE_COLS = '440px 1200px';

const Tick = ({ x, label }: { x: number; label: string }) => (
  <div style={{ position: 'absolute', left: x, top: 0, transform: 'translateX(-50%)', textAlign: 'center' }}>
    <div style={{ fontFamily: mono, fontSize: 24, color: muted }}>{label}</div>
    <div style={{ width: 2, height: 14, background: line, margin: '10px auto 0' }} />
  </div>
);

const ScaleRow = ({
  name,
  sub,
  width,
  color,
  fade,
}: {
  name: string;
  sub: string;
  width: number;
  color: string;
  fade?: boolean;
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: SCALE_COLS,
      alignItems: 'center',
      padding: '30px 0',
      borderTop: `1px solid ${line}`,
    }}
  >
    <div>
      <div style={{ fontFamily: mono, fontSize: 34, fontWeight: 700, lineHeight: 1.3, color }}>{name}</div>
      <div style={{ fontSize: 26, color: muted, lineHeight: 1.5, marginTop: 6 }}>{sub}</div>
    </div>
    <div
      style={{
        width,
        height: 40,
        borderRadius: 8,
        background: fade ? `linear-gradient(90deg, ${color} 70%, rgba(101,79,240,0))` : color,
        opacity: fade ? 1 : 0.85,
      }}
    />
  </div>
);

const Scale: Page = () => (
  <Frame chapter="02 · vs Leaflet">
    <Header eyebrow="02 · 關鍵差異" title="差距在資料量：數量級的不同" />
    <div style={{ marginTop: 64 }}>
      <div style={{ display: 'grid', gridTemplateColumns: SCALE_COLS, height: 70 }}>
        <span style={{ fontFamily: mono, fontSize: 22, color: muted, letterSpacing: '0.14em' }}>資料筆數（對數）</span>
        <div style={{ position: 'relative' }}>
          <Tick x={0} label="100" />
          <Tick x={240} label="1K" />
          <Tick x={480} label="10K" />
          <Tick x={720} label="100K" />
          <Tick x={960} label="1M" />
          <Tick x={1200} label="10M" />
        </div>
      </div>
      <div style={{ borderBottom: `1px solid ${line}` }}>
        <Steps>
          <ScaleRow name="Leaflet · DOM" sub="Marker 到數千個開始卡頓" width={408} color={mint} />
          <Step>
            <ScaleRow name="Leaflet · Canvas" sub="向量圖形約到十萬級" width={720} color={mint} />
          </Step>
          <Step>
            <ScaleRow name="deck.gl · GPU" sub="百萬級仍維持流暢互動" width={1200} color="#654ff0" fade />
          </Step>
        </Steps>
      </div>
    </div>
    <div style={{ fontFamily: mono, fontSize: 22, color: muted, marginTop: 32 }}>
      * 量級為經驗值示意，實際依裝置、圖形複雜度與互動方式而定
    </div>
  </Frame>
);

// ─── 10 Use cases ───────────────────────────────────────────────────────────
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
  <Frame chapter="03 · 適用場景">
    <Header eyebrow="03 · 適用場景" title="四種最能發揮 deck.gl 的場景" />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 64 }}>
      <Steps>
        <Step>
          <UseCard
            num="01"
            title="移動軌跡與車隊"
            desc="車輛、船舶、無人機的時空軌跡回放"
            examples="TripsLayer · 叫車調度 · 物流車隊"
          />
        </Step>
        <Step>
          <UseCard
            num="02"
            title="起訖流向分析"
            desc="人流、物流、航線之間的 OD 關係"
            examples="ArcLayer · 通勤 · 遷徙 · 航班"
          />
        </Step>
        <Step>
          <UseCard
            num="03"
            title="海量點位聚合"
            desc="百萬筆 IoT、GPS、交易資料找出熱區"
            examples="HexagonLayer · Heatmap · 電信訊號"
          />
        </Step>
        <Step>
          <UseCard
            num="04"
            title="3D 城市與數位孿生"
            desc="建築、點雲、地形組成的 3D 場景"
            examples="Tile3DLayer · 智慧城市 · 都市規劃"
          />
        </Step>
      </Steps>
    </div>
  </Frame>
);

// ─── 11 When to use ─────────────────────────────────────────────────────────
const VerdictItem = ({ children }: { children: ReactNode }) => (
  <div style={{ fontSize: 34, lineHeight: 1.6, padding: '18px 0', borderTop: `1px solid ${line}` }}>{children}</div>
);

const VerdictColumn = ({ deck, children }: { deck?: boolean; children: ReactNode }) => (
  <div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
      <span
        style={{
          height: 56,
          padding: '0 20px',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          fontFamily: mono,
          fontSize: 28,
          fontWeight: 800,
          background: deck ? 'var(--osd-accent)' : 'transparent',
          border: deck ? 'none' : `2px solid ${mint}`,
          boxSizing: 'border-box',
          color: deck ? '#ffffff' : mint,
        }}
      >
        {deck ? 'deck.gl' : 'Leaflet'}
      </span>
      <span style={{ fontSize: 40, fontWeight: 700 }}>{deck ? '該出手了' : '就夠用了'}</span>
    </div>
    <div>{children}</div>
  </div>
);

const WhenToUse: Page = () => (
  <Frame chapter="03 · 使用時機">
    <Header eyebrow="03 · 使用時機" title="什麼時候該掏出 deck.gl？" />
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, marginTop: 64 }}>
      <Steps>
        <VerdictColumn deck>
          <VerdictItem>資料量超過數萬筆，還要即時互動</VerdictItem>
          <VerdictItem>需要 3D、傾斜視角或時間動畫</VerdictItem>
          <VerdictItem>在瀏覽器即時聚合、篩選大量資料</VerdictItem>
          <VerdictItem>資料探索、分析型儀表板</VerdictItem>
        </VerdictColumn>
        <Step>
          <VerdictColumn>
            <VerdictItem>門市地圖、幾百個 Marker</VerdictItem>
            <VerdictItem>要極輕量、快速上線的頁面</VerdictItem>
            <VerdictItem>低階裝置或 GPU 受限的環境</VerdictItem>
            <VerdictItem>以 Popup、繪製等 GIS 操作為主</VerdictItem>
          </VerdictColumn>
        </Step>
      </Steps>
    </div>
  </Frame>
);

// ─── 12 Quick decision ──────────────────────────────────────────────────────
const QuestionRow = ({ num, question }: { num: string; question: ReactNode }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '120px 1fr 300px',
      alignItems: 'center',
      padding: '26px 0',
      borderTop: `1px solid ${line}`,
    }}
  >
    <span style={{ fontFamily: mono, fontSize: 40, fontWeight: 800, color: 'var(--osd-accent)' }}>{num}</span>
    <span style={{ fontSize: 40, fontWeight: 600, lineHeight: 1.4 }}>{question}</span>
    <span
      style={{
        justifySelf: 'end',
        padding: '10px 24px',
        borderRadius: 10,
        background: 'rgba(101,79,240,0.18)',
        border: '1px solid var(--osd-accent)',
        fontFamily: mono,
        fontSize: 26,
        color: accentSoft,
      }}
    >
      是 → deck.gl
    </span>
  </div>
);

const QuickDecision: Page = () => (
  <Frame chapter="03 · 使用時機">
    <Header eyebrow="03 · 快速判斷" title="三個問題，十秒決定" />
    <div style={{ marginTop: 56 }}>
      <Steps>
        <QuestionRow num="Q1" question="資料量會超過約 10 萬筆嗎？" />
        <Step>
          <QuestionRow num="Q2" question="需要 3D、傾斜視角或時間動畫嗎？" />
        </Step>
        <Step>
          <QuestionRow num="Q3" question="要在瀏覽器即時聚合、篩選資料嗎？" />
        </Step>
        <Step>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '28px 40px',
              marginTop: 8,
              borderRadius: 'var(--osd-radius)',
              background: 'rgba(126,226,184,0.08)',
              border: `1px solid ${mint}`,
            }}
          >
            <span style={{ fontSize: 40, fontWeight: 600 }}>三題都是「否」</span>
            <span style={{ fontFamily: mono, fontSize: 32, fontWeight: 700, color: mint }}>→ Leaflet 就夠用</span>
          </div>
        </Step>
      </Steps>
    </div>
    <div style={{ fontFamily: mono, fontSize: 24, color: muted, marginTop: 44, lineHeight: 1.6 }}>
      * 不一定二選一：<span style={{ color: accentSoft }}>deck.gl-leaflet</span> 外掛可把 deck.gl 圖層疊進既有 Leaflet
      地圖
    </div>
  </Frame>
);

// ─── 13 Closing ─────────────────────────────────────────────────────────────
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
        deck.gl 是以<span style={{ color: accentSoft }}>圖層組合</span>、GPU 渲染的資料視覺化框架
      </Takeaway>
      <Takeaway num="02">
        <span style={{ color: mint }}>Leaflet</span> 從地圖出發，<span style={{ color: accentSoft }}>deck.gl</span>{' '}
        從資料出發
      </Takeaway>
      <Takeaway num="03">
        資料量大、要 3D 或動畫時，才是掏出 <span style={{ color: accentSoft }}>deck.gl</span> 的時機
      </Takeaway>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 72 }}>
      <div style={{ fontFamily: mono, fontSize: 96, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em' }}>
        Q &amp; A
      </div>
      <div style={{ fontFamily: mono, fontSize: 26, color: muted, lineHeight: 1.7, textAlign: 'right' }}>
        deck.gl
        <br />
        leafletjs.com
        <br />
        kepler.gl
      </div>
    </div>
  </Frame>
);

export const notes: (string | undefined)[] = [
  `（約 30 秒）
大家好，今天用 10 分鐘介紹 deck.gl，並且拿它和大家比較熟悉的 Leaflet 做比較。
上面這行 new Deck({ layers }) 幾乎就是 deck.gl 的全部心法：你給它一組圖層，它用 GPU 畫出來。
一句話定位：用 GPU，把百萬筆資料變成可互動的地圖。`,
  `（約 20 秒）
今天分三段：先講 deck.gl 是什麼、怎麼運作；再和 Leaflet 比較；最後講它的適用場景，以及什麼時候該用、什麼時候 Leaflet 就夠了。`,
  `（約 1 分鐘）
第一個要釐清的觀念：deck.gl 不是傳統的地圖函式庫，而是一個資料視覺化的渲染引擎，把資料一層一層疊上去。
四個特性：GPU 渲染——用 WebGL2 / WebGPU，百萬筆資料也能流暢互動；圖層組合——每種視覺化都是一個 Layer；宣告式 API——你只描述資料和怎麼取值，更新交給框架；底圖中立——可以疊在 MapLibre、Mapbox、Google Maps、ArcGIS 上。
背景：2016 年由 Uber 開源，現在由 OpenJS 基金會底下的 vis.gl 維護，kepler.gl、CARTO 都是以它為核心。`,
  `（約 1 分鐘，按 → 逐步顯示流程）
運作流程：先有資料，可以是 JSON、CSV，也可以是 Arrow 這類二進位格式或向量圖磚。
（→）接著用 accessor 告訴它每筆資料怎麼取位置、顏色、大小。
（→）交給某個 Layer，例如散點、弧線、六角聚合。
（→）最後資料被轉成 GPU buffer，由 shader 平行繪製。
為什麼快？資料只上傳一次，之後平移縮放只是改相機矩陣，不用重新處理每一筆資料。
互動也在 GPU 上做，叫 GPU picking，所以百萬個點裡 hover 也能即時命中。`,
  `（約 45 秒）
deck.gl 內建幾十種 Layer，這裡挑六個最常用的：
散點圖畫大量點位；弧線圖畫起訖流向；六角聚合把點分箱成 3D 柱狀；熱力圖看密度；TripsLayer 做軌跡動畫；Tile3DLayer 載入城市 3D 模型或點雲。
大部分需求挑一個 Layer、餵資料就能畫，不夠用也可以自訂 shader 或組合成 CompositeLayer。`,
  `（約 1 分鐘）
實際寫起來長這樣：建立一個 Deck，設定初始視角，這裡是台北；controller: true 開啟拖曳縮放。
layers 裡放一個 ScatterplotLayer：data 給資料來源，getPosition 告訴它座標在哪個欄位，getFillColor 設顏色。
就這十幾行，資料有一百萬筆也一樣寫法。
React 專案則有 <DeckGL> 元件，用法一樣；每次給新的 layers 陣列，deck.gl 會用 id 比對，只更新有變的部分。
需要底圖的話，再疊一層 MapLibre 即可。`,
  `（約 50 秒）
接著和 Leaflet 比較。兩者的出發點完全不同。
Leaflet 是輕量的「地圖」函式庫：用 DOM、SVG 或 Canvas 2D 繪製，核心是圖磚底圖、Marker、Popup，只有約 42 KB，外掛生態非常豐富。
deck.gl 是 GPU 的「資料」引擎：用 WebGL 繪製，擅長資料圖層、3D、時間動畫，底圖則交給 MapLibre 這類專門的函式庫。
一句話：Leaflet 從地圖出發，deck.gl 從資料出發。`,
  `（約 1 分鐘）
逐項來看：
渲染方式——Leaflet 是 DOM、SVG、Canvas 2D；deck.gl 是 WebGL2 / WebGPU。
舒適資料量——Leaflet 大約數千到數萬筆；deck.gl 可以到數十萬甚至數百萬筆。
3D——Leaflet 本身不支援傾斜旋轉；deck.gl 內建 pitch、bearing 和各種 3D 圖層。
底圖——Leaflet 內建圖磚圖層；deck.gl 通常搭配 MapLibre 或 Google Maps。
代價是體積和學習曲線：Leaflet 約 42 KB、API 直覺；deck.gl 動輒數百 KB，也要先理解 Layer 和 accessor 的概念。`,
  `（約 50 秒，按 → 依序顯示長條）
最關鍵的差異是資料量，而且是數量級的差異，所以這張圖用對數軸。
Leaflet 用 DOM Marker 時，每個點都是一個 DOM 元素，到數千個就開始卡頓。
（→）改用 Canvas 繪製向量，可以撐到十萬級左右。
（→）deck.gl 把資料交給 GPU，百萬級仍能流暢互動。
提醒一下，這些是經驗值示意，實際會依裝置和圖形複雜度而不同。`,
  `（約 1 分鐘，按 → 逐張顯示）
四種最能發揮 deck.gl 的場景：
一、移動軌跡與車隊，用 TripsLayer 做時空回放，這也是 Uber 當初開發它的原因。
二、起訖流向分析，用 ArcLayer 畫通勤、遷徙、航班這類 OD 關係。
三、海量點位聚合，百萬筆 IoT、GPS、交易資料，用 Hexagon 或 Heatmap 找熱區。
四、3D 城市與數位孿生，載入 3D Tiles 的建築、點雲、地形。`,
  `（約 1 分鐘，按 → 顯示右欄）
什麼時候該掏出 deck.gl？
資料量超過數萬筆還要即時互動；需要 3D、傾斜視角或時間動畫；要在瀏覽器即時聚合、篩選大量資料；或是在做資料探索、分析型儀表板。
（→）反過來，如果只是門市地圖、幾百個 Marker；要極輕量、快速上線；目標裝置 GPU 很弱；或主要是 Popup、繪製這類傳統 GIS 操作——Leaflet 就夠用了，沒必要背 deck.gl 的體積和複雜度。`,
  `（約 45 秒，按 → 逐題顯示）
如果只想記一個判斷法，就問三個問題：
資料量會超過約 10 萬筆嗎？（→）需要 3D、傾斜或時間動畫嗎？（→）要在瀏覽器即時聚合、篩選嗎？
任何一題答「是」，就考慮 deck.gl。（→）三題都是否，Leaflet 就夠用。
最後補充：兩者也不一定二選一，社群有 deck.gl-leaflet 外掛，可以把 deck.gl 圖層疊進既有的 Leaflet 地圖，漸進導入。`,
  `（約 20 秒 + Q&A）
最後三個重點：deck.gl 是用圖層組合、GPU 渲染的資料視覺化框架；Leaflet 從地圖出發，deck.gl 從資料出發；資料量大、要 3D 或動畫時，才是掏出 deck.gl 的時機。
延伸資源可以看 deck.gl 官網的範例、Leaflet 官網，以及基於 deck.gl 的免寫程式工具 kepler.gl。謝謝大家，開放提問。`,
];

export const meta: SlideMeta = {
  title: 'deck.gl 入門',
  createdAt: '2026-10-20T16:22:56.259Z',
};

export default [
  Cover,
  Agenda,
  WhatIs,
  HowItWorks,
  LayerCatalog,
  CodeDemo,
  Philosophy,
  Comparison,
  Scale,
  UseCases,
  WhenToUse,
  QuickDecision,
  Closing,
] satisfies Page[];
