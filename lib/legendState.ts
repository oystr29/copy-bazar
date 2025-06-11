import { observable } from "@legendapp/state";
import { useCallback } from "react";

type Session = {
  id: number;
  name: string;
  username: string;
  token: string;
};

type Store = {
  session?: Session;
};

const store$ = observable<Store>({});

const useSession = () => {
  const signIn = useCallback((data: Session) => {
    store$.session.set(data);
  }, []);

  const signOut = useCallback(() => store$.session.set(undefined), []);

  return {
    session: store$.session.get(),
    signIn,
    signOut,
  };
};

export { store$, useSession };
