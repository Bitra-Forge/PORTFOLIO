import { useState, useRef, useId, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context';
import { useToast } from '../../components/Toast';
import SEO from '../../components/SEO';
import './Admin.css';

const Admin = ({ onAdd }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const titleId = useId();
  const descId = useId();
  const tagsId = useId();
  const toast = useToast();
  const { user, signOut } = useAuth();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('projects');
  
  // Project form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    media_type: 'image',
    tags: '',
    links: [{ label: 'GitHub', url: '' }]
  });

  // Contact messages state
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch contact messages
  const fetchMessages = useCallback(async () => {
    setMessagesLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err.message);
      // Fallback to localStorage
      const saved = localStorage.getItem('bitra_contact_messages');
      if (saved) {
        try {
          setMessages(JSON.parse(saved));
        } catch (parseErr) {
          console.error('Error parsing localStorage:', parseErr);
        }
      }
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  // Load messages when switching to messages tab
  useEffect(() => {
    if (activeTab === 'messages') {
      fetchMessages();
    }
  }, [activeTab, fetchMessages]);

  // Mark message as read
  const markAsRead = async (messageId) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) throw error;
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
      toast.success('Message marked as read');
    } catch (err) {
      console.error('Error updating message:', err.message);
      toast.error('Failed to update message');
    }
  };

  // Delete message
  const deleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setSelectedMessage(null);
      toast.success('Message deleted');
    } catch (err) {
      console.error('Error deleting message:', err.message);
      toast.error('Failed to delete message');
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Unread count
  const unreadCount = messages.filter(m => !m.read).length;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      setFormData(prev => ({ ...prev, media_type: isVideo ? 'video' : 'image' }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addLinkField = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { label: '', url: '' }]
    }));
  };

  const updateLink = (index, field, value) => {
    setFormData(prev => {
      const newLinks = [...prev.links];
      newLinks[index][field] = value;
      return { ...prev, links: newLinks };
    });
  };

  const removeLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
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

  const isBase64 = formData.image.startsWith('data:');

  return (
    <>
      <SEO 
        title="Admin Panel"
        description="Add new projects to the BitraForge portfolio."
        url="/admin"
      />
      <div className="admin-container">
        {/* Admin Header with User Info */}
        <div className="admin-header">
          <h1 className="admin-header-title">Admin Panel</h1>
          <div className="admin-user-info">
            <span className="admin-user-email">{user?.email}</span>
            <button onClick={() => signOut()} className="admin-signout">
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            New Project
          </button>
          <button
            className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
            {unreadCount > 0 && (
              <span className="admin-tab-badge">{unreadCount}</span>
            )}
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="admin-panel glass animate-slide-up">
            <h1 className="admin-title">New Artifact</h1>

            <form onSubmit={handleSubmit} className="admin-form" aria-label="Add new project">
              {/* Section 1: Core Info */}
              <fieldset className="admin-section">
                <legend className="admin-section-title">Project Basis</legend>
                <div className="admin-section-content">
                  <div className="admin-field">
                    <label htmlFor={titleId} className="visually-hidden">Project Title</label>
                    <input
                      id={titleId}
                      type="text"
                      required
                      placeholder="Project Title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="admin-input"
                      aria-required="true"
                    />
                  </div>
                  <div className="admin-field">
                    <label htmlFor={descId} className="visually-hidden">Project Description</label>
                    <textarea
                      id={descId}
                      required
                      rows="4"
                      placeholder="Deep Analysis / Project Description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="admin-input"
                      aria-required="true"
                    />
                  </div>
                </div>
              </fieldset>

              {/* Section 2: Media */}
              <fieldset className="admin-section">
                <legend className="admin-section-title">Visual Asset</legend>
                <div className="admin-media-row">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="admin-upload-zone"
                    aria-label="Upload image or video"
                  >
                    {formData.image ? (
                      formData.media_type === 'video' ? (
                        <video src={formData.image} className="admin-preview" aria-hidden="true" />
                      ) : (
                        <img src={formData.image} alt="Preview of uploaded media" className="admin-preview" />
                      )
                    ) : (
                      <div className="admin-upload-placeholder">
                        <span className="admin-upload-icon" aria-hidden="true">+</span>
                        <p>Upload Photo/Video</p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      hidden
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      aria-label="Choose file to upload"
                    />
                  </button>
                  <div className="admin-url-input">
                    <p className="admin-url-label" id="url-label">Or use an external URL:</p>
                    <input
                      type="url"
                      placeholder="https://image-or-video-url.com"
                      value={isBase64 ? '' : formData.image}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        image: e.target.value,
                        media_type: e.target.value.includes('mp4') ? 'video' : 'image'
                      }))}
                      className="admin-input"
                      aria-labelledby="url-label"
                    />
                  </div>
                </div>
              </fieldset>

              {/* Section 3: Links */}
              <fieldset className="admin-section">
                <div className="admin-section-header">
                  <legend className="admin-section-title">Reference Links</legend>
                  <button 
                    type="button" 
                    onClick={addLinkField} 
                    className="admin-add-link"
                    aria-label="Add another link field"
                  >
                    + Add Link
                  </button>
                </div>
                {formData.links.map((link, index) => (
                  <div key={index} className="admin-link-row" role="group" aria-label={`Link ${index + 1}`}>
                    <input
                      type="text"
                      placeholder="Label (e.g. GitHub)"
                      value={link.label}
                      onChange={(e) => updateLink(index, 'label', e.target.value)}
                      className="admin-input admin-link-label"
                      aria-label={`Link ${index + 1} label`}
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={link.url}
                      onChange={(e) => updateLink(index, 'url', e.target.value)}
                      className="admin-input admin-link-url"
                      aria-label={`Link ${index + 1} URL`}
                    />
                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="admin-remove-link"
                      aria-label={`Remove link ${index + 1}`}
                    >
                      X
                    </button>
                  </div>
                ))}
              </fieldset>

              {/* Section 4: Meta */}
              <fieldset className="admin-section">
                <legend className="admin-section-title">Taxonomy</legend>
                <div className="admin-field">
                  <label htmlFor={tagsId} className="visually-hidden">Tags</label>
                  <input
                    id={tagsId}
                    type="text"
                    placeholder="Tags (comma separated, e.g. React, UI/UX, Rust)"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="admin-input"
                  />
                </div>
              </fieldset>

              <button type="submit" className="admin-submit">
                Deploy Project
              </button>
            </form>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="admin-panel glass animate-slide-up">
            <h1 className="admin-title">Incoming Transmissions</h1>
            
            {messagesLoading ? (
              <div className="admin-messages-loading">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="admin-messages-empty">
                <p>No messages yet. Your inbox is clear.</p>
              </div>
            ) : (
              <div className="admin-messages-grid">
                {/* Messages List */}
                <div className="admin-messages-list">
                  {messages.map((msg) => (
                    <button
                      key={msg.id}
                      className={`admin-message-item ${!msg.read ? 'unread' : ''} ${selectedMessage?.id === msg.id ? 'selected' : ''}`}
                      onClick={() => setSelectedMessage(msg)}
                    >
                      <div className="admin-message-header">
                        <span className="admin-message-name">{msg.name}</span>
                        {!msg.read && <span className="admin-message-dot" />}
                      </div>
                      <span className="admin-message-email">{msg.email}</span>
                      <p className="admin-message-preview">
                        {msg.message.substring(0, 60)}{msg.message.length > 60 ? '...' : ''}
                      </p>
                      <span className="admin-message-date">{formatDate(msg.created_at)}</span>
                    </button>
                  ))}
                </div>

                {/* Message Detail */}
                <div className="admin-message-detail">
                  {selectedMessage ? (
                    <>
                      <div className="admin-message-detail-header">
                        <div>
                          <h3 className="admin-message-detail-name">{selectedMessage.name}</h3>
                          <a 
                            href={`mailto:${selectedMessage.email}`} 
                            className="admin-message-detail-email"
                          >
                            {selectedMessage.email}
                          </a>
                        </div>
                        <span className="admin-message-detail-date">
                          {formatDate(selectedMessage.created_at)}
                        </span>
                      </div>
                      <div className="admin-message-detail-body">
                        {selectedMessage.message}
                      </div>
                      <div className="admin-message-actions">
                        {!selectedMessage.read && (
                          <button
                            onClick={() => markAsRead(selectedMessage.id)}
                            className="admin-message-action mark-read"
                          >
                            Mark as Read
                          </button>
                        )}
                        <a
                          href={`mailto:${selectedMessage.email}?subject=Re: Your message to BitraForge`}
                          className="admin-message-action reply"
                        >
                          Reply
                        </a>
                        <button
                          onClick={() => deleteMessage(selectedMessage.id)}
                          className="admin-message-action delete"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="admin-message-placeholder">
                      <p>Select a message to view details</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Admin;
