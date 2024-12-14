import { Button, Drawer, Radio } from "antd";
import { DownloadIcon } from "../svg_icons";
import PropTypes from "prop-types";

const FilePreviewModal = ({
  processedFile,
  handleDownload,
  downloadFormat,
  setDownloadFormat,
  isVisible,
  onClose,
}) => {



  const TitleContext = ()=>(
    <div className="flex justify-end gap-x-8">
            <div className="flex items-center gap-x-2">
              <label
                htmlFor="HeadlineAct"
                className="block text-sm font-medium text-gray-900 leading-[23px] tracking-[0.5px]"
              >
                Export As:
              </label>
              <Radio.Group size="large" onChange={(e) => setDownloadFormat(e.target.value)} value={downloadFormat}>
                <Radio value={"pdf"} className="font-normal">PDF</Radio>
                <Radio value={"image"} className="font-normal">IMAGE</Radio>
              </Radio.Group>
            </div>
            <Button type="primary" shape="circle" onClick={handleDownload} icon={<DownloadIcon size={16}/>} />
          </div>
  )



  if (!isVisible) return null;

  return (
    <>
      <Drawer
        title={TitleContext()}
        placement="right"
        size={"large"}
        onClose={onClose}
        open={isVisible}
        extra={null}
      >
        <div className="mt-4">
          {processedFile ? (
            <embed
              src={processedFile}
              width="100%"
              height="500"
              type="application/pdf"
              className="rounded-md border border-gray-300"
            />
          ) : (
            <p className="text-gray-500">No file to preview.</p>
          )}
        </div>
      </Drawer>
    </>
  );
};

export default FilePreviewModal;

FilePreviewModal.propTypes = {
  processedFile: PropTypes.any,
  handleDownload: PropTypes.func,
  downloadFormat: PropTypes.string,
  setDownloadFormat: PropTypes.func,
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
}