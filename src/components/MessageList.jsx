import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { supabase } from "../lib/supabase/supabase";

function MessageList({ currentConversations }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentConversations) {
        return;
      }
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", currentConversations)
        .order("created_at", { ascending: true });

      if (!error) {
        setMessages(data);
      }
    };

    fetchMessages();
  }, [currentConversations]);

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
