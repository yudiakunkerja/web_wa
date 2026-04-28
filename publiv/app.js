/* public/style.css */
:root {
    --primary: #25D366;
    --primary-dark: #128C7E;
    --primary-light: #DCF8C6;
    --secondary: #075E54;
    --dark: #111B21;
    --dark-light: #1F2C33;
    --dark-lighter: #2A3942;
    --text: #E9EDEF;
    --text-secondary: #8696A0;
    --danger: #EF4444;
    --warning: #F59E0B;
    --blue: #3B82F6;
    --purple: #8B5CF6;
    --border: #2A3942;
    --card-bg: #1F2C33;
    --hover: #2A3942;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, sans-serif;
    background-color: var(--dark);
    color: var(--text);
    min-height: 100vh;
}

/* ============= HEADER ============= */
.header {
    background: var(--secondary);
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.logo {
    width: 48px;
    height: 48px;
    background: var(--primary);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
}

.header h1 {
    font-size: 20px;
    font-weight: 700;
}

.subtitle {
    font-size: 13px;
    color: var(--text-secondary);
}

.status-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 20px;
    background: var(--dark-light);
    font-size: 14px;
    font-weight: 500;
}

.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--warning);
    animation: pulse 2s infinite;
}

.status-badge.connected .status-dot {
    background: var(--primary);
}

.status-badge.disconnected .status-dot {
    background: var(--danger);
    animation: none;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

/* ============= MAIN ============= */
.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
}

/* ============= QR SECTION ============= */
.qr-card {
    background: var(--card-bg);
    border-radius: 16px;
    padding: 40px;
    max-width: 500px;
    margin: 40px auto;
    text-align: center;
    border: 1px solid var(--border);
}

.qr-header {
    margin-bottom: 30px;
}

.qr-header i {
    font-size: 48px;
    color: var(--primary);
    margin-bottom: 16px;
}

.qr-header h2 {
    font-size: 24px;
    margin-bottom: 8px;
}

.qr-header p {
    color: var(--text-secondary);
    font-size: 14px;
}

.qr-container {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin: 24px auto;
    width: 280px;
    height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.qr-image {
    width: 240px;
    height: 240px;
    border-radius: 8px;
}

.qr-loading {
    text-align: center;
}

.spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--primary-light);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.qr-loading p {
    color: var(--dark);
    font-size: 14px;
}

.qr-instructions {
    margin-top: 30px;
    text-align: left;
}

.instruction {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
}

.instruction:last-child {
    border-bottom: none;
}

.step {
    width: 32px;
    height: 32px;
    background: var(--primary);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
    flex-shrink: 0;
}

.instruction p {
    font-size: 14px;
    color: var(--text-secondary);
}

.instruction strong {
    color: var(--text);
}

/* ============= DASHBOARD ============= */
.info-card {
    background: var(--card-bg);
    border-radius: 12px;
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    border: 1px solid var(--border);
}

.user-info {
    display: flex;
    align-items: center;
    gap: 16px;
}

.avatar {
    width: 52px;
    height: 52px;
    background: var(--primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: white;
}

.user-info h3 {
    font-size: 18px;
}

.user-info p {
    color: var(--text-secondary);
    font-size: 14px;
}

.action-buttons {
    display: flex;
    gap: 10px;
}

/* ============= STATS ============= */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.stat-card {
    background: var(--card-bg);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    border: 1px solid var(--border);
    transition: transform 0.2s;
}

.stat-card:hover {
    transform: translateY(-2px);
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.stat-icon.blue { background: rgba(59, 130, 246, 0.15); color: var(--blue); }
.stat-icon.green { background: rgba(37, 211, 102, 0.15); color: var(--primary); }
.stat-icon.red { background: rgba(239, 68, 68, 0.15); color: var(--danger); }
.stat-icon.purple { background: rgba(139, 92, 246, 0.15); color: var(--purple); }

.stat-info h4 {
    font-size: 24px;
    font-weight: 700;
}

.stat-info p {
    font-size: 13px;
    color: var(--text-secondary);
}

/* ============= CONTROLS ============= */
.controls-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
}

.control-card {
    background: var(--card-bg);
    border-radius: 12px;
    padding: 24px;
    border: 1px solid var(--border);
}

.control-card h3 {
    font-size: 16px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.control-card h3 i {
    color: var(--primary);
}

.toggle-group {
    margin-bottom: 20px;
}

.toggle-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0;
    border-bottom: 1px solid var(--border);
}

.toggle-item:last-child {
    border-bottom: none;
}

.toggle-item strong {
    display: block;
    font-size: 14px;
    margin-bottom: 4px;
}

.toggle-item p {
    font-size: 12px;
    color: var(--text-secondary);
}

/* Toggle Switch */
.switch {
    position: relative;
    width: 52px;
    height: 28px;
    flex-shrink: 0;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background: var(--dark-lighter);
    border-radius: 28px;
    transition: 0.3s;
}

.slider::before {
    content: "";
    position: absolute;
    width: 22px;
    height: 22px;
    left: 3px;
    bottom: 3px;
    background: white;
    border-radius: 50%;
    transition: 0.3s;
}

input:checked + .slider {
    background: var(--primary);
}

input:checked + .slider::before {
    transform: translateX(24px);
}

/* Textarea */
textarea {
    width: 100%;
    background: var(--dark);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px;
    color: var(--text);
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    resize: vertical;
    margin-bottom: 12px;
    outline: none;
    transition: border-color 0.3s;
}

textarea:focus {
    border-color: var(--primary);
}

.help-text {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 12px;
}

/* ============= BUTTONS ============= */
.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
}

.btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.btn:active {
    transform: translateY(0);
}

.btn-primary {
    background: var(--primary);
    color: white;
}

.btn-secondary {
    background: var(--dark-lighter);
    color: var(--text);
}

.btn-danger {
    background: var(--danger);
    color: white;
}

.btn-warning {
    background: var(--warning);
    color: var(--dark);
}

.btn-sm {
    padding: 6px 14px;
    font-size: 13px;
    background: var(--dark-lighter);
    color: var(--text);
}

.full-width {
    width: 100%;
    justify-content: center;
}

/* ============= MESSAGE LOG ============= */
.log-card {
    background: var(--card-bg);
    border-radius: 12px;
    border: 1px solid var(--border);
    overflow: hidden;
}

.log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
}

.log-header h3 {
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.log-header h3 i {
    color: var(--primary);
}

.log-container {
    max-height: 500px;
    overflow-y: auto;
}

.log-container::-webkit-scrollbar {
    width: 6px;
}

.log-container::-webkit-scrollbar-thumb {
    background: var(--dark-lighter);
    border-radius: 3px;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--text-secondary);
}

.empty-state i {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.3;
}

.log-item {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    transition: background 0.2s;
}

.log-item:hover {
    background: var(--hover);
}

.log-item:last-child {
    border-bottom: none;
}

.log-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.log-sender {
    font-weight: 600;
    font-size: 14px;
    color: var(--primary);
}

.log-time {
    font-size: 12px;
    color: var(--text-secondary);
}

.log-message {
    background: var(--dark);
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 6px;
    border-left: 3px solid var(--blue);
    word-break: break-word;
}

.log-reply {
    background: var(--dark);
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 13px;
    border-left: 3px solid var(--primary);
    word-break: break-word;
}

.log-status {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 10px;
    font-size: 11px;
    font-weight: 600;
    margin-top: 6px;
}

.log-status.replied { background: rgba(37, 211, 102, 0.15); color: var(--primary); }
.log-status.error { background: rgba(239, 68, 68, 0.15); color: var(--danger); }
.log-status.skipped { background: rgba(245, 158, 11, 0.15); color: var(--warning); }
.log-status.command { background: rgba(59, 130, 246, 0.15); color: var(--blue); }

/* ============= FOOTER ============= */
.footer {
    text-align: center;
    padding: 20px;
    color: var(--text-secondary);
    font-size: 13px;
}

/* ============= TOAST ============= */
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.toast {
    padding: 14px 20px;
    border-radius: 10px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 10px;
    animation: slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards;
    min-width: 300px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.toast.success { background: var(--primary-dark); }
.toast.error { background: var(--danger); }
.toast.info { background: var(--blue); }
.toast.warning { background: var(--warning); color: var(--dark); }

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeOut {
    to { opacity: 0; transform: translateX(100%); }
}

/* ============= UTILITIES ============= */
.hidden {
    display: none !important;
}

/* ============= RESPONSIVE ============= */
@media (max-width: 768px) {
    .header {
        flex-direction: column;
        gap: 12px;
        padding: 12px 16px;
    }
    
    .main-content {
        padding: 16px;
    }
    
    .info-card {
        flex-direction: column;
        gap: 16px;
        text-align: center;
    }
    
    .user-info {
        flex-direction: column;
    }
    
    .controls-grid {
        grid-template-columns: 1fr;
    }
    
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .qr-card {
        padding: 24px;
        margin: 20px auto;
    }
    
    .action-buttons {
        flex-wrap: wrap;
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }
}
