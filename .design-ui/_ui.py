# -*- coding: utf-8 -*-
"""Общие куски макетов. Значения взяты один-в-один из index.html —
   токены :root и классы .card/.tag/.chip/.btn/.num/.price/.label."""

BG, CARD, CHIP = '#efece8', '#f7f5f2', '#ece8e2'
INK, MUTED, LINE, HAIR = '#16140f', '#8b847b', '#e4dfd8', '#d6cfc5'
ORANGE = '#dd6612'
ORIG_BG, ORIG_FG = '#e2ecda', '#3c6a31'
COPY_BG, COPY_FG = '#eae6df', '#5d574f'
USED_BG, USED_FG = '#fbe4cf', '#a3560f'
SANS = "Heebo, system-ui, sans-serif"
DISP = "Rubik, Heebo, system-ui, sans-serif"
MONO = "'IBM Plex Mono', ui-monospace, Menlo, monospace"

FONTS = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
         'family=Heebo:wght@400;500;600;700&family=Rubik:wght@500;600&'
         'family=IBM+Plex+Mono:wght@400;500;600&display=swap">')

def page(body, extra_css=''):
    return f'''<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  {FONTS}
  <style>
    body {{ margin: 0; font-family: {SANS}; }}
    a {{ color: {ORANGE}; }} a:hover {{ color: #b4510c; }}
{extra_css}  </style>
</helmet>
{body}
</x-dc>
</body>
</html>
'''

def screen(inner, bg=BG):
    return (f'<div dir="rtl" style="position:relative; width:390px; height:844px; background:{bg}; '
            f'font-family:{SANS}; color:{INK}; overflow:hidden">{inner}</div>')

def ic(d, s=19, sw='2.2'):
    return (f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            f'stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">{d}</svg>')

I_BACK = '<path d="M19 12H5M12 19l-7-7 7-7"/>'
I_USER = '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'
I_CHAT = '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'
I_PACK = ('<path d="m7.5 4.3 9 5.2M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7'
          'l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>')
I_HOME = '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/>'
I_SLID = '<path d="M4 8.5h16M4 15.5h16"/><circle cx="9" cy="8.5" r="2.4"/><circle cx="15" cy="15.5" r="2.4"/>'
I_PLUS = '<path d="M12 5v14M5 12h14"/>'
I_PHONE = ('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 '
           '2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 '
           '0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>')
I_PENCIL = '<path d="M17 3a2.8 2.8 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>'
I_SEARCH = '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'
I_CHEV = '<path d="m9 6 6 6-6 6"/>'
I_CLOCK = '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>'
I_ALERT = '<path d="M12 8.5v4.5M12 16.5h.01"/><circle cx="12" cy="12" r="9"/>'
I_CHECK = '<path d="M20 6 9 17l-5-5"/>'

LOGO = ('<svg width="26" height="17" viewBox="71 180 496 333" fill="none" aria-hidden="true">'
        f'<path fill="{ORANGE}" fill-rule="evenodd" d="M72 180 L72 190 L108 365 L129 477 L134 489 L147 504 L160 511 '
        'L168 513 L468 513 L476 511 L490 503 L502 489 L507 476 L535 332 L567 182 L566 180 Z M97 202 L138 416 L166 351 '
        'L225 202 Z M412 202 L474 357 L484 378 L485 384 L497 410 L498 416 L500 415 L541 202 Z M318 245 L273 356 L270 '
        '360 L269 366 L256 394 L250 412 L247 416 L243 429 L240 433 L232 456 L224 472 L218 487 L219 489 L418 488 L399 '
        '440 L315 440 L315 436 L322 422 L339 377 L372 376 L319 245 Z"/></svg>')

def iconbtn(d, s=18):
    return (f'<span style="width:44px; height:44px; border-radius:14px; background:{CARD}; display:flex; '
            f'align-items:center; justify-content:center; flex:none; color:{INK}">{ic(d, s)}</span>')

