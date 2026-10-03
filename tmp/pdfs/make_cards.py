from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.colors import HexColor
from pypdf import PdfReader
root=Path.cwd()
fontroot=Path('/Users/kostxp/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype')
for name,file in [('Main','DejaVuSans.ttf'),('MainBold','DejaVuSans-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(fontroot/file)))
pdfmetrics.registerFontFamily('Main',normal='Main',bold='MainBold')
data=[
('làm','делать; работать','lam.jpg','Tôi <b>làm</b> bánh.','Я готовлю пирог.'),
('việc','дело','viec.jpg','Tôi có một <b>việc</b> cần làm.','У меня есть одно дело, которое нужно сделать.'),
('làm việc','работать','lam-viec.jpg','Tôi <b>làm việc</b> ở công ty.','Я работаю в компании.'),
('công việc','работа','cong-viec.png','Tôi thích <b>công việc</b> này.','Мне нравится эта работа.'),
('nghề','профессия','nghe.png','Anh làm <b>nghề</b> gì?','Кем ты работаешь?'),
('xây dựng','строительство; строить','xay-dung.jpg','Họ đang <b>xây dựng</b> một ngôi nhà.','Они сейчас строят дом.'),
('ngày mai','завтра','ngay-mai.png','<b>Ngày mai</b> tôi sẽ đi làm.','Завтра я пойду на работу.'),
('giáo viên','учитель','giao-vien.jpg','Anh ấy là <b>giáo viên</b>.','Он учитель.'),
('cô giáo','учительница','co-giao.png','<b>Cô giáo</b> đang đọc sách.','Учительница сейчас читает книгу.'),
('thầy giáo','учитель-мужчина','thay-giao.jpg','<b>Thầy giáo</b> đang viết.','Учитель сейчас пишет.'),
('trường','школа','truong.jpg','<b>Trường</b> của tôi rất đẹp.','Моя школа очень красивая.'),
('trường đại học','университет','truong-dai-hoc.png','Tôi học ở <b>trường đại học</b>.','Я учусь в университете.'),
]

import re
extra=[
('Cuối tuần tôi làm bánh cho cả nhà.','В выходные я готовлю пирог для всей семьи.'),
('Xong việc, tôi đi uống cà phê.','Закончив дела, я иду пить кофе.'),
('Tôi làm việc ở nhà vào thứ sáu.','По пятницам я работаю дома.'),
('Công việc mới của tôi rất thú vị.','Моя новая работа очень интересная.'),
('Nghề của anh ấy là giáo viên.','Он учитель по профессии.'),
('Họ đang xây dựng một trường mới.','Они строят новую школу.'),
('Ngày mai chúng ta đi uống cà phê nhé!','Давай завтра сходим выпить кофе!'),
('Tôi muốn trở thành giáo viên.','Я хочу стать учителем.'),
('Cô giáo giúp tôi học tiếng Việt.','Учительница помогает мне учить вьетнамский.'),
('Thầy giáo kể một câu chuyện rất vui.','Учитель рассказывает очень весёлую историю.'),
('Trường của con tôi ở gần nhà.','Школа моего ребёнка находится рядом с домом.'),
('Bạn học ở trường đại học nào?','В каком университете ты учишься?'),
]
out=root/'output/pdf/AlexViet-12-карточек-A4.pdf'
c=canvas.Canvas(str(out),pagesize=A4)
c.setTitle('AlexViet - 12 карточек и 24 примера')
c.setAuthor('AlexViet')
W,H=A4
blue=HexColor('#1457A5'); dark=HexColor('#172A3A'); grey=HexColor('#596875')
left=12*mm; right=3*mm; top=H-3*mm
cw=(W-left-right)/3; ch=(H-6*mm)/4
for i,(word,ru,file,vi,tr) in enumerate(data):
    row,col=divmod(i,3)
    x=left+col*cw; y=top-(row+1)*ch
    c.drawImage(str(root/'public/images/cards'/file),x,y,width=cw,height=ch,preserveAspectRatio=False,mask='auto')
c.showPage()
left=8*mm; right=12*mm
width=W-left-right
heading=ParagraphStyle('heading',fontName='MainBold',fontSize=17,leading=21,textColor=dark)
label=ParagraphStyle('label',fontName='MainBold',fontSize=11,leading=14,textColor=blue)
example=ParagraphStyle('example',fontName='Main',fontSize=10.7,leading=15,textColor=dark)
sub=ParagraphStyle('sub',fontName='Main',fontSize=8.5,leading=12,textColor=grey)
words=[d[0] for d in data]
pattern=re.compile(r'(?<!\w)('+ '|'.join(re.escape(w) for w in sorted(words,key=len,reverse=True))+r')(?!\w)',re.I)
def highlight(text):
    text=text.replace('<b>','').replace('</b>','')
    return pattern.sub(lambda m:'<b><font color="#1457A5">'+m.group()+'</font></b>',text)
def para(text,style,y):
    p=Paragraph(text,style); w,h=p.wrap(width,H)
    p.drawOn(c,left,y-h)
    return y-h

y=H-10*mm
y=para('Слова в живых фразах',heading,y)
y=para('24 примера • Изучаемые слова выделены синим',sub,y-2*mm)-5*mm
for i,(word,ru,file,vi,tr) in enumerate(data):
    y=para(f'{i+1:02d}  {word} - {ru}',label,y)
    for v,r in [(vi,tr),extra[i]]:
        y=para(highlight(v)+' <font color="#596875">- '+r+'</font>',example,y-1*mm)
    y-=2*mm
    if i<11:
        c.setStrokeColor(HexColor('#DCE5EE'));c.setLineWidth(.35)
        c.line(left,y,W-right,y)
        y-=2*mm
assert y>12*mm, y
c.setFont('Main',7);c.setFillColor(grey)
c.drawString(left,6*mm,'AlexViet • Вьетнамский язык')
c.save()
pdf=PdfReader(str(out))
assert len(pdf.pages)==2
for page in pdf.pages:
    assert abs(float(page.mediabox.width)-W)<1
print(out)
print('Verified: 2 A4 pages; 12 images, 24 examples. Bottom text margin:',round(y/mm,1),'mm')
