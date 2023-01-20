import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useState } from 'react';

const { ipcRenderer } = window.electron;

const Hello = () => {
  const [portInput, setPortInput] = useState('');
  const createFile = (e: any) => {
    e.preventDefault();
    // Send to main using ipcRenderer
    ipcRenderer.sendMessage('file:create', { portPath: portInput });
  };

  return (
    <div>
      <form id="create-form">
        <p className="title">Введите порт</p>
        <input
          type="text"
          value={portInput}
          onChange={(e) => setPortInput(e.target.value)}
          id="port"
          placeholder="Пример: /dev/ttyACM0"
        />
        <button onClick={createFile} type="submit" className="create-button">
          Create file
        </button>
      </form>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
