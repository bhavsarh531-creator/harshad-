from flask import Blueprint, request, jsonify
from models import Product, Activity

api_bp = Blueprint('api', __name__)

# Products routes
@api_bp.route('/products', methods=['GET'])
def get_products():
    try:
        products = Product.get_all()
        return jsonify({'success': True, 'data': products})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@api_bp.route('/products', methods=['POST'])
def add_product():
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['name', 'category', 'price', 'quantity', 'supplier']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
        
        product_id = Product.create(
            name=data['name'],
            category=data['category'],
            price=data['price'],
            quantity=data['quantity'],
            supplier=data['supplier'],
            low_stock_threshold=data.get('lowStockThreshold', 10),
            description=data.get('description', '')
        )
        
        # Log activity
        Activity.log_activity('New product added', data['name'], 'Admin')
        
        return jsonify({'success': True, 'id': product_id, 'message': 'Product added successfully'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@api_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['name', 'category', 'price', 'quantity', 'supplier']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'success': False, 'error': f'Missing required field: {field}'}), 400
        
        success = Product.update(
            product_id=product_id,
            name=data['name'],
            category=data['category'],
            price=data['price'],
            quantity=data['quantity'],
            supplier=data['supplier'],
            low_stock_threshold=data.get('lowStockThreshold', 10),
            description=data.get('description', '')
        )
        
        if success:
            Activity.log_activity('Product updated', data['name'], 'Admin')
            return jsonify({'success': True, 'message': 'Product updated successfully'})
        else:
            return jsonify({'success': False, 'error': 'Product not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@api_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        # Get product name before deletion for activity log
        product = Product.get_by_id(product_id)
        if not product:
            return jsonify({'success': False, 'error': 'Product not found'}), 404
        
        success = Product.delete(product_id)
        
        if success:
            Activity.log_activity('Product deleted', product.name, 'Admin')
            return jsonify({'success': True, 'message': 'Product deleted successfully'})
        else:
            return jsonify({'success': False, 'error': 'Product not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Dashboard routes
@api_bp.route('/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    try:
        products = Product.get_all()
        
        total_products = len(products)
        low_stock_products = len([p for p in products if p['quantity'] > 0 and p['quantity'] <= p.get('lowStockThreshold', 10)])
        out_of_stock_products = len([p for p in products if p['quantity'] == 0])
        total_value = sum(p['price'] * p['quantity'] for p in products)
        
        # Get recent activities
        activities = Activity.get_recent(5)
        
        return jsonify({
            'success': True,
            'data': {
                'totalProducts': total_products,
                'lowStockProducts': low_stock_products,
                'outOfStockProducts': out_of_stock_products,
                'totalValue': total_value,
                'recentActivities': activities
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# Activities routes
@api_bp.route('/activities', methods=['GET'])
def get_activities():
    try:
        limit = request.args.get('limit', 10, type=int)
        activities = Activity.get_recent(limit)
        return jsonify({'success': True, 'data': activities})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500