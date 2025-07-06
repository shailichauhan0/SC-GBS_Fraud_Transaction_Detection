# 💳 SC-GBS_Fraud_Transaction_Detection

Detects fraudulent banking transactions in real-time, securing women’s accounts with AI-driven analysis, real-time alerts, and chatbot support.

---

## 📌 Project Details

- **Repository Name:** `SC-GBS_Fraud_Transaction_Detection`
- **Mentor:** Mr. Anurag Sharma
- **Presented By:** Group 2

**👩‍💻 Team Members:**
- Gunjan Aggarwal  
- Tvesa Gupta  
- Shaili Chauhan  
- Umarani Muthukrishnan  
- Hemasri Vodnala  

---

## 🚨 Problem Statement

Financial fraud disproportionately affects women, making secure banking essential. Traditional systems often fail to detect threats in real-time.

Our **AI-driven system** analyzes banking transaction patterns, detects anomalies, and flags suspicious activities instantly — providing proactive account protection.

---

## 💡 Proposed Solution

1. 🤖 **AI & ML-Based Fraud Detection**  
   Uses **Random Forest** to detect real-time transaction anomalies.

2. 🔐 **Secure & Scalable Architecture**  
   Built using **Flask (backend)**, **JavaScript (frontend)**, and encryption techniques.

3. 📲 **Real-Time Alerts & AI Chatbot**  
   Instantly notifies users and integrates a chatbot for assistance using **generative AI**.

---

## 🔁 Workflow Overview

- 📊 Data Processing  
- 🔍 Transaction Evaluation  
- 🧠 AI Analysis  
  - ❗ If Suspicious → Alert User → Block Transaction → Update AI  
  - ✅ If Safe → Approve Transaction  

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Flask (Python)  
- **Database:** SQLAlchemy with SQLite or MySQL  
- **ML Tools:** Python, Scikit-learn (Random Forest)  
- **Security:** 2FA, AES Encryption  
- **Platforms:** Canva (Design), Google Colab (Model), VS Code (Development)

---

## 🧠 How It Works

### 1️⃣ Data Collection

- Transactions are loaded from `large_bank_transactions.csv`  
- Fields include: `amount`, `time`, `sender`, `receiver`, etc.

### 2️⃣ Feature Engineering

```python
data['is_fraud'] = np.where(data['amount'] > 3000, 1, 0)
```

### 3️⃣ Model Training

```python
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)
```

### 4️⃣ Real-Time Prediction API

```python
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    amount = np.array([[data['amount']]])
    prediction = model.predict(amount)
    return jsonify({
        'transactionID': data['transactionID'],
        'is_fraud': bool(prediction[0])
    })
```

---

## 📁 Project Structure

```
SC-GBS_Fraud_Transaction_Detection/
├── app.py
├── db.py
├── models.py
├── fraud_detection_mod/
├── requirements.txt
├── drop_table.py
├── templates/
│   ├── base.html
│   ├── home.html
│   ├── recent_transactions.html
│   └── fraud_alerts.html
├── static/
│   ├── css/
│   └── js/
├── .env
├── instance/
└── venv/
```

---

## 🚀 How to Run the Project

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/SC-GBS_Fraud_Transaction_Detection.git
cd SC-GBS_Fraud_Transaction_Detection
```

### 2️⃣ Create Virtual Environment & Install Dependencies

```bash
python -m venv venv

# For Windows:
venv\Scripts\activate

# For Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
```

### 3️⃣ Run the Flask Backend

```bash
python app.py
```

Open your browser at: [http://127.0.0.1:5000/](http://127.0.0.1:5000/)

### 4️⃣ Test the API

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"transactionID": "T1001", "amount": 4500}' \
http://127.0.0.1:5000/predict
```

**Sample Response:**

```json
{
  "transactionID": "T1001",
  "is_fraud": true
}
```

---

## 🔮 Future Scope

- 🌐 Graph-Based Fraud Detection using Neo4j  
- 📊 Reinforcement Learning to adapt to new fraud behaviors  
- 🔐 Add OTP, user behavior analytics, and session monitoring  
- ☁️ Cloud deployment with Docker, Kubernetes, and AWS Lambda  
- 📈 Use LSTMs, CNNs, and GANs for advanced fraud detection  

---

## 🏁 License

This project is open-source and available under the **MIT License**.
