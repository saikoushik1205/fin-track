import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { LoadingScreen } from "./components/LoadingScreen";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Lazy load pages for better performance
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((module) => ({ default: module.Dashboard }))
);
const Lending = lazy(() =>
  import("./pages/Lending").then((module) => ({ default: module.Lending }))
);
const Borrowing = lazy(() =>
  import("./pages/Borrowing").then((module) => ({ default: module.Borrowing }))
);
const Profile = lazy(() =>
  import("./pages/Profile").then((module) => ({ default: module.Profile }))
);
const PersonalExpenses = lazy(() =>
  import("./pages/PersonalExpenses").then((module) => ({
    default: module.PersonalExpenses,
  }))
);
const Interest = lazy(() =>
  import("./pages/Interest").then((module) => ({ default: module.Interest }))
);
const PersonalEarnings = lazy(() =>
  import("./pages/PersonalEarnings").then((module) => ({
    default: module.PersonalEarnings,
  }))
);
const Other = lazy(() =>
  import("./pages/Other").then((module) => ({ default: module.Other }))
);
const Login = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.Login }))
);
const Register = lazy(() =>
  import("./pages/Register").then((module) => ({ default: module.Register }))
);

type Page =
  | "dashboard"
  | "lending"
  | "borrowing"
  | "profile"
  | "expenses"
  | "interest"
  | "earnings"
  | "other";

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Suspense fallback={<LoadingScreen />}>
            <Dashboard />
          </Suspense>
        );
      case "lending":
        return (
          <Suspense fallback={<LoadingScreen />}>
            <Lending />
          </Suspense>
        );
      case "borrowing":
        return (
          <Suspense fallback={<LoadingScreen />}>
            <Borrowing />
          </Suspense>
        );
      case "profile":
        return (
          <Suspense fallback={<LoadingScreen />}>
            <Profile />
          </Suspense>
        );
      case "expenses":
        return (
          <Suspense fallback={<LoadingScreen />}>
            <PersonalExpenses />
          </Suspense>
        );
      case "interest":
        return (
          <Suspense fallback={<LoadingScreen />}>
            <Interest />
          </Suspense>
        );
      case "earnings":
        return (
          <Suspense fallback={<LoadingScreen />}>
            <PersonalEarnings />
          </Suspense>
        );
      case "other":
        return (
          <Suspense fallback={<LoadingScreen />}>
            <Other />
          </Suspense>
        );
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Register />
            </Suspense>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <Navbar
                    currentPage={currentPage}
                    onNavigate={setCurrentPage}
                  />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPage}
                      variants={pageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                    >
                      {renderPage()}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Background Effects */}
                <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                  <motion.div
                    className="absolute top-1/4 -left-48 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                    animate={{
                      scale: [1.2, 1, 1.2],
                      opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
