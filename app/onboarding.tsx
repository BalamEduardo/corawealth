import { FeelingOption as FeelingOptionComponent } from '@/components/FeelingOption';
import { FeelingOption, feelings } from '@/data/onboarding';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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

export default function OnboardingScreen() {
    const router = useRouter();
    const [selectedFeeling, setSelectedFeeling] = useState<FeelingOption | null>(null);
    const currentStep = 1;
    const totalSteps = 4;

    // Animaciones
    const buttonFadeAnim = useRef(new Animated.Value(0)).current;
    const buttonSlideAnim = useRef(new Animated.Value(30)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    // Animar la barra de progreso
    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: (currentStep / totalSteps) * 100,
            duration: 600,
            useNativeDriver: false,
        }).start();
    }, [currentStep]);

    // Animar botón cuando se selecciona una opción
    useEffect(() => {
        if (selectedFeeling) {
            Animated.parallel([
                Animated.timing(buttonFadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(buttonSlideAnim, {
                    toValue: 0,
                    tension: 80,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(buttonFadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(buttonSlideAnim, {
                    toValue: 30,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [selectedFeeling]);

    const handleSelectFeeling = (feelingId: FeelingOption | null) => {
        // Haptic feedback
        if (Platform.OS === 'ios') {
            Haptics.selectionAsync();
        }
        setSelectedFeeling(feelingId);
    };

    const handleContinue = () => {
        if (selectedFeeling) {
            if (Platform.OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            console.log('Feeling selected:', selectedFeeling);
            router.push('/onboarding-step2');
        }
    };

    return (
        <View style={styles.container}>
            {/* Gradiente de fondo */}
            <LinearGradient
                colors={['#FFFFFF', '#FFFFFF', '#F4F7F9']}
                locations={[0, 0.65, 1]}
                style={StyleSheet.absoluteFillObject}
            />

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Progress Bar Animada */}
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>Paso {currentStep} de {totalSteps}</Text>
                    <View style={styles.progressBarBackground}>
                        <Animated.View 
                            style={[
                                styles.progressBarFill,
                                {
                                    width: progressAnim.interpolate({
                                        inputRange: [0, 100],
                                        outputRange: ['0%', '100%'],
                                    }),
                                },
                            ]} 
                        />
                    </View>
                </View>

                {/* Tarjeta principal con efecto glass */}
                <View style={styles.glassCardWrapper}>
                    <View style={styles.glassCardShadow}>
                        <View style={styles.glassCardContainer}>
                            <BlurView intensity={BLUR_INTENSITY.card} tint="light" style={styles.glassCard}>
                                {/* Pregunta principal */}
                                <View style={styles.questionSection}>
                                    <Text style={styles.question}>
                                        Antes de los números, ¿cómo te sientes con tu dinero hoy?
                                    </Text>
                                    <Text style={styles.subtitle}>
                                        Está bien sentirse así. Reconocerlo es el primer paso para ganar claridad.
                                    </Text>
                                </View>

                                {/* Opciones de selección - Glassmorphism Cards con animaciones */}
                                <View style={styles.optionsSection}>
                                    {feelings.map((feeling) => (
                                        <FeelingOptionComponent
                                            key={feeling.id}
                                            id={feeling.id}
                                            label={feeling.label}
                                            icon={feeling.icon}
                                            isSelected={selectedFeeling === feeling.id}
                                            onSelect={() => handleSelectFeeling(feeling.id as FeelingOption)}
                                        />
                                    ))}
                                </View>

                                {/* Botón continuar con animación */}
                                {selectedFeeling && (
                                    <Animated.View
                                        style={[
                                            styles.continueButtonWrapper,
                                            {
                                                opacity: buttonFadeAnim,
                                                transform: [{ translateY: buttonSlideAnim }],
                                            },
                                        ]}
                                    >
                                        <Pressable 
                                            onPress={handleContinue}
                                            accessibilityRole="button"
                                            accessibilityLabel="Continuar"
                                        >
                                            <View style={styles.continueButtonShadow}>
                                                <View style={styles.continueButton}>
                                                    <Text style={styles.continueButtonText}>Continuar</Text>
                                                </View>
                                            </View>
                                        </Pressable>
                                    </Animated.View>
                                )}
                            </BlurView>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        paddingBottom: 40,
    },
    // Progress Bar
    progressContainer: {
        marginBottom: 24,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.cyan,
        textAlign: 'center',
        fontFamily: 'Inter',
        marginBottom: 12,
    },
    progressBarBackground: {
        width: '100%',
        height: 4,
        backgroundColor: 'rgba(56, 189, 248, 0.2)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.cyan,
        borderRadius: 2,
    },
    // Tarjeta principal con efecto glass
    glassCardWrapper: {
        width: '100%',
    },
    glassCardShadow: {
        ...shadow(colors.muted, 8, 16, 0.25),
    },
    glassCardContainer: {
        borderRadius: radii.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    glassCard: {
        padding: 32,
        backgroundColor: 'transparent',
        borderRadius: radii.xl,
    },
    // Pregunta
    questionSection: {
        marginBottom: 32,
    },
    question: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.text,
        fontFamily: 'Inter',
        lineHeight: 32,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: colors.cyan,
        fontFamily: 'Inter',
        lineHeight: 20,
        letterSpacing: 0.2,
    },
    // Opciones
    optionsSection: {
        gap: 14,
        marginBottom: 24,
    },
    // Botón continuar
    continueButtonWrapper: {
        width: '100%',
        marginTop: 8,
    },
    continueButtonShadow: {
        ...shadow(colors.cyan, 6, 8, 0.25),
    },
    continueButton: {
        backgroundColor: colors.cyan,
        borderRadius: radii.full,
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.white,
        letterSpacing: 0.5,
        fontFamily: 'Inter',
    },
});
