/*!
* Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/
//
// Scripts
//

window.addEventListener('DOMContentLoaded', () => {

    // ── Dropdown menus (manual) ──────────────────────────────────
    // Wired up FIRST and with no dependency on Bootstrap's JS, so even if
    // the Bootstrap CDN fails to load the Experience / Research sub-menus
    // still expand. Clicking a toggle adds `.show` -> CSS reveals the menu.
    const closeAllDropdowns = () => {
        document.querySelectorAll('#topNav .dropdown-menu.show').forEach(m => {
            m.classList.remove('show');
            const t = m.closest('.nav-item')?.querySelector('.dropdown-toggle');
            if (t) t.setAttribute('aria-expanded', 'false');
        });
    };

    document.querySelectorAll('#topNav .nav-item.dropdown').forEach(item => {
        const toggle = item.querySelector('.dropdown-toggle');
        const menu   = item.querySelector('.dropdown-menu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            const isOpen = menu.classList.contains('show');
            closeAllDropdowns();              // collapse any other open menu
            if (!isOpen) {
                menu.classList.add('show');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Close open dropdowns when clicking anywhere outside the navbar
    document.addEventListener('click', e => {
        if (!e.target.closest('#topNav')) closeAllDropdowns();
    });

    // ── Bootstrap-powered extras (guarded) ───────────────────────
    // Scrollspy + the mobile collapse are nice-to-haves; wrap them so a
    // missing/blocked Bootstrap bundle can never stop the code above.
    const hasBootstrap = typeof bootstrap !== 'undefined';

    if (hasBootstrap && document.body.querySelector('#topNav')) {
        try {
            new bootstrap.ScrollSpy(document.body, {
                target: '#topNav',
                rootMargin: '0px 0px -40%',
            });
        } catch (err) { /* non-critical */ }
    }

    const navbarCollapseEl = document.body.querySelector('#navbarResponsive');
    const navbarToggler    = document.body.querySelector('.navbar-toggler');
    const bsCollapse = (hasBootstrap && navbarCollapseEl)
        ? new bootstrap.Collapse(navbarCollapseEl, { toggle: false })
        : null;

    // Close the mobile navbar when a plain (non-dropdown) nav-link is clicked
    document.querySelectorAll('#navbarResponsive .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (link.classList.contains('dropdown-toggle')) return;
            if (bsCollapse && navbarToggler &&
                window.getComputedStyle(navbarToggler).display !== 'none') {
                bsCollapse.hide();
            }
        });
    });

});
