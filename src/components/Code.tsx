
import React from 'react';

interface CodeProps {
  children: React.ReactNode;
}

export const Code: React.FC<CodeProps> = ({ children }) => {
  return (
    <pre className="bg-gray-900 p-3 rounded-md text-gray-300 text-sm overflow-x-auto">
      <code>{children}</code>
    </pre>
  );
};
