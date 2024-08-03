import axios from 'axios';
import React, { useEffect, useState } from 'react';

const CountryDetails = ({ countryCode }) => {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://restcountries.com/v3.1/currency/${countryCode}`);
        const countryData = response.data[0];
        const countryWithDetails = {
          name: countryData.name.common,
          currency: countryData.currencies ? Object.keys(countryData.currencies)[0] : 'N/A',
          capital: countryData.capital ? countryData.capital[0] : 'N/A',
          languages: countryData.languages ? Object.values(countryData.languages) : [],
          flag: `https://flagsapi.com/${countryData.cca2}/shiny/64.png`  // Updated flag URL
        };
        setCountry(countryWithDetails);
      } catch (error) {
        console.error('Error fetching country details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (countryCode) {
      fetchCountryDetails();
    }
  }, [countryCode]);

  if (loading) {
    return <p>Loading country details...</p>;
  }

  if (!country) {
    return <p>No country details found.</p>;
  }

  return (
    <div>
      <h2>{country.name}</h2>
      <p>Currency: {country.currency}</p>
      <p>Capital: {country.capital}</p>
      <p>Languages: {country.languages.join(', ')}</p>
      <img src={country.flag} alt={`Flag of ${country.name}`} />
    </div>
  );
}

export default CountryDetails;
