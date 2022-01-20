/*
  GASのトリガーでは、日毎に設定できるのは時間単位（例：0~1時）までで、分単位の設定はできません。
  そこで、setTriggerDay()を毎日23〜24時の間に実行するようにして、
  setTriggerDay()によって翌日の0時0分にトリガー設定されたsetTriggerTimer()が、
  0時0分を起点として何分後にsendSlack()のトリガーを設定するようにしています。
*/ 
// 【日次実行】スプレッドシートの内容に応じて、該当する営業日のトリガーをセットする
function setTriggerTimer() {
  console.info({method: arguments.callee.name, status: 'run'});
  deleteTrigger('main');
  const today = new Date();

  if ( isCompanyHoliday(today) ) {
    return;
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
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() == name) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  console.info({method: arguments.callee.name, status: 'success', delete_trigger: name});
}


// 会社休業日チェック
function isCompanyHoliday(date) {
  console.info({method: arguments.callee.name, status: 'run'});

  const startDate = new Date(date.setHours(0, 0, 0, 0));
  const endDate = new Date(date.setHours(23, 59, 59));

  // 「リリー　休業日」の今日のイベントを取得
  // 休日の場合はイベントがある
  const events = CalendarApp.getCalendarById("c_aguhmn5sn8v3sjjk6am3t8gjms@group.calendar.google.com").getEvents(startDate, endDate);

  const result = events.length > 0; // 祝日ならtrue 

  console.info({method: arguments.callee.name, status: 'success', response: result});
  return result;
}
