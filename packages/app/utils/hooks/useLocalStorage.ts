import { useEffect, useState } from 'react'

export function useLocalStorage(key: string): [string | null, (value: string | null) => void]  {
  const [value, setValue] = useState(localStorage.getItem(key))

  useEffect(() => {
    localStorage.setItem(key, value || '')
  }, [key, value])

  return [value, setValue]
}
