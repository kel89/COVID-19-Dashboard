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

@app.route('/get_locations', methods=['POST'])
def get_locations():
	location_data = dm.get_all_locations()
	return jsonify({'locations': location_data})

@app.route('/get_active_cases', methods=['POST'])
def get_active_cases():
	case_series = dm.get_active_cases().to_json(orient='records')
	return jsonify({'data':case_series})

# @app.route('/get_confirmed', methods=["POST"])
# def get_confirmed():
# 	key = request.form['which']
# 	print("Key:", key)
# 	return jsonify({'data': 'NUM CASES'})

if __name__ == "__main__":
	# Run the app
	app.run(debug=True, host="0.0.0.0", use_reloader=True, threaded=True)

	# Runs when the server is stopped (ctr + c)
	print("\n\n")
	print(80*"-")
	print("Quitting")
