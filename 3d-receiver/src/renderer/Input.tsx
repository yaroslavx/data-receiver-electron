import {
  MemoryRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import './Input.css';
import { useState } from 'react';
import Main from './components/Main/Main';

const { ipcRenderer } = window.electron;

const Input = () => {
  const navigate = useNavigate();
  const [portInput, setPortInput] = useState('');
  const createFile = (e: any) => {
    e.preventDefault();
    // Send to main using ipcRenderer
    ipcRenderer.sendMessage('file:create', { portPath: portInput });
    navigate('/main');
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
        <Route path="/" element={<Input />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </Router>
  );
}
