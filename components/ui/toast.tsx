import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Animated, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { colors } from "@/constants/colors";

export type ToastVariant = "info" | "warning" | "error" | "success";

export type ToastOptions = {
  title?: string;
  message: string;
  variant?: ToastVariant;
  durationMs?: number;
};

type ToastProps = {
  title?: string;
  message: string;
  variant: ToastVariant;
};

type ToastState = ToastProps & {
  id: number;
};

type ToastContextValue = {
  show: (options: ToastOptions) => void;
  hide: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION_MS = 3200;

const VARIANT_STYLES: Record<
  ToastVariant,
  {
    container: string;
    title: string;
    message: string;
    iconBg: string;
    iconColor: string;
    shadowColor: string;
    icon: Parameters<typeof IconSymbol>[0]["name"];
  }
> = {
  info: {
    container: "border-primary-400 bg-primary-100",
    title: "text-primary-600",
    message: "text-primary-600",
    iconBg: "bg-white",
    iconColor: colors.primary["600"],
    shadowColor: colors.primary["300"],
    icon: "info.circle.fill",
  },
  warning: {
    container: "border-amber-200 bg-amber-50",
    title: "text-amber-900",
    message: "text-amber-800",
    iconBg: "bg-white",
    iconColor: "#b45309",
    shadowColor: "#f59e0b",
    icon: "exclamationmark.triangle.fill",
  },
  error: {
    container: "border-rose-200 bg-rose-50",
    title: "text-rose-900",
    message: "text-rose-800",
    iconBg: "bg-white",
    iconColor: "#e11d48",
    shadowColor: "#fb7185",
    icon: "xmark.octagon.fill",
  },
  success: {
    container: "border-emerald-200 bg-emerald-50",
    title: "text-emerald-900",
    message: "text-emerald-800",
    iconBg: "bg-white",
    iconColor: "#059669",
    shadowColor: "#34d399",
    icon: "checkmark.circle.fill",
  },
};

export function Toast({ title, message, variant }: ToastProps) {
  const styles = VARIANT_STYLES[variant];

  return (
    <View
      className={`flex-row items-start gap-3 rounded-2xl border px-4 py-3 ${styles.container}`}
      style={{
        shadowColor: styles.shadowColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 10,
        elevation: 6,
      }}
    >
      <View className={`h-9 w-9 items-center justify-center rounded-full ${styles.iconBg}`}>
        <IconSymbol name={styles.icon} size={20} color={styles.iconColor} />
      </View>
      <View className="flex-1">
        {title ? (
          <Text className={`text-sm font-semibold ${styles.title}`}>
            {title}
          </Text>
        ) : null}
        <Text className={`text-xs leading-5 ${styles.message}`}>
          {message}
        </Text>
      </View>
    </View>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const anim = useRef(new Animated.Value(0)).current;

  const clearHideTimer = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, []);

  const hide = useCallback(() => {
    clearHideTimer();

    Animated.timing(anim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setToast(null);
    });
  }, [anim, clearHideTimer]);

  const show = useCallback(
    ({ title, message, variant = "info", durationMs }: ToastOptions) => {
      clearHideTimer();

      setToast({
        id: Date.now(),
        title,
        message,
        variant,
      });

      anim.setValue(0);
      Animated.timing(anim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();

      const timeout = durationMs ?? DEFAULT_DURATION_MS;
      if (timeout > 0) {
        hideTimeoutRef.current = setTimeout(() => {
          hide();
        }, timeout);
      }
    },
    [anim, clearHideTimer, hide]
  );

  useEffect(() => () => clearHideTimer(), [clearHideTimer]);

  const value = useMemo(() => ({ show, hide }), [hide, show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <View
          pointerEvents="box-none"
          className="absolute left-0 right-0 top-0 z-50 px-5"
        >
          <SafeAreaView edges={["top"]} className="pt-2">
            <Animated.View
              style={{
                opacity: anim,
                transform: [
                  {
                    translateY: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-12, 0],
                    }),
                  },
                ],
              }}
            >
              <Toast
                title={toast.title}
                message={toast.message}
                variant={toast.variant}
              />
            </Animated.View>
          </SafeAreaView>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
