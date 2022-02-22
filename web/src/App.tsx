import { BrowserRouter } from 'react-router-dom';

import { AppRoutes } from './routes/Routes';
import { globalStyles } from './styles/globalStyles';

export function App() {
  globalStyles();

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
