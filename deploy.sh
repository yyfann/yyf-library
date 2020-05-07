
# 确保脚本抛出遇到的错误
set -e






# 打包文档, 部署文档到github-pages
npm run docs:build
cd docs/.vuepress/dist
git init
git add -A
git commit -m 'deploy'
git push -f https://${access_token}@github.com/yyfann/blog.git master:gh-pages

cd -