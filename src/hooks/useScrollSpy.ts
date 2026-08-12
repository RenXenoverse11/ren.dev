import { useEffect, useState } from 'react'

/** Returns the id of the section currently filling most of the viewport. */
export function useScrollSpy(ids: string[], offset = 120) {
  const [activeId, setActiveId] = useState(ids[0] ?? '')

  useEffect(() => {
    const onScroll = () => {
      let current = ids[0] ?? ''
      for (const id of ids) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= offset) current = id
      }
      setActiveId(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ids, offset])

  return activeId
}
