import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Text, TouchableOpacity } from "react-native";
import clerk from '../hooks/clerk';
import { styles } from "./Styles";
import { useWamUpBrowser } from "../hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

export function OAuthButtons() {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience

  // Only works for native, implementation for we: https://clerk.com/docs/custom-flows/oauth-connections
  useWamUpBrowser();

  const { startOAuthFlow } = clerk.useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <TouchableOpacity
      style={{ ...styles.secondaryButton, marginBottom: 20 }}
      onPress={onPress}
    >
      <Text style={styles.secondaryButtonText}>Continue with Google</Text>
    </TouchableOpacity>
  );
}