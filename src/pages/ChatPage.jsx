import Header from "../components/Header";
import MessageList from "../components/MessageList";
import ChatList from "../components/ChatList";
import MessageForm from "../components/MessageForm";
import { useEffect, useState } from "react";
import { useSession } from "../context/SessionProvider";
import { getUserConversations } from "../helpers/userActions";

function ChatPage() {
  const [conversations, setConversations] = useState();
  const [currentConversation, setCurrentConversation] = useState(null);
  const session = useSession();
  useEffect(() => {
    const getConversations = async () => {
      const { sucsess, data } = await getUserConversations(session.user.id);
      if (sucsess) setConversations(data);
    };
    getConversations();
  }, []);
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header
        setCurrentConversation={setCurrentConversation}
        currentConversation={currentConversation}
      />
      <div className="flex flex-1 overflow-hidden">
        <ChatList
          conversations={conversations}
          selectFn={setCurrentConversation}
          currentConversations={currentConversation}
        />
        {currentConversation && (
          <div className="flex-1 flex flex-col bg-amber-600">
            <MessageList currentConversations={currentConversation} />
            <MessageForm currentConversations={currentConversation} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
