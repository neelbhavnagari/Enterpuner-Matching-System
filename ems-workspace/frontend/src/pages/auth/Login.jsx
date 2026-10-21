import React from 'react';
import InlineAuthForm from '../../components/InlineAuthForm';

export function Login() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <InlineAuthForm initialMode="login" />
    </div>
  );
}

export default Login;
