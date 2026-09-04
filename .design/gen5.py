# -*- coding: utf-8 -*-
import io, math, random
exec(open('_common.py').read())
exec(open('gen3.py').read().split('# ---------- A. Разнос ----------')[0]
     .replace("import io, math\n", "").replace("exec(open('_common.py').read())\n", ""))
random.seed(11)

def bar(prog, dark=False):
    tr = 'rgba(239,236,232,.14)' if dark else '#e4dfd8'
    return ('<div style="position:absolute; left:14px; right:14px; bottom:22px; height:1.5px; '
            'background:%s"><div style="width:%d%%; height:100%%; background:#dd6612"></div></div>'
            % (tr, prog))

def mono(y, txt, size=6, ls=0.6, col='#16140f', op=1):
    return ('<div style="position:absolute; left:0; right:0; top:%spx; display:flex; '
            'justify-content:center; opacity:%s"><div style="font:400 %spx/1 %s; '
            'letter-spacing:%spx; color:%s; white-space:nowrap">%s</div></div>'
            % (y, op, size, MONO, ls, col, txt))

# ================= F · Артикул =================
NUM = 'OEM 06E 115 562 H'
def f_num(n, caret=True):
    txt = NUM[:n]
    c = ('<div style="width:3px; height:7px; background:#dd6612"></div>' if caret else '')
    return ('<div style="position:absolute; left:0; right:0; top:168px; display:flex; '
            'justify-content:center; align-items:center; gap:1.5px">'
            '<div style="font:400 6px/1 %s; letter-spacing:.6px; color:#16140f; white-space:nowrap">%s</div>'
            '%s</div>' % (MONO, txt.replace(' ', '&nbsp;'), c))

f1 = frame(mini_mark(26, 92, 78, op=.0) + f_num(0) + bar(4))
f2 = frame(mini_mark(26, 92, 78) + f_num(0) + bar(26))
f3 = frame(mini_mark(26, 92, 78) + word(146) + f_num(11) +
           '<div style="position:absolute; left:22px; right:22px; top:182px; height:1px; background:#d6cfc5"></div>' + bar(62))
f4 = frame(mini_mark(26, 92, 78) + word(146) + f_num(17, caret=False) +
           '<div style="position:absolute; left:22px; right:22px; top:182px; height:1px; background:#d6cfc5"></div>' +
           mono(192, 'מזהה את החלק לפי מספר', 5.5, .2, '#8b847b') + bar(100))
io.open('ArticleBeats.dc.html', 'w', encoding='utf-8').write(strip(
  'F · Артикул', 'Ось: идентичность = номер детали. Курсор набирает OEM-код, знак уже стоит.',
  [f1, f2, f3, f4], ['0.00 s', '0.35 s', '0.90 s', '1.50 s']))

# ================= G · Каталог =================
def g_grid(rv):
    cells = []
    for r in range(37):
        for c in range(18):
            x, y = 4 + c * 8, 12 + r * 8 + (4 if c % 2 else 0)
            cells.append((r * 18 + c, x, y))
    grey = ''.join('<g transform="translate(%.1f %.1f) scale(.27)">%s</g>'
                   % (x, y, glyph(i, 0, 0, '#16140f', '4.6')) for i, x, y in cells)
    orange = ''.join('<g transform="translate(%.1f %.1f) scale(.27)">%s</g>'
                     % (x, y, glyph(i, 0, 0, '#dd6612', '5.8')) for i, x, y in cells)
    mk = ''
    if rv > 0:
        mk = ('<g clip-path="url(#gc%d)"><g mask="url(#gm%d)">%s</g></g>'
              % (int(rv * 100), int(rv * 100), orange))
    return ("""<svg width="130" height="282" style="position:absolute; inset:0;
      -webkit-mask-image:radial-gradient(ellipse 78px 94px at 65px 122px, #000 48%%, transparent 100%%);
      mask-image:radial-gradient(ellipse 78px 94px at 65px 122px, #000 48%%, transparent 100%%)">
      <defs><mask id="gm%d"><rect width="130" height="282" fill="black"/>
        <g transform="translate(65,122) scale(%.4f) translate(-319,-346.5)">
          <path fill="white" fill-rule="evenodd" d="%s"/></g></mask>
        <clipPath id="gc%d"><rect x="0" y="0" width="%.1f" height="282"/></clipPath></defs>
      <g opacity="%s">%s</g>%s</svg>""" % (int(rv * 100), 112.0 / 496, MARK_PATH,
                                           int(rv * 100), 130 * rv,
                                           .10 + .06 * rv, grey, mk))

