import React from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { hr } from 'framer-motion/client'

function AppHeader() {

    const MenuOption = [
        {
            name: 'Dashboard',
            href: '/dashboard'
        },
        {
            name: 'Upgrade',
            href: '/upgrade'
        },
        {
            name: 'How It Works',
            href: '/how-it-works'
        }
    ]
  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
            <div className="flex items-center gap-2">
                <Image
                    src="/logo.svg"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                <h1 className="text-base font-bold md:text-2xl">
                    AI Mock Interview
                </h1>
            </div>
            <div>
                <ul className='flex gap-6'>
                    {MenuOption.map((option) => (
                        <li key={option.name} className='text-lg hover:scale-105 transition-all'>
                            <a href={option.href}>{option.name}</a>
                        </li>
                    ))}
                </ul>
            </div>
            <UserButton />
            
        </nav>
  )
}

export default AppHeader
