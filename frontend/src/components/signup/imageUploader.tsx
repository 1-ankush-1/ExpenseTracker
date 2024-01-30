import React from "react";

function ImageUploader({
  selectedImage,
  handleImageChange,
}: {
  selectedImage: string | null;
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="uploaded-usr-img">
      <input
        type="file"
        id="uploadProfilePicture"
        name="picture"
        placeholder="abc"
        title="upload your picture"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
      <img
        src={selectedImage || "/public/images/portfolio_header.jpg"}
        style={{ filter: selectedImage ? "blur(0px)" : "blur(1px)" }}
        alt="Selected"
      />

      {!selectedImage && (
        <div
          className="heading cursor_pointer"
          onClick={() =>
            document.getElementById("uploadProfilePicture")?.click()
          }
        >
          Upload
        </div>
      )}
    </div>
  );
}
export default ImageUploader;
