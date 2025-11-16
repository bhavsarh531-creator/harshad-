import mysql.connector
from config import config

def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=config['default'].DB_HOST,
            user=config['default'].DB_USER,
            password=config['default'].DB_PASSWORD,
            database=config['default'].DB_NAME
        )
        return conn
    except mysql.connector.Error as e:
        print(f"Database connection error: {e}")
        return None

def init_db():
    """Initialize database with required tables"""
    conn = get_db_connection()
    if conn is None:
        print("Failed to connect to database. Please check your database configuration and ensure MySQL is running.")
        return

    try:
        cursor = conn.cursor()
        
        # Create products table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100),
                price DECIMAL(10, 2) NOT NULL,
                quantity INT NOT NULL DEFAULT 0,
                supplier VARCHAR(255),
                low_stock_threshold INT DEFAULT 10,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        ''')
        
        # Create activities table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS activities (
                id INT AUTO_INCREMENT PRIMARY KEY,
                date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                activity VARCHAR(255),
                product VARCHAR(255),
                user VARCHAR(100)
            )
        ''')
        
        conn.commit()
        print("Database initialized successfully!")
    except mysql.connector.Error as e:
        print(f"Error initializing database: {e}")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()