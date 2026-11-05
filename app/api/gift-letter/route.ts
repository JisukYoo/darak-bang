import { generateText, Output } from 'ai'
import { z } from 'zod'

export const maxDuration = 60

const inputSchema = z.object({
  recipientName: z.string().trim().min(1).max(40),
  relationship: z.string().trim().min(1).max(40),
  situation: z.string().trim().min(5).max(1000),
})

const resultSchema = z.object({
  verses: z
    .array(
      z.object({
        reference: z.string().describe('한국어 성경 장절 표기, 예: 이사야 41:10'),
        text: z.string().describe('개역한글 또는 개역개정 본문'),
        reason: z.string().describe('이 구절이 친구의 상황에 맞는 이유, 한 문장'),
      }),
    )
    .min(2)
    .max(3),
  letter: z.string().describe('따뜻한 한국어 편지 본문, 250~400자'),
})

export async function POST(req: Request) {
  const parsed = inputSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return Response.json({ error: '입력값을 확인해 주세요.' }, { status: 400 })
  }
  const { recipientName, relationship, situation } = parsed.data

  try {
    const { output } = await generateText({
      model: 'google/gemini-3.8-flash',
      output: Output.object({ schema: resultSchema }),
      system:
        '당신은 한국 교회 다락방에서 섬기는 따뜻한 그리스도인입니다. 힘든 시기를 지나는 사람에게 성경 선물과 함께 보낼 편지를 돕습니다. 정죄하거나 설교하지 않고, 공감과 위로를 먼저 전하며, 복음의 소망을 부드럽게 나눕니다. 실제 존재하는 성경 구절만 정확한 장절로 인용하세요.',
      prompt: `받는 사람: ${recipientName} (${relationship})\n현재 상황: ${situation}\n\n이 사람에게 위로가 될 성경 구절 2~3개를 추천하고, 보내는 사람의 입장에서 쓰는 편지 초안을 작성해 주세요. 편지는 "${recipientName}에게"로 시작하고, 서명은 넣지 마세요.`,
    })
    return Response.json(output)
  } catch (error) {
    console.error('[gift-letter]', error)
    return Response.json({ error: 'AI 레터를 생성하지 못했어요. 잠시 후 다시 시도해 주세요.' }, { status: 500 })
  }
}
