import sqlite3
import os

db_path = os.path.join('instance', 'f_gaming.db')
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("UPDATE user SET rank='Admin' WHERE role='admin'")
    cursor.execute("UPDATE user SET rank='VIP' WHERE role='vip'")
    conn.commit()
    conn.close()
    print("Database updated successfully")
else:
    print("Database not found")
