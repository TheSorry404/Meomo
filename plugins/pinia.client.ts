export default defineNuxtPlugin(() => {
  const { $pinia } = useNuxtApp()
  if (!$pinia) {
    console.warn('Pinia未正确初始化')
  }
})