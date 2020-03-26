# app.py

from flask import Flask, render_template, flash, request, sessions, abort,\
				url_for, Response, request, jsonify, current_app
from data_functions import DataManager

import pandas as pd
import numpy as np
import os

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # prevent cache

# Load the data
# dm = DataManager()

## Data Function --------------------------------------------------------------
fdir = fdir = "../COVID-19/csse_covid_19_data/csse_covid_19_daily_reports"
to_stack = []
col_dict = {
    "Country_Region": "Country/Region",
    "Province_State": "Province/State"
}
cols_to_keep = [
    "date",
    "Province/State",
    "Country/Region",
    "Admin2",
    "Deaths",
    "Recovered",
    "Active",
    "Confirmed"
]
for file in os.listdir(fdir):
    a = file[0]
    if (a.isdigit()):
        date = file[0:-4]
        df = pd.read_csv(fdir + "/" + file)
        df['date'] = date
        df.rename(columns=col_dict, inplace=True)
        to_stack.append(df)

# Stack them all
stacked = pd.concat(to_stack, axis=0)
stacked = stacked[cols_to_keep]
sf = stacked.set_index(['date', 'Country/Region', 'Province/State', 'Admin2'])
sfd = sf.reset_index()
latest_date = sfd['date'].max()


@app.route('/')
def index():
	return render_template('index.html')

@app.route("/get_data", methods=["POST"])
def get_data():
	# get the request arguments
	country = request.form.get('country')
	state = request.form.get('state')
	print("Country:", country)
	print("State:", state)

	# Case 1: both undefined --> Global trend, show countries
	if (country == None and state == None):
		print("HERE")
		trends = sfd.drop(['Country/Region', 'Province/State', 'Admin2'], axis=1)\
								.groupby(['date'], as_index=False).sum()\
								.to_json(orient='records')

		location_data = sfd[sfd.date == latest_date]\
							.drop(['date', 'Province/State', 'Admin2'], axis=1)\
							.groupby('Country/Region', as_index=False).sum()\
							.to_json(orient='records')

	# Case 2: country defined, state not --> country trend, show states (if any)
	elif (country != None and state == None):
		print("THERE")
		trends = sfd.loc[sfd['Country/Region'] == country]\
				.drop(['Country/Region', 'Province/State', 'Admin2'], axis=1)\
				.groupby(['date'], as_index=False).sum()\
				.to_json(orient='records')

		location_data = sfd[(sfd['Country/Region'] == country) & (sfd.date == latest_date)] \
						.drop(['date', 'Country/Region', 'Admin2'], axis=1) \
						.groupby('Province/State', as_index=False).sum() \
						.to_json(orient='records')


	# Case 3: country defined, state defined --> state trend, show counties if exist
	else:
		print("EVERYWHERE")
		# neither ar enone (we want to show county level data)
		trends = sfd.loc[sfd['Province/State'] == country] \
				.drop(['Country/Region', 'Province/State', 'Admin2'], axis=1)\
    			.groupby(['date'], as_index=False).sum()\
				.to_json(orient='records')

		location_data = sfd[(sfd['Province/State'] == state) & (sfd.date == latest_date)] \
				.drop(['date', 'Country/Region', 'Province/State'], axis=1) \
				.groupby('Admin2', as_index=False).sum() \
				.to_json(orient='records')

	# Gather the data
	# print(trends)
	out_data = {
		'trends' : trends,
		'location_data': location_data
	}

	return jsonify(out_data)



if __name__ == "__main__":
	# Run the app
	app.run(debug=True, host="0.0.0.0", port=5000, use_reloader=True, threaded=True)

	# Runs when the server is stopped (ctr + c)
	print("\n\n")
	print(80*"-")
	print("Quitting")
