import '../../styles.css';
import type { Role } from '../security/authorization';
import { toggleTheme } from '../utils/theme';
import type { User } from 'firebase/auth';
import { escapeHtml } from '../components/ui';

const sections: Record<Role, string[]> = {
  student: ['المواد', 'الفيديوهات', 'الكتب', 'الواجبات', 'الامتحانات', 'الدرجات', 'الجدول', 'الإشعارات', 'البحث', 'المفضلة', 'الملف الشخصي', 'الإعدادات'],
  teacher: ['ملفات الدروس', 'فيديو YouTube', 'إنشاء امتحان', 'الواجبات', 'الحضور', 'التصحيح', 'الإحصائيات', 'بنك الأسئلة', 'إدارة المحتوى'],
  parent: ['الحضور', 'الدرجات', 'الواجبات', 'الرسائل', 'الإشعارات', 'التقارير'],
  admin: ['إدارة المستخدمين', 'الأخبار', 'الإحصائيات', 'التقارير', 'المواد', 'النسخ الاحتياطي', 'الإعدادات']
};
let dashboardController: AbortController | null = null;
let sectionController: AbortController | null = null;

function nav(role: Role) {
  return sections[role].map((item, index) => `<button type="button" data-section="${escapeHtml(item)}" class="dash-nav-item"><span class="dash-nav-mark">${String(index + 1).padStart(2, '0')}</span><span>${escapeHtml(item)}</span></button>`).join('');
}

function studentShell() {
  return `<div class="role-dashboard dashboard-student">
    <aside class="student-rail"><div class="student-brand"><span class="student-mark">ت</span><span><b>التناغة</b><small>مساحة التعلم</small></span></div><div class="student-rail-label">مساراتي</div><nav class="student-nav">${nav('student')}</nav><div class="student-rail-foot"><button data-action="theme" class="student-theme">تبديل المظهر</button><button data-action="logout" class="student-logout">تسجيل الخروج</button></div></aside>
    <main class="student-main"><header class="student-header"><div><span class="student-eyebrow">مساحة الطالب</span><h1>أهلاً بك مجددًا</h1><p>استمر من حيث توقفت، خطوة صغيرة اليوم تصنع فرقًا كبيرًا.</p></div><div class="student-profile"><span class="student-avatar">ط</span><span><b>حساب الطالب</b><small>مساحة التعلّم</small></span><button class="student-bell" data-smart="notifications" aria-label="مركز الإشعارات">♧</button></div></header>
      <section class="student-hero"><div><span class="student-kicker">مساحة الطالب</span><h2>تعلّم بخطوة واضحة</h2><p>تظهر هنا دروسك وواجباتك ومواعيدك الفعلية من المنصة.</p><button class="student-primary" data-section="المواد">استكشف المحتوى <span>←</span></button></div><div class="student-progress" aria-label="ملخص تقدّم التعلّم"><div class="student-ring" aria-hidden="true"><strong>↗</strong></div><div><b>ابدأ حين تكون مستعدًا</b><span>يُحتسب تقدمك من نشاط التعلّم.</span></div></div></section><div id="student-smart-root"></div>
    </main>
  </div>`;
}

