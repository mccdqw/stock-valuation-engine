import streamlit as st
import yfinance as yf
import pandas as pd
import numpy as np

st.set_page_config(page_title="Stock Valuation App", layout="centered")
st.title("📈 Stock DCF Engine")

@st.cache_data
def get_stock_data(ticker):
    stock = yf.Ticker(ticker)
    info = stock.info
    cashflow = stock.cashflow
    return info, cashflow

# ---- DCF FUNCTION ----
def dcf_model(fcf, growth, discount, years=5, terminal_growth=0.02):
    fcf = fcf * (1 + growth)
    npv = 0
    for t in range(1, years + 1):
        npv += fcf / ((1 + discount) ** t)
        fcf *= (1 + growth)
    terminal_value = fcf * (1 + terminal_growth) / (discount - terminal_growth)
    terminal_pv = terminal_value / ((1 + discount) ** years)
    return npv + terminal_pv


# --- Live Ticker Search ---
search_query = st.text_input("Search for a company or ticker:")
ticker_options = []
if search_query:
    try:
        lookup = yf.Lookup(search_query)
        short_names = lookup.stock.shortName  # pd.Series
        if isinstance(short_names, pd.Series) and not short_names.empty:
            # Create ticker options from the Series: "SYMBOL - shortName"
            ticker_options = [f"{symbol} - {name}" for symbol, name in short_names.items()]
        else:
            st.write("No matches found.")
    except Exception as e:
        st.error(f"Search error: {e}")

selected = st.selectbox("Select a ticker:", ticker_options) if ticker_options else None
ticker = selected.split(" - ")[0] if selected else None

# --- DCF Section ---
if ticker:
    try:
        info, cashflow = get_stock_data(ticker.upper())
        st.subheader(f"{info['shortName']} ({ticker.upper()})")

        # Compute FCF
        try:
            fcf = cashflow.loc["Operating Cash Flow"].iloc[0] - \
                  cashflow.loc["Capital Expenditure"].iloc[0]
        except KeyError:
            st.warning("Could not find Free Cash Flow data.")
            st.stop()

        st.markdown(f"**Latest Free Cash Flow (FCF):** ${fcf:,.0f}")

        # DCF Inputs
        st.subheader("DCF Model Inputs")
        years = st.number_input("Years of Projection", min_value=1, max_value=20, value=5)
        growth = st.number_input("FCF Growth Rate (%)", value=8.0) / 100
        discount = st.number_input("Discount Rate (%)", value=10.0) / 100
        terminal_growth = st.number_input("Terminal Growth Rate (%)", value=2.0) / 100

        intrinsic_value = dcf_model(fcf, growth, discount, years, terminal_growth)
        shares_outstanding = info.get("sharesOutstanding", None)

        if shares_outstanding:
            intrinsic_per_share = intrinsic_value / shares_outstanding
            st.success(f"**Intrinsic Value per Share:** ${intrinsic_per_share:,.2f}")
        else:
            st.warning("Could not retrieve shares outstanding to calculate intrinsic value per share.")

    except Exception as e:
        st.error(f"Error fetching data: {e}")

