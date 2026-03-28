import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = ({ onAdd }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '', // This will hold the preview URL or Base64
        media_type: 'image', // 'image' or 'video'
        tags: '',
        links: [{ label: 'GitHub', url: '' }]
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const isVideo = file.type.startsWith('video/');
            setFormData({ ...formData, media_type: isVideo ? 'video' : 'image' });

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addLinkField = () => {
        setFormData({ ...formData, links: [...formData.links, { label: '', url: '' }] });
    };

    const updateLink = (index, field, value) => {
        const newLinks = [...formData.links];
        newLinks[index][field] = value;
        setFormData({ ...formData, links: newLinks });
    };

    const removeLink = (index) => {
        setFormData({ ...formData, links: formData.links.filter((_, i) => i !== index) });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newProject = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(t => t !== ''),
            links: formData.links.filter(l => l.url.trim() !== '')
        };
        onAdd(newProject);
        navigate('/');
    };

    return (
        <div style={{ marginTop: '5rem', paddingBottom: '5rem' }}>
            <div className="glass animate-slide-up" style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '4rem',
                background: 'rgba(5, 5, 5, 0.95)',
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '3rem', background: 'linear-gradient(to right, #fff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    New Artifact
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

                    {/* Section 1: Core Info */}
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ color: 'var(--primary)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Project Basis</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                            <input
                                type="text" required placeholder="Project Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="admin-input"
                            />
                            <textarea
                                required rows="4" placeholder="Deep Analysis / Project Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="admin-input"
                            />
                        </div>
                    </section>

                    {/* Section 2: Media */}
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ color: 'var(--primary)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Visual Asset</h3>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                            <div
                                onClick={() => fileInputRef.current.click()}
                                style={{
                                    width: '200px',
                                    height: '150px',
                                    border: '2px dashed var(--glass-border)',
                                    borderRadius: '1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    background: 'rgba(255,255,255,0.02)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                            >
                                {formData.image ? (
                                    formData.media_type === 'video' ?
                                        <video src={formData.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> :
                                        <img src={formData.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                        <span style={{ fontSize: '2rem' }}>⊕</span>
                                        <p style={{ fontSize: '0.8rem' }}>Upload Photo/Video</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    hidden
                                    accept="image/*,video/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Or use an external URL:</p>
                                <input
                                    type="url"
                                    placeholder="https://image-or-video-url.com"
                                    value={formData.image.startsWith('data:') ? '' : formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value, media_type: e.target.value.includes('mp4') ? 'video' : 'image' })}
                                    className="admin-input"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Links */}
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ color: 'var(--primary)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reference Links</h3>
                            <button type="button" onClick={addLinkField} style={{ color: 'var(--primary)', background: 'transparent', fontSize: '0.9rem', fontWeight: 'bold' }}>+ Add Link</button>
                        </div>
                        {formData.links.map((link, index) => (
                            <div key={index} style={{ display: 'flex', gap: '1rem' }}>
                                <input
                                    type="text" placeholder="Label (e.g. GitHub)"
                                    value={link.label}
                                    onChange={(e) => updateLink(index, 'label', e.target.value)}
                                    className="admin-input"
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="url" placeholder="URL"
                                    value={link.url}
                                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                                    className="admin-input"
                                    style={{ flex: 2 }}
                                />
                                <button type="button" onClick={() => removeLink(index)} style={{ color: '#ef4444', background: 'transparent' }}>✕</button>
                            </div>
                        ))}
                    </section>

                    {/* Section 4: Meta */}
                    <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <h3 style={{ color: 'var(--primary)', fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Taxonomy</h3>
                        <input
                            type="text" placeholder="Tags (comma separated, e.g. React, UI/UX, Rust)"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="admin-input"
                        />
                    </section>

                    <button type="submit" style={{
                        marginTop: '2rem',
                        padding: '1.5rem',
                        background: 'var(--primary)',
                        color: 'white',
                        borderRadius: '1rem',
                        fontWeight: '900',
                        fontSize: '1.25rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        boxShadow: '0 10px 40px -10px rgba(168, 85, 247, 0.5)',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        Deploy Project
                    </button>
                </form>
            </div>

            <style>{`
        .admin-input {
          padding: 1rem 1.25rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--glass-border);
          border-radius: 0.75rem;
          color: white;
          outline: none;
          width: 100%;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .admin-input:focus {
          border-color: var(--primary);
          background: rgba(168, 85, 247, 0.05);
          box-shadow: 0 0 15px rgba(168, 85, 247, 0.1);
        }
      `}</style>
        </div>
    );
};

export default Admin;
