# -*- coding: utf-8 -*-
import io
exec(open('_common.py').read())

# ---------- части: тонкая техническая графика ----------
def nut(s=1.0):
    return ('<g stroke="#16140f" stroke-width="1.4" fill="none" opacity=".62">'
            '<path d="M22 2 L40 12 L40 32 L22 42 L4 32 L4 12 Z"/>'
            '<circle cx="22" cy="22" r="10"/></g>')

def disc():
    return ('<g stroke="#16140f" stroke-width="1.4" fill="none" opacity=".62">'
            '<circle cx="26" cy="26" r="24"/><circle cx="26" cy="26" r="9"/>'
            '<circle cx="26" cy="10" r="2"/><circle cx="40" cy="18" r="2"/>'
            '<circle cx="40" cy="34" r="2"/><circle cx="26" cy="42" r="2"/>'
            '<circle cx="12" cy="34" r="2"/><circle cx="12" cy="18" r="2"/></g>')

def plug():
    return ('<g stroke="#16140f" stroke-width="1.4" fill="none" opacity=".62">'
            '<path d="M10 2 h14 v10 h-14 Z"/><path d="M7 12 h20 v9 h-20 Z"/>'
            '<path d="M11 21 h12 v13 h-12 Z"/><path d="M14 34 h6 v10 h-6 Z"/>'
            '<path d="M14 44 h6"/></g>')

def spring():
    d = 'M8 4 '
    y = 4
    for i in range(6):
        d += 'C 34 %d 34 %d 8 %d ' % (y + 3, y + 7, y + 7)
        y += 7
    return ('<g stroke="#16140f" stroke-width="1.4" fill="none" opacity=".62">'
            '<path d="%s"/><path d="M8 4 h6"/><path d="M8 46 h6"/></g>' % d)

def filt():
    return ('<g stroke="#16140f" stroke-width="1.4" fill="none" opacity=".62">'
            '<rect x="6" y="6" width="30" height="38" rx="4"/>'
            '<path d="M6 14 h30 M6 22 h30 M6 30 h30 M6 38 h30"/>'
            '<rect x="14" y="1" width="14" height="6" rx="2"/></g>')

def piston():
    return ('<g stroke="#16140f" stroke-width="1.4" fill="none" opacity=".62">'
            '<rect x="6" y="4" width="32" height="26" rx="3"/>'
            '<path d="M6 11 h32 M6 16 h32"/>'
            '<circle cx="22" cy="24" r="4"/>'
            '<path d="M22 30 v10 M17 44 h10"/></g>')

PARTS = [
    (nut,    '44,44',  38,  190, 'M12-0431'),
    (disc,   '52,52',  262, 168, 'BR-2208'),
    (plug,   '34,48',  46,  452, 'NGK-7'),
    (spring, '42,52',  286, 452, 'SP-1150'),
    (filt,   '42,48',  118, 122, 'OF-3391'),
    (piston, '44,48',  212, 560, 'PN-0817'),
]

# центр знака на артборде
CX, CY = 195, 352
MW = 134

items = []
for fn, size, px, py, code in PARTS:
    w, h = size.split(',')
    items.append(
        '<div style="position:absolute; left:%dpx; top:%dpx; width:%spx; height:%spx">'
        '<svg width="%s" height="%s" viewBox="0 0 %s %s">%s</svg>'
        '<div style="position:absolute; left:0; top:%spx; font:400 9px/1 \'IBM Plex Mono\', monospace;'
        ' letter-spacing:.6px; color:#8b847b; white-space:nowrap">%s</div></div>'
        % (px, py, w, h, w, h, w, h, fn(), int(h) + 6, code))

leaders = []
for fn, size, px, py, code in PARTS:
    w, h = [int(v) for v in size.split(',')]
    sx, sy = px + w / 2.0, py + h / 2.0
    dx, dy = CX - sx, CY - sy
    L = (dx * dx + dy * dy) ** .5
    ux, uy = dx / L, dy / L
    x1, y1 = sx + ux * (max(w, h) / 2.0 + 9), sy + uy * (max(w, h) / 2.0 + 9)
    x2, y2 = CX - ux * 74, CY - uy * 74
    leaders.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#c9c1b6" stroke-width="1" '
                   'stroke-dasharray="2 4"/>' % (x1, y1, x2, y2))

body = """<div style="position:relative; width:390px; height:844px; background:#efece8;
     font-family:Heebo, system-ui, sans-serif; overflow:hidden">

  <svg width="390" height="844" style="position:absolute; inset:0" aria-hidden="true">%(leaders)s</svg>

  %(items)s

  <div style="position:absolute; left:%(mx)dpx; top:%(my)dpx">%(mark)s</div>

  <div style="position:absolute; left:0; right:0; top:%(wy)dpx; display:flex;
       justify-content:center">
    <div style="font:500 20px/1 'IBM Plex Mono', monospace; letter-spacing:5px; color:#16140f">AUTOPARTS</div>
  </div>

  <div style="position:absolute; left:0; right:0; top:%(sy)dpx; display:flex; justify-content:center">
    <div style="font:400 11px/1 Heebo, sans-serif; letter-spacing:.4px; color:#8b847b">כל חלק במקומו</div>
  </div>

  <div style="position:absolute; left:32px; right:32px; bottom:64px; height:2px; background:#e4dfd8">
    <div style="width:62%%; height:100%%; background:#dd6612"></div>
  </div>
</div>""" % dict(
    leaders=''.join(leaders), items='\n  '.join(items),
    mx=int(CX - MW / 2), my=int(CY - MW * 333 / 496 / 2),
    mark=mark_outline(MW, '#dd6612', 8),
    wy=CY + 92, sy=CY + 126)

io.open('Main.dc.html', 'w', encoding='utf-8').write(page(body))
print('Main.dc.html', len(body))
