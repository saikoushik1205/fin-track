import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../hooks/useApp";
import {
  Plus,
  Search,
  Wallet,
  TrendingDown,
  Calendar,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Modal } from "../components/Modal";
import type { Expense } from "../types";

export const PersonalExpenses = () => {
  const {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseStats,
  } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [parentExpenseId, setParentExpenseId] = useState<string | null>(null);
  const [expandedExpenses, setExpandedExpenses] = useState<Set<string>>(
    new Set()
  );

  const stats = getExpenseStats();

  // Group expenses by parent-child relationship
  const groupedExpenses = expenses.reduce((acc, expense) => {
    if (!expense.parentId) {
      // This is a parent or standalone expense
      const children = expenses.filter((e) => e.parentId === expense.id);
      acc.push({ ...expense, children });
    }
    return acc;
  }, [] as Expense[]);

  const filteredExpenses = groupedExpenses.filter((expense) => {
    const matchesSearch =
      expense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "all",
    ...Array.from(new Set(expenses.map((e) => e.category))),
  ];

  const toggleExpand = (expenseId: string) => {
    const newExpanded = new Set(expandedExpenses);
    if (newExpanded.has(expenseId)) {
      newExpanded.delete(expenseId);
    } else {
      newExpanded.add(expenseId);
    }
    setExpandedExpenses(newExpanded);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setParentExpenseId(null);
    setIsFormOpen(true);
  };

  const handleAddChild = (parentId: string) => {
    setParentExpenseId(parentId);
    setEditingExpense(null);
    setIsFormOpen(true);
  };

  const handleDelete = (expenseId: string) => {
    const children = expenses.filter((e) => e.parentId === expenseId);

    if (children.length > 0) {
      if (
        confirm(
          `Are you sure you want to delete this expense and its ${children.length} sub-transaction(s)?`
        )
      ) {
        children.forEach((child) => deleteExpense(child.id));
        deleteExpense(expenseId);
      }
    } else {
      if (confirm("Are you sure you want to delete this expense?")) {
        deleteExpense(expenseId);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const expenseData: Partial<Expense> & {
      title: string;
      amount: number;
      category: string;
      date: Date;
    } = {
      title: formData.get("title") as string,
      amount: parseFloat(formData.get("amount") as string),
      category: formData.get("category") as string,
      date: new Date(formData.get("date") as string),
      note: (formData.get("note") as string) || undefined,
      paymentMethod: (formData.get("paymentMethod") as string) || undefined,
    };

    if (parentExpenseId) {
      expenseData.parentId = parentExpenseId;
    }

    if (editingExpense) {
      updateExpense(editingExpense.id, expenseData);
    } else {
      addExpense(expenseData);
    }

    setIsFormOpen(false);
    setEditingExpense(null);
    setParentExpenseId(null);
    e.currentTarget.reset();
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingExpense(null);
    setParentExpenseId(null);
  };

  const getTotalWithChildren = (expense: Expense): number => {
    const childrenTotal = (expense.children || []).reduce(
      (sum, child) => sum + child.amount,
      0
    );
    return expense.amount + childrenTotal;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Personal Expenses
          </h1>
          <p className="text-dark-400">
            Track and manage your personal spending
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Expense</span>
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Total Expenses</p>
              <p className="text-3xl font-bold text-red-400">
                ₹{stats.totalExpenses.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/20">
              <Wallet className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">This Month</p>
              <p className="text-3xl font-bold text-amber-400">
                ₹{stats.monthlyTotal.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/20">
              <Calendar className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Total Categories</p>
              <p className="text-3xl font-bold text-primary-400">
                {stats.categoryBreakdown.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-primary-500/20">
              <TrendingDown className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Breakdown */}
      {stats.categoryBreakdown.length > 0 && (
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-dark-50 mb-4">
            Category Breakdown
          </h3>
          <div className="space-y-3">
            {stats.categoryBreakdown.map((cat, index) => {
              const percentage = (cat.amount / stats.totalExpenses) * 100;
              return (
                <div key={cat.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-dark-300">{cat.category}</span>
                    <span className="text-dark-50 font-semibold">
                      ₹{cat.amount.toLocaleString("en-IN")} (
                      {percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-dark-800 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.1 * index }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Search and Filter */}
      {expenses.length > 0 && (
        <motion.div
          className="glass-card p-4 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expenses..."
              className="w-full pl-12 pr-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedCategory === cat
                    ? "bg-primary-500 text-white"
                    : "bg-dark-800/50 text-dark-300 hover:bg-dark-700"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Expenses List */}
      {filteredExpenses.length > 0 ? (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {filteredExpenses.map((expense, index) => {
            const hasChildren = expense.children && expense.children.length > 0;
            const isExpanded = expandedExpenses.has(expense.id);
            const totalAmount = getTotalWithChildren(expense);

            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                {/* Parent Expense */}
                <div className="glass-card-hover p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {hasChildren && (
                            <button
                              onClick={() => toggleExpand(expense.id)}
                              className="p-1 hover:bg-dark-700 rounded transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-dark-400" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-dark-400" />
                              )}
                            </button>
                          )}
                          <div>
                            <h3 className="text-lg font-bold text-dark-50">
                              {expense.title}
                              {hasChildren && (
                                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-400">
                                  {expense.children?.length} items
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-dark-400">
                              {expense.category} •{" "}
                              {new Date(expense.date).toLocaleDateString(
                                "en-IN"
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {hasChildren && (
                            <button
                              onClick={() => handleAddChild(expense.id)}
                              className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                              title="Add sub-transaction"
                            >
                              <Plus className="w-4 h-4 text-green-400" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(expense)}
                            className="p-2 hover:bg-primary-500/20 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-primary-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(expense.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {expense.note && (
                            <p className="text-sm text-dark-400 mb-1">
                              {expense.note}
                            </p>
                          )}
                          {expense.paymentMethod && (
                            <span className="text-xs px-2 py-1 rounded-full bg-dark-800 text-dark-300">
                              {expense.paymentMethod}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          {hasChildren && (
                            <p className="text-xs text-dark-400 mb-1">
                              Base: ₹{expense.amount.toLocaleString("en-IN")}
                            </p>
                          )}
                          <p className="text-2xl font-bold text-red-400">
                            ₹{totalAmount.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {/* Add Sub-transaction button for expenses without children */}
                      {!hasChildren && (
                        <button
                          onClick={() => handleAddChild(expense.id)}
                          className="mt-3 text-sm text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add sub-transaction</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Child Expenses */}
                <AnimatePresence>
                  {hasChildren && isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-8 mt-2 space-y-2"
                    >
                      {expense.children?.map((child) => (
                        <motion.div
                          key={child.id}
                          className="glass-card p-4 border-l-2 border-primary-500/50"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="text-base font-semibold text-dark-50">
                                    {child.title}
                                  </h4>
                                  <p className="text-xs text-dark-400">
                                    {new Date(child.date).toLocaleDateString(
                                      "en-IN"
                                    )}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleEdit(child)}
                                    className="p-1.5 hover:bg-primary-500/20 rounded-lg transition-colors"
                                  >
                                    <Edit2 className="w-3.5 h-3.5 text-primary-400" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(child.id)}
                                    className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {child.note && (
                                    <p className="text-xs text-dark-400">
                                      {child.note}
                                    </p>
                                  )}
                                  {child.paymentMethod && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-dark-800 text-dark-300">
                                      {child.paymentMethod}
                                    </span>
                                  )}
                                </div>
                                <p className="text-lg font-bold text-red-400">
                                  ₹{child.amount.toLocaleString("en-IN")}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          className="glass-card p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Wallet className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-dark-300 mb-2">
            {searchQuery || selectedCategory !== "all"
              ? "No expenses found"
              : "No expenses yet"}
          </h3>
          <p className="text-dark-400 mb-6">
            {searchQuery || selectedCategory !== "all"
              ? "Try adjusting your search or filter"
              : "Start tracking by adding your first expense"}
          </p>
          {!searchQuery && selectedCategory === "all" && (
            <button onClick={() => setIsFormOpen(true)} className="btn-primary">
              Add Your First Expense
            </button>
          )}
        </motion.div>
      )}

      {/* Expense Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        title={
          editingExpense
            ? "Edit Expense"
            : parentExpenseId
            ? "Add Sub-Transaction"
            : "Add Expense"
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              required
              defaultValue={editingExpense?.title}
              className="input-field"
              placeholder="e.g., Groceries, Fuel, Coffee"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Amount (₹) *
              </label>
              <input
                type="number"
                name="amount"
                required
                min="0"
                step="0.01"
                defaultValue={editingExpense?.amount}
                className="input-field"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                required
                defaultValue={
                  editingExpense?.date
                    ? new Date(editingExpense.date).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0]
                }
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Category *
              </label>
              <input
                type="text"
                name="category"
                required
                defaultValue={editingExpense?.category}
                className="input-field"
                placeholder="e.g., Food, Transport"
                list="categories"
              />
              <datalist id="categories">
                <option value="Food" />
                <option value="Transport" />
                <option value="Shopping" />
                <option value="Entertainment" />
                <option value="Bills" />
                <option value="Healthcare" />
                <option value="Education" />
                <option value="Other" />
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                defaultValue={editingExpense?.paymentMethod || ""}
                className="w-full px-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer appearance-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                <option
                  value=""
                  style={{ backgroundColor: "#1f2937", color: "#9ca3af" }}
                >
                  Select method
                </option>
                <option
                  value="UPI"
                  style={{ backgroundColor: "#1f2937", color: "#f3f4f6" }}
                >
                  UPI
                </option>
                <option
                  value="Cash"
                  style={{ backgroundColor: "#1f2937", color: "#f3f4f6" }}
                >
                  Cash
                </option>
                <option
                  value="Card"
                  style={{ backgroundColor: "#1f2937", color: "#f3f4f6" }}
                >
                  Card
                </option>
                <option
                  value="Other"
                  style={{ backgroundColor: "#1f2937", color: "#f3f4f6" }}
                >
                  Other
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Note (Optional)
            </label>
            <textarea
              name="note"
              defaultValue={editingExpense?.note}
              className="input-field min-h-[80px]"
              placeholder="Add any additional details..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleFormClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingExpense ? "Update" : "Add"} Expense
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
