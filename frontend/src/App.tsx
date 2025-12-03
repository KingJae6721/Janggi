import './App.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';
import { GamePage } from './pages/GamePage';
import { ModalPreview } from './pages/ModalPreview';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GamePage />
      {/* <ModalPreview /> */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
