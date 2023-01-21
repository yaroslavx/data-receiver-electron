import { createRoot } from 'react-dom/client';
import Input from './Input';

const container = document.getElementById('root');
const root = container && createRoot(container);
root?.render(<Input />);
