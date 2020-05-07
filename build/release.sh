# # 单元测试
# npm run test

# # 构建组件
# npm run lib

# 选择一个版本
VERSION=`npx select-version-cli`

echo "Releasing $VERSION ..."

# 更新版本号, 自动打标签 (之前要先提交一波才行)
git add -A
git commit -m "[build] $VERSION"
npm version $VERSION --message "[release] $VERSION"

git push

npm publish