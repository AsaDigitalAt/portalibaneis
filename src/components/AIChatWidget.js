"use client";
import { useState } from 'react';

export default function AIChatWidget({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if(!input.trim()) return;
    const newMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, newMsg] })
      });
      const data = await res.json();
      
      if(data.message) {
        setMessages(prev => [...prev, data.message]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Ops, ' + (data.error || 'ocorreu um erro de conexão.') }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Ops, ocorreu um erro de conexão.' }]);
    }
    setIsLoading(false);
  };

  return (
    <div style={{ position:'fixed', bottom:'20px', right:'20px', width:'340px', height:'480px', background:'#fff', border:'1px solid #ccc', borderRadius:'12px', boxShadow:'0 10px 30px rgba(0,0,0,0.15)', display:'flex', flexDirection:'column', zIndex: 9999 }}>
      {/* Header */}
      <div style={{ padding:'12px 16px', background:'#1a1a18', color:'#fff', borderTopLeftRadius:'12px', borderTopRightRadius:'12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontSize:'14px', fontWeight:'600' }}>Busca Governamental (IA)</div>
        <button onClick={onClose} style={{ color:'#e8e7e2', background:'none', border:'none', cursor:'pointer', fontSize:'18px' }}>&times;</button>
      </div>

      {/* Body */}
      <div style={{ flex:1, padding:'16px', overflowY:'auto', background:'#fafaf7', display:'flex', flexDirection:'column', gap:'12px' }}>
        {messages.length === 0 && (
          <div style={{ fontSize:'12px', color:'#777', textAlign:'center', marginTop:'40%' }}>
            Olá! Me pergunte qualquer dado sobre entregas, obras ou notícias governamentais.
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', background: msg.role === 'user' ? '#1a1a18' : '#e8e7e2', color: msg.role === 'user' ? '#fff' : '#1a1a18', padding:'8px 12px', borderRadius:'8px', fontSize:'12px', maxWidth:'85%' }}>
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', background: '#e8e7e2', color: '#1a1a18', padding:'8px 12px', borderRadius:'8px', fontSize:'12px' }}>
             Buscando dados...
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding:'12px', borderTop:'1px solid #eee', display:'flex', gap:'8px', background:'#fff', borderBottomLeftRadius:'12px', borderBottomRightRadius:'12px' }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ex: Resuma as entregas na Saúde..."
          style={{ flex:1, padding:'8px 12px', borderRadius:'20px', border:'1px solid #ddd', fontSize:'12px', outline:'none' }}
        />
        <button onClick={sendMessage} disabled={isLoading} style={{ background:'#1a1a18', color:'#fff', border:'none', borderRadius:'20px', padding:'8px 16px', fontSize:'12px', fontWeight:'600', cursor: isLoading ? 'not-allowed' : 'pointer' }}>
          Enviar
        </button>
      </div>
    </div>
  );
}
