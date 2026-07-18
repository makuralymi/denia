import { ref, watch } from 'vue';
import { useAudioStore } from '@/stores/audioStore';

export interface LyricLine {
  time: number;
  text: string;
}

export function useLyrics() {
  const audioStore = useAudioStore();
  const lyricLines = ref<LyricLine[]>([]);
  const activeIndex = ref(-1);
  const loading = ref(false);

  function parseLrc(lrcText: string): LyricLine[] {
    const lines: LyricLine[] = [];
    // Strip BOM if present
    const clean = lrcText.charCodeAt(0) === 0xFEFF ? lrcText.slice(1) : lrcText;
    const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;

    for (const line of clean.split('\n')) {
      const match = line.match(regex);
      if (match) {
        const minutes = parseInt(match[1]);
        const seconds = parseInt(match[2]);
        const ms = parseInt(match[3].padEnd(3, '0'));
        const time = minutes * 60 + seconds + ms / 1000;
        const text = match[4].trim();
        if (text) {
          lines.push({ time, text });
        }
      }
    }

    return lines.sort((a, b) => a.time - b.time);
  }

  async function loadLyrics(lrcUrl: string) {
    loading.value = true;
    activeIndex.value = -1;
    try {
      // Toy 平台兼容：.lrc 后缀可能不被 serve，先尝试 .lrc 再 fallback .txt
      const base = new URL(lrcUrl, window.location.href);
      let response = await fetch(base.href);
      if (!response.ok) {
        const fallback = new URL(lrcUrl.replace(/\.lrc$/, '.txt'), window.location.href);
        response = await fetch(fallback.href);
      }
      if (!response.ok) throw new Error('Failed to fetch');
      const text = await response.text();
      lyricLines.value = parseLrc(text);
    } catch {
      lyricLines.value = [];
    } finally {
      loading.value = false;
    }
  }

  watch(() => audioStore.currentLrcUrl, (url) => {
    if (url) {
      loadLyrics(url);
    } else {
      lyricLines.value = [];
      activeIndex.value = -1;
    }
  }, { immediate: true });

  watch(() => audioStore.currentTime, (time) => {
    const lines = lyricLines.value;
    if (lines.length === 0) {
      activeIndex.value = -1;
      return;
    }

    let idx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].time <= time) {
        idx = i;
      } else {
        break;
      }
    }
    activeIndex.value = idx;
  });

  return {
    lyricLines,
    activeIndex,
    loading,
  };
}
