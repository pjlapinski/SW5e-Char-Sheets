from app.__init__ import db, bcrypt
from app.models import User, Character


def create_database():
    db.drop_all()
    db.session.commit()
    db.create_all()
    user = User(username='testuser', email='testuser@test.com',
                password=bcrypt.generate_password_hash('testuser').decode('utf-8'), activated=True)
    db.session.add(user)
    db.session.commit()
    with open('./app/sheets/1.json') as f:
        content = f.read()
    char = Character(sheet=f"{content}", owner_id=user.id)
    db.session.add(char)
    db.session.commit()
