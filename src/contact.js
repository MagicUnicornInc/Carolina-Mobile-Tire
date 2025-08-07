// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const locations = {
        charleston: { lat: 32.7765, lng: -79.9311, name: 'Charleston, SC', phone: '(843) 613-1614' },
        knoxville: { lat: 35.9606, lng: -83.9207, name: 'Knoxville, TN', phone: '(865) 333-5454' },
        powell: { lat: 36.0317, lng: -84.0416, name: 'Powell, TN', phone: '(865) 973-1318' },
        'lenoir-city': { lat: 35.7973, lng: -84.2560, name: 'Lenoir City, TN', phone: '(865) 973-1318' },
        'rocky-mount': { lat: 35.9382, lng: -77.7905, name: 'Rocky Mount, NC', phone: '(252) 977-7880' }
    };

    // Handle form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Get submit button and disable it
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Create success message
                const successDiv = document.createElement('div');
                successDiv.className = 'form-success';
                successDiv.style.cssText = 'background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; text-align: center;';
                successDiv.innerHTML = `
                    <h3 style="margin: 0 0 0.5rem 0;">✅ Message Sent Successfully!</h3>
                    <p style="margin: 0 0 1rem 0;">Thank you, ${data.name}! We've received your message and will contact you within 24 hours.</p>
                    <div style="background: #fff; padding: 1rem; border-radius: 6px; text-align: left; max-width: 500px; margin: 0 auto;">
                        <p><strong>Location:</strong> ${data.location || 'Not specified'}</p>
                        <p><strong>Service:</strong> ${data.service || 'General Inquiry'}</p>
                        <p><strong>We'll reach you at:</strong> ${data.email}</p>
                    </div>
                    <p style="margin-top: 1rem; font-size: 0.9rem;">A confirmation email has been sent to ${data.email}</p>
                `;
                
                // Insert success message before form
                form.parentNode.insertBefore(successDiv, form);
                
                // Hide form
                form.style.display = 'none';
                
                // Scroll to success message
                successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Log submission for demo
                console.log('Form submitted:', data);
                console.log('Timestamp:', new Date().toISOString());
                
                // Reset after delay
                setTimeout(() => {
                    form.reset();
                    form.style.display = 'block';
                    successDiv.remove();
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 8000);
            }, 1500);
        });
    }

    // Location finder functionality
    const searchBtn = document.getElementById('searchBtn');
    const useLocationBtn = document.getElementById('useLocation');
    const zipSearch = document.getElementById('zipSearch');
    const locationResults = document.getElementById('locationResults');

    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchValue = zipSearch.value.trim();
            if (searchValue) {
                findNearestLocation(searchValue);
            }
        });
    }

    if (useLocationBtn) {
        useLocationBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    findNearestLocationByCoords(position.coords.latitude, position.coords.longitude);
                }, function(error) {
                    alert('Unable to get your location. Please enter your ZIP code.');
                });
            } else {
                alert('Geolocation is not supported by your browser. Please enter your ZIP code.');
            }
        });
    }

    function findNearestLocation(searchValue) {
        // In a real app, this would use a geocoding API
        // For demo, we'll show all locations
        displayLocationResults();
    }

    function findNearestLocationByCoords(lat, lng) {
        // Calculate distances to all locations
        const distances = Object.entries(locations).map(([key, loc]) => {
            const distance = calculateDistance(lat, lng, loc.lat, loc.lng);
            return { key, ...loc, distance };
        });

        // Sort by distance
        distances.sort((a, b) => a.distance - b.distance);
        
        displayLocationResults(distances);
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        // Haversine formula
        const R = 3959; // Radius of Earth in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    function displayLocationResults(sortedLocations) {
        const results = sortedLocations || Object.entries(locations).map(([key, loc]) => ({ key, ...loc }));
        
        locationResults.innerHTML = results.map(loc => `
            <div class="location-result-card">
                <h4>${loc.name}</h4>
                ${loc.distance ? `<p class="distance">${loc.distance.toFixed(1)} miles away</p>` : ''}
                <p class="phone"><strong>Phone:</strong> ${loc.phone}</p>
                <div class="result-actions">
                    <a href="tel:${loc.phone.replace(/[^\d]/g, '')}" class="call-btn">Call Now</a>
                    <a href="locations/${loc.key}.html" class="details-btn">View Details</a>
                </div>
            </div>
        `).join('');
    }
    
    // Phone number formatting
    const phoneInput = document.querySelector('input[name="phone"], input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            e.target.value = value;
        });
    }
    
    // Email validation
    const emailInput = document.querySelector('input[name="email"], input[type="email"]');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (email && !emailRegex.test(email)) {
                this.style.borderColor = '#e74c3c';
                const errorMsg = this.parentNode.querySelector('.email-error');
                if (!errorMsg) {
                    const error = document.createElement('span');
                    error.className = 'email-error';
                    error.style.cssText = 'color: #e74c3c; font-size: 0.9rem; display: block; margin-top: 0.25rem;';
                    error.textContent = 'Please enter a valid email address';
                    this.parentNode.appendChild(error);
                }
            } else {
                this.style.borderColor = '';
                const errorMsg = this.parentNode.querySelector('.email-error');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
    }
    
    // Service selection enhancement
    const serviceSelect = document.querySelector('select[name="service"]');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            const messageTextarea = document.querySelector('textarea[name="message"]');
            const placeholders = {
                'tire-service': 'Please describe your tire needs (e.g., size, quantity, specific issues)...',
                'repair': 'Please describe the issues you\'re experiencing with your vehicle...',
                'emergency': 'Please describe your emergency and exact location...',
                'quote': 'Please provide details about the services you need quoted...',
                'other': 'How can we help you today?'
            };
            
            if (messageTextarea && placeholders[this.value]) {
                messageTextarea.placeholder = placeholders[this.value];
            }
        });
    }
});