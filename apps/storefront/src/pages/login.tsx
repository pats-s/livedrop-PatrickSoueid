import { useNavigate } from 'react-router-dom';
import { useStore } from '../lib/store';
import UserLogin from '../components/UserLogin';

export default function LoginPage() {
  const navigate = useNavigate();
  const setCustomer = useStore((state) => state.setCustomer);

  const handleLogin = (customer: any) => {
    setCustomer(customer);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <UserLogin onLogin={handleLogin} />
    </div>
  );
}