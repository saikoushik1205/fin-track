import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { User, Mail, Calendar, Shield, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const accountCreatedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Profile</h1>
        <p className="text-dark-400">Manage your account settings</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        className="glass-card p-8 max-w-2xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-primary-500 shadow-lg object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const fallback = e.currentTarget
                  .nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-lg"
            style={{ display: user.avatar ? "none" : "flex" }}
          >
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-dark-50 mt-4">{user.name}</h2>
          <div className="flex items-center space-x-2 mt-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-400">
              {user.provider === "google" ? "Google Account" : "Email Account"}
            </span>
          </div>
        </div>

        {/* Account Details */}
        <div className="space-y-4">
          <div className="glass-card p-4 hover:bg-dark-700/30 transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-primary-500/20">
                <User className="w-5 h-5 text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-dark-400">Full Name</p>
                <p className="text-lg font-semibold text-dark-50">
                  {user.name}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 hover:bg-dark-700/30 transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <Mail className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-dark-400">Email Address</p>
                <p className="text-lg font-semibold text-dark-50">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 hover:bg-dark-700/30 transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-amber-500/20">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-dark-400">Account ID</p>
                <p className="text-lg font-semibold text-dark-50">
                  #{user.id.slice(0, 8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 hover:bg-dark-700/30 transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Calendar className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-dark-400">Member Since</p>
                <p className="text-lg font-semibold text-dark-50">
                  {accountCreatedDate}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>

      {/* Additional Info */}
      <motion.div
        className="glass-card p-6 max-w-2xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-dark-50 mb-4">
          Account Security
        </h3>
        <div className="space-y-3 text-sm text-dark-400">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-green-400 mt-0.5" />
            <p>Your account is secured with industry-standard encryption</p>
          </div>
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-green-400 mt-0.5" />
            <p>All your transaction data is stored locally on your device</p>
          </div>
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-green-400 mt-0.5" />
            <p>We never share your personal information with third parties</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
