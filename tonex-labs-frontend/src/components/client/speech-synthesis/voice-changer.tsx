"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUpload } from "react-icons/fa";
import {
  generateSpeechToSpeech,
  generateUploadUrl,
  generationStatus,
} from "~/actions/generate-speech";
import { GenerateButton } from "~/components/client/generate-button";
import { useAudioStore } from "~/stores/audio-store";
import { useVoiceStore } from "~/stores/voice-store";
import type { ServiceType } from "~/types/services";

const ALLOWED_AUDIO_TYPES = ["audio/mp3", "audio/wav"];

export function VoiceChanger({
  service,
  credits,
}: {
  service: ServiceType;
  credits: number;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currAudioId, setCurrAudioId] = useState<string | null>(null);

  const { playAudio } = useAudioStore();
  const getSelectedVoice = useVoiceStore((state) => state.getSelectedVoice);

  const handleFileSelect = (selectedFile: File) => {
    const isAllowedAudio = ALLOWED_AUDIO_TYPES.includes(selectedFile.type);
    const isUnder50MB = selectedFile.size <= 50 * 1024 * 1024;
    if (isAllowedAudio && isUnder50MB) {
      setFile(selectedFile);
    } else
      alert(
        isAllowedAudio
          ? "Please select an MP3 or WAV file only"
          : "File is too large. Max size is 50MB",
      );
  };

  const handleGenerateSpeech = async () => {
    const selectedVoice = getSelectedVoice(service);
    if (!file || !selectedVoice) return;
    try {
      setIsLoading(true);

      const { uploadUrl, s3Key } = await generateUploadUrl(file.type);

      console.log(uploadUrl);

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to storage");
      }

      const { audioId, shouldShowThrottleAlert } = await generateSpeechToSpeech(
        s3Key,
        selectedVoice.id,
      );

      if (shouldShowThrottleAlert) {
        toast(
          "You're hitting the limit! Requests beyond 3/min will be queued.",
          {
            icon: "⚠️",
          },
        );
        console.log("More than 3 requests not allowed");
      }

      setCurrAudioId(audioId);
    } catch (error) {
      console.error("Error generating speech: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("Inside useeffect...");
    if (!currAudioId || !isLoading) return;

    const pollInterval = setInterval(() => {
      void (async () => {
        try {
          const stats = await generationStatus(currAudioId);
          const selectedVoice = getSelectedVoice(service);
          if (stats.success && stats.audioUrl && selectedVoice) {
            clearInterval(pollInterval);
            setIsLoading(false);

            const newAudio = {
              id: currAudioId,
              title: file?.name ?? "Voice changed audio",
              audioUrl: stats.audioUrl,
              voice: selectedVoice.id,
              duration: "0:30",
              progress: 0,
              service: service,
              createdAt: new Date().toLocaleDateString(),
            };

            playAudio(newAudio);
            setCurrAudioId(null);
            setFile(null);
          } else if (!stats.success) {
            clearInterval(pollInterval);
            setIsLoading(false);
            setCurrAudioId(null);
            console.error("Voice conversion failed");
          }
        } catch (error) {
          console.error("Error polling for audio status: ", error);
        }
      })();
    }, 500);

    return () => {
      clearInterval(pollInterval);
    };
  }, [currAudioId, isLoading, playAudio, file, getSelectedVoice, service]);

  return (
    <>
      <style jsx>
        {`
          @keyframes gradientMove {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `}
      </style>
      <div className="relative flex flex-1 flex-col justify-between px-4">
        <div className="absolute top-1/2 right-0 left-0 -translate-y-1/2 transform">
          <div
            className="h-[200px] w-full bg-gradient-to-r from-[#FFD700] via-orange-400 to-[#FFD700] opacity-30 blur-[90px]"
            style={{
              animation: "gradientMove 15s ease infinite",
              backgroundSize: "200% 200%",
            }}
          ></div>
        </div>
        <div className="relative z-10 flex flex-1 flex-col justify-between px-4">
          <div className="flex flex-1 items-center justify-center py-8">
            <div
              onDragOver={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                setIsDragging(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    handleFileSelect(file);
                  }
                }
              }}
              onClick={() => {
                if (isLoading) return;
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "audio/mp3,audio/wav";
                input.onchange = (e) => {
                  const target = e.target as HTMLInputElement;
                  if (target.files && target.files.length > 0) {
                    const file = target.files[0];
                    if (file) {
                      handleFileSelect(file);
                    }
                  }
                };
                input.click();
              }}
              className={`w-full max-w-xl rounded-xl shadow-lg border-2 border-dotted p-8 transition-all duration-200 ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"} ${file ? "bg-white" : "bg-gray-50"}`}
            >
              {file ? (
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3">
                    <FaUpload className="h-4 w-4 text-blue-400" />
                    <p className="mb-1 text-sm font-medium">{file.name}</p>
                    <p className="mb-1 text-sm font-medium">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isLoading) {
                          setFile(null);
                        }
                      }}
                      disabled={isLoading}
                      className={`mt-2 text-sm ${isLoading ? "cursor-not-allowed text-gray-400" : "text-blue-600 hover:text-blue-800"}`}
                    >
                      Choose a different file
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex cursor-pointer flex-col items-center py-8 text-center">
                  <div className="mb-4 rounded-lg border border-gray-200 bg-white p-3">
                    <FaUpload className="h-4 w-4 text-gray-500" />
                  </div>
                  <p className="mb-1 text-sm font-medium">
                    Click to upload, or Drag & Drop
                  </p>
                  <p className="mb-1 text-xs text-gray-500">
                    MP3 or WAV files only, upto 50MB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <GenerateButton
          onGenerate={handleGenerateSpeech}
          isDisabled={!file || isLoading}
          isLoading={isLoading}
          showDownload={true}
          creditsRemaining={credits}
          buttonText="Generate Voice"
        />
      </div>
    </>
  );
}
