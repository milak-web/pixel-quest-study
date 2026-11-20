from pathlib import Path
ROOT=Path(__file__).resolve().parent
css=(ROOT/'src/style.css').read_text(encoding='utf-8')
js='\n;\n'.join((ROOT/'src'/n).read_text(encoding='utf-8') for n in ['content.js','logic.js','app.js','labs.js'])
html='''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#171925"><meta name="description" content="رحلة تفاعلية لتعلم معالجة الصور الرقمية: 16 مستوى، مختبرات صغيرة وأسئلة مع تفسيرات."><title>Pixel Quest | رحلة البكسل</title><style>'''+css+'''</style></head><body><div id="app"></div><noscript><p style="padding:30px">فعّل JavaScript لتشغيل المختبر والأسئلة.</p></noscript><script>'''+js.replace('</script','<\\/script')+'''</script></body></html>'''
(ROOT/'docs/index.html').write_text(html,encoding='utf-8')
(ROOT/'docs/.nojekyll').touch()
print('Built docs/index.html')
