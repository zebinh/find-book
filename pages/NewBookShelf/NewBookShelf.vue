<template>
	<view>
		<view class="baseForm">
			<!-- 基础用法，不包含校验规则 -->
			<uni-forms ref="baseForm" :modelValue="baseFormData">
				<uni-forms-item lrequired>
					<uni-easyinput v-model="baseFormData.name" placeholder="请输入书房名称" />
					<view @click="btnChooseLoc">{{address}}</view>
				</uni-forms-item>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				address: "请选择地址",
				latitude: "",
				longitude: ""
			}
		},
		methods: {
			btnChooseLoc() {
				console.info("btnChooseLoc touch")
				uni.getLocation({
					success: (res) => {
						uni.chooseLocation({
							latitude: res.latitude,
							longitude: res.longitude,
							success: (res) => {
								this.address = res.address + res.name
								this.latitude = res.latitude
								this.longitude = res.longitude
							}
						})
					}
				})
			}
		}
	}
</script>

<style>
	.baseForm {
		margin: 1em 0.5em;
	}
</style>
