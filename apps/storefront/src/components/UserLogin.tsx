import { useState } from 'react';
import { getCustomerByEmail } from '../lib/api';

interface UserLoginProps {
  onLogin: (customer: any) => void;
}

export default function UserLogin({ onLogin }: UserLoginProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const customer = await getCustomerByEmail(email);
      onLogin(customer);
    } catch (err) {
      setError('Customer not found. Try: demo@example.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Welcome to Shoplite</h2>
      <p className="text-gray-600 mb-4">Enter your email to continue</p>
      
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-2 border rounded mb-2"
          required
        />
        
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Loading...' : 'Continue'}
        </button>
      </form>
      
      <p className="text-sm text-gray-500 mt-4">
        Try: demo@example.com
      </p>
    </div>
  );
}