function teacherShell() {
  return `<div class="role-dashboard dashboard-teacher"><aside class="teacher-rail"><div class="teacher-brand"><span class="teacher-logo" aria-hidden="true">T</span><div><b>TEACHER HUB</b><small>مدرسة التناغة</small></div></div><div class="teacher-command">مساحة التدريس</div><nav aria-label="أقسام المدرس">${nav('teacher')}</nav><div class="teacher-rail-bottom"><button data-action="theme">المظهر</button><button data-action="logout">خروج آمن</button></div></aside><main class="teacher-main"><header class="teacher-topbar"><div><span class="teacher-overline">إدارة الفصول والمحتوى</span><h1>مساحة التدريس</h1></div><div class="teacher-actions"><button class="teacher-outline" data-section="إدارة المحتوى">إضافة محتوى</button><span class="teacher-avatar" aria-hidden="true">م</span></div></header><section class="teacher-alert"><div class="teacher-alert-badge" aria-hidden="true">+</div><div><b>ابدأ بإعداد مساحة صفك</b><span>أضف درسًا أو فيديو أو تقييمًا لتظهر بيانات الفصل هنا.</span></div><button data-section="إدارة المحتوى">إدارة المحتوى ←</button></section><section class="teacher-grid"><article class="teacher-panel teacher-chart"><div class="teacher-panel-head"><div><h2>مؤشرات التفاعل</h2><span>تُعرض بعد توفر سجلات فعلية</span></div></div><div class="teacher-data-empty" role="status">لا تتوفر بيانات نشاط للفصل حتى الآن. ستظهر المؤشرات بعد تسجيل التفاعل في المنصة.</div></article><article class="teacher-panel teacher-tasks"><div class="teacher-panel-head"><div><h2>إجراءات سريعة</h2><span>اختصارات المدرس</span></div></div><button data-section="ملفات الدروس"><span class="task-icon purple" aria-hidden="true">DOC</span><b>إضافة ملف درس</b><small>ملف أو صورة تعليمية</small></button><button data-section="فيديو YouTube"><span class="task-icon orange" aria-hidden="true">YT</span><b>إضافة فيديو</b><small>رابط YouTube</small></button><button data-section="إنشاء امتحان"><span class="task-icon blue" aria-hidden="true">EX</span><b>إنشاء امتحان</b><small>إعداد تقييم للطلاب</small></button></article><article class="teacher-panel teacher-table"><div class="teacher-panel-head"><div><h2>الواجبات</h2><span>السجلات المنشورة</span></div><button data-section="الواجبات">فتح الواجبات ←</button></div><div class="teacher-data-empty" role="status">ستظهر الواجبات هنا بعد نشرها من حسابك.</div></article></section></main></div>`;
}
function parentShell() {
  return `<div class="role-dashboard dashboard-parent"><header class="parent-top"><div class="parent-brand"><span class="parent-sun" aria-hidden="true">ن</span><div><b>بوابة الأسرة</b><small>مدرسة التناغة الشرقية</small></div></div><div class="parent-top-actions"><button data-action="theme">المظهر</button><button data-action="logout" class="parent-exit">تسجيل الخروج</button></div></header><main class="parent-main"><section class="parent-welcome"><div><span class="parent-overline">متابعة الأسرة</span><h1>رحلة أبنائك الدراسية</h1><p>تظهر بيانات الحضور والدرجات والواجبات عند ربط حسابات الطلاب بهذه البوابة.</p></div></section><section class="parent-children"><article class="child-card selected parent-empty-state"><div class="child-head"><span class="child-avatar" aria-hidden="true">◎</span><div><b>لا توجد حسابات مرتبطة بعد</b><small>تواصل مع المدرسة لربط حساب ولي الأمر بالطلاب.</small></div></div></article></section><section class="parent-columns"><article class="parent-panel parent-timeline"><div class="parent-panel-head"><div><span class="parent-kicker">المتابعة الدراسية</span><h2>الحضور والدرجات</h2></div><button data-section="الحضور">فتح السجل ←</button></div><p class="parent-data-empty" role="status">لا توجد سجلات مرتبطة بهذا الحساب حاليًا.</p></article><article class="parent-panel parent-message"><span class="parent-kicker">التواصل مع المدرسة</span><h2>الرسائل</h2><p>استخدم صندوق الرسائل للتواصل مع المدرسة، وستظهر الردود هنا عند توفرها.</p><div class="message-by"><span class="teacher-mini" aria-hidden="true">ن</span><span><b>صندوق الرسائل</b><small>مراسلات حسابك</small></span><button data-section="الرسائل">فتح الرسائل ←</button></div></article></section><nav class="parent-bottom-nav" aria-label="متابعة الأبناء"><button data-section="الحضور"><span>01</span>الحضور</button><button data-section="الدرجات"><span>02</span>الدرجات</button><button data-section="الواجبات"><span>03</span>الواجبات</button><button data-section="التقارير"><span>04</span>التقارير</button></nav></main></div>`;
}
function adminShell() {
  const today = new Intl.DateTimeFormat('ar', { dateStyle: 'medium' }).format(new Date());
  return `<div class="role-dashboard dashboard-admin"><aside class="admin-rail"><div class="admin-brand"><span class="admin-symbol" aria-hidden="true">T</span><span>CONTROL<br><b>ROOM</b></span></div><div class="admin-live">إدارة المنصة</div><nav aria-label="أقسام الإدارة">${nav('admin')}</nav><div class="admin-operator"><span aria-hidden="true">م</span><div><b>مسؤول المنصة</b><small>لوحة الإدارة</small></div><button data-action="logout" aria-label="تسجيل الخروج">↗</button></div></aside><main class="admin-main"><header class="admin-top"><div><span class="admin-overline">إدارة منصة المدرسة</span><h1>مركز التحكم</h1></div><div class="admin-top-right"><span class="admin-date">${escapeHtml(today)}</span><button data-action="theme" aria-label="تبديل المظهر">المظهر</button></div></header><section class="admin-command"><div><span class="admin-overline">مصادر البيانات</span><h2>مركز الإدارة</h2><p>لن تُعرض مؤشرات تشغيل أو أعداد إلا بعد ربطها بسجلات موثوقة.</p></div><span class="admin-status">جاهز للإعداد</span></section><section class="admin-metrics" aria-label="مؤشرات المنصة"><article><span>المستخدمون</span><strong>—</strong><small>تظهر بعد ربط بيانات المستخدمين</small></article><article><span>المحتوى التعليمي</span><strong>—</strong><small>تظهر بعد ربط سجلات المحتوى</small></article><article><span>الحضور والدرجات</span><strong>—</strong><small>تظهر بعد توفر سجلات مدرسية</small></article><article><span>التنبيهات</span><strong>—</strong><small>تظهر بعد ربط مصدر التنبيهات</small></article></section><section class="admin-grid"><article class="admin-panel admin-activity"><div class="admin-panel-title"><div><span>سجل النشاط</span><h2>آخر التغييرات</h2></div></div><div class="admin-feed"><p class="admin-empty" role="status">لا توجد سجلات نشاط متاحة للعرض حاليًا.</p></div></article><article class="admin-panel admin-distribution"><div class="admin-panel-title"><div><span>إحصاءات المستخدمين</span><h2>توزيع الحسابات</h2></div></div><p class="admin-empty" role="status">لا تتوفر بيانات كافية لعرض التوزيع.</p></article><article class="admin-panel admin-actions"><div class="admin-panel-title"><div><span>أدوات الإدارة</span><h2>اختصارات</h2></div></div><button data-section="إدارة المستخدمين"><b>01</b><span>إدارة المستخدمين</span><i aria-hidden="true">←</i></button><button data-section="التقارير"><b>02</b><span>التقارير</span><i aria-hidden="true">←</i></button><button data-section="النسخ الاحتياطي"><b>03</b><span>تصدير التقارير</span><i aria-hidden="true">←</i></button></article></section></main></div>`;
}

