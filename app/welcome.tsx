import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

// Tokens de diseño
const colors = {
    primary: '#3B82F6',
    cyan: '#38BDF8',
    text: '#0F172A',
    muted: '#6B7280',
    white: '#FFFFFF',
};

const radii = {
    xl: 32,
    full: 100,
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

export default function WelcomeScreen() {
    const router = useRouter();

    // Animación de respiración suave para el botón
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Efecto de respiración suave (pulso sutil constante)
    useEffect(() => {
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.02,
                    duration: 2000,
                    useNativeDriver: true,
                    easing: (t) => Math.sin(t * Math.PI), // Easing sinusoidal
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                    easing: (t) => Math.sin(t * Math.PI),
                }),
            ])
        );
        pulseAnimation.start();
        
        return () => pulseAnimation.stop();
    }, []);
   
    return (
        <View style={styles.container}>
            {/* Fondo blanco limpio */}
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#FFFFFF' }]} />

            {/* 25% superior - Logo/Branding */}
            <View style={styles.logoSection}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('@/assets/images/LogoN.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <View style={styles.brandTextContainer}>
                        <Text style={styles.brandText}>CORA</Text>
                        <Text style={styles.brandText}>WEALTH</Text>
                    </View>
                </View>
            </View>

            {/* 50% medio - Mensaje principal */}
            <View style={styles.messageSection}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>
                        <Text style={styles.titleRegular}>Claridad financiera.</Text>
                        {'\n'}
                        <Text style={styles.titleHighlight}>Calma total.</Text>
                    </Text>
                </View>

                <View style={styles.featuresContainer}>
                    <View style={styles.featureRow}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>Define tus metas con claridad</Text>
                    </View>
                    <View style={styles.featureRow}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>Comprende tus hábitos</Text>
                    </View>
                    <View style={styles.featureRow}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>Toma el control de tu futuro</Text>
                    </View>
                </View>
            </View>

            {/* 25% inferior - CTA + Link */}
            <View style={styles.ctaSection}>
                {/* Botón principal con respiración suave */}
                <Pressable 
                    style={styles.startButtonWrapper}
                    onPress={() => router.push('/auth')}
                    accessibilityRole="button"
                    accessibilityLabel="Comenzar"
                    android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
                >
                    <Animated.View style={[
                        styles.startButtonShadow,
                        { 
                            transform: [{ scale: pulseAnim }]
                        }
                    ]}>
                        <View style={styles.startButton}>
                            <Text style={styles.startButtonText}>Comenzar</Text>
                        </View>
                    </Animated.View>
                </Pressable>

                {/* Link secundario */}
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                    <Pressable onPress={() => router.push('/login')} accessibilityRole="button">
                        <Text style={styles.loginLink}>Inicia sesión</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // 25% superior - Logo/Branding
    logoSection: {
        height: height * 0.25   ,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0,
    },
    logo: {
        width: 120,
        height: 120,
    },
    brandTextContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: -16,
    },
    brandText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#0F172A',
        fontFamily: 'Inter',
        letterSpacing: 1,
        lineHeight: 32,
    },
    // 50% medio - Mensaje principal
    messageSection: {
        height: height * 0.50,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 36,
    },
    titleText: {
        textAlign: 'center',
    },
    titleRegular: {
        fontSize: 38,
        fontWeight: '600',
        color: colors.text,
        fontFamily: 'Inter',
        lineHeight: 48,
        letterSpacing: -0.5,
    },
    titleHighlight: {
        fontSize: 38,
        fontWeight: '800',
        color: colors.cyan,
        fontFamily: 'Inter',
        lineHeight: 48,
        letterSpacing: -0.5,
    },
    featuresContainer: {
        alignItems: 'flex-start',
        gap: 16,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.cyan,
    },
    featureText: {
        fontSize: 15,
        color: colors.muted,
        fontFamily: 'Inter',
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    // 25% inferior - CTA + Link
    ctaSection: {
        height: height * 0.25,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingBottom: 40,
    },
    startButtonWrapper: {
        width: '80%',
        marginBottom: 20,
    },
    startButtonShadow: {
        ...shadow(colors.cyan, 6, 8, 0.25),
    },
    startButton: {
        backgroundColor: colors.cyan,
        borderRadius: radii.full,
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        shadowColor: colors.cyan,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    startButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.white,
        letterSpacing: 0.5,
        fontFamily: 'Inter',
        zIndex: 1,
    },
    loginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    loginText: {
        fontSize: 13,
        color: colors.muted,
        fontFamily: 'Inter',
    },
    loginLink: {
        fontSize: 13,
        color: colors.cyan,
        fontFamily: 'Inter',
        fontWeight: '600',
    },
   
   
});
