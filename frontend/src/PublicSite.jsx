import { useEffect, useMemo, useState } from 'react';
import api from './Api/axiosInstance';

const formatPrice = (price) => new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
}).format(price);

const typeName = (type) => type === 1 ? 'Commercial' : 'Residential';
const statusName = (status) => status === 1 ? 'Completed' : 'Under construction';

export default function PublicSite() {
  const [projects, setProjects] = useState([]);
  const [activeType, setActiveType] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [projectsError, setProjectsError] = useState('');

  useEffect(() => {
    api.get('/Projects')
      .then(({ data }) => {
        if (!Array.isArray(data)) {
          setProjects([]);
          setProjectsError('The API returned an invalid response. Check the API URL.');
          return;
        }

        setProjects(data.filter((project) => project.isPublished));
        setProjectsError('');
      })
      .catch((error) => {
        console.error(error);
        setProjects([]);
        setProjectsError('Unable to connect to the API. Check that it is running.');
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleProjects = useMemo(() => activeType === 'all'
    ? (Array.isArray(projects) ? projects : [])
    : (Array.isArray(projects) ? projects : []).filter((project) => typeName(project.type) === activeType), [activeType, projects]);

  useEffect(() => {
    const elements = document.querySelectorAll('.public-site .scroll-reveal');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [visibleProjects]);

  const openProject = (project) => {
    setSelectedProject(project);
    document.body.classList.add('modal-open');
  };

  const closeProject = () => {
    setSelectedProject(null);
    setActiveGalleryIndex(null);
    setRequestOpen(false);
    setRequestSubmitted(false);
    document.body.classList.remove('modal-open');
  };

  const openRequest = () => {
    setRequestSubmitted(false);
    setRequestOpen(true);
  };

  const submitRequest = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const phone = new FormData(form).get('phone')?.toString() || '';
    const digitCount = phone.replace(/\D/g, '').length;
    const allowedCharacters = /^[+0-9 ()-]+$/.test(phone);

    if (!allowedCharacters || digitCount < 7 || digitCount > 15) {
      const phoneInput = form.elements.namedItem('phone');
      phoneInput.setCustomValidity('Enter a valid phone number.');
      phoneInput.reportValidity();
      return;
    }

    form.elements.namedItem('phone').setCustomValidity('');
    setRequestSubmitted(true);
  };

  const selectedGalleryImages = Array.isArray(selectedProject?.galleryImages) ? selectedProject.galleryImages : [];
  const selectedUnits = Array.isArray(selectedProject?.units) ? selectedProject.units : [];
  const galleryImages = selectedGalleryImages.length
    ? [selectedProject.coverImageUrl, ...selectedGalleryImages.map((image) => image.imageUrl)]
    : selectedProject?.coverImageUrl ? [selectedProject.coverImageUrl] : [];

  const showPreviousGalleryImage = () => {
    setActiveGalleryIndex((current) => (current - 1 + galleryImages.length) % galleryImages.length);
  };

  const showNextGalleryImage = () => {
    setActiveGalleryIndex((current) => (current + 1) % galleryImages.length);
  };

  return (
    <div className="public-site" dir="ltr">
      <header className="public-nav motion-fade-in">
        <a className="brand motion-slide-in-left" href="/" aria-label="Artech Real Estate">
          <span className="brand-mark">A</span>
          <span>Artech Real Estate</span>
        </a>
        <nav className="motion-slide-in-right" aria-label="Main navigation">
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="public-hero">
          <div className="hero-content">
            <p className="eyebrow hero-reveal-item">Your next address</p>
            <h1 className="hero-reveal-item">Find a place made for your life.</h1>
            <p className="hero-copy hero-reveal-item">A considered collection of distinctive homes and investment opportunities in the city’s most compelling locations.</p>
            <a className="primary-action hero-reveal-item" href="#projects">Explore projects <span aria-hidden="true">→</span></a>
          </div>
          <div className="hero-image motion-hero-image" role="img" aria-label="Modern residential architecture" />
          <div className="hero-note motion-slide-in-right">
            <strong>Curated standards</strong>
            <span>Every opportunity is presented with clarity and care.</span>
          </div>
        </section>

        <section className="project-section scroll-reveal" id="projects">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark">The Artech portfolio</p>
              <h2>Featured projects</h2>
            </div>
            <div className="project-filters" aria-label="Filter projects">
              {['all', 'Residential', 'Commercial'].map((filter) => (
                <button
                  className={activeType === filter ? 'active' : ''}
                  key={filter}
                  onClick={() => setActiveType(filter)}
                  type="button"
                >
                  {filter === 'all' ? 'All' : filter}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="data-message">Loading projects…</p>
          ) : projectsError ? (
            <p className="data-message" role="alert">{projectsError}</p>
          ) : visibleProjects.length === 0 ? (
            <p className="data-message">No published projects are available right now.</p>
          ) : (
            <div className="project-grid" key={activeType}>
              {visibleProjects.map((project) => (
                <article className="project-card scroll-reveal" key={project.id}>
                  <button className="project-image-button" onClick={() => openProject(project)} type="button">
                    <img src={project.coverImageUrl} alt={project.name} />
                    <span>{statusName(project.status)}</span>
                  </button>
                  <div className="project-card-body">
                    <p className="project-location">{project.location}</p>
                    <h3>{project.name}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="project-card-footer">
                      <div>
                        <small>Starting from</small>
                        <strong>EGP {formatPrice(project.startingPrice)}</strong>
                      </div>
                      <button onClick={() => openProject(project)} type="button" aria-label={`View ${project.name} details`}>→</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="about-section" id="about">
          <div className="about-copy scroll-reveal scroll-reveal-left">
            <p className="eyebrow dark">About Artech</p>
            <h2>Experience that makes every decision clearer.</h2>
            <p>We connect you with the right real-estate opportunities through clear information, a focused selection, and personal support throughout the journey.</p>
          </div>
          <div className="stats-row scroll-reveal scroll-reveal-right">
            <div><strong>{projects.length}</strong><span>Available projects</span></div>
            <div><strong>{projects.filter((p) => p.status === 1).length}</strong><span>Completed projects</span></div>
            <div><strong>24/7</strong><span>Client support</span></div>
          </div>
        </section>

        <section className="contact-section scroll-reveal" id="contact">
          <div>
            <p className="eyebrow">Start today</p>
            <h2>Looking for the right place?</h2>
          </div>
          <div className="contact-actions">
            <a href="mailto:info@artechrealestate.com">Email info@artechrealestate.com <span aria-hidden="true">↗</span></a>
            <a href="tel:+201234567890">Call +20 123 456 7890 <span aria-hidden="true">→</span></a>
          </div>
        </section>
      </main>

      {selectedProject && (
        <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
          <button className="modal-backdrop" onClick={closeProject} aria-label="Close project details" type="button" />
          <section className="project-modal-panel">
            <button className="modal-close" onClick={closeProject} type="button" aria-label="Close">×</button>
            <div className="project-modal-media">
              <img src={selectedProject.coverImageUrl} alt={selectedProject.name} />
              {selectedGalleryImages.length > 0 && (
                <div className="project-gallery-grid" aria-label="Project gallery">
                  {selectedGalleryImages.map((image, index) => (
                    <button key={image.id} type="button" onClick={() => setActiveGalleryIndex(index + 1)}>
                      <img src={image.imageUrl} alt={`${selectedProject.name} gallery ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-content">
              <p className="project-location">{selectedProject.location} · {typeName(selectedProject.type)}</p>
              <h2 id="project-modal-title">{selectedProject.name}</h2>
              <p>{selectedProject.description}</p>
              <div className="modal-data">
                <div><small>Starting from</small><strong>EGP {formatPrice(selectedProject.startingPrice)}</strong></div>
                <div><small>Project status</small><strong>{statusName(selectedProject.status)}</strong></div>
              </div>
              {selectedUnits.length > 0 && (
                <div className="units-preview">
                  <h3>All units</h3>
                  {selectedUnits.map((unit) => (
                    <article key={unit.id}>
                      <h4>Unit {unit.unitNumber}</h4>
                      <div className="unit-detail-grid">
                        <span><small>Area</small><strong>{unit.areaM2} m²</strong></span>
                        <span><small>Floor</small><strong>{unit.floor}</strong></span>
                        <span><small>Bedrooms</small><strong>{unit.bedrooms}</strong></span>
                        <span><small>Bathrooms</small><strong>{unit.bathrooms}</strong></span>
                        <span><small>Status</small><strong>{unit.availability === 0 ? 'Available' : unit.availability === 1 ? 'Sold' : 'Reserved'}</strong></span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              {!requestOpen ? (
                <button className="primary-action" type="button" onClick={openRequest}>Request details</button>
              ) : requestSubmitted ? (
                <div className="request-confirmation" role="status">
                  <strong>Request received</strong>
                  <span>Our team will contact you shortly.</span>
                </div>
              ) : (
                <form className="request-form motion-rise-in" onSubmit={submitRequest}>
                  <div>
                    <h3>Request project details</h3>
                    <p>Share your contact information and our team will get back to you.</p>
                  </div>
                  <label>
                    Email address
                    <input type="email" name="email" autoComplete="email" placeholder="name@example.com" required />
                  </label>
                  <label>
                    Phone number
                    <input type="tel" name="phone" autoComplete="tel" inputMode="tel" minLength={7} maxLength={20} placeholder="+20 123 456 7890" required />
                  </label>
                  <button className="primary-action" type="submit">Send request</button>
                </form>
              )}
            </div>
          </section>
        </div>
      )}

      {activeGalleryIndex !== null && galleryImages[activeGalleryIndex] && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Project photo viewer">
          <button className="gallery-lightbox-backdrop" type="button" onClick={() => setActiveGalleryIndex(null)} aria-label="Close photo viewer" />
          <button className="gallery-lightbox-close" type="button" onClick={() => setActiveGalleryIndex(null)} aria-label="Close">×</button>
          {galleryImages.length > 1 && <button className="gallery-lightbox-control previous" type="button" onClick={showPreviousGalleryImage} aria-label="Previous photo">←</button>}
          <img key={activeGalleryIndex} src={galleryImages[activeGalleryIndex]} alt={`${selectedProject.name} photo ${activeGalleryIndex + 1}`} />
          {galleryImages.length > 1 && <button className="gallery-lightbox-control next" type="button" onClick={showNextGalleryImage} aria-label="Next photo">→</button>}
          <span>{activeGalleryIndex + 1} / {galleryImages.length}</span>
        </div>
      )}
    </div>
  );
}
