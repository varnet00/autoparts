# -*- coding: utf-8 -*-
import io, math
exec(open('_common.py').read())
MONO = "'IBM Plex Mono', monospace"
FW, FH = 130, 282          # мини-экран = 1/3 от 390x844
SW, SH = 700, 400

def frame(inner, bg='#efece8'):
    return ('<div style="position:relative; width:%dpx; height:%dpx; background:%s; '
            'border-radius:10px; overflow:hidden; box-shadow:0 1px 0 #e4dfd8, 0 8px 22px -14px rgba(22,20,15,.5)">'
            '%s</div>' % (FW, FH, bg, inner))

def strip(name, axis, beats, times):
    cells = []
    for (b, t) in zip(beats, times):
        cells.append('<div style="display:flex; flex-direction:column; gap:10px">'
                     '<div style="font:500 10px/1 %s; letter-spacing:1.2px; color:#8b847b">%s</div>'
                     '%s</div>' % (MONO, t, b))
    return page("""<div style="width:%dpx; height:%dpx; background:#f7f5f2; box-sizing:border-box;
     padding:24px; font-family:Heebo, system-ui, sans-serif; display:flex; flex-direction:column; gap:14px">
  <div style="display:flex; flex-direction:column; gap:5px">
    <div style="font:500 15px/1.2 Heebo, sans-serif; color:#16140f">%s</div>
    <div style="font:400 11px/1.4 Heebo, sans-serif; color:#8b847b">%s</div>
  </div>
  <div style="display:flex; gap:28px">%s</div>
</div>""" % (SW, SH, name, axis, ''.join(cells)))

def mini_mark(x, y, w, fill='#dd6612', op=1):
    h = round(w * 333 / 496, 1)
    return ('<div style="position:absolute; left:%spx; top:%spx; opacity:%s">%s</div>'
            % (x, y, op, mark(w, fill)))

def mini_mark_o(x, y, w, sw=16, stroke='#dd6612', op=1):
    return ('<div style="position:absolute; left:%spx; top:%spx; opacity:%s">%s</div>'
            % (x, y, op, mark_outline(w, stroke, sw)))

def word(y, col='#16140f', op=1, size=7):
    return ('<div style="position:absolute; left:0; right:0; top:%dpx; display:flex; '
            'justify-content:center; opacity:%s"><div style="font:500 %dpx/1 %s; '
            'letter-spacing:1.8px; color:%s">AUTOPARTS</div></div>' % (y, op, size, MONO, col))

def wheel(x, y, d=22, op=1):
    return ('<div style="position:absolute; left:%spx; top:%spx; width:%dpx; height:%dpx; '
            'border-radius:50%%; background:#1c1a17; opacity:%s; '
            'box-shadow:inset 0 0 0 5px #16140f, inset 0 0 0 7px #cfcac2">'
            '</div>' % (x, y, d, d, op))

# ---------- A. Разнос ----------
def dashes(op):
    ln = []
    for a in range(0, 360, 60):
        r = math.radians(a)
        ln.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#d6cfc5" '
                  'stroke-width="1" stroke-dasharray="1.5 3"/>'
                  % (65 + 26 * math.cos(r), 117 + 26 * math.sin(r),
                     65 + 56 * math.cos(r), 117 + 56 * math.sin(r)))
    return '<svg width="130" height="282" style="position:absolute; inset:0; opacity:%s">%s</svg>' % (op, ''.join(ln))

def part(x, y, s=13, op=1):
    return ('<div style="position:absolute; left:%spx; top:%spx; width:%dpx; height:%dpx; '
            'border:1.2px solid #16140f; opacity:%s; border-radius:3px"></div>' % (x, y, s, s, op))

A = [
  frame(dashes('.5')),
  frame(dashes('.9') + part(6, 40, 13, .8) + part(108, 62, 13, .8) + part(14, 200, 13, .8)
        + part(104, 196, 13, .8) + part(58, 4, 13, .8) + mini_mark_o(45, 104, 40, 18, '#dd6612', .35)),
  frame(dashes('1') + part(28, 78, 12) + part(88, 84, 12) + part(30, 148, 12) + part(88, 146, 12)
        + part(58, 62, 12) + mini_mark_o(45, 104, 40, 18, '#dd6612', .9)),
  frame(mini_mark(45, 104, 40) + word(160) ),
]

# ---------- B. Диагностика ----------
def scan(p, solid_word=False):
    yy = int(282 * p)
    top = ('<div style="position:absolute; inset:0; clip-path:inset(0 0 %dpx 0)">%s%s</div>'
           % (282 - yy, mini_mark(45, 104, 40), word(160)))
    bot = ('<div style="position:absolute; inset:0; clip-path:inset(%dpx 0 0 0)">%s%s</div>'
           % (yy, mini_mark_o(45, 104, 40, 16, '#dd6612', .5), word(160, '#8b847b', .55)))
    line = ('<div style="position:absolute; left:0; right:0; top:%dpx; height:1px; background:#dd6612; '
            'box-shadow:0 0 10px 1px rgba(221,102,18,.5)"></div>' % yy) if 0 < p < 1 else ''
    return frame(top + bot + line)

B = [scan(0.02), scan(0.42), scan(0.72), frame(mini_mark(45, 104, 40) + word(160))]

