import { useState, useEffect } from 'react';
import { useAuth } from "../auth/authcontext";

interface PriceData {
  symbol: string;
  price: string;
}

interface Prices {
  [key: string]: number;
}

interface UseCryptoPriceReturn {
  prices: Prices;
  loading: boolean;
  error: string | null;
}

const useCryptoPrice = () => {
  const [prices, setPrices] = useState<Prices>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const symbols = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'DOGEUSDT',
    'SOLUSDT', 'XRPUSDT', 'TRXUSDT', 'ADAUSDT',
    'POLUSDT', 'SUIUSDT'
  ];
  const user = useAuth();

  const fetchPrices = async () => {
    if (!user) return;
    try {
      const symbolsParam = symbols.map(s => `"${s}"`).join(',');
      const response = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbols=[${symbolsParam}]`
      );

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const data = await response.json() as PriceData[];
      const pricesObject: Prices = {};

      data.forEach((item) => {
        const symbol = item.symbol.replace('USDT', '');
        pricesObject[symbol] = parseFloat(item.price);
      });

      setPrices(pricesObject);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 10_000);
    return () => clearInterval(interval);
  }, []);

  return { prices, loading, error } satisfies UseCryptoPriceReturn;
};

export default useCryptoPrice;
