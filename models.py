from database import get_db_connection
from datetime import datetime

class Product:
    def __init__(self, id, name, category, price, quantity, supplier, low_stock_threshold=10, description="", created_at=None, updated_at=None):
        self.id = id
        self.name = name
        self.category = category
        self.price = price
        self.quantity = quantity
        self.supplier = supplier
        self.low_stock_threshold = low_stock_threshold
        self.description = description
        self.created_at = created_at
        self.updated_at = updated_at
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'price': float(self.price),
            'quantity': self.quantity,
            'supplier': self.supplier,
            'lowStockThreshold': self.low_stock_threshold,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @staticmethod
    def get_all():
        conn = get_db_connection()
        if not conn:
            return []
            
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM products ORDER BY id DESC")
        products = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return [Product(**product).to_dict() for product in products]
    
    @staticmethod
    def get_by_id(product_id):
        conn = get_db_connection()
        if not conn:
            return None
            
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM products WHERE id = %s", (product_id,))
        product = cursor.fetchone()
        cursor.close()
        conn.close()
        
        return Product(**product) if product else None
    
    @staticmethod
    def create(name, category, price, quantity, supplier, low_stock_threshold=10, description=""):
        conn = get_db_connection()
        if not conn:
            return None
            
        cursor = conn.cursor()
        
        query = """
        INSERT INTO products (name, category, price, quantity, supplier, low_stock_threshold, description)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        values = (name, category, price, quantity, supplier, low_stock_threshold, description)
        
        cursor.execute(query, values)
        conn.commit()
        product_id = cursor.lastrowid
        cursor.close()
        conn.close()
        
        return product_id

    @staticmethod
    def update(product_id, name, category, price, quantity, supplier, low_stock_threshold=10, description=""):
        conn = get_db_connection()
        if not conn:
            return False
            
        cursor = conn.cursor()
        
        query = """
        UPDATE products 
        SET name=%s, category=%s, price=%s, quantity=%s, supplier=%s, low_stock_threshold=%s, description=%s
        WHERE id=%s
        """
        values = (name, category, price, quantity, supplier, low_stock_threshold, description, product_id)
        
        cursor.execute(query, values)
        conn.commit()
        affected_rows = cursor.rowcount
        cursor.close()
        conn.close()
        
        return affected_rows > 0

    @staticmethod
    def delete(product_id):
        conn = get_db_connection()
        if not conn:
            return False
            
        cursor = conn.cursor()
        cursor.execute("DELETE FROM products WHERE id = %s", (product_id,))
        conn.commit()
        affected_rows = cursor.rowcount
        cursor.close()
        conn.close()
        
        return affected_rows > 0

class Activity:
    @staticmethod
    def log_activity(activity, product, user="System"):
        conn = get_db_connection()
        if not conn:
            return False
            
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO activities (activity, product, user) VALUES (%s, %s, %s)",
            (activity, product, user)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return True
    
    @staticmethod
    def get_recent(limit=10):
        conn = get_db_connection()
        if not conn:
            return []
            
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM activities ORDER BY date DESC LIMIT %s", (limit,))
        activities = cursor.fetchall()
        cursor.close()
        conn.close()
        return activities