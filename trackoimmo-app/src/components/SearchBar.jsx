import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchBar.module.css';
import { loadPostalCodes } from '../utils/loadPostalCodes';// CSV loader

const SearchBar = ({ filters }) => {
  const [query, setQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const navigate = useNavigate();

  // Load suggestions from CSV on component mount
  useEffect(() => {
    loadPostalCodes().then(data => {
      console.log('Loaded suggestions:', data); // ADD THIS LINE
      setSuggestions(data);
    });
  }, []);
  

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    const filtered = suggestions.filter(s =>
      s.code.includes(value) || s.region.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredSuggestions(value ? filtered : []);
    setShowSuggestions(true);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      setActiveIndex((prev) => (prev + 1) % filteredSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        handleSelect(filteredSuggestions[activeIndex]);
      } else {
        handleSearch(query);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (suggestion) => {
    const code = suggestion.code;
    setQuery(`${code} - ${suggestion.region}`);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
    handleSearch(code);
  };

  const handleSearch = (value) => {
    let url = '/listings?';
    let params = [];

    if (value && value.trim() !== '') {
      params.push(`city=${encodeURIComponent(value)}`);
    }

    if (filters.type_local) params.push(`type_local=${encodeURIComponent(filters.type_local)}`);
    if (filters.price_min) params.push(`price_min=${encodeURIComponent(filters.price_min)}`);
    if (filters.price_max) params.push(`price_max=${encodeURIComponent(filters.price_max)}`);
    if (filters.surface_min) params.push(`surface_min=${encodeURIComponent(filters.surface_min)}`);
    if (filters.surface_max) params.push(`surface_max=${encodeURIComponent(filters.surface_max)}`);
    if (filters.rooms) params.push(`rooms=${encodeURIComponent(filters.rooms)}`);

    url += params.join('&');
    if (params.length === 0) url = '/listings';

    navigate(url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const postalMatch = query.match(/^(\d{5})/);
    const finalQuery = postalMatch ? postalMatch[1] : query.trim();
    handleSearch(finalQuery);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchContainer}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="Search good investments by postal code or region..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchButton} aria-label="Search">
          🔍
        </button>
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className={styles.suggestionList}>
          {filteredSuggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSelect(s)}
              className={`${styles.suggestionItem} ${i === activeIndex ? styles.active : ''}`}
            >
              {s.code} - {s.region}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchBar;


