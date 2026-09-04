# -*- coding: utf-8 -*-
import io, math, random
exec(open('_common.py').read())
W, H = 390, 844
MONO = "'IBM Plex Mono', monospace"
random.seed(7)

def foot(prog=None, dark=False):
    if prog is None: return ''
    tr = 'rgba(239,236,232,.14)' if dark else '#e4dfd8'
    return ('<div style="position:absolute; left:32px; right:32px; bottom:64px; height:2px; '
            'background:%s"><div style="width:%d%%; height:100%%; background:#dd6612"></div></div>'
            % (tr, prog))

def wordmark(top, col='#16140f', size=20, ls=5):
    return ('<div style="position:absolute; left:0; right:0; top:%dpx; display:flex; '
            'justify-content:center"><div style="font:500 %dpx/1 %s; letter-spacing:%dpx; '
            'color:%s">AUTOPARTS</div></div>' % (top, size, MONO, ls, col))

def sub(top, txt, col='#8b847b'):
    return ('<div style="position:absolute; left:0; right:0; top:%dpx; display:flex; '
            'justify-content:center"><div style="font:400 11px/1 Heebo, sans-serif; '
            'letter-spacing:.4px; color:%s">%s</div></div>' % (top, col, txt))

def screen(inner, bg='#efece8'):
    return ('<div style="position:relative; width:%dpx; height:%dpx; background:%s; '
            'font-family:Heebo, system-ui, sans-serif; overflow:hidden">%s</div>' % (W, H, bg, inner))

# ============ F · Артикул ============
NUM = 'OEM 06E 115 562 H'
bodyF = screen(
  '<div style="position:absolute; left:136px; top:300px">%s</div>' % mark(118) +
  wordmark(430) +
  """<div style="position:absolute; left:48px; right:48px; top:500px; display:flex;
       flex-direction:column; gap:12px; align-items:center">
    <div style="display:flex; align-items:center; gap:3px">
      <div style="font:400 15px/1 %s; letter-spacing:1.6px; color:#16140f">%s</div>
      <div style="width:9px; height:19px; background:#dd6612"></div>
    </div>
    <div style="width:100%%; height:1px; background:#d6cfc5"></div>
    <div style="font:400 11px/1 Heebo, sans-serif; color:#8b847b">מזהה את החלק לפי מספר</div>
  </div>""" % (MONO, NUM) + foot(58))
io.open('Article.dc.html', 'w', encoding='utf-8').write(page(bodyF))

# ============ G · Каталог ============
def glyph(i, x, y, col, sw='1.3'):
    g = i % 6
    a = 'stroke="%s" stroke-width="%s" fill="none"' % (col, sw)
    if g == 0: return '<circle cx="%d" cy="%d" r="7" %s/><circle cx="%d" cy="%d" r="2.6" %s/>' % (x, y, a, x, y, a)
    if g == 1: return '<path d="M%d %d l6 3.4 v6.8 l-6 3.4 l-6 -3.4 v-6.8 Z" %s/>' % (x, y - 7, a)
    if g == 2: return '<rect x="%d" y="%d" width="13" height="10" rx="2.5" %s/>' % (x - 6.5, y - 5, a)
    if g == 3: return '<path d="M%d %d c7 1.6 7 3.6 0 5.2 c-7 1.6 -7 3.6 0 5.2" %s/>' % (x - 5, y - 6, a)
    if g == 4: return '<path d="M%d %d h7 v4 h-7 Z M%d %d h5 v6 h-5 Z" %s/>' % (x - 3.5, y - 7, x - 2.5, y - 3, a)
    return '<path d="M%d %d h9 M%d %d h9 M%d %d h9" %s/>' % (x - 4.5, y - 4, x - 4.5, y, x - 4.5, y + 4, a)

grid_i, k = [], 0
for r in range(46):
    for c in range(26):
        x, y = 12 + c * 15, 40 + r * 15 + (7 if c % 2 else 0)
        grid_i.append((k, x, y)); k += 1

def cell(i, x, y, col, sw):
    return ('<g transform="translate(%.1f %.1f) scale(.5)">%s</g>'
            % (x, y, glyph(i, 0, 0, col, sw)))

grey = ''.join(cell(i, x, y, '#16140f', '2.5') for i, x, y in grid_i)
orange = ''.join(cell(i, x, y, '#dd6612', '3.2') for i, x, y in grid_i)
MW = 344.0
MS = MW / 496
bodyG = screen(
  """<svg width="%d" height="%d" style="position:absolute; inset:0;
       -webkit-mask-image:radial-gradient(ellipse 250px 300px at 195px 372px, #000 48%%, transparent 100%%);
       mask-image:radial-gradient(ellipse 250px 300px at 195px 372px, #000 48%%, transparent 100%%)" aria-hidden="true">
    <defs><mask id="mk"><rect width="%d" height="%d" fill="black"/>
      <g transform="translate(195,372) scale(%.4f) translate(-319,-346.5)">
        <path fill="white" fill-rule="evenodd" d="%s"/></g></mask></defs>
    <g opacity=".16">%s</g>
    <g mask="url(#mk)">%s</g>
  </svg>""" % (W, H, W, H, MS, MARK_PATH, grey, orange) +
  wordmark(632) + sub(666, 'הקטלוג שמרכיב את השם') + foot(44))
