import { siteConfig } from '@/lib/config'
import SmartLink from '@/components/SmartLink'
/**
 * 站点logo
 * 这里默认只支持纯文字
 * @param {*} props
 * @returns
 */
const Logo = props => {
  const { siteInfo } = props
  return (
    <SmartLink href='/' passHref legacyBehavior>
      <div className='flex flex-col justify-center items-center cursor-pointer space-y-3'>
        <img
          src='/images/logo.png'
          alt='浩平作品集'
          className='h-8 w-auto transform duration-300 hover: hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]'
        />
      </div>
    </SmartLink>
  )
}
export default Logo
