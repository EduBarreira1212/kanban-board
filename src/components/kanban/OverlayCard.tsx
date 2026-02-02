type OverlayCardProps = {
  title: string;
};

export default function OverlayCard({ title }: OverlayCardProps) {
  return (
    <div className="w-[320px] rounded-2xl border border-slate-600/60 bg-slate-800 p-3 text-slate-100 shadow-lg">
      <p className="text-sm leading-snug">{title}</p>
      <p className="mt-2 text-xs text-slate-400">arrastando...</p>
    </div>
  );
}
