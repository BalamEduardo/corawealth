import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
    const router = useRouter();

    useEffect(() => {
        // Navegar a pantalla de bienvenida después de 4 segundos
        const timer = setTimeout(() => {
            router.replace('/welcome');
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
            {/* Fondo blanco limpio */}

            <View style={styles.content}>
                <Image
                    source={require('@/assets/images/LogoN.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={[styles.tagline, { color: '#0F172A' }]}>BY CORA</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    logo: {
        width: 300,
        height: 300,
        marginBottom: 40,
    },
    tagline: {
        fontSize: 14,
        top: 90,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 1,
        opacity: 0.9,
        fontFamily: 'Inter',
    },


});
