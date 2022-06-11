'use strict';

const {
	open
} = require("fs");

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
	const appID = "wxb34c03abc4c8fefa"
	const secret = "ea15182a578d5c07e93c06c882ae6fcb"

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
			"nickName": "",
			"avatarUrl": ""
		}

		db.collection("user_main").add(userInfo)
	}

	//返回数据给客户端
	return userInfo
}

async function updateProfile(event, context) {
	

	const {
		userInfo
	} = event

	const db = uniCloud.database()
	const dbCmd = db.command

	var userInfo
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
			"nickName": "",
			"avatarUrl": ""
		}

		db.collection("user_main").add(userInfo)
	}

	//返回数据给客户端
	return userInfo
}