export const getStory = async (storyPath: string) => {
  const storyVersion = process.env.NODE_ENV === 'development'
    ? 'draft'
    : 'published'

  const resolveRelations = ['featured-items.items']

  const story = await useAsyncStoryblok(
    storyPath,
    {
      version: storyVersion,
      resolve_relations: resolveRelations
    },
    {
      resolveRelations
    }
  )
    .then((response: object) => response)
    .catch((error: object) => {
      if(process.env.NODE_ENV === 'development') {
        console.log('--- getStory error', error)
      }

      throw createError({
        statusCode: 404,
        statusMessage: `Page '${storyPath}' not found`,
        fatal: true
      })
    })

  return story
}
