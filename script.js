// script.js — lazy loading, reveal email, basic lightbox
document.addEventListener('DOMContentLoaded', function(){
  // Lazy-loading images (data-src -> src)
  const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
  if('IntersectionObserver' in window){
    const imgObserver = new IntersectionObserver(function(entries, observer){
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const img = entry.target;
          const src = img.getAttribute('data-src');
          if(src){
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.remove('lazy');
          }
          observer.unobserve(img);
        }
      });
    },{rootMargin:'50px 0px'});
    lazyImages.forEach(img => imgObserver.observe(img));
  } else {
    // Fallback: load all
    lazyImages.forEach(img => { const src=img.getAttribute('data-src'); if(src) img.src=src; });
  }

  // Reveal email button
  const revealBtn = document.getElementById('reveal-email');
  const emailPlaceholder = document.getElementById('email-placeholder');
  if(revealBtn && emailPlaceholder){
    revealBtn.addEventListener('click', function(){
      const isHidden = emailPlaceholder.hidden;
      if(isHidden){
        emailPlaceholder.hidden = false;
        revealBtn.setAttribute('aria-expanded','true');
      } else {
        emailPlaceholder.hidden = true;
        revealBtn.setAttribute('aria-expanded','false');
      }
    });
  }

  // Basic Lightbox
  const figures = Array.from(document.querySelectorAll('.gallery figure'));
  let currentIndex = -1;
  function openLightbox(index){
    currentIndex = index;
    const imgSrc = figures[index].querySelector('img').getAttribute('src') || figures[index].querySelector('img').getAttribute('data-src');
    const alt = figures[index].querySelector('img').getAttribute('alt') || '';

    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.tabIndex = -1;

    const content = document.createElement('div');
    content.className = 'lightbox-content';

    const image = document.createElement('img');
    image.src = imgSrc;
    image.alt = alt;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerText = '×';
    closeBtn.addEventListener('click', closeLightbox);

    const nav = document.createElement('div');
    nav.className = 'lightbox-nav';
    const prevBtn = document.createElement('button'); prevBtn.innerText='‹';
    const nextBtn = document.createElement('button'); nextBtn.innerText='›';
    prevBtn.addEventListener('click', ()=> navigate(-1));
    nextBtn.addEventListener('click', ()=> navigate(1));
    nav.appendChild(prevBtn); nav.appendChild(nextBtn);

    content.appendChild(image);
    content.appendChild(closeBtn);
    content.appendChild(nav);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    document.body.style.overflow='hidden';

    overlay.addEventListener('click', function(e){ if(e.target===overlay) closeLightbox(); });

    document.addEventListener('keydown', keyHandler);

    function keyHandler(e){
      if(e.key === 'Escape') closeLightbox();
      if(e.key === 'ArrowRight') navigate(1);
      if(e.key === 'ArrowLeft') navigate(-1);
    }

    function navigate(dir){
      const next = (currentIndex + dir + figures.length) % figures.length;
      currentIndex = next;
      const nextImg = figures[currentIndex].querySelector('img').getAttribute('src') || figures[currentIndex].querySelector('img').getAttribute('data-src');
      image.src = nextImg;
      image.alt = figures[currentIndex].querySelector('img').getAttribute('alt') || '';
    }

    function closeLightbox(){
      document.removeEventListener('keydown', keyHandler);
      document.body.style.overflow='';
      overlay.remove();
    }
  }

  figures.forEach((fig, idx)=>{
    fig.addEventListener('click', ()=>{
      // ensure image is loaded
      const img = fig.querySelector('img');
      if(img.getAttribute('data-src')){
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      }
      openLightbox(idx);
    });
  });

});
