import React, { useState, useEffect } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

const VoiceToTextNote = ({
  onTextUpdate,
  placeholder = "Start speaking to add notes...",
  initialText = "",
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState(initialText);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
        // Simulate audio level for visual feedback
        setAudioLevel(Math.random() * 100);
      }, 100);
    } else {
      setRecordingTime(0);
      setAudioLevel(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsProcessing(true);

    // Simulate voice-to-text processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockTranscription =
      "Patient reports feeling much better since the last visit. No significant side effects from the current medication. Blood pressure appears stable. Recommends continuing current treatment plan and scheduling follow-up in 4 weeks.";

    const newText = text ? `${text} ${mockTranscription}` : mockTranscription;
    setText(newText);
    onTextUpdate(newText);
    setIsProcessing(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const playback = () => {
    setIsPlaying(true);
    // Simulate playback
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const clearText = () => {
    setText("");
    onTextUpdate("");
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    onTextUpdate(newText);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gradient-to-r from-dark-400/30 to-dark-300/30 backdrop-blur-xl border border-dark-500/50 rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Mic className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-20-bold text-white">Voice Notes</h3>
      </div>

      {/* Recording Controls */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={toggleRecording}
          disabled={isProcessing}
          className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 animate-pulse"
              : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isProcessing ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : isRecording ? (
            <MicOff className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}

          {/* Audio level indicator */}
          {isRecording && (
            <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
          )}
        </button>

        {/* Recording Status */}
        <div className="flex-1">
          {isRecording && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-14-medium text-red-400">Recording</span>
                <span className="text-14-regular text-white">
                  {formatTime(Math.floor(recordingTime / 10))}
                </span>
              </div>

              {/* Audio Level Visualization */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 h-4 rounded-full transition-all duration-100 ${
                      i < audioLevel / 5 ? "bg-green-500" : "bg-dark-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-14-medium text-blue-400">
                Processing speech...
              </span>
            </div>
          )}

          {!isRecording && !isProcessing && (
            <span className="text-14-regular text-dark-700">
              Click to start recording
            </span>
          )}
        </div>

        {/* Additional Controls */}
        <div className="flex items-center gap-2">
          {text && (
            <>
              <button
                onClick={playback}
                disabled={isPlaying}
                className="p-3 rounded-xl bg-dark-400 hover:bg-dark-300 border border-dark-500 transition-colors disabled:opacity-50"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-white" />
                ) : (
                  <Play className="w-4 h-4 text-white" />
                )}
              </button>

              <button
                onClick={clearText}
                className="p-3 rounded-xl bg-dark-400 hover:bg-dark-300 border border-dark-500 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-white" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Text Area */}
      <div className="relative">
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder={placeholder}
          className="shad-textArea w-full text-white min-h-[200px] resize-none"
          rows={8}
        />

        {/* Word Count */}
        <div className="absolute bottom-3 right-3 text-12-regular text-dark-600">
          {text.split(" ").filter((word) => word.length > 0).length} words
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-12-regular text-green-400">
            Auto-save enabled
          </span>
        </div>

        <div className="flex items-center gap-2 text-12-regular text-dark-600">
          <Volume2 className="w-4 h-4" />
          <span>Voice recognition active</span>
        </div>
      </div>
    </div>
  );
};

export default VoiceToTextNote;
