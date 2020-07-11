from flask import Flask
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os


app = Flask(__name__)
# don't cache files, may be deleted later when deploying
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
# generate a new one on deploy and read it from the environment variable
app.config['SECRET_KEY'] = '57fcbcb450d4560880d2635018e43fec'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///temp_db.db'

bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
db = SQLAlchemy(app)

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
APP_STATIC = os.path.join(APP_ROOT, 'static')
