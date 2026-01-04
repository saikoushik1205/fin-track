import { motion } from "framer-motion";
import { useApp } from "../hooks/useApp";
import { useAuth } from "../hooks/useAuth";
import { StatCard } from "../components/StatCard";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Users,
  PieChart as PieChartIcon,
  Activity,
  PercentSquare,
  DollarSign,
  ShoppingBag,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Dashboard = () => {
  const {
    getDashboardStats,
    getChartData,
    getInterestStats,
    getPersonalEarningsStats,
    getExpenseStats,
    expenses,
  } = useApp();
  const { user } = useAuth();
  const isSpecialUser = user?.email === "koushiksai242@gmail.com";
  const stats = getDashboardStats();
  const chartData = getChartData();
  const interestStats = getInterestStats();
  const earningsStats = getPersonalEarningsStats();
  const expenseStats = getExpenseStats();

  const pieData = [
    { name: "Lent", value: stats.totalLent, color: "#10b981" },
    { name: "Borrowed", value: stats.totalBorrowed, color: "#ef4444" },
  ];

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
        <motion.h1
          className="text-5xl font-bold gradient-text mb-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Financial Overview
        </motion.h1>
        <motion.p
          className="text-slate-400 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Track your lending and borrowing activities
        </motion.p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delayChildren: 0.3,
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
        >
          <StatCard
            title="Money Lent"
            value={stats.totalLent}
            icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
            gradient="bg-gradient-to-br from-emerald-500 to-green-400"
          />
        </motion.div>
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
        >
          <StatCard
            title="Money Borrowed"
            value={stats.totalBorrowed}
            icon={<TrendingDown className="w-6 h-6 text-red-400" />}
            gradient="bg-gradient-to-br from-red-500 to-rose-400"
          />
        </motion.div>
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
        >
          <StatCard
            title="Net Balance"
            value={stats.netBalance}
            icon={<Wallet className="w-6 h-6 text-indigo-400" />}
            gradient="bg-gradient-to-br from-indigo-500 to-purple-400"
            prefix={stats.netBalance >= 0 ? "+₹" : "-₹"}
          />
        </motion.div>
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 },
          }}
        >
          <StatCard
            title="Active People"
            value={stats.activePeopleCount}
            icon={<Users className="w-6 h-6 text-amber-400" />}
            gradient="bg-gradient-to-br from-amber-500 to-orange-400"
            prefix=""
          />
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delayChildren: 0.8,
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {/* Line Chart */}
        <motion.div
          className="glass-card p-6 relative overflow-hidden"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1 },
          }}
        >
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          <div className="flex items-center space-x-3 mb-6 relative z-10">
            <motion.div
              className="p-2.5 rounded-xl bg-indigo-500/20 backdrop-blur-sm"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Activity className="w-5 h-5 text-indigo-400" />
            </motion.div>
            <h2 className="text-xl font-bold text-white">
              Money Flow (Last 30 Days)
            </h2>
          </div>

          {chartData.some((d) => d.lending > 0 || d.borrowing > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <YAxis
                  stroke="#64748b"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#f1f5f9",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="lending"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="borrowing"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: "#ef4444", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-dark-400">
              No transaction data available
            </div>
          )}
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <PieChartIcon className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-dark-50">Distribution</h2>
          </div>

          {stats.totalLent > 0 || stats.totalBorrowed > 0 ? (
            <div className="flex items-center justify-between">
              <ResponsiveContainer width="60%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#f1f5f9",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-4">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <div>
                      <p className="text-dark-400 text-sm">{entry.name}</p>
                      <p className="font-semibold text-dark-50">
                        ₹{entry.value.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-dark-400">
              No distribution data available
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Interest, Earnings & Expenses Summary */}
      <div
        className={`grid grid-cols-1 ${
          isSpecialUser ? "lg:grid-cols-3" : "lg:grid-cols-2"
        } gap-6`}
      >
        {/* Interest Section - Only for special user */}
        {isSpecialUser && (
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <PercentSquare className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-dark-50">
                Interest Summary
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 glass-card">
                <div>
                  <p className="text-dark-400 text-xs mb-1">Total Principal</p>
                  <p className="text-xl font-bold text-blue-400">
                    ₹{interestStats.totalPrincipal.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Wallet className="w-5 h-5 text-blue-400" />
                </div>
              </div>

              <div className="flex justify-between items-center p-3 glass-card">
                <div>
                  <p className="text-dark-400 text-xs mb-1">Interest Earned</p>
                  <p className="text-xl font-bold text-green-400">
                    ₹{interestStats.totalInterestEarned.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-green-500/20">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
              </div>

              <div className="flex justify-between items-center p-3 glass-card">
                <div>
                  <p className="text-dark-400 text-xs mb-1">Transactions</p>
                  <p className="text-xl font-bold text-primary-400">
                    {interestStats.totalTransactions}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-primary-500/20">
                  <Activity className="w-5 h-5 text-primary-400" />
                </div>
              </div>

              {interestStats.totalPrincipal > 0 && (
                <div className="p-3 glass-card bg-primary-500/10">
                  <p className="text-xs text-dark-400 mb-1">Avg Rate</p>
                  <p className="text-lg font-bold text-primary-300">
                    {(
                      (interestStats.totalInterestEarned /
                        interestStats.totalPrincipal) *
                      100
                    ).toFixed(2)}
                    %
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Personal Earnings Section - For ALL users */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-green-500/20">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-dark-50">Earnings Summary</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 glass-card">
              <div>
                <p className="text-dark-400 text-xs mb-1">Total Earned</p>
                <p className="text-xl font-bold text-green-400">
                  ₹{earningsStats.totalEarned.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-500/20">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
            </div>

            <div className="flex justify-between items-center p-3 glass-card">
              <div>
                <p className="text-dark-400 text-xs mb-1">Income Sources</p>
                <p className="text-xl font-bold text-primary-400">
                  {earningsStats.totalSources}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-primary-500/20">
                <Users className="w-5 h-5 text-primary-400" />
              </div>
            </div>

            <div className="flex justify-between items-center p-3 glass-card">
              <div>
                <p className="text-dark-400 text-xs mb-1">This Month</p>
                <p className="text-xl font-bold text-blue-400">
                  ₹{earningsStats.monthlyTotal.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/20">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
            </div>

            {earningsStats.totalSources > 0 && (
              <div className="p-3 glass-card bg-purple-500/10">
                <p className="text-xs text-dark-400 mb-1">Avg per Source</p>
                <p className="text-lg font-bold text-purple-300">
                  ₹
                  {Math.round(
                    earningsStats.totalEarned / earningsStats.totalSources
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Personal Expenses Section */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg bg-red-500/20">
              <ShoppingBag className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-dark-50">Expenses Summary</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 glass-card">
              <div>
                <p className="text-dark-400 text-xs mb-1">Total Expenses</p>
                <p className="text-xl font-bold text-red-400">
                  ₹{expenseStats.totalExpenses.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-red-500/20">
                <ShoppingBag className="w-5 h-5 text-red-400" />
              </div>
            </div>

            <div className="flex justify-between items-center p-3 glass-card">
              <div>
                <p className="text-dark-400 text-xs mb-1">Categories</p>
                <p className="text-xl font-bold text-primary-400">
                  {expenseStats.categoryBreakdown.length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-primary-500/20">
                <PieChartIcon className="w-5 h-5 text-primary-400" />
              </div>
            </div>

            <div className="flex justify-between items-center p-3 glass-card">
              <div>
                <p className="text-dark-400 text-xs mb-1">This Month</p>
                <p className="text-xl font-bold text-orange-400">
                  ₹{expenseStats.monthlyTotal.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-orange-500/20">
                <TrendingDown className="w-5 h-5 text-orange-400" />
              </div>
            </div>

            {expenses.length > 0 && (
              <div className="p-3 glass-card bg-yellow-500/10">
                <p className="text-xs text-dark-400 mb-1">Avg per Expense</p>
                <p className="text-lg font-bold text-yellow-300">
                  ₹
                  {Math.round(
                    expenseStats.totalExpenses / expenses.length
                  ).toLocaleString("en-IN")}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
