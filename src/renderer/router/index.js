
const BMPList = r => require.ensure([], () => r(require('@/components/BMPList')), 'BMPList')
const Setting = r => require.ensure([], () => r(require('@/components/Setting')), 'Setting')
const Help = r => require.ensure([], () => r(require('@/components/Help')), 'Help')

export default [
  {
    path: '/bmp-list',
    component: BMPList
  },
  {
    path: '/setting',
    component: Setting
  },
  {
    path: '/help',
    component: Help
  },
  {
    path: '*',
    redirect: '/help'
  }
]
