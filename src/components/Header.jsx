import { useEffect, useState } from "react";
import { signOut } from "../helpers/Auth";
import { getUserProfile } from "../helpers/userActions";
import { ChevronLeft } from "lucide-react";
import { useUi } from "../zustand/uiStore";
import { useConversation } from "../zustand/conversationStore";

function Header() {
  const [profile, setProfile] = useState();
  const divice = useUi((state) => state.divice);
  const currentConversation = useConversation(
    (state) => state.currentConversationId
  );
  const resetCurrentConversationId = useConversation(
    (state) => state.resetCurrentConversationId
  );
  useEffect(() => {
    const handleGetUser = async () => {
      const { sucsess, data } = await getUserProfile();
      if (sucsess) setProfile(data);
    };
    handleGetUser();
  }, []);

  // 👇 هندل بک
  useEffect(() => {
    const handleBack = () => {
      resetCurrentConversationId();
    };

    if (currentConversation) {
      // وقتی مکالمه انتخاب شد → تاریخچه اضافه کن
      history.pushState({}, "");
      window.addEventListener("popstate", handleBack);
    }

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [currentConversation, resetCurrentConversationId]);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      {}
      {currentConversation && divice === "mobile" ? (
        <span onClick={() => resetCurrentConversationId()}>
          <ChevronLeft strokeWidth={1.5} />
        </span>
      ) : (
        <h1 className="text-xl font-bold">چتک</h1>
      )}
      <div className="flex items-center gap-4">
        <span>{profile?.username}</span>
        <button
          onClick={handleSignOut}
          className="bg-red-500 px-3 py-1 rounded"
        >
          خروج
        </button>
      </div>
    </header>
  );
}

export default Header;
