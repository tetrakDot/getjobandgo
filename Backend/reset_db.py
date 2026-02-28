import MySQLdb

try:
    db = MySQLdb.connect(host="127.0.0.1", user="root", passwd="root")
    cursor = db.cursor()
    cursor.execute("DROP DATABASE IF EXISTS get_job_and_go")
    cursor.execute("CREATE DATABASE get_job_and_go CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    print("Database reset successful.")
except Exception as e:
    print(f"Error resetting database: {e}")
