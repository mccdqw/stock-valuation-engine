# Stock Valuation App Backend

This is the backend component of the Stock Valuation App, built using Flask. The backend handles API requests for stock data and performs calculations for discounted cash flow (DCF) valuations.

## Project Structure

- **app.py**: Entry point for the Flask application. Initializes the app and sets up routes.
- **requirements.txt**: Lists the dependencies required for the Flask backend.
- **valuation/**: Contains the valuation module with utility functions and routes.
  - **__init__.py**: Initializes the valuation module.
  - **routes.py**: Defines API routes for fetching stock data and performing valuations.
  - **utils.py**: Contains utility functions for data processing.

## Setup Instructions

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd stock-valuation-app/backend
   ```

2. **Create a virtual environment** (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install dependencies**:
   ```
   pip install -r requirements.txt
   ```

4. **Run the Flask application**:
   ```
   python app.py
   ```

The backend will be running on `http://127.0.0.1:5000` by default.

## Usage Examples

- **Fetch stock data**: Send a GET request to `/api/stock/<ticker>` to retrieve stock information.
- **Perform DCF valuation**: Send a POST request to `/api/valuation` with the required parameters to calculate the intrinsic value of a stock.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.