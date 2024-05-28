<script setup>
import { PictureFilled, Upload } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import avatar from '@/assets/avatar.jpg'
import { useUserStore } from '@/stores/userInfo.js'
import { useTokenStore } from '@/stores/token.js'
import { updateUserAvatarService } from '@/api/user.js'


const userStore = useUserStore()
const tokenStore = useTokenStore()

const uploadRef = ref()
//用户头像地址
const imgUrl = ref(userStore.user.userPic)

//图片上传成功的回调
const uploadSuccess = (result) => {
    //回显图片
    imgUrl.value = result.data
}
const updateAvatar = async () => {
    let result = await updateUserAvatarService(imgUrl.value)
    ElMessage.success(result.message ? result.message : '修改成功')
    //更新pinia中的数据
    userStore.info.userPic = imgUrl.value
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>更换头像</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-upload ref="uploadRef" class="avatar-uploader" :show-file-list="false" :auto-upload="true"
                    action="/api/file" name="file" :headers="{ 'Authorization': tokenStore.token }"
                    :on-success="uploadSuccess">
                    <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                    <!-- <img v-else :src="avatar" width="278" /> -->
                    <el-icon v-else class="avatar-uploader-icon">
                        <PictureFilled />
                    </el-icon>
                </el-upload>
                <br />
                <el-button type="primary" :icon="Plus" size="large" @click="uploadRef.$el.querySelector('input').click()">
                    选择图片
                </el-button>
                <el-button type="success" :icon="Upload" size="large" @click="updateAvatar()">
                    上传头像
                </el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<style lang="scss" scoped>
.avatar-uploader {
    :deep() {
        .avatar {
            width: 278px;
            height: 278px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 278px;
            height: 278px;
            text-align: center;
        }
    }
}
</style>