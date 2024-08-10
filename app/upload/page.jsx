"use client";
import { CldUploadButton, CldImage } from "next-cloudinary";
import { useState } from "react";

const Page = () => {
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className="flex flex-col items-center min-h-screen justify-center gap-4">
      <h2>Uploading Files Using Cloudinary</h2>

      <CldUploadButton
        uploadPreset="InvoicePreset"
        onUpload={(data) => {
          console.log(data);
          setImageUrl(data.info.secure_url);
        }}
        className="bg-green-500 text-white px-4 py-2 rounded hover:shadow-md"
      />

      {imageUrl && (
        <CldImage
          width="960"
          height="600"
          src={imageUrl}
          sizes="100vw"
          alt="Description of my image"
        />
      )}
    </div>
  );
};

export default Page;
