import React, { useState } from 'react';

interface EventFlowFinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventFlowFinanceModal: React.FC<EventFlowFinanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activePanel, setActivePanel] = useState<'dashboard' | 'revenue' | 'payouts' | 'invoices' | 'cashflow'>('dashboard');

  if (!isOpen) return null;

  const chartData = [
    { m: 'Jan', rev: 48, exp: 28, prof: 20 },
    { m: 'Feb', rev: 62, exp: 34, prof: 28 },
    { m: 'Mar', rev: 78, exp: 42, prof: 36 },
    { m: 'Apr', rev: 92, exp: 48, prof: 44 },
    { m: 'May', rev: 110, exp: 56, prof: 54 },
    { m: 'Jun', rev: 125, exp: 62, prof: 63 },
  ];

  const invoices = [
    { id: 'INV-8821', client: 'Demo Guest', dest: 'Maui, Hawaii', amt: '$9,283.00', status: 'paid', date: 'Apr 15, 2026' },
    { id: 'INV-8820', client: 'Sarah Mitchell', dest: 'Maui, Hawaii', amt: '$8,450.00', status: 'paid', date: 'Apr 12, 2026' },
    { id: 'INV-8819', client: 'James & Rachel Torres', dest: 'Sedona, AZ', amt: '$6,200.00', status: 'paid', date: 'Apr 05, 2026' },
    { id: 'INV-8818', client: 'Harrison Croft', dest: 'Costa Rica', amt: '$12,400.00', status: 'sched', date: 'May 01, 2026' },
    { id: 'INV-8817', client: 'Elena Rostova', dest: 'Tuscany, Italy', amt: '$15,800.00', status: 'pend', date: 'May 10, 2026' },
  ];

  return (
    <div id="ef-finance" className="portal show" style={{ display: 'block' }}>
      <button className="ef-close-btn" onClick={onClose} type="button">
        Exit Finance &#x2715;
      </button>

      <div className="ef-wrap">
        <div className="ef-sidebar">
          <div className="ef-sidebar-logo">
            <span className="ef-logo-ic">&#128200;</span>
            <div>
              <div className="ef-logo-t">EventFlow</div>
              <div className="ef-logo-s">Finance &amp; P&amp;L Suite</div>
            </div>
          </div>

          <div
            className={`ef-nav-item ${activePanel === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActivePanel('dashboard')}
          >
            <span className="ef-nav-ic">&#128181;</span> Executive P&amp;L
          </div>
          <div
            className={`ef-nav-item ${activePanel === 'revenue' ? 'active' : ''}`}
            onClick={() => setActivePanel('revenue')}
          >
            <span className="ef-nav-ic">&#127974;</span> Retreat Revenue
          </div>
          <div
            className={`ef-nav-item ${activePanel === 'payouts' ? 'active' : ''}`}
            onClick={() => setActivePanel('payouts')}
          >
            <span className="ef-nav-ic">&#128274;</span> Escrow Payouts
          </div>
          <div
            className={`ef-nav-item ${activePanel === 'invoices' ? 'active' : ''}`}
            onClick={() => setActivePanel('invoices')}
          >
            <span className="ef-nav-ic">&#128196;</span> Invoices &amp; Receipts
          </div>
          <div
            className={`ef-nav-item ${activePanel === 'cashflow' ? 'active' : ''}`}
            onClick={() => setActivePanel('cashflow')}
          >
            <span className="ef-nav-ic">&#128202;</span> Cash Flow Model
          </div>
        </div>

        <div className="ef-main">
          <div className="ef-ph">Retreat Portfolio Financial Operations</div>
          <div className="ef-psub">2026 Fiscal Performance &middot; Multi-Currency AES-256 Escrow Ledger</div>

          {/* KPI Row */}
          <div className="ef-kpi-row">
            <div className="ef-kpi">
              <div className="ef-kpi-lbl">Total Gross Retreat GMV</div>
              <div className="ef-kpi-val">$412,890</div>
              <div className="ef-kpi-chg">+24.8% vs last month</div>
            </div>
            <div className="ef-kpi">
              <div className="ef-kpi-lbl">Net Platform Revenue (25%)</div>
              <div className="ef-kpi-val" style={{ color: 'var(--gold)' }}>$103,222</div>
              <div className="ef-kpi-chg">+31.2% EBITDA margin</div>
            </div>
            <div className="ef-kpi">
              <div className="ef-kpi-lbl">Active Escrow Balance</div>
              <div className="ef-kpi-val" style={{ color: '#7EC87A' }}>$142,500</div>
              <div className="ef-kpi-chg">14 retreats currently held</div>
            </div>
            <div className="ef-kpi">
              <div className="ef-kpi-lbl">Avg Retreat Booking Value</div>
              <div className="ef-kpi-val">$8,620</div>
              <div className="ef-kpi-chg">Avg 4.8 nights · 2.4 guests</div>
            </div>
          </div>

          {/* Bar Chart Section */}
          <div className="ef-chart-wrap">
            <div className="ef-chart-hdr">
              <div className="ef-chart-title">2026 Monthly Cash Flow &amp; Profit Margins ($K)</div>
              <div className="ef-chart-legend">
                <span><i style={{ background: 'var(--gold)' }}></i> Gross Bookings</span>
                <span><i style={{ background: '#e74c3c' }}></i> Venue &amp; Specialist Costs</span>
                <span><i style={{ background: '#7EC87A' }}></i> Net Platform Profit</span>
              </div>
            </div>

            <div className="ef-bar-chart">
              {chartData.map((d) => (
                <div key={d.m} className="ef-bar-grp">
                  <div className="ef-bar-inner">
                    <div className="ef-bar rev" style={{ height: `${d.rev * 0.75}px` }} title={`Rev: $${d.rev}K`} />
                    <div className="ef-bar exp" style={{ height: `${d.exp * 0.75}px` }} title={`Exp: $${d.exp}K`} />
                    <div className="ef-bar prof" style={{ height: `${d.prof * 0.75}px` }} title={`Profit: $${d.prof}K`} />
                  </div>
                  <div className="ef-bar-lbl">{d.m}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoices Table */}
          <div className="ef-sect-hdr">&#128196; Real-Time Client Invoices &amp; Escrow Holds</div>
          <table className="ef-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client Guest</th>
                <th>Destination</th>
                <th>Issue Date</th>
                <th>Total GMV</th>
                <th>Escrow Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td><strong>{inv.id}</strong></td>
                  <td>{inv.client}</td>
                  <td>{inv.dest}</td>
                  <td>{inv.date}</td>
                  <td><strong style={{ color: 'var(--gold)' }}>{inv.amt}</strong></td>
                  <td>
                    <span className={`ef-badge ${inv.status}`}>
                      {inv.status === 'paid' ? 'Escrow Cleared' : inv.status === 'sched' ? 'Scheduled' : 'Pending Verification'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="cp-btn"
                      onClick={() => alert(`Generating Official PDF Invoice for ${inv.id} — ${inv.client} (${inv.dest})`)}
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="ef-export-row">
            <button
              type="button"
              className="ef-export-btn"
              onClick={() => alert('Exporting complete Sanctuary 2026 General Ledger (CSV)...')}
            >
              &#128196; Export Master General Ledger (CSV)
            </button>
            <button
              type="button"
              className="ef-export-btn"
              onClick={() => alert('Downloading Official CPA Certified P&L Statement (PDF)...')}
            >
              &#128200; Download Certified P&amp;L Statement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
