# docker 的安装

```sh
sudo apt update
sudo apt upgrade
apt-get install ca-certificates curl gnupg lsb-release
curl -fsSL http://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] http://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable"
apt-get install docker-ce docker-ce-cli containerd.io
```

# docker 换源

一般不需要换源:

```
mkdir -p /etc/docker
vim /etc/docker/daemon.json
```

文件内容:

```json
{
  "registry-mirrors": ["https://590cgtfw.mirror.aliyuncs.com"]
}
```

重载

```sh
sudo systemctl daemon-reload
sudo systemctl restart docker
```

# 安装 domjudge

配置数据库:

```sh
docker run -d -it --name dj-mariadb -e MYSQL_ROOT_PASSWORD=114514 -e MYSQL_USER=domjudge -e CONTAINER_TIMEZONE=Asia/Shanghai -e MYSQL_PASSWORD=114514 -e MYSQL_DATABASE=domjudge -p 13306:3306 mariadb --max-connections=1000 --max-allowed-packet=102400000 --innodb-log-file-size=202400000
```

上面指令中, 两个密码都设为了 `114514`.

部署 server:

```sh
docker run --link dj-mariadb:mariadb -d -it -e MYSQL_HOST=mariadb -e MYSQL_USER=domjudge -e MYSQL_DATABASE=domjudge -e CONTAINER_TIMEZONE=Asia/Shanghai -e MYSQL_PASSWORD=114514 -e MYSQL_ROOT_PASSWORD=114514 -p 80:80 --name domserver domjudge/domserver:7.3.3
```

仍然两个密码是 `114514`.

到这里应该已经可以访问 domjudge 主页了. [比如](http://47.120.50.180/public)

# 保存密码

```sh
docker exec -it domserver cat /opt/domjudge/domserver/etc/initial_admin_password.secret
docker exec -it domserver cat /opt/domjudge/domserver/etc/restapi.secret
```

输出

```
eBcCwdC9lZPvDGjE
# Randomly generated on host 4e40c8419ec9, Mon Mar 24 15:28:02 CST 2025
# Format: '<ID> <API url> <user> <password>'
default http://localhost/api    judgehost       KlU0TPDyQowaxlXS
```

用输出的管理员密码 `eBcCwdC9lZPvDGjE` 可以用 `admin` 的用户名登录系统. 进去之后在 `user` 选项卡把 `dummy` 的密码改成 `114514`.

# 配置评测机

把文件 `/etc/default/grub` 的 `GRUB_CMDLINE_LINUX_DEFAULT` 值编辑为 `"quiet cgroup_enable=memory swapaccount=1 systemd.unified_cgroup_hierarchy=0"` (这里禁用了cgroupv2). 更新设置:

```sh
update-grub
```

然后配置 judgehost:

```sh
docker run -d -it --privileged --cgroupns=host -v /sys/fs/cgroup:/sys/fs/cgroup:rw --name judgehost-0 --link domserver:domserver --hostname judgedaemon-0 -e DAEMON_ID=0 -e JUDGEDAEMON_PASSWORD=KlU0TPDyQowaxlXS -e CONTAINER_TIMEZONE=Asia/Shanghai domjudge/judgehost:7.3.3
```

中间 `JUDGEDAEMON_PASSWORD` 的值是上一步输出的 `judgehost` 的 API Key.

原帖的 `/sys/fs/cgroup:/sys/fs/cgroup:rw` 最后是 `ro` 真是把我害惨了.

这时候出现了一个评测机 `judgedaemon-0-0`. 可以评测 cpp 提交.

# 设置自动启动

先取得容器的 id:

```sh
docker stats
```

得到了这样的输出:

```
CONTAINER ID   NAME          CPU %     MEM USAGE / LIMIT    MEM %     NET I/O           BLOCK I/O         PIDS 
76ada7ecace5   judgehost-0   0.00%     75.89MiB / 3.48GiB   2.13%     86.8kB / 44.9kB   128MB / 4.53MB    3 
4e40c8419ec9   domserver     0.02%     382MiB / 3.48GiB     10.72%    5.87MB / 1.91MB   128MB / 5.76MB    45 
13e46b921947   dj-mariadb    0.02%     107.8MiB / 3.48GiB   3.02%     1.68MB / 5.73MB   58.7MB / 1.47MB   11
```

第一个字段就是 id, 然后将它们设为自动重启.

```sh
docker update --restart always 76ada7ecace5
```

