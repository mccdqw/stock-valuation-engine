# Stock Valuation App - Frontend

This is the frontend part of the Stock Valuation App, built using React. It interacts with the Flask backend to provide users with a seamless experience for stock valuation.

## Getting Started

To get started with the frontend, follow these steps:

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd stock-valuation-app/frontend
   ```

2. **Install dependencies**:
   Make sure you have Node.js installed. Then, run:
   ```
   npm install
   ```

3. **Run the application**:
   Start the development server with:
   ```
   npm start
   ```
   This will open the application in your default web browser at `http://localhost:3000`.

## Folder Structure

- **public/**: Contains the static files, including `index.html`.
- **src/**: Contains the React components and application logic.
  - **components/**: Contains reusable components such as `ValuationForm`, `MetricsDisplay`, and `TickerSearch`.
  - **api/**: Contains functions for making API calls to the Flask backend.

## Components

- **ValuationForm**: A form for users to input stock data and parameters for the DCF model.
- **MetricsDisplay**: Displays key metrics like average P/E ratio and revenue growth.
- **TickerSearch**: Allows users to search and select stock tickers.

## API Integration

The frontend communicates with the Flask backend through the API defined in `src/api/valuationApi.js`. Ensure the backend is running to fetch data and perform valuations.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.