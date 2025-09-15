import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";

function Auth() {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2 text-center ${
              activeTab === "login"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } rounded-r-lg`}
          >
            ورود
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-2 text-center ${
              activeTab === "signup"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            } rounded-l-lg`}
          >
            ثبت‌نام
          </button>
        </div>
        {activeTab === "login" ? (
          <LoginForm setActiveTab={setActiveTab} />
        ) : (
          <SignupForm setActiveTab={setActiveTab} />
        )}
      </div>
    </div>
  );
}

export default Auth;
