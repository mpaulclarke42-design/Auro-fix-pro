// State management
let views = 0;
const maxFreeViews = 2; // Set to 2 for testing, change to 5 for production

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
    views++;
    if(views > maxFreeViews) {
        document.getElementById('paywall').classList.add('active');
        return;
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
    views = maxFreeViews; // Reset so they can continue browsing
}

// Subscribe handler (integrate with Stripe)
function subscribe() {
    // TODO: Replace with your Stripe payment link
    // Example: window.location.href = 'https://checkout.stripe.com/pay/YOUR_PAYMENT_LINK_HERE';
    alert('In production, this connects to Stripe Checkout\n\nFor now, clicking OK simulates subscription');
    closePaywall();
    views = 0; // Reset counter for pro users
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderGuides();

    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.log('Service Worker registration failed:', err);
        });
    }
});