def glyph(i, x, y, col, sw='1.3'):
    g = i % 6
    a = 'stroke="%s" stroke-width="%s" fill="none"' % (col, sw)
    if g == 0: return '<circle cx="%d" cy="%d" r="7" %s/><circle cx="%d" cy="%d" r="2.6" %s/>' % (x, y, a, x, y, a)
    if g == 1: return '<path d="M%d %d l6 3.4 v6.8 l-6 3.4 l-6 -3.4 v-6.8 Z" %s/>' % (x, y - 7, a)
    if g == 2: return '<rect x="%d" y="%d" width="13" height="10" rx="2.5" %s/>' % (x - 6.5, y - 5, a)
    if g == 3: return '<path d="M%d %d c7 1.6 7 3.6 0 5.2 c-7 1.6 -7 3.6 0 5.2" %s/>' % (x - 5, y - 6, a)
    if g == 4: return '<path d="M%d %d h7 v4 h-7 Z M%d %d h5 v6 h-5 Z" %s/>' % (x - 3.5, y - 7, x - 2.5, y - 3, a)
    return '<path d="M%d %d h9 M%d %d h9 M%d %d h9" %s/>' % (x - 4.5, y - 4, x - 4.5, y, x - 4.5, y + 4, a)

g1 = frame(g_grid(0) + bar(6))
g2 = frame(g_grid(.45) + bar(30))
g3 = frame(g_grid(1) + word(212) + bar(68))
g4 = frame(g_grid(1) + word(212) + mono(226, 'הקטלוג שמרכיב את השם', 5.5, .2, '#8b847b') + bar(100))
io.open('CatalogBeats.dc.html', 'w', encoding='utf-8').write(strip(
  'G · Каталог', 'Ось: масштаб ассортимента. Поле иконок деталей — часть из них окрашивается и складывается в знак.',
  [g1, g2, g3, g4], ['0.00 s', '0.30 s', '0.85 s', '1.40 s']))

# ================= H · Трафарет =================
def h_spray(n, op):
    out = []
    rnd = random.Random(3)
    for _ in range(n):
        a = rnd.random() * 2 * math.pi
        rr = 30 + rnd.random() ** 2 * 26
        out.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#dd6612" opacity="%.2f"/>'
                   % (65 + rr * math.cos(a) * 1.15, 118 + rr * math.sin(a) * .72,
                      .5 + rnd.random(), (.08 + rnd.random() * .22) * op))
    return '<svg width="130" height="282" style="position:absolute; inset:0">%s</svg>' % ''.join(out)

def h_mark(op, brg=True):
    b = ''
    if brg:
        b = ('<svg width="76" height="51" style="position:absolute; left:27px; top:93px">'
             '<rect x="-2" y="8" width="80" height="3" fill="#efece8"/>'
             '<rect x="-2" y="33" width="80" height="3" fill="#efece8"/></svg>')
    return ('<div style="position:absolute; left:27px; top:93px; opacity:%s">%s</div>%s' % (op, mark(76), b))

h_plate = ('<div style="position:absolute; left:19px; top:80px; width:92px; height:82px; '
           'border:1px dashed #c9c1b6; border-radius:2px"></div>')
h1 = frame(h_plate + bar(6))
h2 = frame(h_plate + h_spray(70, .8) + h_mark(.45) + bar(28))
h3 = frame(h_plate + h_spray(120, 1) + h_mark(1) + bar(66))
h4 = frame(h_spray(120, 1) + h_mark(1) +
           '<div style="position:absolute; left:0; right:0; top:186px; display:flex; justify-content:center">'
           '<div style="position:relative"><div style="font:500 7px/11px %s; letter-spacing:1.8px; '
           'color:#16140f">AUTOPARTS</div><div style="position:absolute; left:-2px; right:-2px; top:4.5px; '
           'height:1.5px; background:#efece8"></div></div></div>' % MONO +
           mono(204, 'סימון בסטנסיל, כמו על הארגז', 5.5, .2, '#8b847b') + bar(100))
io.open('StencilBeats.dc.html', 'w', encoding='utf-8').write(strip(
  'H · Трафарет', 'Ось: цех и склад. Знак напыляется через трафарет прямо на «ящик», перемычки остаются.',
  [h1, h2, h3, h4], ['0.00 s', '0.30 s', '0.75 s', '1.35 s']))

# ================= I · Этикетка =================
bars_i, bx = [], 0
rnd = random.Random(5)
while bx < 82:
    w = rnd.choice([1, 1, 1.5, 2, 3])
    bars_i.append('<rect x="%.1f" y="0" width="%.1f" height="16" fill="#16140f"/>' % (bx, w))
    bx += w + rnd.choice([1, 1.5, 2])
BARS = ''.join(bars_i)

def card(rot, y, sh, code=True, code_op=1):
    inner = ('<div style="display:flex; align-items:center; gap:5px">%s'
             '<div style="display:flex; flex-direction:column; gap:2px">'
             '<div style="font:500 5.5px/1 %s; letter-spacing:1px; color:#16140f">AUTOPARTS</div>'
             '<div style="font:400 5px/1 Heebo, sans-serif; color:#8b847b">חלק מקורי · במלאי</div></div></div>'
             '<div style="height:1px; background:#e4dfd8"></div>' % (mark(17), MONO))
    if code:
        inner += ('<div style="font:400 5.5px/1 %s; letter-spacing:.5px; color:#16140f; opacity:%s">'
                  '06E 115 562 H</div><svg width="82" height="16" style="align-self:center; opacity:%s">%s</svg>'
                  % (MONO, code_op, code_op, BARS))
    return ('<div style="position:absolute; left:15px; top:%spx; width:100px; height:76px; '
            'background:#f7f5f2; border:1px solid #e4dfd8; border-radius:6px; box-sizing:border-box; '
            'padding:8px; display:flex; flex-direction:column; gap:5px; transform:rotate(%sdeg); '
            'box-shadow:0 %spx %spx -%spx rgba(22,20,15,.42)">%s</div>'
            % (y, rot, sh, sh * 1.7, sh, inner))

i1 = frame(card(-9, 46, 16, code=False) + bar(6))
i2 = frame(card(-5, 78, 11, code=True, code_op=.25) + bar(30))
i3 = frame(card(-2.4, 92, 7) + bar(66))
i4 = frame(card(-2.4, 92, 7) + word(196) + mono(212, 'כל חלק עם תווית משלו', 5.5, .2, '#8b847b') + bar(100))
io.open('LabelBeats.dc.html', 'w', encoding='utf-8').write(strip(
  'I · Этикетка', 'Ось: доверие к оригиналу. Наклейка с артикулом и штрихкодом ложится на экран и замирает.',
  [i1, i2, i3, i4], ['0.00 s', '0.30 s', '0.80 s', '1.40 s']))

# ================= J · Литьё =================
def j_mark(depth, light):
    lay = ''
    if depth > 0:
        lay += '<g transform="translate(%.1f,%.1f)"><path fill="#8e3f08" fill-rule="evenodd" d="%s"/></g>' % (depth * 30, depth * 43, MARK_PATH)
        lay += '<g transform="translate(%.1f,%.1f)"><path fill="#a8490a" fill-rule="evenodd" d="%s"/></g>' % (depth * 15, depth * 21, MARK_PATH)
    lay += '<path fill="url(#fc)" fill-rule="evenodd" d="%s"/>' % MARK_PATH
    if light > 0:
        lay += ('<path fill="none" stroke="#ffc389" stroke-width="3.4" stroke-opacity="%.2f" '
                'd="M97 202 L138 416 M412 202 L474 357"/>' % (.7 * light))
    return ('<svg width="80" height="54" viewBox="71 180 496 333" style="position:absolute; left:25px; top:96px">'
            '<defs><linearGradient id="fc" x1="0" y1="0" x2=".55" y2="1">'
            '<stop offset="0" stop-color="#f08a35"/><stop offset=".5" stop-color="#dd6612"/>'
            '<stop offset="1" stop-color="#c25a10"/></linearGradient></defs>%s</svg>' % lay)

def j_shadow(op):
    return ('<div style="position:absolute; left:25px; top:148px; width:80px; height:12px; '
            'border-radius:50%%; opacity:%s; background:radial-gradient(ellipse at center, '
            'rgba(46,36,24,.44), rgba(46,36,24,.14) 46%%, rgba(46,36,24,0) 72%%)"></div>' % op)

j1 = frame(j_mark(0, 0) + bar(6))
j2 = frame(j_shadow(.4) + j_mark(.45, 0) + bar(28))
j3 = frame(j_shadow(1) + j_mark(1, .5) + bar(66))
j4 = frame(j_shadow(1) + j_mark(1, 1) + word(178) +
           mono(194, 'חלק שאפשר להחזיק ביד', 5.5, .2, '#8b847b') + bar(100))
io.open('CastBeats.dc.html', 'w', encoding='utf-8').write(strip(
  'J · Литьё', 'Ось: физичность. Знак выдавливается из плоскости в литую деталь, ловит свет и ставит тень.',
  [j1, j2, j3, j4], ['0.00 s', '0.28 s', '0.70 s', '1.30 s']))

print('ArticleBeats, CatalogBeats, StencilBeats, LabelBeats, CastBeats — готово')
