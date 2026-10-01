import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Mic, Square, Play, RotateCcw, Check, Sparkles } from 'lucide-react';

interface VoiceSpeakingPlayerProps {
  speakingPrompt?: string;
  targetPhrases?: string[];
  onRecordingComplete?: () => void;
}

export const VoiceSpeakingPlayer: React.FC<VoiceSpeakingPlayerProps> = ({
  speakingPrompt = 'Barista: "Good morning! Can I get you anything to eat with your coffee today?"',
  targetPhrases = ['Could I please get...', 'Actually, do you have any...', 'I will go with...'],
  onRecordingComplete,
}) => {
  const [isSpeakingPrompt, setIsSpeakingPrompt] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordedSeconds, setRecordedSeconds] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Play dialogue prompt using browser speech synthesis
  const handlePlayPromptAudio = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean prompt text (strip "Barista:" prefix if present for natural speech)
    const cleanText = speakingPrompt.replace(/^[A-Za-z]+:\s*/, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeakingPrompt(true);
    utterance.onend = () => setIsSpeakingPrompt(false);
    utterance.onerror = () => setIsSpeakingPrompt(false);

    window.speechSynthesis.speak(utterance);
  };

  // Start recording spoken user response
  const handleStartRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete?.();
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordedSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordedSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      // Graceful fallback simulation if microphone permissions are denied in iframe
      setIsRecording(true);
      setRecordedSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordedSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const handleStopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    } else {
      // Fallback
      setIsRecording(false);
      onRecordingComplete?.();
    }
    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-4">
      {/* Dialogue Prompt */}
      <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Conversational Partner
          </span>
          <button
            type="button"
            onClick={handlePlayPromptAudio}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              isSpeakingPrompt
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isSpeakingPrompt ? 'Speaking...' : 'Listen to Prompt'}</span>
          </button>
        </div>
        <p className="text-stone-900 font-semibold text-sm md:text-base leading-relaxed italic">
          "{speakingPrompt}"
        </p>
      </div>

      {/* Target expressions to use */}
      {targetPhrases && targetPhrases.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block">
            Target expressions to include:
          </span>
          <div className="flex flex-wrap gap-2">
            {targetPhrases.map((phrase, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold"
              >
                ✨ {phrase}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Voice Recorder Box */}
      <div className="p-4 rounded-xl bg-white border border-stone-200 text-center space-y-3">
        <div className="text-xs font-bold text-stone-600">
          Your Spoken Turn
        </div>

        <div className="flex items-center justify-center gap-3">
          {!isRecording ? (
            <button
              type="button"
              onClick={handleStartRecording}
              className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-rose-600/20 transition active:scale-95 cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>{audioUrl ? 'Record Again' : 'Record Your Spoken Answer'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleStopRecording}
              className="px-5 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center gap-2 animate-pulse cursor-pointer"
            >
              <Square className="w-4 h-4 text-rose-400" />
              <span>Stop Recording ({recordedSeconds}s)</span>
            </button>
          )}
        </div>

        {audioUrl && !isRecording && (
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-emerald-800 font-semibold animate-fade-in">
            <audio src={audioUrl} controls className="h-8 max-w-xs" />
          </div>
        )}
      </div>
    </div>
  );
};
