/**
 * Sistema de Áudio com Web Audio API
 */

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterVolume = 0.4;
        this.initialized = false;
    }

    init() {
        if (this.initialized) return;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API não suportada');
        }
    }

    playTone(type, frequency, duration, volume = 0.3) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        gainNode.gain.setValueAtTime(this.masterVolume * volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playCollect(type) {
        if (!this.audioContext) return;
        const freqs = { 'apple': 880, 'grass': 660, 'stone': 440, 'wood': 550, 'gold': 1100 };
        const freq = freqs[type] || 660;
        this.playTone('sine', freq, 0.1);
        setTimeout(() => this.playTone('sine', freq * 1.25, 0.12), 50);
    }

    playCraft() {
        if (!this.audioContext) return;
        this.playTone('triangle', 330, 0.1);
        setTimeout(() => this.playTone('triangle', 440, 0.1), 80);
        setTimeout(() => this.playTone('triangle', 550, 0.12), 160);
    }

    playLevelUp() {
        if (!this.audioContext) return;
        [523, 659, 784, 1047].forEach((freq, i) => {
            setTimeout(() => this.playTone('sine', freq, 0.2, 0.4), i * 80);
        });
    }

    playAttack() {
        if (!this.audioContext) return;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        osc.connect(gain);
        gain.connect(this.audioContext.destination);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
        gain.gain.setValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.1);
    }

    playHurt() {
        if (!this.audioContext) return;
        this.playTone('square', 150, 0.12);
        setTimeout(() => this.playTone('square', 100, 0.15), 80);
    }

    playEnemyDeath() {
        if (!this.audioContext) return;
        this.playTone('sawtooth', 400, 0.08);
        setTimeout(() => this.playTone('sawtooth', 300, 0.08), 40);
        setTimeout(() => this.playTone('sawtooth', 200, 0.1), 80);
    }

    playEat() {
        if (!this.audioContext) return;
        this.playTone('sine', 500, 0.06);
        setTimeout(() => this.playTone('sine', 600, 0.06), 60);
        setTimeout(() => this.playTone('sine', 700, 0.08), 120);
    }

    playBuild() {
        if (!this.audioContext) return;
        this.playTone('triangle', 200, 0.1);
        setTimeout(() => this.playTone('triangle', 300, 0.1), 100);
        setTimeout(() => this.playTone('triangle', 400, 0.15), 200);
    }

    playAchievement() {
        if (!this.audioContext) return;
        [659, 784, 988, 1319].forEach((freq, i) => {
            setTimeout(() => this.playTone('sine', freq, 0.15, 0.5), i * 100);
        });
    }

    playCombo() {
        if (!this.audioContext) return;
        this.playTone('sine', 800, 0.1, 0.3);
        this.playTone('sine', 1000, 0.1, 0.3);
    }

    playGameOver() {
        if (!this.audioContext) return;
        [400, 350, 300, 250].forEach((freq, i) => {
            setTimeout(() => this.playTone('sawtooth', freq, 0.25), i * 180);
        });
    }

    playWaveComplete() {
        if (!this.audioContext) return;
        [523, 659, 784, 1047, 784, 1047].forEach((freq, i) => {
            setTimeout(() => this.playTone('sine', freq, 0.12, 0.4), i * 60);
        });
    }

    playBossWarning() {
        if (!this.audioContext) return;
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                this.playTone('square', 100, 0.2, 0.5);
                this.playTone('square', 150, 0.2, 0.3);
            }, i * 300);
        }
    }
}

const audioManager = new AudioManager();
