import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
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
import Svg, { Circle, Path } from 'react-native-svg';

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

// Intensidad de blur optimizada por plataforma
const BLUR_INTENSITY = Platform.select({ ios: 40, android: 20 }) as number;

// Componente de icono de usuario
const UserIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="12" cy="7" r="4" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// Componente de icono de email
const EmailIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M22 6l-10 7L2 6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// Componente de icono de candado
const LockIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <Path d="M19 11H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7c0-1.1-.9-2-2-2z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

// Componente de icono de ojo
const EyeIcon = ({ visible }: { visible: boolean }) => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        {visible ? (
            <>
                <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <Circle cx="12" cy="12" r="3" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </>
        ) : (
            <>
                <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M1 1l22 22" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </>
        )}
    </Svg>
);

// Componente de logo de Google
const GoogleIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 48 48">
        <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        <Path fill="none" d="M0 0h48v48H0z" />
    </Svg>
);

// Componente de logo de Apple
const AppleIcon = () => (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="#000000">
        <Path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </Svg>
);

export default function AuthScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({});
    
    // Refs para navegación entre inputs
    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        const newErrors: { email?: string; password?: string; name?: string } = {};

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

        if (!name) {
            newErrors.name = 'El nombre es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            console.log('Form submitted:', { email, password, name });
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
            {/* Gradiente de fondo: Blanco a Gris Claro */}
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
                {/* Tarjeta principal con efecto Liquid Glass */}
                <View style={styles.glassCardWrapper}>
                    {/* Shadow wrapper - Para sombras (sin overflow) */}
                    <View style={styles.glassCardShadow}>
                        {/* Border wrapper - Para borderRadius (con overflow) */}
                        <View style={styles.glassCardContainer}>
                            <BlurView intensity={20} tint="light" style={styles.glassCard}>
                                {/* Encabezado */}
                                <View style={styles.headerSection}>
                                    <Text style={styles.title}>Únete a Cora Wealth</Text>
                                    <Text style={styles.subtitle}>
                                        Tu camino hacia la claridad y la calma financiera comienza aquí.
                                    </Text>
                                </View>

                                {/* Botón de Google con glass blanco */}
                                <Pressable
                                    style={styles.googleButtonWrapper}
                                    onPress={handleGoogleAuth}
                                    accessibilityRole="button"
                                    accessibilityLabel="Continuar con Google"
                                    android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
                                >
                                    {/* Shadow wrapper */}
                                    <View style={styles.googleButtonShadow}>
                                        {/* Border wrapper */}
                                        <View style={styles.googleButtonContainer}>
                                            <BlurView intensity={15} tint="light" style={styles.googleButton}>
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
                                        {/* Shadow wrapper */}
                                        <View style={styles.googleButtonShadow}>
                                            {/* Border wrapper */}
                                            <View style={styles.googleButtonContainer}>
                                                <BlurView intensity={15} tint="light" style={styles.googleButton}>
                                                    <AppleIcon />
                                                    <Text style={styles.googleButtonText}>Continuar con Apple</Text>
                                                </BlurView>
                                            </View>
                                        </View>
                                    </Pressable>
                                )}

                                {/* Separador */}
                                <View style={styles.separatorContainer}>
                                    <View style={styles.separatorLine} />
                                    <Text style={styles.separatorText}>o</Text>
                                    <View style={styles.separatorLine} />
                                </View>

                                {/* Formulario con inputs glass */}
                                <View style={styles.formSection}>
                                    {/* Campo Nombre */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Nombre</Text>
                                        {/* Shadow wrapper */}
                                        <View style={styles.inputShadow}>
                                            {/* Border wrapper */}
                                            <View style={[
                                                styles.inputContainer,
                                                errors.name && styles.inputContainerError
                                            ]}>
                                                <BlurView intensity={10} tint="light" style={styles.inputBlurView}>
                                                    <View style={styles.inputIconWrapper}>
                                                        <UserIcon />
                                                    </View>
                                                    <TextInput
                                                        style={styles.input}
                                                        placeholder="Tu nombre completo"
                                                        placeholderTextColor="#9CA3AF"
                                                        value={name}
                                                        onChangeText={(text) => {
                                                            setName(text);
                                                            if (errors.name) setErrors({ ...errors, name: undefined });
                                                        }}
                                                        autoComplete="name"
                                                        textContentType="name"
                                                        autoCapitalize="words"
                                                        returnKeyType="next"
                                                        onSubmitEditing={() => emailRef.current?.focus()}
                                                    />
                                                </BlurView>
                                            </View>
                                        </View>
                                        {errors.name && (
                                            <Text style={styles.errorText}>{errors.name}</Text>
                                        )}
                                    </View>

                                    {/* Campo Email */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Email</Text>
                                        {/* Shadow wrapper */}
                                        <View style={styles.inputShadow}>
                                            {/* Border wrapper */}
                                            <View style={[
                                                styles.inputContainer,
                                                errors.email && styles.inputContainerError
                                            ]}>
                                                <BlurView intensity={10} tint="light" style={styles.inputBlurView}>
                                                    <View style={styles.inputIconWrapper}>
                                                        <EmailIcon />
                                                    </View>
                                                    <TextInput
                                                        ref={emailRef}
                                                        style={styles.input}
                                                        placeholder="tu@email.com"
                                                        placeholderTextColor="#9CA3AF"
                                                        value={email}
                                                        onChangeText={(text) => {
                                                            setEmail(text);
                                                            if (errors.email) setErrors({ ...errors, email: undefined });
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
                                        {/* Shadow wrapper */}
                                        <View style={styles.inputShadow}>
                                            {/* Border wrapper */}
                                            <View style={[
                                                styles.inputContainer,
                                                errors.password && styles.inputContainerError
                                            ]}>
                                                <BlurView intensity={10} tint="light" style={styles.inputBlurView}>
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
                                                            if (errors.password) setErrors({ ...errors, password: undefined });
                                                        }}
                                                        autoComplete="new-password"
                                                        textContentType={Platform.select({ ios: 'newPassword', android: 'password' }) as any}
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

                                    {/* Botón Crear Cuenta */}
                                    <Pressable
                                        style={styles.submitButtonWrapper}
                                        onPress={handleSubmit}
                                        accessibilityRole="button"
                                        accessibilityLabel="Crear cuenta"
                                        android_ripple={{ color: 'rgba(255,255,255,0.3)' }}
                                    >
                                        <View style={styles.submitButtonShadow}>
                                            <View style={styles.submitButton}>
                                                <Text style={styles.submitButtonText}>Crear Cuenta</Text>
                                            </View>
                                        </View>
                                    </Pressable>


                                    {/* Link de inicio de sesión */}
                                    <View style={styles.toggleModeContainer}>
                                        <Text style={styles.toggleModeQuestion}>¿Ya tienes cuenta?</Text>
                                        <Pressable onPress={() => router.push('/login')} accessibilityRole="button">
                                            <Text style={styles.toggleModeLink}>Iniciar sesión</Text>
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
        paddingTop: 60,
        paddingBottom: 40,
        justifyContent: 'center',
        minHeight: height - 120,
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
    // Botón de Google - Glass blanco
    googleButtonWrapper: {
        width: '100%',
        marginBottom: 12,
    },
    googleButtonShadow: {
        ...shadow(colors.muted, 4, 8, 0.15),
    },
    googleButtonContainer: {
        borderRadius: radii.full,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.9)',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: 'transparent',
        borderRadius: radii.full,
        gap: 10,
    },
    googleButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        fontFamily: 'Inter',
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
        backgroundColor: 'rgba(209, 213, 219, 0.5)',
    },
    separatorText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: 'Inter',
        marginHorizontal: 12,
    },
    // Formulario
    formSection: {
        gap: 16,
    },
    inputGroup: {
        gap: 6,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.muted,
        fontFamily: 'Inter',
        marginLeft: 4,
    },
    inputShadow: {
        ...shadow(colors.muted, 4, 8, 0.15),
    },
    inputContainer: {
        borderRadius: radii.full,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.7)',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    inputContainerError: {
        borderColor: `rgba(${parseInt(colors.error.slice(1, 3), 16)}, ${parseInt(colors.error.slice(3, 5), 16)}, ${parseInt(colors.error.slice(5, 7), 16)}, 0.6)`,
        backgroundColor: 'rgba(254, 242, 242, 0.5)',
    },
    inputBlurView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: 'transparent',
        borderRadius: radii.full,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 100,
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.7)',
        shadowColor: '#6B7280',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
    },
    inputWrapperError: {
        borderColor: 'rgba(239, 68, 68, 0.6)',
        backgroundColor: 'rgba(254, 242, 242, 0.5)',
    },
    inputIconWrapper: {
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputIcon: {
        fontSize: 16,
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#1A1A1A',
        fontFamily: 'Inter',
        padding: 0,
        backgroundColor: 'transparent',
    },
    showPasswordButton: {
        padding: 4,
    },
    showPasswordIcon: {
        fontSize: 16,
    },
    errorText: {
        fontSize: 11,
        color: colors.error,
        fontFamily: 'Inter',
        marginLeft: 4,
        marginTop: 2,
    },
    // Botón Crear Cuenta
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



    // Link de inicio de sesión
    toggleModeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    toggleModeQuestion: {
        fontSize: 13,
        color: colors.muted,
        fontFamily: 'Inter',
        marginRight: 4,
    },
    toggleModeLink: {
        fontSize: 13,
        color: colors.cyan,
        fontFamily: 'Inter',
        fontWeight: '600',
    },
});
