// API URLs - update with your Azure deployed backend URL
const API_BASE_URL = 'https://your-azure-container-app-name.azurecontainerapps.io/api';

document.addEventListener('DOMContentLoaded', function() {
    // Fetch features and pricing plans when the page loads
    fetchFeatures();
    fetchPricingPlans();
});

/**
 * Fetch features from the API and update the UI
 */
async function fetchFeatures() {
    try {
        const response = await fetch(`${API_BASE_URL}/features`);
        if (!response.ok) {
            throw new Error('Failed to fetch features');
        }
        
        const features = await response.json();
        updateFeaturesUI(features);
    } catch (error) {
        console.error('Error fetching features:', error);
        // Optionally display an error message to the user
    }
}

/**
 * Update the UI with the fetched features
 */
function updateFeaturesUI(features) {
    const featuresContainer = document.getElementById('features');
    if (!featuresContainer) return;
    
    // Clear existing content
    featuresContainer.innerHTML = '';
    
    // Create rows of 3 features each
    let currentRow;
    
    features.forEach((feature, index) => {
        // Create a new row for every 3 features
        if (index % 3 === 0) {
            currentRow = document.createElement('div');
            currentRow.className = 'row g-4';
            featuresContainer.appendChild(currentRow);
        }
        
        // Create the feature column
        const featureCol = document.createElement('div');
        featureCol.className = 'col-md-4 text-center';
        featureCol.innerHTML = `
            <img src="${feature.image_url}" alt="${feature.title}" width="48" />
            <h5 class="mt-3">${feature.title}</h5>
            <p>${feature.description}</p>
        `;
        
        currentRow.appendChild(featureCol);
    });
}

/**
 * Fetch pricing plans from the API and update the UI
 */
async function fetchPricingPlans() {
    try {
        const response = await fetch(`${API_BASE_URL}/pricing-plans`);
        if (!response.ok) {
            throw new Error('Failed to fetch pricing plans');
        }
        
        const pricingPlans = await response.json();
        updatePricingTableUI(pricingPlans);
        updatePricingCardsUI(pricingPlans);
    } catch (error) {
        console.error('Error fetching pricing plans:', error);
        // Optionally display an error message to the user
    }
}

/**
 * Update the pricing table UI with the fetched pricing plans
 */
function updatePricingTableUI(pricingPlans) {
    const tableBody = document.querySelector('#pricing table tbody');
    if (!tableBody) return;
    
    // Clear existing content
    tableBody.innerHTML = '';
    
    // Add each pricing plan to the table
    pricingPlans.forEach(plan => {
        // Skip plans that are meant for cards display (packages section)
        if (plan.name === 'Basic Flexible Workspace' || plan.name === 'Resident Dedicated Desk') {
            return;
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${plan.name}</td>
            <td>${plan.description}</td>
            <td>€${parseFloat(plan.price).toFixed(2)}</td>
            <td>${plan.details}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * Update the pricing cards UI with the fetched pricing plans
 */
function updatePricingCardsUI(pricingPlans) {
    const packagesContainer = document.querySelector('.row.justify-content-center.g-4');
    if (!packagesContainer) return;
    
    // Clear existing content
    packagesContainer.innerHTML = '';
    
    // Filter for featured package plans
    const packagePlans = pricingPlans.filter(plan => 
        plan.name === 'Basic Flexible Workspace' || 
        plan.name === 'Resident Dedicated Desk' ||
        plan.name === 'Private Office'  // Assuming this is the Enterprise/Team option
    );
    
    // Add each pricing plan card
    packagePlans.forEach(plan => {
        const cardCol = document.createElement('div');
        cardCol.className = 'col-md-4 mb-4';
        
        // Determine if this plan should be highlighted as popular
        const popularClass = plan.is_popular ? ' border-primary popular-plan' : ' border-accent';
        
        // Format the price display
        let priceDisplay = `€${parseFloat(plan.price).toFixed(0)}`;
        
        // Special case for the Resident Dedicated Desk which had a range in the original
        if (plan.name === 'Resident Dedicated Desk') {
            priceDisplay = '€270–€360';
        }
        
        // Special case for the Enterprise/Team (Private Office)
        let displayName = plan.name;
        if (plan.name === 'Private Office') {
            displayName = 'Enterprise/Team';
            priceDisplay = `from €${parseFloat(plan.price).toFixed(0)}`;
        }
        
        cardCol.innerHTML = `
            <div class="card h-100 shadow-sm${popularClass}">
                ${plan.is_popular ? '<div class="card-header bg-primary text-white text-center py-2">Popular Choice</div>' : ''}
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title text-center fw-bold">${displayName}</h5>
                    <h6 class="card-price text-center mb-3">${priceDisplay}<span class="text-muted fs-6">/month</span></h6>
                    <ul class="text-center list-unstyled mb-4">
                        ${plan.details.split(',').map(detail => `<li>${detail.trim()}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        packagesContainer.appendChild(cardCol);
    });
}
