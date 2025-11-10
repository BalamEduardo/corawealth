import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Tokens de diseño
const colors = {
    cyan: '#38BDF8',
    text: '#0F172A',
    muted: '#6B7280',
    white: '#FFFFFF',
};

const radii = {
    xl: 32,
    full: 100,
};

// Blur intensities por plataforma
const BLUR_INTENSITY = {
    card: Platform.select({ ios: 40, android: 20 }),
};

// Helper para sombras cross-platform
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

export default function CompletionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const userName = params.name || 'Usuario';

    // Animaciones
    const progressAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const buttonSlideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        // Animar barra de progreso a 100%
        Animated.timing(progressAnim, {
            toValue: 100,
            duration: 800,
            useNativeDriver: false,
        }).start();

        // Animar contenido
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();

        // Animar botón después de un delay
        setTimeout(() => {
            Animated.spring(buttonSlideAnim, {
                toValue: 0,
                tension: 80,
                friction: 8,
                useNativeDriver: true,
            }).start();
        }, 420);
    }, []);

    const handleGoToDashboard = () => {
        if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        // Navegar al dashboard principal
        console.log('Navegando al dashboard...');
        // router.replace('/(tabs)'); // Descomentar cuando exista el tab navigator
    };

    // SVG icons (small, inline) - kept local to this file for convenience
    const IconBulb = ({ size = 18, color = colors.cyan }: { size?: number; color?: string }) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path d="M9 21h6M12 3a6 6 0 0 1 4.472 10.024 3 3 0 0 1-.872 1.576L15 15H9l-.6-.4a3 3 0 0 1-.872-1.576A6 6 0 0 1 12 3z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M9 18h6" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
    );

    const IconChart = ({ size = 18, color = colors.cyan }: { size?: number; color?: string }) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Rect x="4" y="10" width="3" height="10" rx="0.5" fill={color} />
            <Rect x="10.5" y="6" width="3" height="14" rx="0.5" fill={color} />
            <Rect x="17" y="2" width="3" height="18" rx="0.5" fill={color} />
        </Svg>
    );

    const IconCloud = ({ size = 18, color = colors.cyan }: { size?: number; color?: string }) => (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            {/* Cloud icon - simple, rounded shape that conveys calm */}
            <Path d="M20 17.5a3.5 3.5 0 00-3.5-3.5h-1.1a5 5 0 00-9.4 0H6.5A2.5 2.5 0 004 19.5 2.5 2.5 0 006.5 22h11a3.5 3.5 0 003.5-4.5z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );

    return (
        <View style={styles.container}>
            {/* Fondo: plano blanco/gris (consistente con otras pantallas) */}
            <View style={[StyleSheet.absoluteFillObject, styles.pageBackground]} />

            {/* Barra de progreso completa */}
            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>4/4</Text>
                <View style={styles.progressBarBackground}>
                    <Animated.View 
                        style={[
                            styles.progressBarFill, 
                            {
                                width: progressAnim.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ['0%', '100%'],
                                })
                            }
                        ]} 
                    />
                </View>
            </View>

            {/* Contenido centrado */}
            <Animated.View 
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                    }
                ]}
            >
                {/* REDISEÑO COMPLETO DEL CONTENIDO */}

                {/* Título y mensaje principal */}
                <View style={styles.mainTextSection}>
                    <Text style={styles.mainTitle}>¡Perfecto, {userName}!</Text>
                    <Text style={styles.mainSubtitle}>Tu cuenta está lista y configurada</Text>
                </View>

                {/* Ilustración central */}
                <View style={styles.illustrationSection}>
                    <View style={styles.illustrationGlow}>
                        <LinearGradient
                            colors={['rgba(241, 245, 249, 0.95)', 'rgba(248, 250, 252, 0.7)']}
                            style={styles.glowGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        />
                    </View>
                    <Image
                        source={require('@/assets/images/Finalizacion.png')}
                        style={styles.mainIllustration}
                        resizeMode="contain"
                    />
                </View>

                {/* Cards de features en grid horizontal */}
                <View style={styles.featuresGrid}>
                    <View style={[styles.featureCard, shadow(colors.cyan, 4, 12, 0.08)]}>
                        <BlurView intensity={Platform.select({ ios: 30, android: 15 })} tint="light" style={styles.featureCardBlur}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                                style={styles.featureCardContent}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.featureIconCircle}>
                                    <IconBulb size={22} color={colors.cyan} />
                                </View>
                                <Text style={styles.featureCardText}>Claro</Text>
                            </LinearGradient>
                        </BlurView>
                    </View>

                    <View style={[styles.featureCard, shadow(colors.cyan, 4, 12, 0.08)]}>
                        <BlurView intensity={Platform.select({ ios: 30, android: 15 })} tint="light" style={styles.featureCardBlur}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                                style={styles.featureCardContent}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.featureIconCircle}>
                                    <IconChart size={22} color={colors.cyan} />
                                </View>
                                <Text style={styles.featureCardText}>Sencillo</Text>
                            </LinearGradient>
                        </BlurView>
                    </View>

                    <View style={[styles.featureCard, shadow(colors.cyan, 4, 12, 0.08)]}>
                        <BlurView intensity={Platform.select({ ios: 30, android: 15 })} tint="light" style={styles.featureCardBlur}>
                            <LinearGradient
                                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                                style={styles.featureCardContent}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.featureIconCircle}>
                                    <IconCloud size={22} color={colors.cyan} />
                                </View>
                                <Text style={styles.featureCardText}>Tranquilo</Text>
                            </LinearGradient>
                        </BlurView>
                    </View>
                </View>

                {/* Botón para ir al dashboard */}
                <Animated.View 
                    style={[
                        styles.buttonContainer,
                        {
                            transform: [{ translateY: buttonSlideAnim }]
                        }
                    ]}
                >
                    <View style={[styles.buttonShadow, shadow(colors.cyan, 6, 12, 0.2)]}>
                        <TouchableOpacity 
                            style={styles.dashboardButton}
                            onPress={handleGoToDashboard}
                            activeOpacity={0.9}
                            accessibilityRole="button"
                            accessibilityLabel="Ir a mi dashboard"
                        >
                            <LinearGradient
                                colors={[colors.cyan, '#0EA5E9']}
                                style={styles.buttonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.dashboardButtonText}>IR A MI DASHBOARD</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    progressContainer: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 0,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.cyan,
        fontFamily: 'Inter',
        marginBottom: 8,
        textAlign: 'center',
    },
    progressBarBackground: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(203, 213, 225, 0.4)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.cyan,
        borderRadius: 2,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Math.max(32, width * 0.08),
        paddingVertical: 40,
        gap: 24,
    },
    // Page background
    pageBackground: {
        backgroundColor: '#F8FAFC',
    },
    // Main Text Section
    mainTextSection: {
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
        paddingHorizontal: 16,
    },
    mainTitle: {
        fontSize: Math.min(32, width * 0.085),
        fontWeight: '800',
        color: colors.text,
        fontFamily: 'Inter',
        textAlign: 'center',
        lineHeight: Math.min(38, width * 0.1),
        letterSpacing: -0.5,
    },
    mainSubtitle: {
        fontSize: Math.min(17, width * 0.045),
        fontWeight: '500',
        color: colors.muted,
        fontFamily: 'Inter',
        textAlign: 'center',
        lineHeight: Math.min(24, width * 0.063),
    },
    // Illustration Section
    illustrationSection: {
        width: Math.min(width * 0.6, 260),
        height: Math.min(width * 0.6, 260),
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        marginVertical: 8,
    },
    illustrationGlow: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: Math.min(width * 0.6, 260),
    },
    glowGradient: {
        width: '100%',
        height: '100%',
        borderRadius: Math.min(width * 0.6, 260),
    },
    mainIllustration: {
        width: '85%',
        height: '85%',
        zIndex: 1,
    },
    // Features Grid
    featuresGrid: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: Math.max(10, width * 0.028),
        width: '100%',
        maxWidth: 400,
        paddingHorizontal: 12,
        marginTop: 4,
    },
    featureCard: {
        flex: 1,
        maxWidth: 115,
        minHeight: 100,
        aspectRatio: 1,
    },
    featureCardBlur: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        overflow: 'hidden',
    },
    featureCardContent: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(203, 213, 225, 0.3)',
    },
    featureIconCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(248, 250, 252, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(203, 213, 225, 0.25)',
    },
    featureCardText: {
        fontSize: Math.min(12, width * 0.04),
        fontWeight: '400',
        color: colors.text,
        fontFamily: 'Inter',
        textAlign: 'center',
    },
    // Botón
    buttonContainer: {
        width: '100%',
    },
    buttonShadow: {
        width: '100%',
    },
    dashboardButton: {
        borderRadius: radii.full,
        overflow: 'hidden',
    },
    buttonGradient: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dashboardButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.white,
        fontFamily: 'Inter',
        letterSpacing: 0.5,
    },
    // Small right arrow in button
    buttonArrow: {
        marginLeft: 10,
        fontSize: 16,
        color: colors.white,
    },
});
