import type { RefObject } from 'react'

import { useCallback, useEffect } from 'react'

export const useOutsideClick = (element: RefObject<HTMLDivElement>, callback: () => void): void => {
  const handleClick = useCallback((e: MouseEvent) => {
    if (element.current && !element.current.contains(e.target as HTMLElement)) {
      callback()
    }
  }, [element, callback])

  useEffect(() => {
    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [handleClick, callback])
}
