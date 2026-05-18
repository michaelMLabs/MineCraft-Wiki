import { getServers } from '@/data/servers';
import { t, type Locale } from '@/lib/i18n';
import { ServerCard } from './ServerCard';

export function ServersSection({ locale }: { locale: Locale }) {
  const servers = getServers();

  return (
    <section id="section-servers" className="mt-20 scroll-mt-24">
      <header className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tightest text-white md:text-4xl
                         [.light_&]:text-zinc-900">
            {t(locale, 'servers.title')}
          </h2>
          <p className="mt-2 text-sm text-zinc-400 md:text-base [.light_&]:text-zinc-600">
            {t(locale, 'servers.description')}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {servers.map((server, i) => (
          <ServerCard key={server.ip} locale={locale} server={server} index={i} />
        ))}
      </div>
    </section>
  );
}
