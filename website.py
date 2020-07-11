from flask import render_template, send_from_directory, request, redirect, url_for
from models import User, Character
from forms import RegisterForm, LoginForm
from __init__ import app, db, bcrypt, APP_STATIC
from flask_login import login_user
import json


@app.route('/')
def index():
    logged = False
    user_id = 1
    errors = None
    origin = None
    if 'errors' in request.args.keys():
        errors = json.loads(request.args['errors'].replace("'", '"'))
        origin = request.args['origin']
    register_form = RegisterForm()
    login_form = LoginForm()
    if not logged:
        return render_template('home.html', title='Home', register_form=register_form, login_form=login_form, origin=origin, errors=errors)
    characters = Character.query.filter_by(owner_id=user_id).all()
    sheets = []
    for character in characters:
        name = json.loads(character.sheet)['name']
        sheets.append((character.id, name))
    return render_template('home-sheets.html', sheets=sheets, title='Home')


@app.route('/char-sheet/<int:sheet_id>')
def sheet(sheet_id):
    raw_sheet = Character.query.filter_by(id=sheet_id).first().sheet
    if raw_sheet is None:
        return render_template('error-page.html', title='Error')
    return render_template('character-sheet.html', data=raw_sheet)


@app.route('/char-sheet/save/<int:sheet_id>', methods=['POST'])
def save_sheet(sheet_id):
    sheet = request.get_json()
    # TODO: check for authorization here
    str_sheet = json.dumps(sheet).replace("'", "''")
    char = Character.query.filter_by(id=sheet_id).first()
    char.sheet = str_sheet
    db.session.commit()
    return 'OK', 200


@app.route('/register', methods=['POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        usr = User.query.filter_by(username=form.username.data).first()
        if usr:
            return redirect(url_for('index', errors={'username': ['User with such username already exists.']}, origin='register'))
        usr = User.query.filter_by(email=form.email.data).first()
        if usr:
            return redirect(url_for('index', errors={'email': ['User with such email already exists.']}, origin='register'))
        # before we're ready to send people emails, accounts
        # created are all going to be active by default - when
        # we have emails figured out, they can be deactivated here,
        user = User(username=form.username.data,
                    email=form.email.data,
                    password=bcrypt.generate_password_hash(
                        form.password.data).decode('utf-8'),
                    activated=True)
        db.session.add(user)
        db.session.commit()
        return redirect(url_for('index'))
    return redirect(url_for('index', errors=form.errors, origin='register'))


@app.route('/login', methods=['POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if not user:
            return redirect(url_for('index', errors={'': 'No such user exists.'}))
        if not bcrypt.check_password_hash(user.password, form.password.data):
            return redirect(url_for('index', errors={'': 'Incorrect password.'}))
        if not user.activated:
            return redirect(url_for('index', errors={'': 'Account not activated. Please check your email.'}))
        else:
            login_user(user, remember=form.remember.data)
            return redirect(url_for('index'))
        # check if such user exists
    return redirect(url_for('index', errors=form.errors, origin='login'))


@app.route('/static/js/<path:filename>')
def js_static(filename):
    return send_from_directory(APP_STATIC,
                               f'js/{filename}', as_attachment=True,
                               mimetype='text/javascript'
                               )


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
