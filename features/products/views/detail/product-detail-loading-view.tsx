const colors = {
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
};

const shimmerStyle = {
  background: 'linear-gradient(90deg, #E5E7EB 25%, #F9FAFB 50%, #E5E7EB 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: '8px',
} as const;

export function ProductDetailLoadingView() {
  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: '100vh' }}>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: '20px', paddingBottom: '56px' }}
      >
        <div
          style={{
            backgroundColor: colors.white,
            borderRadius: '16px',
            border: `1px solid ${colors.border}`,
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ ...shimmerStyle, aspectRatio: '1/1', width: '100%' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} style={{ ...shimmerStyle, width: '72px', height: '72px', flexShrink: 0 }} />
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ ...shimmerStyle, height: '20px', width: '30%' }} />
              <div style={{ ...shimmerStyle, height: '36px', width: '90%' }} />
              <div style={{ ...shimmerStyle, height: '36px', width: '70%' }} />
              <div style={{ ...shimmerStyle, height: '20px', width: '40%' }} />
              <div style={{ ...shimmerStyle, height: '40px', width: '50%' }} />
              <div style={{ ...shimmerStyle, height: '60px', width: '100%' }} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ ...shimmerStyle, height: '44px', width: '120px' }} />
                <div style={{ ...shimmerStyle, height: '44px', flex: 1 }} />
                <div style={{ ...shimmerStyle, height: '44px', width: '44px' }} />
              </div>
              <div style={{ ...shimmerStyle, height: '44px', width: '100%' }} />
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: colors.white,
            borderRadius: '16px',
            border: `1px solid ${colors.border}`,
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ ...shimmerStyle, height: '36px', width: '120px' }} />
            ))}
          </div>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
              <div style={{ ...shimmerStyle, height: '16px', width: '140px' }} />
              <div style={{ ...shimmerStyle, height: '16px', flex: 1 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
