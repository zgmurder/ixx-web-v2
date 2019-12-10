<template>
  <div v-loading="false" class="hold-content" element-loading-background="rgba(0, 0, 0, 0.3)">
    <div class="content-container-hold">
      <div class="linear-bar" flex="main:justify cross:center">
        <svg-icon icon-class="btc" />
        <svg-icon icon-class="bug" />
        <div class="mark">{{ active }} x</div>
      </div>
      <div class="multiple-bar">
        <el-divider content-position="center"> <span style="font-size:12px" class="text-nowrap">{{ $tR(`setLever`) }}</span> </el-divider>
        <div :flex="$attrs.flex || 'main:justify cross:center'" style="margin-top:30px">
          <el-input-number v-model="sliderValue" :min="1" :max="100" size="mini" :style="{width: !onlyLever ? '100px':'100%'}" @change="handleSliderChange" />
          <el-popover ref="popover" v-model="popoverVisible" placement="top" width="270" trigger="manual" @show="leveragePreview">
            <p>
              <span v-if="+leverageTipObj.margin_position" v-html="$tR('tip',leverageTipObj)" />
              <span v-else v-html="$tR('leverageTip',leverageTipObj)" />
            </p>
            <hr>
            <div flex="main:justify dir:right cross:center">
              <!-- <el-checkbox v-model="checked">{{ $t('noShow') }}</el-checkbox> -->
              <div>
                <el-button size="mini" type="text" @click="cancelClick">{{ $t('cancel') }}</el-button>
                <el-button type="primary" size="mini" @click="handleTagClick">{{ $t('confirm') }}</el-button>
              </div>
            </div>
            <div slot="reference" flex="main:justify">
              <template v-if="!onlyLever">
                <el-tag v-for="tag in data" :key="tag" style="cursor: pointer;" size="mini" :type="activeTag ===tag && 'warning'||''" :effect="active === tag && 'dark'||'plain'" @click="handleActive(tag)">
                  {{ tag === '0'?$tR('allstorehouse'):tag+'x' }}
                </el-tag>
              </template>
              <template v-else>
                <el-link v-for="tag in data" :key="tag" :underline="false" :class="active ===tag && 'text-active'||''" :type="activeTag ===tag && 'warning'||''" @click="handleActive(tag)">{{ tag === '0'?$tR('allstorehouse'):tag+'x' }}</el-link>
              </template>
            </div>
          </el-popover>
        </div>
        <el-slider v-model="sliderValue" @change="handleSliderChange" />
      </div>
      <div v-if="!onlyLever">
        <div v-for="(value,key) in mapTableColumns" :key="key" style="color:#ccc" flex="box:mean">
          <span>{{ $tR(`mapTableColumns.${key}`) }}</span>
          <span>{{ ['4','5'].includes(key)?formValueObj[key]:bigRound(formValueObj[key],8) }}</span>

        </div>
        <el-divider />
        <div flex="box:mean">
          <el-button @click="$emit('command')">{{ $t('cancel') }}</el-button>
          <el-button :type="type" :loading="loading" @click="$emit('command',true)">{{ $t('confirm') }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { leveragePreview } from '@/api/currencyUnit'
export default {
  name: 'OrderPopover',
  model: {
    prop: 'active',
    event: 'change'
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    active: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'success'
    },
    formValueObj: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    },
    onlyLever: {
      type: Boolean,
      default: false
    },
    activeProduct: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      input: '',
      isSeting: false,
      inputVisible: false,
      sliderValue: +this.active,
      popoverVisible: false,
      checked: false,
      activeTag: '',
      leverageTipObj: {}
    }
  },
  computed: {
    mapTableColumns() {
      return this.langData.mapTableColumns
    },
    calcData() {
      return Object.values(this.data).reduce((prev, curr, index) => {
        prev[index * 10] = curr + 'x'
        return prev
      }, {})
    }

  },
  watch: {
    active: {
      handler(newValue) {
        this.sliderValue = !+this.active ? +this.data[this.data.length - 2] : +this.active
      }
    }
  },
  methods: {
    leveragePreview() {
      leveragePreview({ name: this.activeProduct.name, leverage: this.sliderValue }).then(res => {
        this.leverageTipObj = res.data
      })
    },
    handleInput(value) {
      // if (!value || +value) return
      this.input = value.replace(/^(0+)|[^\d^.]+/g, '')
      const data = this.data
      const decimals = this.input.split('.')[1]
      if (decimals && decimals.length > 1) this.input = this.bigRound(this.input, 1)
      if (+this.input >= +data[data.length - 2]) this.input = data[data.length - 2]
    },
    handleTagClick() {
      if (this.activeTag) {
        this.$emit('change', this.activeTag)
        this.sliderValue = +this.activeTag || +this.data[this.data.length - 2]
        this.activeTag = ''
      } else {
        this.$emit('change', this.sliderValue)
      }
      this.popoverVisible = false
      // this.$nextTick(() => {
      //   this.$refs.popover.popperElm.style.left = index * 20 + 'px'
      // })
    },
    cancelClick() {
      this.activeTag = ''
      this.popoverVisible = false
      this.sliderValue = +this.active
    },
    handleActive(tag) {
      if (tag === this.active) return
      this.activeTag = !this.popoverVisible ? tag : ''
      this.popoverVisible = true
    },
    handleSliderChange() {
      this.popoverVisible = true
      // this.$emit('change', this.sliderValue + '')
    }
  }
}
</script>
<style lang="scss" scoped>
.hold-content{
  line-height: 30px;
  &>.content-container-hold{
    font-size: 12px;
    padding: 0 8px;
    &>*{
      margin-top: 6px;
    }
    &>.linear-bar{
      position: relative;
      box-sizing: border-box;
      height: 30px;
      background: linear-gradient(90deg, $--color-success 0%, $--color-danger 100%);
      padding:0 8px;
      &>.mark{
        position: absolute;
        padding-left: 10px;
        height: 100%;
        line-height: 30px;
        border-left: 1px solid #fff;
        left: 20%;
      }
      .tag-item{
        cursor: pointer;
        &:hover{
          background: $--color-primary
        }
      }
    }
    &>.multiple-bar{
      margin-top: 40px;
      text-align: left
    }
    &>.table-wrap{
      border:1px solid #ccc;
      text-align: center
    }
  }
}

</style>
