import SideBarDrawer from '@/components/SideBarDrawer'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import throttle from 'lodash.throttle'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import CONFIG from '../config'
import CategoryGroup from './CategoryGroup'
import Logo from './Logo'
import { MenuListTop } from './MenuListTop'
import SearchButton from './SearchButton'
import SearchDrawer from './SearchDrawer'
import SideBar from './SideBar'
import TagGroups from './TagGroups'

let windowTop = 0

/**
 * 顶部导航(页头)
 * @param {*} param0
 * @returns
 */

const Header = props => {
  const menus = props?.customMenu || [] //提取resume
  const resumeButton = menus.find(m => m?.slug === 'resume') //提取resume
  const filteredMenus = menus.filter(m => m.slug !== 'resume') //简历移出menu区

  const { tags, currentTag, categories, currentCategory } = props
  const { locale } = useGlobal()
  const searchDrawer = useRef()
  const { isDarkMode } = useGlobal()
  const throttleMs = 200
  const showSearchButton = siteConfig('MATERY_MENU_SEARCH', false, CONFIG)
  const router = useRouter()
  const scrollTrigger = useCallback(
    throttle(() => {
      requestAnimationFrame(() => {
        const scrollS = window.scrollY
        const nav = document.querySelector('#sticky-nav')
        const header = document.querySelector('#header')
        const showNav =
          scrollS <= windowTop ||
          scrollS < 5 ||
          (header && scrollS <= header.clientHeight * 2) // 非首页无大图时影藏顶部 滚动条置顶时隐藏// 非首页无大图时影藏顶部 滚动条置顶时隐藏
        // 保持导航栏始终为glassmorphism效果，不改变背景

        if (!showNav) {
          nav && nav.classList.replace('top-0', '-top-20')
          windowTop = scrollS
        } else {
          nav && nav.classList.replace('-top-20', 'top-0')
          windowTop = scrollS
        }
        navDarkMode()
      })
    }, throttleMs)
  )

  const navDarkMode = () => {
    const nav = document.getElementById('sticky-nav')
    const header = document.querySelector('#header')
    if (!isDarkMode && nav && header) {
      if (window.scrollY < header.clientHeight) {
        nav?.classList?.add('dark')
      } else {
        nav?.classList?.remove('dark')
      }
    }
  }

  // 监听滚动
  useEffect(() => {
    scrollTrigger()

    window.addEventListener('scroll', scrollTrigger)
    return () => {
      window.removeEventListener('scroll', scrollTrigger)
    }
  }, [router])

  const [isOpen, changeShow] = useState(false)

  const toggleMenuOpen = () => {
    changeShow(!isOpen)
  }

  const toggleMenuClose = () => {
    changeShow(false)
  }

  const searchDrawerSlot = (
    <>
      {categories && (
        <section className='mt-8'>
          <div className='text-sm flex flex-nowrap justify-between font-light px-2'>
            <div className='text-gray-600 dark:text-gray-200'>
              <i className='mr-2 fas fa-th-list' />
              {locale.COMMON.CATEGORY}
            </div>
            <SmartLink
              href={'/category'}
              passHref
              className='mb-3 text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:underline cursor-pointer'>
              {locale.COMMON.MORE} <i className='fas fa-angle-double-right' />
            </SmartLink>
          </div>
          <CategoryGroup
            currentCategory={currentCategory}
            categories={categories}
          />
        </section>
      )}

      {tags && (
        <section className='mt-4'>
          <div className='text-sm py-2 px-2 flex flex-nowrap justify-between font-light dark:text-gray-200'>
            <div className='text-gray-600 dark:text-gray-200'>
              <i className='mr-2 fas fa-tag' />
              {locale.COMMON.TAGS}
            </div>
            <SmartLink
              href={'/tag'}
              passHref
              className='text-gray-400 hover:text-black  dark:hover:text-white hover:underline cursor-pointer'>
              {locale.COMMON.MORE} <i className='fas fa-angle-double-right' />
            </SmartLink>
          </div>
          <div className='p-2'>
            <TagGroups tags={tags} currentTag={currentTag} />
          </div>
        </section>
      )}
    </>
  )

  return (
    <div id='top-nav'>
      <SearchDrawer cRef={searchDrawer} slot={searchDrawerSlot} />
      {/* 导航栏 */}
      <div
        id='sticky-nav'
        className='flex justify-center top-0 shadow-none fixed bg-black/10 dark:bg-black/10 text-white w-full z-30 transform transition-all duration-200 glassmorphism'>
        <div className='w-full max-w-full flex items-center px-4 py-2'>
          {/* 左侧：小屏汉堡按钮 / 大屏 Logo */}
          <div className='flex items-center'>
            {/* 小屏汉堡按钮 */}
            <div className='block lg:hidden'>
              <div
                onClick={toggleMenuOpen}
                className='w-8 h-8 flex items-center justify-center cursor-pointer'>
                {isOpen ? (
                  <i className='fas fa-times' />
                ) : (
                  <i className='fas fa-bars' />
                )}
              </div>
            </div>

            {/* 大屏 Logo */}
            <div className='hidden lg:flex'>
              <Logo {...props} />
            </div>
          </div>

          {/* 中间：菜单（仅大屏显示） */}
          <div className='flex flex-1 justify-center'>
            <div className='hidden lg:flex'>
              <MenuListTop {...props} customMenu={filteredMenus} />
            </div>
          </div>

          {/* 右侧：简历按钮 + 搜索按钮 */}
          <div className='flex items-center'>
            {resumeButton && (
              <SmartLink
                href={`/${resumeButton.slug}`}
                className='ml-4 text-white font-light tracking-wide transition duration-300'
                onMouseEnter={e => {
                  e.currentTarget.style.textShadow =
                    '0 0 6px white, 0 0 12px white'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.textShadow = 'none'
                }}>
                {resumeButton.title}
              </SmartLink>
            )}

            {showSearchButton && <SearchButton />}
          </div>
        </div>
      </div>

      <SideBarDrawer isOpen={isOpen} onClose={toggleMenuClose}>
        <SideBar {...props} />
      </SideBarDrawer>
    </div>
  )
}

export default Header
