export default async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "SocialPetPressets"); // Đặt trong Cloudinary Dashboard
  
    const response = await fetch("https://api.cloudinary.com/v1_1/dh6brjozr/image/upload", {
      method: "POST",
      body: formData,
    });
  
    if (!response.ok) throw new Error("Upload ảnh thất bại!");
    const result = await response.json();
    return result.secure_url; // Link ảnh được upload
  }
  