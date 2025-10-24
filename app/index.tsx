import { LinearGradient } from 'expo-linear-gradient';
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
        <View style={styles.container}>
            {/* Gradiente base */}
            <LinearGradient
                colors={['#00B2FF', '#15ACEB', '#1C87DD', '#1E42B5']}
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
                <Image
                    source={require('@/assets/images/CoraWealth_LogoSinFondo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                
                <Text style={styles.tagline}>POR CORA</Text>
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
        fontFamily: 'Poppins',
    },


});
