import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

export const CountryContext = createContext();

export const CountryProvider = ({ children }) => {
  const [countries, setCountries] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch country details by currency code
  const fetchCountries = async (currencyCode) => {
    try {
      const response = await axios.get(`https://restcountries.com/v3.1/currency/${currencyCode}`);
      const countriesWithFlags = response.data.map((country) => ({
        name: country.name.common,
        currency: country.currencies ? Object.keys(country.currencies)[0] : 'N/A',
        capital: country.capital ? country.capital[0] : 'N/A',
        languages: country.languages ? Object.values(country.languages) : [],
        flag: `https://flagsapi.com/${country.cca2}/shiny/64.png`
      }));
      setCountries(countriesWithFlags);
      updateSearchHistory(currencyCode, countriesWithFlags[0].currency); // Update search history with currency name
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  // Add a country to favorites
  const addFavorite = (country) => {
    // Ensure no duplicates in favorites
    if (!favorites.some(favorite => favorite.name === country.name)) {
      const updatedFavorites = [...favorites, country];
      setFavorites(updatedFavorites);
      // Assuming you have an endpoint to save favorites
      axios.post('https://api.example.com/favorites', country)
        .catch(error => console.error('Error saving favorite:', error));
    }
  };

  // Fetch favorite countries from the server
  const fetchFavorites = async () => {
    try {
      const response = await axios.get('https://searchcountry.onrender.com/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  // Fetch search history from the server
  const fetchHistory = async () => {
    try {
      const response = await axios.get('https://searchcountry.onrender.com/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  // Update search history with new entry
  const updateSearchHistory = (currencyCode, currencyName) => {
    // Avoid duplicates in search history
    if (!history.some(item => item.currencyCode === currencyCode)) {
      const updatedHistory = [...history, { currencyCode, currencyName }];
      setHistory(updatedHistory);
      // Assuming you have an endpoint to save search history
      axios.post('https://searchcountry.onrender.com/history', { history: updatedHistory })
        .catch(error => console.error('Error saving search history:', error));
    }
  };

  // Fetch favorites and history on component mount
  useEffect(() => {
    fetchFavorites();
    fetchHistory();
  }, []);

  return (
    <CountryContext.Provider value={{ countries, favorites, history, fetchCountries, addFavorite, fetchFavorites }}>
      {children}
    </CountryContext.Provider>
  );
};
