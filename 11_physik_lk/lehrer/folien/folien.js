// Gemeinsames Navigations-Skript für alle Foliensätze
(function () {
    var deck = document.getElementById("deck");
    var slides = Array.prototype.slice.call(deck.querySelectorAll(".slide"));
    var current = 0;

    function show(i) {
        if (i < 0) i = 0;
        if (i >= slides.length) i = slides.length - 1;
        slides[current].classList.remove("active");
        current = i;
        slides[current].classList.add("active");
        document.getElementById("progress").style.width =
            ((current + 1) / slides.length) * 100 + "%";
        document.getElementById("counter").textContent =
            (current + 1) + " / " + slides.length;
        updateNavButtons();
        // Auf der Übersichtsfolie keine Klickzonen am Rand - dort liegen Karten.
        document.body.classList.toggle("ohne-zonen",
            slides[current].getAttribute("data-type") === "uebersicht");
        location.hash = "s" + (current + 1);
    }

    // Übersicht als Overlay (wie die Foliensatz-Engine im Informatik-LK):
    // O, Esc oder ☰ blenden sie ein und aus, ein Klick auf einen Eintrag
    // springt dorthin und schließt sie.
    function uebersicht(an) {
        document.body.classList.toggle("zeige-uebersicht", an);
    }
    var ov = document.getElementById("uebersicht-overlay");
    var ovLink = document.getElementById("overview-link");
    if (ovLink && ov) {
        ovLink.addEventListener("click", function (e) {
            e.preventDefault();
            uebersicht(!document.body.classList.contains("zeige-uebersicht"));
        });
        ov.addEventListener("click", function (e) {
            if (e.target.closest && e.target.closest('a[href^="#s"]')) uebersicht(false);
        });
    }

    function next() { show(current + 1); }
    function prev() { show(current - 1); }

    function updateNavButtons() {
        var btnPrev = document.getElementById("btn-prev");
        var btnNext = document.getElementById("btn-next");
        if (btnPrev) btnPrev.disabled = current === 0;
        if (btnNext) btnNext.disabled = current === slides.length - 1;
    }

    document.addEventListener("keydown", function (e) {
        if (ov && (e.key === "o" || e.key === "O" || e.key === "Escape")) {
            uebersicht(!document.body.classList.contains("zeige-uebersicht"));
            e.preventDefault();
            return;
        }
        // H: zurück zu allen Foliensätzen (index.html)
        if (e.key === "h" || e.key === "H") { location.href = "index.html"; return; }
        if (document.body.classList.contains("zeige-uebersicht")) return;
        if (["ArrowRight", "ArrowDown", "PageDown", " "].indexOf(e.key) !== -1) { next(); e.preventDefault(); }
        else if (["ArrowLeft", "ArrowUp", "PageUp"].indexOf(e.key) !== -1) { prev(); e.preventDefault(); }
        else if (e.key === "Home") { show(0); e.preventDefault(); }
        else if (e.key === "End") { show(slides.length - 1); e.preventDefault(); }
        else if (e.key === "f" || e.key === "F11") {
            if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); }
        }
    });

    // Tafelbild: Klick auf eine Lücke deckt sie auf (und wieder zu).
    deck.addEventListener("click", function (e) {
        var l = e.target.closest && e.target.closest(".luecke");
        if (l) l.classList.toggle("offen");
    });

    document.getElementById("zone-prev").addEventListener("click", prev);
    document.getElementById("zone-next").addEventListener("click", next);

    var btnPrevEl = document.getElementById("btn-prev");
    var btnNextEl = document.getElementById("btn-next");
    if (btnPrevEl) btnPrevEl.addEventListener("click", prev);
    if (btnNextEl) btnNextEl.addEventListener("click", next);

    var startHash = location.hash.match(/^#s(\d+)$/);
    var startIndex = startHash ? Math.min(Math.max(parseInt(startHash[1], 10) - 1, 0), slides.length - 1) : 0;
    slides[0].classList.add("active");
    show(startIndex);

    // Auf Sprünge über die Übersichtsseite reagieren (Browser-Back/Forward, erneuter Linkklick)
    window.addEventListener("hashchange", function () {
        var m = location.hash.match(/^#s(\d+)$/);
        if (m) {
            var idx = Math.min(Math.max(parseInt(m[1], 10) - 1, 0), slides.length - 1);
            if (idx !== current) show(idx);
        }
    });
})();
