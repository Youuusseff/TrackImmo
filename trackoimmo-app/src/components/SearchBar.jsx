import React, { useState } from 'react';
import styles from './SearchBar.module.css';
import { suggestions } from '../utils/suggestions';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
      if (activeIndex >= 0) {
        handleSelect(filteredSuggestions[activeIndex]);
      } else {
        onSearch(query); // fallback if no suggestion is selected
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (suggestion) => {
    setQuery(`${suggestion.code} - ${suggestion.region}`);
    setShowSuggestions(false);
    setFilteredSuggestions([]);
    onSearch(suggestion.code);
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search good investments by postal code or region..."
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={styles.searchInput}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className={styles.suggestionList}>
          {filteredSuggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSelect(s)}
              className={`${styles.suggestionItem} ${
                i === activeIndex ? styles.active : ''
              }`}
            >
              {s.code} - {s.region}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
