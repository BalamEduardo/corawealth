import { Platform } from 'react-native';

// Colores del sistema
export const colors = {
    primary: '#3B82F6',
    cyan: '#38BDF8',
    text: '#0F172A',
    muted: '#6B7280',
    error: '#EF4444',
    white: '#FFFFFF',
    background: '#F8F9FA',
} as const;

// Radios de bordes
export const radii = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 32,
    full: 100,
} as const;

// Intensidades de blur por plataforma
export const blurIntensity = {
    card: Platform.select({ ios: 40, android: 20 }) as number,
    button: Platform.select({ ios: 20, android: 15 }) as number,
    input: Platform.select({ ios: 15, android: 10 }) as number,
} as const;

// Helper para sombras cross-platform
export const shadow = (
    color: string = '#000',
    height: number = 8,
    radius: number = 16,
    opacity: number = 0.25
) =>
    Platform.select({
        ios: {
            shadowColor: color,
            shadowOffset: { width: 0, height },
            shadowOpacity: opacity,
            shadowRadius: radius,
        },
        android: {
            elevation: Math.max(4, height / 2),
        },
    });

// Espaciado consistente
export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
} as const;

// Tipografía
export const typography = {
    fontFamily: 'Inter',
    fontSize: {
        xs: 12,
        sm: 13,
        base: 14,
        md: 15,
        lg: 16,
        xl: 18,
        xxl: 20,
        xxxl: 24,
        huge: 28,
    },
    fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
} as const;

export const theme = {
    colors,
    radii,
    blurIntensity,
    shadow,
    spacing,
    typography,
} as const;

export default theme;
