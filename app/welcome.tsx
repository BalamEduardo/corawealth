import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
    const router = useRouter();

    const handleStart = () => {
        // Navegar a la siguiente pantalla (registro o tabs)
        router.push('/(tabs)');
    };

    const handleLogin = () => {
        // Navegar a login (por ahora a tabs, luego crearemos la pantalla de login)
        router.push('/(tabs)');
    };

    return (
        <View style={styles.container}>
            {/* Gradiente base */}
            <LinearGradient
                colors={['#00EAFF', '#00B7FF', '#0080FF', '#0044FF']}
                style={StyleSheet.absoluteFillObject}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            />
            
            {/* Capa de nubes 1 - diagonal */}
            <LinearGradient
                colors={['transparent', '#BAE6FD80', '#7DD3FC60', 'transparent']}
                style={[StyleSheet.absoluteFillObject, { opacity: 0.1 }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.5 }}
                locations={[0, 0.3, 0.6, 1]}
            />
            
           
        

            <View style={styles.content}>
                {/* Título principal */}
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Tu bienestar</Text>
                    <Text style={styles.title}>financiero</Text>
                    <Text style={styles.title}>empieza aquí</Text>
                </View>

                {/* Subtítulo */}
                <Text style={styles.subtitle}>
                    Define tus metas, entiende tus{'\n'}
                    hábitos y toma el control de tu dinero.
                </Text>

                {/* Botón Comenzar */}
                <TouchableOpacity 
                    style={styles.startButton}
                    onPress={handleStart}
                    activeOpacity={0.8}
                >
                    <Text style={styles.startButtonText}>Comenzar</Text>
                </TouchableOpacity>

                {/* Link de inicio de sesión */}
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
                    <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
                        <Text style={styles.loginLink}>Inicia sesión</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: 'Poppins',
        lineHeight: 44,
    },
    subtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        fontFamily: 'Poppins',
        lineHeight: 24,
        opacity: 0.95,
        marginBottom: 80,
    },
    startButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 60,
        paddingVertical: 16,
        borderRadius: 30,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    startButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        fontFamily: 'Poppins',
    },
    loginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loginText: {
        fontSize: 15,
        color: '#FFFFFF',
        fontFamily: 'Poppins',
        opacity: 0.9,
    },
    loginLink: {
        fontSize: 15,
        color: '#FFFFFF',
        fontFamily: 'Poppins',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
