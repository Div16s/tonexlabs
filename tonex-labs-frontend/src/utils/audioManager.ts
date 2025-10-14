
class AudioManager {
    private audioElement: HTMLAudioElement | null = null; 

    initialize(): HTMLAudioElement | null {
        if(this.audioElement) return this.audioElement;

        if(typeof window !== "undefined") {
            this.audioElement = new Audio();
            return this.audioElement;
        }

        return null;
    }

    getAudio(): HTMLAudioElement | null {
        return this.audioElement;
    }

    getCurrentTime(): number {
        return this.audioElement?.currentTime ?? 0;
    }

    getDuration(): number {
        return this.audioElement?.duration ?? 0;
    }

    getProgress(): number {
        // if(!this.audioElement || !this.audioElement.duration) return 0;
        // return (this.audioElement.currentTime / this.audioElement.duration) * 100;

        // Alternative using optional chaining
        return this.audioElement?.duration 
            ? (this.audioElement.currentTime / this.audioElement.duration) * 100 
            : 0;
    }

    play(): Promise<void> | undefined {
        return this.audioElement?.play();
    }

    pause(): void {
        return this.audioElement?.pause();
    }

    skipForward(seconds = 10): void {
        if(this.audioElement) {
            this.audioElement.currentTime = Math.min(this.audioElement.currentTime + seconds, this.audioElement.duration);
        }
    }

    skipBackward(seconds = 10): void {
        if(this.audioElement) {
            this.audioElement.currentTime = Math.max(this.audioElement.currentTime - seconds, 0);
        }
    }

    setAudioSource(url: string): void {
        if(this.audioElement) {
            this.audioElement.src = url;
            this.audioElement.load();
        }
    }
}

export const audioManager = new AudioManager();