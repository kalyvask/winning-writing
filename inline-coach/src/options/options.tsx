// Options page. Stores the Anthropic API key in chrome.storage.local. The
// service worker reads it on every request. The key never leaves this
// browser except in the Anthropic API call itself.

import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { DEFAULT_SENDER_PROFILE, PROFILE_KEY } from '../lib/sender-profile';

const KEY_STORE = 'gmail-writing-coach.apikey';
const MODEL_STORE = 'gmail-writing-coach.model';
const PROFILE_MAX_CHARS = 6000;

const MODELS = [
  { id: 'claude-sonnet-4-6', label: 'Sonnet 4.6 (default)' },
  { id: 'claude-opus-4-8', label: 'Opus 4.8 (slower, higher quality)' },
  { id: 'claude-haiku-4-5-20251001', label: 'Haiku 4.5 (cheapest)' },
];

function Options() {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState(MODELS[0].id);
  const [profile, setProfile] = useState('');
  const [saved, setSaved] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    chrome.storage.local.get([KEY_STORE, MODEL_STORE, PROFILE_KEY]).then((r) => {
      setApiKey(r[KEY_STORE] ?? '');
      setModel(r[MODEL_STORE] ?? MODELS[0].id);
      setProfile(r[PROFILE_KEY] ?? '');
    });
  }, []);

  async function save() {
    setSaved('saving');
    await chrome.storage.local.set({
      [KEY_STORE]: apiKey,
      [MODEL_STORE]: model,
      [PROFILE_KEY]: profile.slice(0, PROFILE_MAX_CHARS),
    });
    setSaved('saved');
    setTimeout(() => setSaved('idle'), 1500);
  }

  return (
    <main className="max-w-xl mx-auto p-8 font-sans">
      <h1 className="text-2xl font-semibold text-gray-900">Writing Coach</h1>
      <p className="text-sm text-gray-600 mt-1">
        Inline coach for Gmail and LinkedIn compose. Your API key is stored locally in
        <code className="font-mono"> chrome.storage.local</code> and is never sent anywhere except
        <code className="font-mono"> api.anthropic.com</code>.
      </p>

      <section className="mt-6">
        <label className="block text-sm font-medium text-gray-800">Anthropic API key</label>
        <input
          type="password"
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded font-mono text-sm"
          placeholder="sk-ant-..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">
          Get one at{' '}
          <a className="text-blue-700 underline" href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">
            console.anthropic.com/settings/keys
          </a>
          .
        </p>
      </section>

      <section className="mt-4">
        <label className="block text-sm font-medium text-gray-800">Model</label>
        <select
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          {MODELS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Sonnet for the default critique. Opus when you want depth. Haiku for fast / cheap.
        </p>
      </section>

      <section className="mt-4">
        <label className="block text-sm font-medium text-gray-800">Sender profile</label>
        <textarea
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded font-mono text-xs"
          rows={12}
          placeholder={DEFAULT_SENDER_PROFILE}
          value={profile}
          maxLength={PROFILE_MAX_CHARS}
          onChange={(e) => setProfile(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">
          Who is sending. Used for connection angles and the higher-order critique. Same shape as
          <code className="font-mono"> context/about-me.md</code> in the repo. Stored locally only;
          {' '}{profile.length}/{PROFILE_MAX_CHARS} characters.
        </p>
      </section>

      <button
        onClick={save}
        disabled={saved !== 'idle'}
        className="mt-6 px-4 py-2 rounded bg-gray-900 text-white text-sm disabled:opacity-60"
      >
        {saved === 'saving' ? 'Saving...' : saved === 'saved' ? 'Saved' : 'Save'}
      </button>

      <hr className="my-8 border-gray-200" />

      <section className="text-xs text-gray-500 space-y-2">
        <p>
          <strong>What this sends:</strong> the compose body and recipient hints (To: field for Gmail, conversation
          title for LinkedIn). Nothing else.
        </p>
        <p>
          <strong>What this does not send:</strong> attachments, your inbox, your calendar, signed-in identity.
        </p>
        <p>
          <strong>Storage scopes:</strong> API key, model preference, and sender profile live in{' '}
          <code>chrome.storage.local</code>. They do not sync across devices.
        </p>
      </section>
    </main>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<Options />);
