import React, { useState } from 'react';
import { X, Copy, Check, Download, Printer, FileSpreadsheet, Share2, Store } from 'lucide-react';
import { PartyPlan } from '../types';

interface ExportShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PartyPlan;
}

export const ExportShareModal: React.FC<ExportShareModalProps> = ({
  isOpen,
  onClose,
  plan,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate plain text format
  const generatePlainText = () => {
    let text = `🛒 CYMBALMART PARTY SHOPPING LIST: ${plan.title.toUpperCase()}\n`;
    text += `Occasion: ${plan.occasion} | Theme: ${plan.theme}\n`;
    text += `Headcount: ${plan.totalGuests} (${plan.adultCount} adults, ${plan.kidCount} kids) | Budget: $${plan.budget}\n`;
    text += `===========================================\n\n`;

    // Group by department
    const deptMap = new Map<string, typeof plan.shoppingList>();
    plan.shoppingList.forEach((item) => {
      const dept = item.department || 'Produce';
      if (!deptMap.has(dept)) deptMap.set(dept, []);
      deptMap.get(dept)!.push(item);
    });

    deptMap.forEach((items, deptName) => {
      text += `📍 DEPT: ${deptName.toUpperCase()}\n`;
      items.forEach((item) => {
        const box = item.isPurchased ? '[x]' : '[ ]';
        const brandTag = item.isStoreBrand ? ' [Cymbal Brand]' : '';
        const aisleTag = item.aisle ? ` (${item.aisle})` : '';
        text += `  ${box} ${item.name}${brandTag} - ${item.quantity} ${item.unit} (~$${item.estimatedCost})${aisleTag}${item.notes ? ` [Tip: ${item.notes}]` : ''}\n`;
      });
      text += `\n`;
    });

    const total = plan.shoppingList.reduce((a, b) => a + (b.estimatedCost || 0), 0);
    text += `===========================================\n`;
    text += `Total Estimated Cart: $${total.toFixed(2)} (Target Budget: $${plan.budget})\n`;
    text += `Curated by CymbalMart Party Planner Shopping Agent`;
    return text;
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(generatePlainText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    const headers = ['Department', 'Aisle', 'Category', 'Item Name', 'Store Brand', 'Quantity', 'Unit', 'Estimated Cost ($)', 'Priority', 'Purchased', 'Notes'];
    const rows = plan.shoppingList.map((item) => [
      `"${item.department || 'Produce'}"`,
      `"${item.aisle || ''}"`,
      item.category,
      `"${item.name.replace(/"/g, '""')}"`,
      item.isStoreBrand ? 'YES' : 'NO',
      item.quantity,
      `"${item.unit}"`,
      item.estimatedCost,
      item.priority,
      item.isPurchased ? 'YES' : 'NO',
      `"${(item.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${plan.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_cymbalmart_list.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Export & Share CymbalMart Shopping List
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-2.5">
            <button
              onClick={handleCopyText}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/60 transition cursor-pointer"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {copied ? 'Copied!' : 'Copy to Text'}
              </span>
            </button>

            <button
              onClick={handleDownloadCSV}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/60 transition cursor-pointer"
            >
              <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Download CSV
              </span>
            </button>

            <button
              onClick={handlePrint}
              className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/60 transition cursor-pointer"
            >
              <Printer className="w-5 h-5 text-blue-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Print Sheet
              </span>
            </button>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Shareable Text Preview
            </label>
            <textarea
              readOnly
              rows={9}
              value={generatePlainText()}
              className="w-full bg-slate-50 dark:bg-slate-950 font-mono text-[11px] p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-950/40">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
