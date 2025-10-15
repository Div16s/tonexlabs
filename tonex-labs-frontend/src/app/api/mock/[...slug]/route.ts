import type { NextRequest } from "next/server";
import { getPresignedUrl } from "~/lib/s3";

const services = {
  styletts2: {
    voices: ["divyankar", "woman"],
  },
  "seed-vc": {
    voices: ["divyankar", "woman", "trump"],
  },
  "make-an-audio": {
    voices: [],
  },
};

export async function GET(
  request: NextRequest,
  // { params }: { params: { slug: string[] } },
  context: { params: { slug: string[] } }
) {
  // const slug = params.slug;
  const { slug } = context.params;
  const [service, endpoint] = slug;

  // /api/mock/styletts2/

  if (!services[service as keyof typeof services]) {
    return Response.json(
      {
        error: "Service not found",
      },
      { status: 404 },
    );
  }

  if(endpoint === "voices"){
    return Response.json({
        voices: services[service as keyof typeof services].voices
    });
  }

  if(endpoint === "health"){
    return Response.json({
        status: "healthy",
        model: "loaded"
    });
  }

  return Response.json({error: "Not found"}, {status: 404});
}


export async function POST(
  request: NextRequest,
  // { params }: { params: { slug: string[] } },
  context: { params: { slug: string[] } }
) {
    // const awaitedParams = params;
    // const slug = awaitedParams.slug;
    const { slug } = context.params;

    const [service] = slug;

    if (!services[service as keyof typeof services]) {
    return Response.json(
      {
        error: "Service not found",
      },
      { status: 404 },
    );
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));

  const s3Key = "s3://tonexlabs/styletts2-outputs/ba5c4486-9c88-40df-98e7-613bfaeae2bb.wav"
  const presignedUrl = await getPresignedUrl({key: s3Key});

  return Response.json({
    audio_url: presignedUrl,
    s3_key: s3Key
  });
}