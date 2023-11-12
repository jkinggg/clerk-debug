import * as React from "react";
import { Text, TextInput, TouchableOpacity, View, Platform } from "react-native";
import clerk from '../../hooks/clerk';
import { log } from "../../utils/logger";
import { styles } from "../../components/Styles";
import { OAuthButtons } from "../../components/OAuth";
import { Link, Stack, useRouter, useSegments } from "expo-router";

export default function SignUpScreen() {
  const router = useRouter();
  
  const { isLoaded, signUp } = clerk.useSignUp();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignUpPress = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });

      // https://docs.clerk.dev/popular-guides/passwordless-authentication
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      router.replace("/verify");
    } catch (err: any) {
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
    }
  }, [isLoaded, firstName, lastName, emailAddress, password]);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Sign Up",
        }}
      />
      {Platform.OS !== 'web' && (
      <View style={styles.oauthView}>
        <OAuthButtons />
      </View>
      )}

      <View style={styles.inputView}>
        <TextInput
          value={firstName}
          style={styles.textInput}
          placeholder="First name..."
          placeholderTextColor="#000"
          onChangeText={(firstName) => setFirstName(firstName)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          value={lastName}
          style={styles.textInput}
          placeholder="Last name..."
          placeholderTextColor="#000"
          onChangeText={(lastName) => setLastName(lastName)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          style={styles.textInput}
          placeholder="Email..."
          placeholderTextColor="#000"
          onChangeText={(email) => setEmailAddress(email)}
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

      <TouchableOpacity style={styles.primaryButton} onPress={onSignUpPress}>
        <Text style={styles.primaryButtonText}>Sign up</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text>Have an account?</Text>

        <Link href="/signin" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Sign in</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}