import * as THREE from 'three';
import { TimeOfDay } from '../types';

export interface TimeOfDayProfile {
  id: TimeOfDay;
  label: string;
  sublabel: string;
  icon: string;
  // 3D Three.js Lighting System Config
  lighting: {
    ambientColor: string;
    ambientIntensity: number;
    sunColor: string;
    sunIntensity: number;
    sunPosition: [number, number, number];
    skyRimColor: string;
    groundBounceColor: string;
    hemisphereIntensity: number;
    coreColor: string;
  };
  // Ambient Aurora Background Atmosphere Config
  atmosphere: {
    auroraCurtain1: string;
    auroraCurtain2: string;
    auroraRibbon3: string;
    polarGlow: string;
    skyGrad: string;
    baseBg: string;
    vignette: string;
    colorGradeTint: string;
    auroraHues: number[];
    particleAlpha: number;
  };
}

export const TIME_OF_DAY_PROFILES: Record<Exclude<TimeOfDay, 'auto'>, TimeOfDayProfile> = {
  sunrise: {
    id: 'sunrise',
    label: 'Sunrise',
    sublabel: 'Golden Dawn Aurora',
    icon: 'Sunrise',
    lighting: {
      ambientColor: '#fed7aa', // Warm peach amber
      ambientIntensity: 1.45,
      sunColor: '#fb923c', // Warm rising sun orange
      sunIntensity: 1.25,
      sunPosition: [24, 6, 18], // Low rising horizon angle
      skyRimColor: '#f472b6', // Rose quartz dawn rim
      groundBounceColor: '#431407', // Deep warm earth bounce
      hemisphereIntensity: 0.85,
      coreColor: '#fb923c',
    },
    atmosphere: {
      auroraCurtain1: 'linear-gradient(135deg, rgba(251,146,60,0.36) 0%, rgba(244,114,182,0.28) 45%, rgba(0,0,0,0) 80%)',
      auroraCurtain2: 'linear-gradient(225deg, rgba(253,186,116,0.30) 0%, rgba(232,121,249,0.22) 55%, rgba(0,0,0,0) 85%)',
      auroraRibbon3: 'linear-gradient(90deg, rgba(251,146,60,0.25) 0%, rgba(244,63,94,0.30) 50%, rgba(254,215,170,0.25) 100%)',
      polarGlow: 'rgba(251, 146, 60, 0.35)',
      skyGrad: 'from-[#140a10] via-[#1f101c] to-[#0d0714]',
      baseBg: '#0e0812',
      vignette: 'rgba(10, 4, 8, 0.65)',
      colorGradeTint: 'rgba(251, 146, 60, 0.06)',
      auroraHues: [25, 40, 335, 350, 15],
      particleAlpha: 0.48,
    },
  },
  noon: {
    id: 'noon',
    label: 'Noon',
    sublabel: 'Arctic Zenith Sun',
    icon: 'Sun',
    lighting: {
      ambientColor: '#e0f2fe', // Crisp arctic cyan-white
      ambientIntensity: 1.65,
      sunColor: '#ffffff', // High overhead noon daylight
      sunIntensity: 1.5,
      sunPosition: [0, 32, 14], // Overhead zenith angle
      skyRimColor: '#38bdf8', // Pure sky cyan rim
      groundBounceColor: '#0c4a6e', // Deep glacial reflection
      hemisphereIntensity: 1.0,
      coreColor: '#38bdf8',
    },
    atmosphere: {
      auroraCurtain1: 'linear-gradient(135deg, rgba(56,189,248,0.35) 0%, rgba(14,165,233,0.28) 45%, rgba(0,0,0,0) 80%)',
      auroraCurtain2: 'linear-gradient(225deg, rgba(125,211,252,0.28) 0%, rgba(6,182,212,0.24) 55%, rgba(0,0,0,0) 85%)',
      auroraRibbon3: 'linear-gradient(90deg, rgba(56,189,248,0.25) 0%, rgba(165,243,252,0.32) 50%, rgba(14,165,233,0.25) 100%)',
      polarGlow: 'rgba(56, 189, 248, 0.38)',
      skyGrad: 'from-[#040e1a] via-[#081b2e] to-[#030914]',
      baseBg: '#030b14',
      vignette: 'rgba(2, 6, 12, 0.65)',
      colorGradeTint: 'rgba(56, 189, 248, 0.05)',
      auroraHues: [190, 205, 175, 215, 180],
      particleAlpha: 0.55,
    },
  },
  sunset: {
    id: 'sunset',
    label: 'Sunset',
    sublabel: 'Dusk Magenta Borealis',
    icon: 'Sunset',
    lighting: {
      ambientColor: '#fbcfe8', // Twilight rose
      ambientIntensity: 1.4,
      sunColor: '#f43f5e', // Fiery setting sun
      sunIntensity: 1.35,
      sunPosition: [-24, 4, 16], // Setting western horizon
      skyRimColor: '#c084fc', // Polar violet twilight
      groundBounceColor: '#3b0764', // Deep purple ground shadow
      hemisphereIntensity: 0.9,
      coreColor: '#e11d48',
    },
    atmosphere: {
      auroraCurtain1: 'linear-gradient(135deg, rgba(244,63,94,0.38) 0%, rgba(168,85,247,0.30) 45%, rgba(0,0,0,0) 80%)',
      auroraCurtain2: 'linear-gradient(225deg, rgba(251,113,133,0.32) 0%, rgba(217,70,239,0.25) 55%, rgba(0,0,0,0) 85%)',
      auroraRibbon3: 'linear-gradient(90deg, rgba(244,63,94,0.28) 0%, rgba(192,132,252,0.34) 50%, rgba(225,29,72,0.26) 100%)',
      polarGlow: 'rgba(244, 63, 94, 0.38)',
      skyGrad: 'from-[#170510] via-[#22071d] to-[#0c0314]',
      baseBg: '#100311',
      vignette: 'rgba(10, 2, 8, 0.72)',
      colorGradeTint: 'rgba(244, 63, 94, 0.07)',
      auroraHues: [335, 350, 280, 310, 15],
      particleAlpha: 0.52,
    },
  },
  night: {
    id: 'night',
    label: 'Polar Night',
    sublabel: 'Emerald Northern Lights',
    icon: 'Moon',
    lighting: {
      ambientColor: '#a7f3d0', // Ethereal emerald green
      ambientIntensity: 1.25,
      sunColor: '#10b981', // Aurora ion glow
      sunIntensity: 0.95,
      sunPosition: [0, 18, 22], // Ambient frontal polar curtain
      skyRimColor: '#06b6d4', // Arctic cyan rim
      groundBounceColor: '#022c22', // Deep forest polar shadow
      hemisphereIntensity: 0.75,
      coreColor: '#10b981',
    },
    atmosphere: {
      auroraCurtain1: 'linear-gradient(145deg, rgba(16,185,129,0.40) 0%, rgba(6,182,212,0.28) 45%, rgba(0,0,0,0) 80%)',
      auroraCurtain2: 'linear-gradient(215deg, rgba(5,150,105,0.32) 0%, rgba(14,165,233,0.24) 55%, rgba(0,0,0,0) 85%)',
      auroraRibbon3: 'linear-gradient(90deg, rgba(16,185,129,0.28) 0%, rgba(52,211,153,0.35) 40%, rgba(6,182,212,0.30) 100%)',
      polarGlow: 'rgba(16, 185, 129, 0.35)',
      skyGrad: 'from-[#02090e] via-[#031417] to-[#010906]',
      baseBg: '#02070a',
      vignette: 'rgba(1, 4, 6, 0.75)',
      colorGradeTint: 'rgba(16, 185, 129, 0.05)',
      auroraHues: [145, 165, 180, 195, 130],
      particleAlpha: 0.45,
    },
  },
};

/**
 * Calculates current active or interpolated TimeOfDay profile.
 * Supports continuous auto-cycling over 60 seconds or discrete manual selection.
 */
export function getActiveTimeOfDayProfile(
  timeOfDay: TimeOfDay,
  autoProgress: number = 0 // 0.0 to 1.0 (continuous day/night cycle)
): TimeOfDayProfile {
  if (timeOfDay !== 'auto') {
    return TIME_OF_DAY_PROFILES[timeOfDay];
  }

  // Auto mode cycles: sunrise (0.00-0.25) -> noon (0.25-0.50) -> sunset (0.50-0.75) -> night (0.75-1.0)
  const norm = ((autoProgress % 1) + 1) % 1;
  if (norm < 0.25) return TIME_OF_DAY_PROFILES.sunrise;
  if (norm < 0.50) return TIME_OF_DAY_PROFILES.noon;
  if (norm < 0.75) return TIME_OF_DAY_PROFILES.sunset;
  return TIME_OF_DAY_PROFILES.night;
}
