FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&amp;family=IBM+Plex+Mono:wght@400;500&amp;display=swap">'

MARK_PATH = 'M72 180 L72 190 L108 365 L129 477 L134 489 L147 504 L160 511 L168 513 L468 513 L476 511 L490 503 L502 489 L507 476 L535 332 L567 182 L566 180 Z M97 202 L138 416 L166 351 L225 202 Z M412 202 L474 357 L484 378 L485 384 L497 410 L498 416 L500 415 L541 202 Z M318 245 L273 356 L270 360 L269 366 L256 394 L250 412 L247 416 L243 429 L240 433 L232 456 L224 472 L218 487 L219 489 L418 488 L399 440 L315 440 L315 436 L322 422 L339 377 L372 376 L319 245 Z'

def mark(w, fill='#dd6612', extra=''):
    h = round(w * 333 / 496, 1)
    return ('<svg width="%s" height="%s" viewBox="71 180 496 333" fill="none" %s>'
            '<path fill="%s" fill-rule="evenodd" d="%s"/></svg>' % (w, h, extra, fill, MARK_PATH))

def mark_outline(w, stroke='#dd6612', sw=9, extra=''):
    h = round(w * 333 / 496, 1)
    return ('<svg width="%s" height="%s" viewBox="71 180 496 333" fill="none" %s>'
            '<path fill="none" stroke="%s" stroke-width="%s" stroke-linejoin="round" '
            'fill-rule="evenodd" d="%s"/></svg>' % (w, h, extra, stroke, sw, MARK_PATH))

def page(body, style=''):
    return ('<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n'
            '  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n'
            '<helmet>\n  ' + FONTS + '\n  <style>\n'
            '    body { margin: 0; }\n'
            '    a { color: #dd6612; } a:hover { color: #b4510c; }\n'
            + style + '  </style>\n</helmet>\n' + body + '\n</x-dc>\n</body>\n</html>\n')
