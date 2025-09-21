import { ChevronLeft } from "lucide-react";
import SearchBar from "./SearchBar";
import { findeSearchedUser } from "../helpers/userActions";
import toast from "react-hot-toast";
import { useState } from "react";
import { useProfile } from "../zustand/profile";
import { supabase } from "../lib/supabase/supabase";
import { useSession } from "../context/SessionProvider";

function NewUserList({ isOpen, setIsOpen, reFetchCoun }) {
  const [foundedUserlist, setFoundedUserlist] = useState([]);
  const user = useSession();
  const { username } = useProfile();

  async function handleSearch(q) {
    if (!q) return;
    const { sucsess, data } = await findeSearchedUser(q, username);
    !sucsess ? toast.error(data) : setFoundedUserlist(data);
  }
  const handleClose = () => {
    setIsOpen((prev) => !prev);
  };
  const handleCreateConversation = async (id) => {
    const { data, error } = await supabase.functions.invoke(
      "make-target-conversation",
      {
        body: {
          currentUserId: user.user.id,
          targetUserId: id,
        },
      }
    );
    if (error) return;
    setIsOpen((prev) => !prev);
    reFetchCoun((prev) => prev + 1);
  };
  return (
    <div
      className={`${
        isOpen ? "lg:w-1/4" : "lg:w-0"
      } border-l lg:p-4 overflow-y-auto bg-blue-200 drop-shadow-2xl`}
    >
      <div className="flex gap-5 m-4">
        <span onClick={handleClose} className=" items-center flex">
          <ChevronLeft color="#fff" size={32} />
        </span>
        <SearchBar
          className="flex-1"
          onSearch={handleSearch}
          placeholder="جستجو کاربر"
          debounceMs={600}
        />
      </div>
      {foundedUserlist?.map((chat) => (
        <div
          key={chat.id}
          className={` p-2 mb-2 hover:bg-gray-200/70  rounded cursor-pointer flex gap-2`}
          onClick={() => handleCreateConversation(chat.id)}
        >
          {chat.avatar_url ? (
            <img
              src={chat.avatar_url}
              alt="user Avatar"
              className="rounded-full w-1/6  bg-slate-100/50"
            />
          ) : (
            <div className="w-1/6  aspect-square bg-slate-100/50 rounded-full items-center flex justify-center font-extrabold text-5xl text-blue-950">
              {chat.username[0]}
            </div>
          )}
          {/* اینجا میتونیم آی دی پارتنر رو هم پاس بدیم */}
          <p className="font-semibold items-center flex">{chat.username}</p>
        </div>
      ))}
    </div>
  );
}

export default NewUserList;
