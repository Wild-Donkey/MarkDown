---
title: CSP-S 2020 爆零记
date: 2020-11-11 17:29
categories: Contests
thumbnail: https://s2.loli.net/2022/05/22/2UIMu14nP5eljba.png
---
# CSP2020 S-2 爆零(日)记

**有些时候你嘲笑的那些行为, 一定有可能成为你自己的行为**

## 先说结果

山东高一老年选手, 在考前曾多次嘲笑本级部模拟带师和暴力带师, 在模拟赛结束后讽刺挖苦因 `freopen()` 或文件名出锅而爆零的同志, 结果万万没想到, **出来混, 迟早是要还的!**

$4H$ 只打了 T1, 结果下发程序后, 我的 `julian.cpp` 里出现了这样的一句:

```cpp
freopen("julian3.in", "r", stdin);
freopen("julian.out", "w", stdout);
```

**喜爆零**

## 考前准备

停课三天, 复习了好多算法和数据结构, 并且都将板子和易出锅的地方打了一遍, 甚至写成了长篇大论的材料, 打印了出来, 供线下复习用.[(材料链接)](https://www.luogu.com.cn/blog/Wild-Donkey/wd-di-csp-s-2020-zhun-bei)

在去日照的火车上, 为了不浪费试机时间, 在火车上测试 $20min$ 能打出的极限正确码量, 反复查看自己的板子要点.

总结了自己之前模拟赛出锅的原因汇总, 但是没有因这类低端操作爆零过.

车上发了一条说说:

>古代剑客们在与对手狭路相逢时，无论对手有多么的强大，就算对手是天下第一剑客，明知不敌，也要亮出自己的宝剑。即使是倒在对手的剑下，也虽败犹荣，这就是亮剑精神，这就是信息之光

## 考试过程

### 试机

进考场后就开始打缺省源+对拍, $20min$ 打出, 这时发了解压密码, 被**禁止**打代码.

开始读题, 一直害怕像 [能量项链]() 那年 T1 就是区间DP, 结果发现是模拟, 还是没有那么多限制条件, 函数巨多的模拟.

再看数据范围, 年数 $10^9$, 不就是给天数开 `long long` 吗? 我分别取模就是常数巨大的 $O(1)$, 今年 T1 两分钟切了, 看 T2去, 发现就是一个位运算, 应该不会像之前模拟赛一样 2H 打暴力, 但是没时间看了, 也就没切掉.

> "欸, 不错, 今年题水"

这时时间已经来到 $14:30$

### T1

一开始就打 T1, 觉得半小时能打出来, 结果又半小时过了第一个样例, 感觉不对, 今年 T1 不是那么简单, 接着打公元后的情况, 这时时间已经来到 $1H$.

接下来的时候走了弯路, 因为理解成公元后就 $400$ 年一闰, 所以半小时打完调不出来, 半小时手模几遍样例二, 感觉样例错了 (我当时怎么敢的), 然后发现已经 $2H$ 了.

去看 T2, 发现满脑子都是 T1, 打了两个小函数就打不下去了, 回去看 T1, 时间大约到了 $2.5H$.

回来后读题发现是 $1582$ 年之后才 $400$ 年一闰, 于是恍然大悟, 改完了 $1582$ 之前, 打出 $1582$ 之后, 已经 $3.5H$ 了, ~~轻松~~通过过样例二.

测样例三, 在出锅的几天对取年数, 算天数的地方增增减减, 最后过了样例三, 可是 `fc` 报错, 但是数字一字不差, 感觉疑惑.

至此, 还有 $5min$ 收卷.

赶紧给 T2 输出 `6`, 因为 $2018$ 年普及组曾经 T3 输出 `6` 骗了 `20pts`, T4 输出 `3` 骗了 `30pts` (我能吹三年).

反复检查有没有 `freopen()` 注释了或者输出调试信息了, 最后又测了一下 T1 大样例时间, `0.5s`过, 问题不大, 删了 `julian3.in` 的 `3`, 关上 Dev-C++, 清空文件夹, 一切就像自己写的注意事项里一样按部就班.

收卷后, 左边兄弟的草稿纸上留下两行字, 貌似是问候 T1 出题人的, 表达了自己被送退役的无奈和沮丧之情, 我看了和他会心一笑 (苦笑).

这哥们问我:

> 兄弟 T1 打出来了吗?

我:

> 哎, 最后 $5min$ 特判过了大样例, 不知能不能过

他:

> 太巨了, %%%

~~说实在的我当时还有点同情他 $4H$ 写 T1 还没过大样例~~

## 当晚

出考场后, 听说 T2 是签到题, T4 $30pts$ 右手就行, T1 公元前有 $40pts$.

所以本校已知所有人期望得分都比我理论最高分高.

然后告诉家长这个好消息, 家长以为我在装弱, 劝我等成绩出来再说, 但是我自己明白 4H 困在 T1 有多傻.

为了缓解忧愁, 晚上去同学的房间打游戏$_{(factorio, 然后被同学鄙视不敢与人斗, 只能与天斗)}$到 $00:00$, 在他们表示自己得不了 $100pts$ 而我能 AC T1 后, 坦然入梦.

结果梦见出成绩他们都 $200pts+$, 就我 $50pts$ 躲在角落哭泣.

>"我要是真得了 50pts 怎么办?"

事后还听[另一个兄弟](https://www.luogu.com.cn/user/306982)说他梦见我考了 $300+$, 他 $100+$, 然后我疯狂嘲讽他 `"辣鸡XMZ"`, 不爽了一晚上.

## 第二天

在火车上晚了一路 $factorio$, 没心没肺地以为自己只要 AC T1 就能省一.

回家后告诉家里人, 结果被说自己过于实在而且骄傲 (我自己也是这么想的)

但是仍然被劝说:

> "反正你把 T1 做出来了, 怎么样都能进 NOIp2020."

我竟然还发说说:

> 我只要爆零了我就转物理奥赛

## $11.9$ 机房

[一扶苏一](https://www.luogu.com.cn/user/65363) 用民间数据测试省里的程序, 我报上自己的考号, 看到了爆零的结果, 一查程序才看到开头那段令人揪心的代码.

当时有一种不真实感, 反复回忆, 想到是不是最后少按了一个 `Ctrl` + `S`, 最讽刺的是我的总结里不光有 `Ctrl` + `S`, 还有 `Ctrl` + `Shift` + `S`

看着其他人也去查分, 自己站在一旁, 脑子一片空白, 当桌前从喧嚣的一圈人变成只剩扶苏一个时, 我才发现汗水早已浸湿了我的衣服.

询问扶苏我的输出 `6` 没有写挂后, 便从网上通知了家长, 天知道我是怎么解释为什么我 T1 是无论如何是不可能有分的. 我是用怎样的心情用文字告诉我家长

> "`freopen()` 写错一个字符, 评测机就找不到你的输出/程序找不到输入了, 不可申诉"

## $11.9$ 夜

在宿舍翻来覆去睡不着, 脑子里很乱, 躺在床上, $5min$ 切掉普及组 T4, 可能这就是黯然销魂剑的体现吧, 但是据说是水题, 所以便不去想.

回想起当时在队里讲话:

> "不要在一棵树上吊死, 也不要忘了检查 `freopen()`"

**简直是笑话**

同学劝我还有推荐名额, 但还有学长爆零, 他们都比我强, 所以估计今年没机会了.

想到自己说爆零就转物理奥赛, 结果事到如今, 又舍不得了.

## $11.10$ 机房

据说这次有好多人爆零, CCF 可能会允许部分爆零者参加 NOIp2020, 而我估计我应该是爆零的人里面的初赛全省第一, 所以又抱有了一些希望.

之前据说爆零的学长貌似又有分了, 事情有了转机.

## $11.11$ 午休

[有位兄弟](https://www.luogu.com.cn/user/307042) 提醒我在去日照的火车上, 他提醒我莫要碰掉他的手机, 可是我在脱衣服, 所以话音没落他手机先落. 一气之下诅咒我 CSP2020 爆零.

于是, 他的诅咒生效了.

## $11.11$ 机房

得知山东已经有 $500+$ 人爆零了, 竟然有一种幸灾乐祸的感觉.

## $11.20$ 午餐

听说这次的名单是没爆零的人和 `NOI Online` 前 $25\%$ 的人能参加, 回想起 `NOI Online` 由于未知原因爆零 (据说当时一批人蜜汁爆零), 心里暗道不好, 但是不愿相信这个事实.

## $11.20$ 机房

名单已出, 我被证实无缘 `NOIp2020`, 当时很难受, 但是由于提前有心理准备, 所以相对心理波动小一些.

## 事后

找了几个老朋友和舍友聊这件事, 他们有的劝我还有明年, 有的咒骂 `CaoCaoFuck`, 还有的用文化课成绩告诉我二者不可得兼. 我最后没有履行爆零转物理的 Flag, 做出了一个艰难的决定: 闭关一年, 学习省选内容, 继续之前的计划.

>古代剑客们在与对手狭路相逢时，无论对手有多么的强大，就算对手是天下第一剑客，明知不敌，也要亮出自己的宝剑。即使是倒在对手的剑下，也虽败犹荣，这就是亮剑精神，这就是信息之光

只要有一点可能, 我就不会放弃.

**明年再见!**

## **完**