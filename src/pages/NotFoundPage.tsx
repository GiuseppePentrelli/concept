import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';

export function NotFoundPage() {
  return (
    <div className="pb-24">
      <PageHeader eyebrow="Errore 404" title="Pagina non trovata">
        Questo concetto non esiste, o non esiste ancora.
      </PageHeader>
      <div className="flex justify-center">
        <Link to="/" className="btn btn-outline">
          Torna alla home
        </Link>
      </div>
    </div>
  );
}
