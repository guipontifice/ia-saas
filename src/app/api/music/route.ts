import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;
    console.log('userId:', userId);

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 })
    }

    const response = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt: "An astronaut riding a rainbow unicorn, cinematic, dramatic",
        }
      }
    );

    return NextResponse.json(response)
  } catch (error) {
    console.log('[MUSIC_ERROR]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}