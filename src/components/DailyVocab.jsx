import { useEffect, useMemo, useState } from 'react';
import { categories } from '../data/vocab';

const WORDS_PER_DAY = 10;

const allWords = categories.flatMap((cat) =>
  cat.words.map((w) => ({ ...w, categoryVi: cat.vi }))
);

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const days = chunk(allWords, WORDS_PER_DAY);

export default function DailyVocab() {
  const [startDate, setStartDate] = useState(
    () => localStorage.getItem('vocabStartDate') || null,
  );
  const [openDay, setOpenDay] = useState(null);

  const todayIndex = useMemo(() => {
    if (!startDate) return null;
    const diff = Math.floor(
      (Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.min(diff, days.length - 1);
  }, [startDate]);

  // Auto-open today on first load when startDate exists
  useEffect(() => {
    if (todayIndex !== null && openDay === null) {
      setOpenDay(todayIndex);
      // Scroll after render
      setTimeout(() => {
        document.getElementById(`day-${todayIndex}`)?.scrollIntoView({
          behavior: 'smooth', block: 'start',
        });
      }, 100);
    }
  }, [todayIndex]);

  const toggle = (i) => setOpenDay((prev) => (prev === i ? null : i));

  const handleStart = () => {
    const d = new Date().toISOString().split('T')[0];
    localStorage.setItem('vocabStartDate', d);
    setStartDate(d);
    setOpenDay(0);
  };

  const handleReset = () => {
    localStorage.removeItem('vocabStartDate');
    setStartDate(null);
    setOpenDay(null);
  };

  const doneCount = todayIndex !== null ? todayIndex + 1 : 0;

  return (
    <div>
      {/* Stats row */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-center">
          <p className="font-bold text-rose-700 text-xl">{days.length}</p>
          <p className="text-xs text-rose-600 mt-0.5">ngày học</p>
        </div>
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-center">
          <p className="font-bold text-amber-700 text-xl">{WORDS_PER_DAY}</p>
          <p className="text-xs text-amber-600 mt-0.5">từ / ngày</p>
        </div>
        <div className="rounded-lg bg-stone-100 border border-stone-200 px-4 py-3 text-center">
          <p className="font-bold text-stone-700 text-xl">{allWords.length}</p>
          <p className="text-xs text-stone-600 mt-0.5">tổng số từ</p>
        </div>

        {!startDate ? (
          <div className="flex-1 min-w-[200px] rounded-lg border border-dashed border-rose-300 bg-rose-50 px-4 py-3 flex items-center justify-between gap-3">
            <p className="text-xs text-stone-600">
              Bắt đầu để hệ thống đánh dấu tiến độ học hàng ngày
            </p>
            <button
              onClick={handleStart}
              className="shrink-0 px-4 py-1.5 rounded-full bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition"
            >
              Bắt đầu hôm nay
            </button>
          </div>
        ) : (
          <div className="flex-1 min-w-[200px] rounded-lg bg-green-50 border border-green-200 px-4 py-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold text-green-700">
                Tiến độ · Ngày {todayIndex + 1}/{days.length}
              </p>
              <button
                onClick={handleReset}
                className="text-xs text-stone-400 hover:text-rose-500"
              >
                Reset
              </button>
            </div>
            <div className="bg-white rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.round((doneCount / days.length) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-green-600 mt-1">
              {doneCount * WORDS_PER_DAY} / {allWords.length} từ đã học
            </p>
          </div>
        )}
      </div>

      {/* Day list */}
      <div className="space-y-2.5">
        {days.map((words, i) => {
          const isToday = todayIndex === i;
          const isPast = todayIndex !== null && i < todayIndex;
          const isOpen = openDay === i;

          const firstCat = words[0].categoryVi;
          const lastCat = words[words.length - 1].categoryVi;
          const catLabel =
            firstCat === lastCat ? firstCat : `${firstCat} → ${lastCat}`;
          const preview = words
            .slice(0, 4)
            .map((w) => w.ja.split('/')[0].split('（')[0].trim())
            .join('・');

          return (
            <div
              key={i}
              id={`day-${i}`}
              className={`rounded-xl border transition-all ${
                isToday
                  ? 'border-rose-400 shadow-md bg-white'
                  : isPast
                  ? 'border-green-200 bg-green-50/40'
                  : 'border-stone-200 bg-white'
              }`}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full text-left px-4 py-3.5 flex items-center gap-3"
              >
                {/* Day circle */}
                <span
                  className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                    isToday
                      ? 'bg-rose-600 text-white'
                      : isPast
                      ? 'bg-green-500 text-white'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {isPast ? '✓' : i + 1}
                </span>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-stone-900">
                      Ngày {i + 1}
                    </span>
                    {isToday && (
                      <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-medium">
                        Hôm nay
                      </span>
                    )}
                    <span className="text-xs text-stone-400">{catLabel}</span>
                  </div>
                  <p className="text-xs text-stone-400 mt-0.5 truncate">
                    {preview}… · {words.length} từ
                  </p>
                </div>

                <span className="text-stone-400 shrink-0 text-xs">{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div className="border-t border-stone-100 px-4 pb-4 pt-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                    {words.map((w, j) => (
                      <div
                        key={j}
                        className="flex items-baseline gap-2 py-2 border-b border-stone-100 last:border-0"
                      >
                        <span className="font-semibold text-stone-900 text-sm w-[110px] shrink-0 truncate">
                          {w.ja}
                        </span>
                        {w.kana ? (
                          <span className="text-xs text-rose-500 w-[80px] shrink-0">
                            {w.kana}
                          </span>
                        ) : (
                          <span className="w-[80px] shrink-0" />
                        )}
                        <span className="text-xs text-stone-600 flex-1">{w.vi}</span>
                      </div>
                    ))}
                  </div>

                  {/* Mini flashcard prompt */}
                  <p className="text-xs text-stone-400 mt-3 text-center">
                    Học xong? Thử chuyển sang{' '}
                    <span className="font-medium text-stone-500">Flashcard</span> ở tab Từ vựng
                    để luyện tập nhé.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
