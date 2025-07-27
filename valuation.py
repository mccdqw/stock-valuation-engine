import requests
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("ALPHAVANTAGE_API_KEY")

def get_stock_data(ticker):
    def get_json(function, symbol):
        url = f"https://www.alphavantage.co/query?function={function}&symbol={symbol}&apikey={api_key}"
        response = requests.get(url)
        return response.json()

    overview = get_json("OVERVIEW", ticker)
    cashflow = get_json("CASH_FLOW", ticker)
    quote = get_json("GLOBAL_QUOTE", ticker)

    print("overview:", overview)
    print("\ncashflow:", cashflow)
    print("\nquote", quote)

    try:
        eps = float(overview.get("EPS", 0))
        pe_ratio = float(overview.get("PERatio", 0))
        growth = float(overview.get("RevenueTTM", 0))
        shares = float(overview.get("SharesOutstanding", 1))
        price = float(quote["Global Quote"]["05. price"])

        # Free Cash Flow = CFO - CapEx
        annual_reports = cashflow.get("annualReports", [])
        if annual_reports:
            op_cf = float(annual_reports[0].get("operatingCashflow", 0))
            capex = float(annual_reports[0].get("capitalExpenditures", 0))
            fcf = op_cf + capex
        else:
            fcf = 0

        return {
            'eps': eps,
            'pe': pe_ratio,
            'growth': 0.10,  #TODO: update
            'fcf': fcf,
            'shares': shares,
            'price': price
        }

    except Exception as e:
        print("Error processing data:", e)
        return {
            'eps': 0, 'pe': 0, 'growth': 0, 'fcf': 0, 'shares': 1, 'price': 0
        }


# --- Valuation Models ---

def dcf_model(fcf, growth, discount, years=5, terminal_growth=0.02):
    fcf = fcf * (1 + growth)
    npv = 0
    for t in range(1, years + 1):
        npv += fcf / ((1 + discount) ** t)
        fcf *= (1 + growth)

    terminal_value = fcf * (1 + terminal_growth) / (discount - terminal_growth)
    terminal_pv = terminal_value / ((1 + discount) ** years)
    return npv + terminal_pv

def graham_valuation(eps, growth):
    return eps * (8.5 + 2 * (growth * 100))

def pe_multiple_valuation(eps, peer_pe=15):
    return eps * peer_pe

# --- Master Function ---

def run_valuation(ticker):
    print(f"\nRunning valuation for: {ticker.upper()}")
    data = get_stock_data(ticker)

    eps = data['eps']
    growth = data['growth']
    fcf = data['fcf']
    shares = data['shares']
    price = data['price']

    # Intrinsic Value Calculations
    dcf_total = dcf_model(fcf, growth, discount=0.10)
    dcf_per_share = dcf_total / shares

    graham = graham_valuation(eps, growth)
    multiple = pe_multiple_valuation(eps)

    print(f"\nCurrent Price: ${price:.2f}")
    print(f"Estimated Intrinsic Value (DCF): ${dcf_per_share:.2f}")
    print(f"Estimated Intrinsic Value (Graham): ${graham:.2f}")
    print(f"Estimated Intrinsic Value (PE Multiple): ${multiple:.2f}")

if __name__ == "__main__":
    ticker_input = input("Enter stock ticker (e.g., AAPL): ")
    run_valuation(ticker_input)
