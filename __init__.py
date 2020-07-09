from flask import Flask, render_template, send_from_directory, request
import json
import os
import sqlite3


app = Flask(__name__)
# don't cache files, may be deleted later when deploying
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
APP_STATIC = os.path.join(APP_ROOT, 'static')


@app.route('/')
def index():
    # for now
    return render_template('error-page.html')


@app.route('/char-sheet/<int:sheet_id>')
def sheet(sheet_id):
    with sqlite3.connect('./temp_db.db') as conn:
        # TODO: check for authorization here
        cur = conn.cursor()
        cur.execute(f"SELECT sheet FROM character WHERE id={sheet_id}")
        raw_sheet = cur.fetchone()
        cur.close()
    if raw_sheet is None:
        # return the render of the error page
        return
    result = json.loads(raw_sheet[0])
    return render_template('character-sheet.html', data=result)


@app.route('/char-sheet/save/<int:sheet_id>', methods=['GET', 'POST'])
def save_sheet(sheet_id):
    if request.method == 'POST':
        sheet = request.get_json()
        with sqlite3.connect('./temp_db.db') as conn:
            # TODO: check for authorization here
            str_sheet = json.dumps(sheet).replace("'", "''")
            cur = conn.cursor()
            cur.execute(f"""
            UPDATE character SET sheet='{str_sheet}' WHERE id={sheet_id}
            """)
            cur.close()
        return 'OK', 200


@app.route('/static/js/<path:filename>')
def js_static(filename):
    return send_from_directory(APP_STATIC,
                               f'js/{filename}', as_attachment=True,
                               mimetype='text/javascript'
                               )


if __name__ == '__main__':
    app.run(debug=True)
