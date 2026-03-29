import { memo, useState, useCallback } from 'react';
import './ProjectCard.css';

const ProjectCard = memo(({ project, onOpen }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isVideo = project.media_type === 'video';

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <article className="project-card glass hover-scale">
      <div className="project-card-media">
        {isVideo ? (
          <video
            src={project.image}
            autoPlay
            muted
            loop
            playsInline
            className="project-card-video"
            preload="metadata"
          />
        ) : (
          <>
            {!imageLoaded && !imageError && (
              <div className="project-card-placeholder" aria-hidden="true">
                <div className="project-card-placeholder-shimmer" />
              </div>
            )}
            {imageError ? (
              <div className="project-card-error">
                <span>Image unavailable</span>
              </div>
            ) : (
              <img
                src={project.image}
                alt={project.title}
                className={`project-card-image ${imageLoaded ? 'loaded' : ''}`}
                loading="lazy"
                decoding="async"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
          </>
        )}
        {project.tags?.length > 0 && (
          <div className="project-card-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="project-card-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="project-card-content">
        <h3 className="project-card-title">{project.title}</h3>
        <p className="project-card-description">{project.description}</p>
        <div className="project-card-actions">
          {project.links?.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-forge-secondary project-card-link"
            >
              {link.label || 'View'}
            </a>
          ))}
          <button
            onClick={onOpen}
            className={`btn-forge-primary project-card-details ${
              project.links?.length > 0 ? 'compact' : ''
            }`}
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
