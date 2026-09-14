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

  // 顯示 / 隱藏 郵箱 按鈕
  const revealBtn = document.getElementById('reveal-email');
  const emailPlaceholder = document.getElementById('email-placeholder');
  if(revealBtn && emailPlaceholder){
    revealBtn.addEventListener('click', function(){
      const isHidden = emailPlaceholder.hidden;
      if(isHidden){
        emailPlaceholder.hidden = false;
        revealBtn.setAttribute('aria-expanded','true');
        // 按鈕文字改為「隱藏聯絡郵箱」以符合介面語言
        revealBtn.innerText = '隱藏聯絡郵箱';
      } else {
        emailPlaceholder.hidden = true;
        revealBtn.setAttribute('aria-expanded','false');
        revealBtn.innerText = '顯示聯絡郵箱';
      }
    });
  }

  // 基本圖片燈箱（Lightbox）
  const figures = Array.from(document.querySelectorAll('.gallery figure'));
  let currentIndex = -1;
  function openLightbox(index){
    currentIndex = index;
    const imgEl = figures[index].querySelector('img');
    const imgSrc = imgEl.getAttribute('src') || imgEl.getAttribute('data-src');
    const alt = imgEl.getAttribute('alt') || '';

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
    // 使用中文標籤，並保留符號以利辨識
    closeBtn.innerText = '× 關閉';
    closeBtn.setAttribute('aria-label','關閉燈箱');
    closeBtn.addEventListener('click', closeLightbox);

    const nav = document.createElement('div');
    nav.className = 'lightbox-nav';
    const prevBtn = document.createElement('button'); prevBtn.innerText='上一張';
    const nextBtn = document.createElement('button'); nextBtn.innerText='下一張';
    prevBtn.setAttribute('aria-label','上一張圖片');
    nextBtn.setAttribute('aria-label','下一張圖片');
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
      const nextImgEl = figures[currentIndex].querySelector('img');
      const nextImg = nextImgEl.getAttribute('src') || nextImgEl.getAttribute('data-src');
      image.src = nextImg;
      image.alt = nextImgEl.getAttribute('alt') || '';
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
