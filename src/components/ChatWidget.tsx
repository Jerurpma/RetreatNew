import React, { useState } from 'react';
import { ChatMsg } from '../types';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 'm-1',
      sender: 'concierge',
      text: 'Aloha! I am Dr. Kaimana Kahale, your dedicated retreat concierge. Which destination or healing modality calls to you today?',
      time: 'Just now',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
    }
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const guestMsg: ChatMsg = {
      id: `m-${Date.now()}`,
      sender: 'guest',
      text: text.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, guestMsg]);
    if (!textToSend) setInputVal('');

    // Trigger auto-responder
    setIsTyping(true);
    setTimeout(() => {
      let reply = 'Mahalo for sharing that. I will curate a personalized itinerary with full cannabis protocol and specialist matching. You can also explore our Quote Studio to lock in your dates!';
      const lower = text.toLowerCase();
      if (lower.includes('lomilomi') || lower.includes('massage')) {
        reply = 'Sacred Lomilomi is an ancient Hawaiian temple bodywork tradition that synchronizes breath, rhythmic long strokes, and warm infused botanical oils to release trapped trauma.';
      } else if (lower.includes('329') || lower.includes('card') || lower.includes('medical')) {
        reply = 'Hawaii welcomes 38 out-of-state medical cannabis registrations! We handle the state digital pre-clearance 14 days prior to your arrival for zero hassle.';
      } else if (lower.includes('couples') || lower.includes('partner')) {
        reply = 'Our Couples Reconnection package in Wailea features synchronized sound alchemy, private oceanfront casitas, and guided microdosing sunset ceremonies.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now() + 1}`,
          sender: 'concierge',
          text: reply,
          time: 'Just now',
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div id="chat-widget">
      {isOpen && (
        <div className="chat-win open">
          <div className="chat-hdr">
            <div className="chat-hav">
              KK
              <div className="chat-ondot" />
            </div>
            <div className="chat-hinfo">
              <div className="chat-cname">Dr. Kaimana Kahale</div>
              <div className="chat-ctitle">Lead Healer &amp; Concierge</div>
              <div className="chat-online">&#9679; Available Now</div>
            </div>
            <button className="chat-x" onClick={toggleOpen} type="button">
              &#x2715;
            </button>
          </div>

          <div className="chat-msgs">
            {messages.map((m) => (
              <div key={m.id} className={`chat-msg ${m.sender === 'concierge' ? 'fc' : 'fg'}`}>
                <div className="chat-bubble">{m.text}</div>
                <div className="chat-time">{m.time}</div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-typing show">
                <div className="chat-dot" />
                <div className="chat-dot" />
                <div className="chat-dot" />
              </div>
            )}
          </div>

          <div className="chat-qrs">
            <button type="button" className="chat-qr" onClick={() => handleSend('What is Lomilomi healing?')}>
              What is Lomilomi?
            </button>
            <button type="button" className="chat-qr" onClick={() => handleSend('How does the Hawaii 329 card work?')}>
              Hawaii 329 Card Info
            </button>
            <button type="button" className="chat-qr" onClick={() => handleSend('Can you recommend a couples retreat?')}>
              Couples Retreats
            </button>
          </div>

          <form
            className="chat-inp-row"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              className="chat-inp"
              placeholder="Ask Dr. Kahale a question..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button type="submit" className="chat-send">
              Send
            </button>
          </form>

          <div className="chat-disc">
            Confidential 256-bit encrypted channel &middot; Sanctuary Concierge Care
          </div>
        </div>
      )}

      <button className="chat-fab" onClick={toggleOpen} type="button" aria-label="Open Concierge Chat">
        <div className="chat-pulse" />
        <span style={{ position: 'relative', zIndex: 2 }}>&#128172;</span>
        {unreadCount > 0 && !isOpen && (
          <span className="chat-unread" style={{ display: 'flex' }}>
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
