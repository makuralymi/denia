import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface Song {
  name: string;
  url: string;
}

export const useAudioStore = defineStore('audio', () => {
  const currentTime = ref(0);
  const duration = ref(0);
  const isPlaying = ref(false);
  const currentSongIndex = ref(2);
  const playlist = ref<Song[]>([
    { name: '枯音染秽无凭裂章', url: '/audio/audio.mp3' },
    { name: '坠入虚无 (Decensus Ad Nihilum) - 鸣潮先约电台、Crywolf、kahoca', url: '/audio/audio2.mp3' },
    { name: '直到下次再见 (Dasvidaniya) - 鸣潮先约电台、Crywolf、Cxssidy', url: '/audio/audio3.mp3' },
    { name: '予以宽慰的黑夜', url: '/audio/audio4.mp3' },
  ]);

  const currentSong = computed(() => playlist.value[currentSongIndex.value]);

  const currentLrcUrl = computed(() => {
    const song = currentSong.value;
    if (!song) return null;
    return song.url.replace(/\.mp3$/i, '.lrc');
  });

  return {
    currentTime,
    duration,
    isPlaying,
    currentSongIndex,
    playlist,
    currentSong,
    currentLrcUrl,
  };
});
