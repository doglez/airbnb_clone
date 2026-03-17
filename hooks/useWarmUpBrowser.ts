import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Platform } from "react-native";

/**
 * useWarmUpBrowser
 * ------------------------------------------------------------------
 * Hook personalizado que precalienta el navegador nativo (Custom Tabs)
 * en plataformas móviles para mejorar el rendimiento al abrir
 * autenticaciones sociales (Google, Facebook, Apple, etc).
 *
 * 🔹 Solo aplica en Android/iOS.
 * 🔹 En Web no está soportado (expo-web-browser no implementa warmUpAsync).
 *
 * Beneficio:
 * Reduce el tiempo de apertura cuando se utiliza WebBrowser.openAuthSessionAsync()
 * durante el flujo OAuth.
 *
 * Se recomienda utilizarlo en pantallas de Login o antes de iniciar
 * un flujo de autenticación externa.
 */
export const useWarmUpBrowser = () => {
    useEffect(() => {
        /**
         * warmUpAsync()
         * Inicializa el navegador en segundo plano.
         * Esto mejora la experiencia del usuario al reducir
         * el tiempo de carga del navegador externo.
         */
        if (Platform.OS !== "web") {
            void WebBrowser.warmUpAsync();
        }

        /**
         * Cleanup:
         * coolDownAsync()
         * Libera los recursos utilizados por el navegador
         * cuando el componente se desmonta.
         */
        return () => {
            if (Platform.OS !== "web") {
                void WebBrowser.coolDownAsync();
            }
        };
    }, []);
};
