import {
  ActionSheet,
  Button,
  Cell,
  Icon,
  Image as VanImage,
  Popup,
  Lazyload,
  Calendar,
  Cascader,
  Field,
  Form,
  Search,
  DropdownMenu,
  DropdownItem,
  Loading,
  Overlay,
  Divider,
  Empty,
  List,
  NoticeBar,
  Sticky,
  NavBar,
  Tabbar,
  TabbarItem,
  Dialog,
  Swipe,
  SwipeItem,
  Switch,
  SwipeCell
} from 'vant'

export default {
  install(Vue) {
    Vue.use(ActionSheet)
    Vue.use(Button)
    Vue.use(Cell)
    Vue.use(Dialog)
    Vue.use(Icon)
    Vue.use(VanImage)
    Vue.use(Popup)
    Vue.use(Lazyload)
    Vue.use(Calendar)
    Vue.use(Cascader)
    Vue.use(Field)
    Vue.use(Form)
    Vue.use(DropdownMenu)
    Vue.use(DropdownItem)
    Vue.use(Loading)
    Vue.use(Search)
    Vue.use(Overlay)
    Vue.use(Divider)
    Vue.use(Empty)
    Vue.use(List)
    Vue.use(NoticeBar)
    Vue.use(Sticky)
    Vue.use(NavBar)
    Vue.use(Tabbar)
    Vue.use(TabbarItem)
    Vue.use(Swipe)
    Vue.use(SwipeItem)
    Vue.use(Switch)
    Vue.use(SwipeCell)
  }
}