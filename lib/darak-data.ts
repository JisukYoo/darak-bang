export type Church = { id: string; name: string; location: string; denomination: string }

export type Darakbang = {
  id: string
  churchId: string
  name: string
  leader: string
  schedule: string
  location: string
  memberCount: number
}

export type AttendanceStatus = 'present' | 'absent' | 'online' | 'unmarked'

export type Member = { id: string; name: string; role?: string; initial: string; tone: number }

export type FeedPost = {
  id: string
  type: 'prayer' | 'meditation'
  authorId: string
  content: string
  verse?: string
  createdAt: string
  prayCount: number
  prayedByMe: boolean
}

export type Notice = { id: string; title: string; body: string; date: string; pinned?: boolean }

export const churches: Church[] = [
  { id: 'c1', name: '은혜샘교회', location: '서울 마포구', denomination: '대한예수교장로회' },
  { id: 'c2', name: '빛과소금교회', location: '서울 강남구', denomination: '기독교대한감리회' },
  { id: 'c3', name: '푸른초장교회', location: '경기 성남시 분당구', denomination: '기독교한국침례회' },
  { id: 'c4', name: '새생명교회', location: '부산 해운대구', denomination: '대한예수교장로회' },
  { id: 'c5', name: '열방교회', location: '인천 연수구', denomination: '기독교대한성결교회' },
]

export const initialGroups: Darakbang[] = [
  { id: 'g1', churchId: 'c1', name: '요셉 다락방', leader: '김은혜', schedule: '매주 금요일 오후 8시', location: '교육관 3층 다락방실', memberCount: 15 },
  { id: 'g2', churchId: 'c1', name: '룻 다락방', leader: '박소망', schedule: '매주 수요일 오후 7시 30분', location: '본당 2층 소예배실', memberCount: 9 },
  { id: 'g3', churchId: 'c1', name: '청년 디모데 다락방', leader: '이믿음', schedule: '매주 주일 오후 2시', location: '카페 소금빛', memberCount: 12 },
  { id: 'g4', churchId: 'c2', name: '여호수아 다락방', leader: '최사랑', schedule: '매주 목요일 오후 8시', location: '비전센터 201호', memberCount: 11 },
  { id: 'g5', churchId: 'c3', name: '다윗 다락방', leader: '정평강', schedule: '격주 토요일 오전 10시', location: '리더 가정', memberCount: 8 },
]

export const members: Member[] = [
  { id: 'm1', name: '김은혜', role: '리더', initial: '은', tone: 0 },
  { id: 'm2', name: '박준서', role: '부리더', initial: '준', tone: 1 },
  { id: 'm3', name: '이하늘', initial: '하', tone: 2 },
  { id: 'm4', name: '최민지', initial: '민', tone: 0 },
  { id: 'm5', name: '정다온', initial: '다', tone: 1 },
  { id: 'm6', name: '한소율', initial: '소', tone: 2 },
  { id: 'm7', name: '오지훈', initial: '지', tone: 0 },
  { id: 'm8', name: '윤서진', initial: '서', tone: 1 },
  { id: 'm9', name: '장예린', initial: '예', tone: 2 },
  { id: 'm10', name: '강도윤', initial: '도', tone: 0 },
  { id: 'm11', name: '신유나', initial: '유', tone: 1 },
  { id: 'm12', name: '임태오', initial: '태', tone: 2 },
  { id: 'm13', name: '홍가은', initial: '가', tone: 0 },
  { id: 'm14', name: '문시우', initial: '시', tone: 1 },
  { id: 'm15', name: '배나래', initial: '나', tone: 2 },
]

export const initialAttendance: Record<string, AttendanceStatus> = {
  m1: 'present', m2: 'present', m3: 'present', m4: 'online', m5: 'present',
  m6: 'present', m7: 'absent', m8: 'present', m9: 'present', m10: 'present',
  m11: 'online', m12: 'present', m13: 'absent', m14: 'absent', m15: 'present',
}

