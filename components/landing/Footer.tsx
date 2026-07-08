import Link from "next/link";
import { HeartPulse, Mail, Phone, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-navy-200">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
              <HeartPulse className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-white">SOINELY</span>
          </div>
          <p className="mt-3 text-sm">
            La bonne information, au bon moment, pour les infirmiers et infirmières libéraux.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Navigation</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li><Link href="/missions" className="hover:text-white">Missions</Link></li>
            <li><Link href="/hubs" className="hover:text-white">Thématiques</Link></li>
            <li><Link href="/cabinet" className="hover:text-white">Mon Cabinet</Link></li>
            <li><Link href="/assistant" className="hover:text-white">Assistant IA</Link></li>
            <li><Link href="/daily" className="hover:text-white">SOINELY Daily</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Informations</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li><Link href="#" className="hover:text-white">Mentions légales</Link></li>
            <li><Link href="#" className="hover:text-white">Confidentialité</Link></li>
            <li><Link href="#" className="hover:text-white">CGU</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Besoin d'aide ?</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> contact@soinely.fr
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> 01 23 45 67 89
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Lun. – Ven. 9h00 – 18h00
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-navy-400">
        © {new Date().getFullYear()} SOINELY. Tous droits réservés.
      </div>
    </footer>
  );
}
