export const useMyComposable = () => {
  // Because your composable is called in the right place in the lifecycle,
  // useRuntimeConfig will also work
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const config = useRuntimeConfig()

  // ...
}
