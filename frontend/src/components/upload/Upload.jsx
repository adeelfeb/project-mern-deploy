import React, { useState, useEffect, useRef } from "react";
import { IKContext, IKUpload } from "imagekitio-react";
import conf from "../../conf/conf";
import { useDispatch } from "react-redux";
import { useImage } from "../../contexts/ImageContext";
import { FaFileUpload } from "react-icons/fa";
import uploadService from "../../AserverAuth/serviceUpload";
import { setFileUploadSuccess, setFileUploadError } from "../../store/fileSlice";


const urlEndpoint = conf.imageKitEndpoint;
const publicKey = conf.imageKitPublicKey;

const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/upload");
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

function Upload() {
  const { setImage, setFileName, messageSent, resetMessageStatus } = useImage();
  const [isLoading, setIsLoading] = useState(false);
  
  const [isError, setIsError] = useState(false);
  const originalFileNameRef = useRef("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (messageSent) {
      setFileName("");
      originalFileNameRef.current = "";
      resetMessageStatus();
    }
  }, [messageSent, resetMessageStatus]);

  const onError = (err) => {
    setIsLoading(false);
    setIsError(true);
    
    console.error("Upload Error:", err);

    // Set error flag in Redux store
    dispatch(setFileUploadError(true));
  };

  const onSuccess = async (res) => {
    if (!res.url) {
      onError(new Error("File URL is missing from the response."));
      return;
    }

    try {
      const uploadData = {
        fileUrl: res.url,
        fileName: originalFileNameRef.current,
      };

      const serverResponse = await uploadService.addFileData(uploadData);
      const idForFile = serverResponse?.data?._id;

      const fileData = {
        fileId: idForFile,
        fileUrl: serverResponse.data.fileUrl,
        fileName: serverResponse.data.fileName,
      };

      dispatch(setFileUploadSuccess());
      // dispatch(setFileUploadError(true)); // Set error


      setImage((prev) => ({
        ...prev,
        isLoading: false,
      }));

      setIsLoading(false);

      // Reset error flag in Redux store
      dispatch(setFileUploadError(false));

      
      setIsError(false);
    } catch (error) {
      onError(error);
    }
  };

  const handleUploadStart = (file) => {
    setIsLoading(true);
    
    if (file) {
      originalFileNameRef.current = file.target.files[0].name;
    }
  };

  return (
    <div>
      
      <IKContext
        urlEndpoint={urlEndpoint}
        publicKey={publicKey}
        authenticator={authenticator}
      >
        {isLoading ? (
          <div className="text-black px-2 flex flex-row">Uploading, please wait...</div>
        ) : (
          <div className="flex flex-row items-center">
            <label className="cursor-pointer flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-300">
              <FaFileUpload className="w-6 h-6 text-black" />
              <IKUpload
                className="hidden"
                onError={onError}
                onSuccess={onSuccess}
                useUniqueFileName={true}
                onUploadStart={(file) => handleUploadStart(file)}
              />
            </label>
          </div>
        )}
      </IKContext>
    </div>
  );
}

export default Upload;
