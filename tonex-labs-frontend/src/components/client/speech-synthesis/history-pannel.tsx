"use client";
import { Download, Play, Trash } from "lucide-react";
import type { HistoryItem as HistoryItemType } from "~/lib/history";
import type { Voice } from "~/stores/voice-store";
import { useVoiceStore } from "~/stores/voice-store";
import { useAudioStore } from "~/stores/audio-store";
import type { ServiceType } from "~/types/services";

export function HistoryPannel({
  service,
  searchQuery,
  setSearchQuery,
  hoveredItem,
  setHoveredItem,
  historyItems,
  onDelete,
}: {
  service: ServiceType;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  hoveredItem: string | null;
  setHoveredItem: (id: string | null) => void;
  historyItems?: HistoryItemType[];
  onDelete: (id: string) => void;
}) {
  const getVoices = useVoiceStore((state) => state.getVoices);
  const voices = getVoices(service);
  const { playAudio } = useAudioStore();

  const handlePlayHistoryItem = (item: HistoryItemType) => {
    if (item.audioUrl) {
      // Logic to play the audio from item.audioUrl
      playAudio({
        id: item.id.toString(),
        title: item.title,
        voice: item.voice,
        audioUrl: item.audioUrl,
        service: item.service,
      });
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="w-full flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
          />
        </div>
      </div>

      {historyItems && historyItems.length > 0 ? (
        <div className="mt-2 w-full flex-1 flex-col overflow-y-auto">
          {/* Filter history items based on search */}
          {(() => {
            const filteredGroups = Object.entries(
              historyItems
                .filter(
                  (item) =>
                    item.title
                      .toLocaleLowerCase()
                      .includes(searchQuery.toLocaleLowerCase()) ||
                    voices
                      .find((voice) => voice.id === item.voice)
                      ?.name.toLocaleLowerCase()
                      .includes(searchQuery.toLocaleLowerCase()),
                )
                .reduce((groups: Record<string, HistoryItemType[]>, item) => {
                  const date = item.date;
                  groups[date] ??= [];
                  groups[date].push(item);
                  return groups;
                }, {}),
            );

            // Show no results found when filtered results are empty
            return filteredGroups.length > 0 ? (
              filteredGroups.map(([date, items], groupIndex) => (
                <div key={date}>
                  <div className="sticky top-0 z-10 my-2 flex w-full justify-center bg-white py-1">
                    <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                      {date}
                    </div>
                  </div>

                  {items.map((item) => (
                    <HistoryItem
                      key={item.id}
                      item={item}
                      voices={voices}
                      hoveredItem={hoveredItem}
                      setHoveredItem={setHoveredItem}
                      onPlay={handlePlayHistoryItem}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              ))
            ) : (
              <p className="mt-8 text-center text-sm text-gray-500">
                No results found
              </p>
            );
          })()}
        </div>
      ) : (
        <div className="h-fullflex-col flex items-center justify-center text-center">
          <p className="mt-3 text-sm text-gray-500">No history yet</p>
        </div>
      )}
    </div>
  );
}

function HistoryItem({
  item,
  voices,
  hoveredItem,
  setHoveredItem,
  onPlay,
  onDelete,
}: {
  item: HistoryItemType;
  voices: Voice[];
  hoveredItem: string | null;
  setHoveredItem: (id: string | null) => void;
  onPlay: (item: HistoryItemType) => void;
  onDelete: (id: string) => void;
}) {
  const voiceUsed =
    voices.find((voice) => voice.id === item.voice) ?? voices[0]!;
  return (
    <div
      onMouseEnter={() => setHoveredItem(item.id)}
      onMouseLeave={() => setHoveredItem(null)}
      className="relative flex items-center rounded-lg p-4 hover:bg-gray-100"
    >
      <div className="flex w-full flex-col gap-1">
        <div className="relative w-full">
          <p className="truncate text-sm">{item.title || "No title"}</p>
          {hoveredItem === item.id && (
            <div className="absolute top-0 right-0 flex items-center gap-1 bg-gray-100 pl-2">
              <button
                onClick={() => onPlay(item)}
                className="rounded-full p-1 hover:bg-gray-200"
              >
                <Play className="h-4 w-4" />
              </button>
              <button
                onClick={() => onPlay(item)}
                className="rounded-full p-1 hover:bg-gray-200"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="rounded-full p-1 hover:bg-gray-200"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <div
            className="flex h-3 w-3 items-center justify-center rounded-full text-xs text-white"
            style={{ background: voiceUsed.gradientolors }}
          ></div>
          <span className="text-xs font-light text-gray-500">
            {voiceUsed.name}
          </span>
          <span className="text-xs font-light text-gray-500">•</span>
          <span className="text-xs font-light text-gray-500">
            {item.time || "now"}
          </span>
        </div>
      </div>
    </div>
  );
}