io.open('Catalog.dc.html', 'w', encoding='utf-8').write(page(bodyG))

# ============ H · Трафарет ============
spray = []
for _ in range(190):
    a = random.random() * 2 * math.pi
    rr = 96 + random.random() ** 2 * 78
    spray.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#dd6612" opacity="%.2f"/>'
                 % (195 + rr * math.cos(a) * 1.15, 372 + rr * math.sin(a) * .72,
                    .7 + random.random() * 1.5, .07 + random.random() * .2))
bridges = ''.join(
  '<rect x="-4" y="%d" width="230" height="9" fill="#efece8"/>' % y for y in (24, 98))
bodyH = screen(
  '<svg width="%d" height="%d" style="position:absolute; inset:0" aria-hidden="true">%s</svg>' % (W, H, ''.join(spray)) +
  """<div style="position:absolute; left:56px; top:250px; width:278px; height:250px;
       border:1px dashed #c9c1b6; border-radius:3px"></div>
  <svg width="222" height="149" viewBox="71 180 496 333" style="position:absolute; left:84px; top:298px">
    <path fill="#dd6612" fill-rule="evenodd" d="%s"/></svg>
  <svg width="222" height="149" style="position:absolute; left:84px; top:298px">%s</svg>
  <div style="position:absolute; left:0; right:0; top:560px; display:flex; justify-content:center">
    <div style="position:relative; height:26px">
      <div style="font:500 20px/26px %s; letter-spacing:5px; color:#16140f">AUTOPARTS</div>
      <div style="position:absolute; left:-4px; right:-4px; top:11px; height:3px; background:#efece8"></div>
    </div>
  </div>""" % (MARK_PATH, bridges, MONO) +
  sub(600, 'סימון בסטנסיל, כמו על הארגז') + foot(52))
io.open('Stencil.dc.html', 'w', encoding='utf-8').write(page(bodyH))

# ============ I · Этикетка ============
bars, bx = [], 0
while bx < 236:
    w = random.choice([2, 2, 3, 5, 5, 8])
    bars.append('<rect x="%d" y="0" width="%d" height="46" fill="#16140f"/>' % (bx, w))
    bx += w + random.choice([3, 4, 6])
bodyI = screen(
  """<div style="position:absolute; left:40px; top:262px; width:310px; height:228px;
       background:#f7f5f2; border:1px solid #e4dfd8; border-radius:14px;
       box-shadow:0 26px 44px -26px rgba(22,20,15,.42); transform:rotate(-2.4deg);
       box-sizing:border-box; padding:24px; display:flex; flex-direction:column; gap:14px">
    <div style="display:flex; align-items:center; gap:12px">
      %s
      <div style="display:flex; flex-direction:column; gap:4px">
        <div style="font:500 12px/1 %s; letter-spacing:2.4px; color:#16140f">AUTOPARTS</div>
        <div style="font:400 10px/1 Heebo, sans-serif; color:#8b847b">חלק מקורי · במלאי</div>
      </div>
    </div>
    <div style="height:1px; background:#e4dfd8"></div>
    <div style="font:400 12px/1 %s; letter-spacing:1.2px; color:#16140f">06E 115 562 H</div>
    <svg width="236" height="46" style="align-self:center">%s</svg>
    <div style="font:400 9px/1 %s; letter-spacing:2.6px; color:#8b847b; text-align:center">4 812 903 771 06</div>
  </div>""" % (mark(38), MONO, MONO, ''.join(bars), MONO) +
  wordmark(576) + sub(610, 'כל חלק עם תווית משלו') + foot(66))
io.open('Label.dc.html', 'w', encoding='utf-8').write(page(bodyI))

# ============ J · Литьё ============
bodyJ = screen(
  """<div style="position:absolute; left:78px; top:452px; width:234px; height:34px;
       border-radius:50%%; background:radial-gradient(ellipse at center,
       rgba(46,36,24,.44), rgba(46,36,24,.14) 46%%, rgba(46,36,24,0) 72%%)"></div>
  <svg width="234" height="157" viewBox="71 180 496 333" style="position:absolute; left:78px; top:300px">
    <defs>
      <linearGradient id="face" x1="0" y1="0" x2=".55" y2="1">
        <stop offset="0" stop-color="#f08a35"/><stop offset=".5" stop-color="#dd6612"/>
        <stop offset="1" stop-color="#c25a10"/></linearGradient>
    </defs>
    <g transform="translate(7,10)"><path fill="#8e3f08" fill-rule="evenodd" d="%s"/></g>
    <g transform="translate(3.5,5)"><path fill="#a8490a" fill-rule="evenodd" d="%s"/></g>
    <path fill="url(#face)" fill-rule="evenodd" d="%s"/>
    <path fill="none" stroke="#ffc389" stroke-width="3.4" stroke-opacity=".7"
          d="M97 202 L138 416 M412 202 L474 357"/>
  </svg>""" % (MARK_PATH, MARK_PATH, MARK_PATH) +
  wordmark(534) + sub(568, 'חלק שאפשר להחזיק ביד') + foot(50))
io.open('Cast.dc.html', 'w', encoding='utf-8').write(page(bodyJ))
print('F Article, G Catalog, H Stencil, I Label, J Cast — готово')
