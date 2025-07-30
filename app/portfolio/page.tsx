import { lusitana } from "@/app/ui/fonts";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { fetchStocksData } from "@/app/lib/stock-data";
import { formatCurrency } from "@/app/lib/utils";
import LivePortfolio from "@/app/ui/portfolio/share-table";

export default async function Page() {
    const stocks = await fetchStocksData();

    const portfolio = stocks.reduce(
        (acc, stock) => {
            acc.invested += stock?.invested ?? 0;
            acc.currentValue += stock?.currentValue ?? 0;
            return acc;
        }, {invested: 0, currentValue: 0}
    );
    
    const profitLoss = portfolio.currentValue - portfolio.invested;
    const profitLossPercent = (profitLoss/portfolio.invested) * 100 || 0;

    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Live Stock Portfolio</h1>
        <LivePortfolio />
      </main>
    );

    // return (
    //     <div className="mt-6 flow-root">
    //       <div className="inline-block min-w-full align-middle">
    //         <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
    //             <div className="md:hidden">
    //                 {stocks?.filter((stock): stock is NonNullable<typeof stock> => stock != null).map((stock) => (
    //                     <div
    //                         key={stock.symbol}
    //                         className="md:hidden mb-2 w-full rounded-md bg-white p-4"
    //                     >
    //                         <div className="flex items-center justify-between border-b pb-4">
    //                             <div>
    //                                 <p className="text-sm text-gray-500">{stock.symbol}</p>
    //                             </div>
    //                             <div>
    //                                 <p className="text-sm text-gray-500">{stock.sector}</p>
    //                             </div>
    //                             <div>
    //                                 <p className="text-sm text-gray-500">{stock.exchange}</p>
    //                             </div>
    //                             <div>
    //                                 <p className="text-sm text-gray-500">{stock.purchasePrice}</p>
    //                             </div>
    //                             <div>
    //                                 <p className="text-sm text-gray-500">{stock.pe}</p>
    //                             </div>
    //                             <div>
    //                                 <p className="text-sm text-gray-500">{stock.earnings}</p>
    //                             </div>
    //                         </div>
    //                     </div>
    //                 ))}
    //               </div>
    //               <div className = "rounded-xl bg-gray-50 p-2 shadow-sm">
    //                     <div className="flex p-4">
    //                         <BanknotesIcon className="h-5 w-5 text-gray-700"></BanknotesIcon>
    //                         <h2 className="ml-2 text-sm font-medium">Portfolio Summary</h2>
    //                     </div>
    //                     <div>
    //                         <div className="grid grid-cols-3 bg-white gap-4 text-sm text-gray-800">
    //                             <div>
    //                                 <div className="text-gray-500">Investment</div>
    //                                 <div className="font-medium">${portfolio.invested.toFixed(2)}</div>
    //                             </div>
    //                             <div>
    //                                 <div className="text-gray-500">Current Value</div>
    //                                 <div className="font-medium">${portfolio.currentValue.toFixed(2)}</div>
    //                             </div>
    //                             <div>
    //                                 <div className="text-gray-500">Gain / Loss</div>
    //                                     <div className={
    //                                             profitLoss > 0
    //                                             ? "text-green-600 font-medium"
    //                                             : profitLoss < 0
    //                                             ? "text-red-600 font-medium"
    //                                             : "text-gray-600 font-medium"
    //                                         }>
    //                                             ${profitLoss.toFixed(2)} ({profitLossPercent.toFixed(2)}%)
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         </div>
    //                     </div>  
    //                 <table className="hidden min-w-full text-gray-900 md:table">
    //                     <thead className="rounded-lg text-left text-sm font-normal">
    //                     <tr>
    //                         <th scope="col" className="px-3 py-5 font-medium sm:pl-6">
    //                         Name
    //                         </th>
    //                         <th scope="col" className="px-3 py-5 font-medium">
    //                         Sector
    //                         </th>
    //                         <th scope="col" className="px-3 py-5 font-medium">
    //                         Purchase Price
    //                         </th>
    //                         <th scope="col" className="px-3 py-5 font-medium">
    //                         Quantity                                  </th>
    //                         <th scope="col" className="px-3 py-5 font-medium">
    //                         CMP
    //                         </th>
    //                         <th scope="col" className="relative py-3 pl-6 pr-3 font-medium">
    //                         Exchange
    //                         </th>
    //                         <th scope="col" className="px-3 py-5 font-medium">
    //                         PE Ratio
    //                         </th>
    //                         <th scope="col" className="relative py-3 pl-6 pr-3 font-medium">
    //                         Latest Earnings
    //                         </th>
    //                         <th scope="col" className="relative py-3 pl-6 pr-3 font-medium">
    //                         Investment
    //                         </th>
    //                         <th scope="col" className="relative py-3 pl-6 pr-3 font-medium">
    //                         Current Value
    //                         </th>
    //                         <th scope="col" className="relative py-3 pl-6 pr-3 font-medium">
    //                         % Change
    //                         </th>
    //                     </tr>
    //                     </thead>
    //                     <tbody className="bg-white">
    //                     {stocks?.filter((stock): stock is NonNullable<typeof stock> => stock != null).map((stock) => (
    //                         <tr
    //                         key={stock.symbol}
    //                         className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
    //                         >
    //                         <td className="whitespace-nowrap py-3 pl-6 pr-3">
    //                             <div className="flex items-center gap-3">
    //                             <p>{stock.symbol.endsWith('NS') ? stock.symbol.slice(0, -3) : stock.symbol}</p>
    //                             </div>
    //                         </td>
    //                         <td className="whitespace-nowrap px-3 py-3">
    //                             {stock.sector}
    //                         </td>
    //                         <td className="whitespace-nowrap px-3 py-3">
    //                             {stock.purchasePrice.toFixed(2)}
    //                         </td>
    //                         <td className="whitespace-nowrap px-3 py-3">
    //                             {stock.quantity}
    //                         </td>
    //                         <td className="whitespace-nowrap px-3 py-3">
    //                             {stock.cmp?.toFixed(2)}
    //                         </td>
    //                         <td className="whitespace-nowrap py-3 pl-6 pr-3">
    //                             {stock.exchange}
    //                         </td>
    //                         <td className="whitespace-nowrap px-3 py-3">
    //                             {stock.pe?.toFixed(2)}
    //                         </td>
    //                         <td className="whitespace-nowrap py-3 pl-6 pr-3">
    //                             {stock.earnings?.toFixed(2)}
    //                         </td>
    //                         <td className="whitespace-nowrap px-3 py-3">
    //                             ${stock.invested?.toFixed(2)}
    //                         </td>
    //                         <td className="whitespace-nowrap py-3 pl-6 pr-3">
    //                             ${stock.currentValue?.toFixed(2)}
    //                         </td>
    //                         <td className="whitespace-nowrap py-3 pl-6 pr-3">   
    //                             {(stock.currentValue > stock.invested) ? (
    //                                 <span className="text-green-500">
    //                                     ${stock.profitLoss?.toFixed(2)} ({(stock.profitLossPercentage).toFixed(2)}%)
    //                                 </span> 
    //                              ) : (stock.currentValue < stock.invested)  ? (
    //                                 <span className="text-red-500">
    //                                      ${stock.profitLoss?.toFixed(2)} ({(stock.profitLossPercentage).toFixed(2)}%)
    //                                 </span>
    //                              ) : (
    //                                 <span className="text-gray-500">
    //                                     {formatCurrency(0)} (0.00%)
    //                                 </span>
    //                              )
    //                             }
    //                         </td>
    //                         </tr>
    //                     ))}
    //                     </tbody>
    //                 </table>
    //         </div>
    //       </div> 
    //     </div>
    // )
};