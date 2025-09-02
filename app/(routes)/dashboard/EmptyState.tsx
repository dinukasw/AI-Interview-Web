import Image from 'next/image'
import React from 'react'

export default function EmptyState() {
  return (
    <div className='mt-14 mx-auto text-center border-2 border-dashed border-gray-200 rounded-2xl p-6'>
        <h2 className='text-lg text-gray-500'>No Interviews Found</h2>
        <p className='text-sm text-gray-400'>Create an interview to get started.</p>
    </div>
  )
}
