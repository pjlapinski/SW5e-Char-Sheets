from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField
from wtforms.validators import DataRequired, Length, Email, EqualTo


class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[
        DataRequired(), Length(min=2, max=20)
    ], id='reg-username')
    email = StringField('Email', validators=[
        DataRequired(), Length(min=6, max=40), Email()
    ], id='reg-email')
    password = PasswordField('Password', validators=[
        DataRequired(), Length(min=8)
    ], id='reg-password')
    confirm_password = PasswordField('Confirm Password', validators=[
        DataRequired(), Length(min=8), EqualTo('password')
    ], id='reg-confirm_password')
    submit = SubmitField('Register', id='reg-submit')


class LoginForm(FlaskForm):
    username = StringField('Username', validators=[
        DataRequired(), Length(min=2, max=20)
    ], id='log-username')
    password = PasswordField('Password', validators=[
        DataRequired(), Length(min=8)
    ], id='log-password')
    remember = BooleanField('Remember Me')
    submit = SubmitField('Log in', id='log-submit')


class ChangePassword(FlaskForm):
    old_password = PasswordField('Old Password', validators=[
        DataRequired(), Length(min=8)
    ])
    new_password = PasswordField('New Password', validators=[
        DataRequired(), Length(min=8)
    ])
    confirm_password = PasswordField('Confirm Password', validators=[
        DataRequired(), Length(min=8), EqualTo('new_password')
    ])
    submit = SubmitField('Change Password', id='submit-password')


class ResetPassword(FlaskForm):
    new_password = PasswordField('New Password', validators=[
        DataRequired(), Length(min=8)
    ])
    confirm_password = PasswordField('Confirm Password', validators=[
        DataRequired(), Length(min=8), EqualTo('new_password')
    ])
    submit = SubmitField('Change Password', id='submit-password')


class RequestActivationEmail(FlaskForm):
    email = StringField('Email', validators=[
        DataRequired(), Length(min=6, max=40), Email()
    ])
    submit = SubmitField('Request email')


class ForgotPassword(FlaskForm):
    email = StringField('Email', validators=[
        DataRequired(), Length(min=6, max=40), Email()
    ])
    submit = SubmitField('Request password reset')
