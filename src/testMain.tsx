import React from 'react';
import ReactDOM from 'react-dom/client';
import { TestGate } from './components/TestGate';
import './index.css';
import { startAppUpdates } from './appUpdates';
startAppUpdates();
ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><TestGate/></React.StrictMode>);
