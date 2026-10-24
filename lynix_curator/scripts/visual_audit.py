from pathlib import Path
from playwright.sync_api import sync_playwright
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
import os, shutil

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
 'materials': '#/materials',
 'tools': '#/tools',
 'statistics': '#/statistics',
 'about': '#/about',
 'article': '#/material/crypto',
}
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=chrome, headless=True, args=['--no-sandbox','--disable-dev-shm-usage'])
    for size, viewport in [('desktop', {'width':1440,'height':950}),('mobile', {'width':390,'height':844})]:
        for name, anchor in pages.items():
            page = browser.new_page(viewport=viewport,device_scale_factor=1)
            page.goto('http://127.0.0.1:8799/lynix_curator/'+anchor, wait_until='networkidle')
            page.screenshot(path=str(out / f'{size}_{name}.png'), full_page=True)
            print(size,name,'scroll',page.evaluate('document.documentElement.scrollWidth'),'viewport',viewport['width'])
            page.close()
    browser.close()
server.shutdown()
