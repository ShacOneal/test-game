export default function Board() {
  return (
    <div className="grid grid-cols-3 gap-4 rounded-2xl bg-white p-6 shadow-2xl">
      <div className="h-20 w-20 rounded-lg bg-red-500 shadow-inner"></div>
      <div className="h-20 w-20 rounded-lg bg-blue-500 shadow-inner"></div>
      <div className="h-20 w-20 rounded-lg bg-green-500 shadow-inner"></div>
      <div className="h-20 w-20 rounded-lg bg-yellow-400 shadow-inner"></div>
      <div className="col-span-2 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100">
        <span className="font-bold tracking-widest text-gray-400">LUDO</span>
      </div>
    </div>
  );
}
