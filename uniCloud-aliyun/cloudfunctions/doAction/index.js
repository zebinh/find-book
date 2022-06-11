'use strict';

const jwt = require('jsonwebtoken')

const appID = "wxb34c03abc4c8fefa"
const secret = "ea15182a578d5c07e93c06c882ae6fcb"

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)

	const {
		action
	} = event

	switch (action) {
		case 'login':
			return login(event, context)
		case 'updateProfile':
			return updateProfile(event, context)
		default:
			console.log('无动作')
	}

	//返回数据给客户端
	return event
};

async function login(event, context) {

	const {
		code
	} = event

	// 获取openid信息
	const res = await uniCloud.httpclient.request(
		"https://api.weixin.qq.com/sns/jscode2session?appid=" + appID + "&secret=" + secret +
		"&js_code=" + code + "&grant_type=authorization_code", {
			"dataType": "json"
		}
	)

	const openID = res.data.openid;

	console.log('openID:', openID)

	const db = uniCloud.database()
	const dbCmd = db.command

	var userInfo
	var dbRes = await db.collection("user_main").where({
		openID: dbCmd.eq(openID)
	}).get()
	console.info("dbRes:", dbRes)
	if (dbRes.affectedDocs > 0) {
		console.log("match exist user openid")
		userInfo = dbRes.data[0]
	} else {
		console.info("new add user")
		userInfo = {
			"appID": appID,
			"openID": openID,
			"nickName": "",
			"avatarUrl": ""
		}

		db.collection("user_main").add(userInfo)
	}
	
	const token = jwt.sign(userInfo, secret, {})
	
	//返回数据给客户端
	event.userInfo = userInfo
	event.token = token 
	
	return event
}

async function updateProfile(event, context) {
	var {
		userInfo, token
	} = event
	
	var decodeData = await jwt.verify(token, secret, (err, data) => {
		if (!err) {
			console.info("the token decode:", data)
			return data
		}
	})
	console.info("the decodeData is:", decodeData)
	var openID = decodeData.openID

	const db = uniCloud.database()
	const dbCmd = db.command

	var dbRsp = db.collection("user_main").where({
		openID: dbCmd.eq(openID)
	}).get()
	if (dbRsp.affectedDocs > 0) {
		console.log("match exist user openid")
		userInfo = dbRsp.data[0]
	} else {
		userInfo = {
			"appID": appID,
			"openID": openID,
			"nickName": userInfo.nickName,
			"avatarUrl": userInfo.avatarUrl
		}

		db.collection("user_main").where({openID: dbCmd.eq(userInfo.openID)}).update(userInfo)
	}

	//返回数据给客户端
	return userInfo
}