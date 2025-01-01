import CryptoChart from "@/components/CryptoChart";
import InvestmentCalculator from "@/components/InvestmentCalculator";
import InvestmentStats from "@/components/InvestmentStats";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">What If I Invested in Bitcoin?</h1>
          <p className="text-muted-foreground">Discover the potential of your hypothetical Bitcoin investment</p>
        </header>
        
        <InvestmentCalculator />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CryptoChart />
          </div>
          <div>
            <InvestmentStats />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;