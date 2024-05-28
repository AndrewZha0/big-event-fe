<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { updateUserPwdService } from '@/api/user.js'
import { useTokenStore } from '@/stores/token.js'
import { useUserStore } from '@/stores/userInfo.js'
import router from '@/router'

const tokenStore = useTokenStore()
const userStore = useUserStore()

const pwdModel = ref({
    old_pwd: '',
    new_pwd: '',
    re_pwd: ''
})

const checkPassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('Please input new password again'))
    } else if (value !== pwdModel.value.new_pwd) {
        callback(new Error("Two inputs don't match!"))
    } else {
        callback()
    }
}
const rules = {
    old_pwd: [
        { required: true, message: 'Please input old password', trigger: 'blur' },
        { min: 5, max: 16, message: 'Length should be 5 to 16', trigger: 'blur' },
    ],
    new_pwd: [
        { required: true, message: 'Please input new password', trigger: 'blur' },
        { min: 5, max: 16, message: 'Length should be 5 to 16', trigger: 'blur' },
    ],
    re_pwd: [
        { validator: checkPassword, trigger: 'blur' }
    ]
}
const updateUserPwd = async () => {
    let result = await updateUserPwdService(pwdModel.value)
    ElMessage.success(result.message ? result.message : '修改成功,请重新登录')
    //清空pinia中的token和个人信息
    tokenStore.removeToken()
    userStore.removeUser()
    //跳转到登录页
    router.push('/login')
}
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>重置密码</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="pwdModel" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="原密码" prop="old_pwd">
                        <el-input type="password" v-model="pwdModel.old_pwd"></el-input>
                    </el-form-item>
                    <el-form-item label="新密码" prop="new_pwd">
                        <el-input type="password" v-model="pwdModel.new_pwd"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="re_pwd">
                        <el-input type="password" v-model="pwdModel.re_pwd"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserPwd()">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>