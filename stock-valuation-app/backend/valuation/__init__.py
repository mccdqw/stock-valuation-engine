from flask import Blueprint

valuation_bp = Blueprint('valuation', __name__)

from . import routes  # Import routes to register them with the blueprint