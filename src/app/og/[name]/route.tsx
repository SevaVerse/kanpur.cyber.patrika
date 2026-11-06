import { readFileSync } from "node:fs";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { getAllBriefings, getBriefingByDate } from "@/lib/briefings";
import { formatLongDate } from "@/lib/format";
import { OG_IMAGE_SIZE } from "@/lib/site-metadata";

/**
 * Social share cards, rendered once at build time into /og/*.png.
 *
 * A route handler rather than the `opengraph-image` file convention: file-based
 * images take priority over metadata, so a root card would replace the poster
 * that each awareness guide deliberately uses as its preview. Here every page
 * opts in explicitly.
 *
 * Text is Latin only. Satori does not shape Devanagari conjuncts reliably, and
 * a mangled Hindi headline on a share card is worse than none; Hindi guides
 * already share their own poster.
 */

export const dynamic = "force-static";
export const dynamicParams = false;

const FONT_DIR = join(process.cwd(), "src", "assets", "fonts");
const fonts = [
  { name: "Hind", data: readFileSync(join(FONT_DIR, "Hind-Regular.ttf")), weight: 400 as const },
  { name: "Hind", data: readFileSync(join(FONT_DIR, "Hind-Bold.ttf")), weight: 700 as const },
];

const COLORS = {
  ink: "#0f172a",
  paper: "#fbf7f0",
  accent: "#b42318",
  amber: "#f59e0b",
  slate: "#cbd5e1",
};

export function generateStaticParams() {
  return [
    { name: "site.png" },
    ...getAllBriefings().map((briefing) => ({ name: `briefing-${briefing.date}.png` })),
  ];
}

function truncate(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;
}

function Card({ kicker, title, footer }: { kicker: string; title: string; footer: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 72px",
        background: `linear-gradient(135deg, ${COLORS.ink} 0%, #1e293b 70%, #3b1d1a 100%)`,
        color: "white",
        fontFamily: "Hind",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: COLORS.amber,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: COLORS.ink,
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          CV
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 34, fontWeight: 700 }}>Cyber Vani</div>
          <div style={{ fontSize: 22, color: COLORS.amber, letterSpacing: 2 }}>{kicker}</div>
        </div>
      </div>

      <div style={{ display: "flex", fontSize: 62, fontWeight: 700, lineHeight: 1.12, maxWidth: 1040 }}>
        {title}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 26, color: COLORS.slate }}>{footer}</div>
        <div
          style={{
            display: "flex",
            background: "white",
            color: COLORS.ink,
            borderRadius: 999,
            padding: "10px 28px",
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          Fraud? Call 1930
        </div>
      </div>
    </div>
  );
}

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  let card: { kicker: string; title: string; footer: string };

  const briefingMatch = /^briefing-(\d{4}-\d{2}-\d{2})\.png$/.exec(name);
  const briefing = briefingMatch ? getBriefingByDate(briefingMatch[1]) : null;

  if (briefing) {
    const lead = briefing.stories[0]?.headline;
    card = {
      kicker: `WEEKLY BRIEFING · ${formatLongDate(briefing.date).toUpperCase()}`,
      title: truncate(lead ?? briefing.title, 110),
      footer: `${briefing.stories.length} stories · cybervani.com`,
    };
  } else {
    card = {
      kicker: "CYBER FRAUD ALERTS · HINDI & ENGLISH",
      title: "Know the scam before it finds you.",
      footer: "Weekly briefings and free awareness guides · cybervani.com",
    };
  }

  return new ImageResponse(<Card {...card} />, { ...OG_IMAGE_SIZE, fonts });
}
