import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState, useMemo } from "react";
import { getAnimationConfig } from "../utils/performance";

interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  gradient: string;
  prefix?: string;
  trend?: number;
}

const AnimatedCounter = ({
  value,
  prefix,
}: {
  value: number;
  prefix: string;
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 1500;
    const startValue = 0;
    const endValue = Math.abs(value);

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = startValue + (endValue - startValue) * easeOutQuart;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <>
      {prefix}
      {Math.round(displayValue).toLocaleString("en-IN")}
    </>
  );
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  gradient,
  prefix = "₹",
  trend,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const animConfig = useMemo(() => getAnimationConfig(), []);

  return (
    <motion.div
      className="glass-card-hover p-6 relative overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: animConfig.duration * 1.2,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        scale: 1.03,
        rotateY: 2,
        rotateX: 2,
        transition: { duration: animConfig.duration * 0.6 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
    >
      {/* Animated glow background */}
      <motion.div
        className={`absolute top-0 right-0 w-40 h-40 ${gradient} blur-3xl rounded-full`}
        initial={{ opacity: 0.1 }}
        animate={{
          opacity: isHovered ? 0.25 : 0.1,
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "100%" : "-100%" }}
        transition={{ duration: 0.8 }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-400 text-sm font-semibold tracking-wide uppercase">
            {title}
          </span>
          <motion.div
            className={`p-3 rounded-2xl ${gradient} bg-opacity-20 backdrop-blur-sm`}
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0,
            }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{
                scale: isHovered ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 0.6,
                repeat: isHovered ? Infinity : 0,
                repeatDelay: 0.5,
              }}
            >
              {icon}
            </motion.div>
          </motion.div>
        </div>

        <div className="space-y-3">
          <motion.div
            className="text-4xl font-bold text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              textShadow: "0 0 30px rgba(99, 102, 241, 0.3)",
            }}
          >
            <AnimatedCounter value={value} prefix={prefix} />
          </motion.div>

          {trend !== undefined && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className={`flex items-center gap-2 text-sm font-medium ${
                trend >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              <motion.span
                animate={{ y: trend >= 0 ? [-2, 0, -2] : [2, 0, 2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-lg"
              >
                {trend >= 0 ? "↑" : "↓"}
              </motion.span>
              <span>{Math.abs(trend)}% from last month</span>
              {trend >= 0 && (
                <motion.div
                  className="w-2 h-2 rounded-full bg-emerald-400"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
