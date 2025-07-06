document.addEventListener('DOMContentLoaded', function() {
    // Transaction Activity Chart
    const transactionCtx = document.getElementById('transactionChart');
    if (transactionCtx) {
        const transactionChart = new Chart(transactionCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Daily Transactions',
                    data: [650, 730, 690, 820, 780, 830, 920],
                    borderColor: '#2a4b8d',
                    backgroundColor: 'rgba(42, 75, 141, 0.1)',
                    tension: 0.3,
                    fill: true,
                    pointBackgroundColor: '#2a4b8d',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(42, 75, 141, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                        borderWidth: 1,
                        padding: 10,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 14
                        },
                        callbacks: {
                            label: function(context) {
                                return `Transactions: ${context.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    // Fraud Detection Chart
    const fraudCtx = document.getElementById('fraudDetectionChart');
    if (fraudCtx) {
        const fraudChart = new Chart(fraudCtx, {
            type: 'doughnut',
            data: {
                labels: [
                    'True Negatives (92%)', 
                    'False Positives (1.3%)', 
                    'True Positives (6.2%)', 
                    'False Negatives (0.5%)'
                ],
                datasets: [{
                    data: [92, 1.3, 6.2, 0.5],
                    backgroundColor: [
                        '#4285F4', // Blue
                        '#EA4335', // Red
                        '#34A853', // Green
                        '#FBBC05'  // Yellow
                    ],
                    borderWidth: 0,
                    hoverOffset: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 10,
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 14
                        }
                    }
                }
            }
        });
    }
});