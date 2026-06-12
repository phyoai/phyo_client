import { useRouter } from 'next/navigation';

export default function InlineConversionCard({
  eyebrow = "PREMIUM ACCESS",
  title = "Boost your reach",
  description = "Upgrade to Influencer Pro or Brand Premium to unlock exclusive analytics, campaigns, and powerful creator discovery tools.",
  primaryButtonText = "Get Premium Access",
  secondaryButtonText = "Learn More"
}) {
  const router = useRouter();

  return (
    <div
      className="mb-8"
      style={{
        background: 'linear-gradient(-44deg, rgba(22,163,74,1) 0%, rgba(7,54,24,1) 100%)',
        borderRadius: 24,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        minHeight: 244,
      }}
    >
      {/* PREMIUM ACCESS — Inter 12px, #FFDBB4, uppercase */}
      <p style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: 12,
        fontWeight: 400,
        lineHeight: '120%',
        textTransform: 'uppercase',
        color: '#FFDBB4',
        margin: '0 0 12px 0',
      }}>
        {eyebrow}
      </p>

      {/* Title + Description — column, gap 4px */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        flex: 1,
        maxWidth: 880,
      }}>
        <h2 style={{
          fontFamily: 'Bricolage Grotesque, sans-serif',
          fontSize: 24,
          fontWeight: 400,
          lineHeight: '120%',
          textTransform: 'capitalize',
          color: '#FFFFFF',
          margin: 0,
        }}>
          {title}
        </h2>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 16,
          fontWeight: 400,
          lineHeight: '160%',
          color: '#E4E4E4',
          margin: 0,
        }}>
          {description}
        </p>
      </div>

      {/* Buttons — row, gap 24px */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        marginTop: 24,
      }}>
        <button
          onClick={() => router.push('/brand/account/upgrade-plan')}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 16,
            fontWeight: 400,
            lineHeight: '120%',
            textTransform: 'capitalize',
            color: '#16A34A',
            background: '#FFFFFF',
            border: 'none',
            borderRadius: 40,
            padding: '12px 24px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          {primaryButtonText}
        </button>

        <button
          onClick={() => router.push('/brand/account/upgrade-plan')}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 16,
            fontWeight: 400,
            lineHeight: '120%',
            textTransform: 'capitalize',
            color: '#FFFFFF',
            background: 'transparent',
            border: '1px solid #FFFFFF',
            borderRadius: 40,
            padding: '12px 24px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          {secondaryButtonText}
        </button>
      </div>
    </div>
  );
}
