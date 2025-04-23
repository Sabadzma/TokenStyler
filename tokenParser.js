/**
 * Token Parser - Parses design tokens from tokens.json file
 * Generates CSS variables based on semantic tokens and applies them to :root
 */
class TokenParser {
    constructor() {
        this.tokens = null;
        this.semanticTokens = null;
        this.cssVariables = {};
    }

    /**
     * Loads and parses the tokens.json file
     * @returns {Promise} - Promise that resolves when tokens are loaded
     */
    async loadTokens() {
        try {
            const response = await fetch('tokens.json');
            if (!response.ok) {
                throw new Error(`Failed to load tokens: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            this.tokens = data.tokens;
            this.semanticTokens = this.tokens.semantic;
            
            // Process and generate CSS variables
            this.processTokens();
            this.applyCssVariables();
            
            return this.tokens;
        } catch (error) {
            console.error('Error loading tokens:', error);
            this.handleTokenError();
        }
    }

    /**
     * Process tokens and resolve references
     */
    processTokens() {
        // Process semantic color tokens
        if (this.semanticTokens && this.semanticTokens.color) {
            this.processColorTokens(this.semanticTokens.color);
        }
    }

    /**
     * Process color tokens and their nested properties
     * @param {Object} colorTokens - Color token object
     * @param {String} prefix - CSS variable prefix
     */
    processColorTokens(colorTokens, prefix = 'color') {
        for (const category in colorTokens) {
            const categoryTokens = colorTokens[category];
            
            for (const key in categoryTokens) {
                const token = categoryTokens[key];
                const variableName = `--${prefix}-${category}-${key}`;
                
                if (typeof token === 'object' && token !== null) {
                    if (token.value) {
                        // Store direct value
                        this.cssVariables[variableName] = token.value;
                    }
                    
                    // Process nested tokens
                    this.processColorTokens(token, `${prefix}-${category}`);
                } else {
                    // Direct value
                    this.cssVariables[variableName] = token;
                }
            }
        }
    }

    /**
     * Apply CSS variables to :root element
     */
    applyCssVariables() {
        const root = document.documentElement;
        
        for (const [variable, value] of Object.entries(this.cssVariables)) {
            root.style.setProperty(variable, value);
        }
        
        console.log('Applied CSS variables:', this.cssVariables);
    }

    /**
     * Handle token loading errors
     */
    handleTokenError() {
        // Set default fallback values if tokens fail to load
        const root = document.documentElement;
        
        // Apply fallback styles from the CSS
        console.warn('Using fallback token values due to loading error');
        
        // Show error message to user
        const container = document.querySelector('.container');
        if (container) {
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('error-message');
            errorMessage.textContent = 'Failed to load design tokens. Using fallback values.';
            errorMessage.style.backgroundColor = 'var(--color-background-negative)';
            errorMessage.style.color = 'var(--color-text-light)';
            errorMessage.style.padding = '10px';
            errorMessage.style.borderRadius = '5px';
            errorMessage.style.marginBottom = '20px';
            
            container.prepend(errorMessage);
        }
    }

    /**
     * Watch for changes to tokens.json file (for development purposes)
     * In a real app, this would be implemented differently with server-side support
     */
    watchForChanges() {
        // This is a simplified version for demonstration
        // In a real application, you would use a server-side solution or websockets
        setInterval(() => {
            this.loadTokens();
            console.log('Checking for token updates...');
        }, 3000); // Check every 3 seconds
    }
}

// Create a global instance
const tokenParser = new TokenParser();
