/*
  GASのトリガーでは、日毎に設定できるのは時間単位（例：0~1時）までで、分単位の設定はできません。
  そこで、setTriggerDay()を毎日23〜24時の間に実行するようにして、
  setTriggerDay()によって翌日の0時0分にトリガー設定されたsetTriggerTimer()が、
  0時0分を起点として何分後にsendSlack()のトリガーを設定するようにしています。
  */ 

const TODAY = new Date();

// 【日次実行】スプレッドシートの内容に応じて、該当する営業日のトリガーをセットする
function setTriggerTimer() {
  console.info({method: arguments.callee.name, status: 'run'});
  deleteTrigger('main');

  const todayBizDay = isBusinessDays();  // 今日の営業日数をセット

  if (todayBizDay == 0) {
   return;  // 今日は休業日のため、処理を終了
  }

  setTrigerMain(8, 50);
  setTrigerMain(18, 0);
  console.info({method: arguments.callee.name, status: 'success'});
}


function setTrigerMain(hour, minute){
  console.info({method: arguments.callee.name, status: 'run'});
  const time = new Date();
  time.setHours(hour);
  time.setMinutes(minute);

  ScriptApp.newTrigger("main")
    .timeBased()
    .at(time)
    .create();
  console.info({method: arguments.callee.name, status: 'success', trigger_date: time});
}


// 既存トリガーを削除する
function deleteTrigger(name) {
  console.info({method: arguments.callee.name, status: 'run'});

  const triggers = ScriptApp.getProjectTriggers();
  for(var i=0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() == name) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  console.info({method: arguments.callee.name, status: 'success', delete_trigger: name});
}


// 今日が営業日の何日目かを求める
function isBusinessDays() {
  console.info({method: arguments.callee.name, status: 'run'});

  let bizday = 0;

  let day = TODAY.getDay();  // Dateオブジェクトから曜日を求めるメソッド(0:日, 6:土曜日)

  // 今日が休業日の場合は、0を返す。
  if (checkHolidays(TODAY)) {  // 土曜日または日曜日または日本の祝日または会社休業日かどうか
    console.info({method: arguments.callee.name, status: 'success', response: 0});
    return 0;
  }

  for (let i = 1; i <= TODAY.getDate(); i++) {

    const countDayOfMonth = new Date(TODAY.getFullYear(), TODAY.getMonth(), i);  //　次の日をセット

    if (checkHolidays(countDayOfMonth)) {  // 土曜日または日曜日または日本の祝日または会社休業日かどうか
      continue;
    } else {
      bizday++;  // 営業日をカウントアップ
    }
  }
  console.info({method: arguments.callee.name, status: 'success', response: bizday});
  return bizday;  // 営業日を返す
}


function checkHolidays(date){
  console.info({method: arguments.callee.name, status: 'run'});
  const day = date.getDay();  // Dateオブジェクトから曜日を求めるメソッド(0:日, 6:土曜日)
  if(day == 0){
    console.info({method: arguments.callee.name, status: 'success', holiday: 'Sunday'});
    return true;
  }else if(day == 6){
    console.info({method: arguments.callee.name, status: 'success', holiday: 'Saturday'});
    return true;
  }else if(isHoliday(date)){
    console.info({method: arguments.callee.name, status: 'success', holiday: 'Holiday'});
    return true;
  }else if(isCompanyHoliday(date)){
    console.info({method: arguments.callee.name, status: 'success', holiday: 'CompanyHoliday'});
    return true;
  }else{
    console.info({method: arguments.callee.name, status: 'success', holiday: 'None'});
    return false
  }
}


// 日本の祝日チェック
function isHoliday(date) {
  console.info({method: arguments.callee.name, status: 'run'});

  const startDate = new Date(date.setHours(0, 0, 0, 0));
  const endDate = new Date(date.setHours(23, 59, 59));
  const cal = CalendarApp.getCalendarById("ja.japanese#holiday@group.v.calendar.google.com");  // [日本の祝日]を取得
  const holidays =  cal.getEvents(startDate, endDate);

  const result = holidays.length != 0; // 祝日ならtrue 

  console.info({method: arguments.callee.name, status: 'success', response: result});
  return result;
}


// 会社休業日チェック
function isCompanyHoliday(date) {
  console.info({method: arguments.callee.name, status: 'run'});

  let isCompanyHoldayFlag = false;

  const dayStr = date.getFullYear() + ":" + (date.getMonth()+1) + ":" + date.getDate();

  const companyHoliday0102 = TODAY.getFullYear() + ":1:2";  // 年始休暇（1/2）
  const companyHoliday0103 = TODAY.getFullYear() + ":1:3";  // 年始休暇（1/3）

  if (dayStr == companyHoliday0102 || dayStr == companyHoliday0103 ) {
    isCompanyHoldayFlag = true;
  }
  console.info({method: arguments.callee.name, status: 'success', response: isCompanyHoldayFlag});
  return isCompanyHoldayFlag; // 休業日ならtrue
}
