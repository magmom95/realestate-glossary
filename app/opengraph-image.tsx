import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '부동산 용어 사전';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const FONT_STACK = 'Pretendard, Space Grotesk, Noto Sans KR, sans-serif';

export default async function Image() {
  const tags = ['LTV', 'DSR', '안심전세', '후순위채', '캡티브론', '초기비용'];

  return new ImageResponse(
    (
      <div
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          background: 'linear-gradient(135deg, #070707 0%, #0d0d0d 45%, #111317 100%)',
          color: '#f5f2ea',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          fontFamily: FONT_STACK,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Texture grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
            backgroundSize: '46px 46px',
            opacity: 0.2,
          }}
        />

        {/* Gold glow */}
        <div
          style={{
            position: 'absolute',
            width: '520px',
            height: '520px',
            top: '-120px',
            right: '-40px',
            background: 'radial-gradient(circle, rgba(232,201,125,0.22) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />

        {/* Layout */}
        <div
          style={{
            display: 'flex',
            gap: '64px',
            padding: '80px 100px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div
              style={{
                alignSelf: 'flex-start',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                borderRadius: '999px',
                border: '1px solid rgba(232,201,125,0.35)',
                background: 'rgba(232,201,125,0.12)',
                padding: '10px 26px',
                letterSpacing: '3px',
                fontSize: '18px',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              Real Estate Glossary
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h1
                style={{
                  fontSize: '88px',
                  lineHeight: 1.05,
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: '-2px',
                }}
              >
                복잡한 부동산 용어,
                <br />
                한 장 이미지로 정리
              </h1>
              <p
                style={{
                  fontSize: '30px',
                  color: '#e8c97d',
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                투자 · 계약 · 금융 120+개의 핵심 정의를 한글로 쉽게.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '32px',
                flexWrap: 'wrap',
                color: '#b6afa3',
                fontSize: '24px',
              }}
            >
              <div>
                <strong style={{ color: '#e8c97d', fontSize: '42px', display: 'block' }}>120+</strong>
                용어 수록
              </div>
              <div>
                <strong style={{ color: '#e8c97d', fontSize: '42px', display: 'block' }}>3단계</strong>
                난도 배지
              </div>
              <div>
                <strong style={{ color: '#e8c97d', fontSize: '42px', display: 'block' }}>AI</strong>
                자동 추천
              </div>
            </div>
          </div>

          <div
            style={{
              width: '360px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
              position: 'relative',
            }}
          >
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                style={{
                  padding: '20px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background:
                    idx === 1
                      ? 'linear-gradient(135deg, rgba(232,201,125,0.2), rgba(232,201,125,0.05))'
                      : 'rgba(16,16,16,0.75)',
                  transform: `translateY(${idx * 12}px)` ,
                  boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: '26px',
                    fontWeight: 600,
                    color: idx === 1 ? '#0d0d0d' : '#f5f2ea',
                  }}
                >
                  {tags[idx]}
                </p>
                <p style={{ margin: '6px 0 0', fontSize: '18px', color: '#b6afa3' }}>
                  {idx === 0 && '주택담보인정비율'}
                  {idx === 1 && '총부채원리금상환비율'}
                  {idx === 2 && '보증·안전장치 가이드'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: 100,
            color: '#6c6459',
            fontSize: '22px',
            letterSpacing: '2px',
          }}
        >
          realestate-glossary.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}

