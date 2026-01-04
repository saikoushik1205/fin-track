import { motion } from "framer-motion";
import type { Person } from "../types";
import { User, TrendingUp } from "lucide-react";

interface PersonCardProps {
  person: Person;
  onClick: () => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person, onClick }) => {
  const isBorrower = person.type === "borrower";
  const progress = (person.amountReturned / person.totalAmount) * 100;

  return (
    <motion.div
      className="glass-card-hover p-6 cursor-pointer"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className={`p-3 rounded-xl ${
              isBorrower ? "bg-green-500/20" : "bg-red-500/20"
            }`}
          >
            <User
              className={`w-6 h-6 ${
                isBorrower ? "text-green-400" : "text-red-400"
              }`}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-dark-50">{person.name}</h3>
            <p className="text-sm text-dark-400">
              {person.transactions.length} transaction
              {person.transactions.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            person.remainingBalance === 0
              ? "bg-green-500/20 text-green-400"
              : "bg-amber-500/20 text-amber-400"
          }`}
        >
          {person.remainingBalance === 0 ? "Settled" : "Active"}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-dark-400 text-sm">Total Amount</span>
          <span className="text-xl font-bold text-dark-50">
            ₹{person.totalAmount.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-dark-400 text-sm">Returned</span>
          <span className="text-lg font-semibold text-green-400">
            ₹{person.amountReturned.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex justify-between items-baseline">
          <span className="text-dark-400 text-sm">Remaining</span>
          <span
            className={`text-lg font-semibold ${
              isBorrower ? "text-green-400" : "text-red-400"
            }`}
          >
            ₹{person.remainingBalance.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="pt-2">
          <div className="flex justify-between text-xs text-dark-400 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-full ${
                isBorrower
                  ? "bg-gradient-to-r from-green-500 to-emerald-400"
                  : "bg-gradient-to-r from-red-500 to-rose-400"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {person.remainingBalance > 0 && (
        <div className="mt-4 flex items-center justify-center space-x-2 text-primary-400 text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>Click to view details</span>
        </div>
      )}
    </motion.div>
  );
};
