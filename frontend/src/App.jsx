// ==============================================================================
// File: frontend/src/App.jsx
// Description: Interactive Causal ML Dashboard & Multi-Tier ($0, $10, $20, $30) 
//              Discount Optimization Sandbox
// ==============================================================================

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  DollarSign,
  Users,
  TrendingUp,
  Award,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle,
} from 'lucide-react';

export default function App() {
  // Budget simulation state
  const [budget, setBudget] = useState(5000);
  const [costPerDiscount, setCostPerDiscount] = useState(10);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Customer inference input form state
  const [formData, setFormData] = useState({
    age: 35,
    session_duration: 120,
    pages_viewed: 6,
    customer_rating: 4.2,
    product_price: 100,
  });
  const [inferenceResult, setInferenceResult] = useState(null);
  const [inferring, setInferring] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, [budget, costPerDiscount]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
       https://econocausal-backend.onrender.com/api/dashboard-data?budget=${budget}&cost_per_discount=${costPerDiscount}
      );
      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }
      const data = await res.json();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRunInference = async (e) => {
    e.preventDefault();
    try {
      setInferring(true);
      const res = await fetch('https://econocausal-backend.onrender.com/api/recommend-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        age: parseInt(formData.age, 10),
        session_duration: parseFloat(formData.session_duration),
        pages_viewed: parseInt(formData.pages_viewed, 10),
        customer_rating: parseFloat(formData.customer_rating),
        product_price: parseFloat(formData.product_price),
        }),
      });
      if (!res.ok) {
        throw new Error(`Inference call failed with status: ${res.status}`);
      }
      const result = await res.json();
      setInferenceResult(result);
    } catch (err) {
      console.error('Inference error:', err);
    } finally {
      setInferring(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans">
      {/* 1. Header Bar */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">
              Live Causal Engine Connected
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-300 to-indigo-500 mt-1">
            EconoCausal: Dynamic Pricing Platform
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Double Machine Learning (LinearDML) & Multi-Tier Discount Optimization
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-lg text-sm text-slate-300 transition-all hover:bg-slate-800 cursor-pointer"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Sync State
        </button>
      </header>

      {error ? (
        <div className="p-6 bg-red-950/40 border border-red-800 rounded-xl text-red-200">
          <p className="font-semibold">Failed to connect to backend engine</p>
          <p className="text-sm text-red-400 mt-1">{error}</p>
          <p className="text-xs text-slate-500 mt-3">
            Verify that FastAPI backend is running via: <code>uvicorn main:app --reload --port 8000</code> inside the <code>backend/</code> folder.
          </p>
        </div>
      ) : (
        <>
          {/* 2. Budget Controls */}
          <section className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 mb-8 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
              <div>
                <h2 className="text-sm font-semibold tracking-wider text-slate-300 uppercase">
                  Budget & Incentive Parameters
                </h2>
                <p className="text-xs text-slate-500">
                  Simulate allocation decisions in real-time across the customer population
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-slate-400">Allocated Budget:</span>
                <span className="text-2xl font-black text-sky-400">
                  ${budget.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <div className="md:col-span-3">
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="250"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                  <span>$500</span>
                  <span>$7,500</span>
                  <span>$15,000</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Cost Per Voucher</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500 text-sm">$</span>
                  <input
                    type="number"
                    value={costPerDiscount}
                    onChange={(e) => setCostPerDiscount(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-7 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 3. Executive KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Allocated Spend</p>
                <p className="text-2xl font-bold mt-0.5">${dashboardData?.kpis.budget.toLocaleString() || 0}</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Targeted Persuadables</p>
                <p className="text-2xl font-bold mt-0.5">
                  {dashboardData?.kpis.targeted_customers || 0}{' '}
                  <span className="text-xs text-slate-500 font-normal">
                    / {dashboardData?.kpis.total_customers || 0}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Incremental Conversions</p>
                <p className="text-2xl font-bold text-emerald-400 mt-0.5">
                  +{dashboardData?.kpis.incremental_orders || 0}
                </p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                <Award size={24} />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">ROI Advantage</p>
                <p className="text-2xl font-bold text-amber-400 mt-0.5">
                  {dashboardData?.kpis.roi_multiplier || 1.0}x
                </p>
              </div>
            </div>
          </div>

          {/* 4. Uplift Curve & Top Persuadables Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-200">Cumulative Uplift / Qini Curve</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Incremental conversions gained vs random campaign targeting
                  </p>
                </div>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dashboardData?.uplift_curve || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis
                      dataKey="population_pct"
                      stroke="#64748b"
                      unit="%"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.5rem',
                      }}
                      itemStyle={{ fontSize: 12 }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                    <Line
                      type="monotone"
                      dataKey="causal"
                      name="EconoCausal Policy"
                      stroke="#38bdf8"
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="random"
                      name="Random Baseline"
                      stroke="#f97316"
                      strokeDasharray="4 4"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-200">Top Persuadables</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Highest individual treatment uplift (ITE) ranked customers
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-300">
                    <thead className="bg-slate-950/80 text-slate-400 text-xs uppercase border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Customer ID</th>
                        <th className="py-2.5 px-3">Uplift</th>
                        <th className="py-2.5 px-3">Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                      {dashboardData?.top_customers.map((c) => (
                        <tr key={c.Customer_ID} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 text-slate-300">{c.Customer_ID}</td>
                          <td className="py-2.5 px-3 text-emerald-400 font-semibold">
                            +{(Number(c.ite_uplift) * 100).toFixed(2)}%
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px] font-sans">
                              DISCOUNT
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Optimization Engine:</span>
                <span className="font-mono text-slate-400">SciPy linprog (HiGHS)</span>
              </div>
            </div>
          </div>

          {/* 5. Multi-Discount Dynamic Pricing Sandbox */}
          <section className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-indigo-400" size={20} />
              <h3 className="text-lg font-bold text-slate-200">
                Multi-Discount Dynamic Pricing Sandbox
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Simulate individual customer response across $0, $10, $20, and $30 discounts to prescribe the optimal profit-maximizing voucher.
            </p>

            <form
              onSubmit={handleRunInference}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6"
            >
              <div>
                <label className="text-xs text-slate-400 block mb-1">Customer Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Session Duration (Sec)</label>
                <input
                  type="number"
                  value={formData.session_duration}
                  onChange={(e) =>
                    setFormData({ ...formData, session_duration: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Pages Viewed</label>
                <input
                  type="number"
                  value={formData.pages_viewed}
                  onChange={(e) =>
                    setFormData({ ...formData, pages_viewed: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Rating (1 - 5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={formData.customer_rating}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_rating: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Product Price ($)</label>
                <input
                  type="number"
                  step="1"
                  min="10"
                  value={formData.product_price}
                  onChange={(e) =>
                    setFormData({ ...formData, product_price: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  required
                />
              </div>

              <div className="sm:col-span-2 md:col-span-5 mt-2">
                <button
                  type="submit"
                  disabled={inferring}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Search size={16} />
                  {inferring ? 'Evaluating Uplift across tiers...' : 'Evaluate $10, $20, $30 Scenarios'}
                </button>
              </div>
            </form>

            {/* Inference Multi-Tier Results */}
            {inferenceResult && (
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 mt-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-slate-800 gap-3">
                  <div>
                    <span className="text-xs text-indigo-400 uppercase font-semibold tracking-wider">
                      Prescriptive Recommendation
                    </span>
                    <h4 className="text-xl font-extrabold text-white mt-1">
                      {inferenceResult.recommendation}
                    </h4>
                  </div>
                  <div className="bg-indigo-950/40 border border-indigo-700/50 px-4 py-2 rounded-xl text-xs text-slate-300">
                    Recommended Discount:{' '}
                    <strong className="text-indigo-400 text-sm ml-1 font-mono">
                      ${inferenceResult.optimal_discount}
                    </strong>
                  </div>
                </div>

                {/* 4-Card Comparison Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  {inferenceResult.scenarios.map((tier) => {
                    const isOptimal = tier.discount === inferenceResult.optimal_discount;
                    return (
                      <div
                        key={tier.discount}
                        className={`p-5 rounded-xl border transition-all ${
                          isOptimal
                            ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/40 shadow-xl'
                            : 'bg-slate-900 border-slate-800 opacity-80'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-slate-300 uppercase">
                            {tier.discount === 0 ? 'Baseline ($0)' : `$${tier.discount} Discount`}
                          </span>
                          {isOptimal && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-semibold border border-emerald-500/30">
                              OPTIMAL ROI
                            </span>
                          )}
                        </div>

                        <div className="mt-2">
                          <span className="text-xs text-slate-500 block">Purchase Probability</span>
                          <span
                            className={`text-2xl font-black ${
                              isOptimal ? 'text-indigo-300' : 'text-slate-200'
                            }`}
                          >
                            {tier.probability_pct}%
                          </span>
                        </div>

                        <div className="mt-3 text-xs text-slate-400 space-y-1.5">
                          <div className="flex justify-between">
                            <span>Uplift Gain:</span>
                            <span className="text-emerald-400 font-semibold font-mono">
                              +{tier.uplift_pct}%
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-slate-800 pt-1.5 mt-1">
                            <span>Expected Profit:</span>
                            <span className="text-amber-400 font-bold font-mono">
                              ${tier.expected_profit}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}