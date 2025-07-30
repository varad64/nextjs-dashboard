import { fetchStocksData } from "@/app/lib/stock-data";
import LivePortfolio from "@/app/ui/portfolio/share-table";

export default async function Page() {
    const stocks = await fetchStocksData();

    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Live Stock Portfolio</h1>
        <LivePortfolio />
      </main>
    );
};