export const initialNotices: Notice[] = [
  { id: 'n1', title: '이번 주 모임은 리더 가정에서 모여요', body: '교육관 공사로 이번 주 금요일은 김은혜 리더 댁(망원동)에서 모입니다. 간단한 저녁이 준비되어 있어요. 주소는 단톡방에 공유드렸습니다.', date: '11월 5일', pinned: true },
  { id: 'n2', title: '11월 연합 다락방 찬양예배', body: '11월 23일(주일) 오후 4시 본당에서 연합 찬양예배가 있습니다. 다락방별 특송 준비를 부탁드려요.', date: '11월 3일' },
  { id: 'n3', title: '이번 주 나눔 본문: 요한복음 15장', body: '포도나무와 가지 비유를 미리 읽고 와 주세요. 한 구절씩 마음에 남는 말씀을 나눌 예정입니다.', date: '11월 1일' },
]

export const initialPosts: FeedPost[] = [
  { id: 'p1', type: 'prayer', authorId: 'm3', content: '다음 주 중요한 면접이 있어요. 떨리는 마음보다 평안함으로 준비할 수 있도록 기도 부탁드립니다.', createdAt: '2시간 전', prayCount: 8, prayedByMe: false },
  { id: 'p2', type: 'prayer', authorId: 'm6', content: '어머니께서 수술 후 회복 중이세요. 빠른 회복과 가족 모두가 지치지 않도록 함께 기도해 주세요.', createdAt: '어제', prayCount: 14, prayedByMe: true },
  { id: 'p3', type: 'meditation', authorId: 'm2', verse: '요한복음 15:5', content: '가지가 스스로 열매를 맺으려 애쓰지 않듯, 오늘은 결과보다 주님 안에 "머무는" 것에 집중하고 싶어요. 바쁜 하루 중 세 번 멈춰서 기도하기로 했습니다.', createdAt: '3시간 전', prayCount: 6, prayedByMe: false },
  { id: 'p4', type: 'prayer', authorId: 'm9', content: '새로 시작한 직장에서 좋은 동료들을 만나고, 그리스도인으로서 빛을 낼 수 있도록 기도 부탁드려요.', createdAt: '2일 전', prayCount: 11, prayedByMe: false },
  { id: 'p5', type: 'meditation', authorId: 'm5', verse: '시편 23:1', content: '"부족함이 없으리로다" — 부족한 것만 세던 한 주였는데, 이미 받은 은혜를 적어보니 열 개가 넘었어요. 감사로 한 주를 마무리합니다.', createdAt: '어제', prayCount: 9, prayedByMe: true },
]

export type BibleBook = { id: string; name: string; testament: '구약' | '신약'; chapters: number }

export const bibleBooks: BibleBook[] = [
  { id: 'gen', name: '창세기', testament: '구약', chapters: 50 },
  { id: 'psa', name: '시편', testament: '구약', chapters: 150 },
  { id: 'isa', name: '이사야', testament: '구약', chapters: 66 },
  { id: 'mat', name: '마태복음', testament: '신약', chapters: 28 },
  { id: 'jhn', name: '요한복음', testament: '신약', chapters: 21 },
  { id: 'rom', name: '로마서', testament: '신약', chapters: 16 },
  { id: 'php', name: '빌립보서', testament: '신약', chapters: 4 },
]

