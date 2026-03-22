import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = '홈 잉 버드 — 초보자를 위한 검색 학습 엔진';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  const fontData = await fetch(
    'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/public/static/Pretendard-Bold.otf'
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0d0d0d',
          color: '#f0ece4',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'Pretendard',
          position: 'relative',
        }}
      >
        {/* 배경 골드 원 */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            top: '-200px',
            right: '-100px',
            borderRadius: '50%',
            background: 'rgba(232,201,125,0.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            bottom: '-150px',
            left: '-80px',
            borderRadius: '50%',
            background: 'rgba(232,201,125,0.05)',
          }}
        />

        {/* 메인 콘텐츠 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            padding: '0 80px',
            position: 'relative',
          }}
        >
          {/* 아이콘 */}
          <div
            style={{
              fontSize: '64px',
              marginBottom: '8px',
            }}
          >
            🏠
          </div>

          {/* 타이틀 */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 700,
              textAlign: 'center',
              lineHeight: 1.2,
              letterSpacing: '-1px',
            }}
          >
            부동산 용어 사전
          </div>

          {/* 서브 타이틀 */}
          <div
            style={{
              fontSize: '28px',
              color: '#e8c97d',
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            초보자를 위한 검색 학습 엔진
          </div>

          {/* 태그 */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '16px',
            }}
          >
            {['120+ 용어', '3단계 난이도', '비유 설명', '연관 용어'].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: '10px 24px',
                  borderRadius: '999px',
                  border: '1px solid rgba(232,201,125,0.3)',
                  background: 'rgba(232,201,125,0.1)',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#e8c97d',
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* 하단 URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            fontSize: '20px',
            color: '#4a4640',
            letterSpacing: '1px',
          }}
        >
          realestate-glossary.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Pretendard',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
