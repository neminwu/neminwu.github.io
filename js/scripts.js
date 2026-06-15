/*!
* Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*
* Multi-page navigation: the navbar is generated from a single NAV config so
* every subpage shares one source of truth. Dropdown sub-items link directly
* to "<page>#<section>" so each sub-heading opens that part of its tab.
*/

// ── Single source of truth for the whole site's navigation ──────────
const NAV = [
    { label: 'About', page: 'index.html' },
    {
        label: 'Experience', page: 'experience.html',
        children: [
            { label: 'Education', hash: 'education' },
            { label: 'Teaching Experience', hash: 'teaching' },
            { label: 'Industry Experience', hash: 'industry' },
            { label: 'Footprint', hash: 'footprint' },
        ]
    },
    {
        label: 'Research', page: 'research.html',
        children: [
            { label: 'Selected Publications', hash: 'selected-publications' },
            { label: 'Manuscripts', hash: 'manuscripts' },
            { label: 'Presentations & Talks', hash: 'presentations' },
        ]
    },
    { label: 'Awards', page: 'awards.html' },
    { label: 'Passions', page: 'interests.html' },
];

window.addEventListener('DOMContentLoaded', () => {

    // ── Build the navbar into #navInner ─────────────────────────────
    const inner = document.getElementById('navInner');
    if (inner) {
        const current = (document.body.dataset.page || 'index.html');

        const ul = document.createElement('ul');
        ul.className = 'navbar-nav ms-auto';

        NAV.forEach(item => {
            const li = document.createElement('li');
            const isActive = item.page === current;

            if (item.children && item.children.length) {
                li.className = 'nav-item dropdown';
                const a = document.createElement('a');
                a.className = 'nav-link dropdown-toggle' + (isActive ? ' active' : '');
                a.href = item.page;
                a.textContent = item.label;
                li.appendChild(a);

                const menu = document.createElement('ul');
                menu.className = 'dropdown-menu';
                item.children.forEach(c => {
                    const cli = document.createElement('li');
                    const ca = document.createElement('a');
                    ca.className = 'dropdown-item';
                    ca.href = item.page + '#' + c.hash;
                    ca.textContent = c.label;
                    cli.appendChild(ca);
                    menu.appendChild(cli);
                });
                li.appendChild(menu);
            } else {
                li.className = 'nav-item';
                const a = document.createElement('a');
                a.className = 'nav-link' + (isActive ? ' active' : '');
                a.href = item.page;
                a.textContent = item.label;
                li.appendChild(a);
            }
            ul.appendChild(li);
        });

        inner.innerHTML =
            '<a class="navbar-brand" href="index.html">Nemin Wu</a>' +
            '<button class="navbar-toggler" type="button" ' +
            'aria-controls="navbarResponsive" aria-expanded="false" ' +
            'aria-label="Toggle navigation">' +
            '<span class="navbar-toggler-icon"></span></button>' +
            '<div class="collapse navbar-collapse" id="navbarResponsive"></div>';
        inner.querySelector('#navbarResponsive').appendChild(ul);
    }

    // ── Mobile menu toggle ──────────────────────────────────────────
    // Handled manually (no dependency on Bootstrap's JS) so the hamburger
    // always works on the dynamically-built navbar. Toggling `.show` is all
    // Bootstrap's collapse CSS needs to reveal the menu.
    const navbarCollapseEl = document.getElementById('navbarResponsive');
    const navbarToggler = document.querySelector('.navbar-toggler');

    const isMobile = () => navbarToggler &&
        window.getComputedStyle(navbarToggler).display !== 'none';
    const closeMenu = () => {
        if (navbarCollapseEl) navbarCollapseEl.classList.remove('show');
        if (navbarToggler) navbarToggler.setAttribute('aria-expanded', 'false');
    };

    if (navbarToggler && navbarCollapseEl) {
        navbarToggler.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            const open = navbarCollapseEl.classList.toggle('show');
            navbarToggler.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }

    // Desktop: hover reveals the dropdown (CSS); a click on the toggle
    // navigates to the tab's own page. Mobile: every sub-item is shown in
    // the open menu, so tapping any link closes the menu and navigates.
    document.querySelectorAll('#navbarResponsive .nav-link, #navbarResponsive .dropdown-item').forEach(link => {
        link.addEventListener('click', () => { if (isMobile()) closeMenu(); });
    });

    // Tap outside the navbar closes the open mobile menu
    document.addEventListener('click', e => {
        if (isMobile() && !e.target.closest('#topNav')) closeMenu();
    });

});
