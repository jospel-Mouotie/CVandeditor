import React from 'react';

export interface BackgroundConfig {
  backgroundType?: 'solid' | 'gradient' | 'pattern' | 'image';
  colorSolid?: string;
  opacity?: number;
  colorStart?: string;
  colorEnd?: string;
  patternName?: string;
  imageUrl?: string;
  fallbackColor?: string;
}

/**
 * Converts a hex color string and alpha opacity (0 to 1 or 0 to 100) into an rgba string.
 */
export function hexToRgba(hex?: string, alpha: number = 1): string {
  if (!hex) return `rgba(255, 255, 255, ${alpha})`;
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(255, 255, 255, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Returns React.CSSProperties for solid color, gradient, pattern, or image backgrounds.
 */
export function getBackgroundStyle(config: BackgroundConfig): React.CSSProperties {
  const type = config.backgroundType || 'solid';
  const solidColor = config.colorSolid || config.fallbackColor || '#FFFFFF';

  // Normalize opacity to range 0..1
  let op = config.opacity ?? 1;
  if (op > 1) op = op / 100;
  if (op < 0) op = 0;
  if (op > 1) op = 1;

  const solidRgba = hexToRgba(solidColor, op);

  if (type === 'gradient') {
    const startRgba = hexToRgba(config.colorStart || '#3B82F6', op);
    const endRgba = hexToRgba(config.colorEnd || '#1E3A8A', op);
    return {
      backgroundImage: `linear-gradient(135deg, ${startRgba}, ${endRgba})`,
      backgroundColor: 'transparent'
    };
  }

  if (type === 'pattern') {
    const pattern = config.patternName || 'dots';
    let svgPattern = '';
    const strokeColor = encodeURIComponent(hexToRgba('#000000', Math.min(0.2, op * 0.25)));

    if (pattern === 'dots') {
      svgPattern = `data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='3' cy='3' r='1.5' fill='${strokeColor}'/%3E%3C/svg%3E`;
    } else if (pattern === 'stripes' || pattern === 'lines') {
      svgPattern = `data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='16' x2='16' y2='0' stroke='${strokeColor}' stroke-width='1.5'/%3E%3C/svg%3E`;
    } else if (pattern === 'grid') {
      svgPattern = `data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 16 0 L 0 0 0 16' fill='none' stroke='${strokeColor}' stroke-width='1'/%3E%3C/svg%3E`;
    } else if (pattern === 'waves') {
      svgPattern = `data:image/svg+xml,%3Csvg width='32' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 0 8 Q 8 0, 16 8 T 32 8' fill='none' stroke='${strokeColor}' stroke-width='1.5'/%3E%3C/svg%3E`;
    } else {
      // mesh
      svgPattern = `data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='8,0 16,8 8,16 0,8' fill='none' stroke='${strokeColor}' stroke-width='1'/%3E%3C/svg%3E`;
    }

    return {
      backgroundColor: solidRgba,
      backgroundImage: `url("${svgPattern}")`,
      backgroundRepeat: 'repeat'
    };
  }

  if (type === 'image' && config.imageUrl) {
    return {
      backgroundImage: `url("${config.imageUrl}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: solidRgba
    };
  }

  // Solid color default
  return {
    backgroundColor: solidRgba
  };
}