def top(back=False, actions=True, gear=False):
    left = (iconbtn(I_BACK) if back else '')
    brand = (f'<span style="display:flex; align-items:center; gap:12px; direction:ltr">{LOGO}'
             f'<b style="font:600 13px/1 {MONO}; letter-spacing:1.6px">AUTOPARTS</b></span>')
    right = ''
    if gear:
        right = iconbtn('<circle cx="12" cy="12" r="2.7"/><path d="M12 4 13.4 5.9a6.3 6.3 0 0 1 2.1 1.2l2.3-.4.9 1.6'
                        '-1.5 1.8a6 6 0 0 1 0 2.5l1.5 1.8-.9 1.6-2.3-.4a6.3 6.3 0 0 1-2.1 1.2L12 20l-1.4-1.9a6.3 6.3 '
                        '0 0 1-2.1-1.2l-2.3.4-.9-1.6L6.8 14a6 6 0 0 1 0-2.5L5.3 9.7l.9-1.6 2.3.4a6.3 6.3 0 0 1 2.1-1.2z"/>')
    elif actions:
        right = (f'<span style="display:flex; gap:8px">{iconbtn(I_USER)}{iconbtn(I_CHAT)}</span>')
    return (f'<div style="display:flex; align-items:center; justify-content:space-between; padding:20px 20px 0">'
            f'{right or "<span></span>"}<span style="display:flex; align-items:center; gap:8px">{brand}{left}</span></div>')

def dock(active='home'):
    tabs = [('home', I_HOME), ('stock', I_PACK), ('chats', I_CHAT), ('profile', I_USER)]
    cells = ''
    for key, d in tabs:
        on = key == active
        bg = ('background:#fdfcfb; box-shadow:0 2px 8px rgba(22,20,15,.12)' if on else 'background:none')
        cells += (f'<span style="width:44px; height:44px; border-radius:999px; display:flex; align-items:center; '
                  f'justify-content:center; color:{INK}; {bg}">{ic(d, 21)}</span>')
    return (f'<div style="position:absolute; left:0; right:0; bottom:26px; display:flex; align-items:center; '
            f'justify-content:center; gap:12px">'
            f'<span style="width:56px; height:56px; border-radius:999px; background:{CARD}; color:{INK}; display:flex; '
            f'align-items:center; justify-content:center; box-shadow:0 8px 22px rgba(22,20,15,.10)">{ic(I_SLID, 21)}</span>'
            f'<span style="display:flex; align-items:center; gap:4px; border-radius:999px; padding:12px; '
            f'background:rgba(247,245,242,.94); box-shadow:0 12px 34px rgba(22,20,15,.16), 0 2px 8px rgba(22,20,15,.07), '
            f'inset 0 0 0 1px rgba(255,255,255,.5)">{cells}</span>'
            f'<span style="width:56px; height:56px; border-radius:999px; background:{INK}; color:#fff; display:flex; '
            f'align-items:center; justify-content:center">{ic(I_PLUS, 22)}</span>'
            f'</div>')

TAGS = {'orig': ('מקורי', ORIG_BG, ORIG_FG), 'copy': ('חלופי', COPY_BG, COPY_FG), 'used': ('משומש', USED_BG, USED_FG)}

def tag(kind):
    t, bg, fg = TAGS[kind]
    return (f'<span style="display:inline-block; padding:8px 11px; border-radius:999px; background:{bg}; '
            f'color:{fg}; font:500 11px/1 {SANS}">{t}</span>')

def num(text, oem=False):
    bg, fg = ('#e7ecdf', '#3f5730') if oem else (CHIP, '#4f4941')
    return (f'<span style="display:inline-block; padding:4px 9px; border-radius:999px; background:{bg}; color:{fg}; '
            f'font:500 11px/1 {MONO}; letter-spacing:.3px; direction:ltr">{text}</span>')

def label(text, color=MUTED, size=11):
    return f'<span style="font:500 {size}px/1.35 {SANS}; color:{color}">{text}</span>'

def mono(text, size=13, weight=500, color=INK):
    return f'<span style="font:{weight} {size}px/1.3 {MONO}; direction:ltr; unicode-bidi:isolate; color:{color}">{text}</span>'

def card(inner, pad='16px 17px', bg=CARD, extra=''):
    return f'<div style="background:{bg}; border-radius:20px; padding:{pad}; {extra}">{inner}</div>'
