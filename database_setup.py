import sqlite3
from __init__ import app
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt(app)


def create_database():
    with sqlite3.connect('./temp_db.db') as conn:
        cur = conn.cursor()
        # these are the sqlite versions of the tables
        cur.execute("DROP TABLE IF EXISTS user;")
        cur.execute("""
        CREATE TABLE user (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            username VARCHAR(20) UNIQUE NOT NULL,
            email VARCHAR(40) UNIQUE NOT NULL,
            password VARCHAR(60) NOT NULL,
            activated INTEGER NOT NULL DEFAULT 0
        );
        """)
        cur.execute("DROP TABLE IF EXISTS character;")
        cur.execute("""
        CREATE TABLE character (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            owner_id INTEGER NOT NULL,
            sheet JSON NOT NULL,
            FOREIGN KEY (owner_id) REFERENCES user (id)
        );
        """)
        # these are the postgres versions of the tables
        #
        # cur.execute("DROP TABLE IF EXISTS user;")
        # cur.execute("""
        # CREATE TABLE user (
        #     id SERIAL PRIMARY KEY,
        #     username VARCHAR(20) UNIQUE NOT NULL,
        #     email VARCHAR(40) UNIQUE NOT NULL,
        #     password VARCHAR(60) NOT NULL,
        #     activated BOOLEAN NOT NULL DEFAULT FALSE
        # );
        # """)
        # cur.execute("DROP TABLE IF EXISTS character;")
        # cur.execute("""
        # CREATE TABLE character (
        #     id SERIAL PRIMARY KEY,
        #     owner_id INTEGER NOT NULL,
        #     sheet JSON NOT NULL,
        #     FOREIGN KEY (owner_id) REFERENCES user (id)
        # );
        # """)

        # also this is just temporary
        with open('./sheets/1.json') as f:
            content = f.read().replace("'", r"''")
        # postgres boolean values - TRUE, FALSE, 'unknown'
        cur.execute(f"""
        INSERT INTO user (username, email, password, activated) VALUES(
            'testuser', 'testuser@test.com', '{
                bcrypt.generate_password_hash('test').decode('utf-8')
                }', 1
        );
        """)
        cur.execute(f"""
        INSERT INTO character (owner_id, sheet) VALUES(
            (SELECT MAX(id) FROM user),
            '{content}'
        );
        """)
        conn.commit()
        cur.close()


if __name__ == '__main__':
    create_database()
