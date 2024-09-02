import { useEffect } from 'react'

const useScrollFade = (selector) => {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll(selector)
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect()
        const windowHeight = window.innerHeight

        // Calculate the new opacity based on element's position in the viewport
        const newOpacity = 1 - Math.abs(rect.top / windowHeight)

        // Set the new opacity, ensuring it doesn't go below 0
        element.style.opacity = Math.max(newOpacity, 0)
      })
    }

    window.addEventListener('scroll', handleScroll)

    // Initial call to set the opacity based on initial scroll position
    handleScroll()

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [selector])
}

export default useScrollFade
