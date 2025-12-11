import './App.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';
import { GamePage } from './pages/GamePage';
import { ModalPreview } from './pages/ModalPreview';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GamePage />
      {/* <ModalPreview /> */}
      <ToastContainer position='top-center' autoClose={2000} />
    </QueryClientProvider>
  );
}

export default App;
