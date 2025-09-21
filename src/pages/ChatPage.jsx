import Header from "../components/Header";
import MessageList from "../components/MessageList";
import ChatList from "../components/ChatList";
import MessageForm from "../components/MessageForm";
import { useEffect, useState } from "react";
import { useSession } from "../context/SessionProvider";
import { getUserConversations } from "../helpers/userActions";
import useBreakpoint from "../hooks/useBreakpoint";
import { useUi } from "../zustand/uiStore";
import { useConversation } from "../zustand/conversationStore";

function ChatPage() {
  const [conversations, setConversations] = useState();
  const currentConversationId = useConversation(
    (state) => state.currentConversationId
  );
  const [currentConversation, setCurrentConversation] = useState(null);
  const session = useSession();
  const breakPoint = useBreakpoint();
  const setDiviceType = useUi((state) => state.setDiviceType);

  useEffect(() => {
    setDiviceType(breakPoint);
  }, [breakPoint]);
  useEffect(() => {
    const getConversations = async () => {
      const { sucsess, data } = await getUserConversations(session.user.id);
      if (sucsess) setConversations(data);
    };
    getConversations();
  }, []);
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <ChatList conversations={conversations} />
        {currentConversationId && (
          <div className="flex-1 flex flex-col">
            <MessageList/>
            <MessageForm currentConversations={currentConversation} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
