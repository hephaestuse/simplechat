import Header from "../components/Header";
import MessageList from "../components/MessageList";
import ChatList from "../components/ChatList";
import MessageForm from "../components/MessageForm";
import { useEffect, useState } from "react";
import { useSession } from "../context/SessionProvider";
import { getUserConversations } from "../helpers/userActions";

function ChatPage() {
  const [conversations, setConversations] = useState();
  const [currentConversations, setCurrentConversations] = useState(null);
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
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <ChatList
          conversations={conversations}
          selectFn={setCurrentConversations}
          currentConversations={currentConversations}
        />
        {currentConversations && (
          <div className="flex-1 flex flex-col">
            <MessageList currentConversations={currentConversations} />
            <MessageForm currentConversations={currentConversations} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;
