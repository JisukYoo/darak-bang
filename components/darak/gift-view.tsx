'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BookHeart, Check, Loader2, PackageCheck, RefreshCw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { LETTERING_FEE, SHIPPING_FEE, bibleCovers, formatWon } from '@/lib/darak-data'

type GiftResult = {
  verses: { reference: string; text: string; reason: string }[]
  letter: string
}

type CoverId = (typeof bibleCovers)[number]['id']

export function GiftView() {
  const [recipientName, setRecipientName] = useState('')
  const [relationship, setRelationship] = useState('')
  const [situation, setSituation] = useState('')
  const [coverId, setCoverId] = useState<CoverId>('sage-linen')
  const [result, setResult] = useState<GiftResult | null>(null)
  const [letter, setLetter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ordered, setOrdered] = useState(false)

  const cover = bibleCovers.find((c) => c.id === coverId)!

  async function generate() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/gift-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientName, relationship, situation }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? '생성에 실패했어요.')
      setResult(data)
      setLetter(data.letter)
      requestAnimationFrame(() =>
        document.getElementById('gift-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : '생성에 실패했어요.')
    } finally {
      setLoading(false)
    }
  }

  if (ordered) {
    return (
      <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
          <PackageCheck className="size-8" aria-hidden />
        </span>
        <h1 className="tracking-tight text-2xl font-semibold text-balance">{recipientName}님께 선물이 준비되고 있어요</h1>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
          {cover.name} 성경과 손글씨 레터링 카드가 2~3일 내에 도착할 예정이에요. 받는 분을 위해 다락방에서 함께 기도해 주세요.
        </p>
        <Button
          variant="outline"
          className="mt-2 h-11 rounded-xl px-6"
          onClick={() => {
            setOrdered(false)
            setResult(null)
            setRecipientName('')
            setRelationship('')
            setSituation('')
          }}
        >
          새 선물 보내기
        </Button>
      </div>
    )
  }

  const canGenerate = recipientName.trim() && relationship.trim() && situation.trim().length >= 5

  return (
    <div className="flex flex-col gap-6 px-5 pt-2 pb-8">
      <div className="flex flex-col gap-1">
        <h1 className="tracking-tight text-2xl font-semibold text-balance">말씀 한 권, 마음 한 장</h1>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
          힘든 시간을 보내는 친구에게 맞춤 성경과 위로의 편지를 선물하세요.
        </p>
      </div>

      <form
        className="flex flex-col gap-4 rounded-3xl bg-card p-5 shadow-sm ring-1 ring-border"
        onSubmit={(e) => {
          e.preventDefault()
          if (canGenerate && !loading) generate()
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="gift-name">받는 분 이름</Label>
            <Input id="gift-name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="예) 지민" className="h-11 rounded-xl bg-background" required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="gift-rel">관계</Label>
            <Input id="gift-rel" value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="예) 대학 동기" className="h-11 rounded-xl bg-background" required />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="gift-situation">친구의 요즘 상황</Label>
          <Textarea
            id="gift-situation"
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            rows={4}
            placeholder="예) 요즘 이직 실패로 힘들어하는 친구에게 용기를 주고 싶어요."
            className="rounded-xl bg-background text-base leading-relaxed"
            required
          />
        </div>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1.5 text-sm font-medium">성경 커버 디자인</legend>
          <div className="grid grid-cols-3 gap-2">
            {bibleCovers.map((c) => {
              const active = c.id === coverId
              return (
                <label
                  key={c.id}
                  className={cn(
                    'relative flex cursor-pointer flex-col gap-2 rounded-2xl p-2 ring-1 transition has-focus-visible:ring-2 has-focus-visible:ring-ring',
                    active ? 'bg-secondary ring-2 ring-primary' : 'bg-background ring-border',
                  )}
                >
                  <input type="radio" name="cover" value={c.id} checked={active} onChange={() => setCoverId(c.id)} className="sr-only" />
                  <span className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                    <Image src={c.image} alt={`${c.name} 성경 커버`} fill sizes="120px" className="object-cover" />
                  </span>
                  <span className="flex flex-col px-0.5">
                    <span className="truncate text-xs font-semibold">{c.name}</span>
                    <span className="text-[11px] text-muted-foreground">{formatWon(c.price)}</span>
                  </span>
                  {active && (
                    <span className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" aria-hidden />
                    </span>
                  )}
                </label>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground">{cover.description}</p>
        </fieldset>

        <Button type="submit" disabled={!canGenerate || loading} className="h-12 rounded-xl text-base">
          {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}
          {loading ? '말씀과 편지를 준비하고 있어요' : result ? '다시 추천받기' : 'AI 말씀·레터 추천받기'}
        </Button>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </form>

      {result && (
        <>
          <section id="gift-result" aria-labelledby="ai-result-title" className="flex scroll-mt-20 flex-col gap-4">
            <h2 id="ai-result-title" className="flex items-center gap-2 tracking-tight text-lg font-semibold">
              <BookHeart className="size-5 text-primary" aria-hidden />
              추천 말씀
            </h2>
            <ul className="flex flex-col gap-2">
              {result.verses.map((v) => (
                <li key={v.reference} className="flex flex-col gap-2 rounded-2xl bg-highlight/50 p-4 ring-1 ring-accent/30">
                  <span className="text-xs font-semibold text-accent-foreground">{v.reference}</span>
                  <p className="tracking-tight text-[15px] leading-relaxed">{v.text}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{v.reason}</p>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="gift-letter" className="tracking-tight text-lg font-semibold">
                  AI 추천 전도 레터링
                </Label>
                <button
                  type="button"
                  onClick={() => setLetter(result.letter)}
                  className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="size-3.5" aria-hidden />
                  원래대로
                </button>
              </div>
              <Textarea
                id="gift-letter"
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                rows={10}
                className="rounded-2xl bg-card p-4 tracking-tight text-[15px] leading-loose shadow-sm"
              />
              <p className="text-right text-xs text-muted-foreground">{letter.length}자 · 자유롭게 수정할 수 있어요</p>
            </div>
          </section>

          <CheckoutSection coverName={cover.name} coverPrice={cover.price} recipientName={recipientName} onOrder={() => setOrdered(true)} />
        </>
      )}
    </div>
  )
}

function CheckoutSection({
  coverName,
  coverPrice,
  recipientName,
  onOrder,
}: {
  coverName: string
  coverPrice: number
  recipientName: string
  onOrder: () => void
}) {
  const total = coverPrice + LETTERING_FEE + SHIPPING_FEE
  const lines = [
    { label: `성경 · ${coverName}`, value: coverPrice },
    { label: '맞춤 레터링 카드', value: LETTERING_FEE },
    { label: '배송비', value: SHIPPING_FEE },
  ]

  return (
    <section aria-labelledby="checkout-title" className="flex flex-col gap-4 rounded-3xl bg-card p-5 shadow-sm ring-1 ring-border">
      <h2 id="checkout-title" className="tracking-tight text-lg font-semibold">
        주문 정보
      </h2>
      <dl className="flex flex-col gap-2 text-sm">
        {lines.map((l) => (
          <div key={l.label} className="flex justify-between">
            <dt className="text-muted-foreground">{l.label}</dt>
            <dd className="tabular-nums">{formatWon(l.value)}</dd>
          </div>
        ))}
        <div className="mt-1 flex justify-between border-t pt-3 text-base font-semibold">
          <dt>총 결제금액</dt>
          <dd className="tabular-nums text-primary">{formatWon(total)}</dd>
        </div>
      </dl>

      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          onOrder()
        }}
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ship-phone">받는 분 연락처</Label>
          <Input id="ship-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="010-0000-0000" className="h-11 rounded-xl bg-background" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ship-address">배송 주소</Label>
          <Input id="ship-address" autoComplete="street-address" placeholder="도로명 주소" className="h-11 rounded-xl bg-background" required />
          <Input aria-label="상세 주소" autoComplete="address-line2" placeholder="상세 주소 (동/호수)" className="h-11 rounded-xl bg-background" />
        </div>
        <Button type="submit" className="mt-1 h-12 rounded-xl bg-accent text-base font-semibold text-accent-foreground hover:bg-accent/90">
          {recipientName}님께 선물 보내기 · {formatWon(total)}
        </Button>
      </form>
    </section>
  )
}
