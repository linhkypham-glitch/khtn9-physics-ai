"use client";

import { useState } from "react";

import { Formula, LabLayout, Observation, Readout, RunControls, Segmented, Stage, useAnimationLoop, useLab, useOnReset, useSnapshot } from "@/components/experiments/lab-kit";
import { cn } from "@/lib/utils";
import {
  ACETIC_ACID_LAB,
  ACTIVITY_SERIES,
  ACTIVITY_SERIES_LAB,
  ALKANE_COMBUSTION,
  CHARCOAL_ADSORPTION,
  ETHANOL_LAB,
  ETHYLENE_LAB,
  METAL_EXTRACTION,
  METAL_REACTIONS,
  PROTEIN_LAB,
  STARCH_LAB,
  SUGAR_LAB,
  type ChemLabConfig,
  type Visual,
} from "../chem-data";

/* ---------- tiện ích màu ---------- */
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)] as const;
}
function mix(a: string, b: string | undefined, t: number) {
  if (!b) return a;
  const [r1, g1, b1] = hexToRgb(a);
  const [r2, g2, b2] = hexToRgb(b);
  const k = Math.max(0, Math.min(1, t));
  return `rgb(${Math.round(r1 + (r2 - r1) * k)},${Math.round(g1 + (g2 - g1) * k)},${Math.round(b1 + (b2 - b1) * k)})`;
}

const TUBE = "M215,36 L215,222 Q215,272 300,272 Q385,272 385,222 L385,36";

function Flame({ kind, clock }: { kind: NonNullable<Visual["flame"]>; clock: number }) {
  const colors = { orange: ["#f97316", "#fde047"], blue: ["#3b82f6", "#bae6fd"], bright: ["#fde047", "#ffffff"] }[kind];
  const s = 1 + Math.sin(clock * 11) * 0.08;
  return (
    <g transform={`translate(300 34) scale(${s} ${1 + Math.sin(clock * 9 + 1) * 0.1})`} style={{ filter: kind === "bright" ? "drop-shadow(0 0 14px #fde047)" : undefined }}>
      <path d="M0,0 C-34,-18 -26,-60 0,-92 C26,-60 34,-18 0,0 Z" fill={colors[0]} opacity={0.9} />
      <path d="M0,0 C-16,-10 -12,-34 0,-52 C12,-34 16,-10 0,0 Z" fill={colors[1]} opacity={0.95} />
    </g>
  );
}

