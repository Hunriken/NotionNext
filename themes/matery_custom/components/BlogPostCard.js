import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import SmartLink from '@/components/SmartLink'
import { useRef } from 'react'

const BlogPostCard = ({ index, post, showSummary, siteInfo }) => {
  const showPreview =
    siteConfig('MATERY_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap

  if (post && !post.pageCoverThumbnail) {
    post.pageCoverThumbnail = siteInfo?.pageCover
  }

  const delay = (index % 3) * 300

  // ⭐ 小丑牌 3D 视差
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    const rect = card.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * 2
    const rotateY = ((centerX - x) / centerX) * 2

    card.style.transform = `
      perspective(900px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.03)
    `
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    card.style.transform = `
      perspective(900px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `
  }

  return (
    <div
      data-aos='zoom-in'
      data-aos-duration='500'
      data-aos-delay={delay}
      data-aos-once='true'
      data-aos-anchor-placement='top-bottom'
      className='w-full mb-4'
    >
      {/* ⭐ SmartLink 包裹整个卡片，恢复点击跳转 */}
      <SmartLink href={post?.href} className='block' target="_blank" rel="noopener noreferrer">
        {/* ⭐ tilt + 缓动层 */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className='rounded-xl overflow-hidden will-change-transform transition-transform duration-100 ease-out'
        >
          <header className='relative h-[32rem] w-full overflow-hidden group'>
            <LazyImage
              src={post?.pageCoverThumbnail}
              alt={post.title}
              className='absolute inset-0 w-full h-full object-cover transform duration-500 group-hover:brightness-130'
            />

            <div className='absolute bottom-0 left-0 w-full p-4 z-20 bg-black/30 backdrop-blur-md text-white space-y-2'>
              <h3 className='text-xl font-semibold break-words'>
                {siteConfig('POST_TITLE_ICON') && (
                  <NotionIcon icon={post.pageIcon} />
                )}
                {post.title}
              </h3>

              <div className='border-t border-white/40 w-full my-1'></div>

              {(!showPreview || showSummary) && post.summary && (
                <p className='text-sm font-light leading-5 line-clamp-2'>
                  {post.summary}
                </p>
              )}
            </div>
          </header>
        </div>
      </SmartLink>
    </div>
  )
}

export default BlogPostCard
