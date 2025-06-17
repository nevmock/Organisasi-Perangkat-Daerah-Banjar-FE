// 'use client';
// import { useState } from 'react';
// import { Card, Button } from 'react-bootstrap';
// import { Modal } from 'react-bootstrap';

// const FilePreviewCard = ({ file, onRemove }) => {
//   const [showPreview, setShowPreview] = useState(false);

//   const getFileIcon = () => {
//     if (file.type.includes('pdf')) {
//       return <i className="fas fa-file-pdf text-danger fs-3"></i>;
//     } else if (file.type.includes('image')) {
//       return <i className="fas fa-file-image text-primary fs-3"></i>;
//     }
//     return <i className="fas fa-file-alt fs-3"></i>;
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
//   };

//   return (
//     <>
//       <Card
//         className="shadow-sm"
//         style={{ width: '120px', cursor: 'pointer' }}
//         onClick={() => setShowPreview(true)}
//       >
//         <Card.Body className="text-center p-2">
//           {getFileIcon()}
//           <div className="text-truncate small mt-1" title={file.name}>
//             {file.name}
//           </div>
//           <div className="text-muted xsmall">{formatFileSize(file.size)}</div>
//         </Card.Body>
//       </Card>

//       {/* Preview Modal */}
//       <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Preview: {file.name}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="text-center">
//           {file.type.includes('pdf') ? (
//             <embed
//               src={file.url}
//               type="application/pdf"
//               width="100%"
//               height="500px"
//             />
//           ) : file.type.includes('image') ? (
//             <img
//               src={file.url}
//               alt={file.name}
//               style={{ maxWidth: '100%', maxHeight: '500px' }}
//             />
//           ) : (
//             <p>Preview tidak tersedia untuk tipe file ini</p>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowPreview(false)}>
//             Tutup
//           </Button>
//           <Button variant="danger" onClick={onRemove}>
//             Hapus File
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default FilePreviewCard;

// 'use client';
// import { useState } from 'react';
// import { Card, Button } from 'react-bootstrap';
// import { Modal } from 'react-bootstrap';

// const FilePreviewCard = ({ file, onRemove }) => {
//   const [showPreview, setShowPreview] = useState(false);

//   // Determine if the file is a File object or a string path
//   const isFileObject = typeof file === 'object' && file !== null;
//   const isStringPath = typeof file === 'string';

//   // Extract file information based on input type
//   const getFileInfo = () => {
//     if (isFileObject) {
//       return {
//         name: file.name,
//         size: file.size,
//         type: file.type,
//         url: file.url || URL.createObjectURL(file),
//         isExisting: file.isExisting || false,
//       };
//     } else if (isStringPath) {
//       const fileName = file.split('/').pop();
//       const fileExtension = fileName.split('.').pop().toLowerCase();
//       const previewUrl = `http://localhost:5050/public${file}`;

//       return {
//         name: fileName,
//         size: 0, // Unknown size for string paths
//         type: getMimeType(fileExtension),
//         url: previewUrl,
//         originalPath: file,
//         isExisting: true,
//       };
//     }
//     return {
//       name: 'Unknown file',
//       size: 0,
//       type: 'application/octet-stream',
//       url: '#',
//       isExisting: false,
//     };
//   };

//   const fileInfo = getFileInfo();

//   const getMimeType = (extension) => {
//     const mimeTypes = {
//       jpg: 'image/jpeg',
//       jpeg: 'image/jpeg',
//       png: 'image/png',
//       gif: 'image/gif',
//       pdf: 'application/pdf',
//       // Add more as needed
//     };
//     return mimeTypes[extension] || 'application/octet-stream';
//   };

//   const getFileIcon = () => {
//     if (fileInfo.type.includes('pdf')) {
//       return <i className="fas fa-file-pdf text-danger fs-3"></i>;
//     } else if (fileInfo.type.includes('image')) {
//       return <i className="fas fa-file-image text-primary fs-3"></i>;
//     }
//     return <i className="fas fa-file-alt fs-3"></i>;
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return 'Existing file';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
//   };

//   const handleRemove = () => {
//     if (onRemove) {
//       // Pass the original path for string files, or the file object for uploads
//       onRemove(isStringPath ? fileInfo.originalPath : file);
//     }
//   };

//   return (
//     <>
//       <Card
//         className="shadow-sm"
//         style={{ width: '120px', cursor: 'pointer' }}
//         onClick={() => setShowPreview(true)}
//       >
//         <Card.Body className="text-center p-2">
//           {getFileIcon()}
//           <div className="text-truncate small mt-1" title={fileInfo.name}>
//             {fileInfo.name}
//           </div>
//           <div className="text-muted xsmall">
//             {formatFileSize(fileInfo.size)}
//             {fileInfo.isExisting && <span className="ms-1">(Server)</span>}
//           </div>
//         </Card.Body>
//       </Card>

