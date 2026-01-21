import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'

/**
 * 文章背景图
 */
export default function PostHero({ post, siteInfo }) {
  // 🔥 补上封面（和 BlogPostCard 一样）
  if (post && !post.pageCoverThumbnail) {
    post.pageCoverThumbnail = siteInfo?.pageCover
  }

  const headerImage = post?.pageCoverThumbnail
  const title = post?.title

  return (
    <div
      id='header'
      className='relative w-full bg-black flex justify-center items-start py-24'
    >
      {/* 文本层 */}
      <div className='z-20 flex flex-col items-center text-center px-4'>
        <div className='leading-snug font-bold text-4xl md:text-5xl text-white drop-shadow-lg'>
          {siteConfig('POST_TITLE_ICON') && <NotionIcon icon={post?.pageIcon} />}
          {title}
        </div>

        {post.summary && (
          <p className='mt-4 text-lg text-gray-200 max-w-3xl leading-relaxed'>
            {post.summary}
          </p>
        )}
      </div>

      {/* 背景图 */}
      {headerImage && (
        <LazyImage
          alt={title}
          src={headerImage}
          className='pointer-events-none select-none absolute inset-0 w-full h-full object-cover opacity-40'
          placeholder='blur'
          blurDataURL={siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')}
        />
      )}
    </div>

  )
}
