from flask import Blueprint, request, jsonify
import yfinance as yf
import pandas as pd
from .utils import dcf_model, get_avg_pe_ratio, get_revenue, fetch_stock_data

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

@valuation_bp.route('/api/key_metrics/<ticker>', methods=['GET'])
def key_metrics(ticker):
    try:
        pe_series = get_avg_pe_ratio(ticker)
        revenue_series = get_revenue(ticker)

        # Ensure both series are sorted from earliest to latest year
        pe_series = pe_series.sort_index()  # index should be year
        revenue_series = revenue_series.sort_index().dropna()

        avg_pe_ratio = pe_series.mean()
        revenue_growth = ((revenue_series.iloc[-1] / revenue_series.iloc[0]) - 1) * 100

        return jsonify({
            "pe_ratio_series": {
                "years": list(pe_series.index.astype(str)),
                "values": pe_series.tolist()
            },
            "revenue_series": {
                "years": list(revenue_series.index.astype(str)),
                "values": revenue_series.tolist()
            },
            "avg_pe_ratio": round(avg_pe_ratio, 2),
            "revenue_growth": round(revenue_growth, 2)
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