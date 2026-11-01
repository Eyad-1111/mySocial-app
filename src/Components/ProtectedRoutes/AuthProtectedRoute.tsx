import { useContext, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { TokenContext } from '../Context/tokenContext';

export default function AuthProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const tokenContext = useContext(TokenContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (tokenContext?.token) {
      navigate('/');
    }
  }, [navigate, tokenContext?.token]);

  return <>{children}</>;
}
