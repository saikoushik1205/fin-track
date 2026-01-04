import { useState } from "react";
import { Modal } from "./Modal";
import type { Transaction } from "../types";

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, "id">) => void;
  type: "lending" | "borrowing";
  initialData?: Transaction;
  prefilledPersonName?: string;
}

const TransactionFormInner: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  initialData,
  prefilledPersonName,
}) => {
  const [formData, setFormData] = useState({
    personName: initialData?.personName || prefilledPersonName || "",
    amount: initialData?.amount.toString() || "",
    date: initialData?.date
      ? new Date(initialData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    note: initialData?.note || "",
    status: (initialData?.status || "pending") as
      | "pending"
      | "partial"
      | "paid",
    amountReturned: initialData?.amountReturned?.toString() || "0",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      personName: formData.personName,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date),
      note: formData.note || undefined,
      status: formData.status,
      type,
      amountReturned: parseFloat(formData.amountReturned) || 0,
      parentId: initialData?.parentId,
    });

    onClose();
    setFormData({
      personName: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      note: "",
      status: "pending",
      amountReturned: "0",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${initialData ? "Edit" : "Add"} ${
        type === "lending" ? "Lending" : "Borrowing"
      } Transaction`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Person Name *
          </label>
          <input
            type="text"
            required
            value={formData.personName}
            onChange={(e) => handleChange("personName", e.target.value)}
            className="input-field"
            placeholder="Enter person's name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Amount (₹) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
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
              required
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="input-field"
            >
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Amount Returned (₹)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.amountReturned}
              onChange={(e) => handleChange("amountReturned", e.target.value)}
              className="input-field"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Note (Optional)
          </label>
          <textarea
            value={formData.note}
            onChange={(e) => handleChange("note", e.target.value)}
            className="input-field resize-none"
            rows={3}
            placeholder="Add a note about this transaction..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {initialData ? "Update" : "Add"} Transaction
          </button>
        </div>
      </form>
    </Modal>
  );
};

export const TransactionForm: React.FC<TransactionFormProps> = (props) => {
  // Use a key to force component re-mount when props change
  const key = `${props.initialData?.id || "new"}-${
    props.prefilledPersonName || "none"
  }-${props.isOpen}`;
  return <TransactionFormInner key={key} {...props} />;
};
