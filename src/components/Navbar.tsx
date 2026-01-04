import { motion, useScroll, useTransform } from "framer-motion";
import {
  Home,
  TrendingUp,
  TrendingDown,
  Menu,
  X,
  User,
  Wallet,
  PercentSquare,
  DollarSign,
  Building2,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

interface NavbarProps {
  currentPage:
    | "dashboard"
    | "lending"
    | "borrowing"
    | "profile"
    | "expenses"
    | "interest"
    | "earnings"
    | "other";
  onNavigate: (
    page:
      | "dashboard"
      | "lending"
      | "borrowing"
      | "profile"
      | "expenses"
      | "interest"
      | "earnings"
      | "other"
  ) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(15, 23, 42, 0.6)", "rgba(15, 23, 42, 0.95)"]
  );

  const isSpecialUser = user?.email === "koushiksai242@gmail.com";

  const navItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: Home },
    { id: "lending" as const, label: "Lending", icon: TrendingUp },
    { id: "borrowing" as const, label: "Borrowing", icon: TrendingDown },
    ...(isSpecialUser
      ? [{ id: "interest" as const, label: "Interest", icon: PercentSquare }]
      : []),
    { id: "expenses" as const, label: "Expenses", icon: Wallet },
    { id: "earnings" as const, label: "Earnings", icon: DollarSign },
    { id: "other" as const, label: "Other", icon: Building2 },
  ];

  return (
    <>
      <motion.nav
        className="glass-navbar sticky top-0 z-50 mb-8"
        style={{ backgroundColor }}
      >
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3 cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(99, 102, 241, 0.4)",
                  "0 0 30px rgba(168, 85, 247, 0.4)",
                  "0 0 20px rgba(99, 102, 241, 0.4)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-white font-bold text-xl">F</span>
            </motion.div>
            <div>
              <h1 className="text-xl font-bold gradient-text">FinTrack</h1>
              <p className="text-xs text-slate-400 font-medium">
                Track. Save. Grow.
              </p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <motion.button
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-semibold transition-all duration-300 relative overflow-hidden group ${
                      isActive
                        ? "text-white"
                        : "text-slate-300 hover:text-white"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Active background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                        style={{
                          boxShadow: "0 0 30px rgba(99, 102, 241, 0.5)",
                        }}
                      />
                    )}

                    {/* Hover effect */}
                    {!isActive && (
                      <motion.div
                        className="absolute inset-0 bg-slate-700/30 rounded-2xl opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.2 }}
                      />
                    )}

                    <Icon
                      className={`w-5 h-5 relative z-10 ${
                        isActive ? "animate-glow" : ""
                      }`}
                    />
                    <span className="relative z-10">{item.label}</span>

                    {/* Underline animation */}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 w-1/2 h-0.5 bg-white rounded-full"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{ x: "-50%" }}
                      />
                    )}
                  </motion.button>
                </motion.div>
              );
            })}

            {/* User Profile Button */}
            <motion.button
              onClick={() => onNavigate("profile")}
              className={`p-2.5 rounded-2xl transition-all duration-300 relative ${
                currentPage === "profile"
                  ? "ring-2 ring-primary-500"
                  : "hover:bg-dark-700/50"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-primary-500 object-cover"
                  onError={(e) => {
                    // If image fails to load, hide it and show fallback
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget
                      .nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center"
                style={{ display: user?.avatar ? "none" : "flex" }}
              >
                <User className="w-5 h-5 text-white" />
              </div>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-dark-700 p-4 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white"
                      : "text-dark-300 hover:bg-dark-700/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Profile Button */}
            <button
              onClick={() => {
                onNavigate("profile");
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentPage === "profile"
                  ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white"
                  : "text-dark-300 hover:bg-dark-700/50"
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>

            {/* Mobile User Info */}
            <div className="pt-4 mt-4 border-t border-dark-700">
              <div className="flex items-center space-x-3 px-4 py-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-primary-500 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fallback = e.currentTarget
                        .nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center"
                  style={{ display: user?.avatar ? "none" : "flex" }}
                >
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-dark-50">
                    {user?.name}
                  </p>
                  <p className="text-xs text-dark-400">{user?.email}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>
    </>
  );
};
