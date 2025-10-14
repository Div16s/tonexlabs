import { PageLayout } from "~/components/client/page-layout";
import { getHistoryItems } from "~/lib/history";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { TextToSpeechEditor } from "../../../../components/client/speech-synthesis/text-to-speech-editor";
import { SoundEffectsGenerator } from "~/components/client/sound-effects/sound-effects-generator";
import { SoundEffectsHistoryList } from "~/components/client/sound-effects/history-list";

export default async function SoundEffectsHistoryPage() {
  const service = "make-an-audio";
  const historyItems = await getHistoryItems(service);

  const soundEffectsTabs = [
    { name: "Generate", path: "/app/sound-effects/generate" },
    { name: "History", path: "/app/sound-effects/history" },
  ];

  return (
    <PageLayout
      title="SOUND EFFECTS"
      service={service}
      showSidebar={false}
      tabs={soundEffectsTabs}
    >
        <SoundEffectsHistoryList historyItems={historyItems}/>
    </PageLayout>
  );
}
