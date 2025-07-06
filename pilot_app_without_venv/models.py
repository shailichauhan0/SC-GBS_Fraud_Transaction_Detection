from app import app
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from db import db

class TransactionLog(db.Model):
    __tablename__ = 'transaction_log'

    id = db.Column(db.Integer, primary_key=True)
    transaction_id = db.Column(db.String(50), unique=True, nullable=False)
    customer_id = db.Column(db.Integer, nullable=False)  # Customer ID (not linked to Customer table directly)
    amount = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)  # Time transaction occurred
    entry_time = db.Column(db.DateTime, default=datetime.utcnow)  # Time transaction was recorded
    location = db.Column(db.String(200), nullable=False)
    fraud_status = db.Column(db.String(20), default="Pending")  # Model will update this
    transaction_type = db.Column(db.String(50), nullable=True)  # Optional: Type of transaction
    device_info = db.Column(db.String(200), nullable=True)  # Optional: Device used for transaction

    actual_fraud_status = db.Column(db.String(20), default="Pending")  # Default as Pending
    shap_reason = db.Column(db.String(255), nullable=True)  # Nullable string for SHAP explanations
    risk_score = db.Column(db.Float, nullable=True)  # Numeric column for fraud risk score

    def __repr__(self):
        return f'<Transaction {self.transaction_id}, Status: {self.fraud_status}>'
    
    with app.app_context():
        db.create_all()  # Ensure tables are created

