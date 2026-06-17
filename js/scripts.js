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
    { label: 'Off the Clock', page: 'interests.html' },
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

        // ── Site search (magnifier opens an overlay), shared everywhere ──
        const searchLi = document.createElement('li');
        searchLi.className = 'nav-item theme-toggle-item';
        const searchBtn = document.createElement('button');
        searchBtn.type = 'button';
        searchBtn.id = 'siteSearchBtn';
        searchBtn.className = 'theme-toggle search-btn';
        searchBtn.setAttribute('aria-label', 'Search this site');
        searchBtn.innerHTML = '<i class="fas fa-magnifying-glass"></i>';
        searchLi.appendChild(searchBtn);
        ul.appendChild(searchLi);

        // ── Dark-mode toggle (moon/sun), shared across every page ──
        const themeLi = document.createElement('li');
        themeLi.className = 'nav-item theme-toggle-item';
        const themeBtn = document.createElement('button');
        themeBtn.type = 'button';
        themeBtn.id = 'themeToggle';
        themeBtn.className = 'theme-toggle';
        themeBtn.setAttribute('aria-label', 'Toggle dark mode');
        themeLi.appendChild(themeBtn);
        ul.appendChild(themeLi);

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

    // ── Dark mode: apply, persist, and wire up the toggle ───────────
    // The current theme is already set on <html data-theme> by the inline
    // snippet in each page's <head> (prevents a flash of the wrong theme).
    // Here we just sync the icon and handle clicks.
    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');

    const applyIcon = theme => {
        if (!themeToggle) return;
        themeToggle.innerHTML = theme === 'dark'
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute(
            'title',
            theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
        );
    };

    let theme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', theme);
    applyIcon(theme);

    if (themeToggle) {
        themeToggle.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            theme = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
            root.setAttribute('data-theme', theme);
            try { localStorage.setItem('theme', theme); } catch (err) { /* ignore */ }
            applyIcon(theme);
        });
    }

    // ── Site search ─────────────────────────────────────────────────
    // Client-side, zero-maintenance: on first open we fetch every page
    // in NAV, index each leaf section (heading + text), then search live.
    const searchBtn = document.getElementById('siteSearchBtn');
    if (searchBtn) {
        // Page → display label, from the NAV config (single source of truth)
        const pageLabel = {};
        NAV.forEach(n => { pageLabel[n.page] = n.label; });
        const pages = Object.keys(pageLabel);

        // Build the overlay UI once
        const overlay = document.createElement('div');
        overlay.className = 'site-search-overlay';
        overlay.innerHTML =
            '<div class="ss-panel" role="dialog" aria-modal="true" aria-label="Search">' +
            '  <div class="ss-input-wrap">' +
            '    <i class="fas fa-magnifying-glass ss-input-icon"></i>' +
            '    <input type="text" class="ss-input" placeholder="Search this site…" ' +
            '           autocomplete="off" spellcheck="false" aria-label="Search query" />' +
            '    <button type="button" class="ss-close" aria-label="Close search">esc</button>' +
            '  </div>' +
            '  <div class="ss-results" aria-live="polite"></div>' +
            '</div>';
        document.body.appendChild(overlay);

        const panel = overlay.querySelector('.ss-panel');
        const input = overlay.querySelector('.ss-input');
        const results = overlay.querySelector('.ss-results');
        const closeBtn = overlay.querySelector('.ss-close');

        let index = null;        // built lazily

        const escapeHTML = s => s.replace(/[&<>"']/g, c => (
            { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
        ));

        // Index the leaf-level id'd sections of a live DOM root (the current page).
        const indexLiveDOM = (page, rootEl) => {
            const entries = [];
            if (!rootEl) return entries;
            rootEl.querySelectorAll('[id]').forEach(el => {
                const heading = el.querySelector('h1, h2, h3');
                if (!heading) return;
                // Only index leaf blocks (skip wrappers that contain a deeper
                // id'd section with its own heading) to avoid duplicates.
                let hasInnerSection = false;
                el.querySelectorAll('[id]').forEach(inner => {
                    if (inner.querySelector('h1, h2, h3')) hasInnerSection = true;
                });
                if (hasInnerSection) return;
                const title = heading.textContent.replace(/\s+/g, ' ').trim();
                const text = el.textContent.replace(/\s+/g, ' ').trim();
                entries.push({ page, hash: el.id, title, text });
            });
            return entries;
        };

        // Build the index from the prebuilt static file (works on file:// too),
        // then override the CURRENT page's entries with a fresh live-DOM scan so
        // edits to the page you're on are always reflected without rebuilding.
        const buildIndex = () => {
            if (index) return Promise.resolve(index);
            let base = Array.isArray(window.SEARCH_INDEX) ? window.SEARCH_INDEX.slice() : [];
            const current = document.body.dataset.page || 'index.html';
            const live = indexLiveDOM(current, document.querySelector('.main-content'));
            if (live.length) base = base.filter(e => e.page !== current).concat(live);
            index = base.map(e => ({ ...e, lower: (e.title + ' ' + e.text).toLowerCase() }));
            return Promise.resolve(index);
        };

        // Build a highlighted snippet around the first matched token
        const snippet = (text, tokens) => {
            const lower = text.toLowerCase();
            let pos = -1;
            for (const t of tokens) { const p = lower.indexOf(t); if (p !== -1 && (pos === -1 || p < pos)) pos = p; }
            if (pos === -1) pos = 0;
            const start = Math.max(0, pos - 50);
            let frag = text.slice(start, start + 160);
            if (start > 0) frag = '… ' + frag;
            if (start + 160 < text.length) frag = frag + ' …';
            let out = escapeHTML(frag);
            tokens.forEach(t => {
                if (!t) return;
                const re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
                out = out.replace(re, '<mark>$1</mark>');
            });
            return out;
        };

        const render = (query) => {
            const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
            if (!tokens.length) {
                results.innerHTML = '<div class="ss-hint">Type to search across all pages.</div>';
                return;
            }
            if (!index) {
                results.innerHTML = '<div class="ss-hint">Loading…</div>';
                return;
            }
            const scored = [];
            index.forEach(e => {
                if (!tokens.every(t => e.lower.includes(t))) return;
                let score = 0;
                const tl = e.title.toLowerCase();
                tokens.forEach(t => {
                    if (tl.includes(t)) score += 5;
                    score += (e.lower.split(t).length - 1);
                });
                scored.push({ e, score });
            });
            scored.sort((a, b) => b.score - a.score);
            if (!scored.length) {
                results.innerHTML = '<div class="ss-hint">No matches for “' + escapeHTML(query) + '”.</div>';
                return;
            }
            results.innerHTML = scored.slice(0, 12).map(({ e }) => {
                const href = e.page + (e.hash ? '#' + e.hash : '');
                return '<a class="ss-result" href="' + href + '">' +
                    '<span class="ss-result-page">' + escapeHTML(pageLabel[e.page] || e.page) + '</span>' +
                    '<span class="ss-result-title">' + escapeHTML(e.title) + '</span>' +
                    '<span class="ss-result-snippet">' + snippet(e.text, tokens) + '</span>' +
                    '</a>';
            }).join('');
        };

        let debounce;
        const open = () => {
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            input.value = '';
            render('');
            setTimeout(() => input.focus(), 30);
            buildIndex().then(() => { if (overlay.classList.contains('open')) render(input.value); });
        };
        const close = () => {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        };

        searchBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); open(); });
        closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
        input.addEventListener('input', () => {
            clearTimeout(debounce);
            debounce = setTimeout(() => render(input.value), 120);
        });
        // Clicking a result closes the overlay (so same-page anchor jumps are visible)
        results.addEventListener('click', e => { if (e.target.closest('.ss-result')) close(); });
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && overlay.classList.contains('open')) close();
            // Quick open with "/" when not typing in a field
            if (e.key === '/' && !overlay.classList.contains('open') &&
                !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
                e.preventDefault(); open();
            }
        });
    }

});
