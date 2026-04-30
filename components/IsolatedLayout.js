import NotionPage from '@/components/NotionPage'

export default function IsolatedLayout({ post }) {
  return (
    <div className="max-w-3xl mx-auto py-10 px-6">
      <article>
        <NotionPage post={post} />
      </article>
    </div>
  )
}
