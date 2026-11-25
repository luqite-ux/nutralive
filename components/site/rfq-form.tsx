'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { CheckCircle2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import {
  createInquiryCaptchaScope,
  createLatestCaptchaRequestController,
} from '@/lib/inquiry-captcha-scope'

type CaptchaChallenge = {
  svg: string
  token: string
  expiresAt: number
}

export function RfqForm({ defaultProduct = '', idPrefix = 'rfq' }: { defaultProduct?: string; idPrefix?: string }) {
  const [scope] = useState(() => createInquiryCaptchaScope())
  const [requests] = useState(() => createLatestCaptchaRequestController())
  const [captcha, setCaptcha] = useState<CaptchaChallenge | null>(null)
  const [loadingCaptcha, setLoadingCaptcha] = useState(true)
  const [captchaError, setCaptchaError] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [captchaValue, setCaptchaValue] = useState('')

  const refreshCaptcha = useCallback(async () => {
    const req = requests.begin()
    setLoadingCaptcha(true)
    setCaptchaError(null)
    setCaptcha(null)
    try {
      const res = await fetch(`/api/captcha?scope=${encodeURIComponent(scope)}`, {
        cache: 'no-store',
        signal: req.signal,
      })
      if (!res.ok) throw new Error('captcha unavailable')
      const body = (await res.json()) as CaptchaChallenge
      if (!body.svg || !body.token) throw new Error('invalid captcha')
      if (!requests.isCurrent(req)) return
      setCaptcha(body)
    } catch {
      if (!requests.isCurrent(req)) return
      setCaptchaError('Unable to load verification code. Click refresh to try again.')
    } finally {
      if (requests.isCurrent(req)) setLoadingCaptcha(false)
    }
  }, [requests, scope])

  useEffect(() => {
    void refreshCaptcha()
    return () => requests.abortCurrent()
  }, [refreshCaptcha, requests])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!captcha) return
    setError(null)
    setStatus('submitting')
    const form = e.currentTarget
    const fd = new FormData(form)
    const payload = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      company: String(fd.get('company') ?? ''),
      product: String(fd.get('product') ?? ''),
      quantity: String(fd.get('quantity') ?? ''),
      message: String(fd.get('message') ?? ''),
      captchaAnswer: captchaValue.trim().toUpperCase(),
      captchaToken: captcha.token,
      captchaScope: scope,
    }
    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) {
        setError(json.error ?? 'Something went wrong. Please try again.')
        setStatus('idle')
        setCaptchaValue('')
        void refreshCaptcha()
        return
      }
      form.reset()
      setCaptchaValue('')
      setStatus('success')
    } catch {
      setError('Network error. Please try again or email info@nutralivegroup.com directly.')
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="flex flex-col items-center rounded-2xl border border-leaf/40 bg-cream p-10 text-center">
        <CheckCircle2 className="size-12 text-leaf" aria-hidden="true" />
        <h3 className="mt-4 font-display text-2xl font-semibold text-forest-deep">Inquiry received</h3>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Thank you. Our sourcing team will reply with specifications, COA and sample options by email.
        </p>
        <Button
          variant="outline"
          className="mt-6 border-forest text-forest"
          onClick={() => {
            setStatus('idle')
            void refreshCaptcha()
          }}
        >
          Send another inquiry
        </Button>
      </div>
    )
  }

  const id = (n: string) => `${idPrefix}-${n}`

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
      <FieldGroup>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={id('name')}>Name *</FieldLabel>
            <Input id={id('name')} name="name" required minLength={2} autoComplete="name" />
          </Field>
          <Field>
            <FieldLabel htmlFor={id('email')}>Email *</FieldLabel>
            <Input id={id('email')} name="email" type="email" required autoComplete="email" />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor={id('company')}>Company *</FieldLabel>
          <Input id={id('company')} name="company" required autoComplete="organization" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor={id('product')}>Product / Spec Interest *</FieldLabel>
            <Input id={id('product')} name="product" required defaultValue={defaultProduct} placeholder="e.g. Turmeric Curcumin 95%" />
          </Field>
          <Field>
            <FieldLabel htmlFor={id('quantity')}>Quantity *</FieldLabel>
            <Input id={id('quantity')} name="quantity" required placeholder="e.g. 500 kg" />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor={id('message')}>Message</FieldLabel>
          <Textarea id={id('message')} name="message" rows={4} placeholder="Target specification, dosage form, packaging, destination market…" />
        </Field>
        <Field>
          <FieldLabel htmlFor={id('captcha')}>Verification code *</FieldLabel>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-14 w-40 items-center justify-center overflow-hidden rounded-lg border border-sage bg-cream">
              {captcha ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(captcha.svg)}`}
                  alt="Four-character verification code"
                  width={160}
                  height={56}
                />
              ) : loadingCaptcha ? (
                <Spinner />
              ) : (
                <span className="px-2 text-center text-xs text-muted-foreground">Unavailable</span>
              )}
            </div>
            <input type="hidden" name="captchaScope" value={scope} />
            <input type="hidden" name="captchaToken" value={captcha?.token ?? ''} />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Refresh verification code"
              disabled={loadingCaptcha}
              onClick={() => {
                setCaptchaValue('')
                void refreshCaptcha()
              }}
            >
              <RefreshCw className={loadingCaptcha ? 'animate-spin' : undefined} />
            </Button>
            <Input
              id={id('captcha')}
              name="captchaAnswer"
              type="text"
              minLength={4}
              maxLength={4}
              required
              disabled={!captcha}
              value={captchaValue}
              onChange={(e) => setCaptchaValue(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              placeholder="4 chars"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              className="w-32 uppercase tracking-[0.2em]"
            />
          </div>
          {captchaError && (
            <p role="alert" className="mt-2 text-xs text-destructive">
              {captchaError}
            </p>
          )}
        </Field>
      </FieldGroup>

      {error && (
        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === 'submitting' || !captcha}
        className="w-full bg-forest text-base hover:bg-forest-deep"
      >
        {status === 'submitting' && <Spinner />}
        Submit Inquiry
      </Button>
      <p className="text-xs text-muted-foreground">
        Commercial wholesale and custom processing inquiries. We reply with specification, COA and sample options.
      </p>
    </form>
  )
}
