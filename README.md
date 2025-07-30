## Dynamic Investment Portfolio

![alt text](assets/portfolio screen.png)

This project is a dynamic investment portfolio dashboard built using react and next.js
The project structure is as below:
 - /app/lib:
        - mock-data.ts - Source of stocks owned by the user. Contains the static user information which can be updated to include any number of stocks, indicative of a real user's portfolio.
        - stock-data.ts - The fetchStocksData() method here is crucial, it combines the static user data from mock-data.ts to figure out what all stocks are to be queried from the yahoo-finance-2 api, & then fetches all the dynamic information for a share, such as Current Market Price, Exchange, P/E ratio, EPS, some calculated metrics based on user information and dynamic stock data and returns an array of objects of type Stock.
        - utils.ts - Contains a utility function to print formatted currency values.

 - /app/ui/portfolio:
        - share-table.tsx - Another crucial piece. This is a client component which constructs the portfolio table piece by piece. It refreshes data after every 15 seconds.

 - /app/api/stocks/:
        - route.ts - Defines a template GET request, which the share-table.tsx code can use to fetch the yahoo-finance-2 API's response 

 - /app/portfolio/:
        - page.tsx - Uses the next.js reccommended App router pattern to render the portfolio table.

Setup:
- Fork this repo's portfolio branch
- Ensure next.js is installed on the system
- Start Next.js in development mode, for example, with the comnmand pnpm next dev
- Portfolio with live table can be observed at http://localhost:3000/portfolio
- The /app/lib/mock-data.ts file can be updated to change user's stock information