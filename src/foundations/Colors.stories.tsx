import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../components/Badge/Badge';

const meta: Meta = {
  title: 'Foundations/Colors',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

// Resolve a `:root` CSS variable to sRGB bytes by letting the browser do the
// color math (it understands oklch), then reading the pixel back from a canvas.
function cssVarToRgb(cssVar: string): [number, number, number] {
  const probe = document.createElement('span');
  probe.style.color = `var(${cssVar})`;
  document.body.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const context = canvas.getContext('2d', { willReadFrequently: true })!;
  context.fillStyle = resolved;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
  return [r!, g!, b!];
}

const luminance = ([r, g, b]: [number, number, number]) => {
  const linear = [r, g, b].map((byte) => {
    const c = byte / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
};

function contrastBetween(fg: string, bg: string) {
  const [a, b] = [luminance(cssVarToRgb(fg)), luminance(cssVarToRgb(bg))];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

interface Pair {
  label: string;
  /** Text (or graphic) color token, as a `:root` variable name. */
  fg: string;
  /** Background token it sits on. */
  bg: string;
  /** Minimum WCAG contrast: 4.5 for text, 3 for graphics and UI boundaries. */
  need: number;
  kind: 'text' | 'graphic';
}

const sections: { title: string; pairs: Pair[] }[] = [
  {
    title: 'Buttons',
    pairs: [
      { label: 'Primary', fg: '--primary-foreground', bg: '--primary', need: 4.5, kind: 'text' },
      { label: 'Primary hover', fg: '--primary-foreground', bg: '--primary-hover', need: 4.5, kind: 'text' },
      { label: 'Secondary', fg: '--secondary-foreground', bg: '--secondary', need: 4.5, kind: 'text' },
      { label: 'Secondary hover', fg: '--secondary-foreground', bg: '--secondary-hover', need: 4.5, kind: 'text' },
      { label: 'Ghost hover', fg: '--ghost-foreground', bg: '--ghost-hover', need: 4.5, kind: 'text' },
    ],
  },
  {
    title: 'Status',
    pairs: [
      { label: 'Info', fg: '--info-foreground', bg: '--info', need: 4.5, kind: 'text' },
      { label: 'Success', fg: '--success-foreground', bg: '--success', need: 4.5, kind: 'text' },
      { label: 'Warning', fg: '--warning-foreground', bg: '--warning', need: 4.5, kind: 'text' },
      { label: 'Danger', fg: '--danger-foreground', bg: '--danger', need: 4.5, kind: 'text' },
      { label: 'Danger hover', fg: '--danger-foreground', bg: '--danger-hover', need: 4.5, kind: 'text' },
    ],
  },
  {
    title: 'Surfaces and text',
    pairs: [
      { label: 'Text on surface', fg: '--surface-foreground', bg: '--surface', need: 4.5, kind: 'text' },
      { label: 'Muted text on surface', fg: '--muted-foreground', bg: '--surface', need: 4.5, kind: 'text' },
      { label: 'Muted text on muted fill', fg: '--muted-foreground', bg: '--muted', need: 4.5, kind: 'text' },
      { label: 'Success text on surface', fg: '--success-foreground', bg: '--surface', need: 4.5, kind: 'text' },
      { label: 'Danger text on surface', fg: '--danger-foreground', bg: '--surface', need: 4.5, kind: 'text' },
    ],
  },
  {
    title: 'Non-text: borders, focus, charts',
    pairs: [
      { label: 'Focus ring', fg: '--ring', bg: '--surface', need: 3, kind: 'graphic' },
      { label: 'Input border', fg: '--input', bg: '--surface', need: 3, kind: 'graphic' },
      { label: 'Invalid input border', fg: '--danger-foreground', bg: '--surface', need: 3, kind: 'graphic' },
    ],
  },
  {
    title: 'Chart series (on a card surface)',
    pairs: [
      { label: 'Series 1', fg: '--chart-1', bg: '--surface', need: 3, kind: 'graphic' },
      { label: 'Series 2', fg: '--chart-2', bg: '--surface', need: 3, kind: 'graphic' },
      { label: 'Series 3', fg: '--chart-3', bg: '--surface', need: 3, kind: 'graphic' },
      { label: 'Series 4', fg: '--chart-4', bg: '--surface', need: 3, kind: 'graphic' },
    ],
  },
];

function PairRow({ label, fg, bg, need, kind }: Pair) {
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setRatio(contrastBetween(fg, bg)));
    return () => cancelAnimationFrame(frame);
  }, [fg, bg]);

  const passes = ratio !== null && ratio >= need;

  return (
    <div className="grid grid-cols-[10rem_1fr_auto] items-center gap-4">
      <div
        className="flex h-12 items-center justify-center rounded-md border border-border text-sm font-medium"
        style={{
          background: `var(${bg})`,
          color: kind === 'text' ? `var(${fg})` : undefined,
        }}
      >
        {kind === 'text' ? (
          'Aa 1,234'
        ) : (
          <span
            className="block h-3 w-20 rounded-sm"
            style={{ background: `var(${fg})` }}
          />
        )}
      </div>
      <div className="text-sm">
        <div className="font-medium">{label}</div>
        <div className="font-mono text-xs text-muted-foreground">
          {fg} on {bg}
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm tabular-nums">
        <span data-testid="ratio">
          {ratio === null ? '…' : ratio.toFixed(2)}
        </span>
        <span className="text-muted-foreground">/ {need}</span>
        {ratio !== null && (
          <Badge variant={passes ? 'success' : 'danger'}>
            {passes ? 'Pass' : 'Fail'}
          </Badge>
        )}
      </div>
    </div>
  );
}

// Change the tokens in `src/index.css` and this page updates with them.
export const Overview: Story = {
  render: () => (
    <div className="flex max-w-3xl flex-col gap-10">
      <p className="text-sm text-muted-foreground">
        Contrast is calculated live from the tokens in <code>src/index.css</code>{' '}
        (WCAG: 4.5 for text, 3 for graphics and UI boundaries).
      </p>
      {sections.map((section) => (
        <section key={section.title} className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {section.title}
          </h2>
          {section.pairs.map((pair) => (
            <PairRow key={`${pair.fg}-${pair.bg}`} {...pair} />
          ))}
        </section>
      ))}
    </div>
  ),
};
