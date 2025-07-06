document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Chat Assistant functionality
    const chatInput = document.querySelector('.chat-input input');
    const chatButton = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');

    if (chatInput && chatButton && chatMessages) {
        chatButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function sendMessage() {
        if (!chatInput.value.trim()) return;

        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.innerHTML = `<div class="message-content">${chatInput.value}</div>`;
        chatMessages.appendChild(userMessage);

        // Simulate AI response (in a real app, this would be an API call)
        setTimeout(() => {
            const aiResponse = document.createElement('div');
            aiResponse.className = 'message ai';
            
            // Simple responses based on keywords
            let responseText = "I'm analyzing your inquiry. How else can I help you?";
            
            const userText = chatInput.value.toLowerCase();
            if (userText.includes('fraud') || userText.includes('suspicious')) {
                responseText = "I've checked your recent transactions and don't see any suspicious activity. Would you like me to explain our fraud detection measures?";
            } else if (userText.includes('alert') || userText.includes('notification')) {
                responseText = "Your alert preferences are currently set to notify you for transactions over $1000. Would you like to adjust this threshold?";
            } else if (userText.includes('help') || userText.includes('explain')) {
                responseText = "I'm here to help! You can ask me about transaction details, fraud alerts, or security recommendations.";
            }
            
            aiResponse.innerHTML = `<div class="message-content">${responseText}</div>`;
            chatMessages.appendChild(aiResponse);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 800);

        // Clear input
        chatInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Transaction detail buttons
    const detailButtons = document.querySelectorAll('.btn-outline-primary');
    if (detailButtons) {
        detailButtons.forEach(button => {
            button.addEventListener('click', function() {
                const transactionDetailModal = new bootstrap.Modal(document.getElementById('transactionDetailModal'));
                transactionDetailModal.show();
            });
        });
    }

    // New Transaction form handling
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
            
            // Here you would normally submit to an API
            alert('Transaction submitted successfully!');
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('newTransactionModal'));
            modal.hide();
            
            // Reset form
            transactionForm.reset();
        });
    }
});