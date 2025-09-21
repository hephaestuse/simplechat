import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { supabase } from "../lib/supabase/supabase";
import { useConversation } from "../zustand/conversationStore";

function MessageList() {
  const currentConversationId = useConversation(
    (state) => state.currentConversationId
  );
  console.log(currentConversationId);
  
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentConversationId) {
        return;
      }
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", currentConversationId)
        .order("created_at", { ascending: true });

      if (!error) {
        setMessages(data);
      }
    };

    fetchMessages();
  }, [currentConversationId]);

  useEffect(() => {
    const channel = supabase
      .channel("custom-insert-channel")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((msg) => (
        <Message
          key={msg.id}
          text={msg.content}
          senderId={msg.sender_id}
          time={msg.created_at}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
