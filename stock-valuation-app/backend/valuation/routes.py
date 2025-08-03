from flask import Blueprint, request, jsonify
import yfinance as yf
import pandas as pd
from .utils import dcf_model, get_avg_pe_ratio, get_revenue, fetch_stock_data, get_net_income, get_shares_outstanding, get_ltl_fcf, get_market_cap

valuation_bp = Blueprint('valuation', __name__)

@valuation_bp.route('/api/tickers', methods=['GET'])
def search_tickers():
    query = request.args.get('query', '')
    if not query:
        return jsonify([])

    try:
        lookup = yf.Lookup(query)
        short_names = lookup.stock.shortName  # pd.Series

        if isinstance(short_names, pd.Series) and not short_names.empty:
            # "SYMBOL - shortName" format
            ticker_options = [f"{symbol} - {name}" for symbol, name in short_names.items()]
            return jsonify(ticker_options)
        else:
            return jsonify([])
    except Exception as e:
        return jsonify([]), 500

@valuation_bp.route('/api/stock_data/<ticker>', methods=['GET'])
def stock_data(ticker):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        cashflow = stock.cashflow
        return jsonify(info), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@valuation_bp.route('/api/test_data/<ticker>', methods=['GET'])   
def test_data(ticker):
    data = get_market_cap(ticker)
    # print(data)
    # return jsonify(data)

@valuation_bp.route('/api/key_metrics/<ticker>', methods=['GET'])
def key_metrics(ticker):
    try:
        pe_series = get_avg_pe_ratio(ticker)
        revenue_series = get_revenue(ticker)
        net_income_series = get_net_income(ticker)
        shares_outstanding_series = get_shares_outstanding(ticker)
        ltl, fcf_series = get_ltl_fcf(ticker)

        # Ensure both series are sorted from earliest to latest year
        pe_series = pe_series.sort_index()  # index should be year
        revenue_series = revenue_series.sort_index().dropna()
        net_income_series = net_income_series.sort_index().dropna()
        shares_outstanding_series = shares_outstanding_series.sort_index().dropna()
        fcf_series = fcf_series.sort_index().dropna()

        avg_pe_ratio = pe_series.mean()
        avg_fcf = fcf_series.mean()
        p_fcf_ratio = get_market_cap(ticker) / avg_fcf
        revenue_growth = ((revenue_series.iloc[-1] / revenue_series.iloc[0]) - 1) * 100
        profit_growth = ((net_income_series.iloc[-1] / net_income_series.iloc[0]) - 1) * 100
        fcf_growth = ((fcf_series.iloc[-1] / fcf_series.iloc[0]) - 1) * 100

        ltl_fcf_ratio = ltl / avg_fcf

        return jsonify({
            "pe_ratio_series": {
                "years": list(pe_series.index.astype(str)),
                "values": pe_series.tolist()
            },
            "revenue_series": {
                "years": list(revenue_series.index.astype(str)),
                "values": revenue_series.tolist()
            },
            "net_income_series": {
                "years": list(net_income_series.index.astype(str)),
                "values": net_income_series.tolist()
            },
            "shares_outstanding_series": {
                "years": list(shares_outstanding_series.index.astype(str)),
                "values": shares_outstanding_series.tolist()
            },
            "free_cash_flow_series": {
                "years": list(fcf_series.index.astype(str)),
                "values": fcf_series.tolist()
            },
            "avg_pe_ratio": round(avg_pe_ratio, 2),
            "avg_p_fcf_ratio": round(p_fcf_ratio, 2),
            "revenue_growth": round(revenue_growth, 2),
            "profit_growth": round(profit_growth, 2),
            "fcf_growth": round(fcf_growth, 2),
            "ltl_fcf_ratio": round(ltl_fcf_ratio, 2)
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@valuation_bp.route('/api/valuation', methods=['POST'])
def get_dcf_valuation():
    data = request.json
    ticker = data.get('ticker')
    growth = data.get('growth')
    discount = data.get('discount')
    years = data.get('years', 5)
    terminalGrowth = data.get('terminalGrowth')
    info, cashflow = fetch_stock_data(ticker)
    # Compute FCF
    try:
        fcf = cashflow.loc["Free Cash Flow"].iloc[0]
    except KeyError as e:
        return jsonify({"error": str(e)}), 500
    intrinsic_value = dcf_model(fcf, growth, discount, years, terminalGrowth)
    shares_outstanding = info.get("sharesOutstanding", None)
    if shares_outstanding:
        intrinsic_per_share = intrinsic_value / shares_outstanding
        return jsonify({"intrinsicValuePerShare": round(intrinsic_per_share, 2)})
    else:
        return jsonify({"error": str(e)}), 500