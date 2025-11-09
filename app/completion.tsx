import { useLocalSearchParams, useRouter } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function CompletionScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const userName = params.name || 'Usuario';

    const handleGoToDashboard = () => {
        // Navegar al dashboard principal
        console.log('Navegando al dashboard...');
        // router.replace('/(tabs)'); // Descomentar cuando exista el tab navigator
    };

    return (
        <View style={styles.container}>
            {/* Fondo blanco limpio */}
            <View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#FFFFFF' }]} />

            {/* Barra de progreso completa */}
            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>4/4</Text>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: '100%' }]} />
                </View>
            </View>

            {/* Contenido centrado */}
            <View style={styles.content}>
                {/* Imagen de finalización */}
                <View style={styles.imageContainer}>
                    <Image
                        source={require('@/assets/images/Finalizacion.png')}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>

                {/* Título dinámico con nombre */}
                <View style={styles.textSection}>
                    <Text style={styles.title}>¡Todo listo, {userName}!</Text>
                    
                    <Text style={styles.subtitle}>
                        Tu centro de tranquilidad financiera está creado
                    </Text>
                    
                    <Text style={styles.welcome}>
                        Bienvenido/a a Cora Wealth
                    </Text>
                </View>

                {/* Botón para ir al dashboard */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.dashboardButton}
                        onPress={handleGoToDashboard}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.dashboardButtonText}>IR A MI DASHBOARD</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    progressContainer: {
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 20,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0077B6',
        fontFamily: 'Poppins',
        marginBottom: 8,
        textAlign: 'center',
    },
    progressBarBackground: {
        width: '100%',
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#0077B6',
        borderRadius: 4,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingBottom: 60,
    },
    imageContainer: {
        width: width * 0.6,
        height: width * 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textSection: {
        alignItems: 'center',
        marginBottom: 48,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#0F172A',
        fontFamily: 'Poppins',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 17,
        color: '#000000',
        fontFamily: 'Poppins',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 8,
    },
    welcome: {
        fontSize: 17,
        color: '#0077B6',
        fontFamily: 'Poppins',
        textAlign: 'center',
        lineHeight: 26,
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: 16,
    },
    dashboardButton: {
        backgroundColor: '#0077B6',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#0077B6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    dashboardButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        fontFamily: 'Poppins',
        letterSpacing: 0.5,
    },
});
