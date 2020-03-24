# app.py

from flask import Flask, render_template, flash, request, sessions, abort,\
				url_for, Response, request, jsonify, current_app
from data_functions import DataManager

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0 # prevent cache

# Load the data
dm = DataManager()


@app.route('/')
def index():
	return render_template('index.html')

@app.route('/get_all_data', methods=['POST'])
def get_all_data():
	confirmed = dm.confirmed.to_json(orient='records')
	deaths = dm.deaths.to_json(orient='records')
	recovered = dm.recovered.to_json(orient='records')

	out = {
		'confirmed' : confirmed,
		'deaths': deaths,
		'recovered' : recovered
	}
	return jsonify(out)

@app.route('/get_locations', methods=['POST'])
def get_locations():
	location_data = dm.get_all_locations()
	return jsonify({'locations': location_data})

@app.route('/get_active_cases', methods=['POST'])
def get_active_cases():
	case_series = dm.get_active_cases().to_json(orient='records')
	return jsonify({'data':case_series})

@app.route('/get_deaths', methods=['POST'])
def get_deaths():
	death_series = dm.get_deaths().to_json(orient='records')
	return jsonify({'data':death_series})

@app.route('/get_recovered', methods=['POST'])
def get_recovered():
	recovered_series = dm.get_recovered_cases().to_json(orient='records')
	return jsonify({'data':recovered_series})

# @app.route('/get_confirmed', methods=["POST"])
# def get_confirmed():
# 	key = request.form['which']
# 	print("Key:", key)
# 	return jsonify({'data': 'NUM CASES'})

if __name__ == "__main__":
	# Run the app
	app.run(debug=True, host="0.0.0.0", port=5000, use_reloader=True, threaded=True)

	# Runs when the server is stopped (ctr + c)
	print("\n\n")
	print(80*"-")
	print("Quitting")
