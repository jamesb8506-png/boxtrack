import { AppDataProvider } from './contexts/AppDataContext';
import { useRouter } from './hooks/useRouter';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { BoxersPage } from './pages/BoxersPage';
import { BoxerFormPage } from './pages/BoxerFormPage';
import { BoxerProfilePage } from './pages/BoxerProfilePage';
import { SkillsPage } from './pages/SkillsPage';
import { SkillDetailPage } from './pages/SkillDetailPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { TimerPage } from './pages/TimerPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import type { RouteName } from './types/route';

const TITLES: Record<RouteName, string> = {
  home: 'BoxTrack Coach',
  boxers: 'Boxeurs',
  'boxer-profile': 'Profil boxeur',
  'boxer-form': 'Boxeur',
  skills: 'Compétences',
  'skill-detail': 'Compétence',
  evaluate: 'Évaluation rapide',
  timer: 'Timer',
  history: 'Historique',
  settings: 'Réglages',
};

function AppContent() {
  const { route, navigate } = useRouter();

  const showBack = route.name === 'boxer-profile' || route.name === 'boxer-form' || route.name === 'skill-detail';

  function handleBack() {
    if (route.name === 'skill-detail' && route.boxerId) {
      navigate({ name: 'evaluate', boxerId: route.boxerId });
    } else if (route.name === 'skill-detail') {
      navigate({ name: 'skills' });
    } else if (route.name === 'boxer-form' && route.boxerId) {
      navigate({ name: 'boxer-profile', boxerId: route.boxerId });
    } else {
      navigate({ name: 'boxers' });
    }
  }

  return (
    <AppShell route={route} onNavigate={navigate} title={TITLES[route.name]} showBack={showBack} onBack={handleBack}>
      {route.name === 'home' && <HomePage onNavigate={navigate} />}
      {route.name === 'boxers' && <BoxersPage onNavigate={navigate} />}
      {route.name === 'boxer-form' && <BoxerFormPage boxerId={route.boxerId} onNavigate={navigate} />}
      {route.name === 'boxer-profile' && route.boxerId && <BoxerProfilePage boxerId={route.boxerId} onNavigate={navigate} />}
      {route.name === 'skills' && <SkillsPage boxerId={route.boxerId} onNavigate={navigate} />}
      {route.name === 'skill-detail' && route.skillId && (
        <SkillDetailPage skillId={route.skillId} boxerId={route.boxerId} onNavigate={navigate} />
      )}
      {route.name === 'evaluate' && <EvaluationPage boxerId={route.boxerId} onNavigate={navigate} />}
      {route.name === 'timer' && <TimerPage />}
      {route.name === 'history' && <HistoryPage boxerId={route.boxerId} onNavigate={navigate} />}
      {route.name === 'settings' && <SettingsPage />}
    </AppShell>
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <AppContent />
    </AppDataProvider>
  );
}
