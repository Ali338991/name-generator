import Generator from '@/components/Generator';
import Verifier from '@/components/Verifier';

export default function Home() {
  return (
    <main className="max-w-[1200px] mx-auto py-16 px-8 flex flex-col gap-16">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold mx-auto leading-tight bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent w-fit">
          Name Forge
        </h1>
        <p className="text-slate-400 text-xl mt-4">
          Generate. Verify. Iterate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Generator />
        <Verifier />
      </div>
    </main>
  );
}
