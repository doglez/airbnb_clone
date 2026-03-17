import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { useSSO } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type SSOProvider = "oauth_apple" | "oauth_google" | "oauth_facebook";

const Page = () => {
    useWarmUpBrowser();

    const { startSSOFlow } = useSSO();

    const router = useRouter();

    /**
     * Inicia el flujo SSO para el proveedor indicado.
     * IMPORTANTE:
     * - redirectUrl debe apuntar a una ruta existente en tu Expo Router
     * - esa ruta se usa como callback al regresar del navegador
     */
    const onPressSSO = React.useCallback(
        async (strategy: SSOProvider) => {
            try {
                // Ruta callback dentro de tu app (debes crear app/sso-callback.tsx)
                const redirectUrl = Linking.createURL("/sso-callback");

                const { createdSessionId, setActive, signIn, signUp } =
                    await startSSOFlow({
                        strategy,
                        redirectUrl,
                    });

                // Si Clerk ya creó sesión, la activamos y listo
                if (createdSessionId) {
                    await setActive?.({ session: createdSessionId });
                    router.back();
                    return;
                }

                // Si no hubo sessionId, es que hay pasos extra (MFA, completar perfil, etc.)
                // Aquí luego puedes manejar flujos con signIn / signUp según status.
                console.log("SSO no completado aún:", {
                    signInStatus: signIn?.status,
                    signUpStatus: signUp?.status,
                });
            } catch (err) {
                console.error("SSO error:", err);
            }
        },
        [startSSOFlow],
    );

    return (
        <View style={[defaultStyles.container, { padding: 26 }]}>
            <TextInput
                autoCapitalize="none"
                placeholder="Email"
                style={[defaultStyles.inputField, { marginBottom: 30 }]}
            />
            <TouchableOpacity style={defaultStyles.btn}>
                <Text style={defaultStyles.btnText}>Continue</Text>
            </TouchableOpacity>

            <View style={styles.seperatorView}>
                <View
                    style={{
                        flex: 1,
                        borderBottomColor: "#000",
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
                <Text style={styles.seperator}>or</Text>
                <View
                    style={{
                        flex: 1,
                        borderBottomColor: "#000",
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                />
            </View>

            <View style={{ gap: 20 }}>
                <TouchableOpacity style={styles.btnOutline}>
                    <Ionicons
                        name="call-outline"
                        size={24}
                        style={defaultStyles.btnIcon}
                    />
                    <Text style={styles.btnOutlineText}>
                        Continue with Phone
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnOutline}
                    onPress={() => onPressSSO("oauth_apple")}
                >
                    <Ionicons
                        name="logo-apple"
                        size={24}
                        style={defaultStyles.btnIcon}
                    />
                    <Text style={styles.btnOutlineText}>
                        Continue with Apple
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnOutline}
                    onPress={() => onPressSSO("oauth_google")}
                >
                    <Ionicons
                        name="logo-google"
                        size={24}
                        style={defaultStyles.btnIcon}
                    />
                    <Text style={styles.btnOutlineText}>
                        Continue with Google
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btnOutline}
                    onPress={() => onPressSSO("oauth_facebook")}
                >
                    <Ionicons
                        name="logo-facebook"
                        size={24}
                        style={defaultStyles.btnIcon}
                    />
                    <Text style={styles.btnOutlineText}>
                        Continue with Facebook
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Page;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 26,
    },

    seperatorView: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        marginVertical: 30,
    },
    seperator: {
        fontFamily: "mon-sb",
        color: Colors.grey,
        fontSize: 16,
    },
    btnOutline: {
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: Colors.grey,
        height: 50,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        paddingHorizontal: 10,
    },
    btnOutlineText: {
        color: "#000",
        fontSize: 16,
        fontFamily: "mon-sb",
    },
});
