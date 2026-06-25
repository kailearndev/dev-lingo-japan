import { useMemo, useState } from 'react';
import { categories } from './data/vocab';
import WordCard from './components/WordCard';
import Flashcard from './components/Flashcard';
import StudyPlan from './components/StudyPlan';

const allWords = categories.flatMap((cat) =>
  cat.words.map((w) => ({ ...w, categoryId: cat.id, categoryVi: cat.vi, categoryEn: cat.en })),
);

function VocabPage() {
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [mode, setMode] = useState('list');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allWords.filter((w) => {
      if (categoryId !== 'all' && w.categoryId !== categoryId) return false;
      if (!q) return true;
      return (
        w.ja.toLowerCase().includes(q) ||
        w.kana.toLowerCase().includes(q) ||
        w.en.toLowerCase().includes(q) ||
        w.vi.toLowerCase().includes(q)
      );
    });
  }, [query, categoryId]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo kanji, hiragana, tiếng Việt hoặc tiếng Anh..."
          className="w-full sm:max-w-sm rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
        />

        <div className="flex gap-1 rounded-lg bg-stone-200 p-1 self-start">
          <button
            onClick={() => setMode('list')}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition ${
              mode === 'list' ? 'bg-white shadow text-rose-700' : 'text-stone-600'
            }`}
          >
            Danh sách
          </button>
          <button
            onClick={() => setMode('flashcard')}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition ${
              mode === 'flashcard' ? 'bg-white shadow text-rose-700' : 'text-stone-600'
            }`}
          >
            Flashcard
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setCategoryId('all')}
          className={`px-3 py-1 text-xs sm:text-sm rounded-full border transition ${
            categoryId === 'all'
              ? 'bg-rose-600 text-white border-rose-600'
              : 'bg-white text-stone-600 border-stone-300 hover:border-rose-400'
          }`}
        >
          Tất cả ({allWords.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryId(cat.id)}
            className={`px-3 py-1 text-xs sm:text-sm rounded-full border transition ${
              categoryId === cat.id
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-stone-600 border-stone-300 hover:border-rose-400'
            }`}
          >
            {cat.vi} ({cat.words.length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-stone-400 py-16">Không tìm thấy từ nào phù hợp.</p>
      ) : mode === 'list' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((w, i) => (
            <WordCard key={`${w.categoryId}-${i}`} word={w} />
          ))}
        </div>
      ) : (
        <Flashcard words={filtered} />
      )}
    </>
  );
}

const NAV = [
  { id: 'vocab', label: '単語帳　Từ vựng' },
  { id: 'plan', label: '学習計画　Lộ trình học' },
];

export default function App() {
  const [page, setPage] = useState('vocab');

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 pt-5 pb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-rose-700">
            日本語デブ用語 <span className="text-stone-400">×</span> Tiếng Việt
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Hán tự · Hiragana · Nghĩa tiếng Việt · Mẫu câu hội thoại công việc
            <span className="ml-1 text-stone-400">
              (nguồn:{' '}
              <a
                href="https://github.com/Wizcorp/japanese-dev-lingo"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-rose-600"
              >
                Wizcorp/japanese-dev-lingo
              </a>
              )
            </span>
          </p>

          <nav className="flex gap-1 mt-4">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => setPage(n.id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition -mb-px ${
                  page === n.id
                    ? 'border-rose-600 text-rose-700'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {page === 'vocab' ? <VocabPage /> : <StudyPlan />}
      </main>

      <footer className="text-center text-xs text-stone-400 py-8">
        Dữ liệu gốc từ Wizcorp japanese-dev-lingo · Dịch tiếng Việt + lộ trình học cho dev
      </footer>
    </div>
  );
}
