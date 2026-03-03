import { notFound } from 'next/navigation';
import { getLecture, getAllSlugs } from '../../../lib/lectures';
import LectureMeta from '../../../components/LectureMeta';
import LectureNav from '../../../components/LectureNav';
import TableOfContents from '../../../components/TableOfContents';
import LectureToolbar from '../../../components/LectureToolbar';
import AnnotatedContent from '../../../components/AnnotatedContent';

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const lecture = getLecture(params.slug);
  if (!lecture) return {};
  return {
    title: `المجلس ${lecture.ordinal} — اسم السلسلة`,
  };
}

export default function LecturePage({ params }) {
  const lecture = getLecture(params.slug);

  if (!lecture) {
    notFound();
  }

  return (
    <main className="main">
      <LectureMeta ordinal={lecture.ordinal} section={lecture.section} readingTime={lecture.readingTime} frontmatter={lecture.frontmatter} />

      <TableOfContents html={lecture.content} />

      <AnnotatedContent html={lecture.content} slug={lecture.slug} />

      <LectureNav prev={lecture.prev} next={lecture.next} />

      <LectureToolbar slug={lecture.slug} title={`المجلس ${lecture.ordinal} — اسم السلسلة`} />
    </main>
  );
}
