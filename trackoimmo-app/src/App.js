import './App.css';
import HomePage from './pages/HomePage'
import ListingsPage from './pages/ListingsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/listings" element={<ListingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
