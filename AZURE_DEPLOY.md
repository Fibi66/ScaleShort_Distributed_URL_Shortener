# Azure 部署指南

## 前置条件

- Azure 账号
- Azure CLI 已安装

```bash
# macOS 安装 Azure CLI
brew install azure-cli

# 登录
az login
```

## 部署步骤

### 1. 设置变量

```bash
RESOURCE_GROUP="scaleshort-rg"
LOCATION="eastus"
ACR_NAME="scaleshortacr$(openssl rand -hex 4)"  # 自动生成唯一名称
REDIS_NAME="scaleshort-redis-$(openssl rand -hex 4)"
```

### 2. 创建资源组

```bash
az group create --name $RESOURCE_GROUP --location $LOCATION
```

### 3. 创建 Azure Container Registry

```bash
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic

az acr login --name $ACR_NAME
```

### 4. 构建并推送镜像

```bash
az acr build --registry $ACR_NAME --image scaleshort:latest .
```

### 5. 创建 Azure Cache for Redis

```bash
az redis create \
  --name $REDIS_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Basic \
  --vm-size c0

# 等待创建完成（约 5-10 分钟）
az redis show --name $REDIS_NAME --resource-group $RESOURCE_GROUP --query provisioningState -o tsv
```

获取 Redis 连接信息：

```bash
REDIS_HOST=$(az redis show --name $REDIS_NAME --resource-group $RESOURCE_GROUP --query hostName -o tsv)
REDIS_KEY=$(az redis list-keys --name $REDIS_NAME --resource-group $RESOURCE_GROUP --query primaryKey -o tsv)

echo "Redis Host: $REDIS_HOST"
```

### 6. 创建 Container Apps 环境

```bash
az containerapp env create \
  --name scaleshort-env \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION
```

### 7. 部署应用

```bash
az containerapp create \
  --name scaleshort \
  --resource-group $RESOURCE_GROUP \
  --environment scaleshort-env \
  --image $ACR_NAME.azurecr.io/scaleshort:latest \
  --registry-server $ACR_NAME.azurecr.io \
  --target-port 8080 \
  --ingress external \
  --cpu 0.5 \
  --memory 1.0Gi \
  --min-replicas 1 \
  --max-replicas 3 \
  --env-vars \
    SPRING_DATA_REDIS_HOST=$REDIS_HOST \
    SPRING_DATA_REDIS_PORT=6380 \
    SPRING_DATA_REDIS_PASSWORD=$REDIS_KEY \
    SPRING_DATA_REDIS_SSL_ENABLED=true
```

### 8. 获取访问地址

```bash
APP_URL=$(az containerapp show --name scaleshort --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)
echo "应用地址: https://$APP_URL"
```

## 一键部署脚本

将以下内容保存为 `deploy.sh`，然后运行 `chmod +x deploy.sh && ./deploy.sh`：

```bash
#!/bin/bash
set -e

RESOURCE_GROUP="scaleshort-rg"
LOCATION="eastus"
ACR_NAME="scaleshortacr$(openssl rand -hex 4)"
REDIS_NAME="scaleshort-redis-$(openssl rand -hex 4)"

echo "=== 创建资源组 ==="
az group create --name $RESOURCE_GROUP --location $LOCATION

echo "=== 创建 Container Registry ==="
az acr create --resource-group $RESOURCE_GROUP --name $ACR_NAME --sku Basic
az acr login --name $ACR_NAME

echo "=== 构建镜像 ==="
az acr build --registry $ACR_NAME --image scaleshort:latest .

echo "=== 创建 Redis（需要 5-10 分钟）==="
az redis create \
  --name $REDIS_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Basic \
  --vm-size c0

echo "=== 等待 Redis 就绪 ==="
while [ "$(az redis show --name $REDIS_NAME --resource-group $RESOURCE_GROUP --query provisioningState -o tsv)" != "Succeeded" ]; do
  echo "等待中..."
  sleep 30
done

REDIS_HOST=$(az redis show --name $REDIS_NAME --resource-group $RESOURCE_GROUP --query hostName -o tsv)
REDIS_KEY=$(az redis list-keys --name $REDIS_NAME --resource-group $RESOURCE_GROUP --query primaryKey -o tsv)

echo "=== 创建 Container Apps 环境 ==="
az containerapp env create \
  --name scaleshort-env \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

echo "=== 部署应用 ==="
az containerapp create \
  --name scaleshort \
  --resource-group $RESOURCE_GROUP \
  --environment scaleshort-env \
  --image $ACR_NAME.azurecr.io/scaleshort:latest \
  --registry-server $ACR_NAME.azurecr.io \
  --target-port 8080 \
  --ingress external \
  --cpu 0.5 \
  --memory 1.0Gi \
  --min-replicas 1 \
  --max-replicas 3 \
  --env-vars \
    SPRING_DATA_REDIS_HOST=$REDIS_HOST \
    SPRING_DATA_REDIS_PORT=6380 \
    SPRING_DATA_REDIS_PASSWORD=$REDIS_KEY \
    SPRING_DATA_REDIS_SSL_ENABLED=true

APP_URL=$(az containerapp show --name scaleshort --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)

echo ""
echo "=== 部署完成 ==="
echo "应用地址: https://$APP_URL"
```

## 清理资源

```bash
az group delete --name $RESOURCE_GROUP --yes --no-wait
```

## 费用估算

| 资源 | 规格 | 月费用（约） |
|------|------|-------------|
| Container Apps | 0.5 vCPU, 1GB RAM | $15-30 |
| Azure Cache for Redis | Basic C0 | $16 |
| Container Registry | Basic | $5 |
| **总计** | | **$36-51/月** |

## 常见问题

### 查看日志

```bash
az containerapp logs show --name scaleshort --resource-group $RESOURCE_GROUP --follow
```

### 更新应用

```bash
# 重新构建镜像
az acr build --registry $ACR_NAME --image scaleshort:latest .

# 更新应用
az containerapp update --name scaleshort --resource-group $RESOURCE_GROUP --image $ACR_NAME.azurecr.io/scaleshort:latest
```

### 扩缩容

```bash
az containerapp update --name scaleshort --resource-group $RESOURCE_GROUP --min-replicas 2 --max-replicas 5
```
