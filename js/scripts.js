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

    // Explicitly initialize Bootstrap Collapse and wire up the toggler
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const navbarCollapseEl = document.body.querySelector('#navbarResponsive');
    let bsCollapse = null;
    if (navbarCollapseEl) {
        bsCollapse = new bootstrap.Collapse(navbarCollapseEl, { toggle: false });
    }
    if (navbarToggler && bsCollapse) {
        navbarToggler.addEventListener('click', () => bsCollapse.toggle());
    }

    // Close navbar when a nav link is clicked (mobile)
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (responsiveNavItem.classList.contains('dropdown-toggle')) return;
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                bsCollapse.hide();
            }
        });
    });

});
