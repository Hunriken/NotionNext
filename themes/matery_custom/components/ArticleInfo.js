import SmartLink from '@/components/SmartLink'
import { useGlobal } from '@/lib/global'
import TagItemMiddle from './TagItemMiddle'
import { formatDateFmt } from '@/lib/utils/formatDate'

export const ArticleInfo = props => {
  const { post } = props
  const { locale } = useGlobal()

  return (
    <section className='mb-3 dark:text-gray-100'>
      {post?.type === 'Post' && (
        <div className='flex justify-between items-center flex-wrap text-sm my-3 py-3 px-1'>
          {/* 左侧标签 */}
          <div className='flex flex-nowrap overflow-x-auto gap-2'>
            {post.tagItems?.map(tag => (
              <div
                key={tag.name}
                className='px-3 py-1 rounded-xl bg-black/70 whitespace-nowrap text-xs font-medium'>
                {tag.name}
              </div>
            ))}
          </div>

          {/* 右侧发布时间 */}
          <span className='whitespace-nowrap text-gray-500 dark:text-gray-400'>
            {formatDateFmt(post?.publishDate, 'yyyy-MM')}
          </span>
        </div>
      )}
    </section>
  )
}
