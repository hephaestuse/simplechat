import { useSession } from "../context/SessionProvider";

function Message({ text, senderId, time }) {
  const user = useSession();
  const isMyMessage = senderId === user.user.id;
  const date = new Date(time);

  const formattedTime = date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  console.log(formattedTime);

  return (
    <div
      className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isMyMessage ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        <p dir="rtl" className="whitespace-pre-line">{text}</p>

        <span className="text-xs opacity-70">{formattedTime}</span>
      </div>
    </div>
  );
}

export default Message;
