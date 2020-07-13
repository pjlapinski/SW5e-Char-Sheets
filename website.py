from flask import render_template, send_from_directory, request, redirect, url_for
from models import User, Character
from forms import RegisterForm, LoginForm, ChangePassword, RequestActivationEmail, ForgotPassword, ResetPassword
from __init__ import app, db, bcrypt, APP_STATIC, mail
from flask_login import login_user, current_user, logout_user
from flask_mail import Message
import json


@app.route('/')
def index():
    errors = None
    origin = None
    if 'errors' in request.args.keys():
        errors = json.loads(request.args['errors'].replace("'", '"'))
        origin = request.args['origin']
    register_form = RegisterForm()
    login_form = LoginForm()
    if not current_user.is_authenticated:
        return render_template('home.html', title='Home', register_form=register_form, login_form=login_form, origin=origin, errors=errors)
    characters = Character.query.filter_by(owner_id=current_user.id).all()
    sheets = []
    for character in characters:
        name = json.loads(character.sheet)['name']
        sheets.append((character.id, name))
    return render_template('home-sheets.html', sheets=sheets, title='Home')


@app.route('/char-sheet/<int:sheet_id>')
def sheet(sheet_id):
    if not current_user.is_authenticated:
        return render_template('error-page.html', title='Error')
    char = Character.query.filter_by(id=sheet_id).first()
    if char.owner_id != current_user.id:
        return render_template('error-page.html', title='Error')
    raw_sheet = char.sheet
    if raw_sheet is None:
        return render_template('error-page.html', title='Error')
    return render_template('character-sheet.html', data=raw_sheet)


@app.route('/char-sheet/save/<int:sheet_id>', methods=['POST'])
def save_sheet(sheet_id):
    sheet = request.get_json()
    if not sheet:
        return 'Bad Request', 400
    str_sheet = json.dumps(sheet)
    char = Character.query.filter_by(id=sheet_id).first()
    if char.owner_id != current_user.id:
        return render_template('error-page.html', title='Error')
    char.sheet = str_sheet
    db.session.commit()
    return 'OK', 200


@app.route('/register', methods=['POST'])
def register():
    form = RegisterForm()
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    if form.validate_on_submit():
        usr = User.query.filter_by(username=form.username.data).first()
        if usr:
            return redirect(url_for('index', errors={'username': ['User with such username already exists.']}, origin='register'))
        usr = User.query.filter_by(email=form.email.data).first()
        if usr:
            return redirect(url_for('index', errors={'email': ['User with such email already exists.']}, origin='register'))
        user = User(username=form.username.data,
                    email=form.email.data,
                    password=bcrypt.generate_password_hash(
                        form.password.data).decode('utf-8'),
                    activated=False)
        db.session.add(user)
        db.session.commit()
        send_activation_email(user)
        return redirect(url_for('index'))
    return redirect(url_for('index', errors=form.errors, origin='register'))


def send_activation_email(user):
    token = user.get_token()
    msg = Message('SW5e Sheets - Account activation',
                  sender=app.config['MAIL_USERNAME'],
                  recipients=[user.email])
    # if the message is supposed to be sent with html, use
    # msg.html = 'message content', probably read from a file, or even better, a template like our pages
    # instead of msg.body
    msg.body = f"""Thank you for registering an account on our website. To activate it,
visit this link: {url_for('activate', token=token, _external=True)}
This link will expire within 10 minutes of you recieving this message."""
    mail.send(msg)


def send_forgot_password_email(user):
    token = user.get_token()
    msg = Message('SW5e Sheets - Password reset',
                  sender=app.config['MAIL_USERNAME'],
                  recipients=[user.email])
    # if the message is supposed to be sent with html, use
    # msg.html = 'message content', probably read from a file, or even better, a template like our pages
    # instead of msg.body
    msg.body = f"""A password reset request has been sent. If you did not make this request, you can simply
ignore this message. In other case, please enter this link to reset your password: {url_for('reset_password', token=token, _external=True)}
This link will expire within 10 minutes of you recieving this message."""
    mail.send(msg)


@app.route('/activation_request', methods=['GET', 'POST'])
def activation_request():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = RequestActivationEmail()
    errors = form.errors
    if request.method == 'POST':
        if form.validate_on_submit():
            errors = form.errors
            user = User.query.filter_by(email=form.email.data).first()
            if not user:
                if 'email' not in errors.keys():
                    errors['email'] = []
                errors['email'].append('No such user exists.')
            elif user.activated:
                if 'email' not in errors.keys():
                    errors['email'] = []
                errors['email'].append(
                    "This user's account is already active.")
            else:
                send_activation_email(user)
                return redirect(url_for('index'))
    return render_template('request-email.html', title='Request Email', form=form, errors=errors)


@app.route('/forgot_password', methods=['GET', 'POST'])
def forgot_password():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = ForgotPassword()
    errors = form.errors
    if request.method == 'POST':
        if form.validate_on_submit():
            errors = form.errors
            user = User.query.filter_by(email=form.email.data).first()
            if not user:
                if 'email' not in errors.keys():
                    errors['email'] = []
                errors['email'].append('No such user exists.')
            else:
                send_forgot_password_email(user)
                return redirect(url_for('index'))
    return render_template('request-email.html', title='Request Email', form=form, errors=errors)


