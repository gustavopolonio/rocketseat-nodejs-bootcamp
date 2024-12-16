import { Environment } from 'vitest/environments'

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  setup() {
    console.log('setup')

    return {
      teardown() {
        console.log('teardown')
      },
    }
  },
}
