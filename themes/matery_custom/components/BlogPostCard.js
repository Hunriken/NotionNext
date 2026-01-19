import LazyImage from '@/components/LazyImage'
import NotionIcon from '@/components/NotionIcon'
import TwikooCommentCount from '@/components/TwikooCommentCount'
import { siteConfig } from '@/lib/config'
import { formatDateFmt } from '@/lib/utils/formatDate'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import TagItemMini from './TagItemMini'

/**
 * 博客列表：文章卡牌
 * @param {*} param0
 * @returns
 */
const BlogPostCard = ({ index, post, showSummary, siteInfo }) => {
  const showPreview =
    siteConfig('MATERY_POST_LIST_PREVIEW', null, CONFIG) && post.blockMap
  // matery 主题默认强制显示图片
  if (post && !post.pageCoverThumbnail) {
    post.pageCoverThumbnail = siteInfo?.pageCover
  }
  const showPageCover =
    siteConfig('MATERY_POST_LIST_COVER', null, CONFIG) &&
    post?.pageCoverThumbnail
  const delay = (index % 3) * 300

  return (
    <div
      data-aos='zoom-in'
      data-aos-duration='500'
      data-aos-delay={delay}
      data-aos-once='true'
      data-aos-anchor-placement='top-bottom'
      className='w-full mb-4 overflow-hidden shadow-md rounded-xl bg-gray-900 dark:bg-hexo-black-gray'>
      {/* 固定高度 ，空白用图片拉升填充 */}
      <header className='relative h-80 w-full overflow-hidden group'>
        {/* 背景图填满整个卡片 */}
        <LazyImage
          src={post?.pageCoverThumbnail}
          alt={post.title}
          className='absolute inset-0 w-full h-full object-cover transform duration-500 group-hover:scale-110 group-hover:brightness-130'
        />

        {/* 底部玻璃拟态信息层 */}
        <div
          className='absolute bottom-0 left-0 w-full p-4 z-20
                bg-black/30 backdrop-blur-md
                text-white space-y-2'>
          <h3 className='text-xl font-semibold break-words'>
            {siteConfig('POST_TITLE_ICON') && (
              <NotionIcon icon={post.pageIcon} />
            )}
            {post.title}
          </h3>
          {/* 白色分割线 */}
          <div className='border-t border-white/40 w-full my-1'></div>
          {(!showPreview || showSummary) && post.summary && (
            <p className='text-sm font-light leading-5 line-clamp-2'>
              {post.summary}
            </p>
          )}
        </div>
      </header>
    </div>
  )
}

export default BlogPostCard
