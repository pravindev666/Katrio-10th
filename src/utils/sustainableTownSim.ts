/**
 * Pure deterministic simulation math for Pilot 6: "Design a Sustainable Tamil Nadu Town".
 * Every syllabus equation uses official TN Class 10 constants (π = 22/7, 1 kWh = 3.6×10⁶ J).
 * Real-world Tamil Nadu regional rainfall & municipal budget figures are illustrative simplifications
 * explicitly badged "Explore Further (Beyond Board Syllabus)" in the UI.
 */

export type TnTownRegion = 'coastal_chennai' | 'interior_coimbatore' | 'delta_thanjavur';

export interface RegionProfile {
  id: TnTownRegion;
  name: string;
  climateNote: string;
  annualRainfallMm: number; // Illustrative Explore Further mean annual value
  windPotentialFactor: number; // Relative factor (high near Western Ghats passes / Muppandal)
  monsoonSeason: string;
}

export const TN_TOWN_REGIONS: Record<TnTownRegion, RegionProfile> = {
  coastal_chennai: {
    id: 'coastal_chennai',
    name: 'Coastal Town (Bay of Bengal · NE Monsoon Zone)',
    climateNote: 'Receives majority rainfall during Oct–Dec Northeast Monsoon (Geo Unit 6, p. 208).',
    annualRainfallMm: 1300,
    windPotentialFactor: 0.75,
    monsoonSeason: 'Northeast Monsoon (Oct–Dec)',
  },
  interior_coimbatore: {
    id: 'interior_coimbatore',
    name: 'Interior Western-Ghats Pass Town (Rain-Shadow + Wind Corridor)',
    climateNote: 'Lower rainfall due to Western Ghats rain-shadow, but strong wind corridor through Palghat/Aralvaimozhi passes (Geo Unit 6, pp. 202–208).',
    annualRainfallMm: 700,
    windPotentialFactor: 1.35,
    monsoonSeason: 'Moderate SW + NE Monsoon (Rain-Shadow)',
  },
  delta_thanjavur: {
    id: 'delta_thanjavur',
    name: 'Kaveri Delta Agricultural Town (Alluvial Plains)',
    climateNote: 'Fertile Kaveri distributary plains with seasonal tank storage & solar irrigation potential (Geo Unit 6, pp. 206–207).',
    annualRainfallMm: 1000,
    windPotentialFactor: 0.85,
    monsoonSeason: 'Northeast Monsoon + Kaveri Canal Flow',
  },
};

export interface TankDesignResult {
  volumeM3: number;
  capacityLiters: number;
  csaM2: number;
  tsaM2: number;
  annualRainHarvestLiters: number;
  meetsVolumeGoal: boolean;
  meetsAreaBudget: boolean;
}

/**
 * Maths Ch. 7 (7.2 & 7.3) Cylindrical Water Tank + Science 22.7 Rooftop Rainwater Harvesting.
 * Uses exact TN Board π = 22/7.
 */
export function evaluateTownWaterTank(
  radiusM: number,
  heightM: number,
  roofCatchmentM2: number,
  region: TnTownRegion,
): TankDesignResult {
  const PI = 22 / 7;
  const volumeM3 = Number((PI * radiusM * radiusM * heightM).toFixed(2));
  const capacityLiters = Math.round(volumeM3 * 1000);
  const csaM2 = Number((2 * PI * radiusM * heightM).toFixed(2));
  const tsaM2 = Number((2 * PI * radiusM * (heightM + radiusM)).toFixed(2));
  const rainfallMm = TN_TOWN_REGIONS[region].annualRainfallMm;
  // 1 mm rain on 1 m² = 1 L, with 0.85 rooftop collection efficiency
  const annualRainHarvestLiters = Math.round(roofCatchmentM2 * rainfallMm * 0.85);

  return {
    volumeM3,
    capacityLiters,
    csaM2,
    tsaM2,
    annualRainHarvestLiters,
    meetsVolumeGoal: volumeM3 >= 1000,
    meetsAreaBudget: tsaM2 <= 620,
  };
}

