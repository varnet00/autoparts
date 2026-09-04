# -*- coding: utf-8 -*-
import io
exec(open('_ui.py').read())

W = lambda inner: screen(inner)

# ============================================================
# 1. Main — כרטיס ההצעה
# ============================================================
def cond_bar(pct):
    """מצב החלק כפס. אותה שפה כמו במחוון בטופס הפרסום: הצבוע הוא
       מה שנשאר. מספר לבדו צריך פענוח, פס נקרא במבט."""
    return (f'<div style="display:flex; flex-direction:column; gap:8px">'
            f'<div style="display:flex; align-items:baseline; justify-content:space-between">'
            f'{label("מצב החלק")}'
            f'<span style="font:600 20px/1 {MONO}">{pct}%</span></div>'
            f'<div style="height:6px; border-radius:999px; background:{CHIP}; overflow:hidden; display:flex">'
            f'<span style="width:{pct}%; background:{ORANGE}"></span></div>'
            f'<div style="display:flex; justify-content:space-between">{label("שחוק")}{label("כמעט חדש")}</div>'
            f'</div>')

offer = W(
  top(back=True, actions=False)
  + '<div style="padding:22px 20px 0; display:flex; flex-direction:column; gap:20px">'

    # זהות: שם, מק״ט פעם אחת, ומצב
    + '<div style="display:flex; flex-direction:column; gap:8px">'
      + f'<span style="font:600 22px/1.3 {DISP}">רפידות בלימה קדמיות</span>'
      + '<div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap">'
        + mono('04465-02220', 15, 600) + tag('used')
      + '</div>'
      + f'<span style="font:400 13px/1.4 {MONO}; direction:ltr; unicode-bidi:isolate; color:{MUTED}">'
        'Toyota Corolla E210 · 2016—2023</span>'
    + '</div>'

    + card(cond_bar(60))

    # מחיר ומלאי — הסיבה שנכנסו למסך
    + card(
        '<div style="display:flex; align-items:flex-end; justify-content:space-between; gap:16px">'
        + '<div style="display:flex; flex-direction:column; gap:4px">'
          + label('מחיר') + f'<span style="font:600 30px/1 {MONO}; direction:ltr">₪ 120</span>'
        + '</div>'
        + '<div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end">'
          + f'<span style="display:inline-flex; align-items:center; gap:6px; padding:6px 11px; border-radius:999px; '
            f'background:{ORIG_BG}; color:{ORIG_FG}; font:500 11px/1 {SANS}">{ic(I_CHECK, 13)} יחידה אחת במלאי</span>'
          + label('הזול מבין 3 הספקים')
        + '</div></div>')

    # הספק
    + card(
        '<div style="display:flex; flex-direction:column; gap:14px">'
        + '<div style="display:flex; align-items:center; gap:12px">'
          + f'<span style="width:44px; height:44px; border-radius:999px; background:{INK}; color:#fff; display:flex; '
            f'align-items:center; justify-content:center; font:600 15px/1 {MONO}; flex:none">פ</span>'
          + '<div style="display:flex; flex-direction:column; gap:3px; flex:1; min-width:0">'
            + f'<span style="font:500 15px/1.25 {SANS}">פירוקים אשדוד</span>'
            + label('אשדוד · 640 ביקורות · 4.4')
          + '</div>'
          + f'<span style="color:{MUTED}">{ic(I_CHEV, 18)}</span>'
        + '</div>'
        + f'<div style="height:1px; background:{LINE}"></div>'
        + '<div style="display:flex; gap:10px">'
          + f'<span style="flex:1; min-height:52px; border-radius:999px; background:{INK}; color:#fff; display:flex; '
            f'align-items:center; justify-content:center; font:500 15px/1 {SANS}">בקשה בצ׳אט</span>'
          + f'<span style="width:52px; min-height:52px; border-radius:999px; background:{CHIP}; color:{INK}; '
            f'display:flex; align-items:center; justify-content:center">{ic(I_PHONE, 19)}</span>'
        + '</div></div>')

    # חזרה למק״ט
    + card(
        '<div style="display:flex; align-items:center; justify-content:space-between; gap:12px">'
        + '<div style="display:flex; flex-direction:column; gap:3px">'
          + f'<span style="font:500 15px/1.25 {SANS}">עוד 2 ספקים לאותו מק״ט</span>'
          + label('₪ 210 · ₪ 465 · מקוריים')
        + '</div>'
        + f'<span style="color:{MUTED}">{ic(I_CHEV, 18)}</span></div>',
        extra=f'border:1px solid {LINE}; background:none')
  + '</div>'
  + dock('home'))
