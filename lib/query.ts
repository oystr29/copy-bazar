import { focusManager } from "@tanstack/react-query";
import { AppStateStatus, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useRef } from "react";

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

function useRefreshOnFocus<T>(refetch: () => Promise<T>) {
  const firstTimeRef = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      refetch();
    }, [refetch]),
  );
}
export { onAppStateChange, useRefreshOnFocus };
