# 样式覆盖文件 — 替换说明

## 文件对应关系

| 本包文件 | 替换到项目中的位置 |
|---------|-----------------|
| app/globals.css | penta-price/app/globals.css |
| app/layout.tsx | penta-price/app/layout.tsx |
| app/page.tsx | penta-price/app/page.tsx |
| components/PriceDashboard.tsx | penta-price/components/PriceDashboard.tsx |
| lib/priceData.ts | penta-price/lib/priceData.ts |

## 操作步骤

```bash
# 1. 进入你的项目目录
cd penta-price

# 2. 替换文件（把下载的文件拖进对应位置覆盖）

# 3. 确认 Chart.js 已安装
npm install react-chartjs-2 chart.js

# 4. 重启开发服务器
npm run dev
```

## 每周更新数据

只需修改 `lib/priceData.ts` 里的 `currentWeek` 对象：

1. `weekLabel` 改为本周标识，如 `'Week 16, 2026'`
2. `updatedAt` 改为本周日期
3. `mono.domesticAvg` 等价格字段更新
4. `mono.history12w` — 删除第一个数字，末尾加本周均价
5. `mono.historyLabels` — 同步更新最后一个周次标签
6. `news` 数组更新本周快评

提交一行命令自动部署：
```bash
git add lib/priceData.ts && git commit -m "price: week 16" && git push
```
