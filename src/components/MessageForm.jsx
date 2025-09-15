import { useState } from "react";
import { sendMessage } from "../helpers/messageActions";
import { useSession } from "../context/SessionProvider";

function MessageForm(currentConversations) {
  const user = useSession();
  const [newMessage, setNewMessage] = useState("");
  const [rows, setRows] = useState(1);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const { sucsess, data } = sendMessage(
      currentConversations.currentConversations,
      user.user.id,
      newMessage
    );
    setNewMessage("");
    setRows(1); // بعد از ارسال دوباره کوچک بشه
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (e.key === "Enter" && e.shiftKey) {
      // وقتی شیفت+اینتر می‌زنیم → یک خط اضافه بشه (تا 10 خط)
      e.preventDefault();
      setRows((prev) => Math.min(prev + 1, 10));
      setNewMessage((prev) => prev + "\n");
    }
  };

  return (
    <div className="p-4 bg-gray-100 border-t">
      <div className="flex gap-2 items-end">
        <textarea
          rows={rows}
          placeholder="پیام خود را بنویسید..."
          className="flex-1 p-2 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            // اگه متن پاک شد، تعداد خطوط کم بشه
            if (e.target.value.trim() === "") setRows(1);
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={handleSendMessage}
        >
          ارسال
        </button>
      </div>
    </div>
  );
}

export default MessageForm;
