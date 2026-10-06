/* ────────────────────────────────────────────────────────────────────
 * Footprint map on experience.html (Leaflet).
 *
 * Data model
 *   PLACES  — one map pin per place.
 *   ENTRIES — one timeline row per role; each belongs to a place.
 *   TYPES   — single source of truth for entry colours (timeline dots,
 *             pins and the legend are all generated from it).
 *
 * Basemap: OpenStreetMap standard tiles (free, no API key), visually muted
 * in CSS so the pins stand out.
 * ──────────────────────────────────────────────────────────────────── */
(function () {
    'use strict';

    const TYPES = {
        industry:   { label: 'Industry',   color: '#fb8500' },
        research:   { label: 'Research',   color: '#219ebc' },
        teaching:   { label: 'Teaching',   color: '#8ecae6' },
        internship: { label: 'Internship', color: '#ffb703' },
    };

    // `photo` is optional: a path under img/ shown at the top of the popup.
    const PLACES = {
        mountainView: { name: 'Mountain View, CA, US', latlng: [37.3861, -122.0839] },
        athens:       { name: 'Athens, GA, US',        latlng: [33.9519, -83.3576] },
        beijing:      { name: 'Beijing, China',        latlng: [39.9042, 116.4074] },
        wuhan:        { name: 'Wuhan, China',          latlng: [30.5928, 114.3055] },
    };

    // Newest first; this is also the timeline order.
    const ENTRIES = [
        {
            place: 'mountainView', type: 'industry', period: 'Aug 2026 – Present',
            role: 'Machine Learning Engineer', org: 'Tapestry, Google X',
            desc: 'Working on evaluation of LLM agents.',
        },
        {
            place: 'mountainView', type: 'industry', period: 'May 2025 – Mar 2026',
            role: 'PhD Resident', org: 'Google X',
            desc: 'Built geospatial reasoning agents for electric grid management and geo-aware computer vision models for grid defect detection.',
        },
        {
            place: 'athens', type: 'research', period: 'Jun 2022 – Feb 2024',
            role: 'Research Assistant', org: 'Carl Vinson Institute of Government',
            desc: 'Developed an automatic CAMA data cleaning system. Improved tools for communities addressing heirs property issues in rural and underserved populations.',
        },
        {
            place: 'athens', type: 'teaching', period: '2021 – 2023',
            role: 'Lab Instructor', org: 'University of Georgia',
            desc: 'Taught Introduction to GIS, Programming in GIS, and Geoscience for Health &amp; Environment across 4 semesters in the Department of Geography.',
        },
        {
            place: 'beijing', type: 'internship', period: 'Jun – Sep 2018',
            role: 'Technical Engineer', org: 'Beijing BGS Technology Co., Ltd.',
            desc: 'System design for the Public Transportation Safety Management System; designed the spatial database and published the metadata management module.',
        },
        {
            place: 'wuhan', type: 'internship', period: 'Jul – Sep 2017',
            role: 'Technical Engineer', org: 'Wuhan BGS Technology Co., Ltd.',
            desc: 'Software development and hardware integration for the Call-taking and Dispatch System. Verified spatial data and built upload tools. <strong>Best Intern of the Year.</strong>',
        },
    ];

    const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    const DETAIL_ZOOM = 11;
    const FIT_PADDING = [40, 40];

    // Pick the longitude representation with the shortest east-west span, so
    // places on both sides of the Pacific (e.g. US + China) are framed across
    // the Pacific instead of across the Atlantic. Leaflet accepts lng > 180.
    function unwrapLongitudes(latlngs) {
        const shifted = latlngs.map(function (ll) { return [ll[0], ll[1] < 0 ? ll[1] + 360 : ll[1]]; });
        function span(points) {
            const lngs = points.map(function (ll) { return ll[1]; });
            return Math.max.apply(null, lngs) - Math.min.apply(null, lngs);
        }
        return span(shifted) < span(latlngs) ? shifted : latlngs;
    }

    function entriesAt(placeKey) {
        return ENTRIES.filter(function (e) { return e.place === placeKey; });
    }

    // Pin fill: the single type colour, or an even split when a place mixes types.
    function pinIcon(entries) {
        const colors = Array.from(new Set(entries.map(function (e) { return TYPES[e.type].color; })));
        const step = 100 / colors.length;
        const fill = colors.length === 1
            ? colors[0]
            : 'conic-gradient(' + colors.map(function (c, i) {
                return c + ' ' + (i * step) + '% ' + ((i + 1) * step) + '%';
            }).join(', ') + ')';
        return L.divIcon({
            className: 'exp-pin-icon',
            html: '<span class="exp-pin" style="background:' + fill + '"></span>',
            iconSize: [22, 22],
            iconAnchor: [11, 11],
            popupAnchor: [0, -14],
        });
    }

    function popupHtml(place, entries) {
        const photo = place.photo
            ? '<img src="' + place.photo + '" class="popup-photo" alt="' + place.name + '">'
            : '';
        const items = entries.map(function (e) {
            return '<div class="popup-entry">' +
                '<div class="popup-period"><span class="legend-dot" style="background:' + TYPES[e.type].color + '"></span>' + e.period + '</div>' +
                '<div class="popup-role">' + e.role + '</div>' +
                '<div class="popup-name">' + e.org + '</div>' +
                '<div class="popup-desc">' + e.desc + '</div>' +
                '</div>';
        }).join('');
        return '<div class="exp-popup">' + photo +
            '<div class="popup-body">' +
            '<div class="popup-loc"><i class="fas fa-map-marker-alt"></i> ' + place.name + '</div>' +
            items +
            '</div></div>';
    }

    function buildLegend(legendEl) {
        legendEl.innerHTML = Object.keys(TYPES).map(function (key) {
            const t = TYPES[key];
            return '<div class="legend-item"><span class="legend-dot" style="background:' + t.color + '"></span>' + t.label + '</div>';
        }).join('');
    }

    function buildTimeline(timelineEl, map, markers, showAll) {
        let active = null;
        function setActive(btn) {
            if (active) active.classList.remove('is-active');
            active = btn;
            if (active) active.classList.add('is-active');
        }

        const header = document.createElement('div');
        header.className = 'tl-header';
        header.innerHTML = '<span class="tl-label">Journey</span>' +
            '<button type="button" class="tl-reset">Show all</button>';
        header.querySelector('.tl-reset').addEventListener('click', function () {
            setActive(null);
            map.closePopup();
            showAll();
        });

        const rows = ENTRIES.map(function (e, i) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'tl-entry';
            btn.innerHTML =
                '<span class="tl-dot-col">' +
                    '<span class="tl-dot" style="background:' + TYPES[e.type].color + '"></span>' +
                    (i < ENTRIES.length - 1 ? '<span class="tl-line"></span>' : '') +
                '</span>' +
                '<span class="tl-info">' +
                    '<span class="tl-period">' + e.period + '</span>' +
                    '<span class="tl-role">' + e.role + '</span>' +
                    '<span class="tl-org">' + e.org + '</span>' +
                '</span>';
            btn.addEventListener('click', function () {
                setActive(btn);
                const marker = markers[e.place];
                const target = marker.getLatLng();
                const alreadyThere = map.getZoom() === DETAIL_ZOOM && map.getCenter().distanceTo(target) < 50;
                if (alreadyThere) {
                    marker.openPopup();
                    return;
                }
                map.closePopup();
                map.once('moveend', function () { marker.openPopup(); });
                map.flyTo(target, DETAIL_ZOOM, { duration: 1.2 });
            });
            return btn;
        });

        timelineEl.replaceChildren.apply(timelineEl, [header].concat(rows));
    }

    function init() {
        const mapEl = document.getElementById('experienceMap');
        const timelineEl = document.getElementById('mapTimeline');
        const legendEl = document.getElementById('mapLegend');
        if (!mapEl || !timelineEl || !legendEl || typeof L === 'undefined') return;

        const map = L.map(mapEl, { scrollWheelZoom: false, minZoom: 1 });
        L.tileLayer(TILE_URL, { maxZoom: 18, attribution: TILE_ATTRIBUTION }).addTo(map);

        const keys = Object.keys(PLACES).filter(function (key) { return entriesAt(key).length > 0; });
        const positions = unwrapLongitudes(keys.map(function (key) { return PLACES[key].latlng; }));

        const markers = {};
        keys.forEach(function (key, i) {
            const place = PLACES[key];
            const entries = entriesAt(key);
            markers[key] = L.marker(positions[i], { icon: pinIcon(entries), title: place.name, alt: place.name })
                .bindPopup(popupHtml(place, entries), { maxWidth: 280, className: 'exp-popup-wrap' })
                .addTo(map);
        });

        const allBounds = L.latLngBounds(positions);
        function showAll() { map.flyToBounds(allBounds, { padding: FIT_PADDING, duration: 1.2 }); }

        buildLegend(legendEl);
        buildTimeline(timelineEl, map, markers, showAll);
        map.fitBounds(allBounds, { padding: FIT_PADDING });
    }

    document.addEventListener('DOMContentLoaded', init);
})();
