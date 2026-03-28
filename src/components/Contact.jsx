import React from 'react';

const Contact = () => {
    return (
        <section id="contact" style={{
            marginTop: '10rem',
            paddingTop: '6rem',
            borderTop: '1px solid var(--glass-border)',
            position: 'relative'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                <h2 style={{ fontSize: '4rem', fontWeight: '900', letterSpacing: '-0.02em', background: 'linear-gradient(to right, #fff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Connect for the Future
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '600px', margin: '1.5rem auto' }}>
                    Ready to engineer something extraordinary? Reach out to the Forge.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', maxWidth: '1100px', margin: '0 auto' }}>
                {/* Contact Info */}
                <div className="glass" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2.5rem', background: 'rgba(168, 85, 247, 0.02)' }}>
                    <div>
                        <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem', marginBottom: '1rem' }}>Electronic Mail</h4>
                        <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>forge@bitra.io</p>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem', marginBottom: '1rem' }}>Global Frequency</h4>
                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <a href="#" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', transition: 'color 0.3s ease' }} onMouseEnter={e => e.target.style.color = '#fff'}>Twitter</a>
                            <a href="#" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', transition: 'color 0.3s ease' }} onMouseEnter={e => e.target.style.color = '#fff'}>LinkedIn</a>
                            <a href="#" style={{ color: 'var(--text-muted)', fontSize: '1.1rem', transition: 'color 0.3s ease' }} onMouseEnter={e => e.target.style.color = '#fff'}>Github</a>
                        </div>
                    </div>
                    <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>© 2026 BITRAFORGE. All Systems Operational.</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="glass" style={{ padding: '3rem' }}>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={e => { e.preventDefault(); alert('Transmission Received. We will respond shortly.'); }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <input
                                type="text"
                                placeholder="Identity (Your Name)"
                                required
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <input
                                type="email"
                                placeholder="Secure Endpoint (Email)"
                                required
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '0.5rem', color: 'white', outline: 'none' }}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <textarea
                                rows="4"
                                placeholder="The Mission (Message)"
                                required
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '0.5rem', color: 'white', outline: 'none', resize: 'none' }}
                            />
                        </div>
                        <button type="submit" style={{ background: 'var(--primary)', color: 'white', padding: '1.25rem', borderRadius: '0.5rem', fontWeight: '800', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)' }}
                            onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
                        >
                            Initialize Contact
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
