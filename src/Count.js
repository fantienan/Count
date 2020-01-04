import { TweenMax, Power1, Power4, Bounce } from "gsap";
export const part = 2;
export const preiod = 3600;
export const length = 11;

export default class Count {
    constructor(props = {}) {
        this.length = props.length || length; // 11位数
        this.part = props.part || part; // 更新频率
        this.preiod = props.preiod || preiod; // 更新周期
        this.ponitArr = props.ponitArr || [1, 4, 7]; // 千分位的位置
        this.maxRandom = 100; // 异常处理时随机数的最大范围
        this.clockNode = null;  // 组件元素#clock
        this.num = 0; // 已经数变化了几次
        
        this.elements = reactive({
            count: 0, // 值
            data: new Array(this.length).fill(), // 值数组
            cacheNodeMap: new Map(), // 元素映射
            type: props.type || false, // true：显示翻页效果；false：不需要翻页效果
        }, this.hander);
        this.startNum = props.startNum || 0
        this.endNum = props.endNum || 0
        this.pace = 0
        this.share = 0

    }
    hander = {
        get: (target, key) => {
            return target[key]
        },
        set: (target, key, value) => {
            if (key === "count" && value !== undefined) {

                const a = value.toString().split("");

                const len = this.length - a.length;
                // 没超过12位数前面补0；超过就返回arr
                // "~"：没有数据
                const newData = len > 0 ? [...new Array(len).fill("~"), ...a] : a;
                target.data = newData;
                this.clockNode && this.rolling()
            }
            target[key] = value;
            return true
        },
    };

    rolling() {

        if (this.elements.type) {
            if (!this.clockNode.current.style.perspective) {
                // 设置 3d transforms
                TweenMax.set("#clock", { perspective: 3000 });
                TweenMax.set(".upper", { rotationX: 0.01, transformOrigin: "50% 100%" });
                TweenMax.set(".base.upper", { rotationX: -90, transformOrigin: "50% 100%" });
                TweenMax.set(".lower", { rotationX: 0.01, transformOrigin: "50% 0%" })
            }
            // childNodes 1、3为初始值的显示元素
            this.elements.data.forEach((newData, index) => {
                const {op, el} = this.getOperation(newData, index)
                if (el) {
                    const oldData = el.getAttribute("v");
                    if (newData === undefined) {
                        newData = oldData
                    }
                    if (oldData !== newData && el.childNodes.length) {
                        // 动画
                        el.childNodes[1].innerHTML = "<span>" + oldData + "</span>"; //start upper
                        el.childNodes[2].innerHTML = "<span>" + oldData + "</span>"; //start lower
                        el.childNodes[0].innerHTML = "<span>" + newData + "</span>"; //end upper
                        el.childNodes[3].innerHTML = "<span>" + newData + "</span>"; //end lower
                        TweenMax.fromTo(el.childNodes[0], .3, { alpha: 0 }, { alpha: 1, ease: Power4.easeIn });
                        TweenMax.fromTo(el.childNodes[1], .3, { rotationX: 0 }, { rotationX: -90, ease: Power1.easeIn });
                        TweenMax.fromTo(el.childNodes[3], .5 + .2 * Math.random(), { rotationX: 90 }, {
                            rotationX: 0,
                            ease: Bounce.easeOut,
                            delay: .3
                        });
                        TweenMax.fromTo(el.childNodes[2], .6, { alpha: 1 }, { alpha: 0, ease: Bounce.easeOut, delay: .3 });
                        el.setAttribute("v", newData);
                        setTimeout(() => {
                            el.classList[op[0]]("has-data"); // 用于小数点高亮
                            el.classList[op[1]]("no-data");
                        }, 200)
                    }
                }
            });
        } else {
            this.elements.data.forEach((newData, index) => {
                const {op, el} = this.getOperation(newData, index)
                if (el) {
                    el.classList[op[0]]("has-data"); // 用于小数点高亮
                    el.classList[op[1]]("no-data");
                    const oldData = el.getAttribute("v");
                    if (oldData !== newData) {
                        el.innerHTML = "<span>" + (newData == "~" ? 0 : newData) + "</span>";
                        el.setAttribute("v", newData);
                    }
                }
            });
        }
    }

    getOperation(newData, index) {
        const op = newData == "~" ? ["remove", "add"] : ["add", "remove"];
        const el = this.elements.cacheNodeMap.get(index);
        return { op, el }
    }

    differ() {
        const {
            startNum,
            endNum,
            part,
            preiod
        } = this
        // 一小时会跑几次数
        const difference = endNum - startNum;
        let share = 0;
        let pace = 0;
        if (difference) { // 异常处理
            share = preiod / part;
            pace = Math.floor(difference / share); // 幅度
        }
        this.share = share
        this.pace = pace
    }

    rEOp(r) {
        return this.elements.count + Math.floor(this.maxRandom * r)
    }

    random() {
        const { startNum, endNum, pace, share } = this;
        let r = Math.random();
        while (!r) {
            r = Math.random();
        }
        if (this.elements.prevStartNum !== startNum) {
            this.num = 0
        }
        this.elements.prevStartNum = startNum; // 上一次的
        if (endNum === startNum) { // 异常处理
            return this.rEOp(r)
        }
        if (this.num >= share && this.elements.prevStartNum === startNum) {
            // 完成一个回合的跑数
            // 并且下一回合的刷新程序已进行
            // 并且上一回合的 startNum 与 当前回合的 startNum
            return this.rEOp(r)
        }
        const currValue = startNum + pace * this.num + Math.floor(pace * r);
        if (currValue >= endNum) { // 异常处理
            return endNum
        }
        this.num++;
        return currValue
    }



    renderer(argus) {
        
        this.clockNode = argus.clockNode
        this.differ()
        this.elements.count = this.random()
    }

    destroy() {
        this.clockNode = null;
        this.num = 0;
    }
}

function reactive(target, hander) {
    const observed = new Proxy(target, hander);
    return observed
}

