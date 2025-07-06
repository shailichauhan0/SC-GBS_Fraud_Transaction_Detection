from flask import Flask,render_template,redirect,url_for,flash, request,session,jsonify
from datetime import datetime
from dotenv import load_dotenv
import os
from db import db
import pickle
import pandas as pd
import shap
import json
import requests

load_dotenv()

app = Flask(__name__)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS')
app.config['GEMINI_API_KEY'] = os.getenv('GEMINI_API_KEY')


db.init_app(app)

import models

# Load the fraud detection model
with open("fraud_detection_model.pkl", "rb") as model_file:
    fraud_detection_model = pickle.load(model_file)

# Initialize SHAP explainer
explainer = shap.Explainer(fraud_detection_model)


@app.route('/')
def home():
    fraud_transactions_c = models.TransactionLog.query.filter_by(fraud_status="Fraud").count()  # Count fraud transactions
    total_transactions_c = models.TransactionLog.query.count()  # Total number of transactions
    return render_template('home.html',total_transactions_c=total_transactions_c,fraud_transactions_c=fraud_transactions_c)

# # Your routes and other app configuration goes here
# @app.route('/')
# def index():
#     return render_template('home.html')

@app.route('/dashboard/recent_transactions')
def recent_transactions():
    total_transactions_c = models.TransactionLog.query.count()  # Total number of transactions
    fraud_transactions_c = models.TransactionLog.query.filter_by(fraud_status="Fraud").count() 
    transactions = models.TransactionLog.query.order_by(models.TransactionLog.timestamp.desc()).all()
    return render_template('recent_transactions.html', transactions=transactions, total_transactions_c=total_transactions_c,fraud_transactions_c=fraud_transactions_c)

@app.route('/dashboard/fraud_alerts')
def fraud_alerts():
    fraud_transactions_c = models.TransactionLog.query.filter_by(fraud_status="Fraud").count()  # Count fraud transactions
    total_transactions_c = models.TransactionLog.query.count()  # Total number of transactions
     # Query to get all fraudulent transactions
    fraud_transactions = models.TransactionLog.query.filter_by(fraud_status="Fraud").order_by(models.TransactionLog.timestamp.desc()).all()
    
    return render_template('fraud_alerts.html', alerts=fraud_transactions,fraud_transactions_c=fraud_transactions_c,total_transactions_c=total_transactions_c)


