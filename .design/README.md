# Направления заставки

Исходники дизайн-канваса с концепциями заставки. Одиннадцать направлений
на двух страницах канваса; у каждого ключевой кадр (артборд 390×844)
и раскадровка движения (700×400).

## Волна 1 · A–E

- `Main.dc.html` / `MainBeats.dc.html` — A · Разнос
- `Scan.dc.html` / `ScanBeats.dc.html` — B · Диагностика ★ отложен как понравившийся
- `Tread.dc.html` / `TreadBeats.dc.html` — C · Протектор
- `Night.dc.html` / `NightBeats.dc.html` — D · Ночная смена
- `Ignition.dc.html` / `IgnitionBeats.dc.html` — E · Заводка

## Волна 2 · F–J

Намеренно по другим осям, чем первая волна: не свет и не движение по
экрану, а текст, масса, поверхность и предмет.

- `Article.dc.html` / `ArticleBeats.dc.html` — F · Артикул
- `Catalog.dc.html` / `CatalogBeats.dc.html` — G · Каталог
- `Stencil.dc.html` / `StencilBeats.dc.html` — H · Трафарет
- `Label.dc.html` / `LabelBeats.dc.html` — I · Этикетка
- `Cast.dc.html` / `CastBeats.dc.html` — J · Литьё
- `Draft.dc.html` / `DraftBeats.dc.html` — K · Чертёж

`canvas.json` — страницы, раскладка артбордов и заметки на канвасе.

Артборды генерируются скриптами `gen1.py`…`gen6.py` (общие куски —
знак, шрифты, обёртка страницы — в `_common.py`; `gen5.py` и `gen6.py` переиспользуют
вёрстку раскадровок из `gen3.py`), чтобы геометрию можно было править
числами, а не руками в разметке. Токены взяты из `index.html`: #dd6612,
фон #efece8, чернила #16140f, приглушённый #8b847b, линия #e4dfd8,
Heebo и IBM Plex Mono.

Собранный канвас в репозиторий не кладём — он пересобирается из
этих файлов скиллом design (`seed-canvas.mjs`).
