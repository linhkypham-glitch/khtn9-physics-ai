"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

import { ExperimentShell } from "@/components/experiments/lab-kit";
import { Skeleton } from "@/components/ui/skeleton";
import type { ExperimentDef } from "./catalog";

const loading = () => <Skeleton className="h-96 w-full rounded-2xl" />;

/** Bảng ánh xạ khoá thí nghiệm → component (tải theo yêu cầu, chỉ chạy trên trình duyệt). */
const LABS: Record<string, ComponentType> = {
  "kinetic-potential": dynamic(() => import("./experiments/mechanics").then((m) => m.KineticPotentialLab), { ssr: false, loading }),
  "mechanical-energy": dynamic(() => import("./experiments/mechanics").then((m) => m.MechanicalEnergyLab), { ssr: false, loading }),
  "work-power": dynamic(() => import("./experiments/mechanics").then((m) => m.WorkPowerLab), { ssr: false, loading }),
  refraction: dynamic(() => import("./experiments/optics-labs").then((m) => m.RefractionLab), { ssr: false, loading }),
  "total-reflection": dynamic(() => import("./experiments/optics-labs").then((m) => m.TotalReflectionLab), { ssr: false, loading }),
  prism: dynamic(() => import("./experiments/optics-labs").then((m) => m.PrismLab), { ssr: false, loading }),
  lens: dynamic(() => import("./experiments/optics-labs").then((m) => m.LensLab), { ssr: false, loading }),
  "focal-length": dynamic(() => import("./experiments/optics-labs").then((m) => m.FocalLengthLab), { ssr: false, loading }),
  magnifier: dynamic(() => import("./experiments/optics-labs").then((m) => m.MagnifierLab), { ssr: false, loading }),
  "ohm-law": dynamic(() => import("./experiments/electricity").then((m) => m.OhmLawLab), { ssr: false, loading }),
  "series-parallel": dynamic(() => import("./experiments/electricity").then((m) => m.SeriesParallelLab), { ssr: false, loading }),
  "electric-power": dynamic(() => import("./experiments/electricity").then((m) => m.ElectricPowerLab), { ssr: false, loading }),
  induction: dynamic(() => import("./experiments/electromagnetism-energy").then((m) => m.InductionLab), { ssr: false, loading }),
  "ac-effects": dynamic(() => import("./experiments/electromagnetism-energy").then((m) => m.AcEffectsLab), { ssr: false, loading }),
  "fossil-energy": dynamic(() => import("./experiments/electromagnetism-energy").then((m) => m.FossilEnergyLab), { ssr: false, loading }),
  renewable: dynamic(() => import("./experiments/electromagnetism-energy").then((m) => m.RenewableLab), { ssr: false, loading }),
  "metal-reactions": dynamic(() => import("./experiments/chemistry").then((m) => m.MetalReactionsLab), { ssr: false, loading }),
  "activity-series": dynamic(() => import("./experiments/chemistry").then((m) => m.ActivitySeriesLab), { ssr: false, loading }),
  "metal-extraction": dynamic(() => import("./experiments/chemistry").then((m) => m.MetalExtractionLab), { ssr: false, loading }),
  "charcoal-adsorption": dynamic(() => import("./experiments/chemistry").then((m) => m.CharcoalAdsorptionLab), { ssr: false, loading }),
  "alkane-combustion": dynamic(() => import("./experiments/chemistry").then((m) => m.AlkaneCombustionLab), { ssr: false, loading }),
  ethylene: dynamic(() => import("./experiments/chemistry").then((m) => m.EthyleneLab), { ssr: false, loading }),
  ethanol: dynamic(() => import("./experiments/chemistry").then((m) => m.EthanolLab), { ssr: false, loading }),
  "acetic-acid": dynamic(() => import("./experiments/chemistry").then((m) => m.AceticAcidLab), { ssr: false, loading }),
  "glucose-saccharose": dynamic(() => import("./experiments/chemistry").then((m) => m.SugarLab), { ssr: false, loading }),
  "starch-cellulose": dynamic(() => import("./experiments/chemistry").then((m) => m.StarchLab), { ssr: false, loading }),
  protein: dynamic(() => import("./experiments/chemistry").then((m) => m.ProteinLab), { ssr: false, loading }),
};

export const LAB_KEYS = Object.keys(LABS);

export function ExperimentPanel({ def, canSave }: { def: ExperimentDef; canSave: boolean }) {
  const Lab = LABS[def.key];
  if (!Lab) return null;
  return (
    <ExperimentShell def={def} canSave={canSave}>
      <Lab />
    </ExperimentShell>
  );
}
