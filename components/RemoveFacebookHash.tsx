'use client'

import { useEffect } from 'react'

const RemoveFacebookHash = () => {
  useEffect(() => {
    if (window.location.hash === '#_=_') {
      history.replaceState(null, '', window.location.href.split('#')[0])
    }
  }, [])

  return null
}

export default RemoveFacebookHash