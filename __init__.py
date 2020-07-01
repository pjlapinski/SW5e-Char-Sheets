from flask import Flask, render_template
import json
import os
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
APP_STATIC = os.path.join(APP_ROOT, 'static')


app = Flask(__name__)
# don't cache files, may be deleted later when deploying
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


@app.route('/')
def index():
    # for now
    return render_template('error-page.html')


@app.route('/char-sheet/<int:sheet_id>')
def sheet(sheet_id):
    # first query the database and save the file from it into the /sheets folder
    # if there are no results, return an error page
    #
    # or, even better, create a database handler which, when queried, returns
    # the character sheet as a json already, without having to save it to a folder
    # ---- this would be much preferred
    with open(os.path.join(APP_ROOT, f'sheets/{sheet_id}.json'), 'r') as f:
        result = json.loads(f.read())
    return render_template('character-sheet.html', data=result)


if __name__ == '__main__':
    app.run(debug=True)
