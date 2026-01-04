import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "../hooks/useApp";
import {
  Plus,
  TrendingUp,
  Wallet,
  Users,
  Edit2,
  Trash2,
  Calendar,
  Search,
  PercentSquare,
} from "lucide-react";
import { Modal } from "../components/Modal";
import type { InterestTransaction } from "../types";

interface PersonInterest {
  name: string;
  totalPrincipal: number;
  totalInterest: number;
  totalAmount: number;
  transactionCount: number;
  transactions: InterestTransaction[];
}

export const Interest = () => {
  const {
    interestTransactions,
    addInterestTransaction,
    updateInterestTransaction,
    deleteInterestTransaction,
    getInterestStats,
  } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<InterestTransaction | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [prefilledPersonName, setPrefilledPersonName] = useState<string | null>(
    null
  );

  const stats = getInterestStats();

  // Group transactions by person
  const getPeopleWithInterest = (): PersonInterest[] => {
    const peopleMap = new Map<string, PersonInterest>();

    interestTransactions.forEach((transaction) => {
      const existing = peopleMap.get(transaction.personName);
      if (existing) {
        existing.totalPrincipal += transaction.principal;
        existing.totalInterest += transaction.interest;
        existing.totalAmount += transaction.totalAmount;
        existing.transactionCount += 1;
        existing.transactions.push(transaction);
      } else {
        peopleMap.set(transaction.personName, {
          name: transaction.personName,
          totalPrincipal: transaction.principal,
          totalInterest: transaction.interest,
          totalAmount: transaction.totalAmount,
          transactionCount: 1,
          transactions: [transaction],
        });
      }
    });

    return Array.from(peopleMap.values()).sort(
      (a, b) => b.totalAmount - a.totalAmount
    );
  };

  const people = getPeopleWithInterest();
  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const selectedPersonData = people.find((p) => p.name === selectedPerson);

  const handleEdit = (transaction: InterestTransaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDelete = (transactionId: string) => {
    if (confirm("Are you sure you want to delete this interest transaction?")) {
      deleteInterestTransaction(transactionId);
    }
  };

  const handleAddTransactionForPerson = (personName: string) => {
    setSelectedPerson(null);
    setPrefilledPersonName(personName);
    setIsFormOpen(true);
  };

  const handleDeletePerson = (personName: string) => {
    const person = people.find((p) => p.name === personName);
    if (!person) return;

    if (
      confirm(
        `Are you sure you want to delete all ${person.transactionCount} interest transaction(s) for ${personName}?`
      )
    ) {
      person.transactions.forEach((t) => deleteInterestTransaction(t.id));
      setSelectedPerson(null);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const principal = parseFloat(formData.get("principal") as string);
    const interest = parseFloat(formData.get("interest") as string);

    const transactionData = {
      personName: formData.get("personName") as string,
      principal,
      interest,
      totalAmount: principal + interest,
      date: new Date(formData.get("date") as string),
      remarks: (formData.get("remarks") as string) || undefined,
    };

    if (editingTransaction) {
      updateInterestTransaction(editingTransaction.id, transactionData);
    } else {
      addInterestTransaction(transactionData);
    }

    setIsFormOpen(false);
    setEditingTransaction(null);
    setPrefilledPersonName(null);
    e.currentTarget.reset();
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
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
            Interest Tracking
          </h1>
          <p className="text-dark-400">Manage your interest earnings</p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Interest</span>
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
              <p className="text-dark-400 text-sm mb-1">Total Principal</p>
              <p className="text-3xl font-bold text-blue-400">
                ₹{stats.totalPrincipal.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Wallet className="w-6 h-6 text-blue-400" />
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
              <p className="text-dark-400 text-sm mb-1">Interest Earned</p>
              <p className="text-3xl font-bold text-green-400">
                ₹{stats.totalInterestEarned.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </div>
          {stats.totalPrincipal > 0 && (
            <p className="text-xs text-dark-400 mt-2">
              Rate:{" "}
              {(
                (stats.totalInterestEarned / stats.totalPrincipal) *
                100
              ).toFixed(2)}
              %
            </p>
          )}
        </motion.div>

        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Total Transactions</p>
              <p className="text-3xl font-bold text-primary-400">
                {stats.totalTransactions}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-primary-500/20">
              <Users className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search Bar */}
      {people.length > 0 && (
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
              placeholder="Search people..."
              className="w-full pl-12 pr-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl text-dark-50 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </motion.div>
      )}

      {/* People Grid */}
      {filteredPeople.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredPeople.map((person, index) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="glass-card-hover p-6 cursor-pointer"
              onClick={() => setSelectedPerson(person.name)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-primary-500/20">
                    <PercentSquare className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-dark-50">
                      {person.name}
                    </h3>
                    <p className="text-sm text-dark-400">
                      {person.transactionCount} transaction
                      {person.transactionCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-400">
                  Active
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-dark-400 text-sm">Principal</span>
                  <span className="font-semibold text-blue-400">
                    ₹{person.totalPrincipal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-dark-400 text-sm">Interest</span>
                  <span className="font-semibold text-green-400">
                    ₹{person.totalInterest.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="h-px bg-dark-700" />
                <div className="flex justify-between items-center">
                  <span className="text-dark-400 text-sm font-semibold">
                    Total Amount
                  </span>
                  <span className="font-bold text-primary-400">
                    ₹{person.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button className="mt-4 w-full text-center text-sm text-primary-400 hover:text-primary-300 flex items-center justify-center space-x-1">
                <span>Click to view details</span>
              </button>
            </motion.div>
          ))}
        </motion.div>
      ) : people.length > 0 ? (
        <motion.div
          className="glass-card p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Search className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-dark-300 mb-2">
            No people found
          </h3>
          <p className="text-dark-400">Try adjusting your search query</p>
        </motion.div>
      ) : (
        <motion.div
          className="glass-card p-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <TrendingUp className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-dark-300 mb-2">
            No interest transactions yet
          </h3>
          <p className="text-dark-400 mb-6">
            Start tracking by adding your first interest transaction
          </p>
          <button onClick={() => setIsFormOpen(true)} className="btn-primary">
            Add Your First Transaction
          </button>
        </motion.div>
      )}

      {/* Interest Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        title={`${editingTransaction ? "Edit" : "Add"} Interest Transaction`}
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Person Name *
            </label>
            <input
              type="text"
              name="personName"
              required
              defaultValue={
                prefilledPersonName || editingTransaction?.personName
              }
              className="input-field"
              placeholder="Enter person's name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Principal Amount (₹) *
              </label>
              <input
                type="number"
                name="principal"
                required
                min="0"
                step="0.01"
                defaultValue={editingTransaction?.principal}
                className="input-field"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Interest (₹) *
              </label>
              <input
                type="number"
                name="interest"
                required
                min="0"
                step="0.01"
                defaultValue={editingTransaction?.interest}
                className="input-field"
                placeholder="0.00"
              />
            </div>
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
                editingTransaction?.date
                  ? new Date(editingTransaction.date)
                      .toISOString()
                      .split("T")[0]
                  : new Date().toISOString().split("T")[0]
              }
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Remarks (Optional)
            </label>
            <textarea
              name="remarks"
              defaultValue={editingTransaction?.remarks}
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
              {editingTransaction ? "Update" : "Add"} Transaction
            </button>
          </div>
        </form>
      </Modal>

      {/* Person Details Modal */}
      <Modal
        isOpen={!!selectedPerson && !!selectedPersonData}
        onClose={() => setSelectedPerson(null)}
        title={selectedPersonData?.name || ""}
        size="lg"
      >
        {selectedPersonData && (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() =>
                  handleAddTransactionForPerson(selectedPersonData.name)
                }
                className="btn-primary flex items-center space-x-2 flex-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Transaction</span>
              </button>
              <button
                onClick={() => handleDeletePerson(selectedPersonData.name)}
                className="btn-secondary bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center space-x-2"
              >
                <span>Delete All</span>
              </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card p-4">
                <p className="text-dark-400 text-sm mb-1">Total Principal</p>
                <p className="text-2xl font-bold text-blue-400">
                  ₹{selectedPersonData.totalPrincipal.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="glass-card p-4">
                <p className="text-dark-400 text-sm mb-1">Total Interest</p>
                <p className="text-2xl font-bold text-green-400">
                  ₹{selectedPersonData.totalInterest.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="glass-card p-4">
                <p className="text-dark-400 text-sm mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-primary-400">
                  ₹{selectedPersonData.totalAmount.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Transactions */}
            <div>
              <h3 className="text-lg font-semibold text-dark-50 mb-4">
                Transaction History
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedPersonData.transactions
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      className="glass-card p-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm text-dark-400 flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(transaction.date).toLocaleDateString(
                                "en-IN"
                              )}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="p-2 hover:bg-primary-500/20 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-primary-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-dark-400 mb-1">
                            Principal
                          </p>
                          <p className="text-sm font-semibold text-blue-400">
                            ₹{transaction.principal.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-dark-400 mb-1">Interest</p>
                          <p className="text-sm font-semibold text-green-400">
                            ₹{transaction.interest.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-dark-400 mb-1">Total</p>
                          <p className="text-sm font-semibold text-primary-400">
                            ₹{transaction.totalAmount.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {transaction.remarks && (
                        <p className="text-xs text-dark-400 italic mt-2">
                          "{transaction.remarks}"
                        </p>
                      )}
                    </motion.div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
