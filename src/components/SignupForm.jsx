import { useState } from "react";
import { SignUpByEmail } from "../helpers/Auth";
import toast from "react-hot-toast";

function SignupForm({ setActiveTab }) {
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const handleSignUp = async () => {
    if (email && password && userName) {
      const { sucsess, data } = await SignUpByEmail(email, password, userName);
      sucsess
        ? toast.success("حساب کاربری با موفقیت ایجاد شد")
        : toast.error("مشکلی در ایجاد حساب رخ داد");
      sucsess && setActiveTab("login");
    }
  };
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">ثبت‌نام</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          نام کاربری
        </label>
        <input
          type="text"
          placeholder="نام کاربری خود را وارد کنید"
          className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">ایمیل</label>
        <input
          type="email"
          placeholder="ایمیل خود را وارد کنید"
          className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          رمز عبور
        </label>
        <input
          type="password"
          placeholder="رمز عبور خود را وارد کنید"
          className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        onClick={handleSignUp}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        ثبت‌نام
      </button>
      <p className="text-sm text-center text-gray-600">
        حساب کاربری دارید؟{" "}
        <span
          onClick={() => {
            setActiveTab("login");
          }}
          className="text-blue-600 cursor-pointer"
        >
          وارد شوید
        </span>
      </p>
    </div>
  );
}

export default SignupForm;
