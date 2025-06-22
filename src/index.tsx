document.addEventListener('DOMContentLoaded', () => {
    const pageTargets = document.querySelectorAll('[data-target]');
    const pageContents = document.querySelectorAll('.page-content');
    const headerNavLinks = document.querySelectorAll('header .nav-header-link'); // Specific to header for active styling

    function showPage(targetId: string) {
        // Hide all page content sections
        pageContents.forEach(content => {
            const contentElement = content as HTMLElement;
            if (contentElement.id === targetId) {
                contentElement.classList.remove('hidden');
            } else {
                contentElement.classList.add('hidden');
            }
        });

        // Update active link styling in header
        headerNavLinks.forEach(link => {
            const linkElement = link as HTMLElement;
            // Ensure dataset.target exists before comparing
            if (linkElement.dataset.target === targetId) {
                linkElement.classList.remove('text-gray-300', 'hover:text-white');
                linkElement.classList.add('text-white', 'font-semibold');
            } else {
                linkElement.classList.remove('text-white', 'font-semibold');
                linkElement.classList.add('text-gray-300', 'hover:text-white');
            }
        });
        
        // Scroll to top of page
        window.scrollTo(0, 0);
    }

    pageTargets.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const currentTarget = event.currentTarget as HTMLElement;
            const targetId = currentTarget.dataset.target;
            
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement && targetElement.classList.contains('page-content')) {
                     showPage(targetId);
                     // Optionally update URL hash
                     // window.location.hash = targetId.replace('page-', '');
                } else {
                    console.warn(`Target element with id "${targetId}" not found or not a page-content.`);
                }
            }
        });
    });

    // Determine initial page to show.
    let initialPageId = 'page-home'; // Default to 'page-home'.
    
    if (window.location.hash) {
        const hash = window.location.hash.substring(1); // Remove #
        // Ensure hash is not empty and forms a valid page ID
        if (hash) {
            const potentialPageId = `page-${hash}`;
            if (document.getElementById(potentialPageId)) {
                initialPageId = potentialPageId;
            }
        }
    }
    
    // Ensure the determined initialPageId exists before trying to show it.
    if (document.getElementById(initialPageId)) {
        showPage(initialPageId);
    } else {
        // Fallback if the initialPageId (e.g., from hash or default) doesn't exist
        // This case should ideally not happen if 'page-home' always exists.
        console.warn(`Initial page "${initialPageId}" not found. Defaulting to first available page-content or none.`);
        const firstPage = document.querySelector('.page-content');
        if (firstPage) {
            showPage(firstPage.id);
        }
    }
});
