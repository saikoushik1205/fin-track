import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../hooks/useApp";
import { PersonCard } from "../components/PersonCard";
import { TransactionCard } from "../components/TransactionCard";
import { TransactionForm } from "../components/TransactionForm";
import { Modal } from "../components/Modal";
import { EmptyState } from "../components/EmptyState";
import ExportPDFButton from "../components/ExportPDFButton";
import {
  Plus,
  Search,
  TrendingUp,
  Users as UsersIcon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { Transaction } from "../types";

export const Lending = () => {
  const { addTransaction, updateTransaction, deleteTransaction, getPeople } =
    useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [prefilledPersonName, setPrefilledPersonName] = useState<string | null>(
    null
  );
  const [expandedTransactions, setExpandedTransactions] = useState<Set<string>>(
    new Set()
  );

  const borrowers = getPeople("borrower");
  const filteredBorrowers = borrowers.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedBorrower = borrowers.find((p) => p.name === selectedPerson);

  const totalLent = borrowers.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalReturned = borrowers.reduce((sum, p) => sum + p.amountReturned, 0);
  const totalPending = borrowers.reduce(
    (sum, p) => sum + p.remainingBalance,
    0
  );

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = (transactionId: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(transactionId);
    }
  };

  const handleAddSubTransaction = (parentTransaction: Transaction) => {
    setPrefilledPersonName(parentTransaction.personName);
    setEditingTransaction({
      ...parentTransaction,
      id: "",
      amount: 0,
      note: "",
      date: new Date(),
      status: "pending",
      amountReturned: 0,
      parentId: parentTransaction.id,
    } as Transaction);
    setIsFormOpen(true);
  };

  const toggleExpand = (transactionId: string) => {
    setExpandedTransactions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(transactionId)) {
        newSet.delete(transactionId);
      } else {
        newSet.add(transactionId);
      }
      return newSet;
    });
  };

  const handleDeletePerson = (personName: string) => {
    const person = borrowers.find((p) => p.name === personName);
    if (!person) return;

    if (
      confirm(
        `Are you sure you want to delete ${personName} and all ${person.transactions.length} transaction(s)?`
      )
    ) {
      person.transactions.forEach((t) => deleteTransaction(t.id));
      setSelectedPerson(null);
    }
  };

  const handleAddTransactionForPerson = (personName: string) => {
    setPrefilledPersonName(personName);
    setSelectedPerson(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (transaction: Omit<Transaction, "id">) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, transaction);
      setEditingTransaction(null);
    } else {
      addTransaction(transaction);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
    setPrefilledPersonName(null);
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
            Lending Portal
          </h1>
          <p className="text-dark-400">Track money you've lent to others</p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Lending</span>
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
              <p className="text-dark-400 text-sm mb-1">Total Lent</p>
              <p className="text-3xl font-bold text-green-400">
                ₹{totalLent.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20">
              <TrendingUp className="w-6 h-6 text-green-400" />
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
              <p className="text-dark-400 text-sm mb-1">Total Returned</p>
              <p className="text-3xl font-bold text-primary-400">
                ₹{totalReturned.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-primary-500/20">
              <TrendingUp className="w-6 h-6 text-primary-400" />
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
              <p className="text-dark-400 text-sm mb-1">Pending Amount</p>
              <p className="text-3xl font-bold text-amber-400">
                ₹{totalPending.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/20">
              <UsersIcon className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      {borrowers.length > 0 && (
        <motion.div
          className="glass-card p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search borrowers..."
              className="w-full pl-12 pr-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </motion.div>
      )}

      {/* Borrowers Grid */}
      {filteredBorrowers.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredBorrowers.map((person, index) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <PersonCard
                person={person}
                onClick={() => setSelectedPerson(person.name)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          title={searchQuery ? "No borrowers found" : "No lending records yet"}
          description={
            searchQuery
              ? "Try adjusting your search query"
              : "Start tracking by adding your first lending transaction"
          }
          actionLabel={!searchQuery ? "Add Lending" : undefined}
          onAction={!searchQuery ? () => setIsFormOpen(true) : undefined}
        />
      )}

      {/* Transaction Form Modal */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        type="lending"
        initialData={editingTransaction || undefined}
        prefilledPersonName={prefilledPersonName || undefined}
      />

      {/* Person Details Modal */}
      <Modal
        isOpen={!!selectedPerson && !!selectedBorrower}
        onClose={() => setSelectedPerson(null)}
        title={selectedBorrower?.name || ""}
        size="lg"
      >
        {selectedBorrower && (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() =>
                  handleAddTransactionForPerson(selectedBorrower.name)
                }
                className="btn-primary flex items-center space-x-2 flex-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Transaction</span>
              </button>
              <ExportPDFButton
                personName={selectedBorrower.name}
                transactions={selectedBorrower.transactions}
                type="lent"
              />
              <button
                onClick={() => handleDeletePerson(selectedBorrower.name)}
                className="btn-secondary bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center space-x-2"
              >
                <span>Delete All</span>
              </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card p-4">
                <p className="text-dark-400 text-sm mb-1">Total Lent</p>
                <p className="text-2xl font-bold text-dark-50">
                  ₹{selectedBorrower.totalAmount.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="glass-card p-4">
                <p className="text-dark-400 text-sm mb-1">Returned</p>
                <p className="text-2xl font-bold text-green-400">
                  ₹{selectedBorrower.amountReturned.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="glass-card p-4">
                <p className="text-dark-400 text-sm mb-1">Remaining</p>
                <p className="text-2xl font-bold text-amber-400">
                  ₹{selectedBorrower.remainingBalance.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Transactions */}
            <div>
              <h3 className="text-lg font-semibold text-dark-50 mb-4">
                Transaction History
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedBorrower.transactions
                  .filter((t) => !t.parentId)
                  .map((transaction) => {
                    const childTransactions =
                      selectedBorrower.transactions.filter(
                        (t) => t.parentId === transaction.id
                      );
                    const isExpanded = expandedTransactions.has(transaction.id);
                    const hasChildren = childTransactions.length > 0;

                    return (
                      <div key={transaction.id} className="space-y-2">
                        <div className="flex items-start gap-2">
                          {hasChildren && (
                            <button
                              onClick={() => toggleExpand(transaction.id)}
                              className="mt-2 p-1 hover:bg-dark-700/50 rounded transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5 text-dark-400" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-dark-400" />
                              )}
                            </button>
                          )}
                          <div className="flex-1">
                            <TransactionCard
                              key={transaction.id}
                              transaction={transaction}
                              showActions={true}
                              onEdit={() => handleEdit(transaction)}
                              onDelete={() => handleDelete(transaction.id)}
                            />
                            {!hasChildren && (
                              <button
                                onClick={() =>
                                  handleAddSubTransaction(transaction)
                                }
                                className="mt-2 text-xs text-primary-400 hover:text-primary-300 flex items-center space-x-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Sub-Transaction</span>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Child Transactions */}
                        <AnimatePresence>
                          {isExpanded && hasChildren && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="ml-8 space-y-2 overflow-hidden"
                            >
                              {childTransactions.map((childTransaction) => (
                                <TransactionCard
                                  key={childTransaction.id}
                                  transaction={childTransaction}
                                  showActions={true}
                                  onEdit={() => handleEdit(childTransaction)}
                                  onDelete={() =>
                                    handleDelete(childTransaction.id)
                                  }
                                />
                              ))}
                              <button
                                onClick={() =>
                                  handleAddSubTransaction(transaction)
                                }
                                className="text-xs text-primary-400 hover:text-primary-300 flex items-center space-x-1 ml-4"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Sub-Transaction</span>
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
