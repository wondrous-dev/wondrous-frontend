import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('components/organization/boards/Editors'), {
  ssr: false
})


export default () => <DynamicComponentWithNoSSR   />
