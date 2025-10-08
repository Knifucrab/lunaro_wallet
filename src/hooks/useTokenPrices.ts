import { useState, useEffect } from 'react';
import axios from 'axios';

interface TokenPrice {
  usd: number;
  usd_24h_change: number;
}

interface PriceData {
  [key: string]: TokenPrice;
}

export function useTokenPrices() {
  const [prices, setPrices] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // Using CoinGecko's free API to get DAI and USDC prices
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
          params: {
            ids: 'dai,usd-coin',
            vs_currencies: 'usd',
            include_24hr_change: true,
          },
        });

        setPrices({
          DAI: {
            usd: response.data.dai.usd,
            usd_24h_change: response.data.dai.usd_24h_change,
          },
          USDC: {
            usd: response.data['usd-coin'].usd,
            usd_24h_change: response.data['usd-coin'].usd_24h_change,
          },
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching token prices:', err);
        setError('Failed to fetch prices');
        setLoading(false);
      }
    };

    fetchPrices();

    // Refresh prices every 60 seconds
    const interval = setInterval(fetchPrices, 60000);

    return () => clearInterval(interval);
  }, []);

  return { prices, loading, error };
}