io.open('Main.dc.html', 'w', encoding='utf-8').write(page(offer))
print('Main — הצעה')

# ============================================================
# 2. Position — מסך המק״ט עם סינון מצב על ההצעות
# ============================================================
def chip(text, on=False, count=None):
    bg, fg = (INK, '#fff') if on else (CHIP, INK)
    tail = (f'<span style="opacity:.55; font-family:{MONO}"> {count}</span>' if count is not None else '')
    return (f'<span style="min-height:40px; display:inline-flex; align-items:center; padding:0 16px; '
            f'border-radius:999px; background:{bg}; color:{fg}; font:500 13px/1 {SANS}; white-space:nowrap">'
            f'{text}{tail}</span>')

def offer_row(name, city, price, kind, extra_line='', stock=True, best=False):
    stripe = ORANGE if best else (ORIG_FG if stock else HAIR)
    badge = (f'<span style="display:inline-block; padding:3px 8px; border-radius:999px; background:{ORANGE}; '
             f'color:#fff; font:600 10px/1.4 {SANS}">הזול</span>' if best else '')
    return (f'<div style="display:flex; background:{CARD}; border-radius:20px; overflow:hidden">'
            f'<span style="width:3px; background:{stripe}; flex:none"></span>'
            f'<div style="flex:1; display:flex; align-items:center; gap:14px; padding:14px 16px; min-width:0">'
            f'<div style="flex:1; display:flex; flex-direction:column; gap:5px; min-width:0">'
            f'<div style="display:flex; align-items:center; gap:8px">'
            f'<span style="font:500 15px/1.25 {SANS}">{name}</span>{badge}</div>'
            f'{label(city)}'
            f'<div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; padding-top:2px">'
            f'{tag(kind)}{extra_line}</div></div>'
            f'<div style="display:flex; flex-direction:column; gap:3px; align-items:flex-end; flex:none">'
            f'<span style="font:600 17px/1 {MONO}; direction:ltr">₪ {price}</span>'
            f'{label("במלאי" if stock else "אזל", ORIG_FG if stock else MUTED, 10)}</div>'
            f'</div></div>')

pos = W(
  top(back=True, actions=False)
  + '<div style="padding:22px 20px 0; display:flex; flex-direction:column; gap:18px">'
    + '<div style="display:flex; flex-direction:column; gap:7px">'
      + label('Toyota')
      + f'<span style="font:600 27px/1.1 {MONO}; direction:ltr; letter-spacing:.5px">04465-02220</span>'
      + f'<span style="font:400 15px/1.35 {SANS}; color:{MUTED}">רפידות בלימה קדמיות</span>'
      + f'<span style="font:500 11px/1.35 {SANS}; color:{MUTED}">ידוע גם כ {mono("04465-YZZQ7", 11)}</span>'
    + '</div>'

    + card(
        '<div style="display:flex; flex-direction:column; gap:12px">'
        + '<div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px">'
          + label('מתאים ל')
          + f'<span style="font:400 13px/1.4 {MONO}; direction:ltr; unicode-bidi:isolate; text-align:end">'
            'Toyota Corolla E210 · 2016—2023</span></div>'
        + '<div style="display:flex; align-items:baseline; justify-content:space-between; gap:12px">'
          + label('מחיר ממוצע')
          + '<span style="display:flex; align-items:baseline; gap:10px">'
            + f'<span style="font:400 11px/1 {MONO}; color:{MUTED}; direction:ltr">₪ 120—₪ 465</span>'
            + f'<span style="font:600 20px/1 {DISP}">₪ 265</span></span></div>'
        + '</div>')

    # סינון המצב יושב על ההצעות, שם הוא באמת פועל
    + '<div style="display:flex; flex-direction:column; gap:10px">'
      + '<div style="display:flex; align-items:baseline; justify-content:space-between">'
        + f'<span style="font:500 15px/1 {SANS}">ספקים · 3</span>' + label('הזול קודם')
      + '</div>'
      + '<div style="display:flex; gap:8px; flex-wrap:wrap">'
        + chip('הכל', True, 3) + chip('מקורי', False, 2) + chip('משומש', False, 1)
      + '</div>'
    + '</div>'

    + '<div style="display:flex; flex-direction:column; gap:12px">'
      + offer_row('פירוקים אשדוד', 'אשדוד', 120, 'used', label('מצב 60%'), True, best=True)
      + offer_row('חלקי צפון בע״מ', 'חיפה · מאומת', 210, 'orig', mono('ADVICS', 11, 400, MUTED))
      + offer_row('מרכז חלקים תל אביב', 'תל אביב · מאומת', 465, 'orig', mono('TOYOTA GENUINE', 11, 400, MUTED))
    + '</div>'
  + '</div>'
  + dock('home'))
