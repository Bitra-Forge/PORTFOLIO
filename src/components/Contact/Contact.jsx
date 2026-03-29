import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../Toast';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Save to localStorage as fallback
  const saveToLocalStorage = useCallback((data) => {
    try {
      const existing = localStorage.getItem('bitra_contact_messages');
      const messages = existing ? JSON.parse(existing) : [];
      messages.push({
        ...data,
        id: Date.now(),
        created_at: new Date().toISOString(),
        synced: false
      });
      localStorage.setItem('bitra_contact_messages', JSON.stringify(messages));
      return true;
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
      return false;
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({ type: 'error', message: 'All fields are required.' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      // Attempt to save to Supabase
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      // Success - clear form and show message
      setFormData({ name: '', email: '', message: '' });
      setStatus({ type: 'success', message: 'Transmission Received. We will respond shortly.' });
      toast.success('Message sent successfully!');
    } catch (err) {
      console.error('Supabase error:', err.message);
      
      // Fallback to localStorage
      const saved = saveToLocalStorage(formData);
      
      if (saved) {
        setFormData({ name: '', email: '', message: '' });
        setStatus({ 
          type: 'success', 
          message: 'Message stored locally. Will sync when connection is restored.' 
        });
        toast.info('Saved offline. Will sync when online.');
      } else {
        setStatus({ 
          type: 'error', 
          message: 'Transmission failed. Please try again or email us directly.' 
        });
        toast.error('Failed to send message. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <header className="contact-header">
        <h2 className="contact-title">Connect for the Future</h2>
        <p className="contact-subtitle">
          Ready to engineer something extraordinary? Reach out to the Forge.
        </p>
      </header>

      <div className="contact-grid">
        {/* Contact Info */}
        <div className="contact-info glass">
          <div className="contact-info-item">
            <h4 className="contact-info-label">Electronic Mail</h4>
            <p className="contact-info-value">forge@bitra.io</p>
          </div>
          <div className="contact-info-item">
            <h4 className="contact-info-label">Global Frequency</h4>
            <div className="contact-socials">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-social-link"
              >
                Twitter
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-social-link"
              >
                LinkedIn
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-social-link"
              >
                Github
              </a>
            </div>
          </div>
          <footer className="contact-footer">
            <p>&copy; 2026 BITRAFORGE. All Systems Operational.</p>
          </footer>
        </div>

        {/* Contact Form */}
        <div className="contact-form-wrapper glass">
          <form className="contact-form" onSubmit={handleSubmit}>
            {status.message && (
              <div className={`contact-status ${status.type}`}>
                {status.message}
              </div>
            )}
            <div className="contact-field">
              <input
                type="text"
                name="name"
                placeholder="Identity (Your Name)"
                value={formData.name}
                onChange={handleChange}
                required
                className="contact-input"
                aria-label="Your name"
              />
            </div>
            <div className="contact-field">
              <input
                type="email"
                name="email"
                placeholder="Secure Endpoint (Email)"
                value={formData.email}
                onChange={handleChange}
                required
                className="contact-input"
                aria-label="Your email"
              />
            </div>
            <div className="contact-field">
              <textarea
                name="message"
                rows="4"
                placeholder="The Mission (Message)"
                value={formData.message}
                onChange={handleChange}
                required
                className="contact-input contact-textarea"
                aria-label="Your message"
              />
            </div>
            <button 
              type="submit" 
              className="contact-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Transmitting...' : 'Initialize Contact'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
