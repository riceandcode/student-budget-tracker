import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Calendar, FileText } from 'lucide-react';

export default function App() {
  const [allowance, setAllowance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('budget-data');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAllowance(parsed.allowance || 0);
      setTransactions(parsed.transactions || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('budget-data', JSON.stringify({ allowance, transactions }));
  }, [allowance, transactions]);

  const expenses = transactions.reduce((sum, t) => sum + (t.amount < 0 ? Math.abs(t.amount) : 0), 0);
  const netBalance = allowance - expenses;

  return (
    <div className="min-h-screen p-8 text-notion-text font-serif">
      <header className="mb-12">
        <h1 className="text-4xl text-black font-bold mb-2">Student Budget Tracker</h1>
        <p className="text-sm">April 2026</p>
      </header>

      <div className="grid grid-cols-[300px,1fr] gap-12">
        {/* Sidebar */}
        <aside>
          <div className="bg-white p-6 rounded-lg border border-notion-border shadow-sm">
            <h2 className="text-sm font-semibold mb-4 text-black">Month Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between"><span>Allowance:</span> <span className="text-black">₹{allowance}</span></div>
              <div className="flex justify-between"><span>Expenses:</span> <span className="text-expense-red">₹{expenses}</span></div>
              <div className="border-t pt-2 mt-2 flex justify-between font-bold"><span>Balance:</span> <span className="text-black">₹{netBalance}</span></div>
            </div>
            <button
              onClick={() => setAllowance(prompt('Enter Income:') || allowance)}
              className="mt-6 w-full flex items-center justify-center gap-2 p-2 bg-black text-white rounded hover:bg-gray-800"
            >
              <PlusCircle size={16} /> Add Allowance
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main>
          <div className="bg-white p-6 rounded-lg border border-notion-border shadow-sm">
            <h2 className="text-sm font-semibold mb-6 text-black">Recent Transactions</h2>
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase border-b border-notion-border">
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Description</th>
                  <th className="pb-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} className="border-b border-notion-border last:border-0 hover:bg-gray-50">
                    <td className="py-3">{t.date}</td>
                    <td className="py-3">{t.desc}</td>
                    <td className={`py-3 ${t.amount < 0 ? 'text-expense-red' : 'text-allowance-green'}`}>
                      {t.amount > 0 ? '+' : ''}{t.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() => {
                const desc = prompt('Description:');
                const amount = parseFloat(prompt('Amount (+/-):'));
                if(desc && !isNaN(amount)) setTransactions([...transactions, { id: Date.now(), date: '2026-04-01', desc, amount }]);
              }}
              className="mt-4 flex items-center gap-2 text-sm text-notion-text hover:text-black"
            >
              <PlusCircle size={16} /> Add Transaction
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
