import { useState } from "react";
import { SignInByEmail } from "../helpers/Auth";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";

function LoginForm({ setActiveTab }) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const handleLogIn = async () => {
    if (email && password) {
      const { sucsess, data } = await SignInByEmail(email, password);

      sucsess && <Navigate to={"/chat"} replace />;
      sucsess
        ? toast.success("با موفقیت وارد شدید")
        : toast.error("مشکلی در ورود رخ داد ");
    }
  };
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">ورود</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">ایمیل</label>
        <input
          type="email"
          placeholder="ایمیل خود را وارد کنید"
          className="w-full p-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
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
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <button
        onClick={handleLogIn}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        ورود
      </button>
      <p className="text-sm text-center text-gray-600">
        حساب کاربری ندارید؟{" "}
        <span
          onClick={() => setActiveTab("signup")}
          className="text-blue-600 cursor-pointer"
        >
          ثبت‌نام کنید
        </span>
      </p>
    </div>
  );
}

export default LoginForm;
