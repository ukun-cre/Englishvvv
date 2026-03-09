'use strict';
/* ================================================
   はんたいことば！ – app.js
   Opposites Learning App for ages 3-6
   ================================================ */

/* ── State ── */
const STATE = {
  screen: 'menu',
  settings: { voice: true, difficulty: 'easy' },
  records: { maxStreak: 0, totalCorrect: 0, totalPlayed: 0, gamesPlayed: 0 },
  game: {
    questions: [],
    qIndex: 0,
    streak: 0,
    stage: 1,
    stageCorrect: 0,
    answering: false
  }
};

/* ── LocalStorage Keys ── */
const LS_SETTINGS = 'opposites_settings';
const LS_RECORDS  = 'opposites_records';

/* ── Questions Database ── */
const ALL_QUESTIONS = [
  { id:'hot',       word:'あつい',    correct:{ word:'さむい',    concept:'cold'    }, distractors:[{ word:'おもい', concept:'heavy' },{ word:'ながい', concept:'long'  }], concept:'hot',    charState:'sweat',     easy:true },
  { id:'cold',      word:'さむい',    correct:{ word:'あつい',    concept:'hot'     }, distractors:[{ word:'かるい', concept:'light' },{ word:'うれしい',concept:'happy' }], concept:'cold',   charState:'shiver',    easy:true },
  { id:'big',       word:'おおきい',  correct:{ word:'ちいさい',  concept:'small'   }, distractors:[{ word:'はやい', concept:'fast'  },{ word:'くらい', concept:'dark'  }], concept:'big',    charState:'surprised', easy:true },
  { id:'small',     word:'ちいさい',  correct:{ word:'おおきい',  concept:'big'     }, distractors:[{ word:'おそい', concept:'slow'  },{ word:'ふるい', concept:'old'   }], concept:'small',  charState:'crouch',    easy:true },
  { id:'fast',      word:'はやい',    correct:{ word:'おそい',    concept:'slow'    }, distractors:[{ word:'かたい', concept:'hard'  },{ word:'せまい', concept:'narrow'}], concept:'fast',   charState:'run',       easy:true },
  { id:'slow',      word:'おそい',    correct:{ word:'はやい',    concept:'fast'    }, distractors:[{ word:'やわらかい',concept:'soft'},{ word:'あたらしい',concept:'new'}], concept:'slow',   charState:'slow',      easy:true },
  { id:'light',     word:'かるい',    correct:{ word:'おもい',    concept:'heavy'   }, distractors:[{ word:'くらい', concept:'dark'  },{ word:'きたない',concept:'dirty'}], concept:'light',  charState:'float',     easy:true },
  { id:'heavy',     word:'おもい',    correct:{ word:'かるい',    concept:'light'   }, distractors:[{ word:'あたらしい',concept:'new' },{ word:'ひろい', concept:'wide'  }], concept:'heavy',  charState:'strain',    easy:true },
  { id:'bright',    word:'あかるい',  correct:{ word:'くらい',    concept:'dark'    }, distractors:[{ word:'おもい', concept:'heavy' },{ word:'みじかい',concept:'short'}], concept:'bright', charState:'sunny',     easy:false },
  { id:'dark',      word:'くらい',    correct:{ word:'あかるい',  concept:'bright'  }, distractors:[{ word:'ながい', concept:'long'  },{ word:'かたい', concept:'hard'  }], concept:'dark',   charState:'sleepy',    easy:false },
  { id:'long',      word:'ながい',    correct:{ word:'みじかい',  concept:'short'   }, distractors:[{ word:'さむい', concept:'cold'  },{ word:'せまい', concept:'narrow'}], concept:'long',   charState:'stretch',   easy:false },
  { id:'short',     word:'みじかい',  correct:{ word:'ながい',    concept:'long'    }, distractors:[{ word:'あつい', concept:'hot'   },{ word:'きれい', concept:'clean' }], concept:'short',  charState:'crouch',    easy:false },
  { id:'happy',     word:'うれしい',  correct:{ word:'かなしい',  concept:'sad'     }, distractors:[{ word:'おそい', concept:'slow'  },{ word:'ひろい', concept:'wide'  }], concept:'happy',  charState:'happy',     easy:false },
  { id:'sad',       word:'かなしい',  correct:{ word:'うれしい',  concept:'happy'   }, distractors:[{ word:'かるい', concept:'light' },{ word:'あたらしい',concept:'new'}], concept:'sad',    charState:'sad',       easy:false },
  { id:'new',       word:'あたらしい',correct:{ word:'ふるい',    concept:'old'     }, distractors:[{ word:'おもい', concept:'heavy' },{ word:'かなしい',concept:'sad'  }], concept:'new',    charState:'excited',   easy:false },
  { id:'old',       word:'ふるい',    correct:{ word:'あたらしい',concept:'new'     }, distractors:[{ word:'はやい', concept:'fast'  },{ word:'きれい', concept:'clean' }], concept:'old',    charState:'slow',      easy:false },
  { id:'soft',      word:'やわらかい',correct:{ word:'かたい',    concept:'hard'    }, distractors:[{ word:'くらい', concept:'dark'  },{ word:'おそい', concept:'slow'  }], concept:'soft',   charState:'float',     easy:false },
  { id:'hard2',     word:'かたい',    correct:{ word:'やわらかい',concept:'soft'    }, distractors:[{ word:'うれしい',concept:'happy'},{ word:'ながい', concept:'long'  }], concept:'hard',   charState:'strain',    easy:false },
  { id:'wide',      word:'ひろい',    correct:{ word:'せまい',    concept:'narrow'  }, distractors:[{ word:'さむい', concept:'cold'  },{ word:'かなしい',concept:'sad'  }], concept:'wide',   charState:'surprised', easy:false },
  { id:'clean',     word:'きれい',    correct:{ word:'きたない',  concept:'dirty'   }, distractors:[{ word:'みじかい',concept:'short'},{ word:'おもい', concept:'heavy' }], concept:'clean',  charState:'happy',     easy:false }
];

const VOICE_CORRECT = ['やったー！せいかい！すごいね！','せいかい！えらい！','やったやった！せいかい！','すごい！せいかい！よくできました！'];
const VOICE_WRONG   = ['ちがうよ、もういちどかんがえてみよう！','おしい！もういちど！','ざんねん！でも、だいじょうぶ！もういちど！'];


