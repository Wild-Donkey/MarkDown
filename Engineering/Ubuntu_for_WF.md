# Ubuntu for World Final

[icpc 官方文档](https://image.icpc.global/icpc2024/ImageBuildInstructions.html)

## 配置 Domjudge 客户端

```sh
sudo apt install python3 python3-requests python3-magic
```

在 github 找到 `submit`, `https://github.com/DOMjudge/domjudge/blob/main/submit/submit`, 下载下来丢进 `/usr/local/bin`.

改权限:

```sh
sudo chmod +x /usr/local/bin/submit
```

在用户的 `home` 中新建文件 `~/.netrc`, 内容为:

```
machine http://47.115.231.17 login dummy password 114514
```

## 关于虚拟机

环境: VMware Workstation Pro 17

