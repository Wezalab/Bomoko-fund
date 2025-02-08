import React from "react";
import { Download, FileText, Image as ImageIcon } from "lucide-react";

interface FileAttachmentProps {
  file: {
    name: string;
    url: string;
    type: string;
  };
}

const FileAttachment: React.FC<FileAttachmentProps> = ({ file }) => {
  // Determine icon based on file type
  const getFileIcon = (type: string) => {
    if (type.startsWith("image")) return <ImageIcon className="w-6 h-6 text-blue-500" />;
    return <FileText className="w-6 h-6 text-gray-500" />;
  };

  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg shadow-md w-full min-w-fit">
      {getFileIcon(file.type)}
      <div className="flex-1">
        <p className="text-sm font-medium">{file.name}</p>
        <p className="text-xs text-gray-500">{file.type}</p>
      </div>
      <a
        href={file.url}
        download
        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        <Download className="w-5 h-5" />
      </a>
    </div>
  );
};

export default FileAttachment;