import pandas as pd

column_mapping = {
    'QN1': 'age',
    'QN2': 'sex'
}

# TODO: remove nrows (just testing with 5 rows for now)
raw_data = pd.read_csv('../data/nyts2020.csv', nrows=5, usecols=list(column_mapping.keys()))
data = raw_data.rename(column_mapping, axis=1)
# print('raw data', raw_data)
# print('data', data)

data.to_csv('../data/nyts2020_processed.csv', encoding='utf-8', index=False)
