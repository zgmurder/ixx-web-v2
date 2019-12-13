export default {
  handleSuccess: '操作成功',
  handleFailed: '操作失败',
  confirm: '确定',
  cancel: '取消',
  noShow: '不在显示',
  up: '上涨',
  down: '下跌',
  appNav: {
    mapNavList: {
      'trading': '币币交易',
      'contract': '合约交易',
      'currency-unit': '币本位交易',
      'legalTender': '法币交易',
      'bidTitle': '币盈盈',
      'fund_assets_node_buy': '节点认购',
      'share_option': '急速合约'
    },
    'signup': '创建帐号',
    'signin': '登录',
    'signout': '退出登录'
  },
  legalTender: {
    mapCurrency: {
      'CNY': '人民币',
      'SGD': '新加坡币'
    },
    mapSidebarMenu: {
      currencyTitle: {
        'currency': '币种',
        'otc_menu_title_price': '现价'
      },
      transaction: {
        'otc_transaction_manage': '交易管理',
        'otc_my_order': '我的订单/委托单',
        'otc_side_35': '法币账单',
        'otc_collection_payment_setting': '收付款设置'
      },
      help: {
        'footer_help': '帮助中心',
        'footer_hreseqgslp1': '新手指导',
        'footer_hreseqgslp2': '常见问题'
      }
    },
    mapBuyOrSellMethods: {
      buy: {
        'b_1': '按金额购买',
        'b_2': '按数量购买'
      },
      sell: {
        'a_1': '按金额出售',
        'a_2': '按数量出售'
      }
    },
    mapTableColumns: {
      'name': '商家(成单 | 完成率)',
      'price': '单价',
      'amount': '数量',
      'total': '总金额',
      'quota': '限额',
      'payment_type': '支付方式'
    },
    'actions': '操作',
    'otc_side_1': '购买',
    'otc_side_2': '出售',
    'otc_legal_currency': '法币',
    'otc_publish_order': '发布委托单',
    'yj_mb': '一键买币',
    'yj_mb1': '一键卖币',
    'xe_je': '小额快速交易，单笔50000以下',
    'otc_placeholder_enter': '请输入内容',
    'a_1_p': '请输入需要出售的总金额',
    'a_2_p': '请输入需要出售的总数量',
    'b_1_p': '请输入需要购买的总金额',
    'b_2_p': '请输入需要购买的总数量'
  },
  login: {
    'login_by_email': '邮箱登录',
    'login_by_phone': '手机登录',
    'login_by_count': '登录',
    'register_count': '注册账号',
    'forget_pass': '忘记密码'
  },
  contract: {
    sheet: '张',
    buy: '买入',
    sell: '卖出',
    handle: '操作',
    cancel: '撤销',
    deal: '合约交易',
    rateOReturn: '回报率',
    quota: '风险限额',
    handleSuccess: '操作成功',
    index: '指数',
    currentPlace: '当前仓位',
    state: {
      1: '委托中未成交',
      2: '委托中限价部分成交',
      3: '完全成交',
      4: '撤单全部',
      5: '撤单部分成交',
      6: '市价部分成交',
      7: '市价'
    },
    mapTabs: {
      FUTURE_BTCUSD: `BTC永续`,
      FUTURE_ETHUSD: `ETH永续`,
      FUTURE_EOSUSD: `EOS永续`,
      FUTURE_BHDUSD: `BHD永续`,
      ETHUSD: `ETH币本位`,
      EOSUSD: `EOS币本位`
    },

    mapTableTapContents: {
      shipping: {
        text: '仓位',
        mapTableColumns: {
          holding: '目前仓位数量',
          _leverage: '杠杆倍数',
          markPrice: '标记价格',
          price: '开仓价格',
          liq_price: '强平价格',
          value: '价值',
          margin_position: '仓位保证金',
          unrealized: '未实现盈亏（回报率%）',
          realized: '已实现盈亏'
        }
      },
      shipped: {
        text: '已平仓位',
        mapTableColumns: {
          symbol: '合约类型',
          realized: '已实现盈亏'
        }
      },
      curEntrust: {
        text: '当前委托',
        mapTableColumns: {
          symbol: '合约类型',
          side: '方向',
          amount: '数量',
          price: '委托价格',
          // total: '已成交额',
          executed: '已成交量/剩余量',
          entrustValue: '委托价值',
          type: '类型',
          state: '状态',
          tp_type: '止盈/止损',
          create_time: '下单时间'
          // update_time: '更新时间'
          // tp_price: '止盈价格',
          // sl_type: '止损触发类型',
          // sl_price: '止损价格'
        }
      },
      lossEntrust: {
        text: '止损委托',
        mapTableColumns: {
          symbol: '合约类型',
          amount: '数量',
          trigger_price: '触发价格',
          distancePrice: '距离触发',
          // total: '已成交额',
          // executed: '已成交量',
          type: '类型',
          state: '状态',
          create_time: '下单时间'
          // update_time: '更新时间'
          // tp_type: '止盈触发类型',
          // tp_price: '止盈价格',
          // sl_type: '止损触发类型',
          // sl_price: '止损价格'
        }
      },
      historyEntrust: {
        text: '委托历史',
        mapTableColumns: {
          symbol: '合约类型',
          side: '方向',
          amount: '数量',
          // price: '委托价格',
          executed_price: '成交价格',
          executed: '已成交量/剩余量',
          // entrustValue: '委托价值',
          type: '类型',
          state: '状态',
          // tp_type: '止盈/止损',
          create_time: '下单时间'
          // update_time: '更新时间'
          // tp_price: '止盈价格',
          // sl_type: '止损触发类型',
          // sl_price: '止损价格'
        }
      },
      bargain: {
        text: '已成交',
        mapTableColumns: {
          symbol: '合约类型',
          side: '方向',
          amount_total: '委托数量',
          amount: '成交量',
          amount_surplus: '剩余量',
          price: '成交价格',
          // entrustPrice: '委托价格',
          total: '价值',
          type: '委托类型',
          order_id: '委托单ID',
          fee: '手续费',
          create_time: '成交时间'

          // id: '成交单ID',
          // origin: '1成交单',
          // order_id: '订单ID',
          // uid: '用户ID',
          // product: '商品简称',
          // currency: '货币简称',

        }
      }
    },
    mapDishInfo: {
      current: '最新价',
      change_24h: '涨跌幅',
      volume_24h: '24H成交量',
      markPrice: '标记价格',
      increment_24h: '涨跌额'
    },
    mapDelegateList: {
      'entrust-list': '委托列表',
      'depth': '深度',
      'return-dish': '返回盘口',
      'new-bargain': '最新成交',
      mapHeader1: {
        'price': '价格',
        'amount': '数量',
        'total': '累计'
      },
      mapHeader2: {
        'direction': '方向',
        'transaction-price ': '成交价',
        'trading-volume': '成交量',
        'time': '时间'
      }
    },
    mapFormContent: {
      mapBtns: {
        1: { text: '限价', describe: '限价委托用于在指定的（或更好的）价格买入或卖出。这是最常用的委托类型。' },
        2: { text: '市价', describe: '市价委托是一种最快的成交方式。它以目前委托列表的最佳价格执行。请注意，网络延迟可能导致委托的执行价格与你的期望有所不同。' },
        3: { text: '限价止损' }
      },
      mapMenuOptions: {
        3: '限价止损',
        4: '市价止损',
        5: '限价止盈',
        6: '市价止盈'
      },
      mapInput: {
        shippingSpace: '仓位',
        value: '价格',
        triggerPrice: '触发价格',
        triggerType: '触发类型'
      },
      mapHandleBtn: {
        buy: '买入/做多',
        sell: '卖出/做空'
      },
      cost: '成本',
      submitEntrust: '提交委托',
      mapDescribe: {
        entrustValue: '委托价值',
        available: '可用余额'
      },
      mapTriggerType: {
        1: '盘口价格',
        2: '标记价格',
        3: '指数价格'
      },
      notip: '直接下单',
      trigger_close: '触发后平仓',
      perfactPrice: '市场最优价格'
    },
    mapInformation: {
      priceBy: '价格来源',
      priceIndex: '指数价格',
      volume_24h: '24小时交易量',
      value: '合约价值',
      valueRate: '资金费率'
    }
  },
  shipping: {
    lossLimit: '止损',
    winLimit: '止盈',
    price: '市价',
    closeOut: '平仓'
  },
  orderPopover: {
    mapTableColumns: {
      1: '委托价值',
      2: '成本@{active}',
      3: '可用余额',
      4: '成交后的仓位大小',
      5: '标记价格',
      6: '预期强平价格',
      7: '标记价格/预期强平价格 差异'
    },
    setLever: '设置杠杆倍数',
    tip: '您的操作将会把已持仓杠杆倍数和委托订单杠杆倍数修改为<i class="text-danger">{leverage}</i>倍，仓位保证金调节为<i class="text-danger">{margin_position}</i>，委托保证金为<i class="text-danger">{margin_delegation}</i>',
    leverageTip: '确定将杠杆倍数调节至{leverage}吗',
    allstorehouse: '全仓'
  },
  userCenter: {
    mapMenuList: {
      'person-info': '个人信息',
      'safe-approve': '安全认证',
      'identity-verify': '身份验证',
      'api-manage': 'API 管理',
      'my-invite': '我的邀请',
      'other-set': '消息设置'
    }
  },
  personInfo: {
    gotoBind: '去绑定',
    history: '登录历史',
    mapTableInfo: {
      name: '用户姓名',
      phone: '手机号',
      email: '邮箱'
    },
    mapHistoryColumns: {
      'login_time': '时间',
      'ip': 'IP地址',
      'address': '地区'
    }
  },
  property: {
    mapMenuList: {
      'property-manage': '资产管理',
      'capital-account': '资金账户',
      'deal-account': '交易账户',
      'charge-money': '充币',
      'mention-money': '提币',
      'funds-transfer': '资金划转',
      'address-manage': '地址管理'
    },
    mapMenuList1: {
      1: {
        label: '资产管理',
        children: { 'property-manage': '我的资产' }
      },
      2: {
        label: '资金账户',
        children: {
          'capital-account': '资金账户',
          'financial-record': '财务记录',
          'charge-money': '充币',
          'mention-money': '提币',
          'funds-transfer': '资金划转'
        }
      },
      3: {
        label: '交易账户',
        children: {
          'fiat-account': '法币账户',
          'coin-account': '币币账户',
          'contract-account': '合约账户',
          'unit-account': '币本位账户',
          'share-account': '急速账户'
        }
      },
      4: {
        label: '其他',
        children: { 'address-manage': '地址管理' }
      }
    }
  },
  shareOption: {
    up_rate: '看涨',
    down_rate: '看跌',
    newPrice: '最新价格',
    fullHistory: '完整历史记录',
    describe: '期权预期收益率。即，如果您购买看涨期权，且期权到期时标的价格高于初始行权价格，则您的净收益=看涨收益率*投资金额。',
    mapLeftNav: {
      'spot-index': '现货指数',
      'history': '历史记录'
    },
    rightSideBar: {
      'inputTitle': '投资'
    },
    mapShareColumns: {
      currency: ' 支付货币',
      symbol: ' 产品类型',
      period: '周期',
      trade_type: '交易方向',
      // rate: ' 赔率',
      amount: '下单金额',
      income: '收益金额',
      profile: '价值金额',
      // spot: '现货指数',
      strike: '行权价格',
      sett_price: '结算价格',
      create_time: '下单时间',
      sett_time: '结算时间',
      state: '是否结算'
    }
  },
  spotIndex: {
    'USD': '现货指数',
    mapList: {
      price: 'USDT指数',
      usdtRate: '汇率(USDT/USD)'
    }
  },
  financialRecord: {
    mapTab: {
      1: '划转记录',
      2: '充币记录',
      3: '提币记录',
      4: '奖励分配',
      5: '返佣记录'
    },
    mapTableColumns: {
      1: {
        from_balance: '划转账户',
        to_balance: '目标账户',
        currency: '划转币种',
        amount: '划转数量',
        available: '账户剩余量',
        opetate: '转入 | 转出', // 1-转入 2-传出 3-当日清算
        create_time: '操作时间',
        status: '状态' // 0-失败 1-成功
      },
      2: {
        id: '流水号',
        // user_id: '用户ID',
        chain: '链名',
        currency: '币名',
        to_address: '目标地址',
        memo: '备忘',
        amount: '充值量',
        txid: '链上交易号',
        confirm: '确认数',
        state: '状态',
        create_time: '开始时间',
        update_time: '最近更新时间'
      },
      3: {
        id: '流水号',
        wallet_tx_id: '钱包流水号',
        user_id: '用户ID',
        chain: '链名',
        currency: '币名',
        from_address: '源地址',
        to_address: '目标地址',
        change_address: '找零地址',
        memo: '备忘',
        amount: '提币量'
        // fee: '提币手续费',
        // txid: '链上交易号',
        // confirm: '确认数',
        // state: '状态',
        // create_time: '开始时间',
        // update_time: '最近更新时间',
        // reviewer_id: '审核人ID',
        // reviewer_nonce: '审核人nonce',
        // reviewer_signature: '审核人签名',
        // review_time: '审核时间',
        // raw_tx: '原始tx',
        // sign_result: '签名结果'
      },
      4: {
        user_id: '用户ID',
        currency: '币名',
        type: '活动类型',
        name: '活动名称',
        amount: '数量',
        state: '状态', // 0未发放 1已发放
        release_time: '发放时间',
        create_time: '生成时间',
        payload: '其他信息'
      },
      5: {
        currency: '币种',
        total: '下线用户返佣总额',
        already_total: '下线用户已返佣总额',
        today_total: '今日下线返佣额',
        today_nTotal: '待返佣额'
      }
    }
  },
  capitalAccount: {
    mapTableColumns: {
      currency: '币名',
      available: '可用量',
      ordering: '冻结量',
      totalValue: '估值'
    }
  },
  fiatAccount: {
    mapTableColumns: {
      currency: '币名',
      available: '可用量',
      ordering: '冻结量',
      // quota: '当前提币剩余额度',
      // max_quota: '当前提币总额度',
      // rates: '汇率',
      totalValue: '估值',
      handle: '操作'
    }
  },
  coinAccount: {
    mapTableColumns: {
      currency: '币名',
      available: '可用量',
      withdrawing: '提币锁定量',
      quota: '当前提币剩余额度',
      max_quota: '当前提币总额度',
      totalValue: '总价值'
    },
    mapHistoryColumns: {
      'order_id': '订单ID',
      'symbol': '交易对',
      'side': '方向', // (1买 2卖)
      'type': '类型', // (1限价 2市价)
      'price': '成交均价',
      'amount': '成交数量',
      'fee': '手续费',
      'create_time': '时间'
    }
  },
  contractAccount: {
    mapTableColumns: {
      currency: '币种',
      // wallet_available: '钱包可用余额',
      available: '可用余额',
      holding: '仓位数量',
      price: '开仓价格',
      leverage: '杠杆倍数',
      // margin_available: '保证金余额',
      position_margin: '仓位保证金',
      order_margin: '委托保证金',
      unrealized: '未实现盈亏',
      realized: '已实现盈亏',
      liq_price: '强平价格',
      adl: 'ADL值',
      // close_position_price: '平仓委托价格',
      // future_tp_id: '止盈委托ID',
      // future_sl_id: '止损委托ID',
      tp_price: '止盈价格',
      sl_price: '止损价格'
    },
    mapFinanceColumns: {
      time: '成交时间',
      currency: '币种',
      opetate: '操作',
      amount: '数额',
      available: '余额',
      ord_status: '状态'
    }
  },

  shareAccount: {
    mapTableColumns: {
      currency: '币名',
      available: '可用量',
      ordering: '冻结量',
      totalValue: '估值'
    }
  }

}
