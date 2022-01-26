class LineWorksBot {
  constructor(botOption){
    this.botNo = botOption.botNo;
    this.consumerKey = botOption.consumerKey;
    this.apiId = botOption.apiId;
    this.serverId = botOption.serverId;
    this.privateKey = botOption.privateKey;
  }

  //JWTの生成
  _getJwtToken(){
    console.info({method: 'getJwtToken', status: 'run'});
    const header = Utilities.base64Encode( JSON.stringify({"alg":"RS256","typ":"JWT"}), Utilities.Charset.UTF_8 );
    const claimSet = JSON.stringify({
      "iss": this.serverId,
      "iat": Math.floor(Date.now() / 1000),
      "exp": Math.floor(Date.now() / 1000 + 2000)
    });
    
    const encodeText = header + "." + Utilities.base64Encode(claimSet, Utilities.Charset.UTF_8).slice(0, -2);
    const signature = Utilities.computeRsaSha256Signature(encodeText, this.privateKey);
    const jwtToken = encodeText + "." + Utilities.base64Encode(signature).slice(0, -2);
    console.info({method: 'getJwtToken', status: 'success', response: jwtToken});

    return jwtToken;
  }

  //アクセストークンの生成
  _getAccessToken(){  
    console.info({method: 'getToken', status: 'run'});
    //JWTの生成
    const jwtToken = this._getJwtToken();
    
    //トークンの生成
    const uri = `https://auth.worksmobile.com/b/${this.apiId}/server/token`;
    const payload = {
      "grant_type" : encodeURIComponent("urn:ietf:params:oauth:grant-type:jwt-bearer"),
      "assertion" : jwtToken
    };
    
    const options = {
      'method': 'post',
      'headers': {'Content-Type' : 'application/x-www-form-urlencoded'},
      "payload": payload
    };
    
    const body = UrlFetchApp.fetch(uri, options);
    const jsonData = JSON.parse(body);  
    const accessToken = jsonData.access_token;
    console.info({method: 'getToken', status: 'success', response: accessToken});

    return accessToken;
  }

  //LineにPOST
  sendMessage(accountId, content){
    console.info({method: 'sendMessage', status: 'run'});
    const url = `https://apis.worksmobile.com/r/${this.apiId}/message/v1/bot/${this.botNo}/message/push`;

    //LINE WORKS通知文の生成
    const payload = {
      "accountId": accountId,    
      "content": content
    };
  
    const headers = {
      "Content-Type" : 'application/json; charset=utf-8',
      "consumerKey"   : this.consumerKey,
      "Authorization" : 'Bearer ' + this._getAccessToken()
    };

    const options = {
      "method" : 'post',
      "headers" : headers,
      "payload" : JSON.stringify(payload)
    };

    const response = UrlFetchApp.fetch(url, options);
    const responseText = response.getContentText();
    const code = response.getResponseCode();

    console.info({method: 'sendMessage', status: 'success', response: responseText, code: code});
    return response;
  }

  //スマホアプリで既存ブラウザを適用する設定
  isUseExternalBlowser(bool){
    console.info({method: 'isUseExternalBlowser', status: 'run'});
    const url = `https://apis.worksmobile.com/r/${this.apiId}/admin/v1/domains/10346317/config/externalBrowser?domainId=10346317`;

    //LINE WORKS通知文の生成
    const payload = {
      "isUse" : bool
    };
  
    const headers = {
      "Content-Type" : 'application/json; charset=utf-8',
      "consumerKey"   : this.consumerKey,
      "Authorization" : 'Bearer ' + this._getAccessToken()
    };

    const options = {
      "method" : 'put',
      "headers" : headers,
      "muteHttpExceptions" : true,
      "payload" : JSON.stringify(payload)
    };

    const response = UrlFetchApp.fetch(url, options);
    const responseText = response.getContentText();
    const code = response.getResponseCode();

    console.info({method: 'isUseExternalBlowser', status: 'success', response: responseText, code: code});
    return response;
  }

}