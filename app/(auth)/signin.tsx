import React from "react";
import { Text, TextInput, TouchableOpacity, View, Platform } from "react-native";
import clerk from '../../hooks/clerk';
import { log } from "../../utils/logger";
import { OAuthButtons } from "../../components/OAuth";
import { styles } from "../../components/Styles";
import { Link, Stack, useRouter, useSegments } from "expo-router";


export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = clerk.useSignIn();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      });

      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Sign In",
        }}
      />
      {Platform.OS !== 'web' && (
      <View style={styles.oauthView}>
        <OAuthButtons />
      </View>
      )}

      <View style={styles.inputView}>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          style={styles.textInput}
          placeholder="Email..."
          placeholderTextColor="#000"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          value={password}
          style={styles.textInput}
          placeholder="Password..."
          placeholderTextColor="#000"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onSignInPress}>
        <Text style={styles.primaryButtonText}>Sign in</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>Have an account?</Text>

        <Link href="/signup" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}