import { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../../lib/api';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  intent?: string;
  citations?: string[];
  timestamp: Date;
}

interface SupportPanelProps {
  isOpen: boolean;  // ← ADD THIS
  onClose: () => void;
}

export default function SupportPanel({ isOpen, onClose }: SupportPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Hi! I'm Alex, your Shoplite support specialist. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAssistant(input.trim());
      
      const assistantMessage: Message = {
        role: 'assistant',
        text: response.text,
        intent: response.intent,
        citations: response.citations,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        text: "I'm having trouble connecting right now. Please try again or contact support@shoplite.com",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ← ADD THIS: Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Rest of your component stays the same */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold">A</span>
          </div>
          <div>
            <h3 className="font-semibold">Alex</h3>
            <p className="text-xs text-blue-100">Support Specialist</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-blue-700 rounded p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              
              {msg.intent && msg.role === 'assistant' && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                    {msg.intent.replace('_', ' ')}
                  </span>
                </div>
              )}

              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Sources: {msg.citations.join(', ')}
                  </p>
                </div>
              )}

              <p className="text-xs opacity-70 mt-1">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Try: "What's your return policy?" or "Where is order ORD-20251019-001?"
        </p>
      </div>
    </div>
  );
}