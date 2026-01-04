import { motion } from "framer-motion";
import type { Transaction } from "../types";
import { format } from "date-fns";
import {
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onClick,
  onEdit,
  onDelete,
  showActions = false,
}) => {
  const isLending = transaction.type === "lending";
  const progress =
    ((transaction.amountReturned || 0) / transaction.amount) * 100;

  const getStatusIcon = () => {
    switch (transaction.status) {
      case "paid":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "partial":
        return <Clock className="w-5 h-5 text-amber-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusText = () => {
    switch (transaction.status) {
      case "paid":
        return "Settled";
      case "partial":
        return "Partial";
      default:
        return "Pending";
    }
  };

  return (
    <motion.div
      className="glass-card-hover p-4 cursor-pointer"
      onClick={onClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`p-3 rounded-xl ${
              isLending ? "bg-green-500/20" : "bg-red-500/20"
            }`}
          >
            {isLending ? (
              <ArrowUpRight className="w-5 h-5 text-green-400" />
            ) : (
              <ArrowDownRight className="w-5 h-5 text-red-400" />
            )}
          </div>

          <div>
            <h4 className="font-semibold text-dark-50">
              {transaction.personName}
            </h4>
            <p className="text-sm text-dark-400">
              {format(new Date(transaction.date), "MMM dd, yyyy")}
            </p>
          </div>
        </div>

        <div className="text-right space-y-1">
          <div
            className={`text-xl font-bold ${
              isLending ? "text-green-400" : "text-red-400"
            }`}
          >
            {isLending ? "+" : "-"}₹{transaction.amount.toLocaleString("en-IN")}
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-xs text-dark-400">{getStatusText()}</span>
          </div>
        </div>
      </div>

      {transaction.status !== "paid" && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-dark-400 mb-1">
            <span>
              Returned: ₹
              {(transaction.amountReturned || 0).toLocaleString("en-IN")}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-full ${isLending ? "bg-green-400" : "bg-red-400"}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {transaction.note && (
        <p className="mt-3 text-sm text-dark-400 italic">
          "{transaction.note}"
        </p>
      )}

      {showActions && (
        <div className="mt-4 flex items-center gap-2 pt-4 border-t border-dark-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span className="text-sm font-semibold">Edit</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span className="text-sm font-semibold">Delete</span>
          </button>
        </div>
      )}
    </motion.div>
  );
};
