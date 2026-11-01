// <mw-live src w h> — live, scaled iframe preview that only loads when its slide is active.
(function () {
  if (customElements.get('mw-live')) return;
  class MwLive extends HTMLElement {
    static get observedAttributes() { return ['src', 'w', 'h']; }
    connectedCallback() {
      this.style.display = 'block';
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.style.width = '100%';
      this.style.height = '100%';
      if (!this._ph) {
        this._ph = document.createElement('div');
        this._ph.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:repeating-linear-gradient(135deg,#0E171D 0 14px,#121C23 14px 28px);color:#938F88;font:500 24px "JetBrains Mono",monospace;letter-spacing:.08em;text-transform:uppercase';
        this._ph.textContent = 'загрузка…';
        this.appendChild(this._ph);
      }
      this._slide = this.closest('section');
      this._check = () => { if (!this._slide || this._slide.hasAttribute('data-deck-active')) this._load(); };
      if (this._slide) {
        this._mo = new MutationObserver(this._check);
        this._mo.observe(this._slide, { attributes: true, attributeFilter: ['data-deck-active'] });
      }
      this._ro = new ResizeObserver(() => this._fit());
      this._ro.observe(this);
      this._check();
    }
    disconnectedCallback() { this._mo && this._mo.disconnect(); this._ro && this._ro.disconnect(); }
    attributeChangedCallback(n) { if (n === 'src' && this._frame) this._frame.src = this.getAttribute('src'); this._fit(); }
    _load() {
      if (this._frame || !this.getAttribute('src')) return;
      const f = document.createElement('iframe');
      f.src = this.getAttribute('src');
      f.setAttribute('title', this.getAttribute('label') || 'Превью сайта');
      f.style.cssText = 'position:absolute;top:0;left:0;border:0;transform-origin:0 0;background:#000';
      f.addEventListener('load', () => { if (this._ph) this._ph.style.display = 'none'; });
      this._frame = f;
      this.appendChild(f);
      this._fit();
    }
    _fit() {
      if (!this._frame) return;
      const w = +this.getAttribute('w') || 1440, h = +this.getAttribute('h') || 900;
      const s = this.clientWidth / w;
      this._frame.style.width = w + 'px';
      this._frame.style.height = h + 'px';
      this._frame.style.transform = 'scale(' + s + ')';
    }
  }
  customElements.define('mw-live', MwLive);
})();
