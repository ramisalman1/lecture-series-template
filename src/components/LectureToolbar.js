'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useProgressContext } from './ProgressProvider';

const TOTAL_LECTURES = 53;
const ANNOTATIONS_KEY = 'lecture-annotations';

function getMotivationalMessage(count) {
  if (count === 1) return 'بداية موفقة، واصل المسيرة!';
  if (count === 10) return 'عشرة مجالس! أنت على الطريق الصحيح';
  if (count === 21) return 'نصف الطريق! همّتك عالية';
  if (count >= TOTAL_LECTURES) return 'أتممت السلسلة كاملة، بارك الله فيك!';
  return 'استمر، كل مجلس يقرّبك من الهدف';
}

function getAnnotationsForSlug(slug) {
  try {
    const all = JSON.parse(localStorage.getItem(ANNOTATIONS_KEY)) || [];
    return all.filter(a => a.slug === slug);
  } catch { return []; }
}

export default function LectureToolbar({ slug, title }) {
  const progress = useProgressContext();
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastCount, setToastCount] = useState(0);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [includeComments, setIncludeComments] = useState(true);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [inlineNotes, setInlineNotes] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('inline-notes-visible') === 'true';
    setInlineNotes(saved);
  }, []);

  if (!progress?.mounted) return null;

  const bookmarked = progress.isBookmarked(slug);
  const read = progress.isRead(slug);

  function openPdfModal() {
    setShareOpen(false);
    setPdfModalOpen(true);
  }

  function toggleInlineNotes() {
    const next = !inlineNotes;
    setInlineNotes(next);
    localStorage.setItem('inline-notes-visible', String(next));
    window.dispatchEvent(new CustomEvent('inline-notes-toggle', { detail: next }));
  }

  async function exportLecturePdf() {
    setExportingPdf(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;

      const annotations = getAnnotationsForSlug(slug);
      const generalNote = annotations.find(a => a.pIndex === -1);
      const paragraphAnns = annotations
        .filter(a => a.pIndex !== undefined && a.pIndex !== -1)
        .sort((a, b) => a.pIndex - b.pIndex);

      // Build the PDF container
      const container = document.createElement('div');
      container.style.cssText = 'direction:rtl;font-family:sans-serif;padding:24px 32px;color:#1a1a1a;line-height:1.9;background:#FFFFFF;';

      // Title header
      const header = document.createElement('div');
      header.style.cssText = 'text-align:center;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #c26363;';
      const h1 = document.createElement('h1');
      h1.textContent = title;
      h1.style.cssText = 'font-size:20px;color:#c26363;margin:0 0 4px;';
      header.appendChild(h1);
      const subtitle = document.createElement('p');
      subtitle.textContent = 'ألف باء الزواج';
      subtitle.style.cssText = 'font-size:13px;color:#666;margin:0;';
      header.appendChild(subtitle);
      container.appendChild(header);

      // Clone the article content
      const articleEl = document.querySelector('.content');
      if (!articleEl) { setExportingPdf(false); return; }

      const contentClone = articleEl.cloneNode(true);
      // Clean up annotation-related attributes and classes
      contentClone.querySelectorAll('[data-ann-count]').forEach(el => {
        el.removeAttribute('data-ann-count');
        el.classList.remove('has-annotations');
      });
      // Remove any inline note blocks from the clone
      contentClone.querySelectorAll('.inline-ann-block').forEach(el => el.remove());
      // Force light-mode colors and RTL on all elements for PDF.
      // Dark theme CSS variables resolve to light colors (meant for dark bg),
      // which look washed out on a white PDF. Override with explicit values.
      contentClone.style.cssText += 'direction:rtl;text-align:right;color:#1a1a1a;';
      contentClone.querySelectorAll('*').forEach(el => {
        el.style.direction = 'rtl';
        el.style.textAlign = 'right';
      });
      contentClone.querySelectorAll('h1').forEach(el => {
        el.style.color = '#a04e4e';
        el.style.borderBottomColor = '#f0d4d4';
      });
      contentClone.querySelectorAll('h2').forEach(el => {
        el.style.color = '#212121';
        el.style.borderBottomColor = '#E0E0E0';
      });
      contentClone.querySelectorAll('h3').forEach(el => {
        el.style.color = '#212121';
      });
      contentClone.querySelectorAll('h4').forEach(el => {
        el.style.color = '#666666';
      });
      contentClone.querySelectorAll('p, li, span, div').forEach(el => {
        if (!el.style.color || el.style.color === 'inherit') {
          el.style.color = '#1a1a1a';
        }
      });
      contentClone.querySelectorAll('strong, b').forEach(el => {
        el.style.color = '#212121';
      });
      contentClone.querySelectorAll('a').forEach(el => {
        el.style.color = '#c26363';
      });
      contentClone.querySelectorAll('blockquote').forEach(el => {
        el.style.borderRightColor = '#c26363';
        el.style.color = '#333';
        el.style.background = '#F5F5F5';
      });
      contentClone.querySelectorAll('code').forEach(el => {
        el.style.background = '#F5F5F5';
        el.style.color = '#333';
      });
      // Strip native list markers and prepend text markers manually.
      // html2canvas does not render RTL list markers correctly.
      contentClone.querySelectorAll('ul, ol').forEach(list => {
        const isOrdered = list.tagName === 'OL';
        list.style.listStyle = 'none';
        list.style.paddingRight = '8px';
        list.style.paddingLeft = '0';
        list.style.marginRight = '0';
        list.style.marginLeft = '0';
        Array.from(list.children).forEach((li, i) => {
          if (li.tagName !== 'LI') return;
          const marker = isOrdered ? `${i + 1}. ` : '• ';
          li.style.paddingRight = '0';
          li.style.paddingLeft = '0';
          li.insertAdjacentText('afterbegin', marker);
        });
      });

      // If including comments, inject annotations inline after their paragraphs
      if (includeComments && paragraphAnns.length > 0) {
        // Group annotations by paragraph index
        const byParagraph = {};
        paragraphAnns.forEach(ann => {
          const key = String(ann.pIndex);
          if (!byParagraph[key]) byParagraph[key] = [];
          byParagraph[key].push(ann);
        });

        // Insert annotation blocks after each annotated paragraph
        Object.entries(byParagraph).forEach(([pIdx, anns]) => {
          const pEl = contentClone.querySelector(`[data-p="${pIdx}"]`);
          if (!pEl) return;

          const annBlock = document.createElement('div');
          annBlock.style.cssText = 'margin:6px 12px 14px;padding:10px 14px;background:#FFF8E1;border-right:3px solid #FFC107;border-radius:6px;';

          anns.forEach((ann, i) => {
            if (i > 0) {
              const sep = document.createElement('hr');
              sep.style.cssText = 'border:none;border-top:1px dashed #e0c860;margin:8px 0;';
              annBlock.appendChild(sep);
            }

            if (ann.selectedText) {
              const quote = document.createElement('div');
              quote.style.cssText = 'font-size:11px;color:#8d6e00;font-style:italic;margin-bottom:4px;';
              quote.textContent = '«' + ann.selectedText.slice(0, 150) + (ann.selectedText.length > 150 ? '...' : '') + '»';
              annBlock.appendChild(quote);
            }

            const note = document.createElement('div');
            note.style.cssText = 'font-size:12px;color:#5d4500;white-space:pre-wrap;';
            note.textContent = ann.note;
            annBlock.appendChild(note);
          });

          pEl.insertAdjacentElement('afterend', annBlock);
        });
      }

      container.appendChild(contentClone);

      // General note at the end
      if (includeComments && generalNote && generalNote.note?.trim()) {
        const genSection = document.createElement('div');
        genSection.style.cssText = 'margin-top:24px;padding:14px 16px;background:#faf0f0;border-right:3px solid #c26363;border-radius:6px;';
        const genTitle = document.createElement('div');
        genTitle.style.cssText = 'font-size:13px;font-weight:700;color:#c26363;margin-bottom:6px;';
        genTitle.textContent = 'ملاحظة عامة على المجلس';
        genSection.appendChild(genTitle);
        const genText = document.createElement('div');
        genText.style.cssText = 'font-size:12px;color:#333;white-space:pre-wrap;';
        genText.textContent = generalNote.note;
        genSection.appendChild(genText);
        container.appendChild(genSection);
      }

      await html2pdf().set({
        margin: [12, 12, 12, 12],
        filename: `${title}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      }).from(container).save();

      setPdfModalOpen(false);
    } finally {
      setExportingPdf(false);
    }
  }

  function getUrl() {
    return window.location.href;
  }

  function copyLink() {
    navigator.clipboard.writeText(getUrl()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareTelegram() {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(getUrl())}&text=${encodeURIComponent(title)}`, '_blank', 'width=550,height=420');
  }

  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(title + '\n' + getUrl())}`, '_blank', 'width=550,height=420');
  }

  function shareTwitter() {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(getUrl())}`, '_blank', 'width=550,height=420');
  }

  return (
    <>
      <div className="lecture-toolbar lecture-toolbar--visible">
        <div className="lecture-toolbar__inner">
          <button
            className={`toolbar-btn${bookmarked ? ' toolbar-btn--active' : ''}`}
            onClick={() => progress.toggleBookmark(slug)}
            title={bookmarked ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          >
            <span className="material-icons-round">
              {bookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
            <span className="toolbar-btn__label">{bookmarked ? 'في المفضلة' : 'المفضلة'}</span>
          </button>

          <button
            className={`toolbar-btn${read ? ' toolbar-btn--active' : ''}`}
            onClick={() => {
              if (read) {
                progress.markUnread(slug);
              } else {
                progress.markRead(slug);
                const newCount = progress.readCount + 1;
                setToastCount(newCount);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 4000);
              }
            }}
            title={read ? 'إلغاء القراءة' : 'تحديد كمقروءة'}
          >
            <span className="material-icons-round">
              {read ? 'check_circle' : 'check_circle_outline'}
            </span>
            <span className="toolbar-btn__label">{read ? 'إلغاء القراءة' : 'قُرئت'}</span>
          </button>

          <button
            className={`toolbar-btn${inlineNotes ? ' toolbar-btn--active' : ''}`}
            onClick={toggleInlineNotes}
            title={inlineNotes ? 'إخفاء الملاحظات' : 'عرض الملاحظات'}
          >
            <span className="material-icons-round">
              {inlineNotes ? 'comments_disabled' : 'comment'}
            </span>
            <span className="toolbar-btn__label">{inlineNotes ? 'إخفاء' : 'ملاحظات'}</span>
          </button>

          <button
            className="toolbar-btn"
            onClick={openPdfModal}
            title="تصدير PDF"
          >
            <span className="material-icons-round">picture_as_pdf</span>
            <span className="toolbar-btn__label">تصدير PDF</span>
          </button>

          <div className="toolbar-share-wrapper">
            <button
              className="toolbar-btn"
              onClick={() => setShareOpen(!shareOpen)}
              title="مشاركة"
            >
              <span className="material-icons-round">share</span>
              <span className="toolbar-btn__label">مشاركة</span>
            </button>

            {shareOpen && (
              <div className="toolbar-share-menu">
                <button className="toolbar-share-item" onClick={() => { shareTwitter(); setShareOpen(false); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  تويتر
                </button>
                <button className="toolbar-share-item" onClick={() => { shareTelegram(); setShareOpen(false); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  تليجرام
                </button>
                <button className="toolbar-share-item" onClick={() => { shareWhatsApp(); setShareOpen(false); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                  واتساب
                </button>
                <button className="toolbar-share-item" onClick={() => { copyLink(); setShareOpen(false); }}>
                  <span className="material-icons-round" style={{ fontSize: '16px' }}>{copied ? 'check' : 'link'}</span>
                  {copied ? 'تم النسخ' : 'نسخ الرابط'}
                </button>
              </div>
            )}
          </div>
        </div>

        {showToast && (
          <div className="read-toast">
            <span className="material-icons-round">emoji_events</span>
            <div>
              <div className="read-toast__title">أحسنت! أتممت {toastCount} من {TOTAL_LECTURES} مجلسًا</div>
              <div className="read-toast__sub">{getMotivationalMessage(toastCount)}</div>
            </div>
          </div>
        )}
      </div>

      {pdfModalOpen && createPortal(
        <>
          <div className="lecture-pdf-overlay" onClick={() => !exportingPdf && setPdfModalOpen(false)} />
          <div className="lecture-pdf-modal">
            <div className="lecture-pdf-modal__header">
              <span className="lecture-pdf-modal__title">تصدير المجلس كـ PDF</span>
              <button className="lecture-pdf-modal__close" onClick={() => !exportingPdf && setPdfModalOpen(false)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>

            <div className="lecture-pdf-modal__body">
              <div className="lecture-pdf-modal__info">
                <span className="material-icons-round">description</span>
                <span>{title}</span>
              </div>

              <label className="lecture-pdf-modal__toggle">
                <input
                  type="checkbox"
                  checked={includeComments}
                  onChange={e => setIncludeComments(e.target.checked)}
                />
                <span className="material-icons-round" style={{ fontSize: '20px', color: includeComments ? 'var(--primary)' : 'var(--on-surface-medium)' }}>
                  {includeComments ? 'comment' : 'speaker_notes_off'}
                </span>
                <span>تضمين ملاحظاتي في ملف الـ PDF</span>
              </label>

              {includeComments && (
                <div className="lecture-pdf-modal__hint">
                  <span className="material-icons-round">info</span>
                  ستظهر ملاحظاتك بعد كل فقرة مرتبطة بها، والملاحظة العامة في نهاية الملف
                </div>
              )}
            </div>

            <div className="lecture-pdf-modal__footer">
              <button
                className="pdf-preview-modal__btn pdf-preview-modal__btn--primary"
                onClick={exportLecturePdf}
                disabled={exportingPdf}
              >
                <span className="material-icons-round">{exportingPdf ? 'hourglass_empty' : 'picture_as_pdf'}</span>
                {exportingPdf ? 'جارٍ التصدير...' : 'تصدير PDF'}
              </button>
              <button
                className="pdf-preview-modal__btn pdf-preview-modal__btn--secondary"
                onClick={() => setPdfModalOpen(false)}
                disabled={exportingPdf}
              >
                إلغاء
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
