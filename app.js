// ─── Stripe Payment Link ────────────────────────────────────────────────────
// Replace the empty string below with your Stripe Payment Link URL.
// Example: 'https://buy.stripe.com/yourlink'
// The link should be configured in your Stripe Dashboard under
// Products → Payment Links. Set a success URL of:
//   https://your-domain.com/?payment=success
// and a cancel URL of:
//   https://your-domain.com/?payment=cancelled
const STRIPE_PAYMENT_LINK = '';
// ────────────────────────────────────────────────────────────────────────────

// State management
let views = parseInt(localStorage.getItem('auro_views') || '0', 10);
const maxFreeViews = 2; // Set to 2 for testing, change to 5 for production

// Subscription helpers
function isSubscribed() {
    return localStorage.getItem('auro_pro') === 'true';
}

function activateSubscription() {
    localStorage.setItem('auro_pro', 'true');
    localStorage.setItem('auro_views', '0');
    views = 0;
    showProBadge();
}

function showProBadge() {
    const badge = document.getElementById('proBadge');
    if (badge) {
        badge.style.display = 'inline-block';
    }
}

// Handle Stripe return URL parameters
function handlePaymentReturn() {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get('payment');

    if (payment === 'success') {
        activateSubscription();
        closePaywall();
        // Clean the URL so refreshing doesn't re-trigger
        window.history.replaceState({}, document.title, window.location.pathname);
        showSuccessMessage();
    } else if (payment === 'cancelled') {
        // Clean the URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

function showSuccessMessage() {
    const msg = document.createElement('div');
    msg.id = 'successToast';
    msg.style.cssText = [
        'position:fixed', 'top:1rem', 'left:50%', 'transform:translateX(-50%)',
        'background:var(--success,#4caf50)', 'color:#fff', 'padding:1rem 2rem',
        'border-radius:8px', 'font-weight:bold', 'z-index:9999',
        'box-shadow:0 4px 12px rgba(0,0,0,0.3)'
    ].join(';');
    msg.textContent = '🎉 Welcome to Pro! Unlimited access unlocked.';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 5000);
}

// All repair guides data
const guides = [
    // GAS VEHICLES
    {
        id: 'gas-oil',
        type: 'gas',
        icon: '🛢️',
        title: 'Oil Change',
        difficulty: 'easy',
        time: '30-45 min',
        parts: '$30-60',
        labor: '$80-120',
        save: '$70-130',
        steps: [
            'Warm engine 2-3 minutes for better oil flow',
            'Remove drain plug and let oil drain 10-15 minutes',
            'Replace oil filter with new one',
            'Refill with correct oil type and quantity',
            'Check for leaks and verify oil level'
        ],
        warning: 'Hot oil can cause burns. Wear gloves and eye protection.'
    },
    {
        id: 'gas-brakes',
        type: 'gas',
        icon: '🛑',
        title: 'Brake Pad Replacement',
        difficulty: 'medium',
        time: '1-2 hours',
        parts: '$40-100',
        labor: '$150-250',
        save: '$160-310',
        steps: [
            'Remove wheel and inspect rotor condition',
            'Remove caliper and hang with bungee cord',
            'Compress caliper piston with C-clamp',
            'Install new brake pads with anti-squeal compound',
            'Reassemble and bed brakes properly'
        ],
        warning: 'Brake dust may contain asbestos. Do not blow with compressed air.'
    },
    // ELECTRIC VEHICLES
    {
        id: 'ev-12v',
        type: 'ev',
        icon: '🔋',
        title: '12V Battery Replacement',
        difficulty: 'easy',
        time: '15-20 min',
        parts: '$150-300',
        labor: '$60-100',
        save: '$60-160',
        steps: [
            'Power down vehicle completely and wait 5 minutes',
            'Locate 12V battery (NOT the high voltage pack)',
            'Disconnect negative terminal first, then positive',
            'Remove hold-down bracket and old battery',
            'Install new AGM battery and reconnect terminals'
        ],
        warning: '⚠️ NEVER touch orange cables. High voltage (400V+) is lethal. This guide covers only the 12V auxiliary battery.'
    },
    {
        id: 'ev-charging',
        type: 'ev',
        icon: '🔌',
        title: 'Charging Port Cleaning',
        difficulty: 'easy',
        time: '10 min',
        parts: '$0-20',
        labor: '$40-60',
        save: '$40-80',
        steps: [
            'Inspect port for debris, corrosion, or damage',
            'Use contact cleaner and soft brush on pins',
            'Apply dielectric grease to prevent corrosion',
            'Test connection with charging cable'
        ],
        warning: 'Never use metal tools in the charging port.'
    },
    // DIESEL VEHICLES
    {
        id: 'diesel-oil',
        type: 'diesel',
        icon: '🛢️',
        title: 'Diesel Oil Change',
        difficulty: 'easy',
        time: '45-60 min',
        parts: '$60-120',
        labor: '$100-150',
        save: '$100-210',
        steps: [
            'Use CJ-4 or CK-4 rated diesel oil only (10+ quarts)',
            'Drain while warm - diesel oil is black normally',
            'Replace both filters if equipped',
            'Prime system before starting',
            'Check for leaks and verify oil pressure'
        ],
        warning: 'Overfilling diesel engine causes catastrophic damage.'
    },
    {
        id: 'diesel-dpf',
        type: 'diesel',
        icon: '🌪️',
        title: 'DPF Regeneration',
        difficulty: 'medium',
        time: '20-40 min',
        parts: '$0',
        labor: '$100-200',
        save: '$100-200',
        steps: [
            'Check DPF warning light - solid means regen needed',
            'Drive at highway speed 40+ MPH for 20+ minutes',
            'Do not interrupt the process',
            'Light will go off when complete',
            'If flashing, service required immediately'
        ],
        warning: 'Frequent short trips clog DPF. Highway driving prevents issues.'
    },
    // HYBRID VEHICLES
    {
        id: 'hybrid-12v',
        type: 'hybrid',
        icon: '🔋',
        title: 'Hybrid 12V Battery',
        difficulty: 'easy',
        time: '20 min',
        parts: '$200-400',
        labor: '$80-120',
        save: '$80-200',
        steps: [
            'Power down and open door to discharge capacitors',
            'Wait 5 minutes before touching battery',
            'Disconnect negative terminal first',
            'Install new AGM battery - regular battery will fail',
            'Reconnect and reset radio/clock if needed'
        ],
        warning: '⚠️ Never touch orange cables. Hybrid systems have lethal voltage.'
    }
];

// Render guides based on filter
function renderGuides(filter = 'all') {
    const container = document.getElementById('guideList');
    container.innerHTML = '';
    
    const filtered = filter === 'all' ? guides : guides.filter(g => g.type === filter);
    
    filtered.forEach(guide => {
        const card = document.createElement('div');
        card.className = 'guide-card';
        card.onclick = () => openGuide(guide);
        card.innerHTML = `
            <div class="guide-title">${guide.icon} ${guide.title}</div>
            <div class="guide-meta">
                <span class="difficulty ${guide.difficulty}">● ${guide.difficulty}</span>
                <span>⏱️ ${guide.time}</span>
                <span style="color: var(--success);">💰 Save ${guide.save}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// Filter guides by type
function filter(type) {
    document.querySelectorAll('.vehicle-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.textContent.toLowerCase().includes(type) || (type === 'all' && btn.textContent === 'All')) {
            btn.classList.add('active');
        }
    });
    renderGuides(type);
}

// Open guide detail view
function openGuide(guide) {
    if (!isSubscribed()) {
        views++;
        localStorage.setItem('auro_views', String(views));
        if (views > maxFreeViews) {
            document.getElementById('paywall').classList.add('active');
            return;
        }
    }
    
    document.getElementById('detailTitle').textContent = guide.title;
    document.getElementById('detailSubtitle').textContent = `${guide.difficulty.toUpperCase()} • ${guide.time}`;
    
    let html = `
        <div class="savings-box">
            <strong>💰 DIY Savings: ${guide.save}</strong><br>
            <span style="color: var(--gray);">Parts: ${guide.parts} | Shop Labor: ${guide.labor}</span>
        </div>
    `;
    
    if(guide.warning) {
        html += `<div class="warning">⚠️ ${guide.warning}</div>`;
    }
    
    html += '<h3 style="margin: 1.5rem 0 1rem;">Step-by-Step Instructions</h3>';
    
    guide.steps.forEach((step, i) => {
        html += `
            <div class="step">
                <strong>Step ${i+1}:</strong> ${step}
            </div>
        `;
    });
    
    html += `
        <div style="text-align: center; margin-top: 2rem;">
            <button class="btn" onclick="closeGuide()">Complete ✓</button>
        </div>
    `;
    
    document.getElementById('detailBody').innerHTML = html;
    document.getElementById('guideDetail').classList.add('active');
}

// Close guide detail view
function closeGuide() {
    document.getElementById('guideDetail').classList.remove('active');
}

// Close paywall
function closePaywall() {
    document.getElementById('paywall').classList.remove('active');
}

// Subscribe handler — redirects to Stripe Payment Link
function subscribe() {
    if (!STRIPE_PAYMENT_LINK) {
        // Developer fallback: no link configured yet
        console.warn('STRIPE_PAYMENT_LINK is not set in app.js');
        alert('Payment link not configured.\n\nSet STRIPE_PAYMENT_LINK in app.js to enable Stripe Checkout.');
        return;
    }

    // Build the full return URLs so Stripe can redirect back
    const base = window.location.href.split('?')[0];
    const successUrl = encodeURIComponent(base + '?payment=success');
    const cancelUrl  = encodeURIComponent(base + '?payment=cancelled');

    // Stripe Payment Links accept ?success_url= and ?cancel_url= query params
    const destination = `${STRIPE_PAYMENT_LINK}?success_url=${successUrl}&cancel_url=${cancelUrl}`;
    window.location.href = destination;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Restore Pro badge if already subscribed
    if (isSubscribed()) {
        showProBadge();
    }

    // Handle Stripe redirect returns (?payment=success / ?payment=cancelled)
    handlePaymentReturn();

    renderGuides();

    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.log('Service Worker registration failed:', err);
        });
    }
});