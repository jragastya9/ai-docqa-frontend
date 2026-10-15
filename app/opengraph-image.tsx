import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'LocalBiz AI — Chat with your business documents';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
            }}
          >
            ✨
          </div>
          <span style={{ fontSize: 32, fontWeight: 700, color: '#fff' }}>
            LocalBiz AI
          </span>
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: '24px',
          }}
        >
          Chat with your
          <br />
          business documents.
        </div>

        <div
          style={{
            fontSize: 28,
            color: '#9ca3af',
            lineHeight: 1.5,
            maxWidth: '900px',
          }}
        >
          Upload PDFs. Ask questions. Get cited answers in seconds.
        </div>

        <div
          style={{
            display: 'flex',
            gap: '32px',
            marginTop: '60px',
            fontSize: 20,
            color: '#6b7280',
          }}
        >
          <span>→ Cited answers</span>
          <span>→ Share links</span>
          <span>→ Multi-tenant</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
