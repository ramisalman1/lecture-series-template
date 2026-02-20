'use client';

import { useState, useEffect, useRef } from 'react';

const DATA_KEYS = [
  { key: 'lecture-annotations', label: 'الملاحظات والتعليقات', icon: 'sticky_note_2', unit: 'ملاحظة', countFn: v => { try { return JSON.parse(v)?.length || 0; } catch { return 0; } } },
  { key: 'lecture-progress', label: 'تقدّم المجالس', icon: 'menu_book', unit: 'مجلس', countFn: v => { try { return Object.keys(JSON.parse(v) || {}).length; } catch { return 0; } } },
  { key: 'assignments-progress', label: 'التكليفات', icon: 'task_alt', unit: 'تكليف', countFn: v => { try { return Object.values(JSON.parse(v) || {}).filter(Boolean).length; } catch { return 0; } } },
  { key: 'questions-answers', label: 'أسئلة الخِطبة', icon: 'quiz', unit: 'إجابة', countFn: v => { try { return Object.keys(JSON.parse(v) || {}).length; } catch { return 0; } } },
  { key: 'profile-card-data', label: 'بطاقة التعارف', icon: 'badge', unit: 'حقل', countFn: v => { try { return Object.keys(JSON.parse(v) || {}).length; } catch { return 0; } } },
  { key: 'redflags-checked', label: 'العلامات الحمراء', icon: 'flag', unit: 'علامة', countFn: v => { try { return Object.values(JSON.parse(v) || {}).filter(Boolean).length; } catch { return 0; } } },
  { key: 'lecture-notes', label: 'ملاحظات (قديم)', icon: 'note', unit: 'ملاحظة', countFn: v => { try { return Object.keys(JSON.parse(v) || {}).length; } catch { return 0; } } },
];

