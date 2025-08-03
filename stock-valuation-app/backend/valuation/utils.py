import pandas as pd

def fetch_stock_data(ticker):
    import yfinance as yf
    stock = yf.Ticker(ticker)
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
    import yfinance as yf
    stock = yf.Ticker(ticker)
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

def get_stock_financials(ticker):
    import yfinance as yf
    stock = yf.Ticker(ticker)
    return stock.financials