import { Form, message, Space, Typography, Upload, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProductImage = ({ initailImage }: { initailImage: any }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [imageUrl, setImageUrl] = useState<string | null>(initailImage);

  const uploadConfig: UploadProps = {
    name: "file",
    multiple: false,
    beforeUpload: (file) => {
      const isJpegorPng =
        file.type === "image/jpeg" || file.type === "image/png";
      if (!isJpegorPng) {
        messageApi.error("You can only upload JPEG/PNG file");
      }
      setImageUrl(URL.createObjectURL(file));
      return false;
    },
  };
  return (
    <Form.Item
      label=""
      name="image"
      rules={[
        {
          required: true,
          message: "Please upload a product image",
        },
      ]}
    >
      <Upload listType="picture-card" {...uploadConfig}>
        {contextHolder}
        {imageUrl ? (
          <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
        ) : (
          <Space direction="vertical">
            <PlusOutlined />
            <Typography.Text>Upload</Typography.Text>
          </Space>
        )}
      </Upload>
    </Form.Item>
  );
};

export default ProductImage;
