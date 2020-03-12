# data_functions.py
import pandas as pd
import numpy as np

class DataManager(object):

	def __init__(self):
		# Load the data
		self.ts_dir = "../COVID-19/csse_covid_19_data/csse_covid_19_time_series/"
		self.confirmed = pd.read_csv(self.ts_dir + "time_series_19-covid-Confirmed.csv")
		self.deaths = pd.read_csv(self.ts_dir + "time_series_19-covid-Deaths.csv")
		self.recovered = pd.read_csv(self.ts_dir + "time_series_19-covid-Recovered.csv")

		# Setup some helpers for the columns
		self.date_cols = self.confirmed.columns[4:]

	def get_all_locations(self):
		"""
		Returns list of all locations
			{
				'countries': [],
				'states': []
			}
		"""
		# Get all the countries
		df = self.confirmed.copy()
		df = df[['Country/Region', 'Province/State']]
		return df.to_json(orient='records')

	def get_active_cases(self, location='all'):
		"""
		Returns the time series of all active cases
		if location != 'all' filters the data first

		Active is confirmed - deaths - recoveries
		"""
		if location == 'all':
			# Can sum all rows
			conf = self.confirmed[self.date_cols].sum(axis=0)
			death = self.deaths[self.date_cols].sum(axis=0)
			reco = self.recovered[self.date_cols].sum(axis=0)
			s =  conf - death - reco
		else:
			# DEAL WITH THIS FILTERING
			pass

		# Transform as needex
		df = s.to_frame().reset_index()
		df = df.rename(columns={'index':'date', 0:'count'})
		return df

	def get_confirmed_cases(self, location='all'):
		"""
		REturns the time series of all confirmed cases
		filters if location is given
		"""
		return

	def get_recovered_cases(self, location='all'):
		"""
		return a timeseries of recoveries for location
		"""
		return
