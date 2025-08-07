// Schedule form backend simulation
document.addEventListener('DOMContentLoaded', function() {
    const scheduleForm = document.getElementById('scheduleForm');
    
    if (scheduleForm) {
        // Add backend simulation to existing form
        const originalSubmitHandler = scheduleForm.onsubmit;
        
        scheduleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all required fields
            if (!selectedDate || !selectedTime) {
                alert('Please select a date and time for your appointment.');
                return;
            }
            
            // Get all form data
            const formData = new FormData(scheduleForm);
            const appointmentData = {
                location: formData.get('location'),
                services: Array.from(formData.getAll('services')),
                serviceNotes: formData.get('service-notes'),
                date: selectedDate.toLocaleDateString(),
                time: selectedTime,
                vehicle: {
                    year: formData.get('year'),
                    make: formData.get('make'),
                    model: formData.get('model'),
                    mileage: formData.get('mileage'),
                    vin: formData.get('vin')
                },
                contact: {
                    firstName: formData.get('first-name'),
                    lastName: formData.get('last-name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    specialRequests: formData.get('special-requests')
                },
                timestamp: new Date().toISOString(),
                confirmationNumber: 'CT' + Date.now().toString().slice(-8)
            };
            
            // Simulate backend processing
            const submitButton = scheduleForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                // Create confirmation page
                const confirmationHTML = `
                    <div style="max-width: 800px; margin: 0 auto; padding: 2rem;">
                        <div style="background: #d4edda; border: 1px solid #c3e6cb; border-radius: 10px; padding: 2rem; margin-bottom: 2rem; text-align: center;">
                            <h2 style="color: #155724; margin: 0 0 1rem 0;">✅ Appointment Scheduled Successfully!</h2>
                            <p style="color: #155724; font-size: 1.1rem; margin: 0;">Confirmation #: <strong>${appointmentData.confirmationNumber}</strong></p>
                        </div>
                        
                        <div style="background: white; border-radius: 10px; padding: 2rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <h3 style="color: #2c3e50; margin-bottom: 1.5rem;">Appointment Details</h3>
                            
                            <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
                                <div style="padding: 1rem; background: #f8f9fa; border-radius: 6px;">
                                    <strong>Location:</strong><br>
                                    ${document.querySelector(`input[name="location"]:checked`).parentElement.querySelector('.location-name').textContent}
                                </div>
                                
                                <div style="padding: 1rem; background: #f8f9fa; border-radius: 6px;">
                                    <strong>Date & Time:</strong><br>
                                    ${appointmentData.date} at ${appointmentData.time}
                                </div>
                                
                                <div style="padding: 1rem; background: #f8f9fa; border-radius: 6px;">
                                    <strong>Vehicle:</strong><br>
                                    ${appointmentData.vehicle.year} ${appointmentData.vehicle.make} ${appointmentData.vehicle.model}
                                    ${appointmentData.vehicle.mileage ? `<br>Mileage: ${appointmentData.vehicle.mileage}` : ''}
                                </div>
                                
                                <div style="padding: 1rem; background: #f8f9fa; border-radius: 6px;">
                                    <strong>Services Requested:</strong><br>
                                    ${appointmentData.services.map(s => {
                                        const label = document.querySelector(`input[value="${s}"]`).parentElement.querySelector('.service-name').textContent;
                                        return label;
                                    }).join(', ') || 'None selected'}
                                    ${appointmentData.serviceNotes ? `<br><em>${appointmentData.serviceNotes}</em>` : ''}
                                </div>
                                
                                <div style="padding: 1rem; background: #f8f9fa; border-radius: 6px;">
                                    <strong>Contact Information:</strong><br>
                                    ${appointmentData.contact.firstName} ${appointmentData.contact.lastName}<br>
                                    ${appointmentData.contact.email}<br>
                                    ${appointmentData.contact.phone}
                                </div>
                            </div>
                            
                            <div style="background: #e8f5e9; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; text-align: center;">
                                <h4 style="color: #2e7d32; margin: 0 0 0.5rem 0;">🎉 Online Booking Discount Applied!</h4>
                                <p style="color: #388e3c; font-size: 1.2rem; margin: 0;">You'll save 10% on your service</p>
                            </div>
                            
                            <div style="background: #fff3cd; border: 1px solid #ffeeba; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                                <h4 style="color: #856404; margin: 0 0 0.5rem 0;">What's Next?</h4>
                                <ul style="color: #856404; margin: 0; padding-left: 1.5rem;">
                                    <li>A confirmation email has been sent to ${appointmentData.contact.email}</li>
                                    <li>We'll call you within 24 hours to confirm your appointment</li>
                                    <li>If you need to reschedule, please call the location directly</li>
                                    <li>Arrive 10 minutes early for paperwork</li>
                                </ul>
                            </div>
                            
                            <div style="text-align: center;">
                                <button onclick="window.print()" style="background: #6c757d; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 6px; cursor: pointer; margin-right: 1rem;">
                                    🖨️ Print Confirmation
                                </button>
                                <a href="index.html" style="background: #e74c3c; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 6px; display: inline-block;">
                                    Return to Home
                                </a>
                            </div>
                        </div>
                        
                        <div style="margin-top: 2rem; text-align: center; color: #666;">
                            <p>Questions? Call us at the location you selected.</p>
                            <p style="font-size: 0.9rem;">This appointment was booked on ${new Date().toLocaleString()}</p>
                        </div>
                    </div>
                `;
                
                // Replace form container with confirmation
                const scheduleContainer = document.querySelector('.schedule-container');
                scheduleContainer.innerHTML = confirmationHTML;
                
                // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Log appointment data
                console.log('Appointment scheduled:', appointmentData);
                
                // Store in localStorage for demo
                const appointments = JSON.parse(localStorage.getItem('carolinaTireAppointments') || '[]');
                appointments.push(appointmentData);
                localStorage.setItem('carolinaTireAppointments', JSON.stringify(appointments));
                
                // Send analytics event (if analytics are set up)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'appointment_scheduled', {
                        'event_category': 'engagement',
                        'event_label': appointmentData.location,
                        'value': appointmentData.services.length
                    });
                }
            }, 2000);
        });
    }
});