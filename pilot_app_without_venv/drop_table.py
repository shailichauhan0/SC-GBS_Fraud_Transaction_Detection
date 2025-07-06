# drop_table.py
# drop_table.py
from app import app  # Import Flask app instance
from db import db
from models import TransactionLog  # Import your model

# Drop the table inside an application context
with app.app_context():
    TransactionLog.__table__.drop(db.engine)
    print("transaction_log table dropped successfully.")
