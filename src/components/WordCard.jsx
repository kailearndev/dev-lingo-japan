export default function WordCard({ word }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-rose-300 transition">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-lg font-semibold text-stone-900">{word.ja}</span>
        <span className="text-[10px] uppercase tracking-wide text-stone-400">{word.categoryVi}</span>
      </div>
      {word.kana && <p className="text-sm text-rose-600 mt-0.5">{word.kana}</p>}
      <p className="text-sm text-stone-700 mt-2 font-medium">{word.vi}</p>
      <p className="text-xs text-stone-400 mt-0.5">{word.en}</p>
      {word.notes && <p className="text-xs text-stone-400 mt-2 italic">{word.notes}</p>}
    </div>
  );
}
