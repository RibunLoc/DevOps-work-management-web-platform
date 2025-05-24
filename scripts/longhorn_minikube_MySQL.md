BƯỚC 1. Sử dụng lệnh sau để tạo StorageClass có tên Longhorn:
```bash
kubectl create -f https://raw.githubusercontent.com/longhorn/longhorn/v1.8.1/examples/storageclass.yaml
```

📁 BƯỚC 2. PVC sử dụng Longhorn
```bash
# mysql-pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: longhorn
  resources:
    requests:
      storage: 2Gi
```

🐬 Bước 3. Deployment MySQL dùng PVC


Bước 4.