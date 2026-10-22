# -*- coding: utf-8 -*-
import io, math
exec(open('_common.py').read())

W, H = 390, 844
MONO = "'IBM Plex Mono', monospace"

# ============ B. Диагностика ============
SCAN_Y = 348
def comp(mode):
    if mode == 'solid':
        mk = mark(120, '#dd6612')
        col, wcol = '#16140f', '#16140f'
    else:
        mk = mark_outline(120, '#dd6612', 10)
        col, wcol = '#8b847b', '#8b847b'
    return ("""<div style="position:absolute; inset:0">
      <div style="position:absolute; left:135px; top:300px">%s</div>
      <div style="position:absolute; left:0; right:0; top:432px; display:flex; justify-content:center">
        <div style="font:500 20px/1 %s; letter-spacing:5px; color:%s">AUTOPARTS</div></div>
      <div style="position:absolute; left:0; right:0; top:466px; display:flex; justify-content:center">
        <div style="font:400 11px/1 Heebo, sans-serif; letter-spacing:.4px; color:%s">אבחון לפני קנייה</div></div>
    </div>""" % (mk, MONO, wcol, col))

ticks = []
for i in range(0, 45):
    y = 120 + i * 14
    long = (i % 5 == 0)
    ticks.append('<line x1="20" y1="%d" x2="%d" y2="%d" stroke="#d6cfc5" stroke-width="1"/>'
                 % (y, 20 + (13 if long else 7), y))

bodyB = """<div style="position:relative; width:%dpx; height:%dpx; background:#efece8;
     font-family:Heebo, system-ui, sans-serif; overflow:hidden">
  <svg width="%d" height="%d" style="position:absolute; inset:0" aria-hidden="true">%s</svg>

  <div style="position:absolute; inset:0; clip-path:inset(0 0 %dpx 0)">%s</div>
  <div style="position:absolute; inset:0; clip-path:inset(%dpx 0 0 0);
       background:linear-gradient(180deg, rgba(221,102,18,.055), rgba(221,102,18,0) 220px)">%s</div>

  <div style="position:absolute; left:0; right:0; top:%dpx; height:1px; background:#dd6612;
       box-shadow:0 0 18px 2px rgba(221,102,18,.45)"></div>
  <div style="position:absolute; left:20px; top:%dpx; width:26px; height:1px; background:#dd6612"></div>
  <div style="position:absolute; left:52px; top:%dpx; font:500 10px/1 %s; letter-spacing:1px;
       color:#dd6612">SCAN 54%%</div>

  <div style="position:absolute; left:32px; right:32px; bottom:64px;
       display:flex; justify-content:space-between; font:400 10px/1 %s;
       letter-spacing:1px; color:#8b847b">
    <span>VIN · OEM · CROSS</span><span>4 812 903</span>
  </div>
</div>""" % (W, H, W, H, ''.join(ticks),
             H - SCAN_Y, comp('solid'), SCAN_Y, comp('blue'),
             SCAN_Y, SCAN_Y, SCAN_Y - 5, MONO, MONO)
io.open('Scan.dc.html', 'w', encoding='utf-8').write(page(bodyB))

# ============ C. Протектор ============
blocks = ['<rect x="-40" y="250" width="470" height="332" fill="#16140f"/>']
for r in range(7):
    y = 258 + r * 48
    for c in range(6):
        x = -46 + c * 72 + (36 if r % 2 else 0)
        blocks.append('<rect x="%d" y="%d" width="52" height="34" rx="7" fill="#efece8" opacity=".92"/>'
                      % (x, y))
blocks.append('<rect x="66" y="250" width="14" height="350" fill="#efece8" opacity=".92"/>')
blocks.append('<rect x="-40" y="250" width="470" height="5" fill="#efece8" opacity=".25"/>')
blocks.append('<rect x="-40" y="595" width="470" height="5" fill="#efece8" opacity=".25"/>')
tread = ('<svg width="470" height="350" viewBox="-40 250 470 350" style="position:absolute; '
         'left:-40px; top:250px" aria-hidden="true">' + ''.join(blocks) + '</svg>')

bodyC = """<div style="position:relative; width:%dpx; height:%dpx; background:#efece8;
     font-family:Heebo, system-ui, sans-serif; overflow:hidden">
  %s
  <div style="position:absolute; left:126px; top:355px">
    <svg width="138" height="92.6" viewBox="71 180 496 333" fill="none">
      <path fill="#dd6612" stroke="#efece8" stroke-width="26" stroke-linejoin="round"
            fill-rule="evenodd" d="%s"/>
      <path fill="#dd6612" fill-rule="evenodd" d="%s"/>
    </svg>
  </div>
  <div style="position:absolute; left:0; right:0; top:648px; display:flex; justify-content:center">
    <div style="font:500 20px/1 %s; letter-spacing:5px; color:#16140f">AUTOPARTS</div></div>
  <div style="position:absolute; left:0; right:0; top:682px; display:flex; justify-content:center">
    <div style="font:400 11px/1 Heebo, sans-serif; letter-spacing:.4px; color:#8b847b">מה שנוגע בכביש</div></div>
  <div style="position:absolute; left:32px; right:32px; bottom:64px; height:2px; background:#e4dfd8">
    <div style="width:48%%; height:100%%; background:#dd6612"></div>
  </div>
</div>""" % (W, H, tread, MARK_PATH, MARK_PATH, MONO)
io.open('Tread.dc.html', 'w', encoding='utf-8').write(page(bodyC))

