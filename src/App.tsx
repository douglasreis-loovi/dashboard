import React, { useState } from 'react';
import { Activity, AlertCircle, AlertOctagon, Ghost, BarChart3, Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';

import historicoDados from './data/historico.json';
import dispositivosDados from './data/dispositivos.json';
import './App.css';

const App: React.FC = () => {
  const hoje = historicoDados[historicoDados.length - 1] || {
    "data": "Hoje", "total_analisado": 0, "mais_7_dias": 0, "mais_15_dias": 0, "mais_30_dias": 0, "mais_90_dias": 0
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Filtra os dados de acordo com o que for digitado
  const filteredData = dispositivosDados.filter((item: any) => {
    const imeiMatch = String(item.imei).toLowerCase().includes(searchTerm.toLowerCase());
    const contratoMatch = String(item.contrato_natural).toLowerCase().includes(searchTerm.toLowerCase());
    return imeiMatch || contratoMatch;
  });

  // Lógica de Paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Volta pra primeira página ao pesquisar
  };

  // 🚀 Lógica do Botão Exportar (Gera um CSV seguro)
  const exportToExcel = () => {
    const headers = ['IMEI', 'Chave Natural', 'Ultima Comunicacao'];
    const csvRows = [headers.join(',')];
    
    filteredData.forEach((item: any) => {
      const imei = item.imei || 'N/A';
      const contrato = item.contrato_natural || 'N/A';
      const data = item.ultima_localizacao || 'Sem Dados';
      // Aspas garantem que vírgulas no meio do texto não quebrem as colunas do Excel
      csvRows.push(`"${imei}","${contrato}","${data}"`);
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `zeus_extracao_${hoje.data}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>⚡ Zeus Analytics | <span>Monitoramento Loovi</span></h1>
      </header>

      <main className="main-content">
        {/* GRID DE CARDS */}
        <div className="kpi-grid">
          <div className="kpi-card total">
            <div className="kpi-header"><BarChart3 size={20} /><h3>Total Analisado</h3></div>
            <p className="kpi-value">{hoje.total_analisado}</p>
          </div>
          <div className="kpi-card info">
            <div className="kpi-header"><Activity size={20} /><h3>&gt; 7 Dias</h3></div>
            <p className="kpi-value">{hoje.mais_7_dias}</p>
          </div>
          <div className="kpi-card warning">
            <div className="kpi-header"><AlertCircle size={20} /><h3>&gt; 15 Dias</h3></div>
            <p className="kpi-value">{hoje.mais_15_dias}</p>
          </div>
          <div className="kpi-card alert">
            <div className="kpi-header"><AlertOctagon size={20} /><h3>&gt; 30 Dias</h3></div>
            <p className="kpi-value">{hoje.mais_30_dias}</p>
          </div>
          <div className="kpi-card danger">
            <div className="kpi-header"><Ghost size={20} /><h3>&gt; 90 Dias</h3></div>
            <p className="kpi-value">{hoje.mais_90_dias}</p>
          </div>
        </div>

        {/* ÁREA DA TABELA */}
        <div className="table-section">
          <div className="table-header">
            <h2>Investigação de Dispositivos</h2>
            
            <div className="table-actions">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Buscar IMEI ou Chave..." 
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <button className="export-btn" onClick={exportToExcel} title="Exportar para Excel">
                <Download size={18} />
                <span>Exportar</span>
              </button>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>IMEI</th>
                  <th>Chave Natural</th>
                  <th>Última Comunicação</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="font-mono">{item.imei}</td>
                      <td>{item.contrato_natural}</td>
                      <td>
                        <span className={`status-badge ${item.ultima_localizacao === 'Sem Dados na API' || item.ultima_localizacao === 'Sem Dados' ? 'offline' : 'online'}`}>
                          {item.ultima_localizacao}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="empty-state">Nenhum dispositivo encontrado para a sua busca.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINAÇÃO */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={18} /> Anterior
              </button>
              <span>Página {currentPage} de {totalPages}</span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Próxima <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;