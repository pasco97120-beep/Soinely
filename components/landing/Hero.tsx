import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-28 sm:pb-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-navy-500/30 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 pt-20 lg:grid-cols-2 lg:gap-12 lg:pt-28">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-primary-300">
            <Sparkles className="h-3.5 w-3.5" />
            Le réflexe des infirmiers libéraux
          </span>

          <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            La bonne information.
            <br />
            <span className="text-primary-400">Au bon moment.</span>
          </h1>

          <p className="mt-5 max-w-lg text-lg text-navy-200">
            Accédez en quelques secondes aux fiches pratiques, protocoles et outils indispensables pour
            des soins sûrs, efficaces et adaptés à chaque situation.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 font-medium text-white transition hover:bg-primary-600"
            >
              Entrer dans SOINELY
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#concept"
              className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 font-medium text-white transition hover:bg-white/5"
            >
              <PlayCircle className="h-4 w-4" />
              Découvrir le concept
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="relative mx-auto max-w-md overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
            <Image
              src="/images/hero-idel.png"
              alt="Infirmière libérale consultant SOINELY sur tablette"
              width={836}
              height={1024}
              priority
              className="h-auto w-full"
            />
          </div>

          <div className="mx-auto mt-8 max-w-xs rounded-lg border border-white/10 bg-white p-4 shadow-xl">
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success" />
              <p className="text-sm font-medium text-navy-900">
                Des contenus fiables, validés et régulièrement mis à jour
              </p>
            </div>
            <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
              <li>✓ Fiable</li>
              <li>✓ Actuel</li>
              <li>✓ Pratique</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
