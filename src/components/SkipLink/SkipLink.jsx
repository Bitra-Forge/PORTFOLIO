import './SkipLink.css';

const SkipLink = ({ targetId = 'main-content', children = 'Skip to main content' }) => {
  return (
    <a href={`#${targetId}`} className="skip-link">
      {children}
    </a>
  );
};

export default SkipLink;
