import { useQuery } from "@tanstack/react-query";

const fetchCurrentBitcoinPrice = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
  );
  const data = await response.json();
  return data.bitcoin.usd;
};

const InvestmentStats = () => {
  const { data: currentPrice, isLoading } = useQuery({
    queryKey: ["bitcoinCurrentPrice"],
    queryFn: fetchCurrentBitcoinPrice,
    refetchInterval: 60000, // Refetch every minute
  });

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
      <h2 className="text-xl font-semibold mb-6">Investment Statistics</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Current Bitcoin Price</p>
          <p className="text-2xl font-bold">
            {isLoading ? "Loading..." : `$${currentPrice?.toLocaleString()}`}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Potential Return</p>
          <p className="text-2xl font-bold text-success">Calculate to see returns</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Best Time to Sell</p>
          <p className="text-lg">Not yet calculated</p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentStats;