// JANSEVA Main JavaScript File (continued)

// Global utility functions
const JANSEVA = {
    // Configuration
    config: {
        apiBaseUrl: 'https://api.janaseva.gov.in',
        appName: 'JANSEVA',
        version: '1.0.0'
    },

    // Initialize application
    init: function() {
        this.checkAuth();
        this.loadUserData();
        this.initializeEventListeners();
        console.log('JANSEVA initialized successfully');
    },

    // Check authentication status
    checkAuth: function() {
        const currentPage = window.location.pathname.split('/').pop();
        const protectedPages = ['dashboard.html', 'services.html', 'profile.html'];
        
        if (protectedPages.includes(currentPage)) {
            const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
                window.location.href = 'login.html';
            }
        }
    },

    // Load user data from session
    loadUserData: function() {
        this.user = {
            name: sessionStorage.getItem('userName') || 'Guest',
            aadhaar: sessionStorage.getItem('userAadhaar') || '',
            mobile: sessionStorage.getItem('userMobile') || '',
            email: sessionStorage.getItem('userEmail') || ''
        };
    },

    // Initialize event listeners
    initializeEventListeners: function() {
        // Add scroll event for navbar
        window.addEventListener('scroll', this.handleScroll);
        
        // Add resize event for responsive design
        window.addEventListener('resize', this.handleResize);
        
        // Add online/offline detection
        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);
    },

    // Handle scroll events
    handleScroll: function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                navbar.style.background = '#ffffff';
                navbar.style.backdropFilter = 'none';
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }
        }
    },

    // Handle resize events
    handleResize: function() {
        const width = window.innerWidth;
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (sidebar && mainContent) {
            if (width <= 768) {
                sidebar.classList.remove('active');
                mainContent.style.marginLeft = '0';
            } else {
                sidebar.classList.add('active');
                mainContent.style.marginLeft = '280px';
            }
        }
    },

    // Handle online status
    handleOnline: function() {
        this.showNotification('You are back online', 'success');
        this.syncOfflineData();
    },

    // Handle offline status
    handleOffline: function() {
        this.showNotification('You are offline. Some features may be limited.', 'warning');
    },

    // Show notification
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    },

    // Get notification color based on type
    getNotificationColor: function(type) {
        const colors = {
            success: '#7B9669',
            error: '#ff4444',
            warning: '#e5a13e',
            info: '#335765'
        };
        return colors[type] || colors.info;
    },

    // Sync offline data
    syncOfflineData: function() {
        const offlineData = JSON.parse(localStorage.getItem('offlineData') || '[]');
        if (offlineData.length > 0) {
            this.showNotification(`Syncing ${offlineData.length} items...`, 'info');
            
            // Simulate sync
            setTimeout(() => {
                localStorage.removeItem('offlineData');
                this.showNotification('Sync completed successfully', 'success');
            }, 2000);
        }
    },

    // Form validation
    validateForm: function(formData, rules) {
        const errors = {};
        
        for (const [field, rule] of Object.entries(rules)) {
            const value = formData[field];
            
            if (rule.required && (!value || value.trim() === '')) {
                errors[field] = `${field} is required`;
                continue;
            }
            
            if (rule.pattern && !rule.pattern.test(value)) {
                errors[field] = rule.message || `Invalid ${field}`;
            }
            
            if (rule.minLength && value.length < rule.minLength) {
                errors[field] = `${field} must be at least ${rule.minLength} characters`;
            }
            
            if (rule.maxLength && value.length > rule.maxLength) {
                errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
            }
            
            if (rule.match && value !== formData[rule.match]) {
                errors[field] = `${field} does not match`;
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    },

    // Format currency
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    },

    // Format date
    formatDate: function(date, format = 'DD/MM/YYYY') {
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        
        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year);
    },

    // Generate random ID
    generateId: function(prefix = '') {
        return prefix + Math.random().toString(36).substr(2, 9).toUpperCase();
    },

    // Mask Aadhaar number
    maskAadhaar: function(aadhaar) {
        if (aadhaar && aadhaar.length === 12) {
            return 'XXXX-XXXX-' + aadhaar.slice(-4);
        }
        return aadhaar;
    },

    // Save to localStorage
    saveToStorage: function(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving to storage:', e);
            return false;
        }
    },

    // Get from localStorage
    getFromStorage: function(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error reading from storage:', e);
            return null;
        }
    },

    // Animation utilities
    animate: {
        fadeIn: function(element, duration = 300) {
            element.style.opacity = '0';
            element.style.display = 'block';
            
            let start = null;
            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                element.style.opacity = Math.min(progress / duration, 1);
                if (progress < duration) {
                    window.requestAnimationFrame(step);
                }
            }
            window.requestAnimationFrame(step);
        },

        fadeOut: function(element, duration = 300) {
            element.style.opacity = '1';
            
            let start = null;
            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                element.style.opacity = Math.max(1 - progress / duration, 0);
                if (progress < duration) {
                    window.requestAnimationFrame(step);
                } else {
                    element.style.display = 'none';
                }
            }
            window.requestAnimationFrame(step);
        },

        slideIn: function(element, direction = 'left', duration = 300) {
            const startPosition = direction === 'left' ? '-100%' : '100%';
            element.style.transform = `translateX(${startPosition})`;
            element.style.display = 'block';
            
            let start = null;
            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = (timestamp - start) / duration;
                const translate = Math.max(0, 1 - progress) * (direction === 'left' ? -100 : 100);
                element.style.transform = `translateX(${translate}%)`;
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            }
            window.requestAnimationFrame(step);
        }
    },

    // API calls (simulated)
    api: {
        // Simulate API request
        request: async function(endpoint, method = 'GET', data = null) {
            this.showLoader();
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.hideLoader();
            
            // Return mock data based on endpoint
            return this.getMockData(endpoint);
        },

        // Show loader
        showLoader: function() {
            const loader = document.createElement('div');
            loader.className = 'global-loader';
            loader.innerHTML = '<div class="loader"></div>';
            document.body.appendChild(loader);
        },

        // Hide loader
        hideLoader: function() {
            const loader = document.querySelector('.global-loader');
            if (loader) {
                loader.remove();
            }
        },

        // Get mock data
        getMockData: function(endpoint) {
            const mockData = {
                'user/profile': {
                    name: 'Demo User',
                    aadhaar: '123456789012',
                    mobile: '9876543210',
                    email: 'user@example.com'
                },
                'services/electricity/bill': {
                    amount: 1250.50,
                    dueDate: '2024-03-15',
                    status: 'pending'
                },
                'services/water/bill': {
                    amount: 450.75,
                    dueDate: '2024-03-20',
                    status: 'pending'
                },
                'complaints/list': [
                    { id: 'CMP001', status: 'resolved', date: '2024-02-01' },
                    { id: 'CMP002', status: 'processing', date: '2024-02-15' }
                ]
            };
            
            return mockData[endpoint] || { success: true, message: 'Mock response' };
        }
    },

    // Accessibility features
    accessibility: {
        increaseFont: function() {
            const html = document.documentElement;
            const currentSize = parseFloat(getComputedStyle(html).fontSize);
            html.style.fontSize = (currentSize + 2) + 'px';
        },

        decreaseFont: function() {
            const html = document.documentElement;
            const currentSize = parseFloat(getComputedStyle(html).fontSize);
            html.style.fontSize = Math.max(12, currentSize - 2) + 'px';
        },

        highContrast: function() {
            document.body.classList.toggle('high-contrast');
        },

        voiceGuidance: function(text) {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'hi-IN';
                utterance.rate = 0.9;
                window.speechSynthesis.speak(utterance);
            }
        }
    },

    // Multi-language support
    i18n: {
        currentLanguage: 'en',
        
        translations: {
            en: {
                welcome: 'Welcome',
                login: 'Login',
                logout: 'Logout',
                services: 'Services',
                complaints: 'Complaints',
                booking: 'Slot Booking',
                dashboard: 'Dashboard'
            },
            hi: {
                welcome: 'स्वागत है',
                login: 'लॉग इन',
                logout: 'लॉग आउट',
                services: 'सेवाएं',
                complaints: 'शिकायतें',
                booking: 'स्लॉट बुकिंग',
                dashboard: 'डैशबोर्ड'
            },
            te: {
                welcome: 'స్వాగతం',
                login: 'లాగిన్',
                logout: 'లాగ్అవుట్',
                services: 'సేవలు',
                complaints: 'ఫిర్యాదులు',
                booking: 'స్లాట్ బుకింగ్',
                dashboard: 'డాష్‌బోర్డ్'
            }
        },

        translate: function(key) {
            return this.translations[this.currentLanguage][key] || key;
        },

        setLanguage: function(lang) {
            if (this.translations[lang]) {
                this.currentLanguage = lang;
                this.updatePageContent();
            }
        },

        updatePageContent: function() {
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                element.textContent = this.translate(key);
            });
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    JANSEVA.init();
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .global-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            backdrop-filter: blur(5px);
        }
        
        .loader {
            width: 50px;
            height: 50px;
            border: 3px solid var(--primary-bg);
            border-top: 3px solid var(--highlight);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .high-contrast {
            filter: contrast(150%);
            background: #000 !important;
            color: #fff !important;
        }
        
        .high-contrast * {
            background: #000 !important;
            color: #ff0 !important;
            border-color: #ff0 !important;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        }
        
        .notification-success { background: #7B9669; }
        .notification-error { background: #ff4444; }
        .notification-warning { background: #e5a13e; }
        .notification-info { background: #335765; }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
            color: white;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 0 5px;
        }
        
        .notification-close:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JANSEVA;
}
function toggleDropdown() {
    document.getElementById("serviceDropdown").classList.toggle("show");
}

<script>
    const btn = document.getElementById("serviceBtn");
    const dropdown = document.getElementById("serviceDropdown");

    btn.addEventListener("click", function () {
        dropdown.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    window.addEventListener("click", function(e) {
        if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove("show");
        }
    });

</script>