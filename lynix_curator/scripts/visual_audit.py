from pathlib import Path
from playwright.sync_api import sync_playwright
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
import os, shutil, json

root = Path(__file__).resolve().parents[2]
out = root / 'lynix_curator' / 'audit'
out.mkdir(exist_ok=True)
os.chdir(root)
server = ThreadingHTTPServer(('127.0.0.1', 8799), SimpleHTTPRequestHandler)
Thread(target=server.serve_forever, daemon=True).start()
chrome = shutil.which('google-chrome') or shutil.which('chromium') or shutil.which('chromium-browser')
if not chrome:
    raise SystemExit('Chrome/Chromium not installed on runner')
pages = {
 'home': '#/',
 'direction-nft': '#/direction/nft',
 'direction-escort': '#/direction/escort',
 'materials': '#/materials',
 'tools': '#/tools',
 'statistics': '#/statistics',
 'about': '#/about',
 'article': '#/material/crypto',
}
rows = []
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome, headless=True, args=['--no-sandbox','--disable-dev-shm-usage'])
    for size, viewport in [('desktop', {'width':1440,'height':950}),('mobile', {'width':390,'height':844})]:
        for name, anchor in pages.items():
            page = browser.new_page(viewport=viewport,device_scale_factor=1)
            page.goto('http://127.0.0.1:8799/lynix_curator/'+anchor, wait_until='networkidle')
            page.wait_for_timeout(700)
            page.screenshot(path=str(out / f'{size}_{name}.jpg'), full_page=True, quality=58, type='jpeg')
            issues = page.evaluate("""() => ({
              scrollWidth: document.documentElement.scrollWidth,
              clientWidth: document.documentElement.clientWidth,
              bodyHeight: document.body.scrollHeight,
              brokenImages: [...document.images].filter(im => !im.complete || im.naturalWidth === 0).map(im => im.getAttribute('src')),
              clippedText: [...document.querySelectorAll('h1,h2,h3,p,button,a,.stat-number,.tag')]
                .filter(el => { const st = getComputedStyle(el); const rect = el.getBoundingClientRect();
                  return st.display !== 'none' && st.visibility !== 'hidden' && rect.width > 0 &&
                    el.scrollWidth > el.clientWidth + 4 && rect.left >= 0; })
                .slice(0, 12).map(el => ({tag: el.tagName, text: el.textContent.trim().slice(0, 80),
                  client: el.clientWidth, scroll: el.scrollWidth})),
              fontSamples: [...document.querySelectorAll('.hero h1,.page-top h1,.section-header h2,.material-body h3,.tool-card h3')]
                .slice(0, 8).map(el => ({text: el.textContent.trim().slice(0, 35),
                  size: getComputedStyle(el).fontSize}))
            })""")
            rows.append({'viewport': size, 'page': name, **issues})
            print(size, name, 'overflow', issues['scrollWidth'] > issues['clientWidth'],
                  'brokenImages', len(issues['brokenImages']), 'clipped', len(issues['clippedText']))
            page.close()
    browser.close()
(out / 'layout_metrics.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding='utf8')
server.shutdown()
