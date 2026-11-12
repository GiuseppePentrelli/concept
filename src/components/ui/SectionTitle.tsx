interface Props {
  children: string;
  as?: 'h1' | 'h2';
}

export function SectionTitle({ children, as: Tag = 'h2' }: Props) {
  return (
    <div className="flex items-center justify-center gap-5 md:gap-10">
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-bone/60 md:w-[15%]" />
      <Tag
        className="font-serif text-[12px] font-medium uppercase tracking-[0.42em] text-bone md:text-[17px] md:tracking-[0.5em]"
        style={{ marginRight: '-0.42em' }}
      >
        {children}
      </Tag>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-bone/60 md:w-[15%]" />
    </div>
  );
}
