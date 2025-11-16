from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
import os
from database import init_db
from routes import api_bp

# Initialize Flask app
app = Flask(__name__, 
            template_folder='../frontend',
            static_folder='../frontend')

# Configure app
app.config.from_object('config.config[os.environ.get("FLASK_ENV", "default")]')

# Enable CORS
CORS(app)

# Register blueprints
app.register_blueprint(api_bp, url_prefix='/api')

# Serve frontend files
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# API route for testing
@app.route('/api/health')
def health_check():
    return {'status': 'healthy', 'message': 'Stock Control System API is running'}

if __name__ == '__main__':
    # Initialize database
    print("Initializing database...")
    init_db()
    
    print("Starting Flask application...")
    app.run(debug=True, host='127.0.0.1', port=5000)