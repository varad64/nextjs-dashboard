import { mockPortfolio, userPortfolio } from './mock-data';
import yahooFinance from 'yahoo-finance2';

export async function fetchStocksData() {
    const symbols = userPortfolio.map((stock) => stock.symbol);
    const quote = await yahooFinance.quote(symbols);
    const totalPortfolio = userPortfolio.reduce(
      (sum, s) => sum + s.purchasePrice * s.quantity, 0
    );
    const shares = await Promise.all(
      quote.map(async (stock) => {
        // console.log(stock);
        const userStock = userPortfolio.find(s => s.symbol === stock.symbol);
        if(!userStock) 
          return null;
  
        const purchasePrice = userStock.purchasePrice;
        const quantity = userStock.quantity;
        const invested = purchasePrice * quantity;
        const cmp = stock.regularMarketPrice;
        const currentValue = cmp ? (cmp * quantity) : 0;
        const symbol = stock.symbol;
        const exchange = stock.fullExchangeName;
        const summary = await yahooFinance.quoteSummary(symbol, {modules: [ "assetProfile" ]});    
        const sector = summary.assetProfile?.sector; 
        const pe = stock.trailingPE;
        const earnings = stock.priceEpsCurrentYear;
        const portfolioPercentage = totalPortfolio > 0 ? (invested / totalPortfolio) * 100 : 0;
  
        const profitLoss = currentValue - invested;
        const profitLossPercentage = (profitLoss/invested)*100;
  
        return {
          purchasePrice,
          quantity,
          invested,
          cmp,
          currentValue,
          symbol,
          exchange,
          sector,
          pe,
          earnings,
          profitLoss,
          profitLossPercentage,
          portfolioPercentage
        };
      })
    );
  
    return shares;
  
    // const stocks = mockPortfolio.map((stock) => {
    //   const purchasePrice = stock.purchasePrice / 100;
    //   const cmp = stock.cmp / 100;
    //   const investment = purchasePrice * stock.quantity;
    //   const currentValue = cmp * stock.quantity;
    //   const profitLoss = currentValue - investment;
    //   const portfolioPercent = (investment / totalPortfolio) * 100;
    //   console.log(purchasePrice, cmp, investment, currentValue);
    //   return {
    //     ...stock,
    //     investment,
    //     currentValue,
    //     profitLoss,
    //     portfolioPercent,
    //   }
    // });
  
    // return stocks;
  }