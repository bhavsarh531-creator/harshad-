import os

class Config:
    # Database configuration
    DB_HOST = 'localhost'
    DB_USER = 'root'
    DB_PASSWORD = ''  # Your XAMPP MySQL password (default is empty)
    DB_NAME = 'stock_control'
    
    # Secret key for sessions
    SECRET_KEY = 'your-secret-key-here-change-in-production'

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}