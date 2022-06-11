<template>
	<view class="container">
		<view class="box">
			<image :src="userInfo.avatarUrl" class="avatar"></image>
			<view class="nickname">{{userInfo.nickName}}</view>
			<button type="primary" size="mini" @click="updateProfile">同步微信信息</button>
		</view>
		<button type="warn" class="newBook" @click="createBookShelf">新建书房</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:{
					nickName: "",
					avatarUrl: ""
				}
			}
		},
		methods: {
			updateProfile() {
				uni.getUserProfile({
					desc: "我就是想获取你的用户信息",
					success: (res) => {
						this.userInfo = Object.assign(this.userInfo, res.userInfo)
						console.log(res)
						console.info("get the token:", getApp().globalData)
						
						uniCloud.callFunction({
							name: "doAction",
							data: {
								action: "updateProfile",
								userInfo: this.userInfo,
								token: getApp().globalData.token
							},
							success: (res) => {
								console.log(res)
							}
						})
					}
				})
			},
			createBookShelf() {
				console.info("navigateTo newBookShelf")
				uni.navigateTo({
					url: "NewBookShelf/NewBookShelf",
					fail: (err) => {
						console.error("navigateTo error:", err)
					},
					success: (res) => {
						console.info("navigate success:", res)
					}
				})
			}
		},
		onLoad() {
			uni.login({
				provider: "weixin",
				success: (res) => {
					var code = res.code;
					
					uniCloud.callFunction({
						name: "doAction",
						data: {
							action: "login",
							code: code
						},
						success: (res) => {
							console.log("res with token:", res)
							getApp().globalData.token = res.result.token
							console.info("have set the token:", getApp().globalData)
						}
					})
				}
			})
		}
	}
</script>

<style>
	.container {
		--tw-bg-opacity: 1;
		background-color: rgba(229, 231, 235, var(--tw-bg-opacity));
		height: 100vh;
	}

	.box {
		display: flex;
		flex-direction: column;
		padding: 0.5em 0;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid rgba(156, 163, 175, var(--tw-bg-opacity));
	}

	.avatar {
		width: 5em;
		height: 5em;
		--tw-bg-opacity: 1;
		background-color: rgba(156, 163, 175, var(--tw-bg-opacity));
		margin: 0.25em 0;
		border-radius: 9999px;
	}

	.newBook {
		margin: 0.5em 1em;
		border-radius: 9999px;
	}
</style>
