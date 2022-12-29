import { format } from 'date-fns'

export const storyDate = (dateString: string, dateFormat = "MMM do, yyyy") => {
  let dateObj = new Date(dateString)

  return format(dateObj, dateFormat)
}
