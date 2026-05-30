import { watch } from 'vue'
import { useRouter } from 'vue-router'

interface SeoMeta {
  title: string
  description: string
  keywords?: string
  image?: string
}

const localeMeta: Record<string, SeoMeta> = {
  'zh-CN': {
    title: '达妮娅 - Denia | 鸣潮同人站点',
    description: '鸣潮达妮娅同人站点 — 探索达妮娅的角色档案、精美图集、Wiki百科与AI互动体验',
    keywords: '达妮娅, Denia, 鸣潮, 同人, 游戏同人站点, ACG, 沉浸式互动',
    image: '/image/denia.png'
  },
  en: {
    title: 'Denia | Wuthering Waves Fan Site',
    description: 'Denia fan site for Wuthering Waves. Explore character archives, gallery, wiki, and AI interactive experience.',
    keywords: 'Denia, Wuthering Waves, fan site, ACG, gallery, wiki, AI',
    image: '/image/denia.png'
  },
  ja: {
    title: 'ダニア - Denia | 鸣潮同人サイト',
    description: '鸣潮ダニア同人サイト。キャラクターアーカイブ、ギャラリー、Wiki、AIインタラクティブ体験を探索。',
    keywords: 'ダニア, Denia, 鸣潮, 同人, ギャラリー, Wiki, AI',
    image: '/image/denia.png'
  },
  ko: {
    title: '데니아 - Denia | 명조 팬 사이트',
    description: '명조 데니아 팬 사이트. 캐릭터 아카이브, 갤러리, 위키, AI 인터랙티브 체험을 탐험하세요.',
    keywords: '데니아, Denia, 명조, 팬사이트, 갤러리, 위키, AI',
    image: '/image/denia.png'
  }
}

