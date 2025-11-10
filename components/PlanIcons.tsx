import Svg, { Circle, Line, Path } from 'react-native-svg';

interface IconProps {
    size?: number;
    color?: string;
}

export const IncomeIcon = ({ size = 24, color = '#38BDF8' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Moneda con flecha hacia arriba */}
        <Circle cx="12" cy="13" r="8" stroke={color} strokeWidth="1.5" fill="none" />
        <Path 
            d="M12 9 L12 17 M9 14 L12 17 L15 14" 
            stroke={color} 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
        <Circle cx="12" cy="5" r="1.5" fill={color} />
    </Svg>
);

export const SavingIcon = ({ size = 24, color = '#38BDF8' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Alcancía minimalista con moneda */}
        <Path 
            d="M4 13 C4 10 6 8 9 8 L15 8 C18 8 20 10 20 13 L20 16 C20 18 18 20 15 20 L9 20 C6 20 4 18 4 16 Z" 
            stroke={color} 
            strokeWidth="1.5" 
            strokeLinecap="round"
            fill="none"
        />
        <Circle cx="12" cy="6" r="2" stroke={color} strokeWidth="1.5" fill="none" />
        <Line x1="12" y1="8" x2="12" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <Circle cx="15" cy="14" r="1" fill={color} />
    </Svg>
);

export const FrequencyIcon = ({ size = 16, color = '#6B7280' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        {/* Reloj minimalista */}
        <Circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.2" fill="none" />
        <Path 
            d="M8 5 L8 8 L10.5 10" 
            stroke={color} 
            strokeWidth="1.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
    </Svg>
);

export const CurrencyIcon = ({ size = 20, color = '#38BDF8' }: IconProps) => (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        {/* Símbolo $ delgado y minimalista */}
        <Path 
            d="M10 3 L10 17" 
            stroke={color} 
            strokeWidth="1.5" 
            strokeLinecap="round"
        />
        <Path 
            d="M13 6 C13 4.5 11.5 4 10 4 C8.5 4 7 4.5 7 6 C7 7.5 8.5 8 10 8 C11.5 8 13 8.5 13 10 C13 11.5 11.5 12 10 12 C8.5 12 7 11.5 7 10" 
            stroke={color} 
            strokeWidth="1.5" 
            strokeLinecap="round"
            fill="none"
        />
    </Svg>
);
