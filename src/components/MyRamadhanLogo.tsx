// Premium SVG Logo for MyRamadhan
// Renders a crescent moon + star in a rounded square with gold gradient

export default function MyRamadhanLogo({
    size = 48,
    style = {},
}: {
    size?: number;
    style?: React.CSSProperties;
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={style}
        >
            <defs>
                <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1a1230" />
                    <stop offset="100%" stopColor="#0a0e1a" />
                </linearGradient>
                <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F0D060" />
                    <stop offset="50%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#8B7520" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Background rounded square */}
            <rect width="100" height="100" rx="22" fill="url(#bgGrad)" />

            {/* Outer glow ring */}
            <rect
                width="96" height="96" x="2" y="2" rx="20"
                stroke="url(#goldGrad)" strokeWidth="1" fill="none" opacity="0.4"
            />

            {/* Crescent moon */}
            <g filter="url(#glow)">
                <circle cx="52" cy="50" r="24" fill="url(#goldGrad)" />
                <circle cx="60" cy="44" r="19" fill="url(#bgGrad)" />
                {/* Re-fill inner circle with bg to create crescent */}
                <circle cx="60" cy="44" r="19" fill="#1a1230" />
            </g>

            {/* Star */}
            <g filter="url(#glow)" transform="translate(64, 30)">
                <polygon
                    points="0,-7 1.8,-2 7,-2 2.8,1.5 4.3,7 0,4 -4.3,7 -2.8,1.5 -7,-2 -1.8,-2"
                    fill="url(#goldGrad)"
                />
            </g>

            {/* Small decorative dots */}
            <circle cx="28" cy="72" r="2.5" fill="url(#goldGrad)" opacity="0.5" />
            <circle cx="36" cy="78" r="1.5" fill="url(#goldGrad)" opacity="0.3" />
            <circle cx="22" cy="65" r="1.5" fill="url(#goldGrad)" opacity="0.3" />
        </svg>
    );
}
