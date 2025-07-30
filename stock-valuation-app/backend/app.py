from flask import Flask, jsonify, request
from valuation.routes import valuation_bp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Register the valuation blueprint
app.register_blueprint(valuation_bp)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Stock Valuation API!"})

if __name__ == '__main__':
    app.run(debug=True)