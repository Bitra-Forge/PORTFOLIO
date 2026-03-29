import { useState } from 'react';
import SEO from '../../components/SEO';
import ProjectCard from '../../components/ProjectCard';
import ProjectModal from '../../components/ProjectModal';
import './Works.css';

const Works = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  const getGridSpan = (index, count) => {
    if (count === 1) {
      return { col: '1 / -1', row: 1 };
    } else if (count === 2) {
      return { col: 'span 2', row: 1 };
    } else if (count === 3) {
      if (index === 0) return { col: 'span 2', row: 1 };
      return { col: 'span 1', row: 1 };
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
      return { col: `span ${p.col}`, row: `span ${p.row}` };
    }
  };

  return (
    <>
      <SEO 
        title="The Forge"
        description="Explore our portfolio of industrial-grade digital artifacts, engineered for high-performance and visual dominance."
        url="/"
      />
      <div className="works-container">
        <header className="works-header">
          <h1 className="works-title animate-slide-up">The Forge</h1>
          <p className="works-subtitle animate-fade-in">
            A curated selection of industrial-grade digital artifacts, engineered
            for high-performance and visual dominance.
          </p>
        </header>

        <section 
          className="works-grid" 
          aria-label="Portfolio projects"
        >
          {projects.length > 0 ? (
            projects.map((project, index) => {
              const span = getGridSpan(index, projects.length);
              return (
                <div
                  key={project.id || index}
                  className="works-grid-item animate-slide-up"
                  style={{
                    gridColumn: span.col,
                    gridRow: span.row,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <ProjectCard
                    project={project}
                    onOpen={() => setSelectedProject(project)}
                  />
                </div>
              );
            })
          ) : (
            <div className="works-empty" role="status">
              The Forge is currently empty. Initialize via the secure terminal.
            </div>
          )}
        </section>

        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </>
  );
};

export default Works;
