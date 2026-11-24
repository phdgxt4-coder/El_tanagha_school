import './styles.css';
import { firebaseReady, app } from './firebase/app';
import { applyTheme } from './utils/theme';

const root = document.querySelector<HTMLElement>('#app')!;
applyTheme((localStorage.getItem('tanagha-theme') as 'light' | 'dark' | null) ?? 'light');

async function start() {
  if (!firebaseReady || !app) {
    root.innerHTML = `<section class="auth-card"><img src="./assets/images/logo.jpg" class="logo big" loading="eager" alt="شعار المدرسة"><h1>إعداد Firebase مطلوب</h1><p class="muted">أنشئ .env.local اعتمادًا على .env.example. لن يتم وضع أي Secret في الواجهة.</p></section>`;
    return;
  }
  const [{ observeAuth }, { renderLogin }] = await Promise.all([import('./auth/auth.service'), import('./pages/login.page')]);
  let cleanup: () => void = () => undefined;
  const unsubscribe = observeAuth(async (user) => {
    if (!user) { cleanup(); renderLogin(root, () => undefined); return; }
    const { renderDashboard, cleanupDashboard } = await import('./pages/dashboard.page');
    cleanup = cleanupDashboard;
    try { await renderDashboard(root, user); } catch (error) { root.innerHTML = `<section class="auth-card"><h1>تعذر فتح لوحة التحكم</h1><p class="error">${error instanceof Error ? error.message : 'خطأ غير معروف'}</p></section>`; }
  });
  window.addEventListener('pagehide', unsubscribe, { once: true });
}
void start();
