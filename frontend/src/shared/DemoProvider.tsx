import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Draft } from '../features/activity-creation/model';
import { completeActivity, ownsOutfit, progression, type Completion } from '../features/xp/progression';

function useDemoState() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [completed, setCompleted] = useState<Completion[]>([]);
  const [outfit, setOutfit] = useState('Campus Hoodie');
  const [messages, setMessages] = useState(['Campus: Welcome to the Alumable Campus Hub.', 'Priya (demo): Anyone joining the Portfolio Sprint?']);
  const [resetVersion, setResetVersion] = useState(0);
  function reset() {
    setDrafts([]); setCompleted([]); setOutfit('Campus Hoodie');
    setMessages(['Campus: Welcome to the Alumable Campus Hub.']);
    setResetVersion(value => value + 1);
  }
  return {
    drafts, addDraft: (draft: Draft) => setDrafts(previous => [...previous, draft]),
    completed, complete: (id: Completion) => setCompleted(previous => completeActivity(previous, id)),
    ...progression(completed), outfit,
    equip: (name: string) => { if (ownsOutfit(name, completed)) setOutfit(name); },
    messages, sendMessage: (message: string) => { if (message.trim()) setMessages(previous => [...previous.slice(-49), 'You: ' + message.trim().slice(0, 500)]); },
    reset, resetVersion,
  };
}
const DemoContext = createContext<ReturnType<typeof useDemoState> | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const value = useDemoState();
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}
export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error('DemoProvider is required');
  return value;
}
