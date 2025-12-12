import { Box, FileUpload, Icon, Button } from "@chakra-ui/react";
import { LuUpload } from "react-icons/lu";
import { useState } from "react";
import { Client } from "@gradio/client";

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileAccept = (details) => {
    if (details.files.length > 0) {
      setFile(details.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const client = await Client.connect("hamdeen/crop-disease-detection");

      const response = await client.predict("/classify_image", [file]);

      const remediesRes = await fetch("http://localhost:3001/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ disease: response.data[0].prediction }),
      });

      const remediesJson = await remediesRes.json();
      setResult(remediesJson.remedies);

    } catch (error) {
      console.error("Classification failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box className="container" width="2xl">
      <FileUpload.Root
        // maxW="xl"
        alignItems="stretch"
        maxFiles={1}
        onFileAccept={handleFileAccept}
      >
        <FileUpload.HiddenInput />
        <FileUpload.Dropzone>
          <Icon size="md" color="fg.muted">
            <LuUpload />
          </Icon>
          <FileUpload.DropzoneContent>
            <Box>Drag and drop files here</Box>
            <Box color="fg.muted">.png, .jpg up to 5MB</Box>
          </FileUpload.DropzoneContent>
        </FileUpload.Dropzone>
        <FileUpload.List />
      </FileUpload.Root>

      {file && (
        <Button
          mt={4}
          onClick={uploadImage}
          isLoading={uploading}
          disabled={uploading}
        >
          {uploading ? "Analyzing..." : "Detect Disease"}
        </Button>
      )}

      {result && (
        <Box mt={4} p={4} borderWidth={1} borderRadius="md" fontSize="md" fontWeight="extralight">
          {result}
        </Box>
      )}
    </Box>
  );
};

export default UploadImage;
