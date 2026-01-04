import React from "react";
import { generateTransactionsPDF } from "../services/pdfService";

interface Transaction {
  _id?: string;
  name?: string;
  description?: string;
  amount: number;
  date: string | Date;
}

interface ExportPDFButtonProps {
  personName: string;
  transactions: Transaction[];
  type: "borrowed" | "lent";
}

const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({
  personName,
  transactions,
}) => {
  const handleExport = () => {
    if (!transactions || transactions.length === 0) {
      alert("No transactions to export");
      return;
    }
    generateTransactionsPDF(personName, transactions);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
      title="Export transactions to PDF"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      Export PDF
    </button>
  );
};

export default ExportPDFButton;
