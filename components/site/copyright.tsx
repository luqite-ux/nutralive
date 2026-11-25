'use client'

export function Copyright() {
  return (
    <p suppressHydrationWarning>
      {'© '}
      {new Date().getFullYear()} Nutralive Co.,Ltd. All rights reserved.
    </p>
  )
}