# ============ D. Ночная смена ============
bodyD = """<div style="position:relative; width:%dpx; height:%dpx; background:#16140f;
     font-family:Heebo, system-ui, sans-serif; overflow:hidden">
  <div style="position:absolute; left:-120px; top:-160px; width:520px; height:520px;
       background:radial-gradient(circle closest-side at center, rgba(255,214,160,.22), rgba(255,214,160,.05) 46%%,
       rgba(255,214,160,0) 100%%)"></div>
  <div style="position:absolute; left:60px; top:210px; width:300px; height:300px;
       background:radial-gradient(circle closest-side at 50%% 42%%, rgba(221,102,18,.34),
       rgba(221,102,18,.07) 50%%, rgba(221,102,18,0) 100%%)"></div>

  <div style="position:absolute; left:130px; top:318px">
    <svg width="130" height="87.3" viewBox="71 180 496 333" fill="none">
      <defs><linearGradient id="lit" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ff8a2b"/><stop offset=".55" stop-color="#dd6612"/>
        <stop offset="1" stop-color="#8e3f08"/></linearGradient></defs>
      <path fill="url(#lit)" fill-rule="evenodd" d="%s"/>
    </svg>
  </div>

  <div style="position:absolute; left:0; right:0; top:448px; display:flex; justify-content:center">
    <div style="font:500 20px/1 %s; letter-spacing:5px; color:#efece8">AUTOPARTS</div></div>
  <div style="position:absolute; left:0; right:0; top:482px; display:flex; justify-content:center">
    <div style="font:400 11px/1 Heebo, sans-serif; letter-spacing:.4px; color:#8b847b">משמרת לילה</div></div>

  <div style="position:absolute; left:0; right:0; bottom:0; height:220px;
       background:linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.38))"></div>
  <div style="position:absolute; left:32px; right:32px; bottom:64px; height:2px;
       background:rgba(239,236,232,.14)">
    <div style="width:38%%; height:100%%; background:#dd6612"></div>
  </div>
</div>""" % (W, H, MARK_PATH, MONO)
io.open('Night.dc.html', 'w', encoding='utf-8').write(page(bodyD))

# ============ E. Заводка ============
R = 96
C = 2 * math.pi * R
PROG = .72
tk = []
for i in range(56):
    a = -math.pi / 2 + i * 2 * math.pi / 56
    long = (i % 7 == 0)
    r1, r2 = R + 14, R + (26 if long else 20)
    tk.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="%s"/>'
              % (195 + r1 * math.cos(a), 360 + r1 * math.sin(a),
                 195 + r2 * math.cos(a), 360 + r2 * math.sin(a),
                 '#dd6612' if i / 56.0 <= PROG else '#d6cfc5', '1.6' if long else '1'))

bodyE = """<div style="position:relative; width:%dpx; height:%dpx; background:#efece8;
     font-family:Heebo, system-ui, sans-serif; overflow:hidden">
  <svg width="%d" height="%d" style="position:absolute; inset:0" aria-hidden="true">
    %s
    <circle cx="195" cy="360" r="%d" fill="none" stroke="#e4dfd8" stroke-width="3"/>
    <circle cx="195" cy="360" r="%d" fill="none" stroke="#dd6612" stroke-width="4"
            stroke-linecap="round" stroke-dasharray="%.1f %.1f"
            transform="rotate(-90 195 360)"/>
  </svg>

  <div style="position:absolute; left:141px; top:324px">%s</div>

  <div style="position:absolute; left:0; right:0; top:512px; display:flex; justify-content:center">
    <div style="font:500 20px/1 %s; letter-spacing:5px; color:#16140f">AUTOPARTS</div></div>
  <div style="position:absolute; left:0; right:0; top:546px; display:flex; justify-content:center;
       gap:10px; align-items:baseline">
    <div style="font:500 11px/1 %s; letter-spacing:1.4px; color:#dd6612">72%%</div>
    <div style="font:400 11px/1 Heebo, sans-serif; color:#8b847b">טוען קטלוג</div></div>
</div>""" % (W, H, W, H, ''.join(tk), R, R, C * PROG, C, mark(108, '#dd6612'), MONO, MONO)
io.open('Ignition.dc.html', 'w', encoding='utf-8').write(page(bodyE))
print('Scan, Tread, Night, Ignition — готово')