@app.route('/add_transaction', methods=['POST'])
def add_transaction():
    if request.method == 'POST':
        try:
            transaction_id = request.form['transaction_id']
            customer_id = request.form['account_id']
            #account_id = request.form['account_id']
            amount = float(request.form['amount'])
            location = request.form['location']
            timestamp = datetime.strptime(request.form['timestamp'], "%Y-%m-%dT%H:%M")
            transaction_type = request.form['transaction_type']

            customer_age = int(request.form.get('CustomerAge', 30))
            transaction_duration = int(request.form.get('TransactionDuration', 5))    
            login_attempts = int(request.form.get('LoginAttempts', 1))          
            account_balance = float(request.form.get('AccountBalance', 10000.0))

            device_id =  'UnknownDevice'  
            ip_address = 'IPAddress', '0.0.0.0'
            merchant_id =  'UnknownMerchant'
            channel =  'Online'                
            customer_occupation =  'Unknown' 
            previous_transaction_date =  '2025-01-01'
            transaction_day = timestamp.weekday()  # 0 = Monday, 6 = Sunday
            transaction_hour = timestamp.hour
            transaction_count = 5

            print("Received Data:", transaction_id, customer_id, amount, location, timestamp, transaction_type)

            # Prepare the input data for the model
            input_data = pd.DataFrame([{
                #'TransactionID': transaction_id,
                #'AccountID': account_id,
                'TransactionAmount': amount,
                #'TransactionDate': timestamp,
                #'TransactionType': transaction_type,
                #'Location': location,
                #'DeviceID': device_id,
                #'IP Address': ip_address,
                #'MerchantID': merchant_id,
                #'Channel': channel,
                'CustomerAge': customer_age,
                #'CustomerOccupation': customer_occupation,
                'TransactionDuration': transaction_duration,
                'LoginAttempts': login_attempts,
                'AccountBalance': account_balance,
                #'PreviousTransactionDate': previous_transaction_date
                'TransactionHour': transaction_hour,
                'TransactionDay': transaction_day,
                'TransactionCount': transaction_count
            }])

            # Make prediction
            prediction = fraud_detection_model.predict(input_data)[0]  # Assuming binary classification (0: Not Fraud, 1: Fraud)
            prediction_proba = fraud_detection_model.predict_proba(input_data)[0]  # Get prediction probabilities

            fraud_status = "Fraud" if prediction == 1 else "Legit"

            # Compute risk score (scale fraud probability to a 0-10 range)
            risk_score = round(prediction_proba[1] * 10, 2)  # Scale fraud probability to a 10-point scale

            #Generate SHAP explanations
            shap_values = explainer(input_data)
            shap_contributions = dict(zip(input_data.columns, shap_values.values[0].flatten()))

            # Sort features by absolute SHAP value (most impactful first)
            sorted_features = sorted(shap_contributions.items(), key=lambda x: abs(x[1]), reverse=True)

            # Create explanation based on SHAP impact
            explanation_parts = []
            for feature, value in sorted_features:
                if value > 0:
                    explanation_parts.append(f"{feature} increased fraud likelihood.\n")
                elif value < 0:
                    explanation_parts.append(f"{feature} decreased fraud likelihood.\n")
            

            # Join into a final conclusion
            text_conclusion = " ".join(explanation_parts)
            text_conclusion = str(text_conclusion) 
            if not isinstance(text_conclusion, str):
                text_conclusion = str(text_conclusion)


            # Save transaction to DB
            new_transaction = models.TransactionLog(
                transaction_id=transaction_id,
                customer_id=customer_id,
                amount=amount,
                timestamp=timestamp,
                location=location,
                transaction_type=transaction_type,
                fraud_status=fraud_status,
                risk_score=risk_score,
                shap_reason=text_conclusion
            )
            db.session.add(new_transaction)
            db.session.commit()

            # # Create a detailed popup message with all the information
            # popup_message = {
            #     'title': f"Transaction {fraud_status}",
            #     'transaction_id': transaction_id,
            #     'customer_id': customer_id,
            #     'amount': f"${amount:.2f}",
            #     'location': location,
            #     'timestamp': timestamp.strftime("%Y-%m-%d %H:%M"),
            #     'transaction_type': transaction_type,
            #     'fraud_status': fraud_status,
            #     'risk_score': f"{risk_score}/10",
            #     #'explanation': text_conclusion,
            #     #'factors': sorted_features[:3]  # Top 3 most influential factors
            # }
            
            # # Store the popup message in the session to display it on the next page
            # session['transaction_popup'] = popup_message
            
            # Flash a simpler message
            flash("Yep!Transaction added successfully!Will notify if it is fraudulent or good to go", "success")
            flash_class = "danger" if fraud_status == "Fraud" else "success"
            flash(f"Transaction added: {fraud_status} (Risk: {risk_score}/10)", flash_class)

        except Exception as e:
            flash(f"Error: {str(e)}", "danger")

    return redirect(url_for('recent_transactions'))


# API to fetch transaction data
@app.route('/transaction-data')
def transaction_data():
    transactions = models.TransactionLog.query.order_by(models.TransactionLog.timestamp).all()
    
    data = {
        "timestamps": [t.timestamp.strftime("%Y-%m-%d %H:%M:%S") for t in transactions],
        "amounts": [t.amount for t in transactions],
        "fraud_status": [t.fraud_status for t in transactions]
    }
    return jsonify(data)


if __name__ == '__main__':
    with app.app_context():
        db.create_all() 
    app.run(debug=True)
