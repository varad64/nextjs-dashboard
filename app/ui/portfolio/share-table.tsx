'use client';

import { useState, useEffect, Fragment } from 'react';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { formatStockCurrency } from '@/app/lib/utils';

type Stock = {
    symbol: string,
    purchasePrice: number,
    quantity: number,
    cmp: number,
    invested: number,
    currentValue: number,
    exchange: string,
    sector: string,
    pe: number,
    earnings: number,
    profitLoss: number,
    profitLossPercentage: number,
    portfolioPercentage: number,
};

export default function LivePortfolio() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSector, setSelectedSector] = useState("All");

    const uniqueSectors = ["All", ...Array.from(new Set(stocks.map((s) => s.sector || "Unknown")))];

    const stocksFilteredBySector = selectedSector === "All" ? stocks : stocks.filter((stock) => stock.sector === selectedSector);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/stocks');
            const data = await res.json();
            console.log("Fetched data: " + data);
            const filtered = data.filter((stock: Stock | null): stock is Stock => stock !== null);
            setStocks(filtered);
        } catch (err) {
            console.log("Error fetching stocks data: " + err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);


    const portfolio = stocks.reduce(
        (acc, stock) => {
            acc.invested += stock?.invested ?? 0;
            acc.currentValue += stock?.currentValue ?? 0;
            return acc;
        }, {invested: 0, currentValue: 0}
    );

    const groupedStocks = stocksFilteredBySector.reduce((groups, stock) => {
        const sector = stock.sector || "Unknown";
        if (!groups[sector]) {
          groups[sector] = [];
        }
        groups[sector].push(stock);
        return groups;
      }, {} as Record<string, typeof stocks>
    );

    const sortOptions = [
        { label: "Profit % (desc)", value: "profitLossPercentage" },
        { label: "CMP (desc)", value: "cmp" },
        { label: "Invested Amount (desc)", value: "invested" },
        { label: "Current Value (desc)", value: "currentValue" },
        { label: "P/E Ratio (desc)", value: "pe" },
    ];

    const [selectedSortKey, setSelectedSortKey] = useState("profitLossPercentage");

    const sortedGroupStocks = Object.entries(groupedStocks).reduce(
        (acc, [sector, stocks]) => {
            acc[sector] = [...stocks].sort((a, b) => {const key = selectedSortKey as keyof Stock;
                return (Number(b[key]) ?? 0) - (Number(a[key]) ?? 0);});
            return acc
        },
        {} as Record<string, Stock[]>
    );
    
    const profitLoss = portfolio.currentValue - portfolio.invested;
    const profitLossPercent = (profitLoss/portfolio.invested) * 100 || 0;

    if (loading) return <p>Loading live portfolio....</p>;

    return (
        <div className="mt-6 flow-root">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                <div className="md:hidden">
                    {stocks.map((stock) => (
                        <div
                            key={stock.symbol}
                            className="md:hidden mb-2 w-full rounded-md bg-white p-4"
                        >
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <p className="text-sm text-gray-500">{stock.symbol}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{stock.sector}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{stock.exchange}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{stock.purchasePrice}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{stock.pe}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{stock.earnings}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                  </div>
                  <div className = "rounded-xl bg-gray-50 p-2 shadow-sm">
                        <div className="flex py-4">
                            <BanknotesIcon className="h-5 w-5 text-gray-700"></BanknotesIcon>
                            <h1 className="ml-2 text-sm font-medium">Portfolio Summary</h1>
                        </div>
                        <div>
                            <div className="grid grid-cols-3 p-2 bg-white gap-4 text-sm text-gray-800">
                                <div>
                                    <div className="text-gray-500">Investment</div>
                                    <div className="font-medium">{formatStockCurrency(portfolio.invested)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Current Value</div>
                                    <div className="font-medium">{formatStockCurrency(portfolio.currentValue)}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500">Gain / Loss</div>
                                        <div className={
                                                profitLoss > 0
                                                ? "text-green-600 font-medium"
                                                : profitLoss < 0
                                                ? "text-red-600 font-medium"
                                                : "text-gray-600 font-medium"
                                            }>
                                                {formatStockCurrency(Math.abs(profitLoss))} ({profitLossPercent.toFixed(2)}%)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>  
                        <select
                            value={selectedSortKey}
                            onChange={(e) => setSelectedSortKey(e.target.value)}
                            className="mb-4 rounded border px-2 py-1 text-sm"
                            >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    Sort by {option.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedSector}
                            onChange={(e) => setSelectedSector(e.target.value)}
                            className="m-8 rounded border px-2 py-1 text-sm"
                        >
                            {uniqueSectors.map((sector) => (
                                <option key={sector} value={sector}>
                                    Filter by {sector}
                                </option>
                            ))}                           
                        </select>
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal uppercase border-y border-gray-200 sticky top-0 bg-white z-10 shadow-sm">
                        <tr>
                            <th scope="col" className="px-3 py-5 font-medium sm:pl-6">
                            Name
                            </th>
                            {/* <th scope="col" className="px-3 py-5 font-medium">
                            Sector
                            </th> */}
                            <th scope="col" className="px-3 py-5 font-medium">
                            Purchase Price
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                            Quantity                                  </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                            CMP
                            <span className="ml-1 relative group cursor-pointer">
                                ℹ️
                                <div className="absolute z-10 hidden group-hover:block w-64 p-2 text-sm text-white bg-gray-800 rounded shadow-lg top-full left-1/2 transform -translate-x-1/2 mt-1">
                                The latest trading price of the stock in the market.
                                </div>
                            </span>                            
                            </th>
                            <th scope="col" className="relative py-3 px-3 font-medium">
                            Exchange
                            </th>
                            <th scope="col" className="px-3 py-5 font-medium">
                            P/E Ratio
                            <span className="ml-1 relative group cursor-pointer">
                                ℹ️
                                <div className="absolute z-10 hidden group-hover:block w-64 p-2 text-sm text-white bg-gray-800 rounded shadow-lg top-full left-1/2 transform -translate-x-1/2 mt-1">
                                The ratio of a company’s share price to its earnings per share. Helps assess valuation.
                                </div>
                            </span>
                            </th>
                            <th scope="col" className="relative py-3 pl-6 pr-3 font-medium">
                            EPS
                            <span className="ml-1 relative group cursor-pointer">
                                ℹ️
                                <div className="absolute z-10 hidden group-hover:block w-64 p-2 text-sm text-white bg-gray-800 rounded shadow-lg top-full left-1/2 transform -translate-x-1/2 mt-1">
                                The monetary value of earnings per outstanding share during the last 52 weeks.
                                </div>
                            </span>
                            </th>
                            <th scope="col" className="relative py-3 pl-6 pr-3 font-medium">
                            Investment
                            </th>
                            <th scope="col" className="relative py-3 pl-6 pr-3 font-medium">
                            Current Value
                            </th>
                            <th scope="col" className="relative py-3 pl-6 pr-3 font-medium">
                            % Change
                            </th>
                            <th scope="col" className="relative py-3 pl-6 pr-3 font-medium">
                            Portfolio %
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white">
                        {Object.entries(sortedGroupStocks).map(([sector, sectorStocks]) => (
                                <Fragment key={sector}>
                                {/* Sector Heading Row */}
                                <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                                  <td colSpan={11} className="py-2 px-4">{`Sector: ${sector}`}</td>
                                </tr>
                          
                                {/* Stock Rows */}
                                {sectorStocks.map((stock) => (
                                //   <tr
                                //     key={stock.symbol}
                                //     className="border-b text-sm last-of-type:border-none"
                                //   >
                                //     <td className="px-4 py-2">{stock.symbol}</td>
                                //     <td className="px-4 py-2">{stock.cmp}</td>
                                //     <td className="px-4 py-2">{stock.pe}</td>
                                //     <td className="px-4 py-2">{stock.earnings}</td>
                                //     <td className="px-4 py-2">{stock.portfolioPercentage?.toFixed(2)}%</td>
                                //     <td className="px-4 py-2">{stock.profitLoss.toFixed(2)}</td>
                                //     <td className="px-4 py-2">{stock.profitLossPercentage.toFixed(2)}%</td>
                                //   </tr>
                                <tr
                                key={stock.symbol}
                                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                <td className="whitespace-nowrap py-3 pl-6 pr-3 border border-gray-200">
                                    <div className="flex items-center gap-3">
                                    <p>{stock.symbol.endsWith('NS') ? stock.symbol.slice(0, -3) : stock.symbol}</p>
                                    </div>
                                </td>
                                {/* <td className="whitespace-nowrap px-3 py-3">
                                    {stock.sector}
                                </td> */}
                                <td className="whitespace-nowrap px-3 py-3 border border-gray-200">
                                    {formatStockCurrency(stock.purchasePrice)}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3 border border-gray-200">
                                    {stock.quantity}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3 border border-gray-200">
                                    {formatStockCurrency(stock.cmp)}
                                </td>
                                <td className="whitespace-nowrap py-3 pl-6 pr-3 border border-gray-200">
                                    {stock.exchange}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3 border border-gray-200">
                                    {stock.pe?.toFixed(2)}
                                </td>
                                <td className="whitespace-nowrap py-3 pl-6 pr-3 border border-gray-200">
                                    {stock.earnings?.toFixed(2)}
                                </td>
                                <td className="whitespace-nowrap px-3 py-3 border border-gray-200">
                                    {formatStockCurrency(stock.invested)}
                                </td>
                                <td className="whitespace-nowrap py-3 pl-6 pr-3 border border-gray-200">
                                    {formatStockCurrency(stock.currentValue)}
                                </td>
                                <td className="whitespace-nowrap py-3 pl-6 pr-3 border border-gray-200">   
                                    {(stock.currentValue > stock.invested) ? (
                                        <span className="text-green-500">
                                            {formatStockCurrency(stock.profitLoss)} ({(stock.profitLossPercentage).toFixed(2)}%)
                                        </span> 
                                     ) : (stock.currentValue < stock.invested)  ? (
                                        <span className="text-red-500">
                                             {formatStockCurrency(Math.abs(stock.profitLoss))} ({(stock.profitLossPercentage).toFixed(2)}%)
                                        </span>
                                     ) : (
                                        <span className="text-gray-500">
                                            {formatStockCurrency(0)} (0.00%)
                                        </span>
                                     )
                                    }
                                </td>
                                <td className="whitespace-nowrap py-3 pl-6 pr-3 border border-gray-200">
                                    {stock.portfolioPercentage?.toFixed(2)}%
                                </td>
                                </tr>
                                ))}
                                </Fragment>
                        ))}
                        </tbody>
                    </table>
            </div>
          </div> 
        </div>
    )
}