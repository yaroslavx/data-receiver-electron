const form = document.querySelector('#create-form');
const portInput = document.querySelector('#port');

const createFile = (e) => {
  e.preventDefault();

  // Send to main using ipcRenderer
  ipcRenderer.send('file:create', { portPath: portInput.value });
};

form.addEventListener('submit', createFile);
