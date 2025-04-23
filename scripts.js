/**
 * Main Application Scripts
 * Initializes the token parser and sets up the chart
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize token parser - load tokens immediately on page load
    tokenParser.loadTokens().then(() => {
        console.log('Tokens loaded successfully');
        
        // Set up dynamic chart
        setupChart();
        
        // Set random heights for the chart bars for visual interest
        randomizeChartBars();
    }).catch(error => {
        console.error('Failed to initialize:', error);
    });
    
    // In development mode, watch for token changes
    tokenParser.watchForChanges();
});

/**
 * Set up the chart with animation
 */
function setupChart() {
    const bars = document.querySelectorAll('.chart .bar');
    
    // Animate bars on load
    bars.forEach((bar, index) => {
        const originalHeight = bar.style.height || getComputedStyle(bar).height;
        
        // Start with zero height
        bar.style.height = '0';
        bar.style.transition = 'height 1s ease-in-out';
        
        // Animate to actual height with delay based on index
        setTimeout(() => {
            bar.style.height = originalHeight;
        }, index * 100);
    });
}

/**
 * Randomize chart bar heights for visual interest
 */
function randomizeChartBars() {
    const bars = document.querySelectorAll('.chart .bar');
    
    bars.forEach(bar => {
        const height = Math.floor(Math.random() * 70) + 30; // Random height between 30% and 100%
        bar.style.height = `${height}%`;
    });
}

/**
 * Handle button clicks
 */
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn')) {
        // Add a simple click effect
        event.target.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            event.target.style.transform = 'scale(1)';
        }, 200);
    }
    
    if (event.target.closest('.play-button')) {
        const playButton = event.target.closest('.play-button');
        
        // Toggle active state
        playButton.classList.toggle('active');
        
        // In a real app, this would play/pause audio
        console.log('Play button clicked');
    }
});

/**
 * Handle window resize events
 */
window.addEventListener('resize', () => {
    // Adjust layout if needed
    const width = window.innerWidth;
    
    if (width < 768) {
        // Mobile layout adjustments
        console.log('Mobile layout applied');
    } else {
        // Desktop layout adjustments
        console.log('Desktop layout applied');
    }
});
