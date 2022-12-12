export const getStory = async (storyPath: string) => {
  const storyVersion = process.env.NODE_ENV === 'development'
    ? 'draft'
    : 'published'

  const story = await useAsyncStoryblok(storyPath, { version: storyVersion })
    .then((response: object) => response)
    .catch((error: object) => {
      throw createError({
        statusCode: 404,
        statusMessage: `Page '${storyPath}' not found`,
        fatal: true
      })
    })

  return story
}