@app.route('/reset_password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    form = ResetPassword()
    if current_user.is_authenticated:
        return render_template('error-page.html', title='Error')
    user = User.verify_token(token)
    if user is None:
        return render_template('error-page.html', title='Error')
    if request.method == 'POST':
        if form.validate_on_submit():
            user.password = bcrypt.generate_password_hash(
                form.new_password.data)
            db.session.commit()
            return redirect(url_for('index'))
    return render_template('reset-password.html', title='Reset Password', form=form, errors=form.errors)


@app.route('/activate/<token>')
def activate(token):
    if current_user.is_authenticated:
        return render_template('error-page.html', title='Error')
    user = User.verify_token(token)
    if user is None:
        return render_template('error-page.html', title='Error')
    else:
        user.activated = True
        db.session.commit()
    return redirect(url_for('index'))


@app.route('/login', methods=['POST'])
def login():
    form = LoginForm()
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if not user:
            return redirect(url_for('index', errors={'username': ['No such user exists.']}, origin='login'))
        if not bcrypt.check_password_hash(user.password, form.password.data):
            return redirect(url_for('index', errors={'password': ['Incorrect password.']}, origin='login'))
        if not user.activated:
            return redirect(url_for('index', errors={'username': ['Account not activated. Please check your email.']}, origin='login'))
        else:
            # this returns false if it failed to log in, but we're already checking that above
            login_user(user, remember=form.remember.data)
            return redirect(url_for('index'))
    return redirect(url_for('index', errors=form.errors, origin='login'))


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/account', methods=['POST', 'GET'])
def account():
    if not current_user.is_authenticated:
        return render_template('error-page.html', title='Error')
    password_form = ChangePassword()
    message = None
    if request.method == 'POST':
        if password_form.validate_on_submit():
            if not bcrypt.check_password_hash(current_user.password, password_form.old_password.data):
                message = 'Incorrect password.'
                return render_template('account.html', title='Account', user_data=current_user, password_form=password_form, message=message)
            user = User.query.get(current_user.id)
            user.password = bcrypt.generate_password_hash(
                password_form.new_password.data)
            db.session.commit()
            return redirect(url_for('index'))
    return render_template('account.html', title='Account', user_data=current_user, password_form=password_form, message=message)


@app.route('/delete', methods=['POST', 'GET'])
def delete_account():
    if not current_user.is_authenticated:
        return render_template('error-page.html', title='Error')
    if request.method == 'POST':
        user_id = current_user.id
        logout_user()
        User.query.filter_by(id=user_id).delete()
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('delete.html', title='Delete Account')


@app.route('/delete-sheet/<int:sheet_id>', methods=['GET', 'POST'])
def delete_sheet(sheet_id):
    if not current_user.is_authenticated:
        return render_template('error-page.html', title='Error')
    if request.method == 'POST':
        sheet = Character.query.filter_by(id=sheet_id)
        if sheet.first().owner_id != current_user.id:
            return render_template('error-page.html', title='Error')
        sheet.delete()
        db.session.commit()
        return redirect(url_for('index'))
    return render_template('delete-sheet.html', title='Delete Sheet', sheet_id=sheet_id)


@app.route('/create-sheet', methods=['POST'])
def create_sheet():
    sheet = {
        'name': 'New Character',
        'class': '',
        'archetype': '',
        'level': 1,
        'background': '',
        'species': '',
        'alignment': '',
        'attributes': {
            'strength': 10,
            'dexterity': 10,
            'constitution': 10,
            'intelligence': 10,
            'wisdom': 10,
            'charisma': 10
        },
        'baseAc': 10,
        'armorType': 'none',
        'shieldBonus': 0,
        'proficiencies': [],
        'expertise': [],
        'bonuses': {
            'armorClass': 0,
            'attacks': 0,
            'damage': 0,
            'savingThrows': 0,
            'strengthSave': 0,
            'dexteritySave': 0,
            'constitutionSave': 0,
            'intelligenceSave': 0,
            'wisdomSave': 0,
            'charismaSave': 0,
            'skills': 0,
            'passivePerception': 0,
            'techSaveDC': 0,
            'techAttackBonus': 0,
            'darkSaveDC': 0,
            'darkAttackBonus': 0,
            'lightSaveDC': 0,
            'lightAttackBonus': 0,
            'athletics': 0,
            'acrobatics': 0,
            'sleightOfHand': 0,
            'stealth': 0,
            'investigation': 0,
            'lore': 0,
            'nature': 0,
            'piloting': 0,
            'technology': 0,
            'animalHandling': 0,
            'insight': 0,
            'medicine': 0,
            'perception': 0,
            'survival': 0,
            'deception': 0,
            'intimidation': 0,
            'performance': 0,
            'persuasion': 0,
            'initiative': 0,
            'hitPointsPerLevel': 0
        },
        'deathSaves': {
            'succeeded': 0,
            'failed': 0
        },
        'hitDice': {
            'type': 8,
            'left': 1
        },
        'hitPoints': {
            'current': 1,
            'max': 1,
            'temporary': 0
        },
        'features': [],
        'attacks': [],
        'languages': [],
        'otherProficiencies': [],
        'speed': 30,
        'personalityTraits': '',
        'ideal': '',
        'bond': '',
        'flaw': '',
        'notes': '',
        'credits': 0,
        'equipment': [],
        'powerPointsLeft': 0,
        'powerPointsMax': 0,
        'powers': {
            'level0': [],
            'level1': [],
            'level2': [],
            'level3': [],
            'level4': [],
            'level5': [],
            'level6': [],
            'level7': [],
            'level8': [],
            'level9': []
        }
    }
    char = Character(owner_id=current_user.id, sheet=json.dumps(sheet))
    db.session.add(char)
    db.session.commit()
    return redirect(url_for('index'))


@app.route('/static/js/<path:filename>')
def js_static(filename):
    return send_from_directory(APP_STATIC,
                               f'js/{filename}', as_attachment=True,
                               mimetype='text/javascript'
                               )


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
