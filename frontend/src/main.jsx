import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from '@app/store';
import App from './App';
import './index.css';

const root = document.getElementById('root');

createRoot(root).render(
  <StrictMode>
    {/* Redux global state provider */}
    <Provider store={store}>
      {/* React Router — BrowserRouter for HTML5 history API */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
