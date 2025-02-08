import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { X,Plus,Trash2 } from "lucide-react";

const MediaUpload: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setMediaFiles([...mediaFiles, ...Array.from(event.target.files)]);
    }
  };

  const removeFile = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <label className="flex items-center justify-center  mb-4 cursor-pointer bg-[#EDF4FF] h-24  text-gray-500 px-4 py-2 rounded-md shadow hover:bg-blue-200">
        <div className="bg-gray-400 w-5 h-5 flex mr-2 items-center justify-center rounded-full">
          <Plus size={20} color="white" />
        </div>
        
        Upload Project Media
        <input
          type="file"
          accept="image/*,video/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        {mediaFiles.map((file, index) => {
          const fileURL = URL.createObjectURL(file);
          const isVideo = file.type.startsWith("video");
          
          return (
            <Card key={index} className="relative overflow-hidden group">
              <button
                className="absolute top-3 right-4 bg-red-600 text-white rounded-full p-1  transition"
                onClick={() => removeFile(index)}
              >
                <Trash2 size={16} color="white"/>
              </button>
              <CardContent className="p-2">
                {isVideo ? (
                  <video src={fileURL} controls className="w-full h-40 object-cover" />
                ) : (
                  <img src={fileURL} alt="Media" className="w-full h-40 object-cover" />
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
