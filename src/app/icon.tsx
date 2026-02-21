import { ImageResponse } from 'next/og';

export const size = { width: 48, height: 48 };
export const contentType = 'image/png';

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: 11,
                    background: 'linear-gradient(135deg, #141830, #0a0e1a)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    border: '1.5px solid rgba(212,175,55,0.4)',
                }}
            >
                🌙
            </div>
        ),
        { ...size }
    );
}
