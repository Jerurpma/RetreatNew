import React, { useState } from 'react';
import { User, Transaction } from '../../types';

interface BankingPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  balance: number;
  transactions: Transaction[];
  onAddFunds: (amount: number) => void;
  onPayRetreat: (amount: number) => void;
  onRedeemLoyalty: () => void;
  onShowToast: (msg: string) => void;
}

export const BankingPortalModal: React.FC<BankingPortalModalProps> = ({
  isOpen,
  onClose,
  user,
  balance,
  transactions,
  onAddFunds,
  onPayRetreat,
  onRedeemLoyalty,
  onShowToast,
}) => {
  const [tab, setTab] = useState<'transactions' | 'add-funds' | 'pay-retreat' | 'group-pool' | 'loyalty'>('transactions');
  const [addAmount, setAddAmount] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [poolName, setPoolName] = useState('Maui Couples Retreat 2026');
  const [poolTarget, setPoolTarget] = useState('9283');

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(addAmount) || 0;
    if (val < 50) {
      onShowToast('⚠️ Minimum deposit is $50.');
      return;
    }
    onAddFunds(val);
    setAddAmount('');
    setTab('transactions');
    onShowToast(`✓ $${val.toLocaleString()} added to escrow balance.`);
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(payAmount) || 0;
    if (val <= 0) {
      onShowToast('⚠️ Please enter an amount.');
      return;
    }
    if (val > balance) {
      onShowToast('⚠️ Insufficient escrow balance.');
      return;
    }
    onPayRetreat(val);
    setPayAmount('');
    setTab('transactions');
    onShowToast(`✓ $${val.toLocaleString()} funded into verified retreat escrow.`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <button className="modal-close-corner" onClick={onClose} type="button">
        ✕
      </button>

      <div className="bp-wrap" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bp-header">
          <div className="bp-logo">
            Sanctuary Escrow <span>AES-256-GCM Partner Banking</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="bp-balance-chip">
              <span className="bp-balance-lbl">Available</span>
              <span className="bp-balance-val">${balance.toFixed(2)}</span>
            </div>
            <button
              className="bk-back"
              style={{ padding: '0.25rem 0.7rem', fontSize: '0.45rem' }}
              onClick={onClose}
              type="button"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Body Grid */}
        <div className="bp-body">
          {/* Left Column */}
          <div>
            <div className="bp-acct-card">
              <div className="bp-acct-av">
                {user ? user.name.charAt(0) : 'D'}
              </div>
              <div className="bp-acct-name">{user ? user.name : 'Demo Guest'}</div>
              <div className="bp-acct-tier">
                {user?.tier === 't2'
                  ? 'Visionary · Tier 2'
                  : user?.tier === 't1'
                  ? 'Healer · Tier 1'
                  : 'Free Explorer'}
              </div>

              <div className="bp-bal-section">
                <div style={{ fontSize: '0.38rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(39,174,96,0.7)', marginBottom: '0.2rem' }}>
                  Total Escrow Liquidity
                </div>
                <div className="bp-bal-main">
                  ${Math.floor(balance).toLocaleString()}
                  <span className="bp-bal-cents">.{(balance % 1).toFixed(2).split('.')[1] || '00'}</span>
                </div>
                <div style={{ fontSize: '0.44rem', color: 'var(--muted)', marginTop: '0.2rem' }}>
                  Cleared &amp; Segregated
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                <button
                  type="button"
                  className="cp-btn"
                  style={{ textAlign: 'left', borderRadius: '8px' }}
                  onClick={() => setTab('add-funds')}
                >
                  ➕ Add Funds to Escrow
                </button>
                <button
                  type="button"
                  className="cp-btn teal"
                  style={{ textAlign: 'left', borderRadius: '8px' }}
                  onClick={() => setTab('pay-retreat')}
                >
                  🏛 Fund Retreat Hold
                </button>
                <button
                  type="button"
                  className="cp-btn"
                  style={{ textAlign: 'left', borderRadius: '8px' }}
                  onClick={() => setTab('group-pool')}
                >
                  👥 Group Escrow Pool
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', fontSize: '0.42rem', color: 'rgba(255,255,255,0.35)' }}>
                <div>🔒 256-bit GCM Hardware Encryption</div>
                <div>🏛 FDIC-Insured Custodial Accounts</div>
                <div>✓ Zero-Liability Fraud Protection</div>
              </div>
            </div>
          </div>

          {/* Right Column: Tabs & Panels */}
          <div>
            <div className="bp-tabs">
              <button
                className={`bp-tab ${tab === 'transactions' ? 'active' : ''}`}
                onClick={() => setTab('transactions')}
                type="button"
              >
                Transactions ({transactions.length})
              </button>
              <button
                className={`bp-tab ${tab === 'add-funds' ? 'active' : ''}`}
                onClick={() => setTab('add-funds')}
                type="button"
              >
                Add Funds
              </button>
              <button
                className={`bp-tab ${tab === 'pay-retreat' ? 'active' : ''}`}
                onClick={() => setTab('pay-retreat')}
                type="button"
              >
                Pay Retreat
              </button>
              <button
                className={`bp-tab ${tab === 'group-pool' ? 'active' : ''}`}
                onClick={() => setTab('group-pool')}
                type="button"
              >
                Group Pool
              </button>
              <button
                className={`bp-tab ${tab === 'loyalty' ? 'active' : ''}`}
                onClick={() => setTab('loyalty')}
                type="button"
              >
                Loyalty Credits
              </button>
            </div>

            {/* TRANSACTIONS PANEL */}
            {tab === 'transactions' && (
              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.4rem' }}>
                <div style={{ fontSize: '0.46rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--bank)', marginBottom: '1rem' }}>
                  Escrow Ledger &amp; Audit Trail
                </div>

                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 0',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.58rem', fontWeight: 500, color: 'var(--text)' }}>
                        {tx.desc}
                      </div>
                      <div style={{ fontSize: '0.44rem', color: 'var(--muted)', marginTop: '0.1rem' }}>
                        {tx.date} · {tx.status}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: 'Cormorant Garamond, serif',
                        fontSize: '1.1rem',
                        fontWeight: 300,
                        color: tx.type === 'in' ? 'var(--bank)' : '#e74c3c',
                      }}
                    >
                      {tx.type === 'in' ? '+' : '-'}${tx.amt.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ADD FUNDS PANEL */}
            {tab === 'add-funds' && (
              <form
                onSubmit={handleAddSubmit}
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.4rem' }}
              >
                <div style={{ fontSize: '0.48rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--bank)', marginBottom: '1rem' }}>
                  Deposit Into Escrow Account
                </div>

                <div className="bk-field">
                  <label className="bk-label">Deposit Amount (USD, min $50)</label>
                  <input
                    className="bk-inp"
                    type="number"
                    min="50"
                    required
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="e.g. 5000"
                  />
                </div>

                <div className="bk-field">
                  <label className="bk-label">Funding Source</label>
                  <select className="bk-sel">
                    <option>Chase Business Checking (...4910) · ACH</option>
                    <option>JPMorgan Private Bank Wire (...8802)</option>
                    <option>Visa Platinum Debit (...4242) · Instant</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="pay-now"
                  style={{ background: 'linear-gradient(135deg, var(--bank), #1e8449)', marginTop: '0.8rem' }}
                >
                  Initiate Verified Deposit
                </button>
              </form>
            )}

            {/* PAY RETREAT PANEL */}
            {tab === 'pay-retreat' && (
              <form
                onSubmit={handlePaySubmit}
                style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.4rem' }}
              >
                <div style={{ fontSize: '0.48rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--bank)', marginBottom: '1rem' }}>
                  Fund Retreat Escrow Hold
                </div>

                <div className="bk-field">
                  <label className="bk-label">Sanctuary Plan / Destination</label>
                  <select className="bk-sel">
                    <option>Maui, Hawaii · SAN-MAU-20260512-2P ($9,283)</option>
                    <option>Sedona, Arizona · SAN-SED-20260303-1P ($3,880)</option>
                    <option>Custom Escrow Retainer</option>
                  </select>
                </div>

                <div className="bk-field">
                  <label className="bk-label">Transfer Amount (USD)</label>
                  <input
                    className="bk-inp"
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    placeholder="e.g. 9283"
                  />
                </div>

                <button
                  type="submit"
                  className="pay-now"
                  style={{ background: 'linear-gradient(135deg, var(--bank), #1e8449)', marginTop: '0.8rem' }}
                >
                  Lock Funds in Escrow
                </button>
              </form>
            )}

            {/* GROUP POOL PANEL */}
            {tab === 'group-pool' && (
              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.4rem' }}>
                <div style={{ fontSize: '0.48rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--bank)', marginBottom: '1rem' }}>
                  Shared Group Retreat Pool
                </div>

                <div className="bk-field">
                  <label className="bk-label">Pool Title</label>
                  <input
                    className="bk-inp"
                    value={poolName}
                    onChange={(e) => setPoolName(e.target.value)}
                  />
                </div>

                <div className="bk-field">
                  <label className="bk-label">Target Funding (USD)</label>
                  <input
                    className="bk-inp"
                    value={poolTarget}
                    onChange={(e) => setPoolTarget(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="h-bp"
                    style={{ flex: 1, padding: '0.65rem' }}
                    onClick={() => onShowToast(`✓ Group escrow pool "${poolName}" created with link sharing!`)}
                  >
                    Create Group Pool
                  </button>
                  <button
                    type="button"
                    className="cp-btn"
                    onClick={() => onShowToast('🔗 Pool invite link copied!')}
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )}

            {/* LOYALTY PANEL */}
            {tab === 'loyalty' && (
              <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1.4rem' }}>
                <div style={{ fontSize: '0.48rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--bank)', marginBottom: '1rem' }}>
                  Redeem Loyalty Points for Escrow Credit
                </div>

                <p style={{ fontSize: '0.55rem', color: 'var(--muted)', marginBottom: '1.2rem', lineHeight: '1.7' }}>
                  Convert your accumulated Sanctuary points into instant dollar credits deposited into your Escrow balance. Rate: 100 points = $1.00 credit.
                </p>

                <div style={{ background: 'var(--d3)', padding: '1rem', borderRadius: '10px', marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.52rem', color: 'var(--muted)' }}>Available Loyalty Points</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 600 }}>{user ? user.points : 1250} pts</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.52rem', color: 'var(--muted)' }}>Maximum Credit Conversion</span>
                    <span style={{ fontSize: '0.7rem', color: '#7EC87A', fontWeight: 600 }}>${Math.floor((user ? user.points : 1250) * 0.01)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="h-bp"
                  style={{ width: '100%', padding: '0.75rem' }}
                  onClick={onRedeemLoyalty}
                >
                  Convert 1,000 Pts to $10 Escrow Credit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