io.open('Position.dc.html', 'w', encoding='utf-8').write(page(pos))
print('Position — מק״ט')

# ============================================================
# 3. Home — היסטוריית חיפוש
# ============================================================
def recent(numb, name, meta, price):
    return (f'<div style="display:flex; align-items:center; gap:14px; background:{CARD}; border-radius:20px; '
            f'padding:13px 16px">'
            f'<span style="color:{MUTED}; flex:none">{ic(I_CLOCK, 17)}</span>'
            f'<div style="flex:1; display:flex; flex-direction:column; gap:4px; min-width:0">'
            f'{mono(numb, 14, 600)}'
            f'<span style="font:400 13px/1.3 {SANS}; color:{MUTED}; overflow:hidden; text-overflow:ellipsis; '
            f'white-space:nowrap">{name}</span></div>'
            f'<div style="display:flex; flex-direction:column; gap:3px; align-items:flex-end; flex:none">'
            f'<span style="font:600 15px/1 {MONO}; direction:ltr">{price}</span>{label(meta, MUTED, 10)}</div>'
            f'</div>')

home = W(
  top(actions=True)
  + '<div style="padding:36px 20px 0; display:flex; flex-direction:column; gap:24px">'
    + f'<div style="font:600 27px/1.32 {DISP}; text-wrap:pretty">כל חלק. כל רכב.<br>מחיר אחד וברור.</div>'
    + f'<div style="display:flex; align-items:center; gap:12px; background:{CARD}; border-radius:999px; '
      f'padding:16px 20px; box-shadow:0 6px 20px rgba(22,20,15,.07)">'
      + f'<span style="width:44px; height:44px; border-radius:999px; background:{INK}; color:#fff; display:flex; '
        f'align-items:center; justify-content:center; flex:none">{ic(I_SEARCH, 18)}</span>'
      + f'<span style="flex:1; font:400 15px/1 {SANS}; color:{MUTED}">שם חלק או מספר מק״ט</span></div>'

    # מי שמחפש עשרה מק״טים ביום מקליד את אותם מספרים שוב ושוב
    + '<div style="display:flex; flex-direction:column; gap:12px">'
      + '<div style="display:flex; align-items:baseline; justify-content:space-between">'
        + f'<span style="font:500 15px/1 {SANS}">חיפושים אחרונים</span>'
        + f'<span style="font:500 11px/1 {SANS}; color:{MUTED}; text-decoration:underline; '
          'text-underline-offset:3px">נקה</span></div>'
      + '<div style="display:flex; flex-direction:column; gap:10px">'
        + recent('04465-02220', 'רפידות בלימה קדמיות · Toyota', '3 ספקים', 'מ־₪ 120')
        + recent('90915-YZZD2', 'מסנן שמן · Toyota', 'ספק אחד', '₪ 38')
        + recent('58411-2K000', 'דיסק בלם אחורי · Hyundai', '2 ספקים', 'מ־₪ 198')
      + '</div>'
    + '</div>'
  + '</div>'
  + dock('home'))
