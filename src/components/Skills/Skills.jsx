import { memo } from 'react';
import './Skills.css';

// Default skills data - can be replaced with data from Supabase
const defaultSkills = [
  {
    category: 'Frontend',
    items: [
      { name: 'React', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'Next.js', level: 80 },
      { name: 'CSS/Tailwind', level: 90 },
    ]
  },
  {
    category: 'Backend',
    items: [
      { name: 'Node.js', level: 85 },
      { name: 'Python', level: 75 },
      { name: 'PostgreSQL', level: 80 },
      { name: 'REST APIs', level: 90 },
    ]
  },
  {
    category: 'Tools & DevOps',
    items: [
      { name: 'Git', level: 90 },
      { name: 'Docker', level: 70 },
      { name: 'AWS/Cloud', level: 65 },
      { name: 'CI/CD', level: 75 },
    ]
  },
];

const SkillBar = memo(({ name, level, delay }) => (
  <div className="skill-item" style={{ animationDelay: `${delay}s` }}>
    <div className="skill-header">
      <span className="skill-name">{name}</span>
      <span className="skill-level">{level}%</span>
    </div>
    <div className="skill-bar">
      <div 
        className="skill-progress" 
        style={{ '--progress': `${level}%` }}
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={`${name} proficiency: ${level}%`}
      />
    </div>
  </div>
));

SkillBar.displayName = 'SkillBar';

const Skills = ({ skills = defaultSkills }) => {
  return (
    <section className="skills-section" aria-labelledby="skills-title">
      <header className="skills-header">
        <h2 id="skills-title" className="skills-title">Tech Stack</h2>
        <p className="skills-subtitle">
          Technologies and tools I work with to bring ideas to life.
        </p>
      </header>

      <div className="skills-grid">
        {skills.map((category, catIndex) => (
          <div 
            key={category.category} 
            className="skills-category glass animate-slide-up"
            style={{ animationDelay: `${catIndex * 0.1}s` }}
          >
            <h3 className="skills-category-title">{category.category}</h3>
            <div className="skills-list">
              {category.items.map((skill, skillIndex) => (
                <SkillBar 
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  delay={(catIndex * 0.1) + (skillIndex * 0.05)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