function createSectionOverlay(root: HTMLElement, onClose: () => void, section: string) {
  const overlay = document.createElement('div');
  overlay.id = 'section-root';
  overlay.className = 'role-feature-overlay';
  overlay.innerHTML = `<section class="feature-dialog" role="dialog" aria-modal="true" aria-label="${escapeHtml(section)}" tabindex="-1"><button class="feature-back" type="button">← العودة إلى لوحة التحكم</button><div class="feature-content"></div></section>`;
  const dialog = overlay.querySelector<HTMLElement>('.feature-dialog')!;
  const back = overlay.querySelector<HTMLButtonElement>('.feature-back')!;
  back.addEventListener('click', onClose);
  dialog.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
      .filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true');
    if (!focusable.length) { event.preventDefault(); dialog.focus(); return; }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
  });
  root.append(overlay);
  dialog.focus();
  return overlay;
}

async function loadSection(root: HTMLElement, user: User, role: Role, section: string) {
  sectionController?.abort();
  const controller = new AbortController();
  sectionController = controller;
  const { renderFeature } = await import('./feature.page');
  if (controller.signal.aborted) return;
  try {
    await renderFeature(root, user, section, controller.signal);
  } catch (error) {
    if (controller.signal.aborted) return;
    root.innerHTML = `<section class="panel" role="alert"><h2>تعذر تحميل هذا القسم</h2><p class="muted">${escapeHtml(error instanceof Error ? error.message : 'حدث خطأ غير متوقع.')}</p><button class="btn sm feature-retry" type="button">إعادة المحاولة</button></section>`;
    root.querySelector('button')?.addEventListener('click', () => void loadSection(root, user, role, section), { signal: controller.signal });
  }
}

export async function renderDashboard(root: HTMLElement, user: User) {
  const { getUserRole } = await import('../security/authorization');
  const role = await getUserRole(user);
  if (!role) throw new Error('لم يتم تعيين دور لهذا الحساب.');
  cleanupDashboard();
  dashboardController = new AbortController();
  const shells: Record<Role, () => string> = { student: studentShell, teacher: teacherShell, parent: parentShell, admin: adminShell };
  root.innerHTML = shells[role]();
  if (role === 'student') {
    const smartRoot = root.querySelector<HTMLElement>('#student-smart-root');
    if (smartRoot) {
      const { mountStudentSmart } = await import('../features/student-smart');
      if (!dashboardController.signal.aborted) await mountStudentSmart(smartRoot, user, dashboardController.signal);
    }
  }
  const onClick = async (event: Event) => {
    const target = event.target as HTMLElement;
    const sectionButton = target.closest<HTMLButtonElement>('[data-section]');
    const action = target.closest<HTMLButtonElement>('[data-action]')?.dataset.action;
    const smartAction = target.closest<HTMLButtonElement>('[data-smart]')?.dataset.smart;
    if (sectionButton) {
      const section = sectionButton.dataset.section;
      if (!section) return;
      let overlay = root.querySelector<HTMLElement>('#section-root');
      if (!overlay) {
        const opener = sectionButton;
        overlay = createSectionOverlay(root, () => {
          sectionController?.abort();
          sectionController = null;
          overlay?.remove();
          opener.focus();
        }, section);
      }
      const activeOverlay = overlay;
      activeOverlay.setAttribute('aria-label', section);
      const contentRoot = activeOverlay.querySelector<HTMLElement>('.feature-content');
      if (contentRoot) await loadSection(contentRoot, user, role, section);
    } else if (smartAction === 'notifications' && !target.closest('#student-smart-root')) {
      root.querySelector<HTMLButtonElement>('#student-smart-root [data-smart="notifications"]')?.click();
    } else if (action === 'logout') {
      cleanupDashboard();
      const { logout } = await import('../auth/auth.service');
      await logout();
    } else if (action === 'theme') toggleTheme();
  };
  root.addEventListener('click', onClick, { signal: dashboardController.signal });
}

export function cleanupDashboard() {
  dashboardController?.abort();
  sectionController?.abort();
  dashboardController = null;
  sectionController = null;
}
