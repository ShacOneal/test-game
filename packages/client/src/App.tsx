import Board from './Board';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900 font-sans selection:bg-cyan-500 selection:text-white">
      <div className="mb-8 text-center">
        <h1 className="bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-5xl font-black tracking-tighter text-transparent">
          Monorepo Online
        </h1>
        <p className="mt-2 text-slate-400">Tailwind v4 is fully operational.</p>
      </div>

      <Board />
    </div>
  );
}