# ---------- C. Протектор ----------
def band(dx, punched):
    bl = ['<rect x="%d" y="84" width="220" height="112" fill="#16140f"/>' % (-24 + dx)]
    for r in range(3):
        y = 90 + r * 36
        for c in range(6):
            bl.append('<rect x="%d" y="%d" width="26" height="24" rx="5" fill="#efece8" opacity=".92"/>'
                      % (-30 + c * 36 + (18 if r % 2 else 0) + dx, y))
    bl.append('<rect x="%d" y="84" width="7" height="112" fill="#efece8" opacity=".92"/>' % (18 + dx))
    sv = ('<svg width="200" height="282" style="position:absolute; left:0; top:0" aria-hidden="true">'
          '%s</svg>' % ''.join(bl))
    mk = ('<div style="position:absolute; left:45px; top:104px">'
          '<svg width="40" height="26.9" viewBox="71 180 496 333" fill="none">'
          '<path fill="#dd6612" stroke="#16140f" stroke-width="30" stroke-linejoin="round" '
          'fill-rule="evenodd" d="%s"/><path fill="#dd6612" fill-rule="evenodd" d="%s"/></svg></div>'
          % (MARK_PATH, MARK_PATH)) if punched else ''
    return sv + mk

C = [frame(band(-150, False)), frame(band(-70, False)),
     frame(band(0, True)), frame(band(0, True) + word(206))]

# ---------- D. Ночная смена ----------
def night(lightx, markop, wordop, light=False):
    if light:
        return frame(mini_mark(45, 104, 40) + word(160), '#efece8')
    glow = ('<div style="position:absolute; left:%dpx; top:20px; width:190px; height:190px; '
            'background:radial-gradient(circle at center, rgba(255,214,160,.26), rgba(255,214,160,0) 68%%)">'
            '</div>' % lightx)
    return frame(glow + mini_mark(45, 104, 40, '#dd6612', markop)
                 + word(160, '#efece8', wordop), '#16140f')

D = [night(-170, .05, 0), night(-70, .55, 0), night(10, 1, .9), night(0, 1, 1, True)]

# ---------- E. Заводка ----------
def dial(p):
    R = 40
    Cc = 2 * math.pi * R
    tk = []
    for i in range(28):
        a = -math.pi / 2 + i * 2 * math.pi / 28
        on = (i / 28.0) <= p
        tk.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="1"/>'
                  % (65 + (R + 6) * math.cos(a), 117 + (R + 6) * math.sin(a),
                     65 + (R + 10) * math.cos(a), 117 + (R + 10) * math.sin(a),
                     '#dd6612' if on else '#d6cfc5'))
    return frame(
      '<svg width="130" height="282" style="position:absolute; inset:0">%s'
      '<circle cx="65" cy="117" r="%d" fill="none" stroke="#e4dfd8" stroke-width="2"/>'
      '<circle cx="65" cy="117" r="%d" fill="none" stroke="#dd6612" stroke-width="2" '
      'stroke-linecap="round" stroke-dasharray="%.1f %.1f" transform="rotate(-90 65 117)"/></svg>%s%s'
      % (''.join(tk), R, R, Cc * p, Cc,
         mini_mark(51, 108, 28, '#dd6612', 1 if p > .9 else .32),
         word(178) if p > .9 else ''))

E = [dial(0.0), dial(0.3), dial(0.72), dial(1.0)]

T = ['0.0s', '0.4s', '0.8s', '1.2s']
io.open('MainBeats.dc.html', 'w', encoding='utf-8').write(strip(
  'A · Разнос — детали слетаются в знак',
  'Материал сцены — сам товар. Взрыв-схема из каталога собирается в логотип: болт, диск, свеча, пружина, фильтр, поршень с артикулами.',
  A, T))
io.open('ScanBeats.dc.html', 'w', encoding='utf-8').write(strip(
  'B · Диагностика — луч проявляет знак',
  'Точность и доверие. Луч сканера идёт сверху вниз: под ним чертёж, над ним готовая марка. Заставка = проверка перед покупкой.',
  B, ['0.0s', '0.35s', '0.7s', '1.0s']))
io.open('TreadBeats.dc.html', 'w', encoding='utf-8').write(strip(
  'C · Протектор — знак вырублен в шине',
  'Фактура и масштаб макро. Полоса протектора проезжает кадр и оставляет знак, вырубленный в резине. Самый графичный вариант.',
  C, ['0.0s', '0.3s', '0.6s', '1.0s']))
io.open('NightBeats.dc.html', 'w', encoding='utf-8').write(strip(
  'D · Ночная смена — свет лампы и переход в день',
  'Настроение и контраст. Тёмный гараж, тёплая лампа выхватывает знак, и экран растворяется в светлый фон приложения.',
  D, ['0.0s', '0.4s', '0.9s', '1.4s']))
io.open('IgnitionBeats.dc.html', 'w', encoding='utf-8').write(strip(
  'E · Заводка — шкала показывает реальную загрузку',
  'Заставка работает: дуга — настоящий прогресс загрузки каталога, а не декорация. Ждать понятнее, ожидание кажется короче.',
  E, ['0.0s', '0.4s', '0.9s', '1.3s']))
print('фильмстрипы готовы')
