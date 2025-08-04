import pandas as pd
import numpy as np

def fetch_stock_data(ticker):
    stock = get_stock(ticker)
    info = stock.info
    cashflow = stock.cashflow
    return info, cashflow

def dcf_model(fcf, growth, discount, years=5, terminal_growth=0.02):
    fcf = fcf * (1 + growth)
    npv = 0
    for t in range(1, years + 1):
        npv += fcf / ((1 + discount) ** t)
        fcf *= (1 + growth)
    terminal_value = fcf * (1 + terminal_growth) / (discount - terminal_growth)
    terminal_pv = terminal_value / ((1 + discount) ** years)
    return npv + terminal_pv

def get_avg_pe_ratio(ticker):
    stock = get_stock(ticker)
    financials = stock.financials
    net_income = financials.loc["Net Income"]
    shares_outstanding = financials.loc["Basic Average Shares"]
    eps = net_income / shares_outstanding
    price_data = stock.history(period="4y", interval="1d")
    price_data = price_data.resample("YE").last()
    eps.index = eps.index.year
    price_data.index = price_data.index.year
    merged = pd.DataFrame({
        "EPS": eps,
        "Price": price_data["Close"]
    }).dropna()
    merged["P/E"] = merged["Price"] / merged["EPS"]
    return merged["P/E"]

def get_revenue(ticker):
    financials = get_stock_financials(ticker)
    revenue = financials.loc['Total Revenue']
    revenue.index = revenue.index.year
    return revenue

def get_net_income(ticker):
    financials = get_stock_financials(ticker)
    net_income = financials.loc["Net Income"]
    net_income.index = net_income.index.year
    return net_income

def get_shares_outstanding(ticker):
    financials = get_stock_financials(ticker)
    shares_outstanding = financials.loc["Basic Average Shares"]
    shares_outstanding.index = shares_outstanding.index.year
    return shares_outstanding

def get_ltl_fcf(ticker):
    stock = get_stock(ticker)
    balance_sheet = stock.balance_sheet
    cashflow = stock.cashflow
    ltl = balance_sheet.loc["Total Non Current Liabilities Net Minority Interest"]
    fcf = cashflow.loc["Free Cash Flow"]
    return ltl.iloc[0], fcf

def get_market_cap(ticker):
    import yfinance as yf
    stock = yf.Ticker(ticker)
    return stock.info["marketCap"]

def run_dcf_monte_carlo(ticker, iterations=1000,
    revenue_growth_mean=0.25,
    revenue_growth_std=0.02,
    margin_std=0.03,
    discount_rate_mean=0.10,
    discount_rate_std=0.02,
    years=5):
    intrinsic_values = []
    stock = get_stock(ticker)

    for _ in range(iterations):
        revenue = get_revenue(ticker).iloc[0]
        fcf = stock.cashflow.loc["Free Cash Flow"].iloc[0]
        margin_mean = fcf / revenue
        shares_outstanding = get_shares_outstanding(ticker).iloc[0]

        growth = np.random.normal(revenue_growth_mean, revenue_growth_std)
        margin = np.random.normal(margin_mean, margin_std)
        discount_rate = np.random.normal(discount_rate_mean, discount_rate_std)

        cash_flows = []

        for _ in range(years):
            revenue *= (1 + growth)
            cash_flow = revenue * margin
            cash_flows.append(cash_flow)

        terminal_growth_rate = 0.02  # 2% terminal growth rate, adjust as needed
        # Calculate terminal value based on last year's cash flow
        terminal_value = cash_flows[-1] * (1 + terminal_growth_rate) / (discount_rate - terminal_growth_rate)
        # Discount terminal value back to present
        terminal_value_pv = terminal_value / (1 + discount_rate)**years
        # Total present value = sum of discounted cash flows + discounted terminal value
        present_value = sum(cf / (1 + discount_rate)**(i+1) for i, cf in enumerate(cash_flows)) + terminal_value_pv
        if isinstance(present_value, float) and not np.isnan(present_value) and shares_outstanding > 0:
            intrinsic_per_share = present_value / shares_outstanding
            intrinsic_values.append(intrinsic_per_share)

    return intrinsic_values


def get_stock_financials(ticker):
    stock = get_stock(ticker)
    return stock.financials

def get_stock(ticker):
    import yfinance as yf
    return yf.Ticker(ticker)