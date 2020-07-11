from __init__ import db, login_manager
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(40), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    activated = db.Column(db.Boolean, default=False)
    sheets = db.relationship('Character', backref='owner', lazy=True)


class Character(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sheet = db.Column(db.JSON)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