function Vessel({ v, p, clock, running }: { v: Visual; p: number; clock: number; running: boolean }) {
  const liquid = mix(v.liquid, v.liquidAfter, p);
  const solid = v.solid ? mix(v.solid.color, v.solid.colorAfter, p) : null;
  return (
    <svg viewBox="0 0 600 310" className="w-full" role="img" aria-label="Ống nghiệm mô phỏng thí nghiệm hoá học">
      <defs>
        <clipPath id="chem-tube"><path d={`${TUBE} Z`} /></clipPath>
        <linearGradient id="chem-mirror" x1="0" x2="1">
          <stop offset="0" stopColor="#94a3b8" /><stop offset="0.35" stopColor="#f8fafc" /><stop offset="0.7" stopColor="#94a3b8" /><stop offset="1" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
      <rect x={0} y={288} width={600} height={22} fill="#fde68a" opacity={0.25} />
      {/* dung dịch */}
      <g clipPath="url(#chem-tube)">
        <rect x={210} y={122} width={180} height={160} fill={liquid} opacity={0.9} />
        {v.turbid && <rect x={210} y={122} width={180} height={160} fill="#f8fafc" opacity={p * 0.85} />}
        {v.mirror && <rect x={211} y={118} width={178} height={170} fill="url(#chem-mirror)" opacity={p * 0.75} />}
        {v.mirror && <rect x={236} y={122} width={128} height={160} fill={liquid} opacity={0.9} />}
        {v.precipitate && <ellipse cx={300} cy={262} rx={70} ry={14 + p * 8} fill={v.precipitate} opacity={Math.min(1, p * 1.4)} stroke="#a8a29e" strokeOpacity={0.4} />}
        {v.fog && <rect x={210} y={40} width={180} height={82} fill="#ffffff" opacity={p * 0.7} />}
        {/* vật rắn */}
        {v.solid && solid && (
          <g>
            <rect x={284} y={92} width={32} height={150} rx={6} fill={solid} stroke="#44403c" strokeOpacity={0.35} />
            {v.coating && <rect x={282} y={150} width={36} height={92} rx={8} fill={v.coating} opacity={Math.min(0.95, p * 1.2)} />}
          </g>
        )}
        {/* bọt khí */}
        {v.bubbles && running &&
          Array.from({ length: 12 }).map((_, i) => {
            const t = (clock * 0.9 + i * 0.37) % 1;
            return <circle key={i} cx={262 + ((i * 29) % 78) + Math.sin(clock * 3 + i) * 5} cy={252 - t * 150} r={3 + (i % 3)} fill="#ffffff" opacity={0.85 * (1 - t * 0.6)} stroke="#93c5fd" />;
          })}
      </g>
      {/* thành ống */}
      <path d={TUBE} fill="rgba(255,255,255,0.12)" stroke="#475569" strokeWidth={4} strokeLinecap="round" />
      <path d="M222,48 L222,215" stroke="#ffffff" strokeWidth={5} strokeLinecap="round" opacity={0.5} />
      {/* ngọn lửa / khói */}
      {v.flame && running && <Flame kind={v.flame} clock={clock} />}
      {v.smoke && running &&
        Array.from({ length: 5 }).map((_, i) => {
          const t = (clock * 0.35 + i * 0.2) % 1;
          return <ellipse key={i} cx={300 + Math.sin(clock * 2 + i * 1.7) * 26} cy={30 - t * 90} rx={20 + t * 26} ry={12 + t * 14} fill={v.smoke} opacity={0.5 * (1 - t) * Math.min(1, p * 3)} />;
        })}
      {v.solid && <text x={300} y={304} textAnchor="middle" fontSize={13} fill="#57534e">{v.solid.label}</text>}
    </svg>
  );
}

