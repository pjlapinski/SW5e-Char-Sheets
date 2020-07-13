from flask import Flask
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_mail import Mail
import os


app = Flask(__name__)
# don't cache files, may be deleted later when deploying
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
# generate a new one on deploy and read it from the environment variable
app.config['SECRET_KEY'] = '57fcbcb450d4560880d2635018e43fec'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///temp_db.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
# on heroku, read those from environment variables
with open('email_data.txt') as f:
    content = f.read().strip()
    email, password = content.split(':')
app.config['MAIL_USERNAME'] = email
app.config['MAIL_PASSWORD'] = password

bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
db = SQLAlchemy(app)
mail = Mail(app)

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
APP_STATIC = os.path.join(APP_ROOT, 'static')
