// src/SessionProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase/supabase";

const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // بار اول سشن رو بگیر
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // گوش بده به تغییرات (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
