function main() {
    console.info({method: arguments.callee.name, status: 'run'});
    //king of time botのenvファイルを呼び出し
    const kingOfTimeBotOption = setOptions();
  
    //king of time インスタンスの生成 
    const kingOfTimeBot = new LineWorksBot(kingOfTimeBotOption);
  
    //メッセージ作成
    const actions = [{
        "type": "uri",
        "label": "打刻",
        "uri": "https://s2.kingtime.jp/independent/recorder/personal/"
      }]
  
    const content = {
      "type": "button_template",
      "contentText": "打刻しますか?",
      "actions": actions
    }
  
  
    //スプレッドシートのアカウントIDを取得
    const array = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
    for (let row = 1; row < array.length; row++) {
      //アカウントID
      const accountId = array[row][0];
  
      //LineにメッセージをPOST送信
      console.log(accountId, kingOfTimeBot.sendMessage(accountId, content).getContentText());
    }
    console.info({method: arguments.callee.name, status: 'success'});
}
  
  
function putExternalBlowser(){
    console.info({method: arguments.callee.name, status: 'run'});
    //king of time botのenvファイルを呼び出し
    const kingOfTimeBotOption = setOptions();

    //king of time インスタンスの生成 
    const kingOfTimeBot = new LineWorksBot(kingOfTimeBotOption);

    kingOfTimeBot.isUseExternalBlowser(true);
    console.info({method: arguments.callee.name, status: 'success'});
}
  