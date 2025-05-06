export const handleUploadImage = async (files: File[], setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    const formData = new FormData();
    formData.append("file", files[0]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Lỗi tải ảnh lên Cloudinary");
      const data = await res.json();
      const publicId = data.url.split("/").pop().split(".")[0];
      return { url: data.url, publicId };
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };