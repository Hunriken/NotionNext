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
          className='h-8 w-auto hover:scale-110 transform duration-200'
        />
      </div>
    </SmartLink>
  )
}
export default Logo
