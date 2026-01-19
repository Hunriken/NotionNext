import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'

/**
 * 文章背景图
 */
export default function PostHero({ post, siteInfo }) {
  const headerImage = post?.pageCoverThumbnail
    ? post?.pageCoverThumbnail
    : siteInfo?.pageCover
  const title = post?.title
  return (
    <div
      id='header'
      className='flex h-[40rem] justify-center align-middle items-center w-full relative bg-black'>
      {/* 文本层 */}
      <div className='z-20 flex flex-col items-center text-center px-4'>
        {/* 标题 */}
        <div className='leading-snug font-bold text-4xl md:text-5xl text-white drop-shadow-lg'>
          {siteConfig('POST_TITLE_ICON') && (
            <NotionIcon icon={post?.pageIcon} />
          )}
          {title}
        </div>

        {/* 自动拉取 Notion summary 的描述文本 */}
        {post.summary && (
          <p className='mt-4 text-lg text-gray-200 max-w-3xl leading-relaxed'>
            {post.summary}
          </p>
        )}
      </div>

      <LazyImage
        alt={title}
        src={headerImage}
        className='pointer-events-none select-none w-full h-full object-cover opacity-30 absolute'
        placeholder='blur'
        blurDataURL={siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')}
      />
    </div>
  )
}
