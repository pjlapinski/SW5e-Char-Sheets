from app.__init__ import app, mail
from flask_mail import Message
from flask import url_for


def send_activation_email(user):
    token = user.get_token()
    msg = Message('SW5e Sheets - Account activation',
                  sender=app.config['MAIL_USERNAME'],
                  recipients=[user.email])
    msg.body = f"""Thank you for registering an account on our website. To activate it, visit this link:
{url_for('activate', token=token, _external=True)}
This link will expire within 10 minutes of you recieving this message.
SW5e Character Sheets Team"""
    mail.send(msg)


def send_forgot_password_email(user):
    token = user.get_token()
    msg = Message('SW5e Sheets - Password reset',
                  sender=app.config['MAIL_USERNAME'],
                  recipients=[user.email])
    msg.body = f"""A password reset request has been sent. If you did not make this request, you can simply
ignore this message. In other case, please enter this link to reset your password:
{url_for('reset_password', token=token, _external=True)}
This link will expire within 10 minutes of you recieving this message.
SW5e Character Sheets Team"""
    mail.send(msg)
