# 公開用のファイルを dist/ にまとめる（Cloudflare Pages の sim.stella-tool.com 用）。
#   python tools/build_site.py
#   npx wrangler pages deploy dist --project-name stellasora-damage-sim --branch main
# - git で管理しているファイルだけを入れる（NOTES.md・tools・docs・Markdown は入れない）
# - HTML から読む JS・CSS に ?v=（コミットの短いハッシュ）を付ける。stella-tool.com は Cloudflare の設定で JS・CSS が
#   ブラウザに4時間キャッシュされるので、公開のたびに URL を変えて、新しいファイルを確実に読ませる
# - _headers: 検索エンジンに載せない（X-Robots-Tag: noindex）、HTML はキャッシュせず毎回確認する
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
    '/*\n  X-Robots-Tag: noindex, nofollow\n'
    '/*.html\n  Cache-Control: no-cache\n'
    '/\n  Cache-Control: no-cache\n'
    '/*.js\n  Cache-Control: public, max-age=31536000, immutable\n'
    '/*.css\n  Cache-Control: public, max-age=31536000, immutable\n')
open(os.path.join(OUT, 'robots.txt'), 'w', encoding='utf-8', newline='\n').write('User-agent: *\nAllow: /\n')   # noindex を読ませるため、クロールは止めない
print(n, 'files ->', OUT, 'v=' + ver)
