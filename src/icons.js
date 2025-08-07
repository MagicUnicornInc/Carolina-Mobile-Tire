// Icon replacement system
document.addEventListener('DOMContentLoaded', function() {
    // Define emoji to icon class mappings
    const emojiToIcon = {
        '🚗': 'icon-car',
        '🛞': 'icon-tire',
        '🔧': 'icon-wrench',
        '⚙️': 'icon-wrench',
        '📞': 'icon-phone',
        '☎️': 'icon-phone',
        '📍': 'icon-location',
        '📌': 'icon-location',
        '🕐': 'icon-clock',
        '⏰': 'icon-clock',
        '✓': 'icon-check',
        '✅': 'icon-check',
        '⭐': 'icon-star',
        '🌟': 'icon-star',
        '⚠️': 'icon-emergency',
        '🚨': 'icon-emergency',
        '🏪': 'icon-shop',
        '🏢': 'icon-shop',
        '🚐': 'icon-mobile',
        '🚛': 'icon-mobile'
    };

    // Function to replace emoji with icon span
    function replaceEmojis(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent;
            let hasEmoji = false;
            
            // Check if text contains any emoji
            for (const emoji in emojiToIcon) {
                if (text.includes(emoji)) {
                    hasEmoji = true;
                    break;
                }
            }
            
            if (hasEmoji) {
                // Create a temporary container
                const temp = document.createElement('div');
                
                // Replace each emoji with icon span
                for (const [emoji, iconClass] of Object.entries(emojiToIcon)) {
                    text = text.replace(new RegExp(emoji, 'g'), `<span class="${iconClass}"></span>`);
                }
                
                temp.innerHTML = text;
                
                // Replace the text node with the new content
                const fragment = document.createDocumentFragment();
                while (temp.firstChild) {
                    fragment.appendChild(temp.firstChild);
                }
                node.parentNode.replaceChild(fragment, node);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Skip certain elements
            if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE' || node.tagName === 'TEXTAREA' || node.tagName === 'INPUT') {
                return;
            }
            
            // Process child nodes
            const children = Array.from(node.childNodes);
            children.forEach(child => replaceEmojis(child));
        }
    }

    // Replace emojis in specific high-visibility areas
    const targetAreas = [
        '.logo-icon',
        '.feature h3',
        '.service-icon',
        '.showcase-icon',
        '.feature-icon',
        '.info-card h3',
        '.emergency-numbers h3',
        '.hero-badges',
        '.cta-button',
        '.badge'
    ];

    targetAreas.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            replaceEmojis(element);
        });
    });

    // Also update specific icon containers
    document.querySelectorAll('.icon, .service-icon, .showcase-icon, .feature-icon').forEach(element => {
        const text = element.textContent.trim();
        const iconClass = emojiToIcon[text];
        if (iconClass) {
            element.innerHTML = `<span class="${iconClass}"></span>`;
        }
    });

    // Update any standalone emojis in headings
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        let html = heading.innerHTML;
        for (const [emoji, iconClass] of Object.entries(emojiToIcon)) {
            html = html.replace(new RegExp(emoji, 'g'), `<span class="${iconClass}"></span>`);
        }
        if (html !== heading.innerHTML) {
            heading.innerHTML = html;
        }
    });

    // Update navigation items
    document.querySelectorAll('nav a, .cta-button, .emergency-btn').forEach(link => {
        let html = link.innerHTML;
        for (const [emoji, iconClass] of Object.entries(emojiToIcon)) {
            html = html.replace(new RegExp(emoji, 'g'), `<span class="${iconClass}"></span>`);
        }
        if (html !== link.innerHTML) {
            link.innerHTML = html;
        }
    });
});