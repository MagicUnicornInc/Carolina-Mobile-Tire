// Carolina Tire locations data
const locations = [
    {
        name: 'Charleston Mobile Tire',
        lat: 32.7765,
        lng: -79.9311,
        address: '1971 Maybank Hwy, Charleston, SC 29412',
        phone: '(843) 613-1614',
        type: 'mobile',
        services: 'Mobile Tire Service, 24/7 Emergency'
    },
    {
        name: 'Knoxville Mobile Tire',
        lat: 35.9606,
        lng: -83.9207,
        address: '113 Walker Springs Rd, Knoxville, TN 37923',
        phone: '(865) 333-5454',
        type: 'mobile',
        services: 'Mobile Tire Service, Towing, 24/7 Emergency'
    },
    {
        name: 'Affordable Tire Co - Powell',
        lat: 36.0317,
        lng: -84.0416,
        address: '7444 Clinton Highway, Powell, TN 37849',
        phone: '(865) 973-1318',
        type: 'shop',
        services: 'Full Service Shop, Tires, Auto Repair'
    },
    {
        name: 'Affordable Tire Co - Lenoir City',
        lat: 35.7973,
        lng: -84.2560,
        address: '529 Hwy 321 N, Lenoir City, TN',
        phone: '(865) 973-1318',
        type: 'shop',
        services: 'Full Service Shop, Tires, Auto Repair'
    },
    {
        name: 'Carolina Tire & Service Co',
        lat: 35.9382,
        lng: -77.7905,
        address: '1525 N Wesleyan Blvd, Rocky Mount, NC 27804',
        phone: '(252) 977-7880',
        type: 'shop',
        services: 'Full Service Shop, Complete Auto Care'
    }
];

// Initialize map on home page
if (document.getElementById('main-map')) {
    // Create map centered on southeastern US
    const map = L.map('main-map').setView([34.5, -81.0], 6);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Custom icons
    const mobileIcon = L.divIcon({
        html: '<div style="background: #e74c3c; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🚐</div>',
        iconSize: [30, 30],
        className: 'custom-div-icon'
    });

    const shopIcon = L.divIcon({
        html: '<div style="background: #3498db; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🏪</div>',
        iconSize: [30, 30],
        className: 'custom-div-icon'
    });

    // Add markers for each location
    locations.forEach(location => {
        const icon = location.type === 'mobile' ? mobileIcon : shopIcon;
        const marker = L.marker([location.lat, location.lng], { icon: icon }).addTo(map);
        
        // Popup content
        const popupContent = `
            <div style="text-align: center; min-width: 200px;">
                <h4 style="margin: 0 0 10px 0; color: #2c3e50;">${location.name}</h4>
                <p style="margin: 5px 0; font-size: 0.9em; color: #7f8c8d;">${location.address}</p>
                <p style="margin: 5px 0; font-weight: bold; color: #3498db;">${location.phone}</p>
                <p style="margin: 5px 0; font-size: 0.85em; color: #27ae60;">${location.services}</p>
                <a href="tel:${location.phone.replace(/[^\d]/g, '')}" 
                   style="display: inline-block; margin-top: 10px; padding: 5px 15px; background: #f0c000; color: #1a1a2e; text-decoration: none; border-radius: 20px; font-weight: bold;">
                   Call Now
                </a>
            </div>
        `;
        
        marker.bindPopup(popupContent);
    });

    // Fit map to show all markers
    const group = L.featureGroup(locations.map(loc => L.marker([loc.lat, loc.lng])));
    map.fitBounds(group.getBounds().pad(0.1));
}

// Contact page map functionality
if (document.getElementById('map')) {
    const contactMap = L.map('map').setView([34.5, -81.0], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(contactMap);

    // Custom icons (same as above)
    const mobileIcon = L.divIcon({
        html: '<div style="background: #e74c3c; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🚐</div>',
        iconSize: [30, 30],
        className: 'custom-div-icon'
    });

    const shopIcon = L.divIcon({
        html: '<div style="background: #3498db; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🏪</div>',
        iconSize: [30, 30],
        className: 'custom-div-icon'
    });

    // Add all location markers
    const markers = [];
    locations.forEach(location => {
        const icon = location.type === 'mobile' ? mobileIcon : shopIcon;
        const marker = L.marker([location.lat, location.lng], { icon: icon }).addTo(contactMap);
        
        const popupContent = `
            <div style="text-align: center; min-width: 200px;">
                <h4 style="margin: 0 0 10px 0; color: #2c3e50;">${location.name}</h4>
                <p style="margin: 5px 0; font-size: 0.9em; color: #7f8c8d;">${location.address}</p>
                <p style="margin: 5px 0; font-weight: bold; color: #3498db;">${location.phone}</p>
                <p style="margin: 5px 0; font-size: 0.85em; color: #27ae60;">${location.services}</p>
                <div style="margin-top: 10px;">
                    <a href="tel:${location.phone.replace(/[^\d]/g, '')}" 
                       style="display: inline-block; margin: 5px; padding: 5px 15px; background: #f0c000; color: #1a1a2e; text-decoration: none; border-radius: 20px; font-weight: bold;">
                       Call Now
                    </a>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}" 
                       target="_blank"
                       style="display: inline-block; margin: 5px; padding: 5px 15px; background: #3498db; color: white; text-decoration: none; border-radius: 20px; font-weight: bold;">
                       Get Directions
                    </a>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        markers.push({ marker, location });
    });

    // Fit map to show all markers
    const group = L.featureGroup(locations.map(loc => L.marker([loc.lat, loc.lng])));
    contactMap.fitBounds(group.getBounds().pad(0.1));

    // Handle search functionality
    const searchBtn = document.getElementById('searchBtn');
    const zipSearch = document.getElementById('zipSearch');
    const locationResults = document.getElementById('locationResults');

    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchValue = zipSearch.value.trim();
            if (searchValue) {
                // In a real app, this would geocode the ZIP/city
                // For now, we'll just zoom to the center
                contactMap.setView([34.5, -81.0], 6);
                displayAllLocations();
            }
        });
    }

    // Handle "Use My Location" button
    const useLocationBtn = document.getElementById('useLocation');
    if (useLocationBtn) {
        useLocationBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
                    
                    // Add user marker
                    const userIcon = L.divIcon({
                        html: '<div style="background: #27ae60; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">📍</div>',
                        iconSize: [30, 30],
                        className: 'custom-div-icon'
                    });
                    
                    L.marker([userLat, userLng], { icon: userIcon })
                        .addTo(contactMap)
                        .bindPopup('Your Location')
                        .openPopup();
                    
                    // Center map on user location
                    contactMap.setView([userLat, userLng], 10);
                    
                    // Calculate and display nearest locations
                    const distances = locations.map(loc => {
                        const distance = calculateDistance(userLat, userLng, loc.lat, loc.lng);
                        return { ...loc, distance };
                    }).sort((a, b) => a.distance - b.distance);
                    
                    displayLocationResults(distances);
                });
            }
        });
    }

    function displayAllLocations() {
        const html = locations.map(loc => createLocationCard(loc)).join('');
        if (locationResults) {
            locationResults.innerHTML = html;
        }
    }

    function displayLocationResults(sortedLocations) {
        const html = sortedLocations.map(loc => createLocationCard(loc)).join('');
        if (locationResults) {
            locationResults.innerHTML = html;
        }
    }

    function createLocationCard(loc) {
        return `
            <div class="location-result-card">
                <h4>${loc.name}</h4>
                ${loc.distance ? `<p class="distance">${loc.distance.toFixed(1)} miles away</p>` : ''}
                <p class="address">${loc.address}</p>
                <p class="phone"><strong>Phone:</strong> ${loc.phone}</p>
                <div class="result-actions">
                    <a href="tel:${loc.phone.replace(/[^\d]/g, '')}" class="call-btn">Call Now</a>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}" target="_blank" class="details-btn">Get Directions</a>
                </div>
            </div>
        `;
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
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

    // Display all locations by default
    displayAllLocations();
}