io.open('Home.dc.html', 'w', encoding='utf-8').write(page(home))
print('Home — בית')

# ============================================================
# 4. Stock — קבינט הספק
# ============================================================
def stock_row(name, numb, price, qty, kind, warn=False):
    state = (f'<span style="display:inline-flex; align-items:center; gap:5px; padding:4px 9px; border-radius:999px; '
             f'background:{USED_BG}; color:{USED_FG}; font:500 10px/1.3 {SANS}">{ic(I_ALERT, 12)} לא מקושר</span>'
             if warn else
             (f'{label(f"×{qty} במלאי", ORIG_FG, 10)}' if qty else f'{label("אזל", USED_FG, 10)}'))
    return (f'<div style="display:flex; align-items:center; gap:14px; background:{CARD}; border-radius:20px; '
            f'padding:12px 14px">'
            f'<div style="flex:1; display:flex; flex-direction:column; gap:5px; min-width:0">'
            f'<span style="font:500 15px/1.25 {SANS}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap">'
            f'{name}</span>'
            f'<div style="display:flex; align-items:center; gap:9px; flex-wrap:wrap">'
            f'{mono(numb, 12, 600, MUTED)}{state}</div></div>'
            f'<span style="font:600 16px/1 {MONO}; direction:ltr; flex:none">₪ {price}</span>'
            f'<span style="width:40px; height:40px; border-radius:14px; background:{CHIP}; color:{INK}; display:flex; '
            f'align-items:center; justify-content:center; flex:none">{ic(I_PENCIL, 16)}</span>'
            f'</div>')

stock = W(
  top(gear=True, actions=False)
  + '<div style="padding:20px 20px 0; display:flex; flex-direction:column; gap:18px">'
    + '<div style="display:flex; flex-direction:column; gap:4px">'
      + f'<span style="font:600 20px/1.2 {DISP}">המלאי שלי</span>'
      + label('חלקי צפון בע״מ · מוכר מאומת')
    + '</div>'

    # מה שדורש פעולה עולה למעלה: בקשות ופוזיציות בלי קישור
    + card(
        '<div style="display:flex; align-items:center; gap:14px">'
        + f'<span style="width:44px; height:44px; border-radius:14px; background:{ORANGE}; color:#fff; display:flex; '
          f'align-items:center; justify-content:center; flex:none; font:600 17px/1 {MONO}">28</span>'
        + '<div style="flex:1; display:flex; flex-direction:column; gap:3px">'
          + f'<span style="font:500 15px/1.25 {SANS}">בקשות ממתינות</span>'
          + label('הכי ישנה — לפני יומיים')
        + '</div>'
        + f'<span style="color:{MUTED}">{ic(I_CHEV, 18)}</span></div>')

    + '<div style="display:flex; gap:8px; flex-wrap:wrap">'
      + chip('הכל', True, 10) + chip('במלאי', False, 8) + chip('אזלו', False, 1) + chip('לא מקושר', False, 1)
    + '</div>'

    + '<div style="display:flex; flex-direction:column; gap:10px">'
      + stock_row('רפידות בלימה קדמיות', '04465-02220', 210, 6, 'orig')
      + stock_row('מסנן שמן', '90915-YZZD2', 38, 60, 'orig')
      + stock_row('משאבת מים', 'WP-2214', 180, 2, 'copy', warn=True)
      + stock_row('גומיות מייצב', '48815-02200', 45, 0, 'copy')
      + stock_row('צינור מים עליון', '16571-0T030', 95, 2, 'copy')
      + stock_row('ערכת כלים 108 חלקים', 'TLS-108', 289, 6, 'copy')
    + '</div>'
  + '</div>'
  + dock('stock'))
io.open('Stock.dc.html', 'w', encoding='utf-8').write(page(stock))
print('Stock — מלאי')

