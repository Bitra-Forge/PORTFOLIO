import './Loader.css';

const Loader = ({ size = 48 }) => {
  return (
    <div className="loader-container">
      <div 
        className="loader animate-spin" 
        style={{ width: size, height: size }}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default Loader;
