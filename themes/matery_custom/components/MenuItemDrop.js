import SmartLink from '@/components/SmartLink'
import { useState } from 'react'
/**
 * 菜单
 * 支持二级展开的菜单
 */
export const MenuItemDrop = ({ link }) => {
  const [show, changeShow] = useState(false)
  const hasSubMenu = link?.subMenus?.length > 0

  if (!link || !link.show) {
    return null
  }

  return (
    <div
      onMouseOver={() => changeShow(true)}
      onMouseOut={() => changeShow(false)}>
      {!hasSubMenu && (
        <SmartLink
          href={link?.href}
          target={link?.target}
          className='menu-link pl-2 pr-4 no-underline tracking-widest pb-1 text-white transition duration-300'
          onMouseEnter={e => {
            e.currentTarget.style.filter = 'drop-shadow(0 0 6px white) drop-shadow(0 0 12px white)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.filter = 'none'
          }}>
          {link?.icon && <i className={link?.icon} />} {link?.name}
        </SmartLink>
      )}

      {hasSubMenu && (
        <>
          <div
            className='cursor-pointer menu-link pl-2 pr-4 no-underline tracking-widest pb-1 relative text-white transition duration-300'
            onMouseEnter={e => {
              e.currentTarget.style.filter = 'drop-shadow(0 0 6px white) drop-shadow(0 0 12px white)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.filter = 'none'
            }}>
            {link?.icon && <i className={link?.icon} />} {link?.name}
            <i
              className={`px-2 fa fa-angle-down duration-300  ${show ? 'rotate-180' : 'rotate-0'}`}></i>
            {/* 主菜单下方的安全区域 */}
            {show && (
              <div className='absolute w-full h-3 -bottom-1 left-0 bg-transparent z-30'></div>
            )}
          </div>
        </>
      )}

      {/* 子菜单 */}
      {hasSubMenu && (
        <ul
        className={`${show ? 'visible opacity-100 top-12 pointer-events-auto' : 'invisible opacity-0 top-20 pointer-events-none'} bg-black/20 dark:bg-black/20 overflow-hidden rounded-md transition-all duration-300 z-20 absolute block`}
      >
      
          {link.subMenus.map((sLink, index) => {
            return (
              <li
                key={index}
                className='cursor-pointer tracking-widest transition-all duration-300 py-1 pr-6 pl-3 text-white'
                onMouseEnter={e => {
                  e.currentTarget.style.filter =
                    'drop-shadow(0 0 6px white) drop-shadow(0 0 12px white)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.filter = 'none'
                }}>
                <SmartLink href={sLink.href} target={link?.target}>
                  <span className='text-sm text-nowrap font-extralight'>
                    {sLink.title}
                  </span>
                </SmartLink>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
