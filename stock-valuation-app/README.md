# Stock Valuation App

This project is a Stock Valuation application that utilizes a Flask backend and a React frontend. The application allows users to perform discounted cash flow (DCF) analysis on various stocks, providing insights into their intrinsic value and key financial metrics.

## Project Structure

The project is organized into two main directories: `backend` and `frontend`.

### Backend

The backend is built using Flask and is responsible for handling API requests, fetching stock data, and performing calculations.

- **app.py**: The entry point for the Flask application. Initializes the app and sets up routes.
- **requirements.txt**: Lists the dependencies required for the Flask backend.
- **valuation/**: A module containing:
  - **\_\_init\_\_.py**: Initializes the valuation module.
  - **routes.py**: Defines API routes for fetching stock data and performing DCF calculations.
  - **utils.py**: Contains utility functions for data processing.

### Frontend

The frontend is built using React and provides a user interface for interacting with the backend.

- **public/index.html**: The main HTML file for the React application.
- **src/**: Contains the React application source code, including:
  - **App.js**: The main component that sets up routing and structure.
  - **index.js**: The entry point that renders the App component.
  - **components/**: Contains React components for various functionalities:
    - **ValuationForm.js**: Component for inputting stock data and DCF parameters.
    - **MetricsDisplay.js**: Component for displaying key financial metrics.
    - **TickerSearch.js**: Component for searching and selecting stock tickers.
  - **api/valuationApi.js**: Functions for making API calls to the Flask backend.

## Setup Instructions

### Backend Setup

1. Navigate to the `backend` directory.
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the Flask application:
   ```
   python app.py
   ```

### Frontend Setup

1. Navigate to the `frontend` directory.
2. Install the required dependencies:
   ```
   npm install
   ```
3. Start the React application:
   ```
   npm start
   ```

## Usage

Once both the backend and frontend are running, you can access the application in your web browser. Use the search functionality to find stocks, input parameters for the DCF model, and view key metrics.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.