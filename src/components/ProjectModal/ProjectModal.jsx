import './ProjectModal.css';

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  const isVideo = project.media_type === 'video';

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content glass animate-slide-up">
        <button
          onClick={onClose}
          className="modal-close"
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 id="modal-title" className="modal-title">{project.title}</h2>

        {project.tags?.length > 0 && (
          <div className="modal-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="modal-tag"># {tag}</span>
            ))}
          </div>
        )}

        <div className="modal-media">
          {isVideo ? (
            <video 
              src={project.image} 
              controls 
              className="modal-video"
              aria-label={`Video for ${project.title}`}
            />
          ) : (
            <img 
              src={project.image} 
              alt={project.title}
              className="modal-image"
            />
          )}
        </div>

        <p className="modal-description">{project.description}</p>

        {project.links?.length > 0 && (
          <div className="modal-links">
            {project.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-link"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectModal;