/* ── Concept SVGs ── */
const CONCEPT_SVGS = {
  hot: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="bg-h" cx="50%" cy="50%"><stop offset="0%" stop-color="#FFF3CD"/><stop offset="100%" stop-color="#FFE0B2"/></radialGradient>
    <linearGradient id="fl" x1="0.5" y1="1" x2="0.5" y2="0"><stop offset="0%" stop-color="#FF2200"/><stop offset="50%" stop-color="#FF8800"/><stop offset="100%" stop-color="#FFE000"/></linearGradient></defs>
    <circle cx="60" cy="60" r="58" fill="url(#bg-h)"/>
    <path d="M60 105 C35 95 22 72 35 52 C41 64 47 58 44 43 C58 54 63 37 61 20 C78 36 95 58 83 78 C89 65 95 72 91 83 C85 98 73 108 60 105Z" fill="url(#fl)"/>
    <path d="M60 90 C48 84 43 68 51 56 C54 65 58 60 56 50 C66 59 69 50 67 41 C78 53 85 68 77 80 C81 71 85 76 83 83 C78 92 69 96 60 90Z" fill="#FFE000" opacity="0.7"/>
    <path d="M38 30 Q43 24 48 30" stroke="#FF6600" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M72 22 Q77 16 82 22" stroke="#FF6600" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  </svg>`,

  cold: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#EBF8FF"/>
    <g stroke="#5BB8F5" stroke-linecap="round">
      <line x1="60" y1="14" x2="60" y2="106" stroke-width="5"/>
      <line x1="14" y1="60" x2="106" y2="60" stroke-width="5"/>
      <line x1="27" y1="27" x2="93" y2="93" stroke-width="5"/>
      <line x1="93" y1="27" x2="27" y2="93" stroke-width="5"/>
      <line x1="60" y1="32" x2="48" y2="20" stroke-width="3.5"/>
      <line x1="60" y1="32" x2="72" y2="20" stroke-width="3.5"/>
      <line x1="60" y1="88" x2="48" y2="100" stroke-width="3.5"/>
      <line x1="60" y1="88" x2="72" y2="100" stroke-width="3.5"/>
      <line x1="32" y1="60" x2="20" y2="48" stroke-width="3.5"/>
      <line x1="32" y1="60" x2="20" y2="72" stroke-width="3.5"/>
      <line x1="88" y1="60" x2="100" y2="48" stroke-width="3.5"/>
      <line x1="88" y1="60" x2="100" y2="72" stroke-width="3.5"/>
    </g>
    <polygon points="60,50 70,60 60,70 50,60" fill="#B3E5FC" stroke="#5BB8F5" stroke-width="2"/>
    <circle cx="28" cy="22" r="4" fill="#B3E5FC" opacity="0.8"/>
    <circle cx="95" cy="18" r="3" fill="#B3E5FC" opacity="0.7"/>
    <circle cx="18" cy="92" r="5" fill="#B3E5FC" opacity="0.6"/>
    <circle cx="100" cy="95" r="4" fill="#B3E5FC" opacity="0.8"/>
  </svg>`,

  big: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#EEF2FF"/>
    <circle cx="60" cy="64" r="42" fill="#6366F1" opacity="0.85"/>
    <circle cx="45" cy="48" r="10" fill="white" opacity="0.3"/>
    <text x="60" y="102" font-size="11" fill="#6366F1" font-weight="900" text-anchor="middle" font-family="sans-serif">おおきい！</text>
    <text x="22" y="28" font-size="16" fill="#FFB830">★</text>
    <text x="88" y="22" font-size="12" fill="#FFB830">✦</text>
    <text x="95" y="88" font-size="14" fill="#FFB830">★</text>
    <text x="10" y="90" font-size="10" fill="#FFB830">✦</text>
  </svg>`,

  small: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#FFF0F6"/>
    <circle cx="60" cy="62" r="42" fill="none" stroke="#FBBDD9" stroke-width="2" stroke-dasharray="6,4"/>
    <circle cx="60" cy="62" r="16" fill="#EC4899" opacity="0.85"/>
    <circle cx="53" cy="56" r="4" fill="white" opacity="0.4"/>
    <text x="60" y="106" font-size="10" fill="#EC4899" font-weight="900" text-anchor="middle" font-family="sans-serif">ちいさい！</text>
  </svg>`,

  fast: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#FFF3CD"/>
    <g stroke="#FCA5A5" stroke-width="3" stroke-linecap="round" opacity="0.7">
      <line x1="8" y1="42" x2="30" y2="42"/><line x1="5" y1="60" x2="26" y2="60"/><line x1="8" y1="78" x2="30" y2="78"/>
    </g>
    <g transform="translate(28,22)">
      <ellipse cx="36" cy="38" rx="18" ry="28" fill="#EF4444" transform="rotate(-30,36,38)"/>
      <ellipse cx="36" cy="38" rx="10" ry="16" fill="#FCA5A5" transform="rotate(-30,36,38)"/>
      <polygon points="18,62 28,80 8,80" fill="#EF4444"/>
      <circle cx="46" cy="18" r="6" fill="#60A5FA"/>
      <ellipse cx="52" cy="50" rx="8" ry="5" fill="#FCA5A5" transform="rotate(-30,52,50)"/>
    </g>
  </svg>`,

  slow: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#F0FDF4"/>
    <ellipse cx="62" cy="75" rx="38" ry="22" fill="#4ADE80"/>
    <path d="M24 75 Q62 40 100 75" fill="#86EFAC"/>
    <ellipse cx="30" cy="72" rx="8" ry="10" fill="#15803D"/>
    <ellipse cx="45" cy="66" rx="7" ry="9" fill="#16A34A"/>
    <ellipse cx="60" cy="63" rx="8" ry="10" fill="#15803D"/>
    <ellipse cx="75" cy="66" rx="7" ry="9" fill="#16A34A"/>
    <circle cx="32" cy="62" r="5" fill="#FCD34D"/>
    <circle cx="30" cy="60" r="2" fill="#333"/>
    <path d="M26 66 Q30 70 34 66" stroke="#15803D" stroke-width="2" fill="none"/>
    <line x1="20" y1="61" x2="15" y2="58" stroke="#15803D" stroke-width="1.5"/>
    <line x1="20" y1="64" x2="14" y2="64" stroke="#15803D" stroke-width="1.5"/>
  </svg>`,

  light: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#FFFBEB"/>
    <path d="M60 95 C52 88 46 76 50 65 C54 70 56 67 55 60 C62 66 64 58 63 50 C70 58 74 68 70 78 C73 72 76 74 74 80 C71 88 66 94 60 95Z" fill="#FDE68A" stroke="#FCD34D" stroke-width="1.5"/>
    <g opacity="0.4" stroke="#FCD34D" stroke-width="1.5" stroke-linecap="round">
      <line x1="60" y1="28" x2="60" y2="18"/><line x1="60" y1="42" x2="60" y2="32"/>
      <line x1="78" y1="36" x2="84" y2="30"/><line x1="86" y1="60" x2="96" y2="60"/>
      <line x1="40" y1="36" x2="34" y2="30"/><line x1="30" y1="60" x2="20" y2="60"/>
    </g>
    <text x="60" y="112" font-size="9" fill="#92400E" font-weight="700" text-anchor="middle" font-family="sans-serif">ふわふわ〜</text>
  </svg>`,

  heavy: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#F1F5F9"/>
    <rect x="48" y="55" width="24" height="10" rx="3" fill="#64748B"/>
    <rect x="20" y="48" width="28" height="24" rx="6" fill="#94A3B8"/>
    <rect x="72" y="48" width="28" height="24" rx="6" fill="#94A3B8"/>
    <rect x="24" y="52" width="20" height="16" rx="4" fill="#64748B"/>
    <rect x="76" y="52" width="20" height="16" rx="4" fill="#64748B"/>
    <ellipse cx="34" cy="60" rx="6" ry="8" fill="#475569"/>
    <ellipse cx="86" cy="60" rx="6" ry="8" fill="#475569"/>
    <g stroke="#94A3B8" stroke-width="2" stroke-linecap="round">
      <line x1="35" y1="90" x2="28" y2="105"/><line x1="35" y1="90" x2="42" y2="105"/>
      <line x1="85" y1="90" x2="78" y2="105"/><line x1="85" y1="90" x2="92" y2="105"/>
    </g>
    <text x="60" y="108" font-size="8" fill="#475569" font-weight="700" text-anchor="middle" font-family="sans-serif">おもーい！</text>
  </svg>`,

  bright: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#FFFDE7"/>
    <g stroke="#FCD34D" stroke-width="4" stroke-linecap="round">
      <line x1="60" y1="10" x2="60" y2="22"/><line x1="60" y1="98" x2="60" y2="110"/>
      <line x1="10" y1="60" x2="22" y2="60"/><line x1="98" y1="60" x2="110" y2="60"/>
      <line x1="24" y1="24" x2="33" y2="33"/><line x1="87" y1="24" x2="96" y2="33"/>
      <line x1="24" y1="96" x2="33" y2="87"/><line x1="87" y1="96" x2="96" y2="87"/>
    </g>
    <circle cx="60" cy="60" r="24" fill="#FBBF24"/>
    <circle cx="60" cy="60" r="18" fill="#FDE68A"/>
    <circle cx="52" cy="54" r="5" fill="white" opacity="0.5"/>
  </svg>`,

  dark: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#1E1B4B"/>
    <path d="M68 20 Q52 28 48 46 Q44 64 56 76 Q68 88 84 84 Q70 98 52 92 Q28 84 22 62 Q16 40 32 26 Q48 12 68 20Z" fill="#E2E8F0" opacity="0.9"/>
    <circle cx="82" cy="28" r="3" fill="white" opacity="0.9"/>
    <circle cx="95" cy="50" r="2" fill="white" opacity="0.7"/>
    <circle cx="88" cy="70" r="2.5" fill="white" opacity="0.8"/>
    <circle cx="30" cy="88" r="2" fill="white" opacity="0.6"/>
    <circle cx="18" cy="45" r="1.5" fill="white" opacity="0.5"/>
    <circle cx="70" cy="96" r="2" fill="white" opacity="0.6"/>
  </svg>`,

  long: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#ECFDF5"/>
    <rect x="8" y="52" width="104" height="16" rx="8" fill="#34D399"/>
    <circle cx="8" cy="60" r="10" fill="#059669"/>
    <circle cx="112" cy="60" r="10" fill="#059669"/>
    <circle cx="8" cy="60" r="5" fill="#6EE7B7"/>
    <circle cx="112" cy="60" r="5" fill="#6EE7B7"/>
    <rect x="18" y="56" width="84" height="8" rx="4" fill="#6EE7B7" opacity="0.5"/>
    <text x="60" y="95" font-size="10" fill="#059669" font-weight="900" text-anchor="middle" font-family="sans-serif">なが〜い！</text>
  </svg>`,

  short: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#FFF1F2"/>
    <rect x="38" y="52" width="44" height="16" rx="8" fill="#F87171"/>
    <circle cx="38" cy="60" r="10" fill="#DC2626"/>
    <circle cx="82" cy="60" r="10" fill="#DC2626"/>
    <circle cx="38" cy="60" r="5" fill="#FCA5A5"/>
    <circle cx="82" cy="60" r="5" fill="#FCA5A5"/>
    <text x="60" y="95" font-size="10" fill="#DC2626" font-weight="900" text-anchor="middle" font-family="sans-serif">みじか〜い！</text>
  </svg>`,

  happy: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#FFFDE7"/>
    <circle cx="60" cy="62" r="44" fill="#FCD34D"/>
    <circle cx="60" cy="62" r="38" fill="#FBBF24"/>
    <circle cx="44" cy="52" r="7" fill="#333"/>
    <circle cx="76" cy="52" r="7" fill="#333"/>
    <circle cx="46" cy="50" r="3" fill="white"/>
    <circle cx="78" cy="50" r="3" fill="white"/>
    <path d="M36 68 Q60 90 84 68" stroke="#92400E" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse cx="35" cy="72" rx="10" ry="7" fill="#FCA5A5" opacity="0.6"/>
    <ellipse cx="85" cy="72" rx="10" ry="7" fill="#FCA5A5" opacity="0.6"/>
  </svg>`,

  sad: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#EFF6FF"/>
    <circle cx="60" cy="62" r="44" fill="#93C5FD"/>
    <circle cx="60" cy="62" r="38" fill="#60A5FA"/>
    <ellipse cx="44" cy="52" rx="7" ry="6" fill="#333"/>
    <ellipse cx="76" cy="52" rx="7" ry="6" fill="#333"/>
    <circle cx="46" cy="50" r="2.5" fill="white"/>
    <circle cx="78" cy="50" r="2.5" fill="white"/>
    <path d="M36 82 Q60 64 84 82" stroke="#1D4ED8" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M46 50 Q44 62 42 72" stroke="#BFDBFE" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="42" cy="74" r="5" fill="#BFDBFE"/>
    <path d="M76 50 Q74 62 72 72" stroke="#BFDBFE" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="72" cy="74" r="5" fill="#BFDBFE"/>
  </svg>`,

  new: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#FFFBEB"/>
    <polygon points="60,18 69,47 100,47 75,65 84,94 60,76 36,94 45,65 20,47 51,47" fill="#FCD34D" stroke="#F59E0B" stroke-width="2"/>
    <polygon points="60,30 67,52 90,52 72,65 79,87 60,74 41,87 48,65 30,52 53,52" fill="#FDE68A"/>
    <text x="18" y="24" font-size="14" fill="#F59E0B">✦</text>
    <text x="90" y="20" font-size="10" fill="#F59E0B">✦</text>
    <text x="96" y="92" font-size="12" fill="#F59E0B">★</text>
    <text x="12" y="96" font-size="10" fill="#F59E0B">★</text>
  </svg>`,

  old: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#FEF3C7"/>
    <rect x="24" y="36" width="72" height="56" rx="4" fill="#92400E"/>
    <rect x="28" y="40" width="64" height="48" rx="3" fill="#B45309"/>
    <line x1="60" y1="40" x2="60" y2="88" stroke="#92400E" stroke-width="3"/>
    <line x1="28" y1="64" x2="92" y2="64" stroke="#92400E" stroke-width="3"/>
    <path d="M28 40 Q40 50 52 42" stroke="#6B3A1F" stroke-width="2" fill="none"/>
    <path d="M68 42 Q80 50 92 44" stroke="#6B3A1F" stroke-width="2" fill="none"/>
    <path d="M30 72 Q45 80 55 74" stroke="#6B3A1F" stroke-width="2" fill="none"/>
    <rect x="52" y="56" width="16" height="16" rx="8" fill="#78350F"/>
    <circle cx="60" cy="64" r="4" fill="#92400E"/>
    <path d="M36 55 L42 48 L36 48 Z" fill="#EF4444" opacity="0.6"/>
    <path d="M75 70 L82 65 L82 72 Z" fill="#EF4444" opacity="0.5"/>
  </svg>`,

  soft: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#F0F9FF"/>
    <ellipse cx="60" cy="68" rx="48" ry="30" fill="white" filter="url(#blur)"/>
    <circle cx="30" cy="72" r="22" fill="white"/>
    <circle cx="55" cy="62" r="26" fill="white"/>
    <circle cx="80" cy="65" r="24" fill="white"/>
    <circle cx="95" cy="75" r="18" fill="white"/>
    <circle cx="16" cy="80" r="16" fill="white"/>
    <circle cx="60" cy="58" r="20" fill="#F8FAFC"/>
    <ellipse cx="42" cy="60" rx="8" ry="6" fill="white" opacity="0.8"/>
  </svg>`,

  hard: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#F8FAFC"/>
    <polygon points="60,22 88,42 88,82 60,98 32,82 32,42" fill="#94A3B8"/>
    <polygon points="60,22 88,42 60,48 32,42" fill="#CBD5E1"/>
    <polygon points="32,42 60,48 60,98 32,82" fill="#64748B"/>
    <polygon points="88,42 60,48 60,98 88,82" fill="#475569"/>
    <line x1="40" y1="50" x2="50" y2="56" stroke="#B0BEC5" stroke-width="2"/>
    <line x1="42" y1="60" x2="52" y2="64" stroke="#B0BEC5" stroke-width="1.5"/>
    <line x1="68" y1="52" x2="78" y2="56" stroke="#546E7A" stroke-width="2"/>
  </svg>`,

  wide: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#FFF0F6"/>
    <rect x="14" y="46" width="92" height="28" rx="14" fill="#FBCFE8" stroke="#F472B6" stroke-width="2"/>
    <g fill="#EC4899">
      <polygon points="14,60 30,48 30,72"/><polygon points="106,60 90,48 90,72"/>
    </g>
    <line x1="38" y1="60" x2="82" y2="60" stroke="#F9A8D4" stroke-width="3" stroke-dasharray="6,4"/>
    <text x="60" y="106" font-size="10" fill="#EC4899" font-weight="900" text-anchor="middle" font-family="sans-serif">ひろびろ〜！</text>
  </svg>`,

  narrow: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#F5F3FF"/>
    <rect x="44" y="30" width="32" height="60" rx="6" fill="#DDD6FE" stroke="#A78BFA" stroke-width="2"/>
    <g fill="#7C3AED">
      <polygon points="44,42 30,35 30,50"/><polygon points="76,42 90,35 90,50"/>
      <polygon points="44,78 30,70 30,85"/><polygon points="76,78 90,70 90,85"/>
    </g>
    <text x="60" y="108" font-size="9" fill="#7C3AED" font-weight="900" text-anchor="middle" font-family="sans-serif">ぎゅうぎゅう！</text>
  </svg>`,

  clean: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#EFF6FF"/>
    <rect x="28" y="38" width="64" height="44" rx="8" fill="white" stroke="#BFDBFE" stroke-width="2"/>
    <rect x="32" y="42" width="56" height="36" rx="6" fill="#DBEAFE"/>
    <g fill="#FCD34D" font-size="16" font-family="sans-serif">
      <text x="44" y="62">✦</text><text x="64" y="52">★</text>
      <text x="72" y="70">✦</text><text x="34" y="72">★</text>
    </g>
    <circle cx="52" cy="60" r="3" fill="white" opacity="0.8"/>
    <circle cx="68" cy="64" r="2" fill="white" opacity="0.7"/>
  </svg>`,

  dirty: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="58" fill="#FEF3C7"/>
    <ellipse cx="60" cy="80" rx="44" ry="18" fill="#78350F" opacity="0.5"/>
    <circle cx="60" cy="72" r="28" fill="#92400E"/>
    <circle cx="46" cy="66" r="12" fill="#78350F"/>
    <circle cx="74" cy="70" r="10" fill="#78350F"/>
    <circle cx="55" cy="82" r="9" fill="#78350F"/>
    <circle cx="38" cy="56" r="8" fill="#92400E"/>
    <circle cx="80" cy="60" r="7" fill="#92400E"/>
    <circle cx="60" cy="58" r="5" fill="#B45309"/>
    <ellipse cx="44" cy="44" rx="6" ry="4" fill="#B45309" transform="rotate(-20,44,44)"/>
    <ellipse cx="80" cy="48" rx="5" ry="3" fill="#B45309" transform="rotate(15,80,48)"/>
    <circle cx="60" cy="40" r="4" fill="#B45309"/>
  </svg>`
};

/* ── Character SVG Builder ── */
function buildDogSVG(state) {
  const expressions = {
    normal:    { eyes: `<circle cx="38" cy="52" r="6" fill="#2D1B00"/><circle cx="62" cy="52" r="6" fill="#2D1B00"/><circle cx="40" cy="50" r="2.5" fill="white"/><circle cx="64" cy="50" r="2.5" fill="white"/>`, mouth: `<path d="M44 64 Q50 70 56 64" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, extra: '' },
    happy:     { eyes: `<path d="M33 52 Q38 46 43 52" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M57 52 Q62 46 67 52" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, mouth: `<path d="M40 64 Q50 76 60 64" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="68" rx="8" ry="5" fill="#FF6B9D" opacity="0.6"/>`, extra: '<ellipse cx="30" cy="60" rx="9" ry="6" fill="#FCA5A5" opacity="0.5"/><ellipse cx="70" cy="60" rx="9" ry="6" fill="#FCA5A5" opacity="0.5"/>' },
    sad:       { eyes: `<path d="M33 49 Q38 54 43 49" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M57 49 Q62 54 67 49" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, mouth: `<path d="M42 70 Q50 62 58 70" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, extra: '<line x1="36" y1="56" x2="34" y2="64" stroke="#93C5FD" stroke-width="2" stroke-linecap="round"/><circle cx="33" cy="66" r="4" fill="#93C5FD" opacity="0.8"/>' },
    surprised: { eyes: `<circle cx="38" cy="52" r="8" fill="#2D1B00"/><circle cx="62" cy="52" r="8" fill="#2D1B00"/><circle cx="41" cy="49" r="3" fill="white"/><circle cx="65" cy="49" r="3" fill="white"/>`, mouth: `<ellipse cx="50" cy="68" rx="7" ry="8" fill="#2D1B00"/>`, extra: '' },
    sweat:     { eyes: `<circle cx="38" cy="52" r="6" fill="#2D1B00"/><circle cx="62" cy="52" r="6" fill="#2D1B00"/><circle cx="40" cy="50" r="2.5" fill="white"/><circle cx="64" cy="50" r="2.5" fill="white"/>`, mouth: `<path d="M44 65 Q50 70 56 65" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, extra: '<path d="M72 42 Q74 50 70 52" stroke="#60A5FA" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="69" cy="54" r="5" fill="#93C5FD" opacity="0.8"/>' },
    shiver:    { eyes: `<circle cx="38" cy="52" r="6" fill="#2D1B00"/><circle cx="62" cy="52" r="6" fill="#2D1B00"/>`, mouth: `<path d="M42 66 Q46 62 50 66 Q54 70 58 66" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, extra: '<text x="24" y="44" font-size="14" fill="#93C5FD">❄</text><text x="68" y="38" font-size="10" fill="#93C5FD">❄</text>' },
    run:       { eyes: `<circle cx="40" cy="50" r="6" fill="#2D1B00"/><circle cx="64" cy="50" r="6" fill="#2D1B00"/><circle cx="42" cy="48" r="2.5" fill="white"/><circle cx="66" cy="48" r="2.5" fill="white"/>`, mouth: `<path d="M44 63 Q50 70 56 63" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, extra: '<line x1="22" y1="55" x2="14" y2="55" stroke="#FF6B35" stroke-width="3" stroke-linecap="round" opacity="0.7"/><line x1="20" y1="63" x2="10" y2="63" stroke="#FF6B35" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>' },
    slow:      { eyes: `<path d="M33 54 Q38 58 43 54" stroke="#2D1B00" stroke-width="3" fill="none"/><path d="M57 54 Q62 58 67 54" stroke="#2D1B00" stroke-width="3" fill="none"/>`, mouth: `<path d="M44 66 Q50 70 56 66" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, extra: '<text x="26" y="38" font-size="18">💤</text>' },
    float:     { eyes: `<path d="M33 52 Q38 46 43 52" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M57 52 Q62 46 67 52" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, mouth: `<path d="M42 64 Q50 72 58 64" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, extra: '<line x1="20" y1="72" x2="28" y2="72" stroke="#FCD34D" stroke-width="2" stroke-dasharray="4,3"/><line x1="72" y1="70" x2="80" y2="70" stroke="#FCD34D" stroke-width="2" stroke-dasharray="4,3"/>' },
    strain:    { eyes: `<path d="M33 50 Q38 55 43 50" stroke="#2D1B00" stroke-width="3" fill="none"/><path d="M57 50 Q62 55 67 50" stroke="#2D1B00" stroke-width="3" fill="none"/>`, mouth: `<path d="M44 66 Q50 60 56 66" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, extra: '<path d="M32 40 Q36 34 30 30" stroke="#EF4444" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M68 40 Q64 34 70 30" stroke="#EF4444" stroke-width="2.5" fill="none" stroke-linecap="round"/>' },
    sunny:     { eyes: `<path d="M33 52 Q38 46 43 52" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M57 52 Q62 46 67 52" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, mouth: `<path d="M40 64 Q50 76 60 64" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, extra: '<text x="66" y="30" font-size="20">☀️</text>' },
    sleepy:    { eyes: `<path d="M33 54 Q38 58 43 54" stroke="#2D1B00" stroke-width="3" fill="none"/><path d="M57 54 Q62 58 67 54" stroke="#2D1B00" stroke-width="3" fill="none"/>`, mouth: `<path d="M44 67 Q50 72 56 67" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, extra: '<text x="66" y="34" font-size="18">🌙</text><text x="26" y="36" font-size="14">💤</text>' },
    stretch:   { eyes: `<circle cx="38" cy="52" r="6" fill="#2D1B00"/><circle cx="62" cy="52" r="6" fill="#2D1B00"/><circle cx="40" cy="50" r="2.5" fill="white"/><circle cx="64" cy="50" r="2.5" fill="white"/>`, mouth: `<path d="M44 64 Q50 70 56 64" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, extra: '' },
    crouch:    { eyes: `<circle cx="38" cy="56" r="6" fill="#2D1B00"/><circle cx="62" cy="56" r="6" fill="#2D1B00"/>`, mouth: `<path d="M44 67 Q50 73 56 67" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, extra: '' },
    excited:   { eyes: `<path d="M33 52 Q38 46 43 52" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M57 52 Q62 46 67 52" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, mouth: `<path d="M40 64 Q50 76 60 64" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, extra: '<text x="66" y="30" font-size="14">✨</text><text x="18" y="34" font-size="12">⭐</text>' },
  };
  const e = expressions[state] || expressions.normal;
  return `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
    <!-- Body -->
    <ellipse cx="50" cy="95" rx="32" ry="18" fill="#F4A94E" opacity="0.4"/>
    <ellipse cx="50" cy="85" rx="28" ry="22" fill="#F4A94E"/>
    <!-- Head -->
    <ellipse cx="50" cy="55" rx="30" ry="28" fill="#F4A94E"/>
    <!-- Ears -->
    <ellipse cx="22" cy="35" rx="12" ry="18" fill="#E8944A" transform="rotate(-15,22,35)"/>
    <ellipse cx="78" cy="35" rx="12" ry="18" fill="#E8944A" transform="rotate(15,78,35)"/>
    <ellipse cx="22" cy="35" rx="7" ry="13" fill="#FFC9A0" transform="rotate(-15,22,35)"/>
    <ellipse cx="78" cy="35" rx="7" ry="13" fill="#FFC9A0" transform="rotate(15,78,35)"/>
    <!-- Snout -->
    <ellipse cx="50" cy="66" rx="14" ry="10" fill="#FFC9A0"/>
    <ellipse cx="50" cy="63" rx="7" ry="4" fill="#E8944A"/>
    <!-- Nose -->
    <ellipse cx="50" cy="62" rx="5" ry="3.5" fill="#2D1B00"/>
    <circle cx="48" cy="61" r="1.5" fill="white" opacity="0.6"/>
    <!-- Eyes -->
    ${e.eyes}
    <!-- Mouth -->
    ${e.mouth}
    <!-- Extra -->
    ${e.extra}
    <!-- Tail -->
    <path d="M78 88 Q90 80 86 70" stroke="#E8944A" stroke-width="8" fill="none" stroke-linecap="round"/>
    <!-- Legs -->
    <ellipse cx="34" cy="103" rx="10" ry="8" fill="#E8944A"/>
    <ellipse cx="66" cy="103" rx="10" ry="8" fill="#E8944A"/>
  </svg>`;
}

function buildCatSVG(state) {
  const expressions = {
    normal:    { eyes: `<circle cx="38" cy="52" r="6" fill="#2D1B00"/><circle cx="62" cy="52" r="6" fill="#2D1B00"/><circle cx="40" cy="50" r="2.5" fill="white"/><circle cx="64" cy="50" r="2.5" fill="white"/>`, mouth: `<path d="M50 65 L44 68"/><path d="M50 65 L56 68"/>`, extra: '' },
    happy:     { eyes: `<path d="M33 52 Q38 46 43 52" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M57 52 Q62 46 67 52" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, mouth: `<path d="M50 65 L44 68"/><path d="M50 65 L56 68"/><path d="M42 68 Q50 74 58 68" stroke="#2D1B00" stroke-width="2.5" fill="none" stroke-linecap="round"/>`, extra: '<ellipse cx="30" cy="60" rx="9" ry="6" fill="#FCA5A5" opacity="0.5"/><ellipse cx="70" cy="60" rx="9" ry="6" fill="#FCA5A5" opacity="0.5"/>' },
    sad:       { eyes: `<path d="M33 49 Q38 54 43 49" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M57 49 Q62 54 67 49" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, mouth: `<path d="M50 65 L44 68"/><path d="M50 65 L56 68"/><path d="M42 70 Q50 64 58 70" stroke="#2D1B00" stroke-width="2.5" fill="none" stroke-linecap="round"/>`, extra: '<line x1="34" y1="56" x2="32" y2="64" stroke="#93C5FD" stroke-width="2" stroke-linecap="round"/><circle cx="31" cy="66" r="4" fill="#93C5FD" opacity="0.8"/>' },
    surprised: { eyes: `<circle cx="38" cy="52" r="8" fill="#2D1B00"/><circle cx="62" cy="52" r="8" fill="#2D1B00"/><circle cx="41" cy="49" r="3" fill="white"/><circle cx="65" cy="49" r="3" fill="white"/>`, mouth: `<ellipse cx="50" cy="68" rx="6" ry="7" fill="#2D1B00"/>`, extra: '' },
    sweat:     { eyes: `<circle cx="38" cy="52" r="6" fill="#2D1B00"/><circle cx="62" cy="52" r="6" fill="#2D1B00"/>`, mouth: `<path d="M50 65 L44 68"/><path d="M50 65 L56 68"/>`, extra: '<path d="M72 40 Q74 48 70 50" stroke="#60A5FA" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="69" cy="52" r="5" fill="#93C5FD" opacity="0.8"/>' },
    shiver:    { eyes: `<circle cx="38" cy="52" r="6" fill="#2D1B00"/><circle cx="62" cy="52" r="6" fill="#2D1B00"/>`, mouth: `<path d="M42 66 Q46 62 50 66 Q54 70 58 66" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, extra: '<text x="24" y="44" font-size="14" fill="#93C5FD">❄</text><text x="68" y="38" font-size="10" fill="#93C5FD">❄</text>' },
    run:       { eyes: `<circle cx="40" cy="50" r="6" fill="#2D1B00"/><circle cx="64" cy="50" r="6" fill="#2D1B00"/>`, mouth: `<path d="M50 65 L44 68"/><path d="M50 65 L56 68"/>`, extra: '<line x1="22" y1="55" x2="14" y2="55" stroke="#FF6B35" stroke-width="3" stroke-linecap="round" opacity="0.7"/>' },
    slow:      { eyes: `<path d="M33 54 Q38 58 43 54" stroke="#2D1B00" stroke-width="3" fill="none"/><path d="M57 54 Q62 58 67 54" stroke="#2D1B00" stroke-width="3" fill="none"/>`, mouth: `<path d="M50 65 L44 68"/><path d="M50 65 L56 68"/>`, extra: '<text x="66" y="36" font-size="14">💤</text>' },
    float:     { eyes: `<path d="M33 52 Q38 46 43 52" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M57 52 Q62 46 67 52" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, mouth: `<path d="M50 65 L44 68"/><path d="M50 65 L56 68"/>`, extra: '' },
    strain:    { eyes: `<path d="M33 50 Q38 55 43 50" stroke="#2D1B00" stroke-width="3" fill="none"/><path d="M57 50 Q62 55 67 50" stroke="#2D1B00" stroke-width="3" fill="none"/>`, mouth: `<path d="M50 65 L44 68"/><path d="M50 65 L56 68"/>`, extra: '' },
    sunny:     { eyes: `<path d="M33 52 Q38 46 43 52" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M57 52 Q62 46 67 52" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, mouth: `<path d="M50 65 L44 68"/><path d="M50 65 L56 68"/><path d="M42 68 Q50 74 58 68" stroke="#2D1B00" stroke-width="2.5" fill="none" stroke-linecap="round"/>`, extra: '<text x="66" y="30" font-size="18">☀️</text>' },
    sleepy:    { eyes: `<path d="M33 54 Q38 58 43 54" stroke="#2D1B00" stroke-width="3" fill="none"/><path d="M57 54 Q62 58 67 54" stroke="#2D1B00" stroke-width="3" fill="none"/>`, mouth: `<path d="M50 65 L44 68"/><path d="M50 65 L56 68"/>`, extra: '<text x="66" y="34" font-size="16">🌙</text>' },
    stretch:   { eyes: `<circle cx="38" cy="52" r="6" fill="#2D1B00"/><circle cx="62" cy="52" r="6" fill="#2D1B00"/>`, mouth: `<path d="M50 65 L44 68"/><path d="M50 65 L56 68"/>`, extra: '' },
    crouch:    { eyes: `<circle cx="38" cy="56" r="6" fill="#2D1B00"/><circle cx="62" cy="56" r="6" fill="#2D1B00"/>`, mouth: `<path d="M50 67 L44 70"/><path d="M50 67 L56 70"/>`, extra: '' },
    excited:   { eyes: `<path d="M33 52 Q38 46 43 52" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M57 52 Q62 46 67 52" stroke="#2D1B00" stroke-width="3" fill="none" stroke-linecap="round"/>`, mouth: `<path d="M50 65 L44 68"/><path d="M50 65 L56 68"/><path d="M42 68 Q50 74 58 68" stroke="#2D1B00" stroke-width="2.5" fill="none" stroke-linecap="round"/>`, extra: '<text x="66" y="30" font-size="14">✨</text><text x="18" y="34" font-size="12">⭐</text>' },
  };
  const e = expressions[state] || expressions.normal;
  return `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
    <!-- Body -->
    <ellipse cx="50" cy="95" rx="30" ry="17" fill="#F9A8D4" opacity="0.4"/>
    <ellipse cx="50" cy="85" rx="26" ry="20" fill="#FBCFE8"/>
    <!-- Head -->
    <ellipse cx="50" cy="55" rx="30" ry="28" fill="#FBCFE8"/>
    <!-- Cat ears -->
    <polygon points="20,38 12,14 32,28" fill="#FBCFE8"/>
    <polygon points="80,38 88,14 68,28" fill="#FBCFE8"/>
    <polygon points="22,36 16,18 30,28" fill="#FCA5A5"/>
    <polygon points="78,36 84,18 70,28" fill="#FCA5A5"/>
    <!-- Snout -->
    <ellipse cx="50" cy="65" rx="12" ry="8" fill="white"/>
    <!-- Nose -->
    <ellipse cx="50" cy="61" rx="4.5" ry="3" fill="#EC4899"/>
    <circle cx="48.5" cy="60" r="1.5" fill="white" opacity="0.5"/>
    <!-- Whiskers -->
    <line x1="28" y1="63" x2="44" y2="65" stroke="#2D1B00" stroke-width="1.5" opacity="0.5"/>
    <line x1="28" y1="67" x2="44" y2="67" stroke="#2D1B00" stroke-width="1.5" opacity="0.5"/>
    <line x1="72" y1="63" x2="56" y2="65" stroke="#2D1B00" stroke-width="1.5" opacity="0.5"/>
    <line x1="72" y1="67" x2="56" y2="67" stroke="#2D1B00" stroke-width="1.5" opacity="0.5"/>
    <!-- Eyes -->
    ${e.eyes}
    <!-- Mouth -->
    <g stroke="#2D1B00" stroke-width="2" fill="none" stroke-linecap="round">${e.mouth}</g>
    <!-- Extra -->
    ${e.extra}
    <!-- Tail -->
    <path d="M76 90 Q92 82 88 68 Q86 60 78 66" stroke="#F472B6" stroke-width="6" fill="none" stroke-linecap="round"/>
    <!-- Legs -->
    <ellipse cx="34" cy="103" rx="9" ry="7" fill="#F9A8D4"/>
    <ellipse cx="66" cy="103" rx="9" ry="7" fill="#F9A8D4"/>
  </svg>`;
}

function renderChars(containerId, dogState, catState, opts = {}) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const dogAnim = opts.dogAnim ? ` ${opts.dogAnim}` : '';
  const catAnim = opts.catAnim ? ` ${opts.catAnim}` : '';
  el.innerHTML =
    `<div class="char-wrap dog-wrap${dogAnim}">${buildDogSVG(dogState)}</div>` +
    `<div class="char-wrap cat-wrap${catAnim}">${buildCatSVG(catState)}</div>`;
}

/* ── Utility ── */
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function speak(text) {
  if (!STATE.settings.voice) return;
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP';
  u.rate = 0.9;
  u.pitch = 1.2;
  window.speechSynthesis.speak(u);
}
function saveState() {
  try {
    localStorage.setItem(LS_SETTINGS, JSON.stringify(STATE.settings));
    localStorage.setItem(LS_RECORDS, JSON.stringify(STATE.records));
  } catch (_) {}
}
function loadState() {
  try {
    const s = localStorage.getItem(LS_SETTINGS);
    if (s) Object.assign(STATE.settings, JSON.parse(s));
    const r = localStorage.getItem(LS_RECORDS);
    if (r) Object.assign(STATE.records, JSON.parse(r));
  } catch (_) {}
}

/* ── Confetti ── */
function launchConfetti() {
  const layer = document.getElementById('confetti-layer');
  if (!layer) return;
  layer.innerHTML = '';
  const colors = ['#FF6B35','#FFE66D','#4ECDC4','#FF6B9D','#A855F7','#22C55E','#3B82F6'];
  for (let i = 0; i < 60; i++) {
    const d = document.createElement('div');
    d.style.cssText = `
      position:absolute;
      width:${8 + Math.random()*10}px;
      height:${8 + Math.random()*10}px;
      background:${rand(colors)};
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      left:${Math.random()*100}%;
      top:-20px;
      opacity:1;
      pointer-events:none;
      transform:rotate(${Math.random()*360}deg);
      animation: confetti-fall ${1.2 + Math.random()*1.5}s ease-in ${Math.random()*0.6}s forwards;
    `;
    layer.appendChild(d);
  }
  // inject keyframes once
  if (!document.getElementById('confetti-kf')) {
    const st = document.createElement('style');
    st.id = 'confetti-kf';
    st.textContent = `@keyframes confetti-fall {
      0%   { transform: translateY(0) rotate(0deg); opacity:1; }
      100% { transform: translateY(110vh) rotate(720deg); opacity:0; }
    }`;
    document.head.appendChild(st);
  }
  setTimeout(() => { layer.innerHTML = ''; }, 3000);
}

/* ── App ── */
const App = (() => {
  /* ── Screen management ── */
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('screen-' + id);
    if (el) el.classList.add('active');
    STATE.screen = id;
  }

  /* ── Menu ── */
  function goMenu() {
    showScreen('menu');
    renderChars('menu-chars', 'happy', 'happy', { dogAnim: 'anim-bounce', catAnim: 'anim-sway' });
    speak('はんたいことばで あそぼう！');
  }

  /* ── Settings ── */
  function goSettings() {
    showScreen('settings');
    renderChars('settings-chars', 'normal', 'normal', { catAnim: 'anim-sway' });
    _refreshSettingsUI();
  }

  function _refreshSettingsUI() {
    const vt = document.getElementById('voice-toggle');
    const vs = document.getElementById('voice-status');
    if (vt) vt.setAttribute('aria-checked', STATE.settings.voice ? 'true' : 'false');
    if (vs) vs.textContent = STATE.settings.voice ? 'ON' : 'OFF';
    ['easy','hard'].forEach(d => {
      const btn = document.getElementById('diff-' + d);
      if (btn) btn.classList.toggle('diff-active', STATE.settings.difficulty === d);
    });
  }

  function toggleVoice() {
    STATE.settings.voice = !STATE.settings.voice;
    _refreshSettingsUI();
    saveState();
    speak('こえガイドをオンにしました');
  }

  function setDifficulty(d) {
    STATE.settings.difficulty = d;
    _refreshSettingsUI();
    saveState();
  }

  function resetRecords() {
    if (!confirm('きろくをリセットしますか？')) return;
    STATE.records = { maxStreak: 0, totalCorrect: 0, totalPlayed: 0, gamesPlayed: 0 };
    saveState();
    speak('きろくをリセットしました');
  }

  /* ── Records ── */
  function goRecords() {
    showScreen('records');
    renderChars('settings-chars', 'happy', 'happy');
    _renderRecords();
  }

  function _renderRecords() {
    const body = document.getElementById('records-body');
    if (!body) return;
    const r = STATE.records;
    const acc = r.totalPlayed > 0 ? Math.round(r.totalCorrect / r.totalPlayed * 100) : 0;
    body.innerHTML = `
      <div class="rec-cards">
        <div class="rec-card">
          <div class="rec-icon">🎮</div>
          <div class="rec-val">${r.gamesPlayed}</div>
          <div class="rec-lbl">あそんだかいすう</div>
        </div>
        <div class="rec-card">
          <div class="rec-icon">⭕</div>
          <div class="rec-val">${r.totalCorrect}</div>
          <div class="rec-lbl">せいかいした！</div>
        </div>
        <div class="rec-card">
          <div class="rec-icon">🔥</div>
          <div class="rec-val">${r.maxStreak}</div>
          <div class="rec-lbl">さいこうれんぞく</div>
        </div>
        <div class="rec-card">
          <div class="rec-icon">💯</div>
          <div class="rec-val">${acc}%</div>
          <div class="rec-lbl">せいかいりつ</div>
        </div>
      </div>
      <div class="rec-chars" id="rec-chars"></div>
    `;
    renderChars('rec-chars', r.maxStreak >= 5 ? 'excited' : 'happy', r.maxStreak >= 5 ? 'excited' : 'happy');
  }

  /* ── Game Setup ── */
  const STAGE_SIZE = 5;

  function startGame() {
    const easy = STATE.settings.difficulty === 'easy';
    const pool = shuffle(easy ? ALL_QUESTIONS.filter(q => q.easy) : ALL_QUESTIONS);
    STATE.game = {
      questions: pool,
      qIndex: 0,
      streak: 0,
      stage: 1,
      stageCorrect: 0,
      answering: false
    };
    STATE.records.gamesPlayed++;
    saveState();
    showScreen('quiz');
    _showQuestion();
  }

  /* ── Quiz ── */
  function _showQuestion() {
    const g = STATE.game;
    const q = g.questions[g.qIndex % g.questions.length];

    // header
    document.getElementById('streak-val').textContent = g.streak;
    document.getElementById('streak-fire').style.opacity = g.streak >= 3 ? '1' : '0.3';
    document.getElementById('stage-num').textContent = g.stage;

    // illustration
    const illEl = document.getElementById('q-illustration');
    illEl.innerHTML = CONCEPT_SVGS[q.concept] || '';

    // word
    document.getElementById('q-word').textContent = q.word;

    // characters
    renderChars('quiz-chars', q.charState || 'normal', q.charState || 'normal');

    // build answers
    const easy = STATE.settings.difficulty === 'easy';
    let answers = [q.correct];
    const distractors = shuffle(q.distractors);
    if (easy) {
      answers.push(distractors[0]);
    } else {
      answers.push(distractors[0], distractors[1]);
    }
    answers = shuffle(answers);

    const grid = document.getElementById('answers-grid');
    grid.className = 'answers-grid' + (easy ? '' : ' cols-3');
    grid.innerHTML = answers.map(a =>
      `<button class="ans-btn" onclick="App.checkAnswer('${a.word}','${q.correct.word}')" aria-label="${a.word}">
        <div class="ans-svg">${CONCEPT_SVGS[a.concept] || ''}</div>
        <span class="ans-word">${a.word}</span>
      </button>`
    ).join('');

    // feedback clear
    const fo = document.getElementById('feedback-overlay');
    fo.className = 'feedback-overlay';
    fo.innerHTML = '';

    g.answering = false;
    speak(q.word + '　の　はんたいは？');
  }

  function checkAnswer(chosen, correct) {
    const g = STATE.game;
    if (g.answering) return;
    g.answering = true;

    const isCorrect = chosen === correct;
    const fo = document.getElementById('feedback-overlay');

    STATE.records.totalPlayed++;
    if (isCorrect) {
      STATE.records.totalCorrect++;
      g.streak++;
      g.stageCorrect++;
      if (g.streak > STATE.records.maxStreak) STATE.records.maxStreak = g.streak;
      saveState();

      fo.className = 'feedback-overlay correct-bg show';
      fo.innerHTML = `<span class="fb-emoji">⭕</span><span class="fb-text">${rand(VOICE_CORRECT)}</span>`;
      renderChars('quiz-chars', 'happy', 'happy', { dogAnim: 'anim-dance', catAnim: 'anim-bounce' });
      speak(rand(VOICE_CORRECT));

      // Highlight correct button
      document.querySelectorAll('.ans-btn').forEach(btn => {
        const w = btn.querySelector('.ans-word');
        if (w && w.textContent === chosen) btn.classList.add('correct');
        btn.disabled = true;
      });

      setTimeout(() => {
        g.qIndex++;
        // Stage clear check
        if (g.stageCorrect >= STAGE_SIZE) {
          _showStageClear();
        } else {
          _showQuestion();
        }
      }, 1200);
    } else {
      g.streak = 0;
      saveState();

      fo.className = 'feedback-overlay wrong-bg show';
      fo.innerHTML = `<span class="fb-emoji">❌</span><span class="fb-text">${rand(VOICE_WRONG)}</span>`;
      renderChars('quiz-chars', 'sad', 'sad');
      speak(rand(VOICE_WRONG));

      // Highlight wrong + correct
      document.querySelectorAll('.ans-btn').forEach(btn => {
        const w = btn.querySelector('.ans-word');
        if (!w) return;
        if (w.textContent === chosen) btn.classList.add('wrong');
        if (w.textContent === correct) btn.classList.add('correct');
        btn.disabled = true;
      });

      setTimeout(() => {
        g.qIndex++;
        _showQuestion();
      }, 1600);
    }
  }

  /* ── Stage Clear ── */
  function _showStageClear() {
    const g = STATE.game;
    showScreen('clear');
    launchConfetti();
    speak('ステージ' + g.stage + 'クリア！やったね！');

    const body = document.getElementById('clear-body');
    body.innerHTML = `
      <div class="clear-banner">
        <p class="clear-stage-lbl">ステージ ${g.stage}</p>
        <h2 class="clear-title">クリア！</h2>
        <p class="clear-emoji">🎉🌟🎊</p>
      </div>
      <div class="clear-chars" id="clear-chars"></div>
      <div class="clear-actions">
        <button class="btn-menu btn-play" onclick="App.nextStage()">
          <span class="btn-icon">▶</span>
          <span class="btn-txt">つぎへ！</span>
        </button>
        <button class="btn-menu btn-set" onclick="App.goMenu()">
          <span class="btn-icon">🏠</span>
          <span class="btn-txt">メニュー</span>
        </button>
      </div>
    `;
    renderChars('clear-chars', 'excited', 'excited', { dogAnim: 'anim-dance', catAnim: 'anim-dance' });
  }

  function nextStage() {
    const g = STATE.game;
    g.stage++;
    g.stageCorrect = 0;
    // Reshuffle remaining questions for next stage
    g.questions = shuffle(STATE.settings.difficulty === 'easy'
      ? ALL_QUESTIONS.filter(q => q.easy)
      : ALL_QUESTIONS);
    g.qIndex = 0;
    showScreen('quiz');
    _showQuestion();
  }

  /* ── Init ── */
  function init() {
    loadState();
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
    goMenu();
  }

  return { startGame, goMenu, goSettings, goRecords, toggleVoice, setDifficulty, resetRecords, checkAnswer, nextStage };
})();

window.addEventListener('DOMContentLoaded', () => {
  // load state inline before calling init
  (() => {
    try {
      const s = localStorage.getItem('opposites_settings');
      if (s) Object.assign(STATE.settings, JSON.parse(s));
      const r = localStorage.getItem('opposites_records');
      if (r) Object.assign(STATE.records, JSON.parse(r));
    } catch (_) {}
  })();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
  App.goMenu();
});

