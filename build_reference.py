from pathlib import Path
import json,subprocess,html
from build_courses import ROOT,DOCS,page
data=json.loads(subprocess.check_output(['node',str(ROOT/'export-course.cjs')],cwd=ROOT).decode('utf-8'))
E=html.escape
files=[('P1','security ddd.ppt',40),('P2','محاضرات أمن المعلومات 33 - Copy.ppt',47),('P3','تشفير_بلايفر_تصميم_جديد.pptx',30),('P4','تشفير هل.pptx',24),('P5','التشفير.pptx',28),('D1','امن الشبكات.docx',43),('D2','امن البيانات.docx',48)]
maps={
'P1':[(1,13,[1]),(14,14,[7]),(15,18,[4]),(19,19,[1,5]),(20,20,[2]),(21,22,[3]),(23,24,[2]),(25,26,[3]),(27,32,[6]),(33,37,[7,12]),(38,40,[6])],
'P2':[(1,4,[1]),(5,7,[2]),(8,8,[3]),(9,16,[5]),(17,17,[10]),(18,19,[2,3]),(20,21,[1,11]),(22,28,[8,9]),(29,31,[8]),(32,32,[9]),(33,34,[15]),(35,36,[10]),(37,39,[7]),(40,44,[4]),(45,47,[7])],
'P3':[(1,7,[23]),(8,12,[24]),(13,17,[25]),(18,23,[26]),(24,24,[23]),(25,25,[24]),(26,30,[26])],
'P4':[(1,8,[27]),(9,10,[28]),(11,11,[29]),(12,14,[28]),(15,15,[29]),(16,17,[30]),(18,21,[31]),(22,23,[28,30]),(24,24,[])],
'P5':[(1,4,[17]),(5,6,[2,3,17,22]),(7,8,[17]),(9,11,[18]),(12,14,[19]),(15,16,[18]),(17,20,[20]),(21,22,[21]),(23,24,[22]),(25,27,[21]),(28,28,[17])],
'D1':[(1,4,[11]),(5,9,[11]),(10,13,[12,13,14]),(14,21,[16]),(22,29,[15,16]),(30,43,[11,15,16])],
'D2':[(1,4,[1,32]),(5,11,[4,5]),(12,15,[32]),(16,24,[16]),(25,34,[11,12,15,16]),(35,40,[15,32]),(41,48,[32])]
}
coverage=[]
for id,name,count in files:
 for n in range(1,count+1):
  hits=sorted({i for a,b,levels in maps[id] if a<=n<=b for i in levels})
  assert hits or(id=='P4' and n==24),(id,n)
  coverage.append(dict(source=id,unit=n,levels=hits,status='cover-or-content' if hits else 'closing slide; no additional teaching content'))
assert sum(n for id,_,n in files if id.startswith('P'))==169
assert len(data['LEVELS'])==32
path=DOCS/'information-security'
(path/'coverage.json').write_text(json.dumps({'sources':[dict(id=i,name=n,units=c,unit_type='slide' if i[0]=='P' else 'top-level document block (including blanks)') for i,n,c in files],'mapping':coverage},ensure_ascii=False,indent=2),encoding='utf-8')
def layout(title,body):return page(title,'<main class="container course-sources"><a class="btn secondary" href="./">العودة إلى مادة الأمن</a><h1 style="margin-top:25px">'+title+'</h1>'+body+'</main>')
body='<p class="muted">هذا مرجع منظم من الملفات السبعة، مع أمثلة تعليمية وتصحيح التناقضات. المسار التفاعلي يقسمه إلى96فكرة؛ يمكنك الرجوع لأي جزء هنا دون فتح المستويات.</p>'
for i,l in enumerate(data['LEVELS'],1):
 body+='<article id="level-'+str(i)+'"><h2>'+str(i)+'. '+E(l['title'])+'</h2><p class="source-inline">المصدر: <bdi>'+E(l['source'])+'</bdi></p>'
 for s in l['steps']:
  body+='<h3>'+E(s['title'])+' <bdi>'+E(s['en'])+'</bdi></h3><p>'+E(s['text'])+'</p><div class="formula">'+E(s['formula'])+'</div><p>'+E(s['example'])+'</p><details class="example"><summary>استرجاع الفكرة: '+E(s['questions'][0]['prompt'])+'</summary><p>'+E(s['questions'][0]['why'])+'</p></details>'
 body+='</article>'
