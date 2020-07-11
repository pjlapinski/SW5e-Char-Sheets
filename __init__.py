from flask import Flask, render_template, send_from_directory, request, redirect, url_for
from forms import RegisterForm, LoginForm
from flask_bcrypt import Bcrypt
import json
import os
import sqlite3


app = Flask(__name__)
# don't cache files, may be deleted later when deploying
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
# generate a new one on deploy and read it from the environment variable
app.config['SECRET_KEY'] = '57fcbcb450d4560880d2635018e43fec'
APP_ROOT = os.path.dirname(os.path.abspath(__file__))
APP_STATIC = os.path.join(APP_ROOT, 'static')
bcrypt = Bcrypt(app)


@app.route('/')
def index():
    # if not logged in:
    # return render_template('home.html')
    # else:
    user_id = 0
    with sqlite3.connect('./temp_db.db') as conn:
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, sheet FROM character WHERE owner_id={user_id}")
        sheets = []
        sheet = cur.fetchone()
        while sheet is not None:
            sheet_id = sheet[0]
            character_name = json.loads(sheet[1])['name']
            sheets.append((sheet_id, character_name))
            sheet = cur.fetchone()
        cur.close()
    return render_template('home-sheets.html', sheets=sheets, title='Home')


@app.route('/home')
def home():
    # TODO: delete this route as it is only for test
    return render_template("home.html")


@app.route('/char-sheet/<int:sheet_id>')
def sheet(sheet_id):
    with sqlite3.connect('./temp_db.db') as conn:
        # TODO: check for authorization here
        cur = conn.cursor()
        cur.execute(f"SELECT sheet FROM character WHERE id={sheet_id}")
        raw_sheet = cur.fetchone()
        cur.close()
    if raw_sheet is None:
        return render_template('error-page.html', title='Error')
    return render_template('character-sheet.html', data=raw_sheet[0])


@app.route('/char-sheet/save/<int:sheet_id>', methods=['POST'])
def save_sheet(sheet_id):
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


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if request.method == 'GET':
        return render_template('register.html', title='Register', form=form)
    if form.validate_on_submit():
        with sqlite3.connect('temp_db.db') as conn:
            cur = conn.cursor()
            # before we're ready to send people emails, accounts
            # created are all going to be active by default - when
            # we have emails figured out, they can be deactivated here,
            # by changing the 1 to a 0
            #
            # in postgres, change the 0 from 'activated' to FALSE
            cur.execute(f"""
            INSERT INTO user(username, email, password, activated) VALUES(
                '{form.username.data}',
                '{form.email.data}',
                '{bcrypt.generate_password_hash(form.password.data).decode('utf-8')}',
                1
            );""")
            # now send them an email
            conn.commit()
            cur.close()
    return redirect(url_for('index'))


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('login.html', title='Login', form=LoginForm())
    return redirect(url_for('index'))


@app.route('/static/js/<path:filename>')
def js_static(filename):
    return send_from_directory(APP_STATIC,
                               f'js/{filename}', as_attachment=True,
                               mimetype='text/javascript'
                               )


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