//       {/* Preview Modal */}
//       <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Preview: {fileInfo.name}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="text-center">
//           {fileInfo.type.includes('pdf') ? (
//             <embed
//               src={fileInfo.url}
//               type="application/pdf"
//               width="100%"
//               height="500px"
//             />
//           ) : fileInfo.type.includes('image') ? (
//             <img
//               src={fileInfo.url}
//               alt={fileInfo.name}
//               style={{ maxWidth: '100%', maxHeight: '500px' }}
//               onError={(e) => {
//                 e.target.onerror = null;
//                 e.target.src = '/image-not-found.png';
//               }}
//             />
//           ) : (
//             <p>Preview tidak tersedia untuk tipe file ini</p>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowPreview(false)}>
//             Tutup
//           </Button>
//           <Button variant="danger" onClick={handleRemove}>
//             Hapus File
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default FilePreviewCard;

'use client';
import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';

// Move this outside the component to make it available immediately
const getMimeType = (extension) => {
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    pdf: 'application/pdf',
    // Add more as needed
  };
  return mimeTypes[extension] || 'application/octet-stream';
};

const FilePreviewCard = ({ file, onRemove }) => {
  const [showPreview, setShowPreview] = useState(false);

  // Determine if the file is a File object or a string path
  const isFileObject = typeof file === 'object' && file !== null;
  const isStringPath = typeof file === 'string';

  // Extract file information based on input type
  // const getFileInfo = () => {
  //   if (isFileObject) {
  //     return {
  //       name: file.name,
  //       size: file.size,
  //       type: file.type,
  //       url: file.url || URL.createObjectURL(file),
  //       isExisting: file.isExisting || false,
  //     };
  //   } else if (isStringPath) {
  //     const fileName = file.split('/').pop();
  //     const fileExtension = fileName.split('.').pop().toLowerCase();

  //     // Handle both relative and absolute paths
  //     let previewUrl;
  //     if (file.startsWith('http') || file.startsWith('/')) {
  //       previewUrl = file;
  //     } else {
  //       previewUrl = `http://localhost:5050/public/${
  //         file.startsWith('/') ? file.substring(1) : file
  //       }`;
  //     }

  //     return {
  //       name: fileName,
  //       size: 0, // Unknown size for string paths
  //       type: getMimeType(fileExtension),
  //       url: previewUrl,
  //       originalPath: file,
  //       isExisting: true,
  //     };
  //   }
  //   return {
  //     name: 'Unknown file',
  //     size: 0,
  //     type: 'application/octet-stream',
  //     url: '#',
  //     isExisting: false,
  //   };
  // };

  const getFileInfo = () => {
    if (isFileObject) {
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        url: file.url || URL.createObjectURL(file),
        isExisting: file.isExisting || false,
      };
    } else if (isStringPath) {
      const fileName = file.split('/').pop();
      const fileExtension = fileName.split('.').pop().toLowerCase();

      // Handle different path formats
      let previewUrl;
      if (file.startsWith('http')) {
        previewUrl = file;
      } else if (file.startsWith('/')) {
        previewUrl = `http://localhost:5050/public/${file}`;
      } else {
        previewUrl = `http://localhost:5050/public/${file}`;
      }

      return {
        name: fileName,
        size: 0,
        type: getMimeType(fileExtension),
        url: previewUrl,
        originalPath: file,
        isExisting: true,
      };
    }
    return {
      name: 'Unknown file',
      size: 0,
      type: 'application/octet-stream',
      url: '#',
      isExisting: false,
    };
  };

  const fileInfo = getFileInfo();

  const getFileIcon = () => {
    if (fileInfo.type.includes('pdf')) {
      return <i className="fas fa-file-pdf text-danger fs-3"></i>;
    } else if (fileInfo.type.includes('image')) {
      return <i className="fas fa-file-image text-primary fs-3"></i>;
    }
    return <i className="fas fa-file-alt fs-3"></i>;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
  };

  const handleRemove = () => {
    if (onRemove) {
      // Pass the original path for string files, or the file object for uploads
      onRemove(isStringPath ? fileInfo.originalPath : file);
    }
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
          <div className="text-truncate small mt-1" title={fileInfo.name}>
            {fileInfo.name}
          </div>
          <div className="text-muted xsmall">
            {formatFileSize(fileInfo.size)}
            {fileInfo.isExisting && <span className="ms-1">(Server)</span>}
          </div>
        </Card.Body>
      </Card>

      {/* Preview Modal */}
      <Modal show={showPreview} onHide={() => setShowPreview(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Preview: {fileInfo.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {fileInfo.type.includes('pdf') ? (
            <embed
              src={fileInfo.url}
              type="application/pdf"
              width="100%"
              height="500px"
            />
          ) : fileInfo.type.includes('image') ? (
            <img
              src={fileInfo.url}
              alt={fileInfo.name}
              style={{ maxWidth: '100%', maxHeight: '500px' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
              }}
            />
          ) : (
            <p>Preview tidak tersedia untuk tipe file ini</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Tutup
          </Button>
          <Button variant="danger" onClick={handleRemove}>
            Hapus File
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FilePreviewCard;
