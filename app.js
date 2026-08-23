'use strict';

let views = 0;
const MAX_FREE_VIEWS = 2; // Set to 2 for testing, change to 5 for production

const guides = [
    // GAS
    {
        id: 'gas-oil', type: 'gas', icon: '🛢️', title: 'Oil Change',
        difficulty: 'easy', time: '30-45 min', parts: '$30-60', labor: '$80-120', save: '$70-130',
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
        id: 'gas-brakes', type: 'gas', icon: '🛑', title: 'Brake Pad Replacement',
        difficulty: 'medium', time: '1-2 hours', parts: '$40-100', labor: '$150-250', save: '$160-310',
        steps: [
            'Remove wheel and inspect rotor condition',
            'Remove caliper and hang with bungee cord',
            'Compress caliper piston with C-clamp',
            'Install new brake pads with anti-squeal compound',
            'Reassemble and bed brakes properly'
        ],
        warning: 'Brake dust may contain asbestos. Do not blow with compressed air.'
    },
    // EV
    {
        id: 'ev-12v', type: 'ev', icon: '🔋', title: '12V Battery Replacement',
        difficulty: 'easy', time: '15-20 min', parts: '$150-300', labor: '$60-100', save: '$60-160',
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
        id: 'ev-charging', type: 'ev', icon: '🔌', title: 'Charging Port Cleaning',
        difficulty: 'easy', time: '10 min', parts: '$0-20', labor: '$40-60', save: '$40-80',
        steps: [
            'Inspect port for debris, corrosion, or damage',
            'Use contact cleaner and soft brush on pins',
            'Apply dielectric grease to prevent corrosion',
            'Test connection with charging cable'
        ],
        warning: 'Never use metal tools in the charging port.'
    },
    // DIESEL
    {
        id: 'diesel-oil', type: 'diesel', icon: '🛢️', title: 'Diesel Oil Change',
        difficulty: 'easy', time: '45-60 min', parts: '$60-120', labor: '$100-150', save: '$100-210',
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
        id: 'diesel-dpf', type: 'diesel', icon: '🌪️', title: 'DPF Regeneration',
        difficulty: 'medium', time: '20-40 min', parts: '$0', labor: '$100-200', save: '$100-200',
        steps: [
            'Check DPF warning light - solid means regen needed',
            'Drive at highway speed 40+ MPH for 20+ minutes',
            'Do not interrupt the process',
            'Light will go off when complete',
            'If flashing, service required immediately'
        ],
        warning: 'Frequent short trips clog DPF. Highway driving prevents issues.'
    },
    // HYBRID
    {
        id: 'hybrid-12v', type: 'hybrid', icon: '🔋', title: 'Hybrid 12V Battery',
        difficulty: 'easy', time: '20 min', parts: '$200-400', labor: '$80-120', save: '$80-200',
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

function renderGuides(filterType) {
    filterType = filterType || 'all';
    const container = document.getElementById('guideList');
    container.innerHTML = '';

    const filtered = filterType === 'all' ? guides : guides.filter(function(g) { return g.type === filterType; });

    filtered.forEach(function(guide) {
        const card = document.createElement('div');
        card.className = 'guide-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'Open guide: ' + guide.title);
        card.addEventListener('click', function() { openGuide(guide); });
        card.addEventListener('keydown', function(e) { if (e.key === 'Enter' || e.key === ' ') { openGuide(guide); } });

        const saveSpan = document.createElement('span');
        saveSpan.style.color = 'var(--success)';
        saveSpan.textContent = '💰 Save ' + guide.save;

        card.innerHTML =
            '<div class="guide-title">' + escapeHtml(guide.icon) + ' ' + escapeHtml(guide.title) + '</div>' +
            '<div class="guide-meta">' +
                '<span class="difficulty ' + escapeHtml(guide.difficulty) + '">● ' + escapeHtml(guide.difficulty) + '</span>' +
                '<span>⏱️ ' + escapeHtml(guide.time) + '</span>' +
            '</div>';

        const saveMeta = document.createElement('span');
        saveMeta.style.color = 'var(--success)';
        saveMeta.textContent = '💰 Save ' + guide.save;
        card.querySelector('.guide-meta').appendChild(saveMeta);

        container.appendChild(card);
    });
}

function filter(type) {
    document.querySelectorAll('.vehicle-btn').forEach(function(btn) {
        btn.classList.remove('active');
        const btnText = btn.textContent.toLowerCase();
        if ((type === 'all' && btn.textContent.trim() === 'All') ||
            (type !== 'all' && btnText.includes(type))) {
            btn.classList.add('active');
        }
    });
    renderGuides(type);
}

function openGuide(guide) {
    views++;
    if (views > MAX_FREE_VIEWS) {
        document.getElementById('paywall').classList.add('active');
        return;
    }

    document.getElementById('detailTitle').textContent = guide.title;
    document.getElementById('detailSubtitle').textContent = guide.difficulty.toUpperCase() + ' • ' + guide.time;

    const body = document.getElementById('detailBody');
    body.innerHTML = '';

    // Savings box
    const savingsBox = document.createElement('div');
    savingsBox.className = 'savings-box';
    savingsBox.innerHTML = '<strong>💰 DIY Savings: ' + escapeHtml(guide.save) + '</strong><br>';
    const savingsDetail = document.createElement('span');
    savingsDetail.style.color = 'var(--gray)';
    savingsDetail.textContent = 'Parts: ' + guide.parts + ' | Shop Labor: ' + guide.labor;
    savingsBox.appendChild(savingsDetail);
    body.appendChild(savingsBox);

    // Warning
    if (guide.warning) {
        const warning = document.createElement('div');
        warning.className = 'warning';
        warning.textContent = '⚠️ ' + guide.warning;
        body.appendChild(warning);
    }

    // Steps heading
    const heading = document.createElement('h3');
    heading.style.cssText = 'margin: 1.5rem 0 1rem;';
    heading.textContent = 'Step-by-Step Instructions';
    body.appendChild(heading);

    // Steps
    guide.steps.forEach(function(step, i) {
        const stepEl = document.createElement('div');
        stepEl.className = 'step';
        const strong = document.createElement('strong');
        strong.textContent = 'Step ' + (i + 1) + ': ';
        stepEl.appendChild(strong);
        stepEl.appendChild(document.createTextNode(step));
        body.appendChild(stepEl);
    });

    // Complete button
    const btnContainer = document.createElement('div');
    btnContainer.className = 'complete-btn-container';
    const completeBtn = document.createElement('button');
    completeBtn.className = 'btn';
    completeBtn.textContent = 'Complete ✓';
    completeBtn.addEventListener('click', closeGuide);
    btnContainer.appendChild(completeBtn);
    body.appendChild(btnContainer);

    document.getElementById('guideDetail').classList.add('active');
}

function closeGuide() {
    document.getElementById('guideDetail').classList.remove('active');
}

function closePaywall() {
    document.getElementById('paywall').classList.remove('active');
    views = MAX_FREE_VIEWS;
}

function subscribe() {
    // Replace STRIPE_PAYMENT_LINK with your actual Stripe Checkout URL
    // e.g. https://buy.stripe.com/your_link
    const stripeLink = '';
    if (stripeLink) {
        window.location.href = stripeLink;
    } else {
        alert('Payment integration coming soon!\n\nIn production, this connects to Stripe Checkout.');
        closePaywall();
        views = 0;
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    renderGuides();

    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(function(err) {
            console.warn('Service worker registration failed:', err);
        });
    }
});
