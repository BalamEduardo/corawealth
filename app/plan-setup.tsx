import { CurrencyIcon, FrequencyIcon, IncomeIcon, SavingIcon } from '@/components/PlanIcons';
import { Picker } from '@react-native-picker/picker';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const colors = {
    cyan: '#38BDF8',
    primary: '#3B82F6',
    text: '#0F172A',
    muted: '#6B7280',
    white: '#FFFFFF',
};

const BLUR_INTENSITY = {
    card: Platform.select({ ios: 40, android: 20 }),
    option: Platform.select({ ios: 15, android: 10 }),
};

type Frequency = 'weekly' | 'biweekly' | 'monthly' | null;

const frequencies = [
    { id: 'weekly', label: 'Semanal' },
    { id: 'biweekly', label: 'Quincenal' },
    { id: 'monthly', label: 'Mensual' },
];

export default function PlanSetupScreen() {
    const router = useRouter();
    const [income, setIncome] = useState<number | null>(null);
    const [incomeFrequency, setIncomeFrequency] = useState<Frequency>(null);
    const [savingGoal, setSavingGoal] = useState<number | null>(null);
    const [savingFrequency, setSavingFrequency] = useState<Frequency>(null);
    
    // Estados para modales del picker en iOS
    const [showIncomeFrequencyModal, setShowIncomeFrequencyModal] = useState(false);
    const [showSavingFrequencyModal, setShowSavingFrequencyModal] = useState(false);
    
    const currentStep = 3;
    const totalSteps = 4;

    // Animaciones
    const progressAnim = useRef(new Animated.Value(0)).current;
    const buttonFadeAnim = useRef(new Animated.Value(0)).current;
    const buttonSlideAnim = useRef(new Animated.Value(30)).current;

    const nf = new Intl.NumberFormat('es-MX');

    const isFormValid = 
        income !== null && income > 0 &&
        incomeFrequency !== null &&
        savingGoal !== null && savingGoal > 0 &&
        savingFrequency !== null;

    // Animar progress bar
    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: (currentStep / totalSteps) * 100,
            duration: 600,
            useNativeDriver: false,
        }).start();
    }, [currentStep, totalSteps]);

    // Animar botón cuando el form es válido
    useEffect(() => {
        if (isFormValid) {
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
    }, [isFormValid]);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    const parseNumber = (text: string): number | null => {
        const onlyDigits = text.replace(/[^\d]/g, '');
        return onlyDigits ? Number(onlyDigits) : null;
    };

    const handleIncomeChange = (text: string) => {
        setIncome(parseNumber(text));
    };

    const handleSavingChange = (text: string) => {
        setSavingGoal(parseNumber(text));
    };

    const handleContinue = () => {
        if (isFormValid) {
            if (Platform.OS === 'ios') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            console.log('Plan data:', { income, incomeFrequency, savingGoal, savingFrequency });
            router.push('/completion');
        }
    };

    return (
        <View style={styles.container}>
            {/* Fondo con gradiente - igual que onboarding */}
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
                {/* Progress Bar - igual que onboarding */}
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>Paso {currentStep} de {totalSteps}</Text>
                    <View style={styles.progressBarBackground}>
                        <Animated.View 
                            style={[
                                styles.progressBarFill,
                                { width: progressWidth }
                            ]} 
                        />
                    </View>
                </View>

                {/* Tarjeta principal con efecto glass */}
                <View style={styles.glassCardWrapper}>
                    <View style={styles.glassCardShadow}>
                        <View style={styles.glassCardContainer}>
                            <BlurView intensity={BLUR_INTENSITY.card} tint="light" style={styles.glassCard}>
                                {/* Título principal */}
                                <View style={styles.questionSection}>
                                    <Text style={styles.question}>¡Perfecto!</Text>
                                    <Text style={styles.question}>Creemos tu plan de calma.</Text>
                                    <Text style={styles.subtitle}>
                                        Estos datos nos ayudarán a mostrarte tu disponible y crear tu árbol de bienestar personalizado.
                                    </Text>
                                </View>

                                {/* Sección: Ingresos */}
                                <View style={styles.inputSection}>
                                    <View style={styles.inputHeader}>
                                        <View style={styles.iconBadge}>
                                            <IncomeIcon size={24} color={colors.cyan} />
                                        </View>
                                        <Text style={styles.inputLabel}>Tus ingresos aproximados</Text>
                                    </View>
                                    
                                    {/* Input de monto */}
                                    <View style={styles.inputWrapper}>
                                        <View style={styles.currencyIconWrapper}>
                                            <CurrencyIcon size={18} color={colors.cyan} />
                                        </View>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="0"
                                            placeholderTextColor="rgba(107, 114, 128, 0.5)"
                                            value={income === null ? '' : nf.format(income)}
                                            onChangeText={handleIncomeChange}
                                            keyboardType="number-pad"
                                            returnKeyType="done"
                                        />
                                        <Text style={styles.currencyLabel}>MXN</Text>
                                    </View>

                                    {/* Selector de frecuencia */}
                                    <View style={styles.frequencyContainer}>
                                        <View style={styles.frequencyHeader}>
                                            <FrequencyIcon size={16} color={colors.muted} />
                                            <Text style={styles.frequencyLabel}>Frecuencia</Text>
                                        </View>
                                        {Platform.OS === 'ios' ? (
                                            <>
                                                <TouchableOpacity 
                                                    style={styles.pickerButton}
                                                    onPress={() => {
                                                        Haptics.selectionAsync();
                                                        setShowIncomeFrequencyModal(true);
                                                    }}
                                                >
                                                    <Text style={styles.pickerButtonText}>
                                                        {frequencies.find(f => f.id === incomeFrequency)?.label || 'Seleccionar'}
                                                    </Text>
                                                    <Text style={styles.pickerArrow}>▼</Text>
                                                </TouchableOpacity>
                                                
                                                <Modal
                                                    visible={showIncomeFrequencyModal}
                                                    transparent={true}
                                                    animationType="fade"
                                                >
                                                    <View style={styles.modalOverlay}>
                                                        <View style={styles.modalContent}>
                                                            <View style={styles.modalHeader}>
                                                                <Text style={styles.modalTitle}>Selecciona frecuencia</Text>
                                                            </View>
                                                            <Picker
                                                                selectedValue={incomeFrequency}
                                                                onValueChange={(itemValue) => {
                                                                    Haptics.selectionAsync();
                                                                    setIncomeFrequency(itemValue);
                                                                }}
                                                                style={styles.modalPicker}
                                                                itemStyle={styles.modalPickerItem}
                                                            >
                                                                {frequencies.map((freq) => (
                                                                    <Picker.Item key={freq.id} label={freq.label} value={freq.id} />
                                                                ))}
                                                            </Picker>
                                                            <TouchableOpacity
                                                                style={styles.modalButton}
                                                                onPress={() => {
                                                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                                                    setShowIncomeFrequencyModal(false);
                                                                }}
                                                            >
                                                                <Text style={styles.modalButtonText}>OK</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </Modal>
                                            </>
                                        ) : (
                                            <View style={styles.pickerWrapper}>
                                                <Picker
                                                    selectedValue={incomeFrequency}
                                                    onValueChange={(itemValue) => {
                                                        setIncomeFrequency(itemValue);
                                                    }}
                                                    style={styles.picker}
                                                >
                                                    {frequencies.map((freq) => (
                                                        <Picker.Item key={freq.id} label={freq.label} value={freq.id} />
                                                    ))}
                                                </Picker>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* Separador */}
                                <View style={styles.separator} />

                                {/* Sección: Meta de Ahorro */}
                                <View style={styles.inputSection}>
                                    <View style={styles.inputHeader}>
                                        <View style={styles.iconBadge}>
                                            <SavingIcon size={24} color={colors.cyan} />
                                        </View>
                                        <Text style={styles.inputLabel}>Tu meta de ahorro inicial</Text>
                                    </View>
                                    
                                    {/* Input de monto */}
                                    <View style={styles.inputWrapper}>
                                        <View style={styles.currencyIconWrapper}>
                                            <CurrencyIcon size={18} color={colors.cyan} />
                                        </View>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="0"
                                            placeholderTextColor="rgba(107, 114, 128, 0.5)"
                                            value={savingGoal === null ? '' : nf.format(savingGoal)}
                                            onChangeText={handleSavingChange}
                                            keyboardType="number-pad"
                                            returnKeyType="done"
                                        />
                                        <Text style={styles.currencyLabel}>MXN</Text>
                                    </View>

                                    {/* Selector de frecuencia */}
                                    <View style={styles.frequencyContainer}>
                                        <View style={styles.frequencyHeader}>
                                            <FrequencyIcon size={16} color={colors.muted} />
                                            <Text style={styles.frequencyLabel}>Frecuencia</Text>
                                        </View>
                                        {Platform.OS === 'ios' ? (
                                            <>
                                                <TouchableOpacity 
                                                    style={styles.pickerButton}
                                                    onPress={() => {
                                                        Haptics.selectionAsync();
                                                        setShowSavingFrequencyModal(true);
                                                    }}
                                                >
                                                    <Text style={styles.pickerButtonText}>
                                                        {frequencies.find(f => f.id === savingFrequency)?.label || 'Seleccionar'}
                                                    </Text>
                                                    <Text style={styles.pickerArrow}>▼</Text>
                                                </TouchableOpacity>
                                                
                                                <Modal
                                                    visible={showSavingFrequencyModal}
                                                    transparent={true}
                                                    animationType="fade"
                                                >
                                                    <View style={styles.modalOverlay}>
                                                        <View style={styles.modalContent}>
                                                            <View style={styles.modalHeader}>
                                                                <Text style={styles.modalTitle}>Selecciona frecuencia</Text>
                                                            </View>
                                                            <Picker
                                                                selectedValue={savingFrequency}
                                                                onValueChange={(itemValue) => {
                                                                    Haptics.selectionAsync();
                                                                    setSavingFrequency(itemValue);
                                                                }}
                                                                style={styles.modalPicker}
                                                                itemStyle={styles.modalPickerItem}
                                                            >
                                                                {frequencies.map((freq) => (
                                                                    <Picker.Item key={freq.id} label={freq.label} value={freq.id} />
                                                                ))}
                                                            </Picker>
                                                            <TouchableOpacity
                                                                style={styles.modalButton}
                                                                onPress={() => {
                                                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                                                    setShowSavingFrequencyModal(false);
                                                                }}
                                                            >
                                                                <Text style={styles.modalButtonText}>OK</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </Modal>
                                            </>
                                        ) : (
                                            <View style={styles.pickerWrapper}>
                                                <Picker
                                                    selectedValue={savingFrequency}
                                                    onValueChange={(itemValue) => {
                                                        setSavingFrequency(itemValue);
                                                    }}
                                                    style={styles.picker}
                                                >
                                                    {frequencies.map((freq) => (
                                                        <Picker.Item key={freq.id} label={freq.label} value={freq.id} />
                                                    ))}
                                                </Picker>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* Nota informativa */}
                                <View style={styles.infoNote}>
                                    <Text style={styles.infoIcon}>💡</Text>
                                    <Text style={styles.infoText}>
                                        Puedes ajustar estos valores en cualquier momento desde tu perfil.
                                    </Text>
                                </View>

                                {/* Botón continuar con animación */}
                                {isFormValid && (
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

const radii = {
    xl: 32,
    full: 100,
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
    // Secciones de input sin card individual
    inputSection: {
        marginBottom: 32,
    },
    cardShadow: {
        ...shadow(colors.muted, 4, 8, 0.15),
    },
    inputCard: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(203, 213, 225, 0.5)',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    cardBlur: {
        padding: 24,
        backgroundColor: 'transparent',
    },
    inputHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconBadge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        ...shadow(colors.cyan, 2, 4, 0.15),
    },
    inputLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
        fontFamily: 'Inter',
        flex: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(241, 245, 249, 0.8)',
        borderRadius: 100,
        paddingHorizontal: 18,
        paddingVertical: 18,
        borderWidth: 1.5,
        borderColor: 'rgba(203, 213, 225, 0.5)',
        marginBottom: 20,
    },
    currencyIconWrapper: {
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: colors.text,
        fontFamily: 'Inter',
        padding: 0,
    },
    currencyLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.muted,
        fontFamily: 'Inter',
        marginLeft: 8,
    },
    frequencyContainer: {
        gap: 14,
    },
    frequencyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    frequencyLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.muted,
        fontFamily: 'Inter',
    },
    frequencyButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    // Reemplazado por Picker nativo
    pickerWrapper: {
        backgroundColor: 'rgba(241, 245, 249, 0.8)',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'rgba(203, 213, 225, 0.5)',
        overflow: 'hidden',
    },
    picker: {
        height: Platform.OS === 'ios' ? 50 : 50,
        width: '100%',
    },
    pickerItem: {
        fontSize: 16,
        fontFamily: 'Inter',
        color: colors.text,
        height: 50,
    },
    // Botón del picker en iOS
    pickerButton: {
        backgroundColor: 'rgba(241, 245, 249, 0.8)',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'rgba(203, 213, 225, 0.5)',
        paddingVertical: 14,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    pickerButtonText: {
        fontSize: 16,
        fontFamily: 'Inter',
        color: colors.text,
        fontWeight: '500',
    },
    pickerArrow: {
        fontSize: 12,
        color: colors.muted,
    },
    // Modal para iOS
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 34,
    },
    modalHeader: {
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(203, 213, 225, 0.3)',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'Inter',
        color: colors.text,
        textAlign: 'center',
    },
    modalPicker: {
        width: '100%',
        height: 200,
    },
    modalPickerItem: {
        fontSize: 18,
        fontFamily: 'Inter',
        color: colors.text,
    },
    modalButton: {
        backgroundColor: colors.cyan,
        marginHorizontal: 24,
        marginTop: 16,
        paddingVertical: 16,
        borderRadius: 50,
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'Inter',
        color: colors.white,
        letterSpacing: 0.5,
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(203, 213, 225, 0.3)',
        marginVertical: 32,
    },
    infoNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        borderRadius: 16,
        padding: 16,
        marginTop: 24,
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.3)',
    },
    infoIcon: {
        fontSize: 18,
        marginRight: 12,
        marginTop: 2,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: colors.text,
        fontFamily: 'Inter',
        lineHeight: 18,
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
