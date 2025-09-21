//            function: formatTime           //
export const formatTime = (timestamp: any, format: 'relative' | 'time' | 'date' = 'relative'): string => {
  let date: Date
  
  // Handle Firestore timestamp format
  if (timestamp && typeof timestamp === 'object' && timestamp._seconds) {
    date = new Date(timestamp._seconds * 1000)
  } else if (typeof timestamp === 'string') {
    date = new Date(timestamp)
  } else {
    return "Unknown time"
  }
  
  if (format === 'time') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  if (format === 'date') {
    return date.toLocaleDateString()
  }
  
  // Default: relative time
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return "now"
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}hr ago`
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`
  return date.toLocaleDateString()
}

//            function: formatTimestamp (deprecated - use formatTime with 'time' option)           //
export const formatTimestamp = (timestamp: any): string => {
  return formatTime(timestamp, 'time')
}
