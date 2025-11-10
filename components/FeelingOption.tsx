import { BlurView } from 'expo-blur';
import { useEffect, useRef } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { MinimalIcon } from './MinimalIcon';

const colors = {
    // Use the exact cyan used by the onboarding progress bar
    cyan: '#38BDF8',
    text: '#0F172A',
    muted: '#6B7280',
    white: '#FFFFFF',
};

const radii = {
    full: 100,
};

const BLUR_INTENSITY = {
    option: Platform.select({ ios: 15, android: 10 }),
};

const shadow = (color = '#000', height = 8, radius = 16, opacity = 0.25) =>
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

interface FeelingOptionProps {
    id: string;
    label: string;
    icon: string;
    isSelected: boolean;
    onSelect: () => void;
}

export function FeelingOption({ id, label, icon, isSelected, onSelect }: FeelingOptionProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: isSelected ? 1.02 : 1,
            tension: 100,
            friction: 7,
            useNativeDriver: true,
        }).start();
    }, [isSelected]);

    const handlePressIn = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.97,
                tension: 100,
                friction: 3,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0.7,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handlePressOut = () => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: isSelected ? 1.02 : 1,
                tension: 100,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <Pressable
            onPress={onSelect}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ selected: isSelected }}
        >
            <Animated.View
                style={[
                    styles.optionShadow,
                    {
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim,
                    },
                ]}
            >
                <View
                    style={[
                        styles.optionContainer,
                        isSelected && styles.optionContainerSelected,
                    ]}
                >
                    <BlurView
                        intensity={BLUR_INTENSITY.option}
                        tint="light"
                        style={styles.optionBlur}
                    >
                        {/* Ícono minimalista con background circular */}
                        <View
                            style={[
                                styles.iconContainer,
                                isSelected && styles.iconContainerSelected,
                            ]}
                        >
                            <MinimalIcon 
                                type={id} 
                                size={24} 
                                color={isSelected ? colors.cyan : colors.muted}
                            />
                        </View>

                        {/* Texto */}
                        <Text
                            style={[
                                styles.optionText,
                                isSelected && styles.optionTextSelected,
                            ]}
                        >
                            {label}
                        </Text>
                    </BlurView>
                </View>
            </Animated.View>
        </Pressable>
    );
}

// Importar LinearGradient

const styles = StyleSheet.create({
    optionShadow: {
        ...shadow(colors.muted, 4, 8, 0.15),
    },
    optionContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(203, 213, 225, 0.5)',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        position: 'relative',
    },
    optionContainerSelected: {
        borderColor: 'transparent',
        // Translucent tint using the exact onboarding cyan so the hue matches the progress bar
        backgroundColor: 'rgba(56, 189, 248, 0.4)',
    },
    gradientBorder: {
        position: 'absolute',
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderRadius: 20,
        zIndex: -1,
    },
    gradientBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 18,
        overflow: 'hidden',
    },
    optionBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        backgroundColor: 'transparent',
        borderRadius: 20,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(241, 245, 249, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    iconContainerSelected: {
        backgroundColor: colors.white,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '400',
        color: colors.text,
        fontFamily: 'Inter',
    },
    optionTextSelected: {
        color: colors.text,
        fontWeight: '500',
    },
});
