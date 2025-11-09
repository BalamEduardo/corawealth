import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

interface IconProps {
    type: string;
    size?: number;
    color?: string;
}

export function MinimalIcon({ type, size = 24, color = '#38BDF8' }: IconProps) {
    const iconMap: { [key: string]: React.ReactElement } = {
        // Abrumado - Círculo con ondas
        overwhelmed: (
            <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill="none" />
                <Path
                    d="M8 10 Q12 8, 16 10"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                />
                <Path
                    d="M8 14 Q12 16, 16 14"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    fill="none"
                />
            </Svg>
        ),
        // Curioso - Círculo con punto
        curious: (
            <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill="none" />
                <Circle cx="12" cy="12" r="3" fill={color} />
            </Svg>
        ),
        // Optimista - Diamante
        optimistic: (
            <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <Path
                    d="M12 3 L21 12 L12 21 L3 12 Z"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    fill="none"
                />
                <Path
                    d="M12 8 L16 12 L12 16 L8 12 Z"
                    fill={color}
                    opacity="0.3"
                />
            </Svg>
        ),
        // Inseguro - Rombo suave
        insecure: (
            <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <Path
                    d="M12 4 L19 12 L12 20 L5 12 Z"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </Svg>
        ),
        // Entender - Círculo con líneas
        understand: (
            <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill="none" />
                <Path d="M12 7 L12 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
                <Path d="M9 12 L15 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            </Svg>
        ),
        // Emergencia - Círculo protector
        emergency: (
            <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" fill="none" />
                <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.5" fill="none" />
            </Svg>
        ),
        // Ahorrar - Diamante con centro
        save: (
            <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <Path
                    d="M12 3 L21 12 L12 21 L3 12 Z"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    fill="none"
                />
                <Circle cx="12" cy="12" r="2.5" fill={color} />
            </Svg>
        ),
        // Organizar - Cuadrado con esquinas redondeadas
        organize: (
            <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
                <Path
                    d="M12 4 L19 12 L12 20 L5 12 Z"
                    stroke={color}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
                <Path d="M9 12 L15 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            </Svg>
        ),
    };

    return (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            {iconMap[type] || iconMap.curious}
        </View>
    );
}