# ============================================================
# 5. Cards — גיליון הרכיב שחוזר בכל רשימה
# ============================================================
def pos_card(numb, brand, name, fits, kinds, suppliers, low, avg=None, stock=True, aka=None, matched=None):
    stripe = ORIG_FG if stock else HAIR
    tags = ''.join(tag(k) for k in kinds)
    note = ''
    if matched:
        note = (f'<span style="font:500 10px/1.35 {SANS}; color:{ORANGE}">חיפשתם {mono(matched, 10, 500, ORANGE)} '
                '· המק״ט הראשי היום</span>')
    elif aka:
        note = f'<span style="font:500 10px/1.35 {SANS}; color:{MUTED}">ידוע גם כ {mono(aka, 10, 500, MUTED)}</span>'
    return (f'<div style="display:flex; background:{CARD}; border-radius:20px; overflow:hidden">'
            f'<span style="width:3px; background:{stripe}; flex:none"></span>'
            f'<div style="flex:1; display:flex; align-items:flex-start; gap:14px; padding:15px 16px; min-width:0">'
            f'<div style="flex:1; display:flex; flex-direction:column; gap:6px; min-width:0">'
            f'<div style="display:flex; align-items:baseline; gap:9px; flex-wrap:wrap">'
            f'{mono(numb, 15, 600)}{label(brand)}</div>'
            f'<span style="font:400 13px/1.3 {SANS}; color:{MUTED}">{name}</span>'
            f'{note}'
            f'<span style="font:400 11px/1.3 {MONO}; direction:ltr; unicode-bidi:isolate; color:{MUTED}">{fits}</span>'
            f'<div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; padding-top:3px">'
            f'{tags}{label(suppliers)}</div></div>'
            f'<div style="display:flex; flex-direction:column; gap:3px; align-items:flex-end; flex:none">'
            f'<span style="font:600 17px/1 {MONO}; direction:ltr">{low}</span>'
            + (f'{label("ממוצע " + avg, MUTED, 10)}' if avg else f'{label("אין במלאי", MUTED, 10)}')
            + '</div></div></div>')

cards = screen(
  '<div style="padding:24px 20px; display:flex; flex-direction:column; gap:22px">'
  + f'<div style="display:flex; flex-direction:column; gap:5px">'
    + f'<span style="font:600 20px/1.2 {DISP}">כרטיס מק״ט · מצבים</span>'
    + label('הרכיב שחוזר בתוצאות החיפוש, בעשוי־להתאים ובמדף')
  + '</div>'

  + '<div style="display:flex; flex-direction:column; gap:9px">'
    + label('רגיל · יש מלאי')
    + pos_card('04465-02220', 'Toyota', 'רפידות בלימה קדמיות', 'Toyota Corolla E210 · 2016—2023',
               ['used', 'orig'], '3 ספקים', 'מ־₪ 120', '₪ 265', aka='04465-YZZQ7')
  + '</div>'

  + '<div style="display:flex; flex-direction:column; gap:9px">'
    + label('הגיעו דרך מק״ט ישן')
    + pos_card('04465-02220', 'Toyota', 'רפידות בלימה קדמיות', 'Toyota Corolla E210 · 2016—2023',
               ['used', 'orig'], '3 ספקים', 'מ־₪ 120', '₪ 265', matched='04465-YZZQ7')
  + '</div>'

  + '<div style="display:flex; flex-direction:column; gap:9px">'
    + label('ספק אחד · אין מה להשוות')
    + pos_card('W712/75', 'Mann-Filter', 'מסנן שמן Mann', 'Toyota Corolla / Lexus · 2010—2024',
               ['copy'], 'ספק אחד', '₪ 29')
  + '</div>'

  + '<div style="display:flex; flex-direction:column; gap:9px">'
    + label('מוכר לקטלוג · אף אחד לא מוכר')
    + pos_card('P83133', 'Brembo', 'רפידות בלימה', 'Toyota Corolla E210 · 2016—2023',
               [], '—', '—', stock=False)
  + '</div>'
  + '</div>').replace('height:844px', 'height:820px')
io.open('Cards.dc.html', 'w', encoding='utf-8').write(page(cards))
print('Cards — גיליון רכיב')
