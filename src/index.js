import React, { Fragment, createRef } from "react"
import { isBoolean, isUndefined } from './tools.js'
import Count from './Count.js'
import "./index.less"

/**
 * 
 * @param {Object} props 
 * @param {Number} props.length 数字长度
 * @param {String|Number} props.startNum 开始值
 * @param {String|Number} props.endNum 结束值
 * @param {Boolean} props.type  翻页效果
 * @param {Number} props.part 数字更新频率 秒
 * @param {Number} props.preiod 周期 秒
 * @param {Array} props.ponitArr 千分位的位置
 * @param {Number} props.ponitArr[x] 
 */
export default class Count extends React.Component {
  constructor(props = {}) {
    super(props)
    this.timer = null
    this.clockNode = createRef()
    
    this.verify() && this.getInstance() && this.insterval();
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  verify = () => {
    let { startNum, endNum, type, part, preiod, ponitArr, length } = this.props;
    if (isNaN(endNum)) {
      console.error('endNum 必须为数字')
      return false
    }
    if (!isUndefined(length) && isNaN(length)) {
      console.error('length 不是必须的参数，如果想设置就必须是数字')
      return false
    }
    if (!isUndefined(startNum) && isNaN(startNum)) {
      console.error('startNum 不是必须的参数，如果想设置就必须是数字')
      return false
    }

    if (!isUndefined(type) && !isBoolean(type)) {
      console.error('type 不是必须的参数，如果想设置就必须为Boolean类型')
      return false
    }
    if (!isUndefined(part) && isNaN(part)) {
      console.error('part 不是必须的参数，如果想设置就必须为数字')
      return false
    }
    if (!isUndefined(preiod) && isNaN(preiod)) {
      console.error('preiod 不是必须的参数，如果想设置就必须为数字')
      return false
    }
    if (isNaN(part) && isNaN(preiod) && preiod < part) {
      console.error('preiod 必须大于 part')
      return false
    }
    return true
  }
  getInstance = () => {
    let { endNum, startNum } = this.props
    if (endNum !== undefined || startNum !== undefined) {
      startNum = startNum || 0
      endNum = endNum || 0
      const n = endNum >= startNum
      
      if (!n) {
        const min = endNum
        endNum = startNum
        startNum = min
      }
      this.CIn = new Count(this.props)
      return true
    }
  }

  insterval = () => {
    const ms = (this.props.part || this.CIn.part) * 1000
    this.timer = setTimeout(() => {
      this.clockNode && this.CIn.renderer({ clockNode: this.clockNode });
      this.insterval()
    }, ms)
  };

  render() {
    const { elements, ponitArr } = this.CIn
    const type = elements.type
    return (
      <Fragment>
        <div
          id="clock"
          className={type ? "effect" : "no-effect"}
          ref={this.clockNode}
        >
          {
            elements.data.map((v, index) => {
              return (
                <Fragment key={index}>
                  <div v="" className="num no-data" ref={node => node && elements.cacheNodeMap.set(index, node)}>
                    {
                      type ?
                        <Fragment>
                          <div className="upper" />
                          <div className="base upper" />
                          <div className="base lower" />
                          <div className="lower" />
                        </Fragment> :
                        <span>0</span>
                    }
                  </div>
                  {
                    ponitArr.includes(index) ? <div className="point">0</div> : null
                  }
                </Fragment>
              )
            })
          }
        </div>
      </Fragment>
    )
  }
}