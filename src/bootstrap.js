import Vue from 'vue'

import {toBig, toRound, toFixed, toThousand} from './utils/handleNum'
import { parseTime } from './utils/index'


Vue.filter('big', toBig)
Vue.filter('round', toRound)
Vue.filter('fixed', toFixed)
Vue.filter('thousand', toThousand)
Vue.filter('abs', num => Math.abs(num))
Vue.filter('date', parseTime)