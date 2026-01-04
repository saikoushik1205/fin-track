import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Plus,
  Search,
  TrendingUp,
  Calendar,
  FileText,
  Trash2,
} from "lucide-react";
import { useApp } from "../hooks/useApp";
import { Modal } from "../components/Modal";
import type { PersonalEarning } from "../types";

interface SourceEarnings {
  sourceName: string;
  earnings: PersonalEarning[];
  totalAmount: number;
}

export const PersonalEarnings = () => {
  const {
    personalEarnings,
    addPersonalEarning,
    deletePersonalEarning,
    getPersonalEarningsStats,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedSource, setSelectedSource] = useState<SourceEarnings | null>(
    null
  );
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    sourceName: "",
    earningName: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    remarks: "",
  });
  const [isAddingToSource, setIsAddingToSource] = useState(false);

  const stats = getPersonalEarningsStats();

  // Group earnings by source
  const getSourcesWithEarnings = (): SourceEarnings[] => {
    const sourceMap = new Map<string, PersonalEarning[]>();

    personalEarnings.forEach((earning) => {
      const existing = sourceMap.get(earning.sourceName) || [];
      sourceMap.set(earning.sourceName, [...existing, earning]);
    });

    return Array.from(sourceMap.entries())
      .map(([sourceName, earnings]) => ({
        sourceName,
        earnings: earnings.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
        totalAmount: earnings.reduce((sum, e) => sum + e.amount, 0),
      }))
      .sort((a, b) => b.totalAmount - a.totalAmount);
  };

  const sources = getSourcesWithEarnings();
  const filteredSources = sources.filter((source) =>
    source.sourceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEarning = () => {
    if (
      !formData.sourceName.trim() ||
      !formData.earningName.trim() ||
      !formData.amount
    )
      return;

    const newEarning: PersonalEarning = {
      id: Date.now().toString(),
      sourceName: formData.sourceName.trim(),
      earningName: formData.earningName.trim(),
      amount: parseFloat(formData.amount),
      date: new Date(formData.date),
      remarks: formData.remarks.trim() || undefined,
    };

    addPersonalEarning(newEarning);
    setFormData({
      sourceName: "",
      earningName: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      remarks: "",
    });
    setShowFormModal(false);
    setIsAddingToSource(false);
  };

  const handleAddToSource = (sourceName: string) => {
    setFormData({
      sourceName,
      earningName: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      remarks: "",
    });
    setIsAddingToSource(true);
    setSelectedSource(null);
    setShowFormModal(true);
  };

  const handleViewSource = (source: SourceEarnings) => {
    setSelectedSource(source);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-dark-50"
        >
          Personal Earnings
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsAddingToSource(false);
            setFormData({
              sourceName: "",
              earningName: "",
              amount: "",
              date: new Date().toISOString().split("T")[0],
              remarks: "",
            });
            setShowFormModal(true);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Earning</span>
        </motion.button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Total Earned</p>
              <p className="text-2xl font-bold text-green-400">
                ₹{stats.totalEarned.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Income Sources</p>
              <p className="text-2xl font-bold text-primary-400">
                {stats.totalSources}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-primary-500/20">
              <TrendingUp className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">This Month</p>
              <p className="text-2xl font-bold text-blue-400">
                ₹{stats.monthlyTotal.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search income sources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-field pl-12 w-full"
        />
      </motion.div>

      {/* Sources Grid */}
      {filteredSources.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <DollarSign className="w-16 h-16 text-dark-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-dark-200 mb-2">
            No earnings yet
          </h3>
          <p className="text-dark-400">
            Start tracking your income by adding your first earning source
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredSources.map((source, index) => (
              <motion.div
                key={source.sourceName}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6 hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => handleViewSource(source)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-dark-50 mb-1 group-hover:text-primary-400 transition-colors">
                      {source.sourceName}
                    </h3>
                    <p className="text-sm text-dark-400">
                      {source.earnings.length} earning
                      {source.earnings.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-green-500/20">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-dark-700">
                  <p className="text-2xl font-bold text-green-400">
                    ₹{source.totalAmount.toLocaleString("en-IN")}
                  </p>
                  <p className="text-xs text-dark-400 mt-1">Total earned</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Source Details Modal */}
      <Modal
        isOpen={showModal && selectedSource !== null}
        onClose={() => {
          setShowModal(false);
          setSelectedSource(null);
        }}
        title={selectedSource?.sourceName || ""}
      >
        {selectedSource && (
          <div className="space-y-4">
            {/* Source Summary */}
            <div className="glass-card p-4 bg-green-500/10">
              <p className="text-sm text-dark-400 mb-1">Total from source</p>
              <p className="text-2xl font-bold text-green-400">
                ₹{selectedSource.totalAmount.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Add Earning to Source Button */}
            <button
              onClick={() => handleAddToSource(selectedSource.sourceName)}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Earning to This Source</span>
            </button>

            {/* Earnings List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedSource.earnings.map((earning) => (
                <div
                  key={earning.id}
                  className="glass-card p-4 hover:bg-dark-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-dark-50">
                        {earning.earningName}
                      </h4>
                      <p className="text-sm text-dark-400 flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(earning.date).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold text-green-400">
                        ₹{earning.amount.toLocaleString("en-IN")}
                      </p>
                      <button
                        onClick={() => deletePersonalEarning(earning.id)}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {earning.remarks && (
                    <div className="flex items-start gap-2 mt-2 pt-2 border-t border-dark-700">
                      <FileText className="w-4 h-4 text-dark-400 mt-0.5" />
                      <p className="text-sm text-dark-300">{earning.remarks}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Earning Form Modal */}
      <Modal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setIsAddingToSource(false);
        }}
        title={
          isAddingToSource
            ? `Add Earning to ${formData.sourceName}`
            : "Add New Earning"
        }
      >
        <div className="space-y-4">
          {!isAddingToSource && (
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Income Source Name
              </label>
              <input
                type="text"
                value={formData.sourceName}
                onChange={(e) =>
                  setFormData({ ...formData, sourceName: e.target.value })
                }
                placeholder="e.g., Freelance Work, Salary, Side Business"
                className="input-field w-full"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Earning Name
            </label>
            <input
              type="text"
              value={formData.earningName}
              onChange={(e) =>
                setFormData({ ...formData, earningName: e.target.value })
              }
              placeholder="e.g., Project Payment, Monthly Salary"
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              placeholder="0.00"
              className="input-field w-full"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Remarks (Optional)
            </label>
            <textarea
              value={formData.remarks}
              onChange={(e) =>
                setFormData({ ...formData, remarks: e.target.value })
              }
              placeholder="Any additional notes..."
              className="input-field w-full"
              rows={3}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => {
                setShowFormModal(false);
                setIsAddingToSource(false);
              }}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleAddEarning}
              disabled={
                !formData.sourceName.trim() ||
                !formData.earningName.trim() ||
                !formData.amount
              }
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Earning
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PersonalEarnings;
