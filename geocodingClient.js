const axios = require('axios');

const mapToken = process.env.MAP_TOKEN;

// Geocoding client object
const geocodingClient = {
  forwardGeocode: async ({ query, limit }) => {
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${mapToken}&limit=${limit}`;
    
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error in geocoding request:', error);
      throw new Error('Failed to fetch geocode data');
    }
  }
};

module.exports = geocodingClient;
