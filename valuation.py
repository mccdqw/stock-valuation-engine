import requests
import streamlit as st
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
        shares = float(overview.get("SharesOutstanding", 1))
        price = float(quote["Global Quote"]["05. price"])

        # Free Cash Flow = Operating CF - CapEx
        annual_reports = cashflow.get("annualReports", [])
        if annual_reports:
            op_cf = float(annual_reports[0].get("operatingCashflow", 0))
            capex = float(annual_reports[0].get("capitalExpenditures", 0))
            fcf = op_cf + capex  # capex is negative
        else:
            fcf = 0

        return {
            'eps': eps,
            'pe': pe_ratio,
            'fcf': fcf,
            'shares': shares,
            'price': price
        }
    except Exception as e:
        st.error(f"Error: {e}")
        return None


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

# === STREAMLIT DASH ===

st.set_page_config(page_title="Stock Valuation", layout="centered")

st.title("📊 Stock Valuation Dashboard")
ticker = st.text_input("Enter Stock Ticker (e.g., AAPL, MSFT):").upper()

if ticker:
    data = get_stock_data(ticker)

    if data:
        st.subheader(f"📈 Current Price: ${data['price']:.2f}")

        # Parameters
        growth = float(st.text_input("Expected FCF/EPS Growth Rate (e.g. 0.10 for 10%)", value="0.10"))
        discount = float(st.text_input("Discount Rate (e.g. 0.10 for 10%)", value="0.10"))
        terminal_growth = float(st.text_input("Terminal Growth Rate (e.g. 0.02 for 2%)", value="0.02"))
        peer_pe = float(st.text_input("Peer P/E Ratio (e.g. 15)", value="15"))
        years = int(st.text_input("Number of Years for DCF Projection", value="5"))

        # Models
        dcf_total = dcf_model(data['fcf'], growth, discount, years, terminal_growth)
        dcf_per_share = dcf_total / data['shares']

        graham = graham_valuation(data['eps'], growth)
        multiple = pe_multiple_valuation(data['eps'], peer_pe)

        # Output
        st.markdown("### 📌 Intrinsic Value Estimates")
        st.metric("DCF Valuation / Share", f"${dcf_per_share:.2f}")
        st.metric("Graham Estimate", f"${graham:.2f}")
        st.metric("P/E Multiple Estimate", f"${multiple:.2f}")

        # Summary Table
        st.markdown("### 🧾 Summary")
        st.write({
            "EPS": data['eps'],
            "Free Cash Flow (last year)": data['fcf'],
            "Shares Outstanding": data['shares'],
            "P/E Ratio": data['pe'],
        })
