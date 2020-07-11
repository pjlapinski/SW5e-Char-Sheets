from __init__ import db, bcrypt
from models import User, Character


def create_database():
    db.create_all()
    user = User(username='testuser', email='testuser@test.com',
                password=bcrypt.generate_password_hash('testuser'), activated=True)
    db.session.add(user)
    db.session.commit()
    with open('./sheets/1.json') as f:
        content = f.read().replace("'", r"''")
    char = Character(sheet=f"{content}", owner_id=user.id)
    db.session.add(char)
    db.session.commit()


if __name__ == '__main__':
    create_database()
