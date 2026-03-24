import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { escapeHtml } from '@/lib/sanitize';

const resend = new Resend(process.env.RESEND_API_KEY || 'dummy');
const OWNER_EMAIL = 'magmom7777@gmail.com';

const FIELD_LABELS: Record<string, string> = {
  easy_def: '정의',
  analogy:  '비유',
  example:  '예시',
  note:     '실무팁',
  risk:     '주의사항',
};

// ── 간단한 인메모리 Rate Limiting ────────────────────────────
const rateMap = new Map<string, number[]>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateMap.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW);
  if (timestamps.length >= RATE_LIMIT) return true;
  timestamps.push(now);
  rateMap.set(ip, timestamps);
  return false;
}

// ── 이메일 HTML 생성 ────────────────────────────────────────
function buildAddEmail(term: string) {
  const safeTerm = escapeHtml(term);
  return {
    subject: `[홈 잉 버드] 용어 추가 요청: ${safeTerm}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f5f5f5;border-radius:12px;">
        <h2 style="margin:0 0 20px;font-size:20px;color:#111;">📬 용어 추가 요청</h2>
        <div style="background:#fff;border:1px solid #e0e0e0;border-radius:10px;padding:20px 24px;">
          <p style="margin:0 0 6px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">요청 용어</p>
          <p style="margin:0;font-size:26px;font-weight:700;color:#111;">${safeTerm}</p>
        </div>
        <p style="margin:20px 0 0;font-size:12px;color:#bbb;">홈 잉 버드 · 자동 발송</p>
      </div>
    `,
  };
}

function buildEditEmail(term: string, field: string, content: string) {
  const safeTerm = escapeHtml(term);
  const safeContent = escapeHtml(content);
  const fieldLabel = FIELD_LABELS[field] ?? escapeHtml(field);

  return {
    subject: `[홈 잉 버드] 수정 제안: ${safeTerm} — ${fieldLabel}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f5f5f5;border-radius:12px;">
        <h2 style="margin:0 0 20px;font-size:20px;color:#111;">✏️ 용어 수정 제안</h2>
        <div style="background:#fff;border:1px solid #e0e0e0;border-radius:10px;padding:16px 24px;margin-bottom:10px;">
          <p style="margin:0 0 4px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">용어</p>
          <p style="margin:0;font-size:20px;font-weight:700;color:#111;">${safeTerm}</p>
        </div>
        <div style="background:#fff;border:1px solid #e0e0e0;border-radius:10px;padding:16px 24px;margin-bottom:10px;">
          <p style="margin:0 0 4px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">수정 요청 필드</p>
          <p style="margin:0;font-size:15px;font-weight:600;color:#c9a84c;">${fieldLabel}</p>
        </div>
        <div style="background:#fff;border:1px solid #e0e0e0;border-radius:10px;padding:16px 24px;">
          <p style="margin:0 0 8px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:1px;">제안 내용</p>
          <p style="margin:0;font-size:15px;line-height:1.7;color:#333;white-space:pre-wrap;">${safeContent}</p>
        </div>
        <p style="margin:20px 0 0;font-size:12px;color:#bbb;">홈 잉 버드 · 자동 발송</p>
      </div>
    `,
  };
}

// ── POST handler ─────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
        { status: 429 },
      );
    }

    const { type, term, field, content, fields } = await req.json();

    if (!term?.trim()) {
      return NextResponse.json({ error: '용어명을 입력해주세요.' }, { status: 400 });
    }

    let subject: string;
    let html: string;

    if (type === 'add') {
      ({ subject, html } = buildAddEmail(term.trim()));

    } else if (type === 'edit') {
      // fields 배열 또는 단일 field/content 둘 다 처리
      const fieldEntries: { field: string; content: string }[] = fields?.length
        ? fields
        : field && content?.trim()
          ? [{ field, content }]
          : [];

      if (fieldEntries.length === 0) {
        return NextResponse.json({ error: '필드와 내용을 입력해주세요.' }, { status: 400 });
      }

      if (fieldEntries.length === 1) {
        ({ subject, html } = buildEditEmail(term.trim(), fieldEntries[0].field, fieldEntries[0].content));
      } else {
        subject = `[홈 잉 버드] 수정 제안: ${escapeHtml(term.trim())} (${fieldEntries.length}건)`;
        html = fieldEntries
          .map(({ field: f, content: c }) => buildEditEmail(term.trim(), f, c).html)
          .join('<hr style="border:none;border-top:1px solid #e0e0e0;margin:8px 0;">');
      }

    } else {
      return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: OWNER_EMAIL,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: '메일 전송에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}