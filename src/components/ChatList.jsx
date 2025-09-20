import { useEffect, useState } from "react";
import { useSession } from "../context/SessionProvider";
import { supabase } from "../lib/supabase/supabase";
import { Skeleton } from "./Skeleton";
import ChatListItemSkeleton from "./ChatListItemSkeleton";

function ChatList({ conversations, currentConversations, selectFn }) {
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
      console.log(data);
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
        currentConversations ? "w-0 p-0" : "w-full"
      } lg:w-1/4 border-l lg:p-4 overflow-y-auto`}
    >
      <h2 className="text-lg font-bold mb-4 bg-teal-700 lg:bg-amber-500 ">
        چت‌ها
      </h2>
      {mainConversationsList?.map((chat) => (
        <div
          key={chat.conversation_id}
          className={`${
            currentConversations === chat.conversation_id ? "bg-gray-200" : ""
          } p-2 mb-2 hover:bg-gray-200 rounded cursor-pointer`}
          onClick={() => selectFn(chat.conversation_id)}
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
