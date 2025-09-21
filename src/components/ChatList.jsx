import { useEffect, useState } from "react";
import { useSession } from "../context/SessionProvider";
import { supabase } from "../lib/supabase/supabase";
import ChatListItemSkeleton from "./ChatListItemSkeleton";
import { useConversation } from "../zustand/conversationStore";
import { CirclePlus } from "lucide-react";
import NewUserList from "./NewUserList";
import { getUserConversations } from "../helpers/userActions";

function ChatList() {
  const [conversations, setConversations] = useState();
  const [isNewUserListOpen, setIsNewUserListOpen] = useState(false);
  const currentConversation = useConversation(
    (state) => state.currentConversationId
  );
  const setCurrentConversationId = useConversation(
    (state) => state.setCurrentConversationId
  );
  const user = useSession();
  const session = useSession();
  const [mainConversationsList, setMainConversationsList] = useState(null);
  const [reFetchCoun, setReFetchCoun] = useState(0);
  useEffect(() => {
    const getConversations = async () => {
      const { sucsess, data } = await getUserConversations(session.user.id);
      if (sucsess) setConversations(data);
    };
    getConversations();
  }, [reFetchCoun]);
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
      if (error) {
        setMainConversationsList("NC");
      } else {
        setMainConversationsList(data.conversations);
      }
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
  if (isNewUserListOpen)
    return (
      <NewUserList
        setIsOpen={setIsNewUserListOpen}
        isOpen={isNewUserListOpen}
        reFetchCoun={setReFetchCoun}
      />
    );

  return (
    <div
      className={`${
        currentConversation ? "w-0 p-0" : "w-full"
      } lg:w-1/4 border-l lg:p-4 overflow-y-auto bg-blue-100 relative`}
    >
      {mainConversationsList !== "NC" &&
        mainConversationsList?.map((chat) => (
          <div
            key={chat.conversation_id}
            className={`${
              currentConversation === chat.conversation_id ? "bg-gray-200" : ""
            } p-2 mb-2 hover:bg-gray-200 rounded cursor-pointer flex gap-4`}
            onClick={() => setCurrentConversationId(chat.conversation_id)}
          >
            {chat.partner_avatar_url ? (
              <img
                src={chat.partner_avatar_url}
                alt="user Avatar"
                className="rounded-full w-1/6 bg-slate-100/50"
              />
            ) : (
              <div className="w-1/6 aspect-square bg-slate-100/50 rounded-full items-center flex justify-center font-extrabold text-5xl text-blue-950">
                {chat.partner_username[0]}
              </div>
            )}
            {/* اینجا میتونیم آی دی پارتنر رو هم پاس بدیم */}
            <p className="font-semibold flex items-center">
              {chat.partner_username}
            </p>
          </div>
        ))}
      {mainConversationsList === "NC" && (
        <div className="flex flex-col justify-center items-center h-full gap-10 ">
          <p className="font-bold text-blue-950">
            با دکمه زیر میتوانید با اولین دوست خود صحبت کنید
          </p>
          <img
            src="./sad-svgrepo-com.svg"
            alt="sad emoji"
            className="w-1/2 opacity-15"
          />
        </div>
      )}
      <button
        className="absolute bottom-2.5 right-2.5 rounded-full bg-amber-300 w-fit aspect-square hover:bg-amber-400 transition duration-150"
        type="button"
        onClick={() => setIsNewUserListOpen(true)}
      >
        <CirclePlus size={48} color="#fff" />
      </button>
    </div>
  );
}

export default ChatList;
