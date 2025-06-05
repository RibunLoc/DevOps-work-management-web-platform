#!/bin/bash

# Define services
SERVICES=("api-gateway" "auth-service" "file-service" "task-service" "user-service")

# Loop through each service directory
for SERVICE in "${SERVICES[@]}"; do
  echo "Updating $SERVICE"

  # Path to service package.json
  SERVICE_PKG="./$SERVICE/$SERVICE-package.json"

  # Copy root package.json and package-lock.json into the service folder
  cp ./package.json ./$SERVICE/$SERVICE-package.json
  cp ./package-lock.json ./$SERVICE/$SERVICE-package-lock.json
  echo "Copied root package.json and package-lock.json to $SERVICE"

  # Replace xcopy with cp -r using sed (in-place)
  if [ -f "$SERVICE_PKG" ]; then
    sed -i 's|xcopy src\\\\proto dist\\\\proto /E /I /Y|cp -r src/proto dist/proto|' "$SERVICE_PKG"
    echo "Updated copy:proto script in $SERVICE_PKG"
  else
    echo "$SERVICE_PKG not found!"
  fi
done

echo "All done!"
