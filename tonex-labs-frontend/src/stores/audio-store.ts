import { create } from "zustand";
import { audioManager } from "~/utils/audioManager";

export interface AudioInfo {
    id: string;
    title: string;
    voice: string | null;
    audioUrl: string | null;
    duration?: string;
    progress?: number;
    createdAt?: string;
    service?: string;
}

interface AudioState {
    currentAudio: AudioInfo | null;
    isPlaying: boolean;
    isPlaybarOpen: boolean;
    progress: number;
    duration: string;
    setCurrentAudio: (audio: AudioInfo | null) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setIsPlaybarOpen: (isPlaybarOpen: boolean) => void;
    setProgress: (progress: number) => void;
    setDuration: (duration: string) => void;

    playAudio: (audio: AudioInfo) => void;
    togglePlayPause: () => void;
    togglePlaybar: () => void;
    skipForward: (seconds: number) => void;
    skipBackward: (seconds: number) => void;
    downloadAudio: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
    currentAudio: null,
    isPlaying: false,
    isPlaybarOpen: false,
    progress: 50,
    duration: "0:00",
    
    setCurrentAudio: (audio) => set({ currentAudio: audio }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setIsPlaybarOpen: (isPlaybarOpen) => set({ isPlaybarOpen }),
    setProgress: (progress) => set({ progress }),
    setDuration: (duration) => set({ duration }),

    playAudio: (audio) => {
        const currentAudio = get().currentAudio;
        const audioElement = audioManager.initialize();

        if(currentAudio && currentAudio.audioUrl === audio?.audioUrl) {
            get().togglePlayPause();
            return;
        }

        set({ currentAudio: audio, isPlaybarOpen: true, isPlaying: true });

        if(audioElement) {
            setTimeout(() => {
                audioManager.setAudioSource(audio.audioUrl ?? "");
                audioManager.play()?.catch((error) => {
                    console.error("Error playing audio:", error);
                    set({ isPlaying: false });
                });
            }, 0) ;
        }
    },

    togglePlayPause: () => {
        const { isPlaying } = get();
        const audio = audioManager.getAudio();

        if(!audio || !get().currentAudio) return;
        
        if(isPlaying) {
            audioManager.pause();
            set({ isPlaying: false });
        }
        else {
            if(!audio.src && get().currentAudio?.audioUrl){
                audioManager.setAudioSource(get().currentAudio!.audioUrl ?? "");
            }

            audioManager.play()?.catch((error) => {
                console.error("Error playing audio:", error);
                set({ isPlaying: false });
            });
            set({ isPlaying: true });
        }
    },
    togglePlaybar: () => {
        const { isPlaybarOpen } = get();
        set({ isPlaybarOpen: !isPlaybarOpen });
    },
    skipForward: () => {
        audioManager.skipForward();
    },
    skipBackward: () => {
        audioManager.skipBackward();
    },
    downloadAudio: () => {
        const audio = get().currentAudio;
        if(!audio?.audioUrl) return;
        const link = document.createElement("a");
        link.href = audio.audioUrl;
        link.download = `${audio.title || "audio"}.wav`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
}));