function SeriesBar({ metal }: { metal: string }) {
  return (
    <div className="rounded-2xl border bg-card p-3">
      <p className="mb-2 text-sm font-semibold">Dãy hoạt động hoá học (mức độ hoạt động giảm dần →)</p>
      <div className="flex flex-wrap gap-1">
        {ACTIVITY_SERIES.map((m) => (
          <span key={m} className={cn("flex size-9 items-center justify-center rounded-lg border text-sm font-bold", m === metal ? "border-primary bg-primary text-primary-foreground" : m === "H" ? "border-sky-300 bg-sky-50 text-sky-700" : "bg-muted/40")}>
            {m}
          </span>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Kim loại đứng trước H tác dụng với dung dịch acid; K, Na, Ca tác dụng với nước ở điều kiện thường; kim loại đứng trước (trừ K, Na, Ca) đẩy kim loại đứng sau ra khỏi dung dịch muối.</p>
    </div>
  );
}

export function ChemCaseLab({ config }: { config: ChemLabConfig }) {
  const { running, setRunning, addRecord } = useLab();
  const [reagentId, setReagentId] = useState(config.reagents[0].id);
  const reagent = config.reagents.find((r) => r.id === reagentId) ?? config.reagents[0];
  const [subjectId, setSubjectId] = useState(reagent.subjects[0].id);
  const subject = reagent.subjects.find((s) => s.id === subjectId) ?? reagent.subjects[0];
  const [p, setP] = useState(0);
  const [clock, setClock] = useState(0);
  const out = subject.outcome;
  useSnapshot({ chat: reagent.label, thi_nghiem: subject.label, ket_qua: out.reacts ? "có phản ứng" : "không phản ứng" });

  useAnimationLoop(running, (dt) => {
    setClock((c) => c + dt);
    setP((x) => Math.min(1, x + dt / 3.2));
  });
  useOnReset(() => {
    setP(0);
    setClock(0);
  });

  const restart = () => {
    setP(0);
    setClock(0);
    setRunning(false);
  };
  const showResult = p > 0.45;

  return (
    <LabLayout
      stage={
        <Stage>
          <Vessel v={out.visual} p={out.reacts || out.visual.solid ? p : 0} clock={clock} running={running} />
        </Stage>
      }
      readouts={
        <>
          <Readout label="Chất" value={reagent.label.split(" (")[0]} tone="orange" />
          <Readout label="Phản ứng" value={showResult ? (out.reacts ? "Có xảy ra" : "Không xảy ra") : "—"} tone={showResult ? (out.reacts ? "green" : "red") : "default"} />
          {out.facts?.map((f) => <Readout key={f.label} label={f.label} value={showResult ? f.value : "—"} tone="blue" />)}
        </>
      }
      controls={
        <>
          {config.reagents.length > 1 && (
            <Segmented
              label={config.reagentLabel}
              value={reagent.id}
              options={config.reagents.map((r) => ({ value: r.id, label: r.label }))}
              onChange={(id) => {
                const r = config.reagents.find((x) => x.id === id)!;
                setReagentId(id);
                setSubjectId(r.subjects[0].id);
                restart();
              }}
            />
          )}
          <Segmented
            label={config.subjectLabel}
            value={subject.id}
            options={reagent.subjects.map((s) => ({ value: s.id, label: s.label }))}
            onChange={(id) => {
              setSubjectId(id);
              restart();
            }}
          />
          <RunControls
            startLabel={config.startLabel}
            onRecord={() =>
              showResult &&
              addRecord({
                "Chất": reagent.label,
                "Thí nghiệm": subject.label,
                "Phản ứng": out.reacts ? "Có" : "Không",
                "Hiện tượng": out.observation.slice(0, 90),
                "Phương trình": out.equation ?? "—",
              })
            }
          />
          <Formula><span className="whitespace-pre-line">{config.formula}</span></Formula>
        </>
      }
      below={
        <div className="flex flex-col gap-3">
          {!running && p === 0 ? (
            <Observation>Chọn chất và thí nghiệm, bấm <b>{config.startLabel}</b> để quan sát hiện tượng.</Observation>
          ) : showResult ? (
            <Observation tone={out.reacts ? "success" : "info"}>
              <p><b>Hiện tượng:</b> {out.observation}</p>
              {out.equation && <p className="mt-1 font-mono">{out.equation}</p>}
              {out.why && <p className="mt-1 text-xs opacity-90">{out.why}</p>}
            </Observation>
          ) : (
            <Observation>Đang tiến hành thí nghiệm…</Observation>
          )}
          {config.series && <SeriesBar metal={subject.id} />}
        </div>
      }
    />
  );
}

export const MetalReactionsLab = () => <ChemCaseLab config={METAL_REACTIONS} />;
export const ActivitySeriesLab = () => <ChemCaseLab config={ACTIVITY_SERIES_LAB} />;
export const MetalExtractionLab = () => <ChemCaseLab config={METAL_EXTRACTION} />;
export const CharcoalAdsorptionLab = () => <ChemCaseLab config={CHARCOAL_ADSORPTION} />;
export const AlkaneCombustionLab = () => <ChemCaseLab config={ALKANE_COMBUSTION} />;
export const EthyleneLab = () => <ChemCaseLab config={ETHYLENE_LAB} />;
export const EthanolLab = () => <ChemCaseLab config={ETHANOL_LAB} />;
export const AceticAcidLab = () => <ChemCaseLab config={ACETIC_ACID_LAB} />;
export const SugarLab = () => <ChemCaseLab config={SUGAR_LAB} />;
export const StarchLab = () => <ChemCaseLab config={STARCH_LAB} />;
export const ProteinLab = () => <ChemCaseLab config={PROTEIN_LAB} />;
