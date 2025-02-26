import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { X, Plus, Trash2, FileText } from "lucide-react";


interface MediaUploadProps {
  onFilesChange: (files: File[]) => void;
  isDisabled?:boolean
  accept:string
}

const MediaUpload: React.FC<MediaUploadProps> = ({ onFilesChange,isDisabled,accept }) => {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setMediaFiles([...mediaFiles, ...Array.from(event.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  useEffect(() => {
    onFilesChange(mediaFiles);
  }, [mediaFiles, onFilesChange]);

  return (
    <div className="max-w-3xl mx-auto">
      <label className="flex items-center justify-center mb-4 cursor-pointer bg-[#EDF4FF] h-24 text-gray-500 px-4 py-2 rounded-md shadow hover:bg-blue-200">
        <div className="bg-gray-400 w-5 h-5 flex mr-2 items-center justify-center rounded-full">
          <Plus size={20} color="white" />
        </div>
        Upload Project Media
        <input
          disabled={isDisabled}
          type="file"
          accept={accept}
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {mediaFiles.map((file, index) => {
          const fileURL = URL.createObjectURL(file);
          const isVideo = file.type.startsWith("video");
          const isImage = file.type.startsWith("image");
          const isPDF = file.type === "application/pdf";

          return (
            <Card key={index} className="relative overflow-hidden group p-2">
              <button
                className="absolute top-3 right-4 bg-red-600 text-white rounded-full p-1 transition"
                onClick={() => removeFile(index)}
              >
                <Trash2 size={16} color="white" />
              </button>
              <CardContent className="p-2 flex justify-center items-center">
                {isImage && <img src={fileURL} alt="Uploaded" className="w-full h-40 object-cover" />}
                {isVideo && <video src={fileURL} controls className="w-full h-40 object-cover" />}
                {isPDF && (
                  <div className="flex flex-col items-center text-gray-600">
                    <FileText size={40} />
                    <a href={fileURL} download={file.name} target="_blank" rel="noopener noreferrer" className="text-blue-500 mt-2">
                      {file.name}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MediaUpload;
