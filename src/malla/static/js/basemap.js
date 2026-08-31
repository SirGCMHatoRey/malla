/*
 * Keyless basemap tiles for Leaflet maps.
 *
 * CARTO's basemap CDN (basemaps.cartocdn.com) now requires an API key and
 * serves an "API KEY REQUIRED" placeholder tile otherwise. We use
 * OpenStreetMap's standard raster tiles instead:
 *   - light mode: the tiles as-is
 *   - dark mode:  the same tiles with a CSS invert filter
 *     (see the .malla-basemap-dark rule in css/malla.css)
 *
 * Usage:
 *   const { light, dark } = window.MallaBasemap.createTileLayers();
 *   // ...swap between them on theme change, or:
 *   window.MallaBasemap.addBaseLayer(map);
 */
(function () {
  "use strict";

  const OSM_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  const OSM_ATTRIBUTION =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  function createTileLayers(options) {
    const opts = Object.assign({ maxZoom: 19 }, options || {});
    const common = { attribution: OSM_ATTRIBUTION, maxZoom: opts.maxZoom };

    return {
      light: L.tileLayer(OSM_URL, common),
      dark: L.tileLayer(
        OSM_URL,
        Object.assign({ className: "malla-basemap-dark" }, common)
      ),
    };
  }

  function isDarkTheme() {
    return (
      document.documentElement.getAttribute("data-bs-theme") === "dark"
    );
  }

  /* Add the theme-appropriate base layer to a map and return it. */
  function addBaseLayer(map, options) {
    const layers = createTileLayers(options);
    const layer = isDarkTheme() ? layers.dark : layers.light;
    layer.addTo(map);
    return layer;
  }

  window.MallaBasemap = { createTileLayers, isDarkTheme, addBaseLayer };
})();
