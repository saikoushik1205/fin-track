import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Wallet,
  Building2,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  FileText,
} from "lucide-react";
import { useApp } from "../hooks/useApp";
import type { OtherBalance, OtherTransaction } from "../types";

export const Other = () => {
  const {
    otherBalances,
    addOtherBalance,
    updateOtherBalance,
    deleteOtherBalance,
    addOtherTransaction,
    updateOtherTransaction,
    deleteOtherTransaction,
  } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedBalanceId, setSelectedBalanceId] = useState<string | null>(
    null
  );
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<
    string | null
  >(null);
  const [formData, setFormData] = useState({
    type: "cash" as "cash" | "bank",
    amount: "",
    label: "",
  });
  const [transactionFormData, setTransactionFormData] = useState({
    type: "credit" as "credit" | "debit",
    note: "",
    amount: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.label) return;

    if (editingId) {
      updateOtherBalance(editingId, {
        type: formData.type,
        amount: parseFloat(formData.amount),
        label: formData.label,
      });
      setEditingId(null);
    } else {
      addOtherBalance({
        type: formData.type,
        amount: parseFloat(formData.amount),
        label: formData.label,
      });
    }

    setFormData({ type: "cash", amount: "", label: "" });
    setShowForm(false);
  };

  const handleEdit = (balance: OtherBalance) => {
    setFormData({
      type: balance.type,
      amount: balance.amount.toString(),
      label: balance.label,
    });
    setEditingId(balance.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this balance entry?")) {
      deleteOtherBalance(id);
    }
  };

  const handleSelectBalance = (balanceId: string) => {
    setSelectedBalanceId(balanceId);
    setShowTransactionForm(false);
    setEditingTransactionId(null);
  };

  const handleAddTransaction = (balanceId: string) => {
    setSelectedBalanceId(balanceId);
    setShowTransactionForm(true);
    setEditingTransactionId(null);
    setTransactionFormData({ type: "credit", note: "", amount: "" });
  };

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !selectedBalanceId ||
      !transactionFormData.amount ||
      !transactionFormData.note
    )
      return;

    if (editingTransactionId) {
      updateOtherTransaction(selectedBalanceId, editingTransactionId, {
        type: transactionFormData.type,
        note: transactionFormData.note,
        amount: parseFloat(transactionFormData.amount),
        date: new Date(),
      });
      setEditingTransactionId(null);
    } else {
      addOtherTransaction(selectedBalanceId, {
        type: transactionFormData.type,
        note: transactionFormData.note,
        amount: parseFloat(transactionFormData.amount),
        date: new Date(),
      });
    }

    setTransactionFormData({ type: "credit", note: "", amount: "" });
    setShowTransactionForm(false);
  };

  const handleEditTransaction = (
    balanceId: string,
    transaction: OtherTransaction
  ) => {
    setSelectedBalanceId(balanceId);
    setTransactionFormData({
      type: transaction.type,
      note: transaction.note,
      amount: transaction.amount.toString(),
    });
    setEditingTransactionId(transaction.id);
    setShowTransactionForm(true);
  };

  const handleDeleteTransaction = (
    balanceId: string,
    transactionId: string
  ) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteOtherTransaction(balanceId, transactionId);
    }
  };

  const cashBalances = otherBalances.filter((b) => b.type === "cash");
  const bankBalances = otherBalances.filter((b) => b.type === "bank");
  const totalCash = cashBalances.reduce((sum, b) => sum + b.amount, 0);
  const totalBank = bankBalances.reduce((sum, b) => sum + b.amount, 0);
  const totalBalance = totalCash + totalBank;

  const selectedBalance = otherBalances.find((b) => b.id === selectedBalanceId);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <h1 className="text-5xl font-bold gradient-text mb-3">
          Cash & Bank Balances
        </h1>
        <p className="text-slate-400 text-lg">
          Track your cash and bank account balances separately
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <Wallet className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-slate-300 font-semibold">Total Cash</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            ₹{totalCash.toLocaleString("en-IN")}
          </p>
        </motion.div>

        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-slate-300 font-semibold">Total Bank</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            ₹{totalBank.toLocaleString("en-IN")}
          </p>
        </motion.div>

        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Wallet className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-slate-300 font-semibold">Total Balance</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            ₹{totalBalance.toLocaleString("en-IN")}
          </p>
        </motion.div>
      </div>

      {/* Add Button */}
      <motion.button
        onClick={() => setShowForm(!showForm)}
        className="btn-primary flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-5 h-5" />
        {showForm ? "Cancel" : "Add Balance Entry"}
      </motion.button>

      {/* Form */}
      {showForm && (
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">
            {editingId ? "Edit" : "Add"} Balance Entry
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-300 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as "cash" | "bank",
                  })
                }
                className="input-field"
                required
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank Account</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 mb-2">Label</label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                placeholder="e.g., Personal Cash, SBI Account, etc."
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-2">Amount (₹)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="Enter amount"
                className="input-field"
                step="0.01"
                required
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1">
                {editingId ? "Update" : "Add"} Balance
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ type: "cash", amount: "", label: "" });
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Cash Balances */}
      {cashBalances.length > 0 && (
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Wallet className="w-6 h-6 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Cash Balances</h2>
          </div>
          <div className="space-y-3">
            {cashBalances.map((balance, index) => (
              <motion.div
                key={balance.id}
                className={`glass-card p-4 cursor-pointer transition-all ${
                  selectedBalanceId === balance.id
                    ? "ring-2 ring-emerald-500"
                    : ""
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => handleSelectBalance(balance.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">
                      {balance.label}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {balance.transactions.length} transaction
                      {balance.transactions.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-3">
                      <span className="text-2xl font-bold text-emerald-400">
                        ₹{balance.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddTransaction(balance.id);
                      }}
                      className="p-2 hover:bg-emerald-500/20 rounded-lg transition"
                      title="Add Transaction"
                    >
                      <Plus className="w-4 h-4 text-emerald-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(balance);
                      }}
                      className="p-2 hover:bg-slate-700 rounded-lg transition"
                    >
                      <Edit2 className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(balance.id);
                      }}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Bank Balances */}
      {bankBalances.length > 0 && (
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Bank Accounts</h2>
          </div>
          <div className="space-y-3">
            {bankBalances.map((balance, index) => (
              <motion.div
                key={balance.id}
                className={`glass-card p-4 cursor-pointer transition-all ${
                  selectedBalanceId === balance.id ? "ring-2 ring-blue-500" : ""
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => handleSelectBalance(balance.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">
                      {balance.label}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      {balance.transactions.length} transaction
                      {balance.transactions.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-3">
                      <span className="text-2xl font-bold text-blue-400">
                        ₹{balance.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddTransaction(balance.id);
                      }}
                      className="p-2 hover:bg-blue-500/20 rounded-lg transition"
                      title="Add Transaction"
                    >
                      <Plus className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(balance);
                      }}
                      className="p-2 hover:bg-slate-700 rounded-lg transition"
                    >
                      <Edit2 className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(balance.id);
                      }}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {otherBalances.length === 0 && !showForm && (
        <motion.div
          className="glass-card p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Wallet className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-300 mb-2">
            No Balance Entries Yet
          </h3>
          <p className="text-slate-400 mb-6">
            Start tracking your cash and bank account balances
          </p>
        </motion.div>
      )}

      {/* Transaction Form */}
      <AnimatePresence>
        {showTransactionForm && selectedBalance && (
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">
              {editingTransactionId ? "Edit" : "Add"} Transaction -{" "}
              {selectedBalance.label}
            </h3>
            <form onSubmit={handleTransactionSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-300 mb-2">Type</label>
                <select
                  value={transactionFormData.type}
                  onChange={(e) =>
                    setTransactionFormData({
                      ...transactionFormData,
                      type: e.target.value as "credit" | "debit",
                    })
                  }
                  className="input-field"
                  required
                >
                  <option value="credit">Credit (Money In)</option>
                  <option value="debit">Debit (Money Out)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Description</label>
                <input
                  type="text"
                  value={transactionFormData.note}
                  onChange={(e) =>
                    setTransactionFormData({
                      ...transactionFormData,
                      note: e.target.value,
                    })
                  }
                  placeholder="e.g., Salary, Grocery, etc."
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-2">Amount (₹)</label>
                <input
                  type="number"
                  value={transactionFormData.amount}
                  onChange={(e) =>
                    setTransactionFormData({
                      ...transactionFormData,
                      amount: e.target.value,
                    })
                  }
                  placeholder="Enter amount"
                  className="input-field"
                  step="0.01"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1">
                  {editingTransactionId ? "Update" : "Add"} Transaction
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTransactionForm(false);
                    setEditingTransactionId(null);
                    setTransactionFormData({
                      type: "credit",
                      note: "",
                      amount: "",
                    });
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions Display */}
      {selectedBalance && (
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">
                {selectedBalance.label} - Transactions
              </h2>
            </div>
            <button
              onClick={() => handleAddTransaction(selectedBalance.id)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
          </div>

          {selectedBalance.transactions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedBalance.transactions
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    className="glass-card-hover p-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`p-2 rounded-lg ${
                            transaction.type === "credit"
                              ? "bg-emerald-500/20"
                              : "bg-red-500/20"
                          }`}
                        >
                          {transaction.type === "credit" ? (
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">
                            {transaction.note}
                          </h3>
                          <p className="text-slate-400 text-sm">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xl font-bold ${
                            transaction.type === "credit"
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {transaction.type === "credit" ? "+" : "-"}₹
                          {transaction.amount.toLocaleString("en-IN")}
                        </span>
                        <button
                          onClick={() =>
                            handleEditTransaction(
                              selectedBalance.id,
                              transaction
                            )
                          }
                          className="p-2 hover:bg-slate-700 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4 text-slate-400" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteTransaction(
                              selectedBalance.id,
                              transaction.id
                            )
                          }
                          className="p-2 hover:bg-red-500/20 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};
