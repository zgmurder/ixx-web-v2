<template>
  <div class="orderbook-container">
    <div class="header" flex>
      <div class="orderbook-nav" flex-box="3" flex>
        <span
          flex-box="1"
          style="height: 32px; line-height: 32px;"
          :class="{active: orderbookMode === 'both' }"
          @click="setMode('both')"
        >
          <svg-icon icon-class="order-normal" />
        </span>
        <span
          flex-box="1"
          style="height: 32px; line-height: 32px;"
          :class="{active: orderbookMode === 'ask' }"
          @click="setModel('ask')"
        >
          <svg-icon icon-class="order-down" />
        </span>
        <span
          flex-box="1"
          style="height: 32px; line-height: 32px;"
          :class="{active: orderbookMode === 'bid' }"
          @click="setModel('bid')"
        >
          <svg-icon icon-class="order-up" />
        </span>
      </div>
      <div class="orderbook-depth" flex-box="1">
        <span
          style="height: 32px; line-height: 32px;"
        >
          <span>{{ currentDepth }}</span>
          <svg-icon icon-class="arrow-down-yellow" />
        </span>
        <div
          v-show="showDepthOption"
          class="depth-options-wrapper"
        >
          <div class="depth-options">
            <div
              v-for="(dp, index) in depthGroup"
              :key="index"
              class="depth__row"
              @click="changeDepth(dp)"
            >
              {{ dp.offset }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel-thead">
      <div class="thead" flex>
        <div flex-box="1" class="th"/>
        <div flex-box="1" class="th">{{ $t('价格') }} </div>
        <div flex-box="1" class="th">{{ $t('数量') }} </div>
        <div flex-box="1" class="th">{{ $t('累计') }} </div>
      </div>
    </div>
    <div class="panel-body" >

    </div>
    <div class="mask" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderbookMode: '',
      showDepthOption: false,
      offset: 0,
      pairInfo: {},
      depthGroup: [],
      delegateData: null
    }
  },
  computed: {
    priceScale() {
      let scale = this.pairInfo.price_scale - this.offset
      if (this.offset !== 0 && this.accuracy === 2) {
        scale += 1
      }
      return scale
    },
    currentDepth() {
      return Math.pow(10, -this.priceScale).toFixed(this.priceScale >= 0 ? this.priceScale : 0)
    },
    
  },
  methods: {
    setModel(mode) {
      this.orderbookMode = mode
    },
    changeDepth(dp) {
      this.offset = dp.accuracy
      this.showDepthOption = false
    }
  }
}
</script>

<style lang="scss" scoped>
.orderbook-container {
  height: 100%;
  .header {
    height: 32px;
    background: #192D3F;
  }
}
</style>
