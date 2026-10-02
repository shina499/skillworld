import React, { useState } from 'react';
import { X, Copy, Check, Database, ExternalLink, ShieldCheck, Terminal, UploadCloud } from 'lucide-react';
import { gardenDb } from '../../lib/supabase/client';
import schemaSql from '../../lib/supabase/schema.sql?raw';

interface SupabaseSqlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSqlModal: React.FC<SupabaseSqlModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(schemaSql);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = schemaSql;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handlePushData = async () => {
    setIsPushing(true);
    setPushStatus('Connecting to Supabase and uploading garden rows...');
    try {
      const res = await gardenDb.syncAllLocalToRemote();
      setPushStatus(res.message);
    } catch (e: any) {
      setPushStatus(e.message || 'Error pushing rows to Supabase');
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Supabase Ready
                </span>
                <span className="text-xs text-stone-500 font-medium">PostgreSQL DDL & Seed</span>
              </div>
              <h3 className="text-lg font-black text-stone-900">
                Supabase SQL Setup Script
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePushData}
              disabled={isPushing}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm disabled:opacity-50"
              title="Push local quests and skills directly into Supabase tables"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isPushing ? 'Pushing...' : 'Push Local Rows to Supabase'}</span>
            </button>

            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-sm ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-200/60 text-stone-400 hover:text-stone-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {pushStatus && (
          <div className="px-6 py-2.5 bg-purple-50 border-b border-purple-200 text-purple-900 text-xs font-semibold">
            {pushStatus}
          </div>
        )}

        {/* Instructions banner */}
        <div className="px-6 py-3 bg-stone-50 border-b border-stone-200 text-xs text-stone-600 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>How to run:</strong> In your{' '}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 underline font-semibold inline-flex items-center gap-0.5"
              >
                Supabase Dashboard <ExternalLink className="w-3 h-3" />
              </a>
              , go to <strong>SQL Editor</strong> &rarr; <strong>New Query</strong> &rarr; Paste & click <strong>Run</strong>.
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            Row Level Security (RLS) Included
          </span>
        </div>

        {/* Code viewer */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 bg-stone-950 font-mono text-xs text-emerald-300 leading-relaxed selection:bg-emerald-800 selection:text-white">
          <pre className="whitespace-pre-wrap">{schemaSql}</pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Schema verified with flexible TEXT primary keys, full major seed questions, and non-blocking RLS policies.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