(path/'reference.html').write_text(layout('مرجع أمن المعلومات والتشفير',body),encoding='utf-8')
body='<p>أُدرجت خمسة عروض تضم169شريحة، ووثيقتاWord. الأرقام D تشير إلى ترتيب كتل الفقرات والجداول في الوثيقة، بما فيها الفراغات، وليست أرقام صفحات طباعة ثابتة.</p><table class="source-table"><tr><th>رمز</th><th>ملف</th><th>وحدات فحص</th></tr>'
for id,name,count in files:body+='<tr><td>'+id+'</td><td>'+E(name)+'</td><td>'+str(count)+(' شريحة' if id[0]=='P' else ' كتلة')+'</td></tr>'
body+='</table><h2>أين تدرس كل موضوع؟</h2>'
for i,l in enumerate(data['LEVELS'],1):body+='<div class="coverage-row"><a href="reference.html#level-'+str(i)+'">'+str(i)+'. '+E(l['title'])+'</a><p class="small"><bdi>'+E(l['source'])+'</bdi></p></div>'
body+='''<article><h2>عبارة المحاضرة والتصحيح</h2><p><b>P5:9-11</b>: المتماثل يسمى خطأً بالمفتاح العام. الصحيح سر مشترك للعملية وعكسها. <a href="https://csrc.nist.gov/glossary/term/symmetric_key">NIST: symmetric key</a>.</p><p><b>P5:8</b>: معرفة الخوارزمية والنصين لا تكفل استنتاج أي مفتاح. ليست قاعدة «معرفة أي ثلاثة تكشف الرابع» صحيحة عموماً.</p><p><b>P5:15-16</b>: DSA للتوقيع، وDiffie–Hellman لاتفاق المفاتيح، وPGP منظومة. عدد المفاتيح وحده لا يرتب قوة الأمان. العام والخاص عمليتان متكاملتان: <a href="https://csrc.nist.gov/glossary/term/assymetric_key">NIST: asymmetric keys</a>.</p><p><b>P5:17-23،25-27</b>: Hash ليس تشفيراً قابلاً للفك. MD5 ينتج128بت، لكن الطول لا يثبت نوع الدالة، والتصادم ممكن. لا يستخدم في توقيع يتطلب مقاومة تصادم. <a href="https://www.rfc-editor.org/rfc/rfc6151">RFC6151</a> و<a href="https://www.rfc-editor.org/rfc/rfc1321">وصف MD5 في RFC1321</a>. التخمين بالمقارنة ليس فكاً عاماً للدالة؛ سياسات عدد المحاولات ليست جزءاً من MD5.</p><p><b>P3:27</b>: الخرج EC US TF VT UQ UI FC صحيح للمفتاح SECURITY، لكن تسميات «يسار/أعلى» في جدول التشفير معكوسة؛ التشفير يتبع اليمين والأسفل. تم التحقق بإعادة الحساب.</p><p><b>P4:16</b>: المعامل3 هو معكوس المحدد9، وليس المحدد نفسه. المعكوس الكامل [[15,17],[20,9]]، واتفاق المقرر متجه عمودي.</p><p><b>D1</b>: MAN حضرية Metropolitan وليست Medium/عنكبوتية. وصف الحماية النارية ومكافحة الفيروسات مختلفان. عبارات اقتصار الإصابة على فتح المرفق، وحصر الإقلاع بالقرص المرن، والندرة المطلقة، وضمان الترشيح، معلومات قديمة أو تعميمات غير دقيقة؛ لا نكررها كضمانات.</p><p><b>D2</b>: وصف شمول أمن المعلومات وضمان المعلومات غير متسق. ندرس الوظائف كما وردت ونبين التناقض. يوجد عنوانMcCumber دون شرح أو رسم مكتمل؛ لا ننسب للوثيقة تفاصيل غير موجودة.</p><p><b>P2:37-47 وD2</b>: الأمثلة القانونية والسياسية سياق تاريخي للمادة، وليست إرشاداً قانونياً محلياً حالياً. تصنيف كل حالة يتوقف على وقائعها والقانون المختص.</p></article><p><a href="coverage.json">خريطة الفحص لكل شريحة وكتلة في الملفات السبعة</a>. الغلاف والمقدمة والخاتمة قد تكون وحدات توجيه لا مفهوماً مستقلاً للاختبار. لا تتوفر أسئلة امتحان مستقلة لمعايرة الصعوبة.</p>'''
(path/'sources.html').write_text(layout('تتبع المصادر وتصحيحاتها',body),encoding='utf-8')
print('Built 96-concept reference and source map for',len(coverage),'source units.')
