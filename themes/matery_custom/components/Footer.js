import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import { siteConfig } from '@/lib/config'

const Footer = ({ title }) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const copyright =
    Number.isInteger(siteConfig('SINCE')) && siteConfig('SINCE') < currentYear
      ? `${siteConfig('SINCE')}-${currentYear}`
      : currentYear

  return (
    <footer
      className='
      relative z-10 w-full flex flex-col items-center text-center
      text-sm text-white dark:text-gray-100
      py-5 mt-5
      backdrop-blur-xl bg-white/10 dark:bg-black/20
      border-t border-white/20 dark:border-white/10
    '>
    

      {/* 第二行：微信 icon | 邮箱 */}
      <div className='flex items-center justify-center gap-6 mt-0 text-gray-200'>
        <div className='relative group cursor-pointer'>
          {/* 微信 icon */}
          <i className='fab fa-weixin text-3xl'></i>

          {/* 悬浮二维码（带黑底） */}
          <div
            className='absolute left-1/2 -translate-x-1/2 -top-[320px] z-50 w-[300px] h-[300px] bg-black/70  backdrop-blur-xl rounded-xl shadow-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none '
          >
            <img
              src='/images/wechat.png'
              alt='wechat qr'
              className='h-full w-auto object-contain'
            />
          </div>
        </div>

        {/* 分隔符 | */}
        <span className='text-2xl text-gray-400 select-none'>|</span>

        {/* 邮箱（点击打开邮件） */}
        <a
          href='mailto:HJ@gmail.com'
          className='text-lg hover:text-white transition'>
          hunriken@gmail.com
        </a>
      </div>
    </footer>
  )
}

export default Footer
