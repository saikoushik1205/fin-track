import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        className="text-center space-y-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>

        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">FinTrack</h2>
          <p className="text-dark-400">Loading your financial data...</p>
        </div>

        <div className="flex items-center justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-primary-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};
