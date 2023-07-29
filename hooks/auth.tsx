import { useRouter, useSegments } from "expo-router";
import React, {useEffect, useState} from "react";
import { useAuth } from '@clerk/clerk-react';
import { getAuth, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import initialize from '../data/initialize';
import { RxDatabase } from 'rxdb';
import { Provider } from 'rxdb-hooks';

// This hook will protect the route access based on user authentication.
function useProtectedRoute(user) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !user &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      router.replace("/signin");
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace("/(main)");
    }
  }, [user, segments]);
}

export function AuthProvider(props) {
  console.log("Entering auth provider");
  const { userId, getToken } = useAuth();
  const auth = getAuth();
  const [db, setDb] = useState<RxDatabase>();
  console.log("clerk user ::", userId);
  useProtectedRoute(userId);

  useEffect(() => {
    if (userId) {
      const signInWithClerk = async () => {
        const token = await getToken({ template: "integration_firebase" });
        const userCredentials = await signInWithCustomToken(auth, token);
        console.log("firebase user ::", userCredentials.user);
      };
      signInWithClerk();
    }
  }, [userId, getToken, auth]);

  useEffect(() => {
    if (auth.currentUser && !db) {
      console.log("Initializing database");
      initialize().then(setDb);
    }
  }, [auth.currentUser, db]);

  return (
    <Provider db={db}>
      {props.children}
    </Provider>
  );
}