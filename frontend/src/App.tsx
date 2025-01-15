import React from 'react';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import routes from './router';

// 创建一个内部组件来使用 useRoutes
const AppRoutes: React.FC = () => {
  const element = useRoutes(routes);
  return element;
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
