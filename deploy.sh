
# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 在打包好的文档目录中建立个独立的版本库, 并提交
git init
git add -A
git commit -m 'deploy'

# 将文档目录的master分支推送到blog仓库(任意一个仓库都行)的gh-pages分支
# git push -f git@github.com:yyfann/blog.git master:gh-pages

# 如果使用 travis 持续集成
git push -f https://${access_token}@github.com/yyfann/blog.git master:gh-pages

cd -