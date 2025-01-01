import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface BitcoinHistoricalData {
  prices: [number, number][];
}

const fetchBitcoinHistoricalData = async () => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365&interval=daily",
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a minute.');
      }
      throw new Error(errorData.error?.status?.error_message || 'Failed to fetch data');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching Bitcoin data:', error);
    throw error;
  }
};

const InvestmentCalculator = () => {
  const [investment, setInvestment] = useState("1000");
  const [startYear, setStartYear] = useState("2023");
  const [calculatedReturn, setCalculatedReturn] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: historicalData, isLoading, error } = useQuery({
    queryKey: ["bitcoinHistorical"],
    queryFn: fetchBitcoinHistoricalData,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const handleCalculate = () => {
    if (!investment || isNaN(Number(investment))) {
      toast({
        title: "Invalid Investment Amount",
        description: "Please enter a valid number for your investment.",
        variant: "destructive",
      });
      return;
    }

    if (Number(startYear) < 2023) {
      toast({
        title: "Date Range Limited",
        description: "Due to API limitations, we can only calculate returns for the past year. Please select 2023 or later.",
        variant: "destructive",
      });
      return;
    }

    if (historicalData?.prices) {
      const initialPrice = historicalData.prices[0][1];
      const currentPrice = historicalData.prices[historicalData.prices.length - 1][1];
      const returns = (Number(investment) * (currentPrice / initialPrice)).toFixed(2);
      setCalculatedReturn(returns);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
        <h2 className="text-xl font-semibold mb-6">Investment Calculator</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Initial Investment ($)
            </label>
            <Input
              type="number"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
              placeholder="Enter amount"
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Start Year
            </label>
            <Input
              type="number"
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              min="2023"
              max={new Date().getFullYear()}
              className="w-full"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleCalculate}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Calculate Returns"}
            </Button>
          </div>
        </div>
        {error && (
          <p className="mt-4 text-sm text-destructive">
            {error instanceof Error ? error.message : "Error fetching data. Please try again later."}
          </p>
        )}
      </div>

      {calculatedReturn && (
        <div className="glass-card p-6 rounded-lg animate-fade-in">
          <h2 className="text-xl font-semibold mb-6">Investment Results</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Initial Investment</p>
              <p className="text-2xl font-bold">${Number(investment).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Potential Value</p>
              <p className="text-2xl font-bold text-success">${Number(calculatedReturn).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Return on Investment</p>
              <p className="text-lg">
                {((Number(calculatedReturn) - Number(investment)) / Number(investment) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentCalculator;