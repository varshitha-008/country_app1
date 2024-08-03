const express = require('express');
const axios = require('axios');

const router = express.Router();

// Fetch country details by currency code
router.get('/:currencyCode', async (req, res) => {
  const { currencyCode } = req.params;
  try {
    // Fetch country details using the new API endpoint
    const response = await axios.get(`https://restcountries.com/v3.1/currency/${currencyCode}`);
    
    // Map the response to the required format
    const countries = response.data.map(country => ({
      name: country.name.common,
      currency: country.currencies ? Object.keys(country.currencies)[0] : 'N/A',
      capital: country.capital ? country.capital[0] : 'N/A',
      languages: country.languages ? Object.values(country.languages) : [],
      flag: `https://flagsapi.com/${country.cca2}/shiny/64.png`  // Updated flag URL
    }));
    
    res.json(countries);
  } catch (err) {
    console.error('Error fetching country details:', err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