const pageMeta: Record<string, Record<string, Partial<SeoMeta>>> = {
  welcome: {
    'zh-CN': { title: '达妮娅 - Denia | 欢迎' },
    en: { title: 'Denia | Welcome' },
    ja: { title: 'ダニア - Denia | ようこそ' },
    ko: { title: '데니아 - Denia | 환영' }
  },
  overview: {
    'zh-CN': { title: '概览 - 达妮娅 | Denia' },
    en: { title: 'Overview - Denia' },
    ja: { title: '概要 - ダニア | Denia' },
    ko: { title: '개요 - 데니아 | Denia' }
  },
  archive: {
    'zh-CN': {
      title: '角色档案 - 达妮娅 | Denia',
      description: '达妮娅完整角色档案 — 共鸣能力「泡影视阈」、基础信息、技能说明、角色设计、喜好与动作展示'
    },
    en: {
      title: 'Archive - Denia',
      description: 'Complete character archive of Denia — resonance ability, profile, skills, design notes, and action showcase.'
    },
    ja: {
      title: 'アーカイブ - ダニア | Denia',
      description: 'ダニアの完全キャラクターアーカイブ — 共鳴能力「泡影视阈」、プロフィール、スキル、デザイン、アクション展示。'
    },
    ko: {
      title: '아카이브 - 데니아 | Denia',
      description: '데니아 캐릭터 아카이브 — 공명 능력, 프로필, 스킬, 디자인, 액션 쇼케이스.'
    }
  },
  wiki: {
    'zh-CN': {
      title: 'Wiki百科 - 达妮娅 | Denia',
      description: '达妮娅Wiki百科 — 详细角色数据、技能数值、突破材料、培养攻略'
    },
    en: {
      title: 'Wiki - Denia',
      description: 'Denia Wiki — detailed character stats, skill numbers, ascension materials, and build guides.'
    },
    ja: {
      title: 'Wiki - ダニア | Denia',
      description: 'ダニアWiki — 詳細なキャラクターデータ、スキル数値、突破素材、育成ガイド。'
    },
    ko: {
      title: '위키 - 데니아 | Denia',
      description: '데니아 위키 — 상세 캐릭터 데이터, 스킬 수치, 돌파 재료, 육성 가이드.'
    }
  },
  gallery: {
    'zh-CN': {
      title: '图集 - 达妮娅 | Denia',
      description: '达妮娅精美图集 — 高清同人插画与官方立绘，粉白相框瀑布流展示'
    },
    en: {
      title: 'Gallery - Denia',
      description: 'Denia image gallery — high-res fan illustrations and official artwork in a pink-white framed masonry layout.'
    },
    ja: {
      title: 'ギャラリー - ダニア | Denia',
      description: 'ダニア画像ギャラリー — 高解像度イラストをピンクホワイトのフレームで美しく展示。'
    },
    ko: {
      title: '갤러리 - 데니아 | Denia',
      description: '데니아 이미지 갤러리 — 고해상도 일러스트를 핑크-화이트 프레임으로 감상.'
    }
  },
  ai: {
    'zh-CN': {
      title: 'AI娅娅 - 达妮娅 | Denia',
      description: '与AI达妮娅对话 — 基于Dify的智能聊天机器人，沉浸式角色互动体验'
    },
    en: {
      title: 'AI Denia | Chat',
      description: 'Chat with AI Denia — an intelligent chatbot based on Dify, immersive character interaction experience.'
    },
    ja: {
      title: 'AIダニア - ダニア | Denia',
      description: 'AIダニアと会話 — Difyベースのインテリジェントチャットボット、没入型キャラクターインタラクション。'
    },
    ko: {
      title: 'AI 데니아 | 채팅',
      description: 'AI 데니아와 대화 — Dify 기반 지능형 챗봇, 몰입형 캐릭터 인터랙션.'
    }
  },
  games: {
    'zh-CN': {
      title: '电玩 - 达妮娅 | Denia',
      description: '电玩小游戏 — 拉海洛方块（霓虹俄罗斯方块）等复古街机游戏合集'
    },
    en: {
      title: 'Games - Denia',
      description: 'Arcade games — La Hailuo Blocks (neon Tetris) and more retro arcade fun.'
    },
    ja: {
      title: 'ゲーム - ダニア | Denia',
      description: 'アーケードゲーム — ラハイロブロック（ネオンテトリス）などのレトロアーケードコレクション。'
    },
    ko: {
      title: '게임 - 데니아 | Denia',
      description: '아케이드 게임 — 라하이로 블록(네온 테트리스) 등 레트로 아케이드 모음.'
    }
  }
}

export function useSeo() {
  const router = useRouter()
  const locale = 'zh-CN' // Primary locale; extend via router param or cookie in the future

  function buildMeta(routeName: string): SeoMeta {
    const base = localeMeta[locale] || localeMeta['zh-CN']
    const page = pageMeta[routeName]?.[locale] || pageMeta[routeName]?.['zh-CN'] || {}
    return {
      title: page.title || base.title,
      description: page.description || base.description,
      keywords: page.keywords || base.keywords,
      image: page.image || base.image
    }
  }

  function applyMeta(meta: SeoMeta) {
    document.title = meta.title

    setMeta('description', meta.description)
    setMeta('keywords', meta.keywords || '')
    setMeta('og:title', meta.title)
    setMeta('og:description', meta.description)
    setMeta('twitter:title', meta.title)
    setMeta('twitter:description', meta.description)

    if (meta.image) {
      const fullImage = meta.image.startsWith('http')
        ? meta.image
        : `https://denia.makuraly.xyz${meta.image}`
      setMeta('og:image', fullImage)
      setMeta('twitter:image', fullImage)
    }
  }

  function setMeta(name: string, content: string) {
    const isProperty = name.startsWith('og:')
    const attr = isProperty ? 'property' : 'name'
    let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attr, name)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  watch(
    () => router.currentRoute.value.name,
    (routeName) => {
      const meta = buildMeta(routeName as string)
      applyMeta(meta)
    },
    { immediate: true }
  )
}
