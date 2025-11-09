import { AppleIcon, EmailIcon, EyeIcon, GoogleIcon, LockIcon } from '@/components/icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
    AccessibilityInfo,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Tokens de diseño
const colors = {
    primary: '#3B82F6',
    cyan: '#38BDF8',
    text: '#0F172A',
    muted: '#6B7280',
    error: '#EF4444',
    white: '#FFFFFF',
};

const radii = {
    xl: 32,
    full: 100,
};

// Blur intensities por plataforma
const BLUR_INTENSITY = {
    card: Platform.select({ ios: 40, android: 20 }),
    button: Platform.select({ ios: 20, android: 15 }),
    input: Platform.select({ ios: 15, android: 10 }),
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

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{email?: string; password?: string}>({});
    
    // Refs para navegación entre inputs
    const passwordRef = useRef<TextInput>(null);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        const newErrors: {email?: string; password?: string} = {};

        if (!email) {
            newErrors.email = 'El email es requerido';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Email inválido';
        }

        if (!password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        setErrors(newErrors);
        
        // Anunciar errores para accesibilidad
        if (Object.keys(newErrors).length > 0) {
            const errorMessage = Object.values(newErrors).join('. ');
            AccessibilityInfo.announceForAccessibility(`Error de validación: ${errorMessage}`);
        }
        
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            console.log('Login submitted:', { email, password });
            // Aquí iría la lógica de autenticación
            // Después de autenticar exitosamente:
            router.push('/onboarding');
        }
    };

    const handleGoogleAuth = () => {
        console.log('Google auth');
        // Lógica de autenticación con Google
        router.push('/onboarding');
    };

    const handleAppleAuth = () => {
        console.log('Apple auth');
        // Lógica de autenticación con Apple
        router.push('/onboarding');
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
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
                keyboardShouldPersistTaps="handled"
            >
                {/* Botón de regreso */}
                <Pressable 
                    style={styles.backButton}
                    onPress={() => router.back()}
                    accessibilityRole="button"
                    accessibilityLabel="Regresar"
                    hitSlop={12}
                >
                    <View style={styles.backButtonInner}>
                        <Text style={styles.backButtonText}>← Volver</Text>
                    </View>
                </Pressable>

                {/* Tarjeta principal con efecto glass */}
                <View style={styles.glassCardWrapper}>
                    <View style={styles.glassCardShadow}>
                        <View style={styles.glassCardContainer}>
                            <BlurView intensity={BLUR_INTENSITY.card} tint="light" style={styles.glassCard}>
                                {/* Encabezado */}
                                <View style={styles.headerSection}>
                                    <Text style={styles.title}>Bienvenido/a de nuevo</Text>
                                    <Text style={styles.subtitle}>
                                        Inicia sesión para continuar tu camino hacia la claridad financiera.
                                    </Text>
                                </View>

                                {/* Botones de autenticación social */}
                                <View style={styles.socialButtonsSection}>
                                    <Pressable
                                        style={styles.googleButtonWrapper}
                                        onPress={handleGoogleAuth}
                                        accessibilityRole="button"
                                        accessibilityLabel="Continuar con Google"
                                        android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
                                    >
                                        <View style={styles.googleButtonShadow}>
                                            <View style={styles.googleButtonContainer}>
                                                <BlurView intensity={BLUR_INTENSITY.button} tint="light" style={styles.googleButton}>
                                                    <GoogleIcon />
                                                    <Text style={styles.googleButtonText}>Continuar con Google</Text>
                                                </BlurView>
                                            </View>
                                        </View>
                                    </Pressable>

                                    {Platform.OS === 'ios' && (
                                        <Pressable
                                            style={styles.googleButtonWrapper}
                                            onPress={handleAppleAuth}
                                            accessibilityRole="button"
                                            accessibilityLabel="Continuar con Apple"
                                            android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
                                        >
                                            <View style={styles.googleButtonShadow}>
                                                <View style={styles.googleButtonContainer}>
                                                    <BlurView intensity={BLUR_INTENSITY.button} tint="light" style={styles.googleButton}>
                                                        <AppleIcon />
                                                        <Text style={styles.googleButtonText}>Continuar con Apple</Text>
                                                    </BlurView>
                                                </View>
                                            </View>
                                        </Pressable>
                                    )}
                                </View>

                                {/* Separador */}
                                <View style={styles.separatorContainer}>
                                    <View style={styles.separatorLine} />
                                    <Text style={styles.separatorText}>o</Text>
                                    <View style={styles.separatorLine} />
                                </View>

                                {/* Formulario */}
                                <View style={styles.formSection}>
                                    {/* Campo Email */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Email</Text>
                                        <View style={styles.inputShadow}>
                                            <View style={[
                                                styles.inputContainer,
                                                errors.email && styles.inputContainerError
                                            ]}>
                                                <BlurView intensity={BLUR_INTENSITY.input} tint="light" style={styles.inputBlurView}>
                                                    <View style={styles.inputIconWrapper}>
                                                        <EmailIcon />
                                                    </View>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="tu@email.com"
                                                        placeholderTextColor="#9CA3AF"
                                                        value={email}
                                                        onChangeText={(text) => {
                                                            setEmail(text);
                                                            if (errors.email) setErrors({...errors, email: undefined});
                                                        }}
                                                        autoComplete="email"
                                                        textContentType="emailAddress"
                                                        keyboardType="email-address"
                                                        autoCapitalize="none"
                                                        returnKeyType="next"
                                                        onSubmitEditing={() => passwordRef.current?.focus()}
                                                    />
                                                </BlurView>
                                            </View>
                                        </View>
                                        {errors.email && (
                                            <Text style={styles.errorText}>{errors.email}</Text>
                                        )}
                                    </View>

                                    {/* Campo Contraseña */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Contraseña</Text>
                                        <View style={styles.inputShadow}>
                                            <View style={[
                                                styles.inputContainer,
                                                errors.password && styles.inputContainerError
                                            ]}>
                                                <BlurView intensity={BLUR_INTENSITY.input} tint="light" style={styles.inputBlurView}>
                                                    <View style={styles.inputIconWrapper}>
                                                        <LockIcon />
                                                    </View>
                                                    <TextInput
                                                        ref={passwordRef}
                                                        style={styles.input}
                                                        placeholder="Mínimo 6 caracteres"
                                                        placeholderTextColor="#9CA3AF"
                                                        value={password}
                                                        onChangeText={(text) => {
                                                            setPassword(text);
                                                            if (errors.password) setErrors({...errors, password: undefined});
                                                        }}
                                                        autoComplete="password"
                                                        textContentType="password"
                                                        secureTextEntry={!showPassword}
                                                        autoCapitalize="none"
                                                        returnKeyType="done"
                                                        onSubmitEditing={handleSubmit}
                                                    />
                                                    <Pressable 
                                                        onPress={() => setShowPassword(!showPassword)}
                                                        style={styles.showPasswordButton}
                                                        hitSlop={8}
                                                        accessibilityRole="button"
                                                        accessibilityLabel={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                                    >
                                                        <EyeIcon visible={showPassword} />
                                                    </Pressable>
                                                </BlurView>
                                            </View>
                                        </View>
                                        {errors.password && (
                                            <Text style={styles.errorText}>{errors.password}</Text>
                                        )}
                                    </View>

                                    {/* Link "Olvidaste tu contraseña" */}
                                    <Pressable 
                                        style={styles.forgotPasswordContainer}
                                        onPress={() => console.log('Forgot password')}
                                        accessibilityRole="button"
                                    >
                                        <Text style={styles.forgotPasswordText}>
                                            ¿Olvidaste tu contraseña?
                                        </Text>
                                    </Pressable>

                                    {/* Botón principal */}
                                    <Pressable 
                                        style={styles.submitButtonWrapper}
                                        onPress={handleSubmit}
                                        accessibilityRole="button"
                                        accessibilityLabel="Iniciar sesión"
                                    >
                                        <View style={styles.submitButtonShadow}>
                                            <View style={styles.submitButton}>
                                                <Text style={styles.submitButtonText}>Iniciar Sesión</Text>
                                            </View>
                                        </View>
                                    </Pressable>

                                    {/* Link para registro */}
                                    <View style={styles.toggleModeContainer}>
                                        <Text style={styles.toggleModeQuestion}>
                                            ¿No tienes cuenta?
                                        </Text>
                                        <Pressable onPress={() => router.push('/auth')} accessibilityRole="button">
                                            <Text style={styles.toggleModeLink}>Regístrate</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </BlurView>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
        justifyContent: 'center',
        minHeight: height - 120,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginBottom: 24,
    },
    backButtonInner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        ...shadow(colors.muted, 2, 4, 0.1),
    },
    backButtonText: {
        fontSize: 15,
        color: colors.text,
        fontFamily: 'Inter',
        fontWeight: '600',
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
    // Encabezado
    headerSection: {
        alignItems: 'center',
        marginBottom: 28,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
        textAlign: 'center',
        fontFamily: 'Inter',
        marginBottom: 8,
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 14,
        color: colors.cyan,
        textAlign: 'center',
        fontFamily: 'Inter',
        lineHeight: 20,
        letterSpacing: 0.2,
    },
    // Botones sociales
    socialButtonsSection: {
        gap: 14,
        marginBottom: 24,
    },
    googleButtonWrapper: {
        width: '100%',
        marginBottom: 2,
    },
    googleButtonShadow: {
        ...shadow(colors.muted, 4, 8, 0.15),
    },
    googleButtonContainer: {
        borderRadius: 100,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.9)',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        gap: 10,
        backgroundColor: 'transparent',
        borderRadius: 100,
    },
    googleButtonText: {
        fontSize: 15,
        color: colors.text,
        fontFamily: 'Inter',
        fontWeight: '600',
    },
    // Separador
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(107, 114, 128, 0.2)',
    },
    separatorText: {
        marginHorizontal: 16,
        fontSize: 13,
        color: colors.muted,
        fontFamily: 'Inter',
        fontWeight: '500',
    },
    // Formulario
    formSection: {
        gap: 16,
    },
    inputGroup: {
        gap: 8,
    },
    inputLabel: {
        fontSize: 14,
        color: colors.text,
        fontFamily: 'Inter',
        fontWeight: '600',
        marginBottom: 4,
    },
    inputShadow: {
        ...shadow(colors.muted, 4, 8, 0.12),
    },
    inputContainer: {
        position: 'relative',
        borderRadius: 100,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.8)',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    inputContainerError: {
        borderColor: colors.error,
    },
    inputBlurView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 100,
    },
    inputIconWrapper: {
        width: 40,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        paddingRight: 48,
        fontSize: 15,
        fontFamily: 'Inter',
        color: colors.text,
        backgroundColor: 'transparent',
    },
    showPasswordButton: {
        position: 'absolute',
        right: 12,
        top: 10,
        padding: 4,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 12,
        color: colors.error,
        fontFamily: 'Inter',
        marginTop: 4,
        marginLeft: 4,
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginTop: 4,
    },
    forgotPasswordText: {
        fontSize: 13,
        color: colors.cyan,
        fontFamily: 'Inter',
        fontWeight: '600',
    },
    // Botón de envío
    submitButtonWrapper: {
        width: '100%',
        marginTop: 8,
        marginBottom: 16,
    },
    submitButtonShadow: {
        ...shadow('#38BDF8', 6, 8, 0.25),
    },
    submitButton: {
        backgroundColor: '#38BDF8',
        borderRadius: radii.full,
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.white,
        letterSpacing: 0.5,
        fontFamily: 'Inter',
    },
    // Toggle de modo
    toggleModeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        gap: 4,
    },
    toggleModeQuestion: {
        fontSize: 14,
        color: colors.muted,
        fontFamily: 'Inter',
    },
    toggleModeLink: {
        fontSize: 14,
        color: colors.cyan,
        fontFamily: 'Inter',
        fontWeight: '600',
    },
    // Privacidad
    privacyContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    privacyText: {
        fontSize: 12,
        color: colors.muted,
        fontFamily: 'Inter',
        textAlign: 'center',
        lineHeight: 18,
    },
    privacyLink: {
        color: colors.cyan,
        fontWeight: '600',
    },
});
