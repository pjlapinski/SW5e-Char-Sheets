from flask import Flask, render_template
import json
import os
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
APP_STATIC = os.path.join(APP_ROOT, 'static')


app = Flask(__name__)


@app.route('/')
def index():
    # for now
    return render_template('dummy.html')


@app.route('/char-sheet/<string:sheet_name>')
def sheet(sheet_name):
    # first query the database and save the file from it into the /sheets folder
    # if there are no results, return an error page
    with open(os.path.join(APP_ROOT, f'sheets/{sheet_name}.json'), 'r') as f:
        result = json.loads(f.read())
    return render_template('character-sheet.html', data=result)


if __name__ == '__main__':
    app.run(debug=True)
