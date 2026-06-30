/** Self-hosted Material Symbols (bundled with the app — no Google CDN delay). */
import '@fontsource-variable/material-symbols-rounded/fill.css';

const ICON_FONT = '500 24px "Material Symbols Rounded Variable"';

export function initIconFont() {
  const markReady = () => document.documentElement.classList.add('fonts-ready');

  if (document.fonts?.check(ICON_FONT)) {
    markReady();
    return;
  }

  Promise.all([
    document.fonts.load(ICON_FONT),
    document.fonts.ready,
  ]).then(markReady).catch(markReady);

  // Never leave icons invisible if font loading fails or stalls
  setTimeout(markReady, 2500);
}
