import { useEffect, useState } from "react";
import { useSession } from "../context/SessionProvider";
import { supabase } from "../lib/supabase/supabase";
import { Skeleton } from "./Skeleton";
import ChatListItemSkeleton from "./ChatListItemSkeleton";
import { useConversation } from "../zustand/conversationStore";

function ChatList({ conversations }) {
  const currentConversation = useConversation(
    (state) => state.currentConversationId
  );
  const setCurrentConversationId = useConversation(
    (state) => state.setCurrentConversationId
  );
  const user = useSession();
  const [mainConversationsList, setMainConversationsList] = useState(null);
  const handleCreateConversation = async () => {
    console.log("start");

    const { data, error } = await supabase.functions.invoke(
      "make-target-conversation",
      {
        body: {
          currentUserId: user.user.id,
          targetUserId: "a054a770-20b5-4f8a-9981-672b0e6200da",
        },
      }
    );
  };
  useEffect(() => {
    if (!conversations) return;

    let conversationIdList = conversations.map((chat) => chat.conversation_id);

    const getConversationMembers = async () => {
      const { data, error } = await supabase.functions.invoke(
        "smart-responder",
        {
          body: {
            currentUserId: user.user.id,
            conversationIds: conversationIdList,
          },
        }
      );
      setMainConversationsList(data.conversations);
    };
    getConversationMembers();
  }, [conversations]);
  if (!mainConversationsList)
    return (
      <div className="flex-col space-y-7 p-4">
        <ChatListItemSkeleton />
        <ChatListItemSkeleton />
        <ChatListItemSkeleton />
      </div>
    );
  return (
    <div
      className={`${
        currentConversation ? "w-0 p-0" : "w-full"
      } lg:w-1/4 border-l lg:p-4 overflow-y-auto`}
    >
      <h2 className="text-lg font-bold mb-4 ">چت‌ها</h2>
      {mainConversationsList?.map((chat) => (
        <div
          key={chat.conversation_id}
          className={`${
            currentConversation === chat.conversation_id ? "bg-gray-200" : ""
          } p-2 mb-2 hover:bg-gray-200 rounded cursor-pointer`}
          onClick={() => setCurrentConversationId(chat.conversation_id)}
        >
          {/* اینجا میتونیم آی دی پارتنر رو هم پاس بدیم */}
          <p className="font-semibold">{chat.partner_username}</p>
        </div>
      ))}
      <button onClick={handleCreateConversation}>شروع مکالمه جدید</button>
    </div>
  );
}

export default ChatList;
