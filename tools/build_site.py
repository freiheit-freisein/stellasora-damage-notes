# 公開用のファイルを dist/ にまとめる（Cloudflare Pages の sim.stella-tool.com 用）。
#   python tools/build_site.py
#   npx wrangler pages deploy dist --project-name stellasora-damage-sim --branch main
# - git で管理しているファイルだけを入れる（NOTES.md・tools・docs・Markdown は入れない）
# - HTML から読む JS・CSS に ?v=（コミットの短いハッシュ）を付ける。stella-tool.com は Cloudflare の設定で JS・CSS が
#   ブラウザに4時間キャッシュされるので、公開のたびに URL を変えて、新しいファイルを確実に読ませる
# - _headers: 計算ページ（/sim）は検索に出す。素質の確認ページ（/edit）は出さない（X-Robots-Tag: noindex）。HTML はキャッシュせず毎回確認する
# - _redirects: トップ（/）は計算ページ（/sim）へ 301。404.html: 無いURLは 404 を返す（無いと Cloudflare Pages がトップを 200 で返す）
# - robots.txt・sitemap.xml: 検索エンジン向け。短縮URL（/s/…）は functions が noindex を付ける
import os, re, shutil, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'dist')
SKIP_DIRS = ('tools/', 'docs/', '.claude/', 'functions/', 'migrations/')   # functions/ は wrangler がこのフォルダから直接読む
SKIP_EXT = ('.md', '.py')

files = subprocess.run(['git', 'ls-files'], cwd=ROOT, capture_output=True, text=True, encoding='utf-8').stdout.split('\n')
ver = subprocess.run(['git', 'rev-parse', '--short', 'HEAD'], cwd=ROOT, capture_output=True, text=True).stdout.strip()
dirty = subprocess.run(['git', 'status', '--porcelain', '--untracked-files=no'], cwd=ROOT, capture_output=True, text=True).stdout.strip()
if dirty:
    ver += 'm'   # コミットしていない変更がある
shutil.rmtree(OUT, ignore_errors=True)
n = 0
for f in files:
    if not f or f.startswith(SKIP_DIRS) or f.endswith(SKIP_EXT) or f in ('.gitignore', 'wrangler.toml'):
        continue
    dst = os.path.join(OUT, f)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    if f.endswith('.html'):
        s = open(os.path.join(ROOT, f), encoding='utf-8').read()
        s = re.sub(r'((?:src|href)="(?!https?:|#)[^"?]+\.(?:js|css))"', r'\1?v=' + ver + '"', s)
        open(dst, 'w', encoding='utf-8', newline='\n').write(s)
    else:
        shutil.copyfile(os.path.join(ROOT, f), dst)
    n += 1
open(os.path.join(OUT, '_headers'), 'w', encoding='utf-8', newline='\n').write(
    '/edit\n  X-Robots-Tag: noindex, nofollow\n'
    '/edit.html\n  X-Robots-Tag: noindex, nofollow\n'
    '/*.html\n  Cache-Control: no-cache\n'
    '/\n  Cache-Control: no-cache\n'
    '/*.js\n  Cache-Control: public, max-age=31536000, immutable\n'
    '/*.css\n  Cache-Control: public, max-age=31536000, immutable\n')
SITE = 'https://sim.stella-tool.com'


def put(name, text):
    open(os.path.join(OUT, name), 'w', encoding='utf-8', newline='\n').write(text)


put('robots.txt', f'User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n')   # /edit・/s/ は noindex を読ませるため、クロールは止めない
lastmod = subprocess.run(['git', 'log', '-1', '--format=%cs'], cwd=ROOT, capture_output=True, text=True).stdout.strip()
put('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    f'  <url><loc>{SITE}/sim</loc><lastmod>{lastmod}</lastmod></url>\n</urlset>\n')
put('_redirects', '/ /sim 301\n')
put('404.html', '<!doctype html>\n<html lang="ja">\n<head>\n<meta charset="utf-8">\n<meta name="robots" content="noindex">\n'
    '<meta name="viewport" content="width=device-width,initial-scale=1">\n<title>ページが見つかりません - 巡遊者の計算ノート</title>\n'
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n</head>\n<body style="font-family:sans-serif;padding:40px;color:#4B5082">\n'
    '<p>ページが見つかりませんでした。</p>\n<p><a href="/sim">巡遊者の計算ノートへ</a></p>\n</body>\n</html>\n')
print(n, 'files ->', OUT, 'v=' + ver)
