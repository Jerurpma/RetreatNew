import React, { useState } from 'react';
import { EmailNotification } from '../../types';

interface EmailCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  emails: EmailNotification[];
  onSendEmail: (email: EmailNotification) => void;
}

export const EmailCenterModal: React.FC<EmailCenterModalProps> = ({
  isOpen,
  onClose,
  emails,
  onSendEmail,
}) => {
  const [activeTab, setActiveTab] = useState<'sent' | 'scheduled' | 'draft' | 'compose'>('sent');
  const [to, setTo] = useState('demo@sanctuary.com');
  const [type, setType] = useState('Booking Confirmation');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [msgNotice, setMsgNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredEmails = emails.filter((em) => em.status === (activeTab === 'compose' ? 'sent' : activeTab));

  const handleSend = (status: 'sent' | 'scheduled') => {
    if (!subject.trim() || !body.trim()) return;

    const newEmail: EmailNotification = {
      id: `em-${Date.now()}`,
      type,
      subject: subject.trim(),
      to: to.trim(),
      date: status === 'sent' ? 'Just now' : 'Scheduled: In 2 days',
      preview: body.slice(0, 140) + '...',
      status,
    };

    onSendEmail(newEmail);
    setSubject('');
    setBody('');
    setMsgNotice(status === 'sent' ? 'Email sent successfully via Sanctuary Dispatch!' : 'Email scheduled for automated delivery.');
    setTimeout(() => {
      setMsgNotice(null);
      setActiveTab(status);
    }, 1500);
  };

  return (
    <div id="email-center" className="portal show" style={{ display: 'block' }}>
      <div className="ec-top">
        <div className="ec-logo">
          Sanctuary <span style={{ fontSize: '0.42rem', letterSpacing: '0.22em', color: 'var(--muted)' }}>Automated Communications &amp; Email Dispatch</span>
        </div>
        <button className="bk-xbtn" onClick={onClose} type="button">
          Close &#x2715;
        </button>
      </div>

      <div className="ec-wrap">
        <div className="ec-tabs">
          <button
            type="button"
            className={`ec-tab ${activeTab === 'sent' ? 'active' : ''}`}
            onClick={() => setActiveTab('sent')}
          >
            &#9993; Sent ({emails.filter((e) => e.status === 'sent').length})
          </button>
          <button
            type="button"
            className={`ec-tab ${activeTab === 'scheduled' ? 'active' : ''}`}
            onClick={() => setActiveTab('scheduled')}
          >
            &#9203; Scheduled ({emails.filter((e) => e.status === 'scheduled').length})
          </button>
          <button
            type="button"
            className={`ec-tab ${activeTab === 'draft' ? 'active' : ''}`}
            onClick={() => setActiveTab('draft')}
          >
            &#128196; Drafts &amp; Automated ({emails.filter((e) => e.status === 'draft').length})
          </button>
          <button
            type="button"
            className={`ec-tab ${activeTab === 'compose' ? 'active' : ''}`}
            onClick={() => setActiveTab('compose')}
          >
            &#9997; Compose Dispatch
          </button>
        </div>

        {activeTab !== 'compose' ? (
          <div>
            {filteredEmails.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--muted)' }}>
                No {activeTab} notifications at this time.
              </div>
            ) : (
              filteredEmails.map((em) => (
                <div key={em.id} className="ec-card">
                  <div className="ec-type">{em.type}</div>
                  <div className="ec-subject">{em.subject}</div>

                  <span className={`ec-badge ${em.status === 'sent' ? 'sent' : em.status === 'scheduled' ? 'sched' : 'draft'}`}>
                    {em.status === 'sent' ? 'Delivered' : em.status === 'scheduled' ? 'Queued' : 'Trigger Draft'}
                  </span>

                  <div className="ec-meta">
                    <span><strong>To:</strong> {em.to}</span>
                    <span><strong>Timestamp:</strong> {em.date}</span>
                  </div>

                  <div className="ec-preview">&ldquo;{em.preview}&rdquo;</div>

                  <div className="ec-actions">
                    <button
                      type="button"
                      className="ec-action gold"
                      onClick={() => alert(`Full Notification Body:\n\nSubject: ${em.subject}\nTo: ${em.to}\nDate: ${em.date}\n\n${em.preview}`)}
                    >
                      View Full Content
                    </button>
                    {em.status === 'sent' && (
                      <button
                        type="button"
                        className="ec-action teal"
                        onClick={() => alert(`Resending notification "${em.subject}" to ${em.to}`)}
                      >
                        Resend Copy
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="ec-compose">
            <div className="ec-compose-hdr">&#10022; Compose Guest or Partner Notification</div>

            {msgNotice && (
              <div style={{ color: '#7EC87A', fontSize: '0.55rem', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(90,158,82,0.1)', border: '1px solid rgba(90,158,82,0.3)' }}>
                {msgNotice}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.7rem' }}>
              <div>
                <label className="clbl">Recipient Address</label>
                <input
                  type="email"
                  className="ec-inp"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="guest@sanctuary.com"
                />
              </div>
              <div>
                <label className="clbl">Notification Template / Category</label>
                <select
                  className="ec-sel"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Booking Confirmation">Booking Confirmation</option>
                  <option value="Pre-Retreat Reminder">Pre-Retreat Preparation</option>
                  <option value="Medical 329 Card Intake">Cannabis &amp; Medical Intake</option>
                  <option value="Specialist Assignment">Specialist Session Scheduling</option>
                  <option value="Post-Retreat Integration">Post-Retreat Integration &amp; Follow-up</option>
                </select>
              </div>
            </div>

            <div>
              <label className="clbl">Subject Line</label>
              <input
                type="text"
                className="ec-inp"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Your Upcoming Wailea Wellness Schedule & Specialist Intake"
              />
            </div>

            <div>
              <label className="clbl">Message Body (Rich Automated Payload)</label>
              <textarea
                className="ec-textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter detailed instructions, itinerary updates, or personalized healer notes..."
              />
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
              <button
                type="button"
                className="ec-send-btn"
                onClick={() => handleSend('sent')}
              >
                Send Immediately
              </button>
              <button
                type="button"
                className="ec-sched-btn"
                onClick={() => handleSend('scheduled')}
              >
                Schedule Dispatch
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
