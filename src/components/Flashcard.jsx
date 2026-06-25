import { useEffect, useState } from 'react';

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Flashcard({ words }) {
  const [order, setOrder] = useState(() => words.map((_, i) => i));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setOrder(words.map((_, i) => i));
    setIndex(0);
    setFlipped(false);
  }, [words]);

  const word = words[order[index]];

  const go = (delta) => {
    setFlipped(false);
    setIndex((i) => (i + delta + order.length) % order.length);
  };

  const onShuffle = () => {
    setOrder((cur) => shuffle(cur));
    setIndex(0);
    setFlipped(false);
  };

  if (!word) return null;

  return (
    <div className="flex flex-col items-center">
      <p className="text-sm text-stone-500 mb-3">
        {index + 1} / {order.length}
      </p>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="w-full max-w-md h-64 rounded-2xl border border-stone-200 bg-white shadow-md flex flex-col items-center justify-center px-6 cursor-pointer select-none"
      >
        {!flipped ? (
          <>
            <span className="text-3xl font-bold text-stone-900">{word.ja}</span>
            {word.kana && <span className="text-lg text-rose-600 mt-3">{word.kana}</span>}
            <span className="text-xs text-stone-400 mt-6">{word.categoryVi} · nhấn để lật</span>
          </>
        ) : (
          <>
            <span className="text-2xl font-semibold text-stone-900">{word.vi}</span>
            <span className="text-sm text-stone-500 mt-2">{word.en}</span>
            {word.notes && <span className="text-xs text-stone-400 mt-3 italic text-center">{word.notes}</span>}
          </>
        )}
      </button>

      <div className="flex gap-3 mt-5">
        <button
          onClick={() => go(-1)}
          className="px-4 py-2 rounded-lg border border-stone-300 text-sm hover:border-rose-400 hover:text-rose-600"
        >
          ← Trước
        </button>
        <button
          onClick={onShuffle}
          className="px-4 py-2 rounded-lg border border-stone-300 text-sm hover:border-rose-400 hover:text-rose-600"
        >
          🔀 Xáo trộn
        </button>
        <button
          onClick={() => go(1)}
          className="px-4 py-2 rounded-lg border border-stone-300 text-sm hover:border-rose-400 hover:text-rose-600"
        >
          Tiếp →
        </button>
      </div>
    </div>
  );
}
