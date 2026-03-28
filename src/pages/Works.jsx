import React from 'react';

const ProjectCard = ({ project, onOpen }) => {
    return (
        <div className="glass hover-scale" style={{
            overflow: 'hidden',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: '#0a0a0a',
            boxShadow: '0 10px 40px -15px rgba(0, 0, 0, 0.7)',
            position: 'relative'
        }}>
            <div style={{
                position: 'relative',
                flex: '1',
                minHeight: '250px', // Increased for better vertical clearance
                padding: '1.25rem 1.25rem 0 1.25rem', // Inset padding
                overflow: 'hidden'
            }}>
                {project.media_type === 'video' ? (
                    <video
                        src={project.image}
                        autoPlay muted loop playsInline
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'top', // Focus on header
                            borderRadius: '1rem',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}
                    />
                ) : (
                    <img
                        src={project.image}
                        alt={project.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'top', // Focus on header
                            borderRadius: '1rem',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}
                    />
                )}
                <div style={{
                    position: 'absolute',
                    top: '2.25rem', // Adjusted for padding
                    right: '2.25rem', // Adjusted for padding
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                    gap: '0.5rem',
                    maxWidth: '70%',
                    zIndex: 2
                }}>
                    {project.tags?.map(tag => (
                        <span key={tag} style={{
                            fontSize: '0.65rem',
                            padding: '0.4rem 0.9rem',
                            background: 'rgba(10, 10, 10, 0.85)',
                            border: '1px solid rgba(168, 85, 247, 0.5)',
                            borderRadius: '100px',
                            backdropFilter: 'blur(12px)',
                            color: '#a855f7',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}>
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            <div style={{
                padding: '1.5rem', // Reduced padding
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(to bottom, rgba(168, 85, 247, 0.05), #0a0a0a)',
                borderTop: '1px solid var(--glass-border)'
            }}>
                <h3 style={{
                    marginBottom: '0.5rem',
                    color: 'white',
                    fontSize: '1.35rem', // Smaller title
                    fontWeight: '900',
                    letterSpacing: '-0.02em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>{project.title}</h3>
                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    marginBottom: '1.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 1, // Clamp to 1 line for maximum safety
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {project.description}
                </p>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {project.links && project.links.length > 0 && project.links.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-forge-secondary"
                            style={{ flex: 1 }}
                        >
                            {link.label || 'View'}
                        </a>
                    ))}
                    <button
                        onClick={onOpen}
                        className="btn-forge-primary"
                        style={{ flex: project.links?.length > 0 ? '0.5' : '1' }}
                    >
                        Details
                    </button>
                </div>
            </div>
        </div>
    );
};



const Works = ({ projects }) => {
    const [selectedProject, setSelectedProject] = React.useState(null);

    return (
        <div style={{ marginTop: '8rem' }}>
            <header style={{ textAlign: 'center', marginBottom: '8rem' }}>
                <h1 className="animate-slide-up" style={{ fontSize: '5rem' }}>The Forge</h1>
                <p className="animate-fade-in" style={{
                    color: 'var(--text-muted)',
                    fontSize: '1.5rem',
                    maxWidth: '800px',
                    margin: '0 auto',
                    lineHeight: '1.8'
                }}>
                    A curated selection of industrial-grade digital artifacts, engineered for high-performance and visual dominance.
                </p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gridAutoRows: '500px', // Increased from 450px
                gap: '2rem',
            }}>
                {projects.length > 0 ? projects.map((p, index) => {
                    const count = projects.length;
                    let span = { col: 1, row: 1 };

                    if (count === 1) {
                        span = { col: '1 / -1', row: 1 };
                    } else if (count === 2) {
                        span = { col: 'span 2', row: 1 };
                    } else if (count === 3) {
                        if (index === 0) span = { col: 'span 2', row: 1 };
                        else span = { col: 'span 1', row: 1 };
                    } else {
                        const patterns = [
                            { col: 1, row: 1 },
                            { col: 2, row: 1 },
                            { col: 1, row: 2 },
                            { col: 1, row: 1 },
                            { col: 1, row: 2 },
                            { col: 2, row: 1 }
                        ];
                        const p = patterns[index % patterns.length];
                        span = { col: `span ${p.col}`, row: `span ${p.row}` };
                    }

                    return (
                        <div key={p.id || index} className="animate-slide-up" style={{
                            gridColumn: span.col,
                            gridRow: span.row,
                            animationDelay: `${index * 0.1}s`,
                            opacity: 0,
                            animationFillMode: 'forwards'
                        }}>
                            <ProjectCard project={p} onOpen={() => setSelectedProject(p)} />
                        </div>
                    );
                }) : (
                    <div style={{
                        gridColumn: '1/-1',
                        textAlign: 'center',
                        padding: '8rem',
                        color: 'var(--text-muted)',
                        fontSize: '1.5rem',
                        background: 'rgba(168, 85, 247, 0.05)',
                        border: '1px dashed rgba(168, 85, 247, 0.2)',
                        borderRadius: '3rem'
                    }}>
                        The Forge is currently empty. Initialize via the secure terminal.
                    </div>
                )}
            </div>

            {/* Immersive Modal (Placed outside grid to avoid transform issues) */}
            {selectedProject && (
                <div
                    onClick={() => setSelectedProject(null)}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.85)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem',
                        backdropFilter: 'blur(25px)',
                        WebkitBackdropFilter: 'blur(25px)'
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        className="glass animate-slide-up"
                        style={{
                            maxWidth: '900px',
                            width: '100%',
                            background: '#0a0a0a',
                            padding: '4rem',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            position: 'relative'
                        }}
                    >
                        <button
                            onClick={() => setSelectedProject(null)}
                            style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'transparent', color: 'white', fontSize: '2rem', border: 'none', cursor: 'pointer' }}
                        >✕</button>

                        <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{selectedProject.title}</h2>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                            {selectedProject.tags?.map(tag => (
                                <span key={tag} style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}># {tag}</span>
                            ))}
                        </div>

                        <div style={{ borderRadius: '1.5rem', overflow: 'hidden', marginBottom: '3rem', border: '1px solid var(--glass-border)' }}>
                            {selectedProject.media_type === 'video' ? (
                                <video src={selectedProject.image} controls style={{ width: '100%', display: 'block' }} />
                            ) : (
                                <img src={selectedProject.image} style={{ width: '100%', display: 'block' }} />
                            )}
                        </div>

                        <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>
                            {selectedProject.description}
                        </p>

                        <div style={{ marginTop: '4rem', display: 'flex', gap: '1.5rem' }}>
                            {selectedProject.links?.map((link, idx) => (
                                <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" style={{ padding: '1rem 2rem', background: 'var(--primary)', color: 'white', borderRadius: '100px', fontWeight: 'bold', textDecoration: 'none' }}>
                                    {link.label} ↗
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Works;
