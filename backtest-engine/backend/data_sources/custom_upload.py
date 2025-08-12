import polars as pl
from io import StringIO

def load_from_upload(file_path: StringIO) -> pl.DataFrame:
    print("Converting data to a dataframe")
    df = pl.read_csv(file_path)
    return df