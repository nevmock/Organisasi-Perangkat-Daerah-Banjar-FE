'use client';
import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';

const FilePreviewCard = ({ file, onRemove }) => {
  const [showPreview, setShowPreview] = useState(false);

  const getFileIcon = () => {
    if (file.type.includes('pdf')) {
      return <i className="fas fa-file-pdf text-danger fs-3"></i>;
    } else if (file.type.includes('image')) {
      return <i className="fas fa-file-image text-primary fs-3"></i>;
    }
    return <i className="fas fa-file-alt fs-3"></i>;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
  };

  return (
    <>
      <Card
        className="shadow-sm"
        style={{ width: '120px', cursor: 'pointer' }}
        onClick={() => setShowPreview(true)}
      >
        <Card.Body className="text-center p-2">
          {getFileIcon()}
          <div className="text-truncate small mt-1" title={file.name}>
            {file.name}
          </div>
          <div className="text-muted xsmall">{formatFileSize(file.size)}</div>
        </Card.Body>
      </Card>

      {/* Preview Modal */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Preview: {file.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {file.type.includes('pdf') ? (
            <embed
              src={file.url}
              type="application/pdf"
              width="100%"
              height="500px"
            />
          ) : file.type.includes('image') ? (
            <img
              src={file.url}
              alt={file.name}
              style={{ maxWidth: '100%', maxHeight: '500px' }}
            />
          ) : (
            <p>Preview tidak tersedia untuk tipe file ini</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Tutup
          </Button>
          <Button variant="danger" onClick={onRemove}>
            Hapus File
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FilePreviewCard;
