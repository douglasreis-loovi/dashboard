import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, AlertCircle, AlertOctagon, Ghost, BarChart3 } from 'lucide-react';

import historicoDados from './data/historico.json';
import './App.css';

const App: React.FC = () => {
  // Pega o snapshot de hoje gerado pelo Python
  const hoje = historicoDados[historicoDados.length - 1] || {
    "total_analisado": 0, "mais_7_dias": 0, "mais_15_dias": 0, "mais_30_dias": 0, "mais_90_dias": 0
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>⚡ Zeus Analytics | <span>Monitoramento Loovi</span></h1>
      </header>

      <main className="main-content">
        {/* GRID DOS 5 CARDS */}
        <div className="kpi-grid">
          <div className="kpi-card total">
            <div className="kpi-header">
              <BarChart3 size={20} />
              <h3>Total Analisado</h3>
            </div>
            <p className="kpi-value">{hoje.total_analisado}</p>
          </div>

          <div className="kpi-card info">
            <div className="kpi-header">
              <Activity size={20} />
              <h3>&gt; 7 Dias</h3>
            </div>
            <p className="kpi-value">{hoje.mais_7_dias}</p>
          </div>

          <div className="kpi-card warning">
            <div className="kpi-header">
              <AlertCircle size={20} />
              <h3>&gt; 15 Dias</h3>
            </div>
            <p className="kpi-value">{hoje.mais_15_dias}</p>
          </div>

          <div className="kpi-card alert">
            <div className="kpi-header">
              <AlertOctagon size={20} />
              <h3>&gt; 30 Dias</h3>
            </div>
            <p className="kpi-value">{hoje.mais_30_dias}</p>
          </div>

          <div className="kpi-card danger">
            <div className="kpi-header">
              <Ghost size={20} />
              <h3>&gt; 90 Dias</h3>
            </div>
            <p className="kpi-value">{hoje.mais_90_dias}</p>
          </div>
        </div>

        {/* GRÁFICO DE HISTÓRICO */}
        <div className="chart-container">
          <h2>Tendência de Desconexão (Histórico)</h2>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <LineChart data={historicoDados} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="data" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend />
                <Line type="monotone" name="Total Analisado" dataKey="total_analisado" stroke="#94a3b8" strokeWidth={2} dot={false} />
                <Line type="monotone" name="> 15 Dias" dataKey="mais_15_dias" stroke="#facc15" strokeWidth={2} />
                <Line type="monotone" name="> 30 Dias" dataKey="mais_30_dias" stroke="#f97316" strokeWidth={3} />
                <Line type="monotone" name="> 90 Dias" dataKey="mais_90_dias" stroke="#ef4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;