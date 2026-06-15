/*!
* Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/
//
// Scripts
//

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const topNav = document.body.querySelector('#topNav');
    if (topNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#topNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Initialize navbar collapse (lets Bootstrap's own data-bs-toggle handle clicks)
    const navbarCollapseEl = document.body.querySelector('#navbarResponsive');
    const bsCollapse = navbarCollapseEl
        ? new bootstrap.Collapse(navbarCollapseEl, { toggle: false })
        : null;

    // Initialize all dropdowns explicitly
    document.querySelectorAll('[data-bs-toggle="dropdown"]').forEach(el => {
        new bootstrap.Dropdown(el);
    });

    // Close navbar when a plain nav link is clicked on mobile
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    document.querySelectorAll('#navbarResponsive .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (link.classList.contains('dropdown-toggle')) return;
            if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                bsCollapse && bsCollapse.hide();
            }
        });
    });

});
