import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { DashboardProvider } from './context/DashboardContext';
import './assets/styles/main.css';

ReactDOM.render(
  <ThemeProvider>
    <DashboardProvider>
      <App />
    </DashboardProvider>
  </ThemeProvider>,
  document.getElementById('root')
);