import { NextResponse } from 'next/server'
import { z } from 'zod'
import {
  createSupabaseCaptchaContextFromEnv,
  verifyCaptchaSubmission,
} from '@/lib/inquiry-captcha'
import { getAdminSupabase } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const rfqSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  company: z.string().trim().min(1).max(160),
  product: z.string().trim().min(1).max(200),
  quantity: z.string().trim().min(1).max(120),
  message: z.string().trim().max(3000).optional().default(''),
  phone: z.string().trim().max(60).optional().default(''),
  captchaAnswer: z.string().trim().min(4).max(8),
  captchaToken: z.string().trim().min(20),
  captchaScope: z.string().trim().min(16).max(160),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = rfqSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Please complete all required fields with valid information.' },
      { status: 400 },
    )
  }

  const secret = process.env.CAPTCHA_SECRET?.trim()
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  if (!secret || !tenantId) {
    return NextResponse.json(
      { ok: false, error: 'Inquiry service is not configured.' },
      { status: 503 },
    )
  }

  try {
    const context = createSupabaseCaptchaContextFromEnv(process.env)
    const verification = await verifyCaptchaSubmission({
      secret,
      tenantId: context.tenantId,
      siteScope: context.siteScope,
      scope: parsed.data.captchaScope,
      token: parsed.data.captchaToken,
      answer: parsed.data.captchaAnswer,
      store: context.store,
    })

    if (!verification.ok) {
      const errorMessage = verification.code === 'expired'
        ? 'Verification code expired. Please refresh and try again.'
        : 'Verification code is incorrect. Please refresh and try again.'
      return NextResponse.json({ ok: false, error: errorMessage }, { status: 400 })
    }

    const supabase = getAdminSupabase()
    const fullMessage = [
      `Product / Spec Interest: ${parsed.data.product}`,
      `Quantity: ${parsed.data.quantity}`,
      parsed.data.message ? `Message: ${parsed.data.message}` : '',
    ].filter(Boolean).join('\n')

    const { error } = await supabase.from('inquiries').insert({
      tenant_id: tenantId,
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company,
      phone: parsed.data.phone || null,
      product_name: parsed.data.product,
      message: fullMessage,
      status: 'new',
    })

    if (error) {
      return NextResponse.json(
        { ok: false, error: 'Unable to record inquiry at this time. Please email info@nutralivegroup.com.' },
        { status: 500 },
      )
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Unable to process inquiry right now. Please try again.' },
      { status: 500 },
    )
  }
}
