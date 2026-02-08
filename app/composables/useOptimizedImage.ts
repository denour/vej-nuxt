/**
 * Composable for optimized image handling
 * Use with <NuxtImg> or <NuxtPicture> components
 */
export function useOptimizedImage() {
  const config = useRuntimeConfig()
  
  /**
   * Get the full URL for storage images
   */
  const getStorageUrl = (path: string | null | undefined): string => {
    if (!path) return '/images/placeholder.svg'
    if (path.startsWith('http')) return path
    return `${config.public.storageBase}${path.startsWith('/') ? '' : '/'}${path}`
  }

  /**
   * Default image sizes for responsive images
   */
  const imageSizes = {
    thumbnail: 'xs:100px sm:150px',
    card: 'xs:280px sm:320px md:400px lg:350px',
    hero: 'xs:100vw md:50vw lg:800px',
    full: 'xs:100vw md:100vw lg:1200px',
  }

  /**
   * Default placeholder for missing images
   */
  const placeholder = '/images/placeholder.svg'

  return {
    getStorageUrl,
    imageSizes,
    placeholder,
  }
}