/* Sample passages based on the public-domain 개역한글 (1961) translation */
export const bibleText: Record<string, string[]> = {
  'gen-1': [
    '태초에 하나님이 천지를 창조하시니라',
    '땅이 혼돈하고 공허하며 흑암이 깊음 위에 있고 하나님의 신은 수면에 운행하시니라',
    '하나님이 가라사대 빛이 있으라 하시매 빛이 있었고',
    '그 빛이 하나님의 보시기에 좋았더라 하나님이 빛과 어두움을 나누사',
    '빛을 낮이라 칭하시고 어두움을 밤이라 칭하시니라 저녁이 되며 아침이 되니 이는 첫째 날이니라',
    '하나님이 가라사대 물 가운데 궁창이 있어 물과 물로 나뉘게 하리라 하시고',
    '하나님이 궁창을 만드사 궁창 아래의 물과 궁창 위의 물로 나뉘게 하시매 그대로 되니라',
    '하나님이 궁창을 하늘이라 칭하시니라 저녁이 되며 아침이 되니 이는 둘째 날이니라',
  ],
  'psa-23': [
    '여호와는 나의 목자시니 내가 부족함이 없으리로다',
    '그가 나를 푸른 초장에 누이시며 쉴만한 물가으로 인도하시는도다',
    '내 영혼을 소생시키시고 자기 이름을 위하여 의의 길로 인도하시는도다',
    '내가 사망의 음침한 골짜기로 다닐지라도 해를 두려워하지 않을 것은 주께서 나와 함께 하심이라 주의 지팡이와 막대기가 나를 안위하시나이다',
    '주께서 내 원수의 목전에서 내게 상을 베푸시고 기름으로 내 머리에 바르셨으니 내 잔이 넘치나이다',
    '나의 평생에 선하심과 인자하심이 정녕 나를 따르리니 내가 여호와의 집에 영원히 거하리로다',
  ],
  'jhn-3': [
    '바리새인 중에 니고데모라 하는 사람이 있으니 유대인의 관원이라',
    '그가 밤에 예수께 와서 가로되 랍비여 우리가 당신은 하나님께로서 오신 선생인 줄 아나이다 하나님이 함께 하시지 아니하시면 당신의 행하시는 이 표적을 아무라도 할 수 없음이니이다',
    '예수께서 대답하여 가라사대 진실로 진실로 네게 이르노니 사람이 거듭나지 아니하면 하나님 나라를 볼 수 없느니라',
    '니고데모가 가로되 사람이 늙으면 어떻게 날 수 있삽나이까 두번째 모태에 들어갔다가 날 수 있삽나이까',
    '예수께서 대답하시되 진실로 진실로 네게 이르노니 사람이 물과 성령으로 나지 아니하면 하나님 나라에 들어갈 수 없느니라',
    '육으로 난 것은 육이요 영으로 난 것은 영이니',
    '내가 네게 거듭나야 하겠다 하는 말을 기이히 여기지 말라',
    '바람이 임의로 불매 네가 그 소리를 들어도 어디서 와서 어디로 가는지 알지 못하나니 성령으로 난 사람은 다 이러하니라',
  ],
  'jhn-15': [
    '내가 참포도나무요 내 아버지는 그 농부라',
    '무릇 내게 있어 과실을 맺지 아니하는 가지는 아버지께서 이를 제해 버리시고 무릇 과실을 맺는 가지는 더 과실을 맺게 하려 하여 이를 깨끗케 하시느니라',
    '너희는 내가 일러준 말로 이미 깨끗하였으니',
    '내 안에 거하라 나도 너희 안에 거하리라 가지가 포도나무에 붙어 있지 아니하면 절로 과실을 맺을 수 없음 같이 너희도 내 안에 있지 아니하면 그러하리라',
    '나는 포도나무요 너희는 가지라 저가 내 안에, 내가 저 안에 있으면 이 사람은 과실을 많이 맺나니 나를 떠나서는 너희가 아무 것도 할 수 없음이라',
    '사람이 내 안에 거하지 아니하면 가지처럼 밖에 버리워 말라지나니 사람들이 이것을 모아다가 불에 던져 사르느니라',
    '너희가 내 안에 거하고 내 말이 너희 안에 거하면 무엇이든지 원하는대로 구하라 그리하면 이루리라',
  ],
  'php-4': [
    '그러므로 나의 사랑하고 사모하는 형제들, 나의 기쁨이요 면류관인 사랑하는 자들아 이와 같이 주 안에 서라',
    '내가 유오디아를 권하고 순두게를 권하노니 주 안에서 같은 마음을 품으라',
    '또 참으로 나와 멍에를 같이한 네게 구하노니 복음에 나와 함께 힘쓰던 저 부녀들을 돕고 또한 글레멘드와 그 외에 나의 동역자들을 도우라 그 이름들이 생명책에 있느니라',
    '주 안에서 항상 기뻐하라 내가 다시 말하노니 기뻐하라',
    '너희 관용을 모든 사람에게 알게 하라 주께서 가까우시니라',
    '아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라',
    '그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라',
  ],
}

export const bibleCovers = [
  { id: 'sage-linen', name: '세이지 린넨', description: '부드러운 패브릭 하드커버', price: 32000, image: '/covers/sage-linen.png' },
  { id: 'amber-leather', name: '앰버 레더', description: '천연 소가죽 · 금박 마감', price: 48000, image: '/covers/amber-leather.png' },
  { id: 'floral-cream', name: '들꽃 아이보리', description: '압화 일러스트 클로스', price: 36000, image: '/covers/floral-cream.png' },
] as const

export const LETTERING_FEE = 8000
export const SHIPPING_FEE = 3500

export function formatWon(value: number) {
  return `${value.toLocaleString('ko-KR')}원`
}