export interface EnergyPlanResult {
  dailyDemandKwh: number;
  ledSavedKwh: number;
  cleanSupplyKwh: number;
  renewableSharePct: number;
  dailyEnergyJoulesMillion: number;
  meetsCleanTarget: boolean;
}

/**
 * Science Unit 4 (4.9 Electric Power, 4.11 LED) & Unit 22 (22.6 Wind/Solar, 22.8 Energy Management).
 * 1 kWh = 3.6 × 10⁶ J.
 */
export function evaluateTownEnergyPlan(
  ledUpgradePct: number,
  solarPanelsKw: number,
  windTurbinesCount: number,
  region: TnTownRegion,
): EnergyPlanResult {
  const baselineLightingKwh = 1200; // Illustrative small-town street/school lighting baseline
  const otherDemandKwh = 1800;
  // LEDs use ~70% less power than incandescent lamps for equal brightness
  const ledSavedKwh = Math.round(baselineLightingKwh * 0.7 * (ledUpgradePct / 100));
  const dailyDemandKwh = baselineLightingKwh - ledSavedKwh + otherDemandKwh;

  // Illustrative solar (~4.8 peak sun hours/day) + regional wind output
  const solarKwh = Math.round(solarPanelsKw * 4.8);
  const windKwh = Math.round(windTurbinesCount * 420 * TN_TOWN_REGIONS[region].windPotentialFactor);
  const cleanSupplyKwh = solarKwh + windKwh;
  const renewableSharePct = Math.min(100, Math.round((cleanSupplyKwh / Math.max(1, dailyDemandKwh)) * 100));
  const dailyEnergyJoulesMillion = Number((dailyDemandKwh * 3.6).toFixed(1));

  return {
    dailyDemandKwh,
    ledSavedKwh,
    cleanSupplyKwh,
    renewableSharePct,
    dailyEnergyJoulesMillion,
    meetsCleanTarget: renewableSharePct >= 75 && ledUpgradePct >= 60,
  };
}

export interface BudgetPlanResult {
  totalAllocated: number;
  remainingUnits: number;
  isBalanced: boolean;
  publicWelfareScore: number;
  equityNote: string;
}

/**
 * Economics Unit 4 (4.1 Role of Government, 4.3 Direct vs Indirect Taxes) simplified 100-unit municipal ledger.
 * Explicitly an educational model — NOT statutory Tamil Nadu municipal tax rates!
 */
export function evaluateTownBudget(
  waterSanitationUnits: number,
  cleanEnergyUnits: number,
  schoolsHealthUnits: number,
  directTaxSharePct: number,
): BudgetPlanResult {
  const totalAllocated = waterSanitationUnits + cleanEnergyUnits + schoolsHealthUnits;
  const remainingUnits = 100 - totalAllocated;
  const isBalanced = totalAllocated === 100 && waterSanitationUnits >= 25 && cleanEnergyUnits >= 25 && schoolsHealthUnits >= 25;

  // Balanced investment across all 3 essentials + progressive direct-tax contribution improves equity
  const balanceBonus = isBalanced ? 70 : Math.max(20, 60 - Math.abs(remainingUnits) * 2);
  const equityBonus = directTaxSharePct >= 50 ? 30 : 15;
  const publicWelfareScore = Math.min(100, balanceBonus + equityBonus);

  const equityNote =
    directTaxSharePct >= 55
      ? 'Progressive mix: Direct taxes follow ability-to-pay (Economics Unit 4, p. 324), reducing burden on low-income households.'
      : 'Indirect-heavy mix: Relies mostly on consumption taxes (GST/fees), which take a larger income share from lower-income families (regressive effect, p. 324).';

  return {
    totalAllocated,
    remainingUnits,
    isBalanced,
    publicWelfareScore,
    equityNote,
  };
}
