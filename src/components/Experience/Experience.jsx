import { memo } from 'react';
import './Experience.css';

// Default experience data - can be replaced with data from Supabase
const defaultExperience = [
  {
    id: 1,
    role: 'Senior Frontend Developer',
    company: 'Tech Company',
    location: 'Remote',
    period: '2024 - Present',
    description: 'Leading frontend architecture decisions and mentoring junior developers. Building scalable React applications with TypeScript.',
    technologies: ['React', 'TypeScript', 'Next.js', 'GraphQL'],
    current: true,
  },
  {
    id: 2,
    role: 'Full Stack Developer',
    company: 'Startup Inc',
    location: 'San Francisco, CA',
    period: '2022 - 2024',
    description: 'Developed and maintained multiple web applications. Implemented CI/CD pipelines and improved deployment processes.',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    current: false,
  },
  {
    id: 3,
    role: 'Junior Developer',
    company: 'Digital Agency',
    location: 'New York, NY',
    period: '2020 - 2022',
    description: 'Built responsive websites and web applications for various clients. Collaborated with designers to implement pixel-perfect UIs.',
    technologies: ['JavaScript', 'React', 'CSS', 'WordPress'],
    current: false,
  },
];

const ExperienceCard = memo(({ experience, index }) => (
  <div 
    className={`experience-card ${experience.current ? 'current' : ''}`}
    style={{ animationDelay: `${index * 0.15}s` }}
  >
    <div className="experience-timeline-dot" aria-hidden="true" />
    <div className="experience-content glass">
      <div className="experience-header">
        <div>
          <h3 className="experience-role">{experience.role}</h3>
          <p className="experience-company">
            {experience.company} 
            <span className="experience-location"> • {experience.location}</span>
          </p>
        </div>
        <span className={`experience-period ${experience.current ? 'current' : ''}`}>
          {experience.period}
        </span>
      </div>
      <p className="experience-description">{experience.description}</p>
      <div className="experience-tech">
        {experience.technologies.map((tech) => (
          <span key={tech} className="experience-tech-tag">{tech}</span>
        ))}
      </div>
    </div>
  </div>
));

ExperienceCard.displayName = 'ExperienceCard';

const Experience = ({ experience = defaultExperience }) => {
  return (
    <section className="experience-section" aria-labelledby="experience-title">
      <header className="experience-header-section">
        <h2 id="experience-title" className="experience-title">Experience</h2>
        <p className="experience-subtitle">
          My professional journey and the companies I've had the pleasure to work with.
        </p>
      </header>

      <div className="experience-timeline">
        <div className="experience-timeline-line" aria-hidden="true" />
        {experience.map((exp, index) => (
          <ExperienceCard key={exp.id} experience={exp} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Experience;
