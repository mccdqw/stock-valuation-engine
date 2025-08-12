import pandas as pd
import polars as pl
import duckdb
from fastapi import HTTPException

def load_from_stock_db(symbol: str, start_date: str, end_date: str) -> pl.DataFrame:
    # Placeholder: connect to your stock price database
    # Return DataFrame with Date index and OHLCV columns

    con = duckdb.connect("E:/python coding/projects/asset-management-dashboard/nuclear_stocks.duckdb")

    # Query market data from DuckDB using Polars
    query = """
    SELECT * FROM nuclear_stocks.nuclear_stocks_table
    WHERE Symbol = ? AND Date >= ? AND Date <= ?
    ORDER BY Date
    """
    df = pl.from_arrow(con.execute(query, (symbol, start_date, end_date)).arrow())
    
    if df.is_empty():
        raise HTTPException(status_code=404, detail="No data found for the given symbol and date range")
    return df