/* ────────────────────────────────────────────────────────────────────
 * Shelf data — shared by index.html (latest 5) and interests.html (full shelf).
 *
 * To add something: put it at the TOP of its list and set `added` to the
 * date you put it on the shelf (YYYY-MM-DD). The homepage automatically
 * shows the 5 most recently added items across books + watching.
 * ──────────────────────────────────────────────────────────────────── */
window.SHELF = (function () {

    // ── Reading ──────────────────────────────────────────────────────
    // Each book: { title, author, added, link?, coverId | isbn | cover, note? }
    //   coverId : Open Library numeric id   (most reliable)
    //   isbn    : 10- or 13-digit ISBN      (auto-looks-up cover)
    //   cover   : full image URL
    const BOOKS = [
        {
            title: 'How Computers Work',
            author: 'Ron White',
            added: '2026-06-17',
            coverId: 7446331,
            link: 'https://www.goodreads.com/book/show/30870.How_Computers_Work'
        },
        {
            title: 'How an Economy Grows and Why It Crashes',
            author: 'Peter & Andrew Schiff',
            added: '2026-06-17',
            coverId: 8769887,
            link: 'https://www.goodreads.com/book/show/7048818-how-an-economy-grows-and-why-it-crashes'
        }
    ];

    // ── Watching ─────────────────────────────────────────────────────
    // Each item: { title, added, year?, kind?, rating?, note?, poster?, link? }
    //   kind   : 'Film' or 'Series' — shown as a badge on the poster
    //   rating : any text, e.g. '★★★★☆'
    const WATCHING = [
        { title: 'Once Upon a Time in the Middle East', added: '2026-09-23', year: '2026', kind: 'Film', poster: 'img/fun/shelf/once-upon-a-time-in-the-middle-east.jpg', link: 'https://www.imdb.com/title/tt34386754/' },
        { title: 'Fleabag — Season 2', added: '2026-08-18', year: '2019', kind: 'Series', poster: 'img/fun/shelf/fleabag-season-2.jpg', link: 'https://www.imdb.com/title/tt7020996/' },
        { title: 'Fleabag — Season 1', added: '2026-08-18', year: '2016', kind: 'Series', poster: 'img/fun/shelf/fleabag-season-1.jpg', link: 'https://www.imdb.com/title/tt5687612/' },
        { title: 'Toy Story 5', added: '2026-06-25', year: 'June 2026', kind: 'Film', poster: 'img/fun/shelf/toy-story-5.jpg', link: 'https://www.imdb.com/title/tt29355505/' },
    ];

    // ── Card builders ────────────────────────────────────────────────
    function coverUrl(b) {
        if (b.cover) return b.cover;
        if (b.coverId) return 'https://covers.openlibrary.org/b/id/' + b.coverId + '-L.jpg';
        if (b.isbn) return 'https://covers.openlibrary.org/b/isbn/' + String(b.isbn).replace(/[^0-9Xx]/g, '') + '-L.jpg';
        return '';
    }
    function coverImg(url, title, what) {
        return url
            ? '<img src="' + url + '" alt="' + title.replace(/"/g, '&quot;') + ' ' + what + '" loading="lazy" ' +
              'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';" />' +
              '<div class="cover-fallback" style="display:none">' + title + '</div>'
            : '<div class="cover-fallback">' + title + '</div>';
    }
    function open(cls, link) {
        const tag = link ? 'a' : 'div';
        const href = link ? ' href="' + link + '" target="_blank" rel="noopener"' : '';
        return { start: '<' + tag + ' class="media-card ' + cls + '"' + href + '>', end: '</' + tag + '>' };
    }

    function bookCard(b) {
        const t = open('media-book', b.link);
        const badge = '<span class="media-badge"><i class="fas fa-book-open"></i></span>';
        return t.start +
            '<div class="media-cover">' + badge + coverImg(coverUrl(b), b.title, 'cover') + '</div>' +
            '<div class="media-title">' + b.title + '</div>' +
            '<div class="media-sub">' + (b.author || '') + '</div>' +
            (b.note ? '<div class="media-note">' + b.note + '</div>' : '') +
            t.end;
    }

    function filmCard(m) {
        const t = open('media-film', m.link);
        const kindIcon = m.kind === 'Series' ? 'fa-tv' : 'fa-film';
        const badge = m.kind ? '<span class="media-badge"><i class="fas ' + kindIcon + '"></i></span>' : '';
        const rating = m.rating ? '<span class="media-rating">' + m.rating + '</span>' : '';
        return t.start +
            '<div class="media-cover">' + badge + coverImg(m.poster, m.title, 'poster') + rating + '</div>' +
            '<div class="media-title">' + m.title + '</div>' +
            '<div class="media-sub">' + (m.year || '') + '</div>' +
            (m.note ? '<div class="media-note">' + m.note + '</div>' : '') +
            t.end;
    }

    // Most recently added items across all lists (ties keep list order).
    function latest(n) {
        const all = []
            .concat(WATCHING.map(function (x, i) { return { item: x, card: filmCard, i: i }; }))
            .concat(BOOKS.map(function (x, i) { return { item: x, card: bookCard, i: WATCHING.length + i }; }));
        all.sort(function (a, b) {
            const d = String(b.item.added || '').localeCompare(String(a.item.added || ''));
            return d !== 0 ? d : a.i - b.i;
        });
        return all.slice(0, n);
    }

    return { books: BOOKS, watching: WATCHING, bookCard: bookCard, filmCard: filmCard, latest: latest };
})();
