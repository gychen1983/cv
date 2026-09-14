// script.js — lazy loading, reveal email, basic lightbox
// 包含：i18n 字串、郵箱焦點管理、燈箱焦點圈選（trap focus）
const I18N = {
  reveal_show: '顯示聯絡郵箱',
  reveal_hide: '隱藏聯絡郵箱',
  lb_close: '× 關閉',
  lb_prev: '上一張',
  lb_next: '下一張',
  aria_close: '關閉燈箱',
  aria_prev: '上一張圖片',
  aria_next: '下一張圖片',
  lightbox_label: '圖片燈箱'
};

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

  // 顯示 / 隱藏 郵箱 按鈕 + 焦點管理
  const revealBtn = document.getElementById('reveal-email');
  const emailPlaceholder = document.getElementById('email-placeholder');
  if(revealBtn && emailPlaceholder){
    // 初始時讓郵箱不可聚焦
    emailPlaceholder.setAttribute('tabindex','-1');
    revealBtn.addEventListener('click', function(){
      const isHidden = emailPlaceholder.hidden;
      if(isHidden){
        emailPlaceholder.hidden = false;
        emailPlaceholder.setAttribute('tabindex','0');
        revealBtn.setAttribute('aria-expanded','true');
        revealBtn.innerText = I18N.reveal_hide;
        // 把焦點移到郵箱，方便鍵盤使用者複製
        emailPlaceholder.focus();
      } else {
        emailPlaceholder.hidden = true;
        // 取消可聚焦以避免 tab 被跳入不可見元素
        emailPlaceholder.setAttribute('tabindex','-1');
        revealBtn.setAttribute('aria-expanded','false');
        revealBtn.innerText = I18N.reveal_show;
        // 把焦點回到按鈕
        revealBtn.focus();
      }
    });
    // 確保按鈕文字初始為 i18n
    revealBtn.innerText = I18N.reveal_show;
  }

  // 基本圖片燈箱（Lightbox）
  const figures = Array.from(document.querySelectorAll('.gallery figure'));
  let currentIndex = -1;

  function openLightbox(index){
    const previouslyFocused = document.activeElement;
    currentIndex = index;
    const imgEl = figures[index].querySelector('img');
    const imgSrc = imgEl.getAttribute('src') || imgEl.getAttribute('data-src');
    const alt = imgEl.getAttribute('alt') || '';

    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.tabIndex = -1;
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-label', alt || I18N.lightbox_label);

    const content = document.createElement('div');
    content.className = 'lightbox-content';

    const image = document.createElement('img');
    image.src = imgSrc;
    image.alt = alt;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerText = I18N.lb_close;
    closeBtn.setAttribute('aria-label', I18N.aria_close);
    closeBtn.addEventListener('click', closeLightbox);

    const nav = document.createElement('div');
    nav.className = 'lightbox-nav';
    const prevBtn = document.createElement('button'); prevBtn.innerText=I18N.lb_prev;
    const nextBtn = document.createElement('button'); nextBtn.innerText=I18N.lb_next;
    prevBtn.setAttribute('aria-label', I18N.aria_prev);
    nextBtn.setAttribute('aria-label', I18N.aria_next);
    prevBtn.addEventListener('click', ()=> navigate(-1));
    nextBtn.addEventListener('click', ()=> navigate(1));
    nav.appendChild(prevBtn); nav.appendChild(nextBtn);

    content.appendChild(image);
    content.appendChild(closeBtn);
    content.appendChild(nav);
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // 禁用背景滾動
    document.body.style.overflow='hidden';

    // 當點擊遮罩（非內容）時關閉
    overlay.addEventListener('click', function(e){ if(e.target===overlay) closeLightbox(); });

    // 初始把焦點移到關閉按鈕
    closeBtn.focus();

    // 鍵盤處理（包含焦點圈選）
    document.addEventListener('keydown', keyHandler);

    function keyHandler(e){
      if(e.key === 'Escape') return closeLightbox();
      if(e.key === 'ArrowRight') return navigate(1);
      if(e.key === 'ArrowLeft') return navigate(-1);
      if(e.key === 'Tab'){
        // trap focus inside overlay
        const focusables = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if(focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if(e.shiftKey){
          if(document.activeElement === first){
            e.preventDefault();
            last.focus();
          }
        } else {
          if(document.activeElement === last){
            e.preventDefault();
            first.focus();
          }
        }
      }
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
      // 把焦點還給先前的元素（若還存在於文件中）
      try{ if(previouslyFocused && previouslyFocused.focus) previouslyFocused.focus(); }catch(e){}
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
