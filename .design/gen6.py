# -*- coding: utf-8 -*-
import io
exec(open('_common.py').read())
W, H = 390, 844
MONO = "'IBM Plex Mono', monospace"
DIM, HAIR, INK, MUT = '#a89f93', '#d6cfc5', '#16140f', '#8b847b'

def grid(op=.32, step=26):
    return ('<div style="position:absolute; inset:0; opacity:%s; background-image:'
            'linear-gradient(#d6cfc5 1px, transparent 1px),'
            'linear-gradient(90deg, #d6cfc5 1px, transparent 1px); background-size:%dpx %dpx"></div>'
            % (op, step, step))

def arrow(x, y, dx, dy, s=1.0):
    """треугольник в точке (x,y), указывающий вдоль (dx,dy)"""
    px, py = -dy, dx
    a = (x, y)
    b = (x - dx * 6 * s + px * 2.3 * s, y - dy * 6 * s + py * 2.3 * s)
    c = (x - dx * 6 * s - px * 2.3 * s, y - dy * 6 * s - py * 2.3 * s)
    return '<path d="M%.1f %.1f L%.1f %.1f L%.1f %.1f Z" fill="%s"/>' % (a + b + c + (DIM,))

def markart(left, top, w, hatch=.55, outline=1.0, pw=11, sw=4):
    h = round(w * 333 / 496, 1)
    lay = ''
    if hatch > 0:
        lay += ('<path fill="url(#hx)" fill-opacity="%s" fill-rule="evenodd" d="%s"/>' % (hatch, MARK_PATH))
    if outline > 0:
        lay += ('<path fill="none" stroke="#dd6612" stroke-opacity="%s" stroke-width="%s" '
                'stroke-linejoin="round" fill-rule="evenodd" d="%s"/>' % (outline, sw, MARK_PATH))
    return ('<svg width="%s" height="%s" viewBox="71 180 496 333" style="position:absolute; '
            'left:%spx; top:%spx"><defs><pattern id="hx" width="%d" height="%d" '
            'patternUnits="userSpaceOnUse" patternTransform="rotate(45)">'
            '<line x1="0" y1="0" x2="0" y2="%d" stroke="#dd6612" stroke-width="2.0"/>'
            '</pattern></defs>%s</svg>' % (w, h, left, top, pw, pw, pw, lay))

# =================== K · Чертёж (герой) ===================
L, T, MW = 61, 282, 268
MH = round(MW * 333 / 496, 1)
R_, B_ = L + MW, T + MH          # 320, 455.9

dims = []
# горизонтальный размер
dims.append('<line x1="%d" y1="462" x2="%d" y2="496" stroke="%s" stroke-width="1"/>' % (L, L, HAIR))
dims.append('<line x1="%d" y1="462" x2="%d" y2="496" stroke="%s" stroke-width="1"/>' % (R_, R_, HAIR))
dims.append('<line x1="%d" y1="488" x2="176" y2="488" stroke="%s" stroke-width="1"/>' % (L, DIM))
dims.append('<line x1="214" y1="488" x2="%d" y2="488" stroke="%s" stroke-width="1"/>' % (R_, DIM))
dims.append(arrow(L, 488, 1, 0) + arrow(R_, 488, -1, 0))
dims.append('<text x="195" y="492" text-anchor="middle" font-family=%s font-size="10" '
            'letter-spacing=".6" fill="%s">496</text>' % ('"IBM Plex Mono, monospace"', MUT))
# вертикальный размер
dims.append('<line x1="57" y1="%d" x2="34" y2="%d" stroke="%s" stroke-width="1"/>' % (T, T, HAIR))
dims.append('<line x1="57" y1="%d" x2="34" y2="%d" stroke="%s" stroke-width="1"/>' % (B_, B_, HAIR))
dims.append('<line x1="46" y1="%d" x2="46" y2="354" stroke="%s" stroke-width="1"/>' % (T, DIM))
dims.append('<line x1="46" y1="390" x2="46" y2="%d" stroke="%s" stroke-width="1"/>' % (B_, DIM))
dims.append(arrow(46, T, 0, 1) + arrow(46, B_, 0, -1))
dims.append('<text x="46" y="372" text-anchor="middle" font-family=%s font-size="10" '
            'letter-spacing=".6" fill="%s" transform="rotate(-90 46 372)">333</text>'
            % ('"IBM Plex Mono, monospace"', MUT))
# выноска
leader = ('<circle cx="250" cy="290" r="2" fill="%s"/>'
          '<path d="M250 290 L300 248 L340 248" fill="none" stroke="%s" stroke-width="1"/>'
          '<text x="340" y="241" text-anchor="end" font-family=%s font-size="10" '
          'letter-spacing=".6" fill="%s">t 12</text>'
          % (DIM, DIM, '"IBM Plex Mono, monospace"', MUT))

def block(op=1, cells=True):
    rows = ('<div style="height:45px; display:flex; align-items:center; justify-content:center">'
            '<div style="font:500 17px/1 %s; letter-spacing:5.5px; color:%s">AUTOPARTS</div></div>' % (MONO, INK))
    if cells:
        cell = ('<div style="flex:1; display:flex; align-items:center; justify-content:center; '
                'font:400 9px/1 %s; letter-spacing:1.2px; color:%s">%%s</div>' % (MONO, MUT))
        rows += ('<div style="height:1px; background:%s"></div>'
                 '<div style="height:34px; display:flex">%s<div style="width:1px; background:%s"></div>'
                 '%s<div style="width:1px; background:%s"></div>%s</div>'
                 % (HAIR, cell % '1:1', HAIR, cell % 'MK-01', HAIR,
                    '<div style="flex:1.4; display:flex; align-items:center; justify-content:center; '
                    'font:400 9.5px/1 Heebo, sans-serif; color:%s">חלקים מקוריים</div>' % MUT))
    return ('<div style="position:absolute; left:40px; top:556px; width:310px; opacity:%s; '
            'background:#f7f5f2; border:1px solid %s; box-sizing:border-box">%s</div>' % (op, HAIR, rows))

body = ('<div style="position:relative; width:%dpx; height:%dpx; background:#efece8; '
        'font-family:Heebo, system-ui, sans-serif; overflow:hidden">' % (W, H)
        + grid()
        + markart(L, T, MW)
        + '<svg width="%d" height="%d" style="position:absolute; inset:0">%s%s</svg>'
          % (W, H, ''.join(dims), leader)
        + block()
        + '<div style="position:absolute; left:0; right:0; top:660px; display:flex; justify-content:center">'
          '<div style="font:400 11px/1 Heebo, sans-serif; letter-spacing:.4px; color:%s">'
          'כל חלק במידה מדויקת</div></div>' % MUT
        + '<div style="position:absolute; left:32px; right:32px; bottom:64px; height:2px; background:#e4dfd8">'
          '<div style="width:100%; height:100%; background:#dd6612"></div></div>'
        + '</div>')
io.open('Draft.dc.html', 'w', encoding='utf-8').write(page(body))
print('K · Чертёж — Draft.dc.html')

# =================== K · раскадровка ===================
exec(open('gen3.py').read().split('# ---------- A. Разнос ----------')[0]
     .replace("import io, math\n", "").replace("exec(open('_common.py').read())\n", ""))

ML, MT, MMW = 23, 96, 84
MMH = round(MMW * 333 / 496, 1)
MR, MB = ML + MMW, MT + MMH
TX = 'font-family="IBM Plex Mono, monospace" font-size="5.5" letter-spacing=".4" fill="%s"' % MUT

