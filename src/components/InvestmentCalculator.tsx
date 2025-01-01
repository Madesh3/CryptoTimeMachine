import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface BitcoinHistoricalData {
  market_data: {
    current_price: {
      usd: number;
    };
  };
}

const fetchBitcoinHistoricalData = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/bitcoin/history?date=01-01-2009"
  );
  return response.json();
};

const InvestmentCalculator = () => {
  const [investment, setInvestment] = useState("1000");
  const [startYear, setStartYear] = useState("2009");
  const { toast } = useToast();

  const { data: historicalData, isLoading } = useQuery<BitcoinHistoricalData>({
    queryKey: ["bitcoinHistorical"],
    queryFn: fetchBitcoinHistoricalData,
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

    // Calculate potential returns (to be implemented with real data)
    toast({
      title: "Investment Calculated",
      description: `Calculating returns for $${investment} invested in ${startYear}`,
    });
  };

  return (
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
            min="2009"
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
            Calculate Returns
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCalculator;