import multer from 'multer';

const createStorage = (destination: string) => {
  return multer.diskStorage({
    destination(req, file, callback) {
      callback(null, destination);
    },
    filename(req, file, callback) {
      callback(null, Date.now() + '-' + file.originalname);
    },
  });
};

export const uploadImage = (destination: string) => multer({ storage: createStorage(destination) });

export const uploadImageProduct = uploadImage('public/images/products');
export const uploadImageUser = uploadImage('public/images/users');