def k_dims(op, nums):
    d = ['<line x1="%d" y1="%.1f" x2="%d" y2="172" stroke="%s" stroke-width=".7"/>' % (ML, MB + 4, ML, HAIR),
         '<line x1="%d" y1="%.1f" x2="%d" y2="172" stroke="%s" stroke-width=".7"/>' % (MR, MB + 4, MR, HAIR),
         '<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="%s" stroke-width=".7"/>' % (20, MT, 10, MT, HAIR),
         '<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="%s" stroke-width=".7"/>' % (20, MB, 10, MB, HAIR)]
    if nums:
        d += ['<line x1="%d" y1="166" x2="52" y2="166" stroke="%s" stroke-width=".7"/>' % (ML, DIM),
              '<line x1="78" y1="166" x2="%d" y2="166" stroke="%s" stroke-width=".7"/>' % (MR, DIM),
              arrow(ML, 166, 1, 0, .55), arrow(MR, 166, -1, 0, .55),
              '<text x="65" y="168.4" text-anchor="middle" %s>496</text>' % TX,
              '<line x1="15" y1="%.1f" x2="15" y2="116" stroke="%s" stroke-width=".7"/>' % (MT, DIM),
              '<line x1="15" y1="133" x2="15" y2="%.1f" stroke="%s" stroke-width=".7"/>' % (MB, DIM),
              arrow(15, MT, 0, 1, .55), arrow(15, MB, 0, -1, .55),
              '<text x="15" y="126.5" text-anchor="middle" %s transform="rotate(-90 15 124.5)">333</text>' % TX]
    return '<svg width="130" height="282" style="position:absolute; inset:0; opacity:%s">%s</svg>' % (op, ''.join(d))

def k_block(op, cells=True):
    rows = ('<div style="height:20px; display:flex; align-items:center; justify-content:center">'
            '<div style="font:500 7px/1 %s; letter-spacing:2px; color:%s">AUTOPARTS</div></div>' % (MONO, INK))
    if cells:
        c = ('<div style="flex:1; display:flex; align-items:center; justify-content:center; '
             'font:400 4.6px/1 %s; letter-spacing:.5px; color:%s">%%s</div>' % (MONO, MUT))
        rows += ('<div style="height:1px; background:%s"></div><div style="height:14px; display:flex">'
                 '%s<div style="width:1px; background:%s"></div>%s<div style="width:1px; background:%s"></div>'
                 '<div style="flex:1.4; display:flex; align-items:center; justify-content:center; '
                 'font:400 4.8px/1 Heebo, sans-serif; color:%s">חלקים מקוריים</div></div>'
                 % (HAIR, c % '1:1', HAIR, c % 'MK-01', HAIR, MUT))
    return ('<div style="position:absolute; left:14px; top:186px; width:102px; opacity:%s; '
            'background:#f7f5f2; border:1px solid %s; box-sizing:border-box">%s</div>' % (op, HAIR, rows))

def k_bar(p):
    return ('<div style="position:absolute; left:14px; right:14px; bottom:22px; height:1.5px; '
            'background:#e4dfd8"><div style="width:%d%%; height:100%%; background:#dd6612"></div></div>' % p)

def k_sub(op):
    return ('<div style="position:absolute; left:0; right:0; top:232px; display:flex; justify-content:center; '
            'opacity:%s"><div style="font:400 5.5px/1 Heebo, sans-serif; color:%s">כל חלק במידה מדויקת</div></div>'
            % (op, MUT))

MG = grid(.30, 13)
k1 = frame(MG + k_dims(.5, False) + k_bar(5))
k2 = frame(MG + k_dims(.7, False) + markart(ML, MT, MMW, hatch=0, outline=1, sw=5) + k_bar(28))
k3 = frame(MG + k_dims(1, True) + markart(ML, MT, MMW, hatch=.55, outline=1, pw=8, sw=5) + k_bar(66))
k4 = frame(MG + k_dims(1, True) + markart(ML, MT, MMW, hatch=.55, outline=1, pw=8, sw=5)
           + k_block(1) + k_sub(1) + k_bar(100))
io.open('DraftBeats.dc.html', 'w', encoding='utf-8').write(strip(
  'K · Чертёж', 'Ось: точность. Знак строится как деталь на чертеже — контур, штриховка разреза, размеры, штамп.',
  [k1, k2, k3, k4], ['0.00 s', '0.32 s', '0.80 s', '1.40 s']))
print('K · раскадровка — DraftBeats.dc.html')
