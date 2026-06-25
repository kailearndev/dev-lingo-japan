import { useState } from 'react';
import { studyPlan } from '../data/studyPlan';
import DailyVocab from './DailyVocab';

function GrammarCard({ g }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-stone-100 bg-stone-50">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-4 py-3 flex items-start justify-between gap-3"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-rose-700">{g.pattern}</p>
          <p className="text-xs text-stone-500 mt-0.5">{g.kana}</p>
          <p className="text-xs text-stone-700 mt-1">{g.vi}</p>
        </div>
        <span className="text-stone-400 mt-1 shrink-0">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-stone-200 px-4 py-3 bg-white rounded-b-lg">
          <p className="text-xs font-medium text-stone-500 mb-2">Ví dụ:</p>
          <p className="text-sm font-medium text-stone-900">{g.example.ja}</p>
          <p className="text-xs text-rose-600 mt-1">{g.example.kana}</p>
          <p className="text-xs text-stone-600 mt-1 italic">{g.example.vi}</p>
        </div>
      )}
    </div>
  );
}

function GrammarDayCard({ plan, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className={`rounded-xl border transition-all ${
        open ? 'border-rose-300 bg-white shadow-md' : 'border-stone-200 bg-white'
      }`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left px-5 py-4 flex items-center gap-4"
      >
        <span
          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
            open ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-600'
          }`}
        >
          {plan.day}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-stone-900 leading-tight">{plan.titleVi}</p>
          <p className="text-xs text-stone-500 mt-0.5">
            {plan.titleJa} · {plan.theme}
          </p>
        </div>
        <span className="text-stone-400 shrink-0">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="border-t border-stone-100 px-5 pb-5 pt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2">
              <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs">単語</span>
              Từ vựng trong ngày
            </h3>
            <div className="space-y-1">
              {plan.vocab.map((w, i) => (
                <div
                  key={i}
                  className="flex items-baseline gap-3 py-2 border-b border-stone-100 last:border-0"
                >
                  <span className="font-semibold text-stone-900 text-sm min-w-[90px]">{w.ja}</span>
                  {w.kana && (
                    <span className="text-xs text-rose-600 min-w-[80px]">{w.kana}</span>
                  )}
                  <span className="text-xs text-stone-600">{w.vi}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs">文法</span>
              Mẫu câu hội thoại
            </h3>
            <div className="space-y-2">
              {plan.grammar.map((g, i) => (
                <GrammarCard key={i} g={g} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KaiwaSection() {
  const totalGrammar = studyPlan.reduce((s, d) => s + d.grammar.length, 0);
  const totalVocab = studyPlan.reduce((s, d) => s + d.vocab.length, 0);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-center">
          <p className="font-bold text-rose-700 text-xl">{studyPlan.length}</p>
          <p className="text-xs text-rose-600 mt-0.5">tình huống</p>
        </div>
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-center">
          <p className="font-bold text-amber-700 text-xl">{totalGrammar}</p>
          <p className="text-xs text-amber-600 mt-0.5">mẫu câu kaiwa</p>
        </div>
        <div className="rounded-lg bg-stone-100 border border-stone-200 px-4 py-3 text-center">
          <p className="font-bold text-stone-700 text-xl">{totalVocab}</p>
          <p className="text-xs text-stone-600 mt-0.5">từ vựng kèm</p>
        </div>
        <div className="flex-1 min-w-[180px] rounded-lg bg-green-50 border border-green-200 px-4 py-3">
          <p className="text-xs text-green-700 font-medium">Cách dùng</p>
          <p className="text-xs text-green-600 mt-0.5">
            Mỗi ngày chọn 1 tình huống → học mẫu câu → nhấn ▼ để xem ví dụ → luyện nói với đồng nghiệp
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {studyPlan.map((plan, i) => (
          <GrammarDayCard key={plan.day} plan={plan} defaultOpen={i === 0} />
        ))}
      </div>
    </div>
  );
}

const SUB_TABS = [
  { id: 'vocab', label: '📅 Từ vựng hàng ngày', sub: '10 từ / ngày · tự động theo lịch' },
  { id: 'kaiwa', label: '💬 Ngữ pháp Kaiwa', sub: '14 tình huống công việc' },
];

export default function StudyPlan() {
  const [subTab, setSubTab] = useState('vocab');

  return (
    <div>
      {/* Sub-tab navigation */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`flex flex-col items-start px-4 py-3 rounded-xl border transition text-left ${
              subTab === t.id
                ? 'border-rose-400 bg-rose-50 shadow-sm'
                : 'border-stone-200 bg-white hover:border-rose-300'
            }`}
          >
            <span
              className={`text-sm font-semibold ${
                subTab === t.id ? 'text-rose-700' : 'text-stone-700'
              }`}
            >
              {t.label}
            </span>
            <span className="text-xs text-stone-400 mt-0.5">{t.sub}</span>
          </button>
        ))}
      </div>

      {subTab === 'vocab' ? <DailyVocab /> : <KaiwaSection />}
    </div>
  );
}
