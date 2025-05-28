package main

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"strings"
)

func ActionYaml(filename string, action string) error {
	var cmd *exec.Cmd

	switch action {
	case "apply":
		cmd = exec.Command("kubectl", "apply", "-f", filename)
	case "delete":
		cmd = exec.Command("kubectl", "delete", "-f", filename)
	default:
		return fmt.Errorf("hành động không hợp lệ: %s", action)
	}

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func main() {
	yamls := []string{
		"./mysql-namespace.yaml",
		"./mysql-secret.yaml",
		"./mysql-pvc.yaml",
		"./mysql-deployment.yaml",
		"./mysql-service.yaml",
	}

	fmt.Println("Nhập hành động bạn muốn thực hiện (apply/delete): ")
	reader := bufio.NewReader(os.Stdin)
	fmt.Print("> ")
	input, _ := reader.ReadString('\n')
	action := strings.TrimSpace(strings.ToLower(input))

	if action != "apply" && action != "delete" {
		fmt.Println("Bạn nhập không hợp lệ. Xin vui lòng nhập 'apply hoặc 'delete'.")
		os.Exit(1)
	}

	if action == "apply" {
		for _, y := range yamls {
			fmt.Printf("file: %s %s... \n", strings.Title(action), y)
			if err := ActionYaml(y, action); err != nil {
				fmt.Printf("Lỗi khi áp dụng file %s %s: %v\n", action, y, err)
				os.Exit(1)
			}
		}
	}
	if action == "delete" {
		for i := len(yamls) - 1; i >= 0; i-- {
			y := yamls[i]
			fmt.Printf("file: %s %s... \n", strings.Title(action), y)
			if err := ActionYaml(y, action); err != nil {
				fmt.Printf("Lỗi khi áp dụng file %s %s: %v\n", action, y, err)
				os.Exit(1)
			}
		}
	}

	fmt.Printf("Tất cả file yaml đã %s thành công.\n", action)
}
