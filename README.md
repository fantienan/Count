# 滚动的数字

## dependency
- react
- gsap

## example

    ```js
        <Count 
            startNum={10000}
            endNum={20000}
            type={true}
        />
    ```

## api

```js
    /**
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
```

## 开发计划

【✔️】翻页滚动样式细节优化（未完成）

【✔️】发布npm包（未完成）