const EXPORT_VERSION = 1;

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [imported, setImported] = useState(false);
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef(null);

  function refreshStats() {
    const s = {};
    DATA_KEYS.forEach(({ key, countFn }) => {
      const raw = localStorage.getItem(key);
      s[key] = raw ? countFn(raw) : 0;
    });
    setStats(s);
  }

  useEffect(() => {
    setMounted(true);
    refreshStats();
  }, []);

  const totalItems = Object.values(stats).reduce((a, b) => a + b, 0);

  function exportData() {
    const data = { _version: EXPORT_VERSION, _exportedAt: new Date().toISOString() };
    DATA_KEYS.forEach(({ key }) => {
      const raw = localStorage.getItem(key);
      if (raw) {
        try { data[key] = JSON.parse(raw); } catch { data[key] = raw; }
      }
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ألف-باء-الزواج-بياناتي-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(e) {
    setImportError('');
    setImported(false);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data || typeof data !== 'object') {
          setImportError('الملف غير صالح.');
          return;
        }

        const validKeys = DATA_KEYS.map(d => d.key);
        let importedCount = 0;

        Object.entries(data).forEach(([key, value]) => {
          if (key.startsWith('_')) return;
          if (!validKeys.includes(key)) return;
          localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
          importedCount++;
        });

        if (importedCount === 0) {
          setImportError('لم يتم العثور على بيانات صالحة في الملف.');
          return;
        }

        refreshStats();
        setImported(true);
        setTimeout(() => setImported(false), 3000);
      } catch {
        setImportError('خطأ في قراءة الملف. تأكد أنه ملف JSON صالح.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function deleteAllData() {
    DATA_KEYS.forEach(({ key }) => localStorage.removeItem(key));
    refreshStats();
    setShowDeleteConfirm(false);
    setDeleted(true);
    setTimeout(() => setDeleted(false), 3000);
  }

  if (!mounted) return null;

  return (
    <main className="main main--settings">
      <div className="settings-page">
        <h1 className="settings-page__title">
          <span className="material-icons-round">settings</span>
          إدارة البيانات
        </h1>
        <p className="settings-page__desc">
          جميع بياناتك محفوظة محليًا في متصفحك فقط ولا تُرسل لأي خادم. يمكنك تصدير نسخة احتياطية أو استيراد بيانات سابقة أو حذف كل شيء.
        </p>

        {/* Data Summary */}
        <div className="settings-page__section">
          <h2 className="settings-page__section-title">
            <span className="material-icons-round">inventory_2</span>
            ملخص البيانات المحفوظة
          </h2>
          <div className="settings-page__data-grid">
            {DATA_KEYS.map(({ key, label, icon, unit }) => {
              const count = stats[key] || 0;
              return (
                <div key={key} className={`settings-page__data-card${count > 0 ? ' settings-page__data-card--has-data' : ''}`}>
                  <span className="material-icons-round settings-page__data-icon">{icon}</span>
                  <div className="settings-page__data-info">
                    <span className="settings-page__data-label">{label}</span>
                    <span className="settings-page__data-count">
                      {count > 0 ? `${count} ${unit}` : 'لا توجد بيانات'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Export */}
        <div className="settings-page__section">
          <h2 className="settings-page__section-title">
            <span className="material-icons-round">file_download</span>
            تصدير البيانات
          </h2>
          <p className="settings-page__section-desc">
            حمّل نسخة من جميع بياناتك كملف JSON. يمكنك استخدامها لاحقًا لاستعادة بياناتك على متصفح أو جهاز آخر.
          </p>
          <button
            className="settings-page__btn settings-page__btn--primary"
            onClick={exportData}
            disabled={totalItems === 0}
          >
            <span className="material-icons-round">file_download</span>
            تصدير جميع البيانات
          </button>
          {totalItems === 0 && (
            <p className="settings-page__hint">لا توجد بيانات للتصدير.</p>
          )}
        </div>

        {/* Import */}
        <div className="settings-page__section">
          <h2 className="settings-page__section-title">
            <span className="material-icons-round">file_upload</span>
            استيراد البيانات
          </h2>
          <p className="settings-page__section-desc">
            استورد بيانات من ملف JSON تم تصديره مسبقًا. سيتم دمج البيانات المستوردة مع البيانات الحالية (تُستبدل القيم المتشابهة).
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={importData}
            style={{ display: 'none' }}
          />
          <button
            className="settings-page__btn settings-page__btn--secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="material-icons-round">file_upload</span>
            اختيار ملف للاستيراد
          </button>
          {imported && (
            <div className="settings-page__toast settings-page__toast--success">
              <span className="material-icons-round">check_circle</span>
              تم استيراد البيانات بنجاح.
            </div>
          )}
          {importError && (
            <div className="settings-page__toast settings-page__toast--error">
              <span className="material-icons-round">error</span>
              {importError}
            </div>
          )}
        </div>

        {/* Delete */}
        <div className="settings-page__section settings-page__section--danger">
          <h2 className="settings-page__section-title settings-page__section-title--danger">
            <span className="material-icons-round">delete_forever</span>
            حذف جميع البيانات
          </h2>
          <p className="settings-page__section-desc">
            سيتم حذف جميع بياناتك نهائيًا (الملاحظات، التقدم، الإجابات، بطاقة التعارف). لن يتم حذف إعداداتك (المظهر، حجم الخط). هذا الإجراء لا يمكن التراجع عنه.
          </p>

          {!showDeleteConfirm ? (
            <button
              className="settings-page__btn settings-page__btn--danger"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={totalItems === 0}
            >
              <span className="material-icons-round">delete_forever</span>
              حذف جميع البيانات
            </button>
          ) : (
            <div className="settings-page__confirm">
              <p className="settings-page__confirm-text">
                <span className="material-icons-round">warning</span>
                هل أنت متأكد؟ سيتم حذف {totalItems} عنصر نهائيًا.
              </p>
              <div className="settings-page__confirm-actions">
                <button
                  className="settings-page__btn settings-page__btn--danger"
                  onClick={deleteAllData}
                >
                  <span className="material-icons-round">delete_forever</span>
                  نعم، احذف الكل
                </button>
                <button
                  className="settings-page__btn settings-page__btn--secondary"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}

          {deleted && (
            <div className="settings-page__toast settings-page__toast--success">
              <span className="material-icons-round">check_circle</span>
              تم حذف جميع البيانات.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
