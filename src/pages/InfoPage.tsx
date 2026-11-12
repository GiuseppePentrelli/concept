import { useParams } from 'react-router-dom';
import { INFO_PAGES } from '../data/site';
import { PageHeader } from '../components/ui/PageHeader';
import { NotFoundPage } from './NotFoundPage';

export function InfoPage() {
  const { slug = '' } = useParams();
  const page = INFO_PAGES[slug];
  if (!page) return <NotFoundPage />;

  return (
    <>
      <PageHeader eyebrow="Concept" title={page.title} />
      <div className="shell pb-24">
        <div className="mx-auto max-w-[640px]">
          <p className="label mb-7 inline-block border border-line px-4 py-3 !text-[10px] text-ash">
            Contenuto dimostrativo — non è un testo approvato
          </p>
          <div className="space-y-5 text-[15.5px] leading-[1.75] text-bone/80">
            {page.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
