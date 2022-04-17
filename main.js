function 铃声通知(播放时长, 音量) {
    var 音量 = 音量 || 60
    var 播放时长 = 播放时长 || 2000
    var 铃声 = android.media.RingtoneManager.TYPE_NOTIFICATION
    var mp = new android.media.MediaPlayer(); device.setMusicVolume(音量)
    mp.setDataSource(context, android.media.RingtoneManager.getDefaultUri(铃声));
    mp.prepare(); mp.start();
}
function 震动(vibrate_time) {
    var vibrate_time = vibrate_time || 2000
    device.vibrate(vibrate_time);
}


//抢菜流程
function robVeg() {
    launchApp("美团买菜");
    waitForPackage("com.meituan.retail.v.android", 200);
    auto.waitFor();
    const btn_skip = id("btn_skip").findOne();
    if (btn_skip) {
        btn_skip.click();
        toast("已跳过首屏广告");
    }
    sleep(2000);
    gotoBuyCar();
    sleep(2000);
    checkAll();
    sleep(2000);
    submitOrder(0);
}

robVeg();

//打开购物车页面
function gotoBuyCar() {
    if (id("img_shopping_cart").exists()) {
        id("img_shopping_cart").findOne().parent().click();
        toast("已进入购物车");
    } else {
        toast("没找到购物车");
        exit;
    }
}

//勾选全部商品
function checkAll() {
    const isCheckedAll = textStartsWith("结算(").exists();
    const checkAllBtn = text("全选").findOne();
    if (!!checkAllBtn) {
        !isCheckedAll && checkAllBtn.parent().click();
        sleep(1000);
    } else {
        toast("没找到全选按钮");
        exit;
    }
}

function submitOrder(count) {
    if (textStartsWith("结算(").exists()) {
        textStartsWith("结算(").findOne().parent().click();
    } else if (text("我知道了").exists()) {
        toast("关闭我知道了");
        text("我知道了").findOne().parent().click();
    } else if (text("重新加载").exists()) {
        toast("重新加载");
        text("重新加载").findOne().parent().click();
    } else if (text("极速支付").exists()) {
        text("极速支付").findOne().parent().click();
        铃声通知();
        震动();
        if (text("我知").exists()) {
            toast("关闭我知道了");
            text("我知道了").findOne().click();
        }
    } else {
        exit;
    }
    sleep(1300);
    if (count > 10000) {
        toast("没抢到");
        exit;
    }

    submitOrder(count++);
}
