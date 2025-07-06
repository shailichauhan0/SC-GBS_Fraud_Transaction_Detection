document.addEventListener('DOMContentLoaded', function() {

    // // Check if there's a transaction popup to display
    // const transactionPopup = JSON.parse({{ session.pop('transaction_popup', None) | tojson | safe }});
    
    // if (transactionPopup) {
    //     // Create and show the transaction result modal
    //     const modal = new bootstrap.Modal(document.getElementById('transactionResultModal'));
        
    //     // Set the modal title and content based on fraud status
    //     const modalTitle = document.getElementById('transactionResultTitle');
    //     modalTitle.textContent = transactionPopup.title;
        
    //     // Set the badge color based on fraud status
    //     const statusBadge = document.getElementById('transactionStatusBadge');
    //     if (transactionPopup.fraud_status === 'Fraud') {
    //         statusBadge.classList.add('bg-danger');
    //         document.getElementById('transactionResultModal').classList.add('fraud-alert');
    //     } else {
    //         statusBadge.classList.add('bg-success');
    //     }
    //     statusBadge.textContent = transactionPopup.fraud_status;
        
    //     // Fill in transaction details
    //     document.getElementById('popupTransactionId').textContent = transactionPopup.transaction_id;
    //     document.getElementById('popupCustomerId').textContent = transactionPopup.customer_id;
    //     document.getElementById('popupAmount').textContent = transactionPopup.amount;
    //     document.getElementById('popupLocation').textContent = transactionPopup.location;
    //     document.getElementById('popupTimestamp').textContent = transactionPopup.timestamp;
    //     document.getElementById('popupType').textContent = transactionPopup.transaction_type;
    //     document.getElementById('popupRiskScore').textContent = transactionPopup.risk_score;
        
    //     // Add explanation factors
    //     const explanationList = document.getElementById('explanationFactors');
    //     explanationList.innerHTML = '';
        
    //     // Add top factors that influenced the decision
    //     if (transactionPopup.factors && transactionPopup.factors.length > 0) {
    //         transactionPopup.factors.forEach(factor => {
    //             const li = document.createElement('li');
    //             const featureName = factor[0];
    //             const impact = factor[1];
                
    //             if (impact > 0) {
    //                 li.innerHTML = `<strong>${featureName}</strong>: Increased risk`;
    //                 li.classList.add('text-danger');
    //             } else {
    //                 li.innerHTML = `<strong>${featureName}</strong>: Decreased risk`;
    //                 li.classList.add('text-success');
    //             }
                
    //             explanationList.appendChild(li);
    //         });
    //     } else {
    //         explanationList.innerHTML = '<li>No specific factors identified</li>';
    //     }
        
    //     // Show the modal
    //     modal.show();
    // }

    document.body.addEventListener("click", function (event) {
        if (event.target.classList.contains("transaction-details-btn")) {
            // Fetch values from button data attributes
            let button = event.target;
            let transactionId = button.getAttribute("data-transaction-id");
            let timestamp = button.getAttribute("data-timestamp");
            let amount = button.getAttribute("data-amount");
            let location = button.getAttribute("data-location");
            let fraudStatus = button.getAttribute("data-fraud-status");
            let shapReason = button.getAttribute("data-shap-reason");

            // Set values in modal
            const modalTransactionId = document.getElementById("modal-transaction-id");
            if (modalTransactionId) modalTransactionId.textContent = transactionId;
            
            const modalTimestamp = document.getElementById("modal-timestamp");
            if (modalTimestamp) modalTimestamp.textContent = timestamp;
            
            const modalAmount = document.getElementById("modal-amount");
            if (modalAmount) modalAmount.textContent = "Rs. " + parseFloat(amount).toFixed(2);
            
            const modalLocation = document.getElementById("modal-location");
            if (modalLocation) modalLocation.textContent = location;
            
            const modalShapReason = document.getElementById("modal-shap-reason");
            if (modalShapReason) modalShapReason.textContent = shapReason;

            // Update status with color
            let statusBadge = document.getElementById("modal-status");
            if (statusBadge) {
                statusBadge.textContent = fraudStatus;
                statusBadge.className = "badge"; // Reset class
                if (fraudStatus === "Fraud") {
                    statusBadge.classList.add("bg-danger");
                } else if (fraudStatus === "Pending") {
                    statusBadge.classList.add("bg-warning", "text-dark");
                } else {
                    statusBadge.classList.add("bg-success");
                }
            }
        }
    });

    // Ensure modal closes properly and doesn't freeze the page
    let modal = document.getElementById("transactionDetailModal");
    if (modal) {
        modal.addEventListener("hidden.bs.modal", function () {
            // Safely reset modal content to avoid issues
            const elements = [
                "modal-transaction-id", 
                "modal-timestamp", 
                "modal-amount", 
                "modal-location", 
                "modal-shap-reason", 
                "modal-status"
            ];
            
            elements.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    if (id === "modal-status") {
                        element.className = "badge";
                    }
                    element.textContent = "";
                }
            });
        });
    }

    // Add Transaction Button
    const addTransactionButton = document.querySelector('button[data-bs-target="#newTransactionModal"]');
    const transactionForm = document.getElementById('transactionForm');
    const submitTransactionBtn = document.getElementById('submitTransaction');
    
    if (submitTransactionBtn && transactionForm) {
        submitTransactionBtn.addEventListener('click', function() {
            const amount = document.getElementById('amount').value;
            const location = document.getElementById('location').value;
            const timestamp = document.getElementById('timestamp').value;
            
            if (!amount || !location || !timestamp) {
                alert('Please fill out all fields');
                return;
            }
            
            // Here you would normally submit to your backend/API
            
            // Simulate adding a new transaction to the table (in a real app, this would come from the backend)
            const transactionTable = document.querySelector('.transaction-table tbody');
            if (transactionTable) {
                const newRow = document.createElement('tr');
                
                // Generate a random ID for demo purposes
                const randomId = 'T' + Math.floor(Math.random() * 900 + 100);
                
                // Format amount with currency symbol
                const formattedAmount = parseFloat(amount).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD'
                });
                
                // Format timestamp
                const dateObj = new Date(timestamp);
                const formattedDate = dateObj.toLocaleString();
                
                // Set row content
                let isFraudulent = false;
                
                // Simple detection logic for demo - flag large amounts as potentially fraudulent
                if (parseFloat(amount) > 3000) {
                    isFraudulent = true;
                    newRow.classList.add('table-warning');
                }
                
                newRow.innerHTML = `
                    <td>${randomId}</td>
                    <td>${formattedDate}</td>
                    <td>${formattedAmount}</td>
                    <td>${location}</td>
                    <td><span class="badge ${isFraudulent ? 'bg-danger' : 'bg-success'}">${isFraudulent ? 'Suspicious' : 'Normal'}</span></td>
                    <td><button class="btn btn-sm ${isFraudulent ? 'btn-primary' : 'btn-outline-primary'}">${isFraudulent ? 'Review' : 'Details'}</button></td>
                `;
                
                // Insert at the beginning of the table
                transactionTable.insertBefore(newRow, transactionTable.firstChild);
                
                // Show success message
                const flashContainer = document.getElementById('flash-messages');
                if (flashContainer) {
                    const alert = document.createElement('div');
                    alert.className = 'alert alert-success alert-dismissible fade show';
                    alert.innerHTML = `
                        Transaction ${randomId} added successfully!
                        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                    `;
                    flashContainer.appendChild(alert);
                    
                    // Auto dismiss after 3 seconds
                    setTimeout(() => {
                        alert.remove();
                    }, 3000);
                }
            }
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('newTransactionModal'));
            modal.hide();
            
            // Reset form
            transactionForm.reset();
        });
    }
    
    // Export button
    const exportButton = document.querySelector('button.btn-outline-primary:contains("Export")');
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            alert('This would export your transaction data to CSV/Excel in a real application.');
        });
    }
    
    // Filter controls
    const applyFiltersButton = document.querySelector('button.btn-primary:contains("Apply Filters")');
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', function() {
            alert('Filters would be applied to the transaction list in a real application.');
        });
    }
    
    const resetButton = document.querySelector('button.btn-outline-secondary:contains("Reset")');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Reset all filter controls
            document.getElementById('status-filter').value = 'all';
            const dateInputs = document.querySelectorAll('input[type="date"]');
            dateInputs.forEach(input => {
                input.value = '';
            });
            
            const amountInputs = document.querySelectorAll('input[placeholder="Min"], input[placeholder="Max"]');
            amountInputs.forEach(input => {
                input.value = '';
            });
            
            alert('Filters have been reset.');
        });
    }
});