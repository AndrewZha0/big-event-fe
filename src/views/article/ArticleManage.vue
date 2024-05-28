<script setup>
import { Edit, Delete, PictureFilled } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import cover from '@/assets/cover.jpg'
import { listCategoryService } from '@/api/category.js'
import { listArticleService, addArticleService, updateArticleService, deleteArticleService } from '@/api/article.js'
import { useTokenStore } from '@/stores/token.js'

// token
const tokenStore = useTokenStore()
//文章分类数据模型
const categorys = ref([])
//用户搜索时选中的分类id
const categoryId = ref('')
//用户搜索时选中的发布状态
const state = ref('')
//文章列表数据模型
const articles = ref([])
//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数
//控制抽屉是否显示
const visibleDrawer = ref(false)
//添加表单数据模型
const articleModel = ref({
    title: '',
    categoryId: '',
    coverImg: '',
    content: '',
    state: ''
})
//添加&修改弹窗标题
const title = ref('')
//添加文章表单校验
const rules = {
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
    ],
    categoryId: [
        { required: true, message: '请选择文章分类', trigger: 'blur' },
    ],
    content: [
        { required: true, message: '请输入文章内容', trigger: 'blur' },
    ]
}

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
    pageSize.value = size
    articleList()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
    pageNum.value = num
    articleList()
}

const categoryList = async () => {
    let result = await listCategoryService()
    categorys.value = result.data
}
const articleList = async () => {
    let params = {
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        categoryId: categoryId.value ? categoryId.value : null,
        state: state.value ? state.value : null
    }
    let result = await listArticleService(params)
    articles.value = result.data.items
    total.value = result.data.total
    for (let i = 0; i < articles.value.length; i++) {
        for (let j = 0; j < categorys.value.length; j++) {
            if (articles.value[i].categoryId === categorys.value[j].id) {
                articles.value[i].categoryName = categorys.value[j].categoryName
            }
        }
    }
}
const addOrUpdateArticle = async (state) => {
    articleModel.value.state = state
    if (title.value === '添加文章') {
        let result = await addArticleService(articleModel.value)
        ElMessage.success(result.message ? result.message : '添加成功')
    } else if (title.value === '修改文章') {
        let result = await updateArticleService(articleModel.value)
        ElMessage.success(result.message ? result.message : '修改成功')
    }
    visibleDrawer.value = false
    articleModel.value.title = ''
    articleModel.value.categoryId = ''
    articleModel.value.coverImg = ''
    articleModel.value.content = ''
    articleModel.value.state = ''
    articleList()
}

//上传图片成功回调
const uploadSuccess = (img) => {
    //img就是后台响应的数据，格式为：{code:状态码，message：提示信息，data: 图片的存储地址}
    articleModel.value.coverImg = img.data
}
const showDialog = (row) => {
    visibleDrawer.value = true
    title.value = "修改文章"
    articleModel.value.title = row.title
    articleModel.value.categoryId = row.categoryId
    articleModel.value.coverImg = row.coverImg
    articleModel.value.content = row.content
    articleModel.value.id = row.id
}
const deleteArticle = async (id) => {
    ElMessageBox.confirm(
        '请再次确认是否删除该文章?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            let result = await deleteArticleService(id)
            ElMessage({
                type: 'success',
                message: result.msg ? result.msg : '删除成功',
            })
            articleList()
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}
categoryList()
articleList()
</script>
<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>文章管理</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true; title = '添加文章'">添加文章</el-button>
                </div>
            </div>
        </template>
        <!-- 搜索表单 -->
        <el-form inline>
            <el-form-item label="文章分类：">
                <el-select placeholder="请选择" v-model="categoryId">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发布状态：">
                <el-select placeholder="请选择" v-model="state">
                    <el-option label="已发布" value="已发布"></el-option>
                    <el-option label="草稿" value="草稿"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="articleList()">搜索</el-button>
                <el-button @click="categoryId = ''; state = ''">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 文章列表 -->
        <el-table :data="articles" style="width: 100%">
            <el-table-column label="文章标题" width="400" prop="title"></el-table-column>
            <el-table-column label="分类" prop="categoryName"></el-table-column>
            <el-table-column label="发表时间" prop="gmtCreate"> </el-table-column>
            <el-table-column label="状态" prop="state"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(row.id)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <!-- 分页条 -->
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="total" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
        <!-- 抽屉 -->
        <el-drawer v-model="visibleDrawer" :title="title" direction="rtl" size="50%">
            <!-- 添加文章表单 -->
            <el-form :model="articleModel" :rules="rules" label-width="100px">
                <el-form-item label="文章标题" prop="title">
                    <el-input v-model="articleModel.title" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item label="文章分类" prop="categoryId">
                    <el-select placeholder="请选择" v-model="articleModel.categoryId">
                        <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="文章封面">
                    <!-- auto-upload:是否自动上传
                    action: 服务器接口路径
                    name: 上传的文件字段名
                    headers: 设置上传的请求头
                    on-success: 上传成功的回调函数 -->
                    <el-upload class="avatar-uploader" :auto-upload="true" :show-file-list="false" action="/api/file"
                        name="file" :headers="{ 'Authorization': tokenStore.token }" :on-success="uploadSuccess">
                        <img v-if="articleModel.coverImg" :src="articleModel.coverImg" class="avatar" />
                        <!-- <img v-else :src="cover" class="avatar" /> -->
                        <el-icon v-else class="avatar-uploader-icon">
                            <PictureFilled />
                        </el-icon>
                    </el-upload>
                </el-form-item>
                <el-form-item label="文章内容" prop="content">
                    <div class="editor">
                        <quill-editor theme="snow" v-model:content="articleModel.content" contentType="html" />
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addOrUpdateArticle('已发布')">发布</el-button>
                    <el-button type="info" @click="addOrUpdateArticle('草稿')">草稿</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </el-card>
</template>
<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
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
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>