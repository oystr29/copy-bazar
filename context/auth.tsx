import { useRouter, useSegments } from "expo-router";
import React, { FC, ReactNode } from "react";
import { Session } from "~/kit/auth/schema";
import { Axios, resetAxiosAuth, setAxiosAuth } from "~/lib/axios";
import { storage } from "~/lib/storage";

type CredentialsContext = {
  signIn: (userCredentials: Session) => void;
  signOut: () => void;
  session: Session | null;
};

type AuthProviderProps = {
  userCredentials: Session | null;
  children?: ReactNode;
};

const AuthContext = React.createContext<CredentialsContext>({
  signIn: () => {},
  signOut: () => {},
  session: null,
});

// This hook can be used to access the user info.
export function useAuth() {
  return React.useContext(AuthContext);
}

// This hook will protect the route access based on user authentication.
function useProtectedRoute(session: Session | null) {
  const segments = useSegments();
  const router = useRouter();

  React.useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)" || segments[1] === "home" || segments[1] === 'cart';

    // @ts-ignore
    if (segments[0] === "+not-found") {
      router.replace("/main/home");
    } else if (
      // If the user is not signed in and the initial segment is not anything in the auth group.
      !session &&
      !inAuthGroup
    ) {
      // Redirect to the sign-in page.
      console.log(segments);
      router.replace("/(auth)/login");
    } else if (
      session &&
      session.user.role === "admin" &&
      // @ts-ignore
      (inAuthGroup || segments[0] === "+not-found")
    ) {
      // Redirect away from the sign-in page.
      router.replace("/admin/home");
      // @ts-ignore
    } else if (
      session &&
      session.user.role === "customer" &&
      // @ts-ignore
      (inAuthGroup || segments[0] === "+not-found")
    ) {
      // Redirect away from the sign-in page.
      router.replace("/main/home");
    }
  }, [session, segments, router]);
}

export const Provider: FC<AuthProviderProps> = (props) => {
  const [session, setAuth] = React.useState<Session | null>(
    props.userCredentials,
  );

  useProtectedRoute(session);

  return (
    <AuthContext.Provider
      value={{
        signIn: (userCredentials: Session) => {
          setAuth(userCredentials);
          setAxiosAuth(userCredentials.token);
          storage.set("user", JSON.stringify(userCredentials));
        },
        signOut: () => {
          setAuth(null);
          resetAxiosAuth();
          storage.set("user", "");
        },
        session,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
