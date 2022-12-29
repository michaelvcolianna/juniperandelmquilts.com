export const bestImage = (
  storyContent: {
    body: { hero: { filename: string } }[],
    card: object
  }
) => {
  return storyContent.body[0].hero.filename
    ? storyContent.body[0].hero
    : storyContent.card
}
