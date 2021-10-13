export const checkConditionRepeatedly = (condition: boolean, onSuccess: () => void, onFail: () => void, options?: {interval: number, timeout: number}): () => void => {
  const interval = options?.interval || 20
  const timeout = options?.timeout || 1000

  let timeElapsed = 0

  const intervalId = setInterval(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (condition) {
      clearInterval(intervalId)
      onSuccess()
    } else {
      timeElapsed += interval
      if (timeElapsed >= timeout) {
        clearInterval(intervalId)
        onFail()
      }
    }
  }, interval)

  return () => clearInterval(intervalId)
}
