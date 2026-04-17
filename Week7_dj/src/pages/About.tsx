const About: React.FC = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 24px', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '24px', fontFamily: 'serif' }}>About Maison</h1>
      <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--color-text-muted)' }}>
        Maison was founded on a simple principle: to curate and craft objects that bring quiet intelligence and beauty into everyday living. We collaborate directly with independent artisans and small-scale manufacturers across 12 countries to ensure that every piece is distinct, durable, and thoughtfully sourced.
      </p>
      <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--color-text-muted)', marginTop: '24px' }}>
        Our collection spans from hand-thrown ceramics to precision-engineered lighting, each carefully vetted to meet our stringent standards for materiality and timeless design.
      </p>
    </div>
  );
};

export default About;
