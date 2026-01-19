// import Image from 'next/image'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

let wrapperTop = 0

/**
 * 首页英雄区
 * 是一张大图，带个居中按钮
 * @returns 头图
 */
const Hero = props => {
  const [typed, changeType] = useState()
  const { siteInfo } = props
  const { locale } = useGlobal()
  const GREETING_WORDS = siteConfig('GREETING_WORDS').split(',')
  useEffect(() => {
    updateHeaderHeight()
    if (!typed && window && document.getElementById('typed')) {
      loadExternalResource('/js/typed.min.js', 'js').then(() => {
        if (window.Typed) {
          changeType(
            new window.Typed('#typed', {
              strings: GREETING_WORDS,
              typeSpeed: 60,
              backSpeed: 30,
              backDelay: 600,
              showCursor: true,
              smartBackspace: true
            })
          )
        }
      })
    }

    window.addEventListener('resize', updateHeaderHeight)
    return () => {
      window.removeEventListener('resize', updateHeaderHeight)
    }
  }, [])

  function updateHeaderHeight() {
    requestAnimationFrame(() => {
      const wrapperElement = document.getElementById('wrapper')
      wrapperTop = wrapperElement?.offsetTop
    })
  }

  return (
    <header
      id='header'
      style={{ zIndex: 1 }}
      className=' w-full h-screen relative bg-black'>
      <div className='text-white absolute flex flex-col h-full items-center justify-center w-full '>
        {/* 站点标题 */}
        <div className='text-6xl md:text-8xl z-20 '>
          {siteInfo?.title || siteConfig('TITLE')}
        </div>
        {/* 站点欢迎语 */}
        <div className='mt-4 h-16 items-center text-center z-20 text-white text-lg'>
          <span id='typed' />
        </div>
        {/* 滚动按钮 */}
        <div
          onClick={() => {
            window.scrollTo({ top: wrapperTop, behavior: 'smooth' })
          }}
          className='relative mt-12 cursor-pointer w-40 text-center pt-4 pb-3 text-md text-white rounded-3xl z-40 border bg-white/10 backdrop-blur-md hover:bg-white hover:text-black duration-300'>
          {/* 内容层 */}
          <span className='relative z-10 flex items-center justify-center gap-2'>
            <i className='fas fa-angle-double-down' />
            <span>
              {siteConfig('MATERY_SHOW_START_READING', null, CONFIG) &&
                locale.COMMON.START_READING}
            </span>
          </span>
        </div>
      </div>

      {/* <LazyImage
        priority={true}
        id='header-cover'
        src={siteInfo?.pageCover}
        className={`header-cover object-center w-full h-screen object-cover ${siteConfig('MATERY_HOME_NAV_BACKGROUND_IMG_FIXED', null, CONFIG) ? 'fixed' : ''}`}
      />
        */}
      {/* 视频背景层 */}
      <video
        className='absolute top-0 left-0 w-full h-full object-cover z-0'
        src='/videos/hero.mp4'
        autoPlay
        loop
        muted
        playsInline
      />
      <img
        src='/images/noise.jpg'
        className='absolute inset-0 w-full h-full object-cover z-10 opacity-100 mix-blend-screen pointer-events-none'
      />

      {/* 可选：保留原来的渐变遮罩，让文字更清晰 */}
      <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/10 to-black/30 z-10'></div>
    </header>
  )
}

export default Hero
