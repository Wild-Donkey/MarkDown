# 滚榜

[中文文档](https://github.com/cn-xcpc-tools/cn-xcpc-docs/blob/master/resolver.md)

[参考教程](https://vingying.github.io/2024/09/04/domjudge-icpctool/)

[下载工具](https://github.com/icpctools/icpctools/releases)

> Udt: Panda 说建议用 [2.5.940](https://github.com/icpctools/icpctools/releases/tag/v2.5.940)

## Contest Data Server

Domjudge 上创建用户, 权限给 `API reader`、`API writer`、`Source code reader`. (也可以直接用 admin)

也是用的 [2.5.940](https://github.com/icpctools/icpctools/releases/download/v2.5.940/wlp.CDS-2.5.940.zip)

等配好服务器再说罢.

## 下载 final-feed

Contests 里面, freeze, end, 然后 finalize. 查看比赛的 id, 例如 `c2`, 那么就把 `2` 填入下面网址 `contests` 后面的字段.

去下面的链接下载 final 文件. (前面的 ip 是 Domjudge 服务器的)

```
http://47.120.66.238/api/contests/2/event-feed?stream=false
```

## windows上的滚榜

```bat
./awards.bat C:/Work/resolver-2.4.727/events_final.xml --medals 10 20 30 --rank 3 --fts true true
./awards.bat C:/Work/resolver-2.4.727/event-feed --medals 10 20 30 --rank 3 --fts true true
```

`--medals` 后面三个数字是金银铜的数量.

`--fts` 是颁发一血奖

## Contest Data Package

用来加照片.

```
.
├── config              // 非必需
│   ├── contest.yaml    // 从domjudge Import/export页面导出即可
│   ├── groups.tsv      // 从domjudge Import/export页面导出即可
│   ├── problemset.yaml
│   └── teams.tsv       // 从domjudge Import/export页面导出即可
├── contest
│   ├── banner.png      // resolver无用，但在cds放置于此就可显示banner
│   └── logo.png        // resolver主页面的图片&无照片队伍的默认照片
├── event-feed.ndjson   // 滚榜数据
├── groups              // Categories照片，但在resolver似乎没起到作用
│   └── 3               // Categories的id
│       └── logo.png
├── organizations       // Affiliations照片，只要某Affiliations的队伍有logo，其他同Affiliations的队伍就都是该logo
│   ├── 3000            // 该Affiliations所对应的任一队伍的icpc id
│   │   └── logo.png
│   ├── 3001
│   │   └── logo.png
│   ├── 3012
│   │   └── logo.png
│   ├── 3017
│   │   ├── country_flag.png    // 照源码里是这样放置的，但在resolver似乎没起到作用
│   │   └── logo.png
│   └── 3187
│       └── logo.png
└── teams               // 队伍照片
    ├── 3000            // 队伍的icpc id
    │   └── photo.png   // 照片名字固定是photo
    ├── 3001
    │   └── photo.png
    ├── 3009
    │   └── photo.png
    └── 3010
        └── photo.png
```

## 滚榜

```bat
$env:ICPC_FONT="DengXian"
```

改字体环境变量是为了显示中文.

```bat
./resolver.bat C:/Work/resolver-2.4.727/events_final.xml --display_name "{team.display_name}（{org.formal_name}）" --fast 0.15
./resolver.bat C:/Work/resolver-2.4.727/events_final-awards.json --display_name "{team.display_name}（{org.formal_name}）" --fast 0.15
./resolver.bat C:/Work/resolver-2.4.727/event-feed --display_name "{team.display_name}（{org.formal_name}）" --fast 0.15
./resolver.bat C:/Work/resolver-2.5.940/TestCDP/ --display_name "{team.display_name}（{org.formal_name}）" --fast 0.15
```

可以传入 `xml` 用原始数据来滚, 也可以用前面 `awards` 生成的 `json` 来滚, 这样可以重新设置奖项.

加照片: 用 CDP.

- `Ctrl+Q` 退出
- `Space`/`F` 下一步
- `R`/`B` 上一步
- `0` 重新开始
- `2` 快进(按住)
- `1` 快退(按住)
- `+/=`/`up` 加速
- `-/_`/`down` 减速
- `J` 重置速度
- `P` 暂停滚动 (只暂停屏幕上下滚动, 不暂停滚榜)
- `I` 类似于 `--info` 选项

一开始按 `F`, 显示 4 小时榜, 然后再按 `F` 把 4 小时榜从顶滚动到底 (这时候不能用 `+-` 控制速度), 自动将下面的队的提交滚出来, 这时候可以用 `+-` 控制速度, 但是不要狠狠按. 到铜牌会停, 然后开始手动一步步地滚, 可以按住 `2` 快进.

## 内存不足

```
Exception in thread "AWT-EventQueue-0" java.lang.OutOfMemoryError: Java heap space
```

这里需要改大内存, 在 `resolver.bat/sh` 里有 `java -Xmx1024m`, 数字即为内存的大小, 改成 `4096`