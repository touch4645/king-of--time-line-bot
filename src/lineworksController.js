function main() {
    console.info({method: arguments.callee.name, status: 'run'});
    //king of time インスタンスの生成 
    const kingOfTimeBot = createKingOfTimeBot();
  
    //メッセージ作成
    const actions = [{
        "type": "uri",
        "label": "打刻",
        "uri": "https://s2.kingtime.jp/independent/recorder/personal/"
    }];
  
    const content = {
      "type": "button_template",
      "contentText": "打刻しますか?",
      "actions": actions
    };

    const accountIds = getAccountIds();
    
    for (const accountId of accountIds) {
        kingOfTimeBot.sendMessage(accountId, content);
    }
    console.info({method: arguments.callee.name, status: 'success'});
}


function getAccountIds() {
    const array = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
    array.shift();
    return array.map(accountId => accountId[0]);
}


function createKingOfTimeBot() {
    //king of time インスタンスの生成 
    return new LineWorksBot(KING_OF_TIME_BOT_OPTIONS);
}
  
  
function putExternalBlowser(){
    console.info({method: arguments.callee.name, status: 'run'});
    //king of time インスタンスの生成 
    const kingOfTimeBot = new LineWorksBot(KING_OF_TIME_BOT_OPTIONS);

    kingOfTimeBot.isUseExternalBlowser(true);
    console.info({method: arguments.callee.name, status: 'success